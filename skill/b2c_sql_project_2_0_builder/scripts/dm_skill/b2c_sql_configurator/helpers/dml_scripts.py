import json
from pathlib import Path

from errors import (
    B2CSQLConfigurationError,
    DML_FILE_NOT_FOUND,
    DML_JSON_READ_FAILED,
    DML_ROOT_INVALID,
    DML_SCRIPT_MISSING,
    DML_STREAM_DUPLICATE,
    DML_STREAM_MISSING,
    DML_STREAM_UNKNOWN,
)
from helpers.context_contract import split_pa_name
from helpers.sql_prototype import align_sql_prototype


DML_FILES = ("DML_inc.sql", "DML_arc.sql")


def read_dml_scripts(path, tables, required_files=DML_FILES):
    """Читает и проверяет требуемые DML-скрипты для каждого потока."""
    path = Path(path)
    if not path.is_file():
        raise B2CSQLConfigurationError(DML_FILE_NOT_FOUND.format(path=path))
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except Exception as error:
        raise B2CSQLConfigurationError(
            DML_JSON_READ_FAILED.format(reason=error)
        ) from error
    if not isinstance(payload, dict):
        raise B2CSQLConfigurationError(DML_ROOT_INVALID)

    expected = {}
    for table in tables:
        stream = split_pa_name(table["pa_table"]["name"])[1]
        expected[stream.casefold()] = {
            "stream": stream,
            "columns": [
                column["name"]
                for column in table["stg_table"]["columns"]
            ],
        }
    provided = {}
    errors = []
    for input_stream, scripts in payload.items():
        normalized = str(input_stream).strip().casefold()
        if normalized not in expected:
            errors.append(DML_STREAM_UNKNOWN.format(stream=input_stream))
            continue
        if normalized in provided:
            errors.append(DML_STREAM_DUPLICATE.format(stream=input_stream))
            continue
        provided[normalized] = scripts

    result = {}
    for normalized, specification in expected.items():
        stream = specification["stream"]
        scripts = provided.get(normalized)
        if not isinstance(scripts, dict):
            errors.append(DML_STREAM_MISSING.format(stream=stream))
            continue

        result[stream] = {}
        for script_name in required_files:
            content = scripts.get(script_name)
            if not isinstance(content, str) or not content.strip():
                errors.append(
                    DML_SCRIPT_MISSING.format(
                        stream=stream,
                        script=script_name,
                    )
                )
            else:
                aligned, sql_errors = align_sql_prototype(
                    content,
                    specification["columns"],
                    stream,
                    script_name,
                )
                errors.extend(sql_errors)
                result[stream][script_name] = aligned

    if errors:
        raise B2CSQLConfigurationError(errors)
    return result
