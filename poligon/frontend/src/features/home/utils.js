import { PM_LINEUPS } from './mock';
import { PM_CONTOURS, FRAMEWORK_DEFAULTS } from './constants';

export function clId(lineup, contour, idx) { return `${lineup}__${contour}__${idx}`; }

export function clusterName(id) {
    const parts = id.split('__');
    return (PM_LINEUPS[parts[0]] && PM_LINEUPS[parts[0]][parts[1]] && PM_LINEUPS[parts[0]][parts[1]][+parts[2]]) || id;
}

export function checkedToNames(checked) {
    return Object.keys(checked || {}).filter(id => checked[id]).map(clusterName);
}

export function namesToChecked(lineup, names) {
    const checked = {};
    const lineupData = PM_LINEUPS[lineup] || {};
    PM_CONTOURS.forEach(contour => {
        const list = lineupData[contour] || [];
        list.forEach((name, idx) => {
            if (names.includes(name)) checked[clId(lineup, contour, idx)] = true;
        });
    });
    return checked;
}

export function makeFrameworkDefaults(block, group, datamartName) {
    const b = block || '{block}';
    const g = group || '{group}';
    const n = datamartName || '{datamart_name}';
    return FRAMEWORK_DEFAULTS.map(row => ({
        key: row.key,
        value: row.value.replace(/\{block\}/g, b).replace(/\{group\}/g, g).replace(/\{datamart_name\}/g, n),
    }));
}
