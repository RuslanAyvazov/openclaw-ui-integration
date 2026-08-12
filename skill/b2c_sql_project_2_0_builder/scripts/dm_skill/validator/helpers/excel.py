import warnings
from pathlib import Path

import pandas as pd

from constants import (
    DESCRIPTION_COLUMN_PREFIX,
    DESCRIPTION_SCHEMA_PREFIX,
    EXCEL_ROW_OFFSET,
    REQUIRED_COLUMNS,
    TARGET_SHEET,
)
from helpers.frame_utils import norm, text
from validation_errors import (
    FILE_NOT_FOUND,
    NO_DATA,
    READ_FAILED,
    SHEET_NOT_FOUND,
    S2TValidationError,
)
def read_target_columns(path):
    """Открывает Excel-файл через Pandas и возвращает данные листа Target columns."""
    path = Path(path)
    if not path.is_file():
        raise S2TValidationError([FILE_NOT_FOUND.format(path=path)])

    try:
        with warnings.catch_warnings():
            warnings.filterwarnings(
                "ignore",
                message="Data Validation extension is not supported.*",
                category=UserWarning,
                module="openpyxl.*",
            )
            with pd.ExcelFile(path, engine="openpyxl") as book:
                if TARGET_SHEET not in book.sheet_names:
                    raise S2TValidationError([SHEET_NOT_FOUND])
                return pd.read_excel(book, sheet_name=TARGET_SHEET)
    except S2TValidationError:
        raise
    except Exception as error:
        raise S2TValidationError([READ_FAILED.format(reason=error)]) from error


def prepare_target_columns(frame):
    """Подготавливает прочитанные данные: удаляет служебную строку, очищает значения и запоминает отсутствующие столбцы."""
    missing = [column for column in REQUIRED_COLUMNS if column not in frame.columns]
    frame = frame.copy()
    frame["_excel_row"] = frame.index + EXCEL_ROW_OFFSET
    frame = frame.dropna(how="all", subset=[column for column in frame.columns if column != "_excel_row"])

    for column in missing:
        frame[column] = ""

    description = (
        frame["T-schema"].map(norm).str.startswith(DESCRIPTION_SCHEMA_PREFIX)
        & frame["T-col-name"].map(norm).str.startswith(DESCRIPTION_COLUMN_PREFIX)
    )
    frame = frame.loc[~description].copy()

    for column in REQUIRED_COLUMNS:
        frame[column] = frame[column].map(text)

    if frame.empty:
        raise S2TValidationError([NO_DATA])
    frame.attrs["missing_columns"] = missing
    return frame
