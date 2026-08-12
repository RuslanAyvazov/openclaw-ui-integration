"""Константы генератора Spark SQL DDL."""


SUPPORTED_STORAGE = {"iceberg", "parquet"}
CTL_VALIDTO = "ctl_validto"
ICEBERG_UNARY_TRANSFORMS = {"DAY", "MONTH", "YEAR", "HOUR"}
ICEBERG_SIZED_TRANSFORMS = {"BUCKET", "TRUNCATE"}
