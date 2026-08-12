import json
import re
from pathlib import Path

from constants import CONTEXT_FORMAT_VERSION


def create_context_config(validator_result):
    """Создаёт общий JSON-контекст с результатом валидатора и пустыми следующими этапами."""
    return {
        "format_version": CONTEXT_FORMAT_VERSION,
        "validator": validator_result,
        "ddl": {},
        "b2c_sql_configs": {},
    }


def format_json(data):
    """Компактно записывает поля, ключи, бизнес-атрибуты и партиционирование."""
    text = json.dumps(data, ensure_ascii=False, indent=2)
    json_string = r'"(?:\\.|[^"\\])*"'
    column_pattern = rf'(?m)^(?P<indent> *)\{{\n(?P<inner> +)"name": (?P<name>{json_string}),\n(?P=inner)"type": (?P<type>{json_string})\n(?P=indent)\}}'
    text = re.sub(
        column_pattern,
        r'\g<indent>{"name": \g<name>, "type": \g<type>}',
        text,
    )
    list_pattern = rf'(?m)^(?P<indent> *)"(?P<section>primary_key|business_history|technical_history|tech_fields|business_attributes|partitioning)": \{{\n(?P=indent)  "(?P<field>columns|expressions)": (?P<items>\[(?:\s*{json_string}\s*,?)*\s*\])\n(?P=indent)\}}'

    def compact_list(match):
        items = json.loads(match.group("items"))
        compact_items = json.dumps(items, ensure_ascii=False)
        return (
            f'{match.group("indent")}"{match.group("section")}": '
            f'{{"{match.group("field")}": {compact_items}}}'
        )

    return re.sub(list_pattern, compact_list, text)


def write_json(path, data):
    """Атомарно сохраняет JSON, записывая каждое поле таблицы в одну строку."""
    path = Path(path)
    temporary = path.with_name(f"{path.name}.tmp")
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary.write_text(
        format_json(data) + "\n",
        encoding="utf-8",
    )
    temporary.replace(path)
