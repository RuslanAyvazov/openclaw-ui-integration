CALL historicity(
    target_type                   = "${rule.start_dttm_in_business_history=dim;otherwise=fact}",
    hash_type                     = "sha256",
    source_table                  = "${context_config.ddl[current_table].stg_table.name}",
    increment_table               = "${context_config.validator.tables[].stg_table.name}",
    increment_bussinessKeyColumns = "${context_config.validator.tables[].primary_key.columns}",
    increment_trackedCols         = "${context_config.validator.tables[].business_attributes.columns}",
    increment_businessDateColumn  = "${context_config.validator.tables[].business_history.columns.business_date}",
    pa_source                     = "${context_config.validator.tables[].pa_table.name}",
    hist_source                   = "${context_config.validator.tables[].hist_table.name}"
);
