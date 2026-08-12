"""Константы структуры и правил проверки листа Target columns."""


TARGET_SHEET = "Target columns"
CONTEXT_FORMAT_VERSION = 1
HIST_SCHEMA_SUFFIX = "_hist"
STG_SCHEMA_SUFFIX = "_stg"

REQUIRED_COLUMNS = [
    "T-schema",
    "T-name",
    "T-col-name",
    "T-col-type",
    "T-col-pk",
    "codePartition",
]
REQUIRED_VALUE_COLUMNS = ["T-schema", "T-name", "T-col-name", "T-col-type"]

PK_YES = "yes"
PK_VALUES = {PK_YES, "no"}
MIN_REFERENCE_PK_FIELDS = 2

START_DTTM = "start_dttm"
END_DTTM = "end_dttm"
BUSINESS_HISTORY_FIELDS = (START_DTTM, END_DTTM)
HISTORY_FIELDS = set(BUSINESS_HISTORY_FIELDS)
DIM_TABLE_MARKER = "t_dim"
FACT_TABLE_MARKER = "t_fct"
AGGREGATE_TABLE_MARKER = "t_agr"
REPORT_DT = "report_dt"
PARTITION_FIELD_PREFIX = "part_"

CTL_VALIDFROM = "ctl_validfrom"
CTL_ACTION = "ctl_action"
CTL_LOADING = "ctl_loading"
CTL_VALIDTO = "ctl_validto"
ROW_HASH = "row_hash"
TECHNICAL_HISTORY_FIELDS = (CTL_VALIDFROM,)
TECH_FIELDS = (CTL_VALIDFROM, CTL_LOADING, CTL_ACTION, ROW_HASH)

TYPE_TIMESTAMP = "timestamp"
TYPE_STRING = "string"

DESCRIPTION_SCHEMA_PREFIX = "наименование схемы"
DESCRIPTION_COLUMN_PREFIX = "наименование поля"
EXCEL_ROW_OFFSET = 2
MAX_ERROR_ROWS = 15
