import re
import unicodedata

import pandas as pd

from constants import HISTORY_FIELDS, MAX_ERROR_ROWS


def text(value):
    """Преобразует значение ячейки в строку, удаляет пробелы по краям и заменяет пустое значение на пустую строку."""
    return "" if pd.isna(value) else str(value).strip()


def norm(value):
    """Нормализует текст для сравнений: приводит пробелы и регистр к единому виду."""
    value = unicodedata.normalize("NFKC", text(value))
    return re.sub(r"\s+", " ", value).strip().casefold()


def excel_rows(frame, mask):
    """Возвращает номера строк Excel, в которых найдено нарушение проверяемого условия."""
    rows = frame.loc[mask, "_excel_row"].astype(int).tolist()
    shown = ", ".join(map(str, rows[:MAX_ERROR_ROWS]))
    return shown + (", ..." if len(rows) > MAX_ERROR_ROWS else "")


def table_groups(frame):
    """Разделяет строки по сочетанию схемы и таблицы и возвращает каждую таблицу отдельной группой."""
    groupable = frame[
        frame["T-schema"].map(norm).ne("") & frame["T-name"].map(norm).ne("")
    ]
    for (schema, name), table in groupable.groupby(["T-schema", "T-name"], sort=False):
        yield schema, name, table


def history_rows(table):
    """Выбирает из таблицы строки с полями бизнес-истории start_dttm и end_dttm."""
    return table[table["T-col-name"].map(norm).isin(HISTORY_FIELDS)]


def is_reference_table(table):
    """Определяет справочник по наличию ровно одного start_dttm и одного end_dttm."""
    history = history_rows(table)
    return len(history) == 2 and set(history["T-col-name"].map(norm)) == HISTORY_FIELDS
