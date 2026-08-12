class B2CSQLConfigurationError(Exception):
    """Ошибка формирования B2C SQL-конфигураций."""

    def __init__(self, errors):
        errors = errors if isinstance(errors, list) else [errors]
        self.errors = errors
        details = "\n".join(f"- {error}" for error in errors)
        super().__init__(f"B2C SQL-конфигурации не сформированы:\n{details}")


FILE_NOT_FOUND = "Файл не найден: {path}"
JSON_READ_FAILED = "Не удалось прочитать общий JSON: {reason}"
JSON_WRITE_FAILED = "Не удалось сохранить общий JSON: {reason}"
ROOT_NOT_OBJECT = "Корень общего JSON должен быть объектом."
VALIDATOR_MISSING = "В общем JSON отсутствует объект validator."
TABLES_MISSING = "В validator.tables отсутствует список таблиц."
DDL_MISSING = "В общем JSON отсутствует сформированный раздел ddl."
INVALID_PA_NAME = "У таблицы с индексом {index} некорректное pa_table.name: {value}."
INVALID_HIST_NAME = "У таблицы с индексом {index} некорректное hist_table.name: {value}."
INVALID_STG_NAME = "У таблицы с индексом {index} некорректное stg_table.name: {value}."
COLUMNS_MISSING = "У таблицы {table} отсутствует непустой список columns."
PRIMARY_KEY_MISSING = "У таблицы {table} отсутствует непустой primary_key.columns."
STREAM_DDL_MISSING = "В разделе ddl отсутствует поток {stream}."
TABLE_DDL_MISSING = "В ddl.{stream}.{table_key} отсутствуют name или create_table."
TABLE_DDL_NAME_MISMATCH = "Имя в ddl.{stream}.{table_key}.name ({ddl_name}) не совпадает с validator ({validator_name})."
DUPLICATE_STREAM = "Имя потока {stream} повторяется."
UNSUPPORTED_STORAGE = "Неподдерживаемый формат хранения: {storage}."
DML_PATH_REQUIRED = "Необходимо передать путь к JSON с DML-скриптами."
DML_FILE_NOT_FOUND = "Файл с DML-скриптами не найден: {path}"
DML_JSON_READ_FAILED = "Не удалось прочитать JSON с DML-скриптами: {reason}"
DML_ROOT_INVALID = "Корень JSON с DML-скриптами должен быть объектом."
DML_STREAM_MISSING = "Для потока {stream} не переданы DML-скрипты."
DML_SCRIPT_MISSING = "Для потока {stream} отсутствует непустой скрипт {script}."
DML_STREAM_UNKNOWN = "В DML передан неизвестный поток {stream}."
DML_STREAM_DUPLICATE = "Имя потока {stream} повторяется в DML без учёта регистра."
DML_SELECT_PARSE_FAILED = "Не удалось разобрать внешний SELECT скрипта {script} потока {stream}: {reason}."
DML_SELECT_WILDCARD = "Внешний SELECT скрипта {script} потока {stream} содержит *. Перечислите все выходные поля явно."
DML_OUTPUT_COLUMN_UNKNOWN = "Не удалось определить выходное имя поля в скрипте {script} потока {stream}: {expression}. Укажите явный псевдоним AS <имя>."
DML_OUTPUT_COLUMN_DUPLICATE = "Во внешнем SELECT скрипта {script} потока {stream} повторяются выходные поля: {columns}."
DML_STG_COLUMNS_MISMATCH = "Поля внешнего SELECT скрипта {script} потока {stream} не совпадают со stg_table.columns. Отсутствуют: {missing}. Лишние: {extra}."
TEMPLATE_READ_FAILED = "Не удалось прочитать шаблон {path}: {reason}"
TEMPLATE_RENDER_FAILED = "Не удалось заполнить шаблон {path}: {reason}"
TEMPLATE_JSON_FAILED = "Шаблон {path} сформировал некорректный JSON: {reason}"
