from errors import (
    COLUMNS_MISSING,
    DDL_MISSING,
    DUPLICATE_STREAM,
    INVALID_HIST_NAME,
    INVALID_PA_NAME,
    INVALID_STG_NAME,
    PRIMARY_KEY_MISSING,
    ROOT_NOT_OBJECT,
    STREAM_DDL_MISSING,
    TABLE_DDL_MISSING,
    TABLE_DDL_NAME_MISMATCH,
    TABLES_MISSING,
    VALIDATOR_MISSING,
    B2CSQLConfigurationError,
)


def split_pa_name(value):
    """Разделяет полное имя PA-таблицы на схему и имя таблицы."""
    if not isinstance(value, str) or value.count(".") != 1:
        return None
    schema, name = (part.strip() for part in value.split(".", 1))
    return (schema, name) if schema and name else None


def validated_tables(context):
    """Проверяет наличие данных валидатора и DDL, необходимых для конфигураций."""
    if not isinstance(context, dict):
        raise B2CSQLConfigurationError(ROOT_NOT_OBJECT)

    validator = context.get("validator")
    if not isinstance(validator, dict):
        raise B2CSQLConfigurationError(VALIDATOR_MISSING)
    tables = validator.get("tables")
    if not isinstance(tables, list) or not tables:
        raise B2CSQLConfigurationError(TABLES_MISSING)

    ddl = context.get("ddl")
    if not isinstance(ddl, dict) or not ddl:
        raise B2CSQLConfigurationError(DDL_MISSING)

    errors = []
    streams = set()
    for index, table in enumerate(tables):
        pa_table = table.get("pa_table") if isinstance(table, dict) else None
        hist_table = table.get("hist_table") if isinstance(table, dict) else None
        stg_table = table.get("stg_table") if isinstance(table, dict) else None
        pa_name = pa_table.get("name") if isinstance(pa_table, dict) else None
        hist_name = hist_table.get("name") if isinstance(hist_table, dict) else None
        stg_name = stg_table.get("name") if isinstance(stg_table, dict) else None
        if not split_pa_name(hist_name):
            errors.append(INVALID_HIST_NAME.format(index=index, value=hist_name))

        if not split_pa_name(stg_name):
            errors.append(INVALID_STG_NAME.format(index=index, value=stg_name))

        parts = split_pa_name(pa_name)
        if not parts:
            errors.append(INVALID_PA_NAME.format(index=index, value=pa_name))
            continue

        stream = parts[1]
        normalized_stream = stream.casefold()
        if normalized_stream in streams:
            errors.append(DUPLICATE_STREAM.format(stream=stream))
        streams.add(normalized_stream)

        columns = pa_table.get("columns") if isinstance(pa_table, dict) else None
        if not isinstance(columns, list) or not columns:
            errors.append(COLUMNS_MISSING.format(table=pa_name))

        stg_columns = stg_table.get("columns") if isinstance(stg_table, dict) else None
        if not isinstance(stg_columns, list) or not stg_columns or not all(
            isinstance(column, dict)
            and isinstance(column.get("name"), str)
            and column["name"].strip()
            for column in stg_columns
        ):
            errors.append(COLUMNS_MISSING.format(table=stg_name))

        primary_key = table.get("primary_key", {}).get("columns")
        if not isinstance(primary_key, list) or not primary_key:
            errors.append(PRIMARY_KEY_MISSING.format(table=pa_name))

        if stream not in ddl:
            errors.append(STREAM_DDL_MISSING.format(stream=stream))
            continue

        stream_ddl = ddl.get(stream)
        validator_names = {
            "pa_table": pa_name,
            "hist_table": hist_name,
            "stg_table": stg_name,
        }
        for table_key, validator_name in validator_names.items():
            table_ddl = (
                stream_ddl.get(table_key) if isinstance(stream_ddl, dict) else None
            )
            ddl_name = table_ddl.get("name") if isinstance(table_ddl, dict) else None
            create_table = (
                table_ddl.get("create_table") if isinstance(table_ddl, dict) else None
            )
            if (
                not split_pa_name(ddl_name)
                or not isinstance(create_table, list)
                or not create_table
                or not all(isinstance(line, str) for line in create_table)
            ):
                errors.append(
                    TABLE_DDL_MISSING.format(
                        stream=stream,
                        table_key=table_key,
                    )
                )
            elif (
                isinstance(validator_name, str)
                and ddl_name.casefold() != validator_name.casefold()
            ):
                errors.append(
                    TABLE_DDL_NAME_MISMATCH.format(
                        stream=stream,
                        table_key=table_key,
                        ddl_name=ddl_name,
                        validator_name=validator_name,
                    )
                )

    if errors:
        raise B2CSQLConfigurationError(errors)
    return tables
