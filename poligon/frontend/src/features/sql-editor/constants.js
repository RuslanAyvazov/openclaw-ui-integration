// Starter prompt chips shown in the AI assistant empty state (UX defaults).
export const AI_SUGGESTIONS = [
    { icon: 'fa-cubes',               label: 'Собрать витрину из моего SQL' },
    { icon: 'fa-gauge-high',          label: 'Оптимизировать текущий запрос' },
    { icon: 'fa-diagram-project',     label: 'Объяснить план выполнения' },
    { icon: 'fa-wand-magic-sparkles', label: 'Сгенерировать JOIN по витрине' },
    { icon: 'fa-box-open',            label: 'Создать дистрибутив витрины' },
];

export const INITIAL_QUERIES = {
    1: `-- query_1.sql
-- Запрос витрины orders

SELECT
    u.user_id,
    u.username,
    u.email,
    u.created_at,
    u.last_login,
    u.status,
    p.product_name,
    p.category,
    p.price,
    o.order_id,
    o.order_date,
    o.total_amount,
    o.status AS order_status
FROM users u
JOIN orders o ON u.user_id = o.user_id
JOIN products p ON o.product_id = p.product_id
WHERE o.status = 'completed'
ORDER BY o.order_date DESC
LIMIT 20;`,
    2: `-- query_2.sql
-- Анализ продуктов по категориям

SELECT
    p.product_id,
    p.product_name,
    p.category,
    p.price,
    COUNT(o.order_id)   AS order_count,
    SUM(o.total_amount) AS total_revenue
FROM products p
LEFT JOIN orders o ON p.product_id = o.product_id
GROUP BY p.product_id, p.product_name, p.category, p.price
ORDER BY total_revenue DESC;`,
};
