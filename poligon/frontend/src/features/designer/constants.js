export const ICON_MAP = {
    engine:   { spark: 'fab fa-stack-overflow icon-spark', flink: 'fas fa-bolt' },
    ddl:      { script: 'fas fa-file-code', source: 'fas fa-book-open', sync: 'fas fa-book-open' },
    recovery: { checkpoint: 'fas fa-check-double', rollback: 'fas fa-undo' },
    data:     { kafka2hdfs: 'fas fa-stream icon-kafka', getdata: 'fas fa-download', s2t: 'fas fa-exchange-alt' },
    query:    { transform: 'fas fa-cogs', history: 'fas fa-history', quality: 'fas fa-award', reconciliation: 'fas fa-balance-scale' },
    insert:   { hdfs2hbase: 'fas fa-database icon-hbase', hdfs2kafka: 'fas fa-stream icon-kafka', move2pa: 'fas fa-share-square', coalesce: 'fas fa-compress' },
    share:    { deploy: 'fab fa-jenkins icon-jenkins' },
    help:     { documentation: 'fas fa-book', api: 'fas fa-code', tutorial: 'fas fa-graduation-cap' },
    support:  { forum: 'fas fa-comments', ticket: 'fas fa-ticket-alt', contact: 'fas fa-headset' },
};

export const TYPE_LABELS = {
    engine: 'Движок', ddl: 'DDL', recovery: 'Восстановление', data: 'Данные',
    query: 'Запрос', insert: 'Загрузка', share: 'Публикация', help: 'Справка', support: 'Поддержка',
};

export const RIBBON_MAIN = [
    { title: 'Batch/NRT', items: [
        { type: 'engine', subtype: 'spark', label: 'Spark', button: true },
        { type: 'engine', subtype: 'flink', label: 'Flink', button: true },
    ]},
    { title: 'DDL', items: [
        { type: 'ddl', subtype: 'script', label: 'DDL',    button: true },
        { type: 'ddl', subtype: 'source', label: 'Source', button: true },
        { type: 'ddl', subtype: 'sync',   label: 'Sync',   button: true },
    ]},
    { title: 'Восстановление', items: [
        { type: 'recovery', subtype: 'checkpoint', label: 'Checkpoints', button: true },
        { type: 'recovery', subtype: 'rollback',   label: 'Rollback' },
    ]},
    { title: 'Создание инкремента', items: [
        { type: 'data',  subtype: 'kafka2hdfs', label: 'KAFKA2HDFS' },
        { type: 'query', subtype: 'transform',  label: 'SQL Transform' },
    ]},
    { title: 'Подготовка инкремента', items: [
        { type: 'query',  subtype: 'history',        label: 'Историчность данных' },
        { type: 'insert', subtype: 'coalesce',       label: 'Coalesce' },
        { type: 'query',  subtype: 'quality',        label: 'Data Quality' },
        { type: 'query',  subtype: 'reconciliation', label: 'Реконсиляция' },
    ]},
    { title: 'Публикация', items: [
        { type: 'insert', subtype: 'hdfs2hbase', label: 'HDFS2HBase' },
        { type: 'insert', subtype: 'hdfs2kafka', label: 'HDFS2KAFKA' },
        { type: 'insert', subtype: 'move2pa',    label: 'Move2PA' },
    ]},
    { title: 'CI/CD', items: [
        { type: 'share', subtype: 'deploy', label: 'Deploy', button: true },
    ]},
];

export const RIBBON_HELP = [
    { title: 'Docs', items: [
        { type: 'help', subtype: 'documentation', label: 'Документация' },
        { type: 'help', subtype: 'api',           label: 'API Reference' },
        { type: 'help', subtype: 'tutorial',      label: 'Руководства' },
    ]},
    { title: 'Support', items: [
        { type: 'support', subtype: 'forum',   label: 'Форум' },
        { type: 'support', subtype: 'ticket',  label: 'Техподдержка' },
        { type: 'support', subtype: 'contact', label: 'Контакты' },
    ]},
];

// Подпись под названием модуля на схеме: query/insert показываются как
// «DWH Services».
export const ELEMENT_TYPE_LABELS = {
    engine: 'Engine', format: 'Table Format', recovery: 'Recovery',
    data: 'Data Operation', query: 'DWH Services', insert: 'DWH Services',
    share: 'Share', help: 'Help', support: 'Support',
};

// Название модуля — ровно то, что написано на Ribbon-панели.
const RIBBON_LABELS = {};
for (const section of [...RIBBON_MAIN, ...RIBBON_HELP]) {
    for (const it of section.items) RIBBON_LABELS[`${it.type}:${it.subtype}`] = it.label;
}
export function moduleLabel(type, subtype, fallback) {
    return RIBBON_LABELS[`${type}:${subtype}`] || fallback || `${type}/${subtype}`;
}

export const DEFAULT_ELEMENT_W = 220;
// Тонкие элементы, как в прототипе: высота по заголовку (иконка + 2 строки)
export const DEFAULT_ELEMENT_H = 54;
