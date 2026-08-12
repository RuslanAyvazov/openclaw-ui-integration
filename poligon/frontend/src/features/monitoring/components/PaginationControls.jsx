export default function PaginationControls({ page, totalPages, pageSize, onPageChange, onPageSizeChange }) {
    return (
        <div className="pagination-right">
            <div className="pagination-controls">
                <button className="pagination-btn" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
                    Назад
                </button>
                <span>Страница {page} / {totalPages}</span>
                <button className="pagination-btn" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
                    Вперед
                </button>
            </div>
            <div className="pagination-controls">
                <span>Строк на странице:</span>
                <select
                    className="rows-select"
                    value={pageSize}
                    onChange={e => onPageSizeChange(Number(e.target.value))}
                >
                    {[10, 20, 50, 100].map(n => (
                        <option key={n} value={n}>{n}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}
