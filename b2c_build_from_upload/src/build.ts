import { spawn } from "node:child_process";
import { homedir } from "node:os";
import path from "node:path";
import {
  mkdir,
  readdir,
  realpath,
  stat,
} from "node:fs/promises";

const DEFAULT_SKILL_NAME = "b2c-sql-project-2-0-builder";
const DEFAULT_TIMEOUT_SECONDS = 900;
const DEFAULT_MAX_LOG_BYTES = 32_768;
const MAX_RESULT_FILES = 2_000;
const UPLOAD_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/;

export type StorageType = "iceberg" | "parquet";

export type BuildToolConfig = {
  skillRoot?: string;
  timeoutSeconds?: number;
  maxLogBytes?: number;
};

export type BuildRequest = {
  uploadId: string;
  storage?: StorageType;
};

export type BuildRuntimeContext = {
  workspaceDir?: string;
  agentId?: string;
};

export type BuildSuccess = {
  success: true;
  tool: "b2c_build_from_upload";
  agentId: string | null;
  uploadId: string;
  storage: StorageType;
  inputFiles: {
    s2t: string;
    sql: string[];
  };
  output: {
    dmlJson: string;
    contextConfig: string;
    martDirectory: string;
    generatedFiles: string[];
  };
  execution: {
    exitCode: 0;
    durationMs: number;
    stdout: string;
    stderr: string;
  };
};

export class B2cBuildError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "B2cBuildError";
    this.code = code;
  }
}

type BuildInputs = {
  workspaceDir: string;
  uploadDir: string;
  s2tFile: string;
  sqlFiles: string[];
};

type ProcessResult = {
  exitCode: number | null;
  signal: NodeJS.Signals | null;
  durationMs: number;
  stdout: string;
  stderr: string;
  timedOut: boolean;
  aborted: boolean;
};

function defaultSkillRoot(): string {
  const stateDir = process.env.OPENCLAW_STATE_DIR?.trim();
  return path.join(stateDir || path.join(homedir(), ".openclaw"), "skills", DEFAULT_SKILL_NAME);
}

function toPosixPath(value: string): string {
  return value.split(path.sep).join("/");
}

function relativeWorkspacePath(workspaceDir: string, absolutePath: string): string {
  return toPosixPath(path.relative(workspaceDir, absolutePath));
}

function assertDescendant(root: string, candidate: string, label: string): void {
  const relative = path.relative(root, candidate);
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new B2cBuildError("PATH_OUTSIDE_WORKSPACE", `${label} находится вне разрешённого каталога.`);
  }
}

async function requireRegularFile(filePath: string, root: string): Promise<string> {
  const resolved = await realpath(filePath).catch(() => {
    throw new B2cBuildError("INPUT_FILE_NOT_FOUND", `Файл не найден: ${path.basename(filePath)}`);
  });
  assertDescendant(root, resolved, `Файл ${path.basename(filePath)}`);
  const fileStat = await stat(resolved);
  if (!fileStat.isFile()) {
    throw new B2cBuildError("INPUT_NOT_REGULAR_FILE", `Ожидался обычный файл: ${path.basename(filePath)}`);
  }
  return resolved;
}

export async function resolveBuildInputs(workspaceDir: string, uploadId: string): Promise<BuildInputs> {
  if (!UPLOAD_ID_PATTERN.test(uploadId)) {
    throw new B2cBuildError(
      "INVALID_UPLOAD_ID",
      "uploadId должен содержать только латинские буквы, цифры, дефис и подчёркивание.",
    );
  }

  const workspaceReal = await realpath(workspaceDir).catch(() => {
    throw new B2cBuildError("WORKSPACE_NOT_FOUND", "Рабочий каталог текущего агента не найден.");
  });
  const uploadsRoot = await realpath(path.join(workspaceReal, "uploads")).catch(() => {
    throw new B2cBuildError("UPLOADS_DIRECTORY_NOT_FOUND", "В workspace агента отсутствует каталог uploads.");
  });
  assertDescendant(workspaceReal, uploadsRoot, "Каталог uploads");

  const uploadDir = await realpath(path.join(uploadsRoot, uploadId)).catch(() => {
    throw new B2cBuildError("UPLOAD_NOT_FOUND", `Пакет загрузки ${uploadId} не найден.`);
  });
  assertDescendant(uploadsRoot, uploadDir, `Пакет загрузки ${uploadId}`);

  const entries = await readdir(uploadDir, { withFileTypes: true });
  const fileNames = entries.filter((entry) => entry.isFile()).map((entry) => entry.name);

  const xlsxNames = fileNames.filter((name) => path.extname(name).toLowerCase() === ".xlsx");
  const exactS2tNames = xlsxNames.filter((name) => name.toLowerCase() === "s2t.xlsx");
  const selectedXlsx = exactS2tNames.length === 1
    ? exactS2tNames[0]
    : xlsxNames.length === 1
      ? xlsxNames[0]
      : undefined;

  if (!selectedXlsx) {
    throw new B2cBuildError(
      "S2T_FILE_NOT_UNIQUE",
      "В пакете должен быть один файл S2T.xlsx. Если имя другое, XLSX-файл всё равно должен быть единственным.",
    );
  }

  const sqlNames = fileNames
    .filter((name) => [".sql", ".txt"].includes(path.extname(name).toLowerCase()))
    .filter((name) => /DML_(inc|arc)/i.test(name))
    .sort((left, right) => left.localeCompare(right));

  if (sqlNames.length === 0) {
    throw new B2cBuildError(
      "SQL_FILES_NOT_FOUND",
      "Не найдены файлы .sql или .txt, в имени которых есть DML_inc или DML_arc.",
    );
  }

  const s2tFile = await requireRegularFile(path.join(uploadDir, selectedXlsx), uploadDir);
  const sqlFiles = await Promise.all(
    sqlNames.map((name) => requireRegularFile(path.join(uploadDir, name), uploadDir)),
  );

  return {
    workspaceDir: workspaceReal,
    uploadDir,
    s2tFile,
    sqlFiles,
  };
}

function appendTail(current: Buffer, chunk: Buffer, maxBytes: number): Buffer {
  const combined = Buffer.concat([current, chunk]);
  return combined.length <= maxBytes ? combined : combined.subarray(combined.length - maxBytes);
}

async function runProcess(
  command: string,
  args: string[],
  cwd: string,
  timeoutSeconds: number,
  maxLogBytes: number,
  signal?: AbortSignal,
): Promise<ProcessResult> {
  const startedAt = Date.now();
  let stdout: Buffer<ArrayBufferLike> = Buffer.alloc(0);
  let stderr: Buffer<ArrayBufferLike> = Buffer.alloc(0);
  let timedOut = false;
  let aborted = false;

  const child = spawn(command, args, {
    cwd,
    env: {
      ...process.env,
      LC_ALL: process.env.LC_ALL || "C.UTF-8",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  child.stdout.on("data", (chunk: Buffer) => {
    stdout = appendTail(stdout, chunk, maxLogBytes);
  });
  child.stderr.on("data", (chunk: Buffer) => {
    stderr = appendTail(stderr, chunk, maxLogBytes);
  });

  const stopProcess = (): void => {
    if (child.exitCode === null && child.signalCode === null) {
      child.kill("SIGTERM");
    }
  };

  const abortHandler = (): void => {
    aborted = true;
    stopProcess();
  };
  signal?.addEventListener("abort", abortHandler, { once: true });

  const timeout = setTimeout(() => {
    timedOut = true;
    stopProcess();
  }, timeoutSeconds * 1_000);

  try {
    const closeResult = await new Promise<{ code: number | null; signal: NodeJS.Signals | null }>(
      (resolve, reject) => {
        child.once("error", reject);
        child.once("close", (code, closeSignal) => resolve({ code, signal: closeSignal }));
      },
    );

    return {
      exitCode: closeResult.code,
      signal: closeResult.signal,
      durationMs: Date.now() - startedAt,
      stdout: stdout.toString("utf8"),
      stderr: stderr.toString("utf8"),
      timedOut,
      aborted,
    };
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", abortHandler);
  }
}

async function listGeneratedFiles(rootDir: string, workspaceDir: string): Promise<string[]> {
  const result: string[] = [];

  const visit = async (directory: string): Promise<void> => {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
      if (result.length >= MAX_RESULT_FILES) {
        throw new B2cBuildError("TOO_MANY_OUTPUT_FILES", `Сборка создала больше ${MAX_RESULT_FILES} файлов.`);
      }
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await visit(entryPath);
      } else if (entry.isFile()) {
        result.push(relativeWorkspacePath(workspaceDir, entryPath));
      }
    }
  };

  await visit(rootDir);
  return result;
}

export async function executeBuild(
  request: BuildRequest,
  config: BuildToolConfig,
  runtime: BuildRuntimeContext,
  signal?: AbortSignal,
): Promise<BuildSuccess> {
  if (!runtime.workspaceDir) {
    throw new B2cBuildError(
      "WORKSPACE_CONTEXT_MISSING",
      "OpenClaw не передал workspace текущего агента. Инструмент нельзя запускать вне контекста агента.",
    );
  }

  const storage: StorageType = request.storage || "iceberg";
  const inputs = await resolveBuildInputs(runtime.workspaceDir, request.uploadId);

  const configuredSkillRoot = config.skillRoot?.trim() || defaultSkillRoot();
  const skillRoot = await realpath(configuredSkillRoot).catch(() => {
    throw new B2cBuildError("SKILL_NOT_FOUND", `Каталог Skill не найден: ${configuredSkillRoot}`);
  });
  const scriptPath = await requireRegularFile(
    path.join(skillRoot, "scripts", "run_from_files.sh"),
    skillRoot,
  );

  const resultDirectory = path.join(inputs.uploadDir, "result");
  await mkdir(resultDirectory, { recursive: true });
  const resultDirectoryReal = await realpath(resultDirectory);
  assertDescendant(inputs.uploadDir, resultDirectoryReal, "Каталог результата");

  const dmlJson = path.join(resultDirectoryReal, "dml_scripts.json");
  const contextConfig = path.join(resultDirectoryReal, "context_config.json");
  const martDirectory = path.join(resultDirectoryReal, "dm_res");

  const args = [
    scriptPath,
    inputs.s2tFile,
    "--storage",
    storage,
  ];
  for (const sqlFile of inputs.sqlFiles) {
    args.push("--sql-file", sqlFile);
  }
  args.push(
    "--dml-json",
    dmlJson,
    "--output-json",
    contextConfig,
    "--mart-dir",
    martDirectory,
  );

  const timeoutSeconds = config.timeoutSeconds || DEFAULT_TIMEOUT_SECONDS;
  const maxLogBytes = config.maxLogBytes || DEFAULT_MAX_LOG_BYTES;
  const processResult = await runProcess(
    "bash",
    args,
    inputs.uploadDir,
    timeoutSeconds,
    maxLogBytes,
    signal,
  ).catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    throw new B2cBuildError("SCRIPT_START_FAILED", `Не удалось запустить Bash-скрипт: ${message}`);
  });

  if (processResult.aborted) {
    throw new B2cBuildError("BUILD_ABORTED", "Сборка отменена OpenClaw.");
  }
  if (processResult.timedOut) {
    throw new B2cBuildError(
      "BUILD_TIMEOUT",
      `Сборка превысила ограничение ${timeoutSeconds} секунд. Последний вывод: ${processResult.stderr || processResult.stdout}`,
    );
  }
  if (processResult.exitCode !== 0) {
    throw new B2cBuildError(
      "BUILD_SCRIPT_FAILED",
      `run_from_files.sh завершился с кодом ${processResult.exitCode ?? "нет"}. ${processResult.stderr || processResult.stdout}`,
    );
  }

  await requireRegularFile(dmlJson, inputs.uploadDir);
  await requireRegularFile(contextConfig, inputs.uploadDir);
  const martStat = await stat(martDirectory).catch(() => undefined);
  if (!martStat?.isDirectory()) {
    throw new B2cBuildError("MART_DIRECTORY_NOT_CREATED", "Скрипт не создал каталог result/dm_res.");
  }

  const generatedFiles = await listGeneratedFiles(resultDirectoryReal, inputs.workspaceDir);

  return {
    success: true,
    tool: "b2c_build_from_upload",
    agentId: runtime.agentId || null,
    uploadId: request.uploadId,
    storage,
    inputFiles: {
      s2t: relativeWorkspacePath(inputs.workspaceDir, inputs.s2tFile),
      sql: inputs.sqlFiles.map((file) => relativeWorkspacePath(inputs.workspaceDir, file)),
    },
    output: {
      dmlJson: relativeWorkspacePath(inputs.workspaceDir, dmlJson),
      contextConfig: relativeWorkspacePath(inputs.workspaceDir, contextConfig),
      martDirectory: relativeWorkspacePath(inputs.workspaceDir, martDirectory),
      generatedFiles,
    },
    execution: {
      exitCode: 0,
      durationMs: processResult.durationMs,
      stdout: processResult.stdout,
      stderr: processResult.stderr,
    },
  };
}
