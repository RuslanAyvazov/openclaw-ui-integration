iceberg_pckg.move_table(
    pa_table = "${context_config.validator.tables[].pa_table.name}",
    hist_table = "${context_config.validator.tables[].hist_table.name}"
);
