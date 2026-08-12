import { Type } from "typebox";
import { defineToolPlugin } from "openclaw/plugin-sdk/tool-plugin";

import {
  B2cBuildError,
  executeBuild,
} from "./build.js";
import type { BuildRequest } from "./build.js";

const pluginConfigSchema = Type.Object(
  {
    skillRoot: Type.Optional(
      Type.String({
        description: "Absolute path to the installed b2c-sql-project-2-0-builder Skill directory.",
        minLength: 1,
      }),
    ),
    timeoutSeconds: Type.Optional(
      Type.Integer({
        description: "Maximum execution time of run_from_files.sh in seconds.",
        minimum: 1,
        maximum: 3_600,
        default: 900,
      }),
    ),
    maxLogBytes: Type.Optional(
      Type.Integer({
        description: "Maximum number of bytes retained separately for stdout and stderr.",
        minimum: 1_024,
        maximum: 1_048_576,
        default: 32_768,
      }),
    ),
  },
  { additionalProperties: false },
);

const buildParameters = Type.Object(
  {
    uploadId: Type.String({
      description: "Identifier returned by the attachment upload service, for example upload-789.",
      pattern: "^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$",
    }),
    storage: Type.Optional(
      Type.Union([Type.Literal("iceberg"), Type.Literal("parquet")], {
        description: "Target storage. If omitted, iceberg is used.",
        default: "iceberg",
      }),
    ),
  },
  { additionalProperties: false },
);

export default defineToolPlugin({
  id: "b2c-build-tool",
  name: "B2C SQL Project Build Tool",
  description: "Build a B2C SQL project from S2T and DML files uploaded to the current agent workspace.",
  configSchema: pluginConfigSchema,
  tools: (tool) => [
    tool({
      name: "b2c_build_from_upload",
      label: "Build B2C SQL project from upload",
      description:
        "Builds a B2C SQL project from workspace/uploads/<uploadId>. "
        + "The package must contain one S2T.xlsx file and DML_inc/DML_arc files in .sql or .txt format.",
      parameters: buildParameters,
      optional: true,
      factory: ({ config, toolContext }) => ({
        name: "b2c_build_from_upload",
        label: "Build B2C SQL project from upload",
        description:
          "Builds a B2C SQL project from workspace/uploads/<uploadId>. "
          + "The package must contain one S2T.xlsx file and DML_inc/DML_arc files in .sql or .txt format.",
        parameters: buildParameters,
        executionMode: "sequential",
        execute: async (_toolCallId, params, signal, onUpdate) => {
          const request = params as BuildRequest;
          onUpdate?.({
            content: [],
            details: { stage: "started", uploadId: request.uploadId },
            progress: {
              text: `Запущена сборка пакета ${request.uploadId}`,
              visibility: "channel",
              privacy: "public",
              id: "b2c-build",
            },
          });

          try {
            const result = await executeBuild(request, config, toolContext, signal);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(result, null, 2),
                },
              ],
              details: result,
            };
          } catch (error: unknown) {
            if (error instanceof B2cBuildError) {
              throw new Error(`${error.code}: ${error.message}`);
            }
            throw error;
          }
        },
      }),
    }),
  ],
});
