from constants import (
    AGGREGATE_TABLE_MARKER,
    CTL_ACTION,
    CTL_LOADING,
    CTL_VALIDFROM,
    DIM_TABLE_MARKER,
    END_DTTM,
    FACT_TABLE_MARKER,
    HISTORY_FIELDS,
    MIN_REFERENCE_PK_FIELDS,
    PK_VALUES,
    PK_YES,
    REQUIRED_VALUE_COLUMNS,
    REPORT_DT,
    ROW_HASH,
    START_DTTM,
    TYPE_STRING,
    TYPE_TIMESTAMP,
)
from helpers.frame_utils import (
    excel_rows,
    history_rows,
    is_reference_table,
    norm,
    table_groups,
)
from validation_errors import (
    DIMENSION_NAME,
    DUPLICATE_STREAM_NAME,
    DUPLICATE_TABLE_COLUMN,
    EMPTY_VALUES,
    END_DTTM_PK_REQUIRES_START,
    FACT_AGGREGATE_NAME,
    FACT_AGGREGATE_REPORT_DT,
    HISTORY_PAIR,
    HISTORY_TYPE,
    INVALID_PK_VALUES,
    MISSING_COLUMNS,
    PK_EMPTY_VALUES,
    PARTITION_COLUMN_UNKNOWN,
    REFERENCE_PK_COUNT,
    REFERENCE_ROW_HASH,
    TABLE_WITHOUT_PK,
    TECH_FIELD_MISSING,
    TECH_FIELD_TYPE,
)


def check_required_columns(frame):
    """Проверяет наличие на листе всех обязательных столбцов, нужных валидатору."""
    missing = frame.attrs.get("missing_columns", [])
    if not missing:
        return []
    return [MISSING_COLUMNS.format(columns=", ".join(missing))]


def check_required_values(frame):
    """Проверяет, что T-schema, T-name, T-col-name и T-col-type заполнены в каждой строке."""
    errors = []
    for column in REQUIRED_VALUE_COLUMNS:
        blank = frame[column].map(norm).eq("")
        if blank.any():
            errors.append(EMPTY_VALUES.format(column=column, rows=excel_rows(frame, blank)))
    return errors


def check_duplicate_columns(frame):
    """Проверяет отсутствие повторяющихся имён полей внутри каждой таблицы без учёта регистра."""
    errors = []
    for schema, name, table in table_groups(frame):
        normalized = table["T-col-name"].map(norm)
        duplicates = normalized.ne("") & normalized.duplicated(keep=False)
        for column in dict.fromkeys(normalized[duplicates]):
            rows = normalized.eq(column)
            display_name = table.loc[rows, "T-col-name"].iloc[0]
            errors.append(
                DUPLICATE_TABLE_COLUMN.format(
                    table=f"{schema}.{name}",
                    column=display_name,
                    rows=excel_rows(table, rows),
                )
            )
    return errors


def check_duplicate_stream_names(frame):
    """Проверяет уникальность имени потока, совпадающего с именем таблицы, без учёта регистра."""
    streams = {}
    for schema, name, _ in table_groups(frame):
        streams.setdefault(norm(name), []).append(f"{schema}.{name}")

    return [
        DUPLICATE_STREAM_NAME.format(
            stream=tables[0].split(".", 1)[1],
            tables=", ".join(tables),
        )
        for stream, tables in streams.items()
        if stream and len(tables) > 1
    ]


def check_pk_values(frame):
    """Проверяет, что T-col-pk заполнен в каждой строке и содержит только yes или no без учёта регистра."""
    errors = []
    pk = frame["T-col-pk"].map(norm)
    blank = pk.eq("")
    invalid = pk.ne("") & ~pk.isin(PK_VALUES)

    if blank.any():
        errors.append(PK_EMPTY_VALUES.format(rows=excel_rows(frame, blank)))
    if invalid.any():
        values = ", ".join(sorted(frame.loc[invalid, "T-col-pk"].unique()))
        errors.append(
            INVALID_PK_VALUES.format(values=values, rows=excel_rows(frame, invalid))
        )
    return errors


def check_table_has_pk(frame):
    """Проверяет, что в каждой таблице есть хотя бы одно поле с T-col-pk=yes."""
    errors = []
    for schema, name, table in table_groups(frame):
        if not table["T-col-pk"].map(norm).eq(PK_YES).any():
            errors.append(TABLE_WITHOUT_PK.format(table=f"{schema}.{name}"))
    return errors


def check_end_dttm_pk_requires_start(frame):
    """Проверяет, что end_dttm отмечен как PK только одновременно со start_dttm."""
    errors = []
    for schema, name, table in table_groups(frame):
        columns = table["T-col-name"].map(norm)
        primary_key = table["T-col-pk"].map(norm).eq(PK_YES)
        end_dttm_pk = columns.eq(END_DTTM) & primary_key
        start_dttm_pk = (columns.eq(START_DTTM) & primary_key).any()
        if end_dttm_pk.any() and not start_dttm_pk:
            errors.append(
                END_DTTM_PK_REQUIRES_START.format(
                    table=f"{schema}.{name}",
                    rows=excel_rows(table, end_dttm_pk),
                )
            )
    return errors


def check_partition_columns(frame):
    """Проверяет, что каждое непустое значение codePartition является полем своей таблицы."""
    errors = []
    for schema, name, table in table_groups(frame):
        columns = set(table["T-col-name"].map(norm))
        partitions = table["codePartition"].map(norm)
        for partition in dict.fromkeys(value for value in partitions if value):
            if partition not in columns:
                errors.append(
                    PARTITION_COLUMN_UNKNOWN.format(
                        table=f"{schema}.{name}",
                        column=partition,
                    )
                )
    return errors


def check_history_pair(frame):
    """Проверяет, что start_dttm и end_dttm либо отсутствуют оба, либо присутствуют ровно по одному разу."""
    errors = []
    for schema, name, table in table_groups(frame):
        history = history_rows(table)
        fields = set(history["T-col-name"].map(norm))
        if not history.empty and not (len(history) == 2 and fields == HISTORY_FIELDS):
            errors.append(HISTORY_PAIR.format(table=f"{schema}.{name}"))
    return errors


def check_fact_aggregate_report_dt(frame):
    """Проверяет наличие поля report_dt у каждой таблицы, не являющейся справочником."""
    errors = []
    for schema, name, table in table_groups(frame):
        if is_reference_table(table):
            continue
        if not table["T-col-name"].map(norm).eq(REPORT_DT).any():
            errors.append(FACT_AGGREGATE_REPORT_DT.format(table=f"{schema}.{name}"))
    return errors


def check_fact_aggregate_name(frame):
    """Проверяет наличие t_fct или t_agr в имени несправочной таблицы."""
    errors = []
    for schema, name, table in table_groups(frame):
        if is_reference_table(table):
            continue
        normalized_name = norm(name)
        if (
            FACT_TABLE_MARKER not in normalized_name
            and AGGREGATE_TABLE_MARKER not in normalized_name
        ):
            errors.append(FACT_AGGREGATE_NAME.format(table=f"{schema}.{name}"))
    return errors


def check_dimension_name(frame):
    """Проверяет наличие t_dim в имени справочника."""
    errors = []
    for schema, name, table in table_groups(frame):
        if is_reference_table(table) and DIM_TABLE_MARKER not in norm(name):
            errors.append(DIMENSION_NAME.format(table=f"{schema}.{name}"))
    return errors


def check_reference_row_hash(frame):
    """Проверяет наличие обязательного поля row_hash в каждой таблице-справочнике."""
    errors = []
    for schema, name, table in table_groups(frame):
        if is_reference_table(table) and not table["T-col-name"].map(norm).eq(ROW_HASH).any():
            errors.append(REFERENCE_ROW_HASH.format(table=f"{schema}.{name}"))
    return errors


def check_reference_pk_count(frame):
    """Проверяет, что у справочника со start_dttm и end_dttm не менее двух полей первичного ключа."""
    errors = []
    for schema, name, table in table_groups(frame):
        history = history_rows(table)
        if len(history) == 2 and set(history["T-col-name"].map(norm)) == HISTORY_FIELDS:
            pk_count = int(table["T-col-pk"].map(norm).eq(PK_YES).sum())
            if pk_count < MIN_REFERENCE_PK_FIELDS:
                errors.append(
                    REFERENCE_PK_COUNT.format(
                        table=f"{schema}.{name}",
                        minimum=MIN_REFERENCE_PK_FIELDS,
                        actual=pk_count,
                    )
                )
    return errors


def check_history_types(frame):
    """Проверяет, что поля start_dttm и end_dttm имеют тип timestamp."""
    errors = []
    for schema, name, table in table_groups(frame):
        history = history_rows(table)
        for column in sorted(HISTORY_FIELDS):
            rows = history[history["T-col-name"].map(norm).eq(column)]
            if len(rows) == 1:
                actual = norm(rows.iloc[0]["T-col-type"])
                if actual != TYPE_TIMESTAMP:
                    errors.append(
                        HISTORY_TYPE.format(
                            table=f"{schema}.{name}",
                            column=column,
                            actual=actual or "пусто",
                        )
                    )
    return errors


def check_ctl_validfrom(frame):
    """Проверяет наличие поля ctl_validfrom и соответствие его типа значению timestamp."""
    errors = []
    for schema, name, table in table_groups(frame):
        rows = table[table["T-col-name"].map(norm).eq(CTL_VALIDFROM)]
        table_id = f"{schema}.{name}"
        if rows.empty:
            errors.append(TECH_FIELD_MISSING.format(table=table_id, column=CTL_VALIDFROM))
        else:
            actual = sorted(set(rows["T-col-type"].map(norm)))
            if actual != [TYPE_TIMESTAMP]:
                errors.append(
                    TECH_FIELD_TYPE.format(
                        table=table_id,
                        column=CTL_VALIDFROM,
                        expected=TYPE_TIMESTAMP,
                        actual=", ".join(actual) or "пусто",
                    )
                )
    return errors


def check_ctl_action(frame):
    """Проверяет наличие поля ctl_action и соответствие его типа значению string."""
    errors = []
    for schema, name, table in table_groups(frame):
        rows = table[table["T-col-name"].map(norm).eq(CTL_ACTION)]
        table_id = f"{schema}.{name}"
        if rows.empty:
            errors.append(TECH_FIELD_MISSING.format(table=table_id, column=CTL_ACTION))
        else:
            actual = sorted(set(rows["T-col-type"].map(norm)))
            if actual != [TYPE_STRING]:
                errors.append(
                    TECH_FIELD_TYPE.format(
                        table=table_id,
                        column=CTL_ACTION,
                        expected=TYPE_STRING,
                        actual=", ".join(actual) or "пусто",
                    )
                )
    return errors


def check_ctl_loading(frame):
    """Проверяет наличие поля ctl_loading; тип данных этого поля не проверяется."""
    errors = []
    for schema, name, table in table_groups(frame):
        if not table["T-col-name"].map(norm).eq(CTL_LOADING).any():
            errors.append(
                TECH_FIELD_MISSING.format(table=f"{schema}.{name}", column=CTL_LOADING)
            )
    return errors
