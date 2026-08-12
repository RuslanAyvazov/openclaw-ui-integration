from checks import CHECKS
from helpers.excel import prepare_target_columns, read_target_columns
from model_builder import build_validator_result
from validation_errors import S2TValidationError


def validate(path):
    frame = prepare_target_columns(read_target_columns(path))
    errors = []

    for check in CHECKS:
        errors.extend(check(frame))

    if errors:
        raise S2TValidationError(errors)

    return build_validator_result(frame)
