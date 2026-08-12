-- hdfsInputPaths, hdfsWorkPath, minFileSizeMb, compressionType, parallelDegree
coalesce_files(
    get_table_hdfs_loc("${context_config.ddl[current_table].pa_table.name}"),
    concat(
        get_table_hdfs_loc("${context_config.ddl[current_table].stg_table.name}"),
        "_coalesce_work"
    ),
    128,
    "snappy",
    1
);

-- hdfsInputPaths, hdfsWorkPath, minFileSizeMb, compressionType, parallelDegree
coalesce_files(
    get_table_hdfs_loc("${context_config.ddl[current_table].hist_table.name}"),
    concat(
        get_table_hdfs_loc("${context_config.ddl[current_table].stg_table.name}"),
        "_coalesce_work"
    ),
    128,
    "snappy",
    1
);
