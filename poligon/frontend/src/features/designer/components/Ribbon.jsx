import { useState, useRef, useEffect } from 'react';
import { RIBBON_MAIN, RIBBON_HELP } from '../constants';
import { getIcon } from '../utils';

function RibbonItem({ item, isActive, isDisabled, onButtonClick, onDragStart }) {
    const classes = [
        'ribbon-item',
        item.button ? 'button' : '',
        isActive ? 'active' : '',
        isDisabled ? 'disabled' : '',
    ].filter(Boolean).join(' ');

    return (
        <div
            className={classes}
            data-type={item.type}
            data-subtype={item.subtype}
            draggable={!item.button && !isDisabled}
            onDragStart={(item.button || isDisabled) ? undefined : (e => onDragStart(e, item))}
            onClick={isDisabled ? undefined : (item.button ? (() => onButtonClick(item)) : undefined)}
            title={isDisabled ? 'Недоступно — настройте предыдущие шаги' : (item.button ? item.label : `Перетащите ${item.label} на канвас`)}
        >
            <i className={getIcon(item.type, item.subtype)}></i>
            <span>{item.label}</span>
        </div>
    );
}

// Dependency rules for gradual activation:
// - engine items: always enabled
// - Spark → enables DDL (script); Flink → enables Source + Sync
// - everything else requires the engine-appropriate DDL to be active
function itemDisabledBy(item, { selectedEngine, ddlState }) {
    if (item.type === 'engine') return false;
    if (item.type === 'help' || item.type === 'support') return false;
    if (item.type === 'ddl') {
        if (!selectedEngine) return true;
        if (item.subtype === 'script') return selectedEngine !== 'spark';
        return selectedEngine !== 'flink'; // source, sync
    }
    if (selectedEngine === 'spark') return !ddlState?.script;
    if (selectedEngine === 'flink') return !(ddlState?.source || ddlState?.sync);
    return true;
}

// Sections are dimmed/collapsed if DDL is not ready yet.
function sectionDisabledBy(section, { selectedEngine, ddlState }) {
    return section.items.every(it => itemDisabledBy(it, { selectedEngine, ddlState }));
}

// Compact mode collapses sections with 3+ items into a hover trigger;
// the engine section always stays expanded.
function isCollapsible(section) {
    return section.items.length >= 3 && section.title !== 'Batch/NRT';
}

export default function Ribbon({
    activeTab, onTabChange,
    selectedEngine, ddlState, checkpointActive,
    onEngineClick, onDdlClick, onCheckpointClick, onDeployClick,
    onItemDragStart,
    readOnly = false,
}) {
    const sections = activeTab === 'main' ? RIBBON_MAIN : RIBBON_HELP;

    // «Компактно / Широкий» — the toggle in the ribbon tab bar (prototype parity).
    const [compact, setCompact] = useState(false);
    const [dropdown, setDropdown] = useState(null); // { title, x, y }
    const closeTimer = useRef(null);
    const draggingRef = useRef(false);

    useEffect(() => () => clearTimeout(closeTimer.current), []);
    useEffect(() => { setDropdown(null); }, [activeTab, compact]);

    function openDropdown(e, section) {
        clearTimeout(closeTimer.current);
        const rect = e.currentTarget.getBoundingClientRect();
        setDropdown({ title: section.title, x: rect.left, y: rect.bottom + 4 });
    }
    function scheduleClose() {
        if (draggingRef.current) return; // keep the dropdown alive during a drag
        clearTimeout(closeTimer.current);
        closeTimer.current = setTimeout(() => setDropdown(null), 180);
    }
    function cancelClose() { clearTimeout(closeTimer.current); }

    function isItemActive(item) {
        if (item.type === 'engine') return selectedEngine === item.subtype;
        if (item.type === 'ddl')    return !!ddlState[item.subtype];
        if (item.type === 'recovery' && item.subtype === 'checkpoint') return checkpointActive;
        return false;
    }

    function handleButtonClick(item) {
        if (item.type === 'engine')    return onEngineClick(item.subtype);
        if (item.type === 'ddl')       return onDdlClick(item.subtype);
        if (item.type === 'recovery' && item.subtype === 'checkpoint') return onCheckpointClick();
        if (item.type === 'share' && item.subtype === 'deploy')        return onDeployClick();
    }

    function itemDisabled(item) {
        const ctxDisabled = activeTab === 'main' && itemDisabledBy(item, { selectedEngine, ddlState });
        // Help/support tab + the deploy button stay live in read-only mode.
        const isAlwaysActive = item.type === 'help' || item.type === 'support'
            || (item.type === 'share' && item.subtype === 'deploy');
        return ctxDisabled || (readOnly && !isAlwaysActive);
    }

    const dropdownSection = dropdown ? sections.find(s => s.title === dropdown.title) : null;

    return (
        <>
            <div className="ribbon-tabs">
                <button
                    className={`ribbon-tab${activeTab === 'main' ? ' active' : ''}`}
                    onClick={() => onTabChange('main')}
                >Главная</button>
                <button
                    className={`ribbon-tab${activeTab === 'help' ? ' active' : ''}`}
                    onClick={() => onTabChange('help')}
                >Help</button>
                {readOnly && (
                    <span className="ribbon-readonly-tag" title="Поток не заблокирован — редактирование недоступно">
                        <i className="fas fa-lock-open" /> Только чтение
                    </span>
                )}
                <label className="ribbon-view-toggle" title="Компактно / Широкий" style={{ cursor: 'pointer', userSelect: 'none' }}>
                    <span className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={compact}
                            onChange={e => setCompact(e.target.checked)}
                            style={{ display: 'none' }}
                        />
                        <span className="toggle-track">
                            <span className="toggle-thumb" />
                        </span>
                    </span>
                </label>
            </div>

            <div className={`ribbon active${readOnly ? ' is-readonly' : ''}${compact ? ' compact-mode' : ''}`}>
                {sections.map(section => {
                    const dimmed = activeTab === 'main' && sectionDisabledBy(section, { selectedEngine, ddlState });
                    const collapsed = compact && isCollapsible(section);
                    return (
                        <div
                            key={section.title}
                            className={`ribbon-section${collapsed ? ' has-compact-trigger' : ''}`}
                            style={{
                                opacity: readOnly ? 0.5 : (dimmed ? 0.45 : 1),
                                transition: 'opacity 0.35s ease',
                            }}
                        >
                            <div className="ribbon-title">{section.title}</div>
                            <div className="ribbon-items">
                                {section.items.map(item => (
                                    <RibbonItem
                                        key={`${item.type}-${item.subtype}`}
                                        item={item}
                                        isActive={isItemActive(item)}
                                        isDisabled={itemDisabled(item)}
                                        onButtonClick={handleButtonClick}
                                        onDragStart={onItemDragStart}
                                    />
                                ))}
                            </div>
                            {collapsed && (
                                <div
                                    className={`ribbon-group-trigger${dropdown?.title === section.title ? ' trigger-open' : ''}`}
                                    onMouseEnter={e => openDropdown(e, section)}
                                    onMouseLeave={scheduleClose}
                                >
                                    <i className="fas fa-layer-group ribbon-trigger-icon" />
                                    <span className="ribbon-trigger-label" title={section.title}>{section.title}</span>
                                    <i className="fas fa-caret-down ribbon-trigger-arrow" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {dropdownSection && (
                <div
                    className="ribbon-compact-dropdown"
                    style={{ top: dropdown.y, left: dropdown.x }}
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                    onDragStartCapture={() => { draggingRef.current = true; }}
                    onDragEndCapture={() => { draggingRef.current = false; setDropdown(null); }}
                >
                    {dropdownSection.items.map(item => (
                        <RibbonItem
                            key={`dd-${item.type}-${item.subtype}`}
                            item={item}
                            isActive={isItemActive(item)}
                            isDisabled={itemDisabled(item)}
                            onButtonClick={it => { setDropdown(null); handleButtonClick(it); }}
                            onDragStart={onItemDragStart}
                        />
                    ))}
                </div>
            )}
        </>
    );
}
