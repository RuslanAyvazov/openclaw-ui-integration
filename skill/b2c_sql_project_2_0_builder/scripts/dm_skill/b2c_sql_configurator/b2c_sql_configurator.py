import json
from pathlib import Path

from constants import (
    COALESCE_TEMPLATE,
    CONFIG_TEMPLATE,
    DQC_TEMPLATE,
    ICEBERG_HISTORICITY_TEMPLATE,
    ICEBERG_MODE_ARCHIVE,
    ICEBERG_MODE_INCREMENTAL,
    ICEBERG_TEMPLATES,
    MOVE_TABLE_TEMPLATE,
    PARQUET_HISTORICITY_TEMPLATE,
    PARQUET_TEMPLATES,
    STG_TEMPLATE,
    SUPPORTED_STORAGES,
)
from errors import (
    B2CSQLConfigurationError,
    DML_PATH_REQUIRED,
    UNSUPPORTED_STORAGE,
)
from helpers.context_contract import split_pa_name, validated_tables
from helpers.context_io import read_json, write_json
from helpers.dml_scripts import read_dml_scripts
from helpers.templates import render_json_template, render_template


TEMPLATES = Path(__file__).resolve().parent / "templates"


def quoted_list(values):
    """Формирует перечень SQL-строк в двойных кавычках через запятую."""
    return ", ".join(json.dumps(str(value).strip(), ensure_ascii=False) for value in values)


def csv_list(values):
    """Формирует строку имён полей через запятую для параметров DQC."""
    return ", ".join(str(value).strip() for value in values)


def column_names(columns):
    """Формирует многострочный список имён полей STG для INSERT INTO."""
    return "\n".join(
        f"    {str(column['name']).strip()}"
        + ("," if index < len(columns) - 1 else "")
        for index, column in enumerate(columns)
    )


def build_iceberg_stream_configs(table, dml_scripts, stream_ddl):
    """Формирует инкрементальный и архивный графы Iceberg для одной таблицы."""
    pa_name = table["pa_table"]["name"]
    _, stream = split_pa_name(pa_name)
    stg_columns = table["stg_table"]["columns"]
    stg_ddl = stream_ddl["stg_table"]
    templates = TEMPLATES / ICEBERG_TEMPLATES
    module_values = {
        "context_config.validator.tables[].pa_table.name": pa_name,
        "context_config.validator.tables[].hist_table.name": table["hist_table"]["name"],
        "context_config.validator.tables[].stg_table.name": table["stg_table"]["name"],
        "context_config.ddl[current_table].stg_table.name": stg_ddl["name"],
        "context_config.ddl[current_table].stg_table.create_table": "\n".join(
            stg_ddl["create_table"]
        ),
        "context_config.validator.tables[].stg_table.columns.names": column_names(
            stg_columns
        ),
        "context_config.validator.tables[].business_attributes.columns": quoted_list(
            table["business_attributes"]["columns"]
        ),
        "context_config.validator.tables[].primary_key.columns": quoted_list(
            table["primary_key"]["columns"]
        ),
    }
    move_table_sql = render_template(
        templates / MOVE_TABLE_TEMPLATE,
        module_values,
    )
    coalesce_sql = render_template(
        templates / COALESCE_TEMPLATE,
        module_values,
    )
    dqc_config = render_json_template(
        templates / DQC_TEMPLATE,
        {
            **module_values,
            "context_config.validator.tables[].primary_key.columns": csv_list(
                table["primary_key"]["columns"]
            ),
        },
    )

    result = {}
    modes = (
        ("inc", ICEBERG_MODE_INCREMENTAL, "DML_inc.sql"),
        ("arc", ICEBERG_MODE_ARCHIVE, "DML_arc.sql"),
    )
    for name, mode, dml_file in modes:
        stg_sql = render_template(
            templates / STG_TEMPLATE,
            {
                **module_values,
                "dml_scripts_json[current_table][DML_inc.sql|DML_arc.sql]": dml_scripts[
                    dml_file
                ],
            },
        )
        historicity_sql = render_template(
            templates / ICEBERG_HISTORICITY_TEMPLATE,
            {**module_values, "rule.inc=baseline;arc=full_reload": mode},
        )
        result[name] = render_json_template(
            templates / CONFIG_TEMPLATE,
            {
                "rendered_template.stg.template.sql": json.dumps(
                    stg_sql.splitlines(),
                    ensure_ascii=False,
                ),
                "rendered_template.historicity.template.sql": json.dumps(
                    historicity_sql.splitlines(),
                    ensure_ascii=False,
                ),
                "rendered_template.dqc.template.json": json.dumps(
                    dqc_config,
                    ensure_ascii=False,
                ),
                "rendered_template.move_table.template.sql": json.dumps(
                    move_table_sql.splitlines(),
                    ensure_ascii=False,
                ),
                "rendered_template.coalesce.template.sql": json.dumps(
                    coalesce_sql.splitlines(),
                    ensure_ascii=False,
                ),
            },
        )
    return stream, result


def build_parquet_stream_configs(table, dml_scripts, stream_ddl):
    """Формирует STG, historicity, DQC, move_table и coalesce одной таблицы."""
    _, stream = split_pa_name(table["pa_table"]["name"])
    stg_columns = table["stg_table"]["columns"]
    stg_ddl = stream_ddl["stg_table"]
    pa_schema, pa_table_name = split_pa_name(stream_ddl["pa_table"]["name"])
    stg_schema, stg_table_name = split_pa_name(stg_ddl["name"])
    business_history = table["business_history"]["columns"]
    is_reference = "start_dttm" in {
        str(column).strip().casefold() for column in business_history
    }
    target_type = "dim" if is_reference else "fact"
    business_date = next(
        (
            str(column).strip()
            for column in business_history
            if str(column).strip().casefold()
            == ("start_dttm" if is_reference else "report_dt")
        ),
        "start_dttm" if is_reference else "report_dt",
    )
    templates = TEMPLATES / PARQUET_TEMPLATES
    module_values = {
        "rule.start_dttm_in_business_history=dim;otherwise=fact": target_type,
        "context_config.validator.tables[].stg_table.name": table["stg_table"]["name"],
        "context_config.ddl[current_table].pa_table.name": stream_ddl["pa_table"][
            "name"
        ],
        "context_config.ddl[current_table].hist_table.name": stream_ddl[
            "hist_table"
        ]["name"],
        "context_config.ddl[current_table].stg_table.name": stg_ddl["name"],
        "context_config.ddl[current_table].stg_table.create_table": "\n".join(
            stg_ddl["create_table"]
        ),
        "rule.table_name(context_config.ddl[current_table].pa_table.name)": pa_table_name,
        "rule.schema_name(context_config.ddl[current_table].pa_table.name)": pa_schema,
        "rule.table_name(context_config.ddl[current_table].stg_table.name)": stg_table_name,
        "rule.schema_name(context_config.ddl[current_table].stg_table.name)": stg_schema,
        "context_config.validator.tables[].stg_table.columns.names": column_names(
            stg_columns
        ),
        "context_config.validator.tables[].primary_key.columns": csv_list(
            table["primary_key"]["columns"]
        ),
        "context_config.validator.tables[].business_attributes.columns": csv_list(
            table["business_attributes"]["columns"]
        ),
        "context_config.validator.tables[].business_history.columns.business_date": business_date,
        "context_config.validator.tables[].pa_table.name": table["pa_table"]["name"],
        "context_config.validator.tables[].hist_table.name": table["hist_table"]["name"],
    }
    stg_sql = render_template(
        templates / STG_TEMPLATE,
        {
            **module_values,
            "dml_scripts_json[current_table][DML_inc.sql]": dml_scripts[
                "DML_inc.sql"
            ],
        },
    )
    historicity_sql = render_template(
        templates / PARQUET_HISTORICITY_TEMPLATE,
        module_values,
    )
    coalesce_sql = render_template(
        templates / COALESCE_TEMPLATE,
        module_values,
    )
    dqc_config = render_json_template(
        templates / DQC_TEMPLATE,
        module_values,
    )
    move_table_sql = render_template(
        templates / MOVE_TABLE_TEMPLATE,
        module_values,
    )

    result = {
        "inc": render_json_template(
            templates / CONFIG_TEMPLATE,
            {
                "rendered_template.stg.template.sql": json.dumps(
                    stg_sql.splitlines(),
                    ensure_ascii=False,
                ),
                "rendered_template.historicity.template.sql": json.dumps(
                    historicity_sql.splitlines(),
                    ensure_ascii=False,
                ),
                "rendered_template.coalesce.template.sql": json.dumps(
                    coalesce_sql.splitlines(),
                    ensure_ascii=False,
                ),
                "rendered_template.dqc.template.json": json.dumps(
                    dqc_config,
                    ensure_ascii=False,
                ),
                "rendered_template.move_table.template.sql": json.dumps(
                    move_table_sql.splitlines(),
                    ensure_ascii=False,
                ),
            },
        )
    }
    return stream, result


def add_b2c_sql_configs(context_path, dml_scripts_path, storage, output_path=None):
    """Добавляет B2C SQL-конфигурации выбранного формата в общий JSON."""
    storage = str(storage).strip().casefold()
    if storage not in SUPPORTED_STORAGES:
        raise B2CSQLConfigurationError(
            UNSUPPORTED_STORAGE.format(storage=storage)
        )

    context_path = Path(context_path)
    output_path = Path(output_path) if output_path else context_path
    context = read_json(context_path)
    tables = validated_tables(context)
    if not dml_scripts_path:
        raise B2CSQLConfigurationError(DML_PATH_REQUIRED)

    required_dml_files = (
        ("DML_inc.sql", "DML_arc.sql")
        if storage == "iceberg"
        else ("DML_inc.sql",)
    )
    dml_scripts = read_dml_scripts(
        dml_scripts_path,
        tables,
        required_files=required_dml_files,
    )
    if storage == "iceberg":
        configs = (
            build_iceberg_stream_configs(
                table,
                dml_scripts[split_pa_name(table["pa_table"]["name"])[1]],
                context["ddl"][split_pa_name(table["pa_table"]["name"])[1]],
            )
            for table in tables
        )
    else:
        configs = (
            build_parquet_stream_configs(
                table,
                dml_scripts[split_pa_name(table["pa_table"]["name"])[1]],
                context["ddl"][split_pa_name(table["pa_table"]["name"])[1]],
            )
            for table in tables
        )

    context["b2c_sql_configs"] = dict(configs)
    write_json(output_path, context)
    return output_path.resolve(), len(tables)
