import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";
import { getToolPluginMetadata } from "openclaw/plugin-sdk/tool-plugin";

import entry from "./index.js";
import {
  B2cBuildError,
  resolveBuildInputs,
} from "./build.js";

describe("b2c-build-tool metadata", () => {
  it("declares b2c_build_from_upload as an optional tool", () => {
    const metadata = getToolPluginMetadata(entry);
    expect(metadata?.tools.map((tool) => ({ name: tool.name, optional: tool.optional }))).toEqual([
      { name: "b2c_build_from_upload", optional: true },
    ]);
  });
});

describe("resolveBuildInputs", () => {
  it("selects S2T and DML files from one upload directory", async () => {
    const workspace = await mkdtemp(path.join(tmpdir(), "b2c-tool-test-"));
    const uploadDir = path.join(workspace, "uploads", "upload-789");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, "S2T.xlsx"), "xlsx");
    await writeFile(path.join(uploadDir, "DML_inc_sales.txt"), "select 1");
    await writeFile(path.join(uploadDir, "DML_arc_sales.sql"), "select 2");
    await writeFile(path.join(uploadDir, "notes.txt"), "ignore me");

    const result = await resolveBuildInputs(workspace, "upload-789");

    expect(path.basename(result.s2tFile)).toBe("S2T.xlsx");
    expect(result.sqlFiles.map((file) => path.basename(file))).toEqual([
      "DML_arc_sales.sql",
      "DML_inc_sales.txt",
    ]);
  });

  it("rejects path traversal in uploadId", async () => {
    const workspace = await mkdtemp(path.join(tmpdir(), "b2c-tool-test-"));

    await expect(resolveBuildInputs(workspace, "../other-agent")).rejects.toMatchObject({
      code: "INVALID_UPLOAD_ID",
    });
  });
});
