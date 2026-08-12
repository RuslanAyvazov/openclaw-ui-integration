class DDLGenerationError(Exception):
    """Ошибка входного контракта или формирования DDL."""

    def __init__(self, errors):
        errors = errors if isinstance(errors, list) else [errors]
        self.errors = errors
        details = "\n".join(f"- {error}" for error in errors)
        super().__init__(f"DDL не сформирован:\n{details}")


FILE_NOT_FOUND = "JSON-файл не найден: {path}"
JSON_READ_FAILED = "Не удалось прочитать JSON: {reason}"
JSON_WRITE_FAILED = "Не удалось сохранить JSON: {reason}"
ROOT_NOT_OBJECT = "Корень JSON должен быть объектом."
VALIDATOR_MISSING = "В JSON отсутствует объект validator."
TABLES_MISSING = "В validator.tables должен находиться непустой список таблиц."
TABLE_NOT_OBJECT = "validator.tables[{index}] должен быть объектом."
INVALID_PA_NAME = "Поле pa_table.name таблицы #{index} должно иметь формат schema.table; найдено: {value}."
INVALID_HIST_NAME = "Поле hist_table.name таблицы #{index} должно иметь формат schema.table; найдено: {value}."
INVALID_STG_NAME = "Поле stg_table.name таблицы #{index} должно иметь формат schema.table; найдено: {value}."
COLUMNS_MISSING = "Для таблицы {table} не задан непустой список columns."
COLUMN_NOT_OBJECT = "Элемент columns[{index}] таблицы {table} должен быть объектом."
COLUMN_VALUE_MISSING = "В columns[{index}] таблицы {table} отсутствует непустое поле {field}."
DUPLICATE_COLUMN = "В таблице {table} повторяется поле {column}."
PRIMARY_KEY_MISSING = "Для таблицы {table} не задан primary_key.columns."
UNKNOWN_PRIMARY_KEY = "Первичный ключ {column} таблицы {table} отсутствует среди columns."
PARTITIONING_INVALID = "Для таблицы {table} partitioning.expressions должен быть списком строк."
PARTITION_UNKNOWN_COLUMN = "Партиция {expression} таблицы {table} ссылается на отсутствующее поле {column}."
PARQUET_TRANSFORM = "Parquet-таблица {table} допускает только поля без transform; найдено: {expression}."
ICEBERG_TRANSFORM = "Недопустимое выражение партиционирования Iceberg для таблицы {table}: {expression}."
DUPLICATE_STREAM = "Имя потока {stream} повторяется в разных таблицах."
INVALID_STORAGE = "Допустимы только форматы хранения iceberg/parquet; найдено: {storage}."
