// Top bar (inside the designer canvas column) showing the active page's
// branch / stream binding plus the lock button and save buttons.
//
// Behaviour:
//   - When no branch is bound: a single CTA "Импортировать поток" opens the
//     StreamImportModal.
//   - When bound: shows `branch / stream` chips, a lock toggle, and Save /
//     Save As buttons. The lock button is the user's gate into edit mode —
//     when unlocked the ribbon/canvas are read-only.

export default function BranchStreamBar({
    page,
    onOpenImport,
    onToggleLock,
    onSave,
    onSaveAs,
}) {
    const branch = page?.branch || null;
    const stream = page?.stream || null;
    const locked = !!page?.locked;
    const hasStream = !!branch && !!stream;

    if (!hasStream) {
        // Ручной сценарий: новый поток ещё не привязан к ветке. Пользователь
        // может сразу заблокировать его и настраивать модули на Ribbon, а
        // потом «Сохранить как…» в ветку; импорт — альтернативный путь.
        return (
            <div className={`branch-bar branch-bar--empty${locked ? ' is-locked' : ''}`}>
                <div className="branch-bar-empty-text">
                    <i className="fas fa-info-circle" />
                    <span>
                        {locked
                            ? 'Поток редактируется. Настройте модули и сохраните его в ветку.'
                            : 'Новый поток. Заблокируйте его для редактирования или импортируйте существующий из ветки.'}
                    </span>
                </div>

                <button
                    className={`branch-lock-btn${locked ? ' is-locked' : ''}`}
                    onClick={onToggleLock}
                    title={locked ? 'Разблокировать (выйти из режима редактирования)' : 'Заблокировать поток для редактирования'}
                >
                    <i className={locked ? 'fas fa-lock' : 'fas fa-lock-open'} />
                    <span>{locked ? 'Заблокирован' : 'Только чтение'}</span>
                </button>

                <button className="branch-bar-cta" onClick={onOpenImport}>
                    <i className="fas fa-cloud-download-alt" />
                    Импортировать поток…
                </button>

                <button
                    className="branch-save-btn branch-save-btn--secondary"
                    onClick={onSaveAs}
                    title="Сохранить поток в ветку репозитория"
                >
                    <i className="fas fa-code-branch" />
                    Сохранить как…
                </button>
            </div>
        );
    }

    return (
        <div className={`branch-bar${locked ? ' is-locked' : ' is-readonly'}`}>
            <button className="branch-chip branch-chip--branch" onClick={onOpenImport} title="Сменить ветку или поток">
                <i className="fas fa-code-branch" />
                <span>{branch}</span>
            </button>

            <i className="fas fa-arrow-right branch-bar-sep" />

            <button className="branch-chip branch-chip--stream" onClick={onOpenImport} title="Сменить поток">
                <i className="fas fa-stream" />
                <span>{stream}</span>
            </button>

            <button
                className={`branch-lock-btn${locked ? ' is-locked' : ''}`}
                onClick={onToggleLock}
                title={locked ? 'Разблокировать (выйти из режима редактирования)' : 'Заблокировать поток для редактирования'}
            >
                <i className={locked ? 'fas fa-lock' : 'fas fa-lock-open'} />
                <span>{locked ? 'Заблокирован' : 'Только чтение'}</span>
            </button>

            <div className="branch-bar-spacer" />

            <button
                className="branch-save-btn"
                onClick={onSave}
                disabled={!locked}
                title={locked ? `Сохранить (commit в ветку ${branch})` : 'Сначала заблокируйте поток для редактирования'}
            >
                <i className="fas fa-save" />
                Сохранить
            </button>

            <button
                className="branch-save-btn branch-save-btn--secondary"
                onClick={onSaveAs}
                title="Сохранить в другую ветку или под другим именем"
            >
                <i className="fas fa-code-branch" />
                Сохранить как…
            </button>
        </div>
    );
}
