class S2TValidationError(Exception):
    """Ошибка структуры листа Target columns."""

    def __init__(self, errors):
        self.errors = errors
        details = "\n".join(f"- {error}" for error in errors)
        super().__init__(f"Проверка S2T не пройдена:\n{details}")


FILE_NOT_FOUND = "Файл не найден: {path}"
READ_FAILED = "Не удалось прочитать Excel-файл: {reason}"
SHEET_NOT_FOUND = "В файле нет листа 'Target columns'."
MISSING_COLUMNS = "На листе 'Target columns' нет столбцов: {columns}."
NO_DATA = "На листе 'Target columns' нет строк с описанием полей."
EMPTY_VALUES = "Столбец '{column}' содержит пустые значения. Строки Excel: {rows}."
PK_EMPTY_VALUES = "Столбец 'T-col-pk' содержит пустые значения. Строки Excel: {rows}."
INVALID_PK_VALUES = "Столбец 'T-col-pk' допускает только yes/no. Найдено: {values}. Строки Excel: {rows}."
TABLE_WITHOUT_PK = "Для таблицы {table} не указано ни одного поля PK (T-col-pk=yes)."
END_DTTM_PK_REQUIRES_START = "Поле end_dttm таблицы {table} может быть PK только вместе со start_dttm. Укажите T-col-pk=yes для start_dttm. Строки Excel: {rows}."
DUPLICATE_TABLE_COLUMN = "В таблице {table} поле {column} указано несколько раз. Строки Excel: {rows}."
DUPLICATE_STREAM_NAME = "Имя потока {stream} повторяется у таблиц: {tables}."
REFERENCE_PK_COUNT = "У справочника {table} должно быть не менее {minimum} полей PK; найдено: {actual}."
HISTORY_PAIR = "Таблица {table} должна содержать ровно по одному полю start_dttm и end_dttm либо не содержать их вовсе."
FACT_AGGREGATE_REPORT_DT = "В таблице фактов/агрегатов {table} отсутствует обязательное поле report_dt."
FACT_AGGREGATE_NAME = "Имя таблицы фактов/агрегатов {table} должно содержать t_fct или t_agr."
DIMENSION_NAME = "Имя таблицы-справочника {table} должно содержать t_dim."
REFERENCE_ROW_HASH = "В таблице-справочнике {table} отсутствует обязательное поле row_hash."
HISTORY_TYPE = "Поле {column} таблицы {table} должно иметь тип timestamp; найдено: {actual}."
TECH_FIELD_MISSING = "В таблице {table} отсутствует техническое поле {column}."
TECH_FIELD_TYPE = "Поле {column} таблицы {table} должно иметь тип {expected}; найдено: {actual}."
PARTITION_COLUMN_UNKNOWN = "Поле партиционирования {column} таблицы {table} отсутствует среди T-col-name."
