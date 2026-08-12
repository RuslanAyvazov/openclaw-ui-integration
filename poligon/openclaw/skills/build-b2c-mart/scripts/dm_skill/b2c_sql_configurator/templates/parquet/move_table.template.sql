-- s2tTableList, srcSchema, tgtSchema, compressionType, workMode,
-- truncateIncFilterList, truncateArcFilterList, instanceFilter, truncateStgFromPa
move_table_to_schema(
    "${rule.table_name(context_config.ddl[current_table].stg_table.name)}->${rule.table_name(context_config.ddl[current_table].pa_table.name)}",
    "${rule.schema_name(context_config.ddl[current_table].stg_table.name)}",
    "${rule.schema_name(context_config.ddl[current_table].pa_table.name)}",
    "snappy",
    "inc",
    "",
    "",
    "",
    false
);
