import { useRef } from 'react';
import { ELEMENT_TYPE_LABELS, moduleLabel } from '../constants';
import { getIcon } from '../utils';

export default function CanvasElement({
    el, selected,
    onSelect, onMove, onResize,
    onDuplicate, onDelete, onOpenProps,
    onPortMouseDown,
    readOnly = false,
}) {
    const rootRef = useRef(null);

    function handleMouseDown(e) {
        if (e.target.closest('.element-actions') || e.target.closest('.element-port') || e.target.closest('.element-resize')) return;
        onSelect(el.id);
        if (readOnly) return;
        const startX = e.clientX, startY = e.clientY, ex = el.x, ey = el.y;
        function move(ev) { onMove(el.id, ex + ev.clientX - startX, ey + ev.clientY - startY); }
        function up() {
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', up);
            document.body.style.userSelect = '';
        }
        document.body.style.userSelect = 'none';
        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', up);
    }

    function handleResizeMouseDown(e) {
        e.stopPropagation();
        if (readOnly) return;
        const startX = e.clientX, startY = e.clientY, sw = el.w, sh = el.h;
        function move(ev) {
            onResize(el.id,
                Math.max(160, sw + ev.clientX - startX),
                Math.max(48,  sh + ev.clientY - startY),
            );
        }
        function up() {
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', up);
            document.body.style.userSelect = '';
        }
        document.body.style.userSelect = 'none';
        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', up);
    }

    const icon = getIcon(el.type, el.subtype);
    // Как в прототипе: название модуля (с Ribbon-панели) + подпись DWH Services
    const title = moduleLabel(el.type, el.subtype, el.title);
    const typeLabel = ELEMENT_TYPE_LABELS[el.type] || el.type;

    return (
        <div
            ref={rootRef}
            id={el.id}
            className={`canvas-element${selected ? ' is-selected' : ''}${readOnly ? ' is-readonly' : ''}`}
            style={{ left: el.x, top: el.y, width: el.w, height: el.h, position: 'absolute' }}
            onMouseDown={handleMouseDown}
            onDoubleClick={e => { e.stopPropagation(); if (!readOnly) onOpenProps(el.id); }}
        >
            <div className="element-header">
                <i className={icon}></i>
                <div className="element-meta">
                    <span className="element-title" title={el.title !== title ? el.title : undefined}>{title}</span>
                    <span className="element-type">{typeLabel}</span>
                </div>
                {!readOnly && (
                    <div className="element-actions">
                        <button className="element-action-btn open-settings" type="button" title="Свойства"
                            onClick={e => { e.stopPropagation(); onOpenProps(el.id); }}>
                            <i className="fas fa-sliders-h"></i>
                        </button>
                        <button className="element-action-btn duplicate-element" type="button" title="Дублировать"
                            onClick={e => { e.stopPropagation(); onDuplicate(el.id); }}>
                            <i className="far fa-copy"></i>
                        </button>
                        <button className="element-action-btn delete delete-element" type="button" title="Удалить"
                            onClick={e => { e.stopPropagation(); onDelete(el.id); }}>
                            <i className="fas fa-trash"></i>
                        </button>
                    </div>
                )}
            </div>
            <button
                className="element-port in"
                type="button"
                title="Вход"
                disabled={readOnly}
                onMouseDown={e => onPortMouseDown(e, el.id, 'in')}
            ></button>
            <button
                className="element-port out"
                type="button"
                title="Выход"
                disabled={readOnly}
                onMouseDown={e => onPortMouseDown(e, el.id, 'out')}
            ></button>
            {!readOnly && <div className="element-resize" onMouseDown={handleResizeMouseDown}></div>}
        </div>
    );
}
