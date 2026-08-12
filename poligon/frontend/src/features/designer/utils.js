import { ICON_MAP } from './constants';
import {
    buildHistoricitySql, buildMoveTableSql, buildCoalesceSql,
    buildConfigJson, placeholderSql,
} from '../../shared/etlTemplates';

export function getIcon(type, subtype) {
    return (ICON_MAP[type] && ICON_MAP[type][subtype]) || 'fas fa-cube';
}

// Auto-generate SQL function call from element params.
// Uses the canonical iceberg_pckg formats (b2c-sql-project/references) so the
// preview matches what lands in the stream files on commit.
export function generateSql(element) {
    const p = element.params || {};

    if (element.type === 'query' && element.subtype === 'history') {
        return buildHistoricitySql(p).trimEnd() + ';';
    }
    if (element.type === 'insert' && element.subtype === 'coalesce') {
        return buildCoalesceSql(p).trimEnd() + ';';
    }
    if (element.type === 'insert' && element.subtype === 'move2pa') {
        return buildMoveTableSql(p).trimEnd() + ';';
    }
    return '';
}

// ── Stream file generation (designer page → etl/<stream>/ files) ───────────
// Canvas elements fill the canonical files:
//   SQL Transform (query/transform)       → DML.sql
//   Историчность (query/history)          → historicity.sql
//   Move2PA (insert/move2pa)              → move_table.sql
//   Coalesce (insert/coalesce)            → coalesce.sql
// Ribbon DDL config (ddlConfig.script)    → DDL.sql
export function buildStreamFilesFromPage(page, ddlConfig, streamName) {
    const els = page?.elements || [];
    const find = (type, subtype) => els.find(e => e.type === type && e.subtype === subtype);

    const transform = find('query', 'transform');
    const history   = find('query', 'history');
    const move2pa   = find('insert', 'move2pa');
    const coalesce  = find('insert', 'coalesce');

    const ddlCode = (ddlConfig?.script?.code || '').trim();
    const dmlSql  = (transform?.params?.sql || '').trim();

    return {
        'DDL.sql': ddlCode
            ? ddlCode + '\n'
            : placeholderSql('DDL.sql', 'заполняется через кнопку DDL на Ribbon-панели конструктора'),
        'DML.sql': dmlSql
            ? dmlSql + '\n'
            : placeholderSql('DML.sql', 'загрузка инкремента в staging (SQL Transform на Canvas)'),
        'historicity.sql': history
            ? buildHistoricitySql(history.params)
            : placeholderSql('historicity.sql', 'модуль «Историчность данных» на Canvas'),
        'move_table.sql': move2pa
            ? buildMoveTableSql(move2pa.params)
            : placeholderSql('move_table.sql', 'модуль «Move2PA» на Canvas'),
        'coalesce.sql': coalesce
            ? buildCoalesceSql(coalesce.params)
            : placeholderSql('coalesce.sql', 'модуль «Coalesce» на Canvas'),
        'b2c_sql_config.json': buildConfigJson(streamName || page?.stream || page?.name || 'stream', {
            stg: !!dmlSql,
            historicity: !!history,
            move2pa: !!move2pa,
            coalesce: !!coalesce,
        }),
    };
}
