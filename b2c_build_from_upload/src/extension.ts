import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { homedir } from "node:os";
import path from "node:path";
import {
  mkdir,
  readFile,
  readdir,
  realpath,
  stat,
  writeFile,
} from "node:fs/promises";


const UPLOAD_PATH = /^uploads\/package-[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/;
const MAX_REPOSITORY_FILES = 2_000;
const MAX_REPOSITORY_BYTES = 80 * 1024 * 1024;

export type ToolConfig = {
  skillRoot?: string;
  backendBaseUrl?: string;
  controlTokenFile?: string;
  timeoutSeconds?: number;
};

export type RuntimeContext = {
  workspaceDir?: string;
  agentId?: string;
};

export type UpdateRequest = {
  workspace: string;
  datamart: string;
  branch?: string;
  uploadPath: string;
  storage?: "iceberg" | "parquet";
};

type RepositoryExport = {
  workspace: { id: number; name: string; slug: string };
  datamart: { id: number; name: string; displayName: string };
  branch: string;
  contents: Record<string, string>;
};

export class B2cToolError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "B2cToolError";
    this.code = code;
  }
}

function defaultSkillRoot(): string {
  const stateDir = process.env.OPENCLAW_STATE_DIR?.trim();
  return path.join(stateDir || path.join(homedir(), ".openclaw"), "skills", "build-b2c-mart");
}

function assertDescendant(root: string, candidate: string, label: string): void {
  const relative = path.relative(root, candidate);
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new B2cToolError("PATH_OUTSIDE_WORKSPACE", `${label} находится вне workspace агента.`);
  }
}

function normalizedRelativePath(value: string): string {
  const normalized = String(value || "").replaceAll("\\", "/").replace(/^\/+/, "");
  const parts = normalized.split("/");
  if (!normalized || parts.some((part) => !part || part === "." || part === "..")) {
    throw new B2cToolError("INVALID_REPOSITORY_PATH", `Некорректный путь репозитория: ${value}`);
  }
  return parts.join("/");
}

async function controlToken(config: ToolConfig): Promise<string> {
  const tokenFile = config.controlTokenFile?.trim()
    || process.env.OPENCLAW_CONTROL_TOKEN_FILE
    || "/run/openclaw-control/token";
  const token = (await readFile(tokenFile, "utf8").catch(() => "")).trim();
  if (!token) {
    throw new B2cToolError("CONTROL_TOKEN_MISSING", "Внутренний токен OpenClaw не найден.");
  }
  return token;
}

async function backendRequest<T>(
  config: ToolConfig,
  route: string,
  body: Record<string, unknown>,
  timeoutMs = 120_000,
): Promise<T> {
  const baseUrl = config.backendBaseUrl?.trim() || "http://backend:8000";
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}${route}`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${await controlToken(config)}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs),
  });
  const payload = await response.json().catch(() => ({})) as Record<string, unknown>;
  if (!response.ok) {
    throw new B2cToolError(
      "BACKEND_REQUEST_FAILED",
      String(payload.error || `Backend ответил ${response.status}.`),
    );
  }
  return payload as T;
}

export async function listAccessibleDatamarts(
  config: ToolConfig,
  runtime: RuntimeContext,
): Promise<Record<string, unknown>> {
  if (!runtime.agentId) {
    throw new B2cToolError("AGENT_CONTEXT_MISSING", "OpenClaw не передал agentId.");
  }
  return backendRequest<Record<string, unknown>>(
    config,
    "/api/internal/openclaw/catalog",
    { agentId: runtime.agentId },
  );
}

async function writeRepositoryCopy(
  repositoryDir: string,
  contents: Record<string, string>,
): Promise<void> {
  const entries = Object.entries(contents);
  if (entries.length > MAX_REPOSITORY_FILES) {
    throw new B2cToolError("TOO_MANY_REPOSITORY_FILES", "В ветке больше 2000 файлов.");
  }
  let total = 0;
  for (const [rawPath, rawContent] of entries.sort(([left], [right]) => left.localeCompare(right))) {
    const relative = normalizedRelativePath(rawPath);
    const content = String(rawContent ?? "");
    total += Buffer.byteLength(content, "utf8");
    if (total > MAX_REPOSITORY_BYTES) {
      throw new B2cToolError("REPOSITORY_TOO_LARGE", "Размер ветки превышает 80 МБ.");
    }
    const destination = path.resolve(repositoryDir, ...relative.split("/"));
    assertDescendant(repositoryDir, destination, `Файл ${relative}`);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, content, "utf8");
  }
  await mkdir(path.join(repositoryDir, "etl"), { recursive: true });
  await mkdir(path.join(repositoryDir, "resources"), { recursive: true });
}

async function uploadInputs(workspaceDir: string, uploadPath: string): Promise<{
  s2t: string;
  sql: string[];
}> {
  const relativeUploadPath = normalizedRelativePath(uploadPath);
  if (!UPLOAD_PATH.test(relativeUploadPath)) {
    throw new B2cToolError(
      "INVALID_UPLOAD_PATH",
      "uploadPath должен иметь вид uploads/package-<уникальное-имя>.",
    );
  }
  const uploadsRoot = await realpath(path.join(workspaceDir, "uploads")).catch(() => {
    throw new B2cToolError("UPLOADS_NOT_FOUND", "В workspace отсутствует каталог uploads.");
  });
  assertDescendant(workspaceDir, uploadsRoot, "Каталог uploads");
  const uploadDir = await realpath(path.resolve(workspaceDir, ...relativeUploadPath.split("/"))).catch(() => {
    throw new B2cToolError("UPLOAD_NOT_FOUND", `Пакет ${relativeUploadPath} не найден.`);
  });
  assertDescendant(uploadsRoot, uploadDir, `Пакет ${relativeUploadPath}`);
  const entries = await readdir(uploadDir, { withFileTypes: true });
  const files = entries.filter((item) => item.isFile()).map((item) => item.name);
  const xlsx = files.filter((name) => path.extname(name).toLowerCase() === ".xlsx");
  const exact = xlsx.filter((name) => name.toLowerCase() === "s2t.xlsx");
  const s2tName = exact.length === 1 ? exact[0] : xlsx.length === 1 ? xlsx[0] : undefined;
  if (!s2tName) {
    throw new B2cToolError("S2T_NOT_UNIQUE", "В пакете должен быть ровно один S2T.xlsx.");
  }
  const sqlNames = files
    .filter((name) => [".sql", ".txt"].includes(path.extname(name).toLowerCase()))
    .filter((name) => /DML_(inc|arc)/i.test(name))
    .sort((left, right) => left.localeCompare(right));
  if (!sqlNames.length) {
    throw new B2cToolError("SQL_NOT_FOUND", "В пакете нет файлов DML_inc/DML_arc.");
  }
  return {
    s2t: path.join(uploadDir, s2tName),
    sql: sqlNames.map((name) => path.join(uploadDir, name)),
  };
}

async function runProcess(
  command: string,
  args: string[],
  cwd: string,
  timeoutSeconds: number,
  signal?: AbortSignal,
): Promise<{ code: number | null; stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      env: { ...process.env, LC_ALL: process.env.LC_ALL || "C.UTF-8" },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout = (stdout + chunk.toString()).slice(-65_536); });
    child.stderr.on("data", (chunk) => { stderr = (stderr + chunk.toString()).slice(-65_536); });
    const stop = (): void => { if (child.exitCode === null) child.kill("SIGTERM"); };
    const timer = setTimeout(stop, timeoutSeconds * 1_000);
    const aborted = (): void => stop();
    signal?.addEventListener("abort", aborted, { once: true });
    child.once("error", reject);
    child.once("close", (code) => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", aborted);
      resolve({ code, stdout, stderr });
    });
  });
}

async function collectRepository(repositoryDir: string): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  let total = 0;
  const visit = async (directory: string): Promise<void> => {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await visit(entryPath);
      } else if (entry.isFile()) {
        if (Object.keys(result).length >= MAX_REPOSITORY_FILES) {
          throw new B2cToolError("TOO_MANY_REPOSITORY_FILES", "Результат содержит больше 2000 файлов.");
        }
        const content = await readFile(entryPath, "utf8");
        total += Buffer.byteLength(content, "utf8");
        if (total > MAX_REPOSITORY_BYTES) {
          throw new B2cToolError("REPOSITORY_TOO_LARGE", "Результат превышает 80 МБ.");
        }
        result[path.relative(repositoryDir, entryPath).split(path.sep).join("/")] = content;
      }
    }
  };
  await visit(repositoryDir);
  return result;
}

export async function updateMart(
  request: UpdateRequest,
  config: ToolConfig,
  runtime: RuntimeContext,
  signal?: AbortSignal,
): Promise<Record<string, unknown>> {
  if (!runtime.agentId || !runtime.workspaceDir) {
    throw new B2cToolError(
      "AGENT_CONTEXT_MISSING",
      "OpenClaw не передал agentId или workspaceDir текущего агента.",
    );
  }
  const workspaceDir = await realpath(runtime.workspaceDir).catch(() => {
    throw new B2cToolError("WORKSPACE_NOT_FOUND", "Workspace текущего агента не найден.");
  });
  const workspace = String(request.workspace || "").trim();
  const datamart = String(request.datamart || "").trim();
  if (!workspace || !datamart) {
    throw new B2cToolError("MART_IDENTITY_REQUIRED", "Нужно указать пространство и витрину.");
  }
  const storage = request.storage || "iceberg";
  const baseBranch = String(request.branch || "main").trim();

  const exported = await backendRequest<RepositoryExport>(
    config,
    "/api/internal/openclaw/repository",
    {
      agentId: runtime.agentId,
      workspace,
      datamart,
      branch: baseBranch,
    },
  );
  const suffix = `${Date.now().toString(36)}-${randomBytes(4).toString("hex")}`;
  const jobId = `update-${suffix}`;
  const jobDir = path.resolve(workspaceDir, "mart-updates", jobId);
  assertDescendant(workspaceDir, jobDir, "Каталог задачи");
  const repositoryDir = path.join(jobDir, "repository");
  const resultDir = path.join(jobDir, "result");
  await mkdir(repositoryDir, { recursive: true });
  await mkdir(resultDir, { recursive: true });
  await writeRepositoryCopy(repositoryDir, exported.contents);

  const inputs = await uploadInputs(workspaceDir, request.uploadPath);
  const skillRoot = await realpath(config.skillRoot?.trim() || defaultSkillRoot()).catch(() => {
    throw new B2cToolError("SKILL_NOT_FOUND", "Каталог Skill build-b2c-mart не найден.");
  });
  const script = path.join(skillRoot, "scripts", "run_update_from_files.sh");
  const scriptStat = await stat(script).catch(() => undefined);
  if (!scriptStat?.isFile()) {
    throw new B2cToolError("SCRIPT_NOT_FOUND", "run_update_from_files.sh не найден в Skill.");
  }

  const args = [
    script,
    repositoryDir,
    inputs.s2t,
    "--storage",
    storage,
    "--work-dir",
    resultDir,
  ];
  for (const sqlFile of inputs.sql) args.push("--sql-file", sqlFile);
  const processResult = await runProcess(
    "bash",
    args,
    jobDir,
    config.timeoutSeconds || 900,
    signal,
  );
  if (processResult.code !== 0 && processResult.code !== 3) {
    throw new B2cToolError(
      "EXTENSION_BUILD_FAILED",
      (processResult.stderr || processResult.stdout || `Скрипт завершился с кодом ${processResult.code}.`).trim(),
    );
  }
  const plan = JSON.parse(await readFile(path.join(resultDir, "update_plan.json"), "utf8"));
  if (processResult.code === 3) {
    return {
      success: true,
      changed: false,
      tool: "b2c_update_mart_from_upload_path",
      jobId,
      uploadPath: request.uploadPath,
      workspace: exported.workspace,
      datamart: exported.datamart,
      baseBranch,
      plan,
    };
  }
  const manifest = JSON.parse(await readFile(path.join(resultDir, "merge_manifest.json"), "utf8"));
  const branch = `openclaw/update-${suffix}`;
  const published = await backendRequest<Record<string, unknown>>(
    config,
    "/api/internal/openclaw/repository/import-branch",
    {
      agentId: runtime.agentId,
      workspace,
      datamart,
      branch,
      baseBranch,
      contents: await collectRepository(repositoryDir),
    },
    180_000,
  );
  return {
    success: true,
    changed: true,
    tool: "b2c_update_mart_from_upload_path",
    jobId,
    uploadPath: request.uploadPath,
    workspace: exported.workspace,
    datamart: exported.datamart,
    baseBranch,
    branch,
    plan,
    manifest,
    published,
    workspaceResult: path.relative(workspaceDir, jobDir).split(path.sep).join("/"),
  };
}
