class InputPackageError(Exception):
    """Ошибка полноты входного пакета."""

    def __init__(self, errors):
        errors = errors if isinstance(errors, list) else [errors]
        self.errors = errors
        details = "\n".join(f"- {error}" for error in errors)
        super().__init__(f"Проверка входного пакета не пройдена:\n{details}")


S2T_FILE_MISSING = "Файл S2T не найден: {path}"
DML_PATH_MISSING = "Не передан файл с SQL-прототипами (--dml-json)."
DML_FILE_MISSING = "Файл с SQL-прототипами не найден: {path}"
CONTEXT_READ_FAILED = "Не удалось прочитать результат валидатора: {reason}"
DML_READ_FAILED = "Не удалось прочитать JSON с SQL-прототипами: {reason}"
DML_ROOT_INVALID = "Корень JSON с SQL-прототипами должен быть объектом."
TABLES_MISSING = "В результате валидатора отсутствует список таблиц."
TABLE_NAME_INVALID = "У таблицы с индексом {index} отсутствует pa_table.name."
STREAM_DUPLICATE = "Таблица {stream} повторяется в SQL-прототипах без учёта регистра."
STREAM_UNKNOWN = "Переданы SQL-прототипы для неизвестной таблицы {stream}."
STREAM_VALUE_INVALID = "SQL-прототипы таблицы {stream} должны быть объектом."
SCRIPT_UNKNOWN = "Для таблицы {stream} передан неожиданный прототип {script}."
