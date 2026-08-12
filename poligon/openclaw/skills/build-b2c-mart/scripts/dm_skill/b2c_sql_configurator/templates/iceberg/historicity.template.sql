iceberg_pckg.historicity(
    mode                     = "${rule.inc=baseline;arc=full_reload}",
    pa_table                 = "${context_config.validator.tables[].pa_table.name}",
    incr_table               = "${context_config.validator.tables[].stg_table.name}",
    hist_table               = "${context_config.validator.tables[].hist_table.name}",
    mapping_inc              = ${context_config.validator.tables[].business_attributes.columns},
    mapping_pa               = ${context_config.validator.tables[].business_attributes.columns},
    pk_inc                   = ${context_config.validator.tables[].primary_key.columns},
    pk_pa                    = ${context_config.validator.tables[].primary_key.columns},
    hash_policy_inc          = "",
    hash_policy_pa           = "",
    dedup_policy_inc         = "",
    dedup_policy_pa          = "",
    partial_reload_time_mark = ""
)
