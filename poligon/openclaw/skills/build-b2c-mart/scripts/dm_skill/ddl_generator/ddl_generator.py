from pathlib import Path

from helpers.context_contract import validated_tables
from helpers.context_io import read_json, write_json
from helpers.spark_ddl import build_stream_ddl


def add_ddl_to_context(context_path, storage, output_path=None):
    """Добавляет DDL потоков в общий JSON и возвращает путь и число потоков."""
    context_path = Path(context_path)
    output_path = Path(output_path) if output_path else context_path
    context = read_json(context_path)
    tables = validated_tables(context, storage)

    streams = dict(build_stream_ddl(table, storage) for table in tables)
    context["ddl"] = streams
    context.setdefault("b2c_sql_configs", {})

    write_json(output_path, context)
    return output_path.resolve(), len(streams)
