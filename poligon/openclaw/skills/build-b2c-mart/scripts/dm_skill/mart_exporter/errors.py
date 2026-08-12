class MartExportError(Exception):
    """Ошибка раскладки общего контекста в каталог витрины."""


FILE_NOT_FOUND = "Файл context_config.json не найден: {path}"
JSON_READ_FAILED = "Не удалось прочитать context_config.json: {reason}"
CONFIGS_MISSING = "В context_config.json отсутствует непустой b2c_sql_configs."
INVALID_NAME = "Некорректное имя {kind}: {name}."
INVALID_MODES = "Для таблицы {table} отсутствуют режимы потоков."
INVALID_CONFIG = "Конфигурация потока {stream} должна быть JSON-объектом."
INVALID_THREADS = "В конфигурации потока {stream} отсутствует treadConfigs."
INVALID_STAGES = "В модуле {module} потока {stream} отсутствует stages."
INVALID_FILEGSQL = "Поле filegsql модуля {module} потока {stream} должно быть строкой или массивом строк."
INVALID_FILEDQC = "Поле filedqc модуля {module} потока {stream} должно быть JSON-объектом."
DUPLICATE_FILE = "В потоке {stream} повторяется имя выходного файла {file}."
WRITE_FAILED = "Не удалось собрать витрину {path}: {reason}"

