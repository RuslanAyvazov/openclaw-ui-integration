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
export declare class B2cBuildError extends Error {
    readonly code: string;
    constructor(code: string, message: string);
}
type BuildInputs = {
    workspaceDir: string;
    uploadDir: string;
    s2tFile: string;
    sqlFiles: string[];
};
export declare function resolveBuildInputs(workspaceDir: string, uploadId: string): Promise<BuildInputs>;
export declare function executeBuild(request: BuildRequest, config: BuildToolConfig, runtime: BuildRuntimeContext, signal?: AbortSignal): Promise<BuildSuccess>;
export {};
