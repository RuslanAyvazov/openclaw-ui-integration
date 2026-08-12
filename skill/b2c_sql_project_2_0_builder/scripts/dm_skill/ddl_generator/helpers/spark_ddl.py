import re

from constants import (
    CTL_VALIDTO,
    ICEBERG_SIZED_TRANSFORMS,
    ICEBERG_UNARY_TRANSFORMS,
)
from errors import ICEBERG_TRANSFORM, PARQUET_TRANSFORM, PARTITION_UNKNOWN_COLUMN


IDENTIFIER = re.compile(r"^[A-Za-z_][A-Za-z0-9_]*$")
TRANSFORM = re.compile(r"^([A-Za-z]+)\s*\((.*)\)$")


def split_pa_name(value):
    """Разделяет имя PA-таблицы schema.table и возвращает схему и таблицу."""
    if not isinstance(value, str) or value.count(".") != 1:
        return None
    schema, name = (part.strip() for part in value.split(".", 1))
    return (schema, name) if schema and name else None


def spark_identifier(value):
    """Возвращает безопасное имя Spark SQL, при необходимости заключённое в обратные кавычки."""
    value = str(value).strip()
    if IDENTIFIER.fullmatch(value):
        return value
    return f"`{value.replace('`', '``')}`"


def validate_partition_expression(expression, column_names, storage, table_id):
    """Проверяет поле или transform партиционирования для выбранного формата хранения."""
    expression = expression.strip()
    if IDENTIFIER.fullmatch(expression):
        if expression.casefold() not in column_names:
            return [
                PARTITION_UNKNOWN_COLUMN.format(
                    table=table_id,
                    expression=expression,
                    column=expression,
                )
            ]
        return []

    if storage == "parquet":
        return [PARQUET_TRANSFORM.format(table=table_id, expression=expression)]

    match = TRANSFORM.fullmatch(expression)
    if not match:
        return [ICEBERG_TRANSFORM.format(table=table_id, expression=expression)]

    transform = match.group(1).upper()
    arguments = [argument.strip() for argument in match.group(2).split(",")]
    if transform in ICEBERG_UNARY_TRANSFORMS:
        valid = len(arguments) == 1 and IDENTIFIER.fullmatch(arguments[0])
    elif transform in ICEBERG_SIZED_TRANSFORMS:
        valid = (
            len(arguments) == 2
            and arguments[0].isdigit()
            and IDENTIFIER.fullmatch(arguments[1])
        )
    else:
        valid = False
    if not valid:
        return [ICEBERG_TRANSFORM.format(table=table_id, expression=expression)]

    column = arguments[-1]
    if column.casefold() not in column_names:
        return [
            PARTITION_UNKNOWN_COLUMN.format(
                table=table_id,
                expression=expression,
                column=column,
            )
        ]
    return []


def render_create_table(schema, name, columns, storage, partitions):
    """Формирует один оператор CREATE TABLE в синтаксисе Spark SQL."""
    partition_names = {partition.casefold() for partition in partitions}
    table_columns = (
        [
            column
            for column in columns
            if str(column["name"]).strip().casefold() not in partition_names
        ]
        if storage == "parquet"
        else columns
    )
    width = max(len(str(column["name"]).strip()) for column in table_columns)
    column_lines = []
    for index, column in enumerate(table_columns):
        suffix = "," if index < len(table_columns) - 1 else ""
        column_name = spark_identifier(column["name"])
        padding = " " * (width - len(str(column["name"]).strip()) + 1)
        column_lines.append(
            f"  {column_name}{padding}{str(column['type']).strip()}{suffix}"
        )

    lines = [
        f"CREATE TABLE {spark_identifier(schema)}.{spark_identifier(name)} (",
        *column_lines,
        ")",
    ]
    if storage == "parquet":
        if partitions:
            columns_by_name = {
                str(column["name"]).strip().casefold(): column for column in columns
            }
            partition_columns = [columns_by_name[value.casefold()] for value in partitions]
            partition_width = max(
                len(str(column["name"]).strip()) for column in partition_columns
            )
            lines.extend(["PARTITIONED BY ("])
            for index, column in enumerate(partition_columns):
                suffix = "," if index < len(partition_columns) - 1 else ""
                column_name = spark_identifier(column["name"])
                padding = " " * (
                    partition_width - len(str(column["name"]).strip()) + 1
                )
                lines.append(
                    f"  {column_name}{padding}{str(column['type']).strip()}{suffix}"
                )
            lines.append(")")
        lines.extend(
            [
                "STORED AS PARQUET",
                'TBLPROPERTIES ("PARQUET.COMPRESS"="SNAPPY", "TRANSACTIONAL"="FALSE")',
            ]
        )
    else:
        lines.append(f"USING {storage}")
        if partitions:
            lines.append(f"PARTITIONED BY ({', '.join(partitions)})")
    return "\n".join(lines) + ";"


def build_stream_ddl(table, storage):
    """Формирует отдельные PA-, HIST- и STG-DDL одного потока."""
    pa_table = table["pa_table"]
    hist_table = table["hist_table"]
    stg_table = table["stg_table"]
    schema, name = split_pa_name(pa_table["name"])
    hist_schema, hist_name = split_pa_name(hist_table["name"])
    stg_schema, stg_name = split_pa_name(stg_table["name"])
    partitions = [value.strip() for value in table["partitioning"]["expressions"]]
    pa_ddl = render_create_table(
        schema,
        name,
        pa_table["columns"],
        storage,
        partitions,
    )

    hist_ddl = render_create_table(
        hist_schema,
        hist_name,
        hist_table["columns"],
        storage,
        [CTL_VALIDTO],
    )
    stg_ddl = render_create_table(
        stg_schema,
        stg_name,
        stg_table["columns"],
        storage,
        [],
    )

    return name, {
        "pa_table": {
            "name": pa_table["name"],
            "create_table": pa_ddl.splitlines(),
        },
        "hist_table": {
            "name": hist_table["name"],
            "create_table": hist_ddl.splitlines(),
        },
        "stg_table": {
            "name": stg_table["name"],
            "create_table": stg_ddl.splitlines(),
        },
    }
