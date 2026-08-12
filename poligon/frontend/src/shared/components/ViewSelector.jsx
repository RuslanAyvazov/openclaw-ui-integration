import { useNavigate } from 'react-router-dom';

// SQL редактор вынесен из витрины на верхний уровень (левый Sidebar главной
// страницы); внутри витрины остаются структура директорий и конструктор.
const VIEWS = [
    { id: 'directory', icon: 'fab fa-github',            label: 'Структура директорий', path: 'directory' },
    { id: 'designer',  icon: 'fas fa-palette',           label: 'Конструктор',         path: 'designer' },
];

export default function ViewSelector({ activeView, datamartId }) {
    const navigate = useNavigate();
    return (
        <div className="view-selector">
            {VIEWS.map(v => (
                <div
                    key={v.id}
                    className={`view-item${activeView === v.id ? ' active' : ''}`}
                    onClick={() => { if (activeView !== v.id) navigate(`/${v.path}/${datamartId}`); }}
                    title={v.label}
                >
                    <i className={v.icon}></i>
                    <div className="view-tooltip">{v.label}</div>
                </div>
            ))}
        </div>
    );
}
