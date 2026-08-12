iceberg_pckg.coalesce(
    tables = "${context_config.validator.tables[].pa_table.name}, ${context_config.validator.tables[].hist_table.name}",
    target_file_size_mb = 128,
    compression_codec = 'zstd',
    parallel_degree = 8,
    snapshot_retention = 5,
    rewrite_manifests = true,
    delete_orphan_files = true,
    exclude_partitions = null,
    include_partitions = null,
    analyze_by = 'abc',
    custom_strategy = null
)
