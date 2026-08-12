// Mock API responses for SQL Editor.
// Replace imports in api.js with real fetch calls when backend is ready.

export const DATABASES = [
    { name: 'default', tables: [
        { name: 'users', cols: 7 }, { name: 'orders', cols: 12 },
        { name: 'products', cols: 9 }, { name: 'customers', cols: 8 },
        { name: 'inventory', cols: 6 },
    ]},
    { name: 'custom_b2c_ar_test', tables: [
        { name: 'employees', cols: 9 }, { name: 'categories', cols: 4 },
        { name: 'suppliers', cols: 8 }, { name: 'products', cols: 10 },
        { name: 'orders', cols: 14 }, { name: 'order_details', cols: 6 },
    ]},
    { name: 'custom_b2c_sql_fw', tables: [
        { name: 'user', cols: 43 }, { name: 'db', cols: 22 }, { name: 'tables_priv', cols: 8 },
    ]},
];

export const SPARK_SESSIONS = [
    { id: 1, name: 'Spark DEV Small',     params: { master: 'yarn',     executorMemory: '4g', executors: 2, shufflePartitions: 64 } },
    { id: 2, name: 'Spark PROD Balanced', params: { master: 'yarn',     executorMemory: '8g', executors: 6, shufflePartitions: 200 } },
    { id: 3, name: 'Spark ADHOC Fast',    params: { master: 'local[*]', executorMemory: '6g', executors: 3, shufflePartitions: 120 } },
];

export const FW_VERSIONS = ['FW 1.010.13', 'FW 1.010.11', 'FW 1.010.10', 'FW 1.010.9', 'FW 1.010.8'];

export const MOCK_COLS = [
    'order_id', 'username', 'email', 'order_date', 'total_amount',
    'status', 'product_name', 'category', 'price', 'qty',
];

export const MOCK_ROWS = Array.from({ length: 20 }, (_, i) => [
    10248 + i,
    ['john.smith', 'jane.doe', 'bob.jones', 'alice.wang', 'mike.brown'][i % 5],
    `user${i + 1}@company.ru`,
    `2024-07-${String(i + 1).padStart(2, '0')}`,
    (150 + i * 23.5).toFixed(2),
    ['completed', 'shipped', 'pending'][i % 3],
    ['Widget Pro', 'Gadget X', 'Tool 3000', 'Device Plus'][i % 4],
    ['Electronics', 'Hardware', 'Software'][i % 3],
    (9.99 + i * 5).toFixed(2),
    1 + (i % 10),
]);

// Legacy model examples kept only for mock distribution latency. The visible
// assistant list comes from /api/ai/agents and contains the current user's
// containerized OpenClaw agent.
export const AI_MODELS = [
    { id: 'openclaw', name: 'OpenClaw', sub: 'Персональный агент',     icon: 'fa-robot',        accent: '#e67e22' },
    { id: 'glm-5',    name: 'GLM 5',    sub: 'Zhipu AI · базовая',     icon: 'fa-layer-group',  accent: '#5b8def' },
    { id: 'glm-5.1',  name: 'GLM 5.1',  sub: 'Zhipu AI · улучшенная',  icon: 'fa-layer-group',  accent: '#7c5cff' },
    { id: 'deepseek', name: 'DeepSeek', sub: 'Глубокие рассуждения',   icon: 'fa-brain',        accent: '#4aa3e0' },
    { id: 'gigachat', name: 'GigaChat', sub: 'Sber · русскоязычная',   icon: 'fa-comment-dots', accent: '#2ecc71' },
];

// Per-model simulated "thinking" latency.
export const MODEL_DELAY = { 'glm-5': 700, 'glm-5.1': 850, deepseek: 1150, gigachat: 800 };

// Builds a context-aware canned assistant reply: { text, sql? }.
export function buildAgentReply(prompt = '') {
    const p = prompt.toLowerCase();

    if (/оптимиз|optim|медленн|slow|ускор|performance|план|explain/.test(p)) {
        return {
            text: 'Несколько идей, как ускорить запрос:\n\n• Выбирайте только нужные колонки вместо SELECT *.\n• Фильтруйте по партиционированному полю (order_date) как можно раньше.\n• Раздавайте небольшие справочники через BROADCAST в JOIN.\n\nВот переписанный вариант с broadcast-хинтом:',
            sql: `SELECT /*+ BROADCAST(p) */\n    u.user_id,\n    u.username,\n    o.order_id,\n    o.total_amount\nFROM orders o\nJOIN users u    ON u.user_id    = o.user_id\nJOIN products p ON p.product_id = o.product_id\nWHERE o.status = 'completed'\n  AND o.order_date >= date_sub(current_date(), 30)\nORDER BY o.order_date DESC\nLIMIT 20;`,
        };
    }
    if (/join|джойн|связ/.test(p)) {
        return {
            text: 'JOIN объединяет строки двух таблиц по условию. Для витрины заказов чаще всего нужен INNER JOIN по ключу user_id:',
            sql: `SELECT u.username, o.order_id, o.total_amount\nFROM users u\nJOIN orders o ON o.user_id = u.user_id\nWHERE o.status = 'completed';`,
        };
    }
    if (/групп|group|агрег|сумм|count|выручк|revenue|катего/.test(p)) {
        return {
            text: 'Для агрегатов группируйте по неагрегируемым полям. Например, выручка по категориям:',
            sql: `SELECT\n    p.category,\n    COUNT(o.order_id)   AS orders,\n    SUM(o.total_amount) AS revenue\nFROM products p\nLEFT JOIN orders o ON o.product_id = p.product_id\nGROUP BY p.category\nORDER BY revenue DESC;`,
        };
    }
    return {
        text: 'Готов помочь с SQL: оптимизация, объяснение планов и генерация запросов по описанию. Опишите задачу или вставьте запрос — предложу улучшения. Для примера — последние выполненные заказы:',
        sql: `SELECT user_id, order_id, total_amount, order_date\nFROM orders\nWHERE status = 'completed'\nORDER BY order_date DESC\nLIMIT 50;`,
    };
}

// Builds a datamart distribution manifest from the selected SQL windows.
export function buildDistManifest(windows = []) {
    const names = windows.length ? windows : ['query_1.sql'];
    const includes = names.map(w => `  INCLUDE WINDOW '${w}'`).join(',\n');
    return `-- Дистрибутив витрины\n-- Источники: ${names.join(', ')}\nCREATE DISTRIBUTION datamart_dist AS\n${includes}\nWITH (\n  format       = 'parquet',\n  compression  = 'snappy',\n  partition_by = ('order_date'),\n  version      = '1.0.0'\n);`;
}

export const EXPLAIN_TEXT = `== Physical Plan ==
TakeOrderedAndProject(limit=20, orderBy=[order_date DESC])
+- *(5) HashAggregate(output=[user_id, username, email, ...])
   +- Exchange hashpartitioning(user_id, 200)
      +- *(4) HashAggregate(output=[user_id, ...])
         +- *(4) Project [user_id, username, email, ...]
            +- *(4) SortMergeJoin [user_id], [user_id], Inner
               :- *(2) Sort [user_id ASC]
               :  +- Exchange hashpartitioning(user_id, 200)
               :     +- *(1) Filter isnotnull(user_id)
               :        +- Scan HiveTableRelation \`default\`.\`users\`
               +- *(4) Sort [user_id ASC]
                  +- Exchange hashpartitioning(user_id, 200)
                     +- *(3) Filter (status = completed)
                        +- Scan HiveTableRelation \`default\`.\`orders\``;
