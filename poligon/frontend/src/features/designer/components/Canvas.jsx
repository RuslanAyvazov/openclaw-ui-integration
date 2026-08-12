import { useRef, useState, useEffect } from 'react';
import CanvasElement from './CanvasElement';

function buildDagPath(fromX, fromY, toX, toY) {
    const dx = Math.max(40, Math.abs(toX - fromX) * 0.5);
    const c1x = fromX + dx, c1y = fromY;
    const c2x = toX - dx,   c2y = toY;
    return `M${fromX},${fromY} C${c1x},${c1y} ${c2x},${c2y} ${toX},${toY}`;
}

// Given an element and which port, compute the port's center in canvas coordinates.
function portCenter(el, side) {
    const y = el.y + el.h / 2;
    const x = side === 'out' ? el.x + el.w : el.x;
    return { x, y };
}

export default function Canvas({
    page,
    selectedId,
    onSelect, onMove, onResize,
    onDuplicate, onDelete, onOpenProps,
    onAddElement,
    onAddConnection, onDeleteConnection,
    onCanvasClick,
    readOnly = false,
}) {
    const gridRef = useRef(null);
    const [linkDraft, setLinkDraft] = useState(null);

    // Drop from ribbon
    function handleDragOver(e) {
        if (readOnly) { e.dataTransfer.dropEffect = 'none'; return; }
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }
    function handleDrop(e) {
        if (readOnly) return;
        e.preventDefault();
        const data = e.dataTransfer.getData('application/x-ribbon-item');
        if (!data || !gridRef.current) return;
        const item = JSON.parse(data);
        const rect = gridRef.current.getBoundingClientRect();
        const x = Math.max(0, e.clientX - rect.left - 90);
        const y = Math.max(0, e.clientY - rect.top - 36);
        onAddElement(item, x, y);
    }

    // Start drawing a link when user presses an output port
    function handlePortMouseDown(e, elementId, side) {
        if (readOnly) return;
        e.stopPropagation();
        if (!gridRef.current) return;
        const rect = gridRef.current.getBoundingClientRect();
        setLinkDraft({
            fromId: side === 'out' ? elementId : null,
            toId:   side === 'in'  ? elementId : null,
            side,
            cursorX: e.clientX - rect.left,
            cursorY: e.clientY - rect.top,
        });
    }

    useEffect(() => {
        if (!linkDraft) return;

        function onMove(ev) {
            if (!gridRef.current) return;
            const rect = gridRef.current.getBoundingClientRect();
            setLinkDraft(prev => prev ? { ...prev, cursorX: ev.clientX - rect.left, cursorY: ev.clientY - rect.top } : prev);
        }

        function onUp(ev) {
            const target = document.elementFromPoint(ev.clientX, ev.clientY);
            const portEl = target && target.closest('.element-port');
            if (portEl) {
                const otherId = portEl.closest('.canvas-element')?.id;
                const otherSide = portEl.classList.contains('in') ? 'in' : 'out';
                if (otherId && otherSide !== linkDraft.side) {
                    const fromId = linkDraft.side === 'out' ? linkDraft.fromId : otherId;
                    const toId   = linkDraft.side === 'out' ? otherId : linkDraft.toId;
                    if (fromId && toId && fromId !== toId) onAddConnection(fromId, toId);
                }
            }
            setLinkDraft(null);
        }

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
        return () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
    }, [linkDraft, onAddConnection]);

    // Compute SVG paths
    const elements = page.elements;
    const connections = page.connections;
    const byId = Object.fromEntries(elements.map(e => [e.id, e]));

    function connPath(conn) {
        const from = byId[conn.from], to = byId[conn.to];
        if (!from || !to) return null;
        const p1 = portCenter(from, 'out');
        const p2 = portCenter(to, 'in');
        return buildDagPath(p1.x, p1.y, p2.x, p2.y);
    }

    function draftPath() {
        if (!linkDraft) return null;
        const anchorId = linkDraft.fromId ?? linkDraft.toId;
        const anchorEl = byId[anchorId];
        if (!anchorEl) return null;
        const p = portCenter(anchorEl, linkDraft.side);
        return linkDraft.side === 'out'
            ? buildDagPath(p.x, p.y, linkDraft.cursorX, linkDraft.cursorY)
            : buildDagPath(linkDraft.cursorX, linkDraft.cursorY, p.x, p.y);
    }

    function handleGridClick(e) {
        if (e.target === gridRef.current) onCanvasClick();
    }

    return (
        <div
            ref={gridRef}
            className="designer-grid"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleGridClick}
            style={{ position: 'relative', minHeight: 600, flex: 1 }}
        >
            <svg className="dag-link-layer" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', width: '100%', height: '100%' }}>
                <defs>
                    <marker id="dagArrowHead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#6384ba" />
                    </marker>
                </defs>
                {connections.map(c => {
                    const d = connPath(c);
                    if (!d) return null;
                    return (
                        <path
                            key={c.id}
                            className="dag-link"
                            d={d}
                            style={{ pointerEvents: readOnly ? 'none' : 'stroke', cursor: readOnly ? 'default' : 'pointer' }}
                            onClick={readOnly ? undefined : (() => onDeleteConnection(c.id))}
                        />
                    );
                })}
                {linkDraft && draftPath() && (
                    <path className="dag-link preview" d={draftPath()} />
                )}
            </svg>

            {elements.map(el => (
                <CanvasElement
                    key={el.id}
                    el={el}
                    selected={selectedId === el.id}
                    onSelect={onSelect}
                    onMove={onMove}
                    onResize={onResize}
                    onDuplicate={onDuplicate}
                    onDelete={onDelete}
                    onOpenProps={onOpenProps}
                    onPortMouseDown={handlePortMouseDown}
                    readOnly={readOnly}
                />
            ))}

            {elements.length === 0 && (
                <div style={{
                    position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: 8, pointerEvents: 'none',
                }}>
                    <i className="fas fa-project-diagram" style={{ fontSize: 36, color: '#c5d4e8', opacity: 0.7 }}></i>
                    <span style={{ color: '#b0bdd6', fontSize: 13, fontFamily: 'system-ui' }}>
                        Перетащите элемент из ленты на канвас
                    </span>
                </div>
            )}
        </div>
    );
}
