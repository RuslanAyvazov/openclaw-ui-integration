import { Type } from "typebox";
import { defineToolPlugin } from "openclaw/plugin-sdk/tool-plugin";
import { B2cToolError, listAccessibleDatamarts, updateMart, } from "./extension.js";
const configSchema = Type.Object({
    skillRoot: Type.Optional(Type.String({ minLength: 1 })),
    backendBaseUrl: Type.Optional(Type.String({ minLength: 1 })),
    controlTokenFile: Type.Optional(Type.String({ minLength: 1 })),
    timeoutSeconds: Type.Optional(Type.Integer({ minimum: 1, maximum: 3600, default: 900 })),
}, { additionalProperties: false });
const noParameters = Type.Object({}, { additionalProperties: false });
const updateParameters = Type.Object({
    workspace: Type.String({
        description: "Точное название или slug пространства, которое назвал пользователь.",
        minLength: 1,
    }),
    datamart: Type.String({
        description: "Точное техническое или отображаемое название витрины.",
        minLength: 1,
    }),
    uploadPath: Type.String({
        description: "Относительный путь пакета в workspace агента: uploads/package-<уникальное-имя>.",
        pattern: "^uploads/package-[A-Za-z0-9][A-Za-z0-9_-]{0,127}$",
    }),
    branch: Type.Optional(Type.String({ description: "Исходная ветка; по умолчанию main." })),
    storage: Type.Optional(Type.Union([Type.Literal("iceberg"), Type.Literal("parquet")], { default: "iceberg" })),
}, { additionalProperties: false });
function toolFailure(error) {
    if (error instanceof B2cToolError) {
        throw new Error(`${error.code}: ${error.message}`);
    }
    throw error;
}
export default defineToolPlugin({
    id: "b2c-build-tool",
    name: "B2C Datamart Update Tool",
    description: "Finds accessible datamarts, adds new streams, and extends existing stream columns from S2T.",
    configSchema,
    tools: (tool) => [
        tool({
            name: "b2c_list_accessible_datamarts",
            label: "List accessible B2C datamarts",
            description: "Returns only workspaces and datamarts available to the current OpenClaw user. "
                + "Call after the user names a workspace and datamart, to verify the pair.",
            parameters: noParameters,
            optional: true,
            factory: ({ config, toolContext }) => ({
                name: "b2c_list_accessible_datamarts",
                label: "List accessible B2C datamarts",
                description: "Lists workspaces and datamarts available to the current user.",
                parameters: noParameters,
                executionMode: "sequential",
                execute: async () => {
                    try {
                        const result = await listAccessibleDatamarts(config, toolContext);
                        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }], details: result };
                    }
                    catch (error) {
                        return toolFailure(error);
                    }
                },
            }),
        }),
        tool({
            name: "b2c_update_mart_from_upload_path",
            label: "Update B2C datamart from S2T package",
            description: "Copies an accessible datamart branch into the current agent workspace, validates format 2.0, "
                + "compares Target columns with existing DDL, adds missing streams, rebuilds streams with added columns, "
                + "validates matching SQL prototypes, and publishes a new openclaw/update-* branch.",
            parameters: updateParameters,
            optional: true,
            factory: ({ config, toolContext }) => ({
                name: "b2c_update_mart_from_upload_path",
                label: "Update B2C datamart from S2T package",
                description: "Adds missing streams and extends existing streams from the S2T package path.",
                parameters: updateParameters,
                executionMode: "sequential",
                execute: async (_callId, params, signal, onUpdate) => {
                    const request = params;
                    onUpdate?.({
                        content: [],
                        details: { stage: "started", uploadPath: request.uploadPath },
                        progress: {
                            text: "Сравниваю таблицы и атрибуты S2T с существующей витриной",
                            visibility: "channel",
                            privacy: "public",
                            id: "b2c-mart-extension",
                        },
                    });
                    try {
                        const result = await updateMart(request, config, toolContext, signal);
                        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }], details: result };
                    }
                    catch (error) {
                        return toolFailure(error);
                    }
                },
            }),
        }),
    ],
});
