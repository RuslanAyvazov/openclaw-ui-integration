from constants import SUPPORTED_STORAGE
from errors import (
    COLUMNS_MISSING,
    COLUMN_NOT_OBJECT,
    COLUMN_VALUE_MISSING,
    DDLGenerationError,
    DUPLICATE_COLUMN,
    DUPLICATE_STREAM,
    INVALID_HIST_NAME,
    INVALID_PA_NAME,
    INVALID_STG_NAME,
    INVALID_STORAGE,
    PARTITIONING_INVALID,
    PRIMARY_KEY_MISSING,
    ROOT_NOT_OBJECT,
    TABLES_MISSING,
    TABLE_NOT_OBJECT,
    UNKNOWN_PRIMARY_KEY,
    VALIDATOR_MISSING,
)
from helpers.spark_ddl import split_pa_name, validate_partition_expression


def validated_tables(context, storage):
    """Проверяет компактный контракт validator.tables и возвращает таблицы для DDL."""
    errors = []
    if storage not in SUPPORTED_STORAGE:
        raise DDLGenerationError(INVALID_STORAGE.format(storage=storage))
    if not isinstance(context, dict):
        raise DDLGenerationError(ROOT_NOT_OBJECT)

    validator = context.get("validator")
    if not isinstance(validator, dict):
        raise DDLGenerationError(VALIDATOR_MISSING)
    tables = validator.get("tables")
    if not isinstance(tables, list) or not tables:
        raise DDLGenerationError(TABLES_MISSING)

    stream_names = set()
    for index, table in enumerate(tables):
        errors.extend(validate_table(table, index, storage))
        if isinstance(table, dict):
            pa_table = table.get("pa_table")
            pa_name = pa_table.get("name") if isinstance(pa_table, dict) else None
            parts = split_pa_name(pa_name)
            if parts:
                stream = parts[1].casefold()
                if stream in stream_names:
                    errors.append(DUPLICATE_STREAM.format(stream=parts[1]))
                stream_names.add(stream)

    if errors:
        raise DDLGenerationError(errors)
    return tables


def validate_table(table, index, storage):
    """Проверяет одну компактную таблицу общего JSON перед построением DDL."""
    if not isinstance(table, dict):
        return [TABLE_NOT_OBJECT.format(index=index)]

    errors = []
    pa_table = table.get("pa_table")
    hist_table = table.get("hist_table")
    stg_table = table.get("stg_table")
    pa_name = pa_table.get("name") if isinstance(pa_table, dict) else None
    hist_name = hist_table.get("name") if isinstance(hist_table, dict) else None
    stg_name = stg_table.get("name") if isinstance(stg_table, dict) else None
    parts = split_pa_name(pa_name)
    if not parts:
        errors.append(INVALID_PA_NAME.format(index=index, value=pa_name))
        table_id = str(pa_name or f"#{index}")
    else:
        table_id = pa_name.strip()

    if not split_pa_name(hist_name):
        errors.append(INVALID_HIST_NAME.format(index=index, value=hist_name))
    if not split_pa_name(stg_name):
        errors.append(INVALID_STG_NAME.format(index=index, value=stg_name))

    columns = pa_table.get("columns") if isinstance(pa_table, dict) else None
    if not isinstance(columns, list) or not columns:
        errors.append(COLUMNS_MISSING.format(table=table_id))
        return errors

    hist_columns = hist_table.get("columns") if isinstance(hist_table, dict) else None
    if not isinstance(hist_columns, list) or not hist_columns:
        errors.append(COLUMNS_MISSING.format(table=hist_name or f"hist_table #{index}"))

    stg_columns = stg_table.get("columns") if isinstance(stg_table, dict) else None
    if not isinstance(stg_columns, list) or not stg_columns:
        errors.append(COLUMNS_MISSING.format(table=stg_name or f"stg_table #{index}"))

    column_names = set()
    for column_index, column in enumerate(columns):
        if not isinstance(column, dict):
            errors.append(COLUMN_NOT_OBJECT.format(index=column_index, table=table_id))
            continue
        for field in ("name", "type"):
            if not isinstance(column.get(field), str) or not column[field].strip():
                errors.append(
                    COLUMN_VALUE_MISSING.format(index=column_index, table=table_id, field=field)
                )
        name = str(column.get("name", "")).strip().casefold()
        if name and name in column_names:
            errors.append(DUPLICATE_COLUMN.format(table=table_id, column=name))
        column_names.add(name)

    primary_key = table.get("primary_key", {}).get("columns")
    if not isinstance(primary_key, list) or not primary_key:
        errors.append(PRIMARY_KEY_MISSING.format(table=table_id))
    else:
        for column in primary_key:
            if str(column).strip().casefold() not in column_names:
                errors.append(UNKNOWN_PRIMARY_KEY.format(table=table_id, column=column))

    expressions = table.get("partitioning", {}).get("expressions", [])
    if not isinstance(expressions, list) or not all(
        isinstance(expression, str) and expression.strip() for expression in expressions
    ):
        errors.append(PARTITIONING_INVALID.format(table=table_id))
    else:
        for expression in expressions:
            errors.extend(validate_partition_expression(expression, column_names, storage, table_id))
    return errors
