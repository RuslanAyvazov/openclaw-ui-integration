from constants import (
    BUSINESS_HISTORY_FIELDS,
    CTL_VALIDTO,
    END_DTTM,
    HIST_SCHEMA_SUFFIX,
    PARTITION_FIELD_PREFIX,
    PK_YES,
    REPORT_DT,
    ROW_HASH,
    STG_SCHEMA_SUFFIX,
    TECH_FIELDS,
    TECHNICAL_HISTORY_FIELDS,
    TYPE_TIMESTAMP,
)
from helpers.frame_utils import is_reference_table, norm, table_groups


def ordered_unique(values):
    """Возвращает непустые значения без повторов, сохраняя исходный порядок."""
    result = []
    seen = set()
    for value in values:
        value = str(value).strip()
        key = value.casefold()
        if value and key not in seen:
            seen.add(key)
            result.append(value)
    return result


def build_table_model(schema, name, table):
    """Формирует компактное описание одной проверенной таблицы для общего JSON."""
    primary_key = ordered_unique(
        table.loc[
            table["T-col-pk"].map(norm).eq(PK_YES)
            & table["T-col-name"].map(norm).ne(END_DTTM),
            "T-col-name",
        ].tolist()
    )
    partitions = ordered_unique(table["codePartition"].tolist())
    columns = [
        {"name": row["T-col-name"], "type": row["T-col-type"]}
        for _, row in table.iterrows()
    ]
    column_names = {norm(column["name"]): column["name"] for column in columns}
    primary_key_names = {norm(column) for column in primary_key}
    business_history = (
        [column_names[name] for name in BUSINESS_HISTORY_FIELDS]
        if is_reference_table(table)
        else [column_names[REPORT_DT]] if REPORT_DT in column_names else []
    )
    technical_history = [
        column_names[name]
        for name in TECHNICAL_HISTORY_FIELDS
        if name in column_names
    ]
    tech_fields = [column_names[name] for name in TECH_FIELDS if name in column_names]
    partition_attributes = {
        norm(column)
        for column in partitions
        if norm(column).startswith(PARTITION_FIELD_PREFIX)
    }
    excluded_attributes = (
        primary_key_names
        | set(BUSINESS_HISTORY_FIELDS)
        | {norm(column) for column in business_history}
        | partition_attributes
        | {ROW_HASH}
    )
    business_attributes = ordered_unique(
        column["name"]
        for column in columns
        if norm(column["name"]) not in excluded_attributes
        and not norm(column["name"]).startswith("ctl_")
    )
    stg_field_names = primary_key_names | {
        norm(column) for column in business_attributes
    }
    stg_columns = [
        column.copy()
        for column in columns
        if norm(column["name"]) in stg_field_names
    ]
    hist_columns = [column.copy() for column in columns]
    for column in hist_columns:
        if norm(column["name"]) == CTL_VALIDTO:
            column["type"] = TYPE_TIMESTAMP
            break
    else:
        hist_columns.append({"name": CTL_VALIDTO, "type": TYPE_TIMESTAMP})

    return {
        "pa_table": {
            "name": f"{schema}.{name}",
            "columns": columns,
        },
        "hist_table": {
            "name": f"{schema}{HIST_SCHEMA_SUFFIX}.{name}",
            "columns": hist_columns,
        },
        "stg_table": {
            "name": f"{schema}{STG_SCHEMA_SUFFIX}.{name}",
            "columns": stg_columns,
        },
        "primary_key": {"columns": primary_key},
        "business_history": {"columns": business_history},
        "technical_history": {"columns": technical_history},
        "tech_fields": {"columns": tech_fields},
        "business_attributes": {"columns": business_attributes},
        "partitioning": {"expressions": partitions},
    }


def build_validator_result(frame):
    """Формирует компактный раздел validator после успешного выполнения всех проверок."""
    return {
        "tables": [
            build_table_model(schema, name, table)
            for schema, name, table in table_groups(frame)
        ]
    }
