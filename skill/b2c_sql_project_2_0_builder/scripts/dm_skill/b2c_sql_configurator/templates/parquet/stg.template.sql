DROP TABLE IF EXISTS ${context_config.ddl[current_table].stg_table.name};

${context_config.ddl[current_table].stg_table.create_table}

INSERT INTO ${context_config.ddl[current_table].stg_table.name} (
${context_config.validator.tables[].stg_table.columns.names}
)
${dml_scripts_json[current_table][DML_inc.sql]}
