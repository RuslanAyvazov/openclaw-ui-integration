const COLUMNS = [
    { key: 'datamart',       label: 'Витрина данных' },
    { key: 'deployId',       label: 'Deploy ID' },
    { key: 'createdDate',    label: 'Дата создания' },
    { key: 'createdTime',    label: 'Время создания' },
    { key: 'deployDate',     label: 'Дата деплоя' },
    { key: 'deployTime',     label: 'Время деплоя' },
    { key: 'flowName',       label: 'Название потока' },
    { key: 'sourceEnv',      label: 'Откуда' },
    { key: 'targetEnv',      label: 'Куда' },
    { key: 'cluster',        label: 'Кластер' },
    { key: 'datamartStatus', label: 'Статус витрины' },
    { key: 'flowStatus',     label: 'Статус потока' },
    { key: 'deployType',     label: 'Тип деплоя' },
    { key: 'comment',        label: 'Комментарий' }
];

const STATUS_CLASS = {
    SUCCESS: 'status-active',
    FAILED:  'status-draft',
    RUNNING: 'status-running',
    PENDING: 'status-pending'
};

export default function MonitoringTable({ rows }) {
    return (
        <div className="monitoring-table-wrap">
            <table className="monitoring-table">
                <thead>
                    <tr>
                        {COLUMNS.map(col => <th key={col.key}>{col.label}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i}>
                            {COLUMNS.map(col => (
                                <td key={col.key}>
                                    {col.key === 'flowStatus'
                                        ? <span className={`tile-status ${STATUS_CLASS[row[col.key]] || ''}`}>{row[col.key]}</span>
                                        : row[col.key]
                                    }
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
