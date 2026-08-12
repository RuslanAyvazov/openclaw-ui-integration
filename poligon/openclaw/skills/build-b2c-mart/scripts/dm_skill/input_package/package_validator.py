import json
from pathlib import Path

from .errors import (
    CONTEXT_READ_FAILED,
    DML_FILE_MISSING,
    DML_PATH_MISSING,
    DML_READ_FAILED,
    DML_ROOT_INVALID,
    SCRIPT_UNKNOWN,
    S2T_FILE_MISSING,
    STREAM_DUPLICATE,
    STREAM_UNKNOWN,
    STREAM_VALUE_INVALID,
    TABLE_NAME_INVALID,
    TABLES_MISSING,
    InputPackageError,
)


REQUIRED_SCRIPTS = {
    "iceberg": ("DML_inc.sql", "DML_arc.sql"),
    "parquet": ("DML_inc.sql",),
}
KNOWN_SCRIPTS = {"DML_inc.sql", "DML_arc.sql"}


def missing_document_errors(s2t_path, dml_path):
    """Проверяет наличие S2T и файла с SQL-прототипами."""
    errors = []
    if not Path(s2t_path).is_file():
        errors.append(S2T_FILE_MISSING.format(path=s2t_path))
    if not dml_path:
        errors.append(DML_PATH_MISSING)
    elif not Path(dml_path).is_file():
        errors.append(DML_FILE_MISSING.format(path=dml_path))
    return errors


def read_expected_streams(context_path):
    """Читает из validator перечень таблиц в детерминированном порядке."""
    try:
        context = json.loads(Path(context_path).read_text(encoding="utf-8"))
    except Exception as error:
        raise InputPackageError(
            CONTEXT_READ_FAILED.format(reason=error)
        ) from error
    tables = context.get("validator", {}).get("tables")
    if not isinstance(tables, list) or not tables:
        raise InputPackageError(TABLES_MISSING)

    streams = []
    for index, table in enumerate(tables):
        pa_name = (
            table.get("pa_table", {}).get("name")
            if isinstance(table, dict)
            else None
        )
        if not isinstance(pa_name, str) or "." not in pa_name:
            raise InputPackageError(
                TABLE_NAME_INVALID.format(index=index)
            )
        streams.append(pa_name.rsplit(".", 1)[1].strip())
    return streams


def read_prototypes(dml_path):
    """Читает JSON с SQL-прототипами или возвращает ошибку документа."""
    if not dml_path:
        return None, [DML_PATH_MISSING]
    path = Path(dml_path)
    if not path.is_file():
        return None, [DML_FILE_MISSING.format(path=path)]
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except Exception as error:
        return None, [DML_READ_FAILED.format(reason=error)]
    if not isinstance(payload, dict):
        return None, [DML_ROOT_INVALID]
    return payload, []


def validate_prototype_package(context_path, dml_path, storage):
    """Проверяет число и состав SQL-прототипов для всех таблиц S2T."""
    streams = read_expected_streams(context_path)
    required = REQUIRED_SCRIPTS[storage]
    expected_count = len(streams) * len(required)
    payload, errors = read_prototypes(dml_path)
    provided_count = 0
    missing = []

    expected = {stream.casefold(): stream for stream in streams}
    provided = {}
    if payload is not None:
        for input_stream, scripts in payload.items():
            normalized = str(input_stream).strip().casefold()
            if normalized not in expected:
                errors.append(STREAM_UNKNOWN.format(stream=input_stream))
                continue
            if normalized in provided:
                errors.append(STREAM_DUPLICATE.format(stream=input_stream))
                continue
            provided[normalized] = scripts

        for normalized, stream in expected.items():
            scripts = provided.get(normalized)
            if scripts is None:
                missing.extend(f"{stream}/{script}" for script in required)
                continue
            if not isinstance(scripts, dict):
                errors.append(STREAM_VALUE_INVALID.format(stream=stream))
                missing.extend(f"{stream}/{script}" for script in required)
                continue
            for script in required:
                value = scripts.get(script)
                if isinstance(value, str) and value.strip():
                    provided_count += 1
                else:
                    missing.append(f"{stream}/{script}")
            for script in scripts:
                if script not in KNOWN_SCRIPTS:
                    errors.append(
                        SCRIPT_UNKNOWN.format(stream=stream, script=script)
                    )
    else:
        missing = [
            f"{stream}/{script}"
            for stream in streams
            for script in required
        ]

    if provided_count != expected_count:
        errors.insert(
            0,
            (
                f"Для {len(streams)} таблиц в S2T и формата {storage} "
                f"передано SQL-прототипов: {provided_count} из "
                f"{expected_count}."
            ),
        )
    if missing:
        errors.append("Не хватает: " + ", ".join(missing) + ".")
    if errors:
        raise InputPackageError(errors)

    return {
        "table_count": len(streams),
        "provided_count": provided_count,
        "expected_count": expected_count,
    }
