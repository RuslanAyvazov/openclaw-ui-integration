"""Константы формирования B2C SQL-конфигураций."""


SUPPORTED_STORAGES = ("iceberg", "parquet")

ICEBERG_TEMPLATES = "iceberg"
PARQUET_TEMPLATES = "parquet"

CONFIG_TEMPLATE = "b2c_sql_config.template.json"
STG_TEMPLATE = "stg.template.sql"
ICEBERG_HISTORICITY_TEMPLATE = "historicity.template.sql"
PARQUET_HISTORICITY_TEMPLATE = "historicity.template.sql"
DQC_TEMPLATE = "dqc.template.json"
MOVE_TABLE_TEMPLATE = "move_table.template.sql"
COALESCE_TEMPLATE = "coalesce.template.sql"

ICEBERG_MODE_INCREMENTAL = "baseline"
ICEBERG_MODE_ARCHIVE = "full_reload"
