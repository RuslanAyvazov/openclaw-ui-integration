import { PM_LINEUPS } from '../mock';
import { PM_CONTOURS, PM_ENV_LABELS, PM_ENV_COLORS } from '../constants';
import { clId, clusterName } from '../utils';

const MAX_ROWS = Math.max(
    ...Object.values(PM_LINEUPS).flatMap(l => PM_CONTOURS.map(c => (l[c] || []).length))
);
// th: 7+7px padding + ~15px text + 2px border ≈ 31px; td row: 6+6+4+4+16px = 36px; margin-top: 4px
const MATRIX_FIXED_HEIGHT = MAX_ROWS * 36 + 40;

export default function ClusterMatrix({ lineup, checked, onLineupChange, onToggle, readonly }) {
    const lineupData = PM_LINEUPS[lineup] || {};
    const maxRows = Math.max(...PM_CONTOURS.map(c => (lineupData[c] || []).length), 0);
    const selectedNames = Object.keys(checked || {})
        .filter(id => checked[id])
        .map(clusterName);

    return (
        <>
            <div className="param-row" style={{ marginBottom: 14 }}>
                <div className="param-label">Линейка <span className="param-hint">stand_name</span></div>
                <div className="dv-lineup-chips">
                    {Object.keys(PM_LINEUPS).map(name => (
                        <div
                            key={name}
                            className={`dv-lineup-chip${lineup === name ? ' active' : ''}`}
                            onClick={() => !readonly && onLineupChange(name)}
                            style={readonly ? { cursor: 'default' } : undefined}
                        >{name}</div>
                    ))}
                </div>
            </div>

            {/* Fixed height — prevents modal resize when switching lineups with different row counts */}
            <div style={{ height: MATRIX_FIXED_HEIGHT, overflow: 'visible' }}>
                {maxRows > 0 && (
                    <table
                        className="cluster-matrix"
                        style={{
                            opacity: readonly ? 0.55 : 1,
                            transition: 'opacity 0.15s',
                            pointerEvents: readonly ? 'none' : undefined,
                            userSelect: readonly ? 'none' : undefined,
                        }}
                    >
                        <thead>
                            <tr>
                                <th style={{ width: 26, borderBottom: 'none' }}></th>
                                {PM_CONTOURS.map(c => (
                                    <th key={c} className={`col-${PM_ENV_COLORS[c]}`}>{PM_ENV_LABELS[c]}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: maxRows }).map((_, i) => (
                                <tr key={i}>
                                    {i === 0 && (
                                        <td
                                            rowSpan={maxRows}
                                            style={{
                                                writingMode: 'vertical-rl',
                                                transform: 'rotate(180deg)',
                                                fontSize: 10,
                                                fontWeight: 700,
                                                color: '#9aa3b2',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.6px',
                                                textAlign: 'center',
                                                padding: '4px 5px',
                                                width: 26,
                                                verticalAlign: 'middle',
                                            }}
                                        >Кластеры</td>
                                    )}
                                    {PM_CONTOURS.map(c => {
                                        const clusters = lineupData[c] || [];
                                        const name = clusters[i];
                                        if (!name) return <td key={c}><span className="matrix-empty">—</span></td>;
                                        const id = clId(lineup, c, i);
                                        return (
                                            <td key={c}>
                                                <label className="cluster-cb-item">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!checked?.[id]}
                                                        disabled={readonly}
                                                        onChange={() => onToggle(id)}
                                                    />
                                                    <span className="cluster-cb-label">{name}</span>
                                                </label>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {selectedNames.length > 0 && (
                <div className="matrix-summary">
                    <i className="fas fa-check-circle" style={{ color: '#2a5298', fontSize: 13 }}></i>
                    <span>Выбрано:</span>
                    {selectedNames.map(n => <span key={n} className="matrix-summary-tag">{n}</span>)}
                </div>
            )}
        </>
    );
}
