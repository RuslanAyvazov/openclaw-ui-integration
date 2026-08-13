import os
import re
import shutil
import tempfile
from datetime import datetime, timezone as datetime_timezone
from pathlib import Path, PurePosixPath
from urllib.parse import quote

from django.conf import settings
from django.utils import timezone

from studio.models import RepositoryState


MAX_FILES_PER_BRANCH = 2000
MAX_FILE_BYTES = 8 * 1024 * 1024
MAX_BRANCH_BYTES = 80 * 1024 * 1024
BRANCH_NAME = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._/-]{0,159}$")


def _repo_root(datamart):
    return settings.REPOSITORIES_ROOT / str(datamart.created_by_id) / "datamarts" / str(datamart.id)


def _branches_root(datamart):
    return _repo_root(datamart) / "branches"


def _branch_dir(datamart, branch_name):
    return _branches_root(datamart) / quote(branch_name, safe="")


def _safe_relative_path(value):
    text = str(value or "").replace("\\", "/").lstrip("/")
    path = PurePosixPath(text)
    if not text or any(part in {"", ".", ".."} for part in path.parts):
        raise ValueError(f"Некорректный путь файла: {value}")
    return path


def _assert_scoped(path, root):
    resolved = Path(path).resolve()
    root_resolved = Path(root).resolve()
    if resolved != root_resolved and root_resolved not in resolved.parents:
        raise ValueError("Путь вышел за границы пользовательского репозитория.")


def _default_state(datamart):
    author = datamart.created_by.public_name
    now = timezone.now().isoformat()
    return {
        "version": 1,
        "activeBranch": "main",
        "branchesMeta": {
            "main": {"baseBranch": None, "createdAt": now, "author": author},
        },
        "pullRequests": [],
        "commits": [
            {
                "hash": "initial",
                "message": "chore: init repository (etl/ + resources/)",
                "author": author,
                "initials": "".join(part[0] for part in author.split()[:2]).upper(),
                "time": "только что",
                "additions": 0,
                "deletions": 0,
                "changedFiles": 0,
                "branch": "main",
            }
        ],
    }


def _get_state(datamart):
    defaults = _default_state(datamart)
    state, created = RepositoryState.objects.get_or_create(
        datamart=datamart,
        defaults={
            "version": defaults["version"],
            "active_branch": defaults["activeBranch"],
            "branches_meta": defaults["branchesMeta"],
            "pull_requests": defaults["pullRequests"],
            "commits": defaults["commits"],
        },
    )
    if created:
        _ensure_branch_skeleton(datamart, "main")
    return state


def _ensure_branch_skeleton(datamart, branch_name):
    branch_dir = _branch_dir(datamart, branch_name)
    (branch_dir / "etl").mkdir(parents=True, exist_ok=True)
    (branch_dir / "resources").mkdir(parents=True, exist_ok=True)


def _read_branch_with_metadata(datamart, branch_name):
    branch_dir = _branch_dir(datamart, branch_name)
    _ensure_branch_skeleton(datamart, branch_name)
    contents = {}
    file_updated_at = {}
    for file_path in sorted(branch_dir.rglob("*"), key=lambda item: item.as_posix()):
        if not file_path.is_file():
            continue
        relative = file_path.relative_to(branch_dir).as_posix()
        contents[relative] = file_path.read_text(encoding="utf-8")
        file_updated_at[relative] = datetime.fromtimestamp(
            file_path.stat().st_mtime,
            tz=datetime_timezone.utc,
        ).isoformat()
    return contents, file_updated_at


def _read_branch(datamart, branch_name):
    contents, _ = _read_branch_with_metadata(datamart, branch_name)
    return contents


def _tree_for(datamart, contents):
    root = {
        "repo": f"{datamart.created_by.username}/{datamart.name}",
        "name": datamart.name,
        "type": "folder",
        "children": [
            {"name": "etl", "type": "folder", "children": []},
            {"name": "resources", "type": "folder", "children": []},
        ],
    }

    def folder(parent, name):
        current = next((item for item in parent["children"] if item["type"] == "folder" and item["name"] == name), None)
        if current is None:
            current = {"name": name, "type": "folder", "children": []}
            parent["children"].append(current)
        return current

    for raw_path in sorted(contents):
        path = _safe_relative_path(raw_path)
        if path.name == "__designer_flow.json":
            continue
        current = root
        for part in path.parts[:-1]:
            current = folder(current, part)
        current["children"].append({"name": path.name, "type": "file"})

    def sort_tree(node):
        children = node.get("children")
        if children is None:
            return
        children.sort(key=lambda item: (item["type"] != "folder", item["name"].casefold()))
        for child in children:
            sort_tree(child)

    sort_tree(root)
    return root


def serialize_repository(datamart):
    state = _get_state(datamart)
    branches_meta = state.branches_meta or {"main": _default_state(datamart)["branchesMeta"]["main"]}
    branches = {}
    for name in sorted(branches_meta, key=lambda value: (value != "main", value.casefold())):
        contents, file_updated_at = _read_branch_with_metadata(datamart, name)
        branches[name] = {
            "structure": _tree_for(datamart, contents),
            "contents": contents,
            "fileUpdatedAt": file_updated_at,
            **(branches_meta.get(name) or {}),
        }
    active = state.active_branch if state.active_branch in branches else "main"
    return {
        "version": state.version,
        "branches": branches,
        "activeBranch": active,
        "pullRequests": state.pull_requests or [],
        "commits": state.commits or [],
    }


def export_branch(datamart, branch_name="main"):
    """Возвращает файлы одной ветки без сериализации остальных веток."""
    state = _get_state(datamart)
    branches_meta = state.branches_meta or {}
    if branch_name not in branches_meta:
        raise ValueError(f"Ветка {branch_name} не найдена.")
    return {
        "branch": branch_name,
        "contents": _read_branch(datamart, branch_name),
        **(branches_meta.get(branch_name) or {}),
    }


def _write_branch(datamart, branch_name, contents):
    if not isinstance(contents, dict):
        raise ValueError(f"Содержимое ветки {branch_name} должно быть объектом.")
    if len(contents) > MAX_FILES_PER_BRANCH:
        raise ValueError(f"В ветке {branch_name} слишком много файлов.")

    branches_root = _branches_root(datamart)
    branches_root.mkdir(parents=True, exist_ok=True)
    target = _branch_dir(datamart, branch_name)
    _assert_scoped(target, branches_root)
    temp_root = Path(tempfile.mkdtemp(prefix="repo-", dir=branches_root))
    total = 0
    try:
        (temp_root / "etl").mkdir(parents=True, exist_ok=True)
        (temp_root / "resources").mkdir(parents=True, exist_ok=True)
        for raw_path, raw_content in sorted(contents.items()):
            relative = _safe_relative_path(raw_path)
            content = str(raw_content if raw_content is not None else "")
            encoded = content.encode("utf-8")
            if len(encoded) > MAX_FILE_BYTES:
                raise ValueError(f"Файл {raw_path} превышает 8 МБ.")
            total += len(encoded)
            if total > MAX_BRANCH_BYTES:
                raise ValueError(f"Содержимое ветки {branch_name} превышает 80 МБ.")
            destination = temp_root.joinpath(*relative.parts)
            _assert_scoped(destination, temp_root)
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_text(content, encoding="utf-8", newline="\n")
            previous_file = target.joinpath(*relative.parts)
            if previous_file.is_file() and previous_file.read_bytes() == encoded:
                previous_stat = previous_file.stat()
                os.utime(destination, ns=(previous_stat.st_atime_ns, previous_stat.st_mtime_ns))
        if target.exists():
            shutil.rmtree(target)
        os.replace(temp_root, target)
    except Exception:
        if temp_root.exists():
            shutil.rmtree(temp_root)
        raise


def save_repository(datamart, payload):
    branches = payload.get("branches")
    if not isinstance(branches, dict) or "main" not in branches:
        raise ValueError("Репозиторий должен содержать ветку main.")

    state = _get_state(datamart)
    previous_names = set((state.branches_meta or {}).keys())
    branches_meta = {}
    for branch_name, branch in branches.items():
        if not isinstance(branch_name, str) or not branch_name.strip() or len(branch_name) > 160:
            raise ValueError("Некорректное имя ветки.")
        if any(ord(char) < 32 for char in branch_name):
            raise ValueError("Имя ветки содержит служебные символы.")
        branch = branch or {}
        _write_branch(datamart, branch_name, branch.get("contents") or {})
        branches_meta[branch_name] = {
            "baseBranch": branch.get("baseBranch"),
            "createdAt": branch.get("createdAt") or timezone.now().isoformat(),
            "author": branch.get("author") or datamart.created_by.public_name,
        }

    for stale_name in previous_names - set(branches_meta):
        stale_dir = _branch_dir(datamart, stale_name)
        _assert_scoped(stale_dir, _branches_root(datamart))
        if stale_dir.exists():
            shutil.rmtree(stale_dir)

    active = payload.get("activeBranch") if payload.get("activeBranch") in branches_meta else "main"
    state.version = int(payload.get("version") or state.version or 1)
    state.active_branch = active
    state.branches_meta = branches_meta
    state.pull_requests = payload.get("pullRequests") if isinstance(payload.get("pullRequests"), list) else []
    state.commits = payload.get("commits") if isinstance(payload.get("commits"), list) else []
    state.save()
    return serialize_repository(datamart)


def create_agent_branch(datamart, branch_name, base_branch, contents, author):
    """Создаёт новую ветку агента из готового набора файлов, не меняя main."""
    branch_name = str(branch_name or "").strip()
    base_branch = str(base_branch or "main").strip()
    if not BRANCH_NAME.fullmatch(branch_name) or ".." in branch_name.split("/"):
        raise ValueError("Некорректное имя ветки агента.")

    state = _get_state(datamart)
    branches_meta = dict(state.branches_meta or {})
    if base_branch not in branches_meta:
        raise ValueError(f"Исходная ветка {base_branch} не найдена.")
    if branch_name in branches_meta:
        raise ValueError(f"Ветка {branch_name} уже существует.")

    _write_branch(datamart, branch_name, contents)
    now = timezone.now().isoformat()
    branches_meta[branch_name] = {
        "baseBranch": base_branch,
        "createdAt": now,
        "author": str(author or datamart.created_by.public_name),
    }
    commits = list(state.commits or [])
    commits.insert(0, {
        "hash": f"agent-{timezone.now().strftime('%Y%m%d%H%M%S%f')}",
        "message": "feat: add streams from S2T",
        "author": str(author or datamart.created_by.public_name),
        "initials": "AI",
        "time": "только что",
        "additions": len(contents),
        "deletions": 0,
        "changedFiles": len(contents),
        "branch": branch_name,
    })
    state.branches_meta = branches_meta
    state.commits = commits
    state.active_branch = branch_name
    state.save(update_fields=["branches_meta", "commits", "active_branch", "updated_at"])
    return {
        "datamartId": datamart.id,
        "branch": branch_name,
        "baseBranch": base_branch,
        "fileCount": len(contents),
    }


def reset_repository(datamart):
    root = _repo_root(datamart)
    _assert_scoped(root, settings.REPOSITORIES_ROOT)
    if root.exists():
        shutil.rmtree(root)
    RepositoryState.objects.filter(datamart=datamart).delete()
    return serialize_repository(datamart)


def delete_repository(datamart):
    root = _repo_root(datamart)
    _assert_scoped(root, settings.REPOSITORIES_ROOT)
    if root.exists():
        shutil.rmtree(root)
