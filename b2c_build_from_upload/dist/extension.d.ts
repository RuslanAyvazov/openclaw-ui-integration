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
export declare class B2cToolError extends Error {
    readonly code: string;
    constructor(code: string, message: string);
}
export declare function listAccessibleDatamarts(config: ToolConfig, runtime: RuntimeContext): Promise<Record<string, unknown>>;
export declare function updateMart(request: UpdateRequest, config: ToolConfig, runtime: RuntimeContext, signal?: AbortSignal): Promise<Record<string, unknown>>;
