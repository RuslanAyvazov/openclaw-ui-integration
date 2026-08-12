import json
import re
from pathlib import Path

from errors import (
    B2CSQLConfigurationError,
    TEMPLATE_JSON_FAILED,
    TEMPLATE_READ_FAILED,
    TEMPLATE_RENDER_FAILED,
)


PLACEHOLDER = re.compile(r"\$\{([^{}]+)\}")


def render_template(path, values):
    """Заменяет заполнители, включая имена с путями через точку."""
    path = Path(path)
    try:
        source = path.read_text(encoding="utf-8")
    except Exception as error:
        raise B2CSQLConfigurationError(
            TEMPLATE_READ_FAILED.format(path=path, reason=error)
        ) from error

    try:
        missing = sorted(
            {
                match.group(1)
                for match in PLACEHOLDER.finditer(source)
                if match.group(1) not in values
            }
        )
        if missing:
            raise KeyError(", ".join(missing))
        return PLACEHOLDER.sub(
            lambda match: str(values[match.group(1)]),
            source,
        ).strip()
    except Exception as error:
        raise B2CSQLConfigurationError(
            TEMPLATE_RENDER_FAILED.format(path=path, reason=error)
        ) from error


def render_json_template(path, values):
    """Заполняет JSON-шаблон и возвращает готовый объект конфигурации."""
    rendered = render_template(path, values)
    try:
        return json.loads(rendered)
    except Exception as error:
        raise B2CSQLConfigurationError(
            TEMPLATE_JSON_FAILED.format(path=path, reason=error)
        ) from error
