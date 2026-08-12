// Canonical B2CSQL stream artifacts (per b2c-sql-project/SKILL.md).
//
// Stream canon (flat files inside etl/<stream>/):
//   DDL.sql, DML.sql, historicity.sql, move_table.sql, coalesce.sql,
//   ctl.yml, mart.yml, b2c_sql_config.json
// Mart root also has resources/devops.json.
//
// This module is dependency-free: it is imported by feature mocks, the
// branch store and the designer alike.

export const STREAM_SQL_FILES = ['DDL.sql', 'DML.sql', 'historicity.sql', 'move_table.sql', 'coalesce.sql'];
export const STREAM_FILES = [...STREAM_SQL_FILES, 'ctl.yml', 'mart.yml', 'b2c_sql_config.json'];

// ── Value formatting (per etl-modules-generation.md) ───────────────────────
// List args are comma-separated quoted strings: `"col1", "col2"` (never arrays);
// empty args are `""`.

function quote(v) {
    return `"${(v ?? '').toString().trim()}"`;
}

function quoteList(v) {
    const s = (v ?? '').toString().trim();
    if (!s) return '""';
    if (s.includes('"')) return s; // already in canonical quoted form
    const parts = s.split(',').map(x => x.trim()).filter(Boolean);
    return parts.length ? parts.map(x => `"${x}"`).join(', ') : '""';
}

// Turns `"a", "b"` back into the display form `a, b` (used for element params).
function unquoteList(raw) {
    const s = (raw ?? '').toString().trim();
    if (!s) return '';
    const matches = [...s.matchAll(/"([^"]*)"/g)].map(m => m[1]).filter(Boolean);
    if (matches.length) return matches.join(', ');
    return s.replace(/^["']|["']$/g, '');
}

// ── Module file builders ────────────────────────────────────────────────────

export function buildHistoricitySql(p = {}) {
    return `iceberg_pckg.historicity(
    mode                     = ${quote(p.mode || 'baseline')},
    pa_table                 = ${quote(p.pa_table)},
    incr_table               = ${quote(p.incr_table)},
    hist_table               = ${quote(p.hist_table)},
    mapping_inc              = ${quoteList(p.mapping_inc)},
    mapping_pa               = ${quoteList(p.mapping_pa)},
    pk_inc                   = ${quoteList(p.pk_inc)},
    pk_pa                    = ${quoteList(p.pk_pa)},
    hash_policy_inc          = "",
    hash_policy_pa           = "",
    dedup_policy_inc         = "",
    dedup_policy_pa          = "",
    partial_reload_time_mark = ""
)
`;
}

export function buildMoveTableSql(p = {}) {
    return `iceberg_pckg.move_table(
    pa_table = ${quote(p.pa_table)},
    hist_table = ${quote(p.hist_table)}
)
`;
}

export function buildCoalesceSql(p = {}) {
    const tables = (p.tables ?? '').toString().trim()
        || [p.pa_table, p.hist_table].filter(Boolean).join(', ');
    const num = (v, dflt) => {
        const n = Number(v);
        return Number.isFinite(n) && `${v}`.trim() !== '' ? n : dflt;
    };
    const strOrNull = (v) => {
        const s = (v ?? '').toString().trim();
        return s ? `'${s}'` : 'null';
    };
    return `iceberg_pckg.coalesce(
    tables = ${quote(tables)},
    target_file_size_mb = ${num(p.target_file_size_mb, 128)},
    compression_codec = '${(p.compression_codec ?? '').toString().trim() || 'zstd'}',
    parallel_degree = ${num(p.parallel_degree, 8)},
    snapshot_retention = ${num(p.snapshot_retention, 5)},
    rewrite_manifests = true,
    delete_orphan_files = true,
    exclude_partitions = ${strOrNull(p.exclude_partitions)},
    include_partitions = ${strOrNull(p.include_partitions)},
    analyze_by = '${(p.analyze_by ?? '').toString().trim() || 'abc'}',
    custom_strategy = ${strOrNull(p.custom_strategy)}
)
`;
}

// b2c_sql_config.json — execution graph. DDL.sql is not part of the graph.
export function buildConfigJson(streamName, enabled = {}) {
    const step = (name, file) => ({
        name,
        stages: [{
            config: { filePath: `{{hdfs_path_app_full}}/etl/${streamName}/${file}` },
            enabled: enabled[name] !== false,
            name: 'PreStage',
        }],
    });
    return JSON.stringify({
        appConfig: {},
        treadConfigs: [
            step('stg', 'DML.sql'),
            step('historicity', 'historicity.sql'),
            step('move2pa', 'move_table.sql'),
            step('coalesce', 'coalesce.sql'),
        ],
        treadRelations: [
            { from: 'stg', to: 'historicity' },
            { from: 'historicity', to: 'move2pa' },
            { from: 'move2pa', to: 'coalesce' },
        ],
    }, null, 2) + '\n';
}

export const DEFAULT_DEVOPS_JSON = `{
  "spark.executor.instances": 6,
  "spark.executor.memory": "4g",
  "spark.executor.cores": 2,
  "spark.driver.memory": "2g",
  "spark.sql.shuffle.partitions": 200,
  "spark.dynamicAllocation.enabled": true,
  "spark.dynamicAllocation.maxExecutors": 12
}
`;

export function placeholderSql(fileName, hint) {
    return `-- ${fileName}\n-- ${hint}\n`;
}

// ── Parsing (module SQL → element params; agent reply → project files) ─────

// Extracts `key = value` args from an iceberg_pckg.<fn>(...) call.
// Values keep their raw form; use unquoteList for display.
export function parseModuleArgs(sqlText = '') {
    const args = {};
    const re = /^\s*([a-z_]+)\s*=>?\s*(.+?),?\s*$/gim;
    let m;
    while ((m = re.exec(sqlText))) {
        const key = m[1].toLowerCase();
        if (key === 'using' || key === 'select') continue;
        args[key] = m[2].trim().replace(/,\s*$/, '');
    }
    return args;
}

// Builds designer canvas elements/connections for a stream from its files.
// filesByName: { 'DDL.sql': content, 'DML.sql': content, ... }
export function buildStreamElementsFromFiles(streamName, filesByName = {}, prefix) {
    const pfx = prefix || `el-${Date.now().toString(36)}`;
    const elements = [];
    const connections = [];
    const X0 = 70, STEP = 290, Y = 90, W = 230, H = 54;
    let idx = 0;

    function push(type, subtype, title, params) {
        const el = {
            id: `${pfx}-${++idx}`,
            type, subtype, title,
            x: X0 + STEP * (idx - 1), y: Y, w: W, h: H,
            moduleEnabled: true, moduleComment: '',
            params: params || {},
        };
        elements.push(el);
        if (elements.length > 1) {
            connections.push({
                id: `${pfx}-c${elements.length - 1}`,
                from: elements[elements.length - 2].id,
                to: el.id,
            });
        }
        return el;
    }

    // stg (DML.sql) → historicity → move2pa → coalesce (canonical graph order)
    push('query', 'transform', `${streamName}_stg`, {
        sql: filesByName['DML.sql'] || '',
        outputTable: '',
    });

    const hist = parseModuleArgs(filesByName['historicity.sql'] || '');
    push('query', 'history', 'historicity', {
        mode: unquoteList(hist.mode) || 'baseline',
        incr_table: unquoteList(hist.incr_table),
        pa_table: unquoteList(hist.pa_table),
        hist_table: unquoteList(hist.hist_table),
        mapping_inc: unquoteList(hist.mapping_inc),
        mapping_pa: unquoteList(hist.mapping_pa),
        pk_inc: unquoteList(hist.pk_inc),
        pk_pa: unquoteList(hist.pk_pa),
    });

    const move = parseModuleArgs(filesByName['move_table.sql'] || '');
    push('insert', 'move2pa', 'move2pa', {
        pa_table: unquoteList(move.pa_table),
        hist_table: unquoteList(move.hist_table),
    });

    const coal = parseModuleArgs(filesByName['coalesce.sql'] || '');
    push('insert', 'coalesce', 'coalesce', {
        tables: unquoteList(coal.tables),
        target_file_size_mb: unquoteList(coal.target_file_size_mb) || '128',
        compression_codec: (coal.compression_codec || '').replace(/'/g, '') || 'zstd',
        parallel_degree: unquoteList(coal.parallel_degree) || '8',
        snapshot_retention: unquoteList(coal.snapshot_retention) || '5',
    });

    return { elements, connections };
}

// ── Agent project block (```b2c-project …```) ──────────────────────────────
// Format inside the fence:
//   mart: <name>
//   ===FILE: etl/<stream>/DDL.sql===
//   <content>
//   ===FILE: resources/devops.json===
//   <content>

export function parseProjectFiles(block = '') {
    const files = {};
    const martMatch = block.match(/^\s*mart:\s*(.+)$/m);
    const mart = martMatch ? martMatch[1].trim() : null;

    const re = /^===\s*FILE:\s*(.+?)\s*===\s*$/gm;
    const marks = [];
    let m;
    while ((m = re.exec(block))) marks.push({ path: m[1].replace(/^\/+/, ''), start: m.index, end: re.lastIndex });
    marks.forEach((mark, i) => {
        const end = i + 1 < marks.length ? marks[i + 1].start : block.length;
        const content = block.slice(mark.end, end)
            .replace(/^\r?\n/, '')
            .replace(/\s+$/, '')
            .replace(/```+$/, '')   // stray closing fence glued to the last file
            .replace(/\s+$/, '');
        if (mark.path) files[mark.path] = content + '\n';
    });
    return { mart, files };
}

// Agents sometimes emit sloppy paths ("DDL.sql", "etl/DDL.sql",
// "<mart>/etl/x/DDL.sql"). Normalize everything to the canon:
// etl/<stream>/<file> and resources/devops.json. Files without a stream
// folder fall into etl/<mart-slug>/.
export function normalizeProjectPaths(mart, files = {}) {
    const slug = martBranchName(mart).slice('openclaw/'.length);
    const out = {};
    for (const [path, content] of Object.entries(files)) {
        let p = path.replace(/^\/+/, '').replace(/^\.\//, '');
        const parts = p.split('/');
        // strip a leading "<mart>/" wrapper
        if (parts.length > 1 && (parts[1] === 'etl' || parts[1] === 'resources')) {
            p = parts.slice(1).join('/');
        }
        const base = p.split('/').pop();
        if (base === 'devops.json') {
            p = 'resources/devops.json';
        } else if (p.startsWith('etl/')) {
            // "etl/DDL.sql" (no stream folder) → etl/<slug>/DDL.sql
            if (p.split('/').length < 3) p = `etl/${slug}/${base}`;
        } else if (!p.startsWith('resources/')) {
            p = `etl/${slug}/${base}`;
        }
        out[p] = content;
    }
    return out;
}

// Structured summary of one stream, parsed from its files — the chat renders
// it as a neat card instead of relying on the agent's markdown formatting.
export function buildStreamSummary(filesByName = {}) {
    const hist = parseModuleArgs(filesByName['historicity.sql'] || '');
    const ddl = filesByName['DDL.sql'] || '';
    // greedy до последней «)» на строке — партиции бывают вложенными: DAY(col)
    const partitions = [...ddl.matchAll(/PARTITIONED\s+BY\s*\((.+)\)/gi)].map(m => m[1].trim());
    const colsMatch = ddl.match(/CREATE\s+TABLE[^(]*\(([\s\S]*?)\)\s*(?:USING|PARTITIONED|;)/i);
    let columns = null;
    if (colsMatch) {
        columns = colsMatch[1]
            .split('\n')
            .map(s => s.trim().replace(/,+$/, ''))
            .filter(s => /^[a-z_"`][\w"`]*\s+\S/i.test(s))
            .length || null;
    }
    return {
        pa: unquoteList(hist.pa_table) || null,
        stg: unquoteList(hist.incr_table) || null,
        hist: unquoteList(hist.hist_table) || null,
        pk: unquoteList(hist.pk_pa) || unquoteList(hist.pk_inc) || null,
        partitionPa: partitions[0] || null,
        partitionHist: partitions[1] || null,
        columns,
    };
}

// Branch name for an agent-built datamart: openclaw/<slug>.
// Agent-created marts always land in their own branch — never in main.
export function martBranchName(mart) {
    const slug = (mart || 'datamart').toLowerCase().trim()
        .replace(/[^a-z0-9_-]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'datamart';
    return `openclaw/${slug}`;
}

// Unique stream names from project file paths (etl/<stream>/...).
export function listStreamsFromFiles(files = {}) {
    const set = new Set();
    for (const path of Object.keys(files)) {
        const m = path.match(/^etl\/([^/]+)\//);
        if (m) set.add(m[1]);
    }
    return Array.from(set);
}

// Slice of the project files belonging to one stream, keyed by file name.
export function filesForStream(files = {}, streamName) {
    const out = {};
    const prefix = `etl/${streamName}/`;
    for (const [path, content] of Object.entries(files)) {
        if (path.startsWith(prefix)) out[path.slice(prefix.length)] = content;
    }
    return out;
}
