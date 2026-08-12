from sqlglot import ErrorLevel, exp, parse

from errors import (
    DML_OUTPUT_COLUMN_DUPLICATE,
    DML_OUTPUT_COLUMN_UNKNOWN,
    DML_SELECT_PARSE_FAILED,
    DML_SELECT_WILDCARD,
    DML_STG_COLUMNS_MISMATCH,
)


SQL_DIALECT = "spark"


def parse_outer_select(sql):
    """Разбирает один SQL-прототип и возвращает его внешний SELECT."""
    statements = parse(sql, read=SQL_DIALECT, error_level=ErrorLevel.RAISE)
    if len(statements) != 1:
        raise ValueError("должен быть ровно один SQL-запрос")
    query = statements[0]
    while isinstance(query, exp.Subquery):
        query = query.this
    if not isinstance(query, exp.Select):
        raise ValueError("верхний оператор должен быть SELECT без UNION/INTERSECT/EXCEPT")
    return query


def is_wildcard_projection(projection):
    """Проверяет, раскрывает ли элемент внешнего SELECT все поля через звёздочку."""
    expression = projection.this if isinstance(projection, exp.Alias) else projection
    return isinstance(expression, exp.Star) or (
        isinstance(expression, exp.Column)
        and isinstance(expression.this, exp.Star)
    )


def output_name(projection):
    """Возвращает выходное имя поля SELECT или None для выражения без псевдонима."""
    if isinstance(projection, exp.Alias):
        return projection.alias
    if isinstance(projection, exp.Column) and not is_wildcard_projection(projection):
        return projection.name
    return None


def align_sql_prototype(sql, expected_columns, stream, script):
    """Проверяет внешний SELECT и переставляет его поля в порядке STG."""
    try:
        select = parse_outer_select(sql)
    except Exception as error:
        reason = str(error).replace("\n", " ")[:300]
        return sql, [
            DML_SELECT_PARSE_FAILED.format(
                stream=stream,
                script=script,
                reason=reason,
            )
        ]

    projections = list(select.expressions)
    if any(is_wildcard_projection(projection) for projection in projections):
        return sql, [DML_SELECT_WILDCARD.format(stream=stream, script=script)]

    names = [output_name(projection) for projection in projections]
    unknown = [
        projections[index]
        for index, name in enumerate(names)
        if not name
    ]
    if unknown:
        expression = unknown[0].sql(dialect=SQL_DIALECT).replace("\n", " ")[:160]
        return sql, [
            DML_OUTPUT_COLUMN_UNKNOWN.format(
                stream=stream,
                script=script,
                expression=expression,
            )
        ]

    normalized_names = [name.casefold() for name in names]
    duplicates = sorted(
        {name for name in normalized_names if normalized_names.count(name) > 1}
    )
    if duplicates:
        return sql, [
            DML_OUTPUT_COLUMN_DUPLICATE.format(
                stream=stream,
                script=script,
                columns=", ".join(duplicates),
            )
        ]

    normalized_expected = [column.casefold() for column in expected_columns]
    actual_set = set(normalized_names)
    expected_set = set(normalized_expected)
    if actual_set != expected_set:
        missing = [
            expected_columns[index]
            for index, name in enumerate(normalized_expected)
            if name not in actual_set
        ]
        extra = [
            names[index]
            for index, name in enumerate(normalized_names)
            if name not in expected_set
        ]
        return sql, [
            DML_STG_COLUMNS_MISMATCH.format(
                stream=stream,
                script=script,
                missing=", ".join(missing) or "нет",
                extra=", ".join(extra) or "нет",
            )
        ]

    if normalized_names == normalized_expected:
        return sql, []

    projections_by_name = dict(zip(normalized_names, projections))
    select.set(
        "expressions",
        [projections_by_name[name].copy() for name in normalized_expected],
    )
    return select.sql(dialect=SQL_DIALECT, pretty=True), []
