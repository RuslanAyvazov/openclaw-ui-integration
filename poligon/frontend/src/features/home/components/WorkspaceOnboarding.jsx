export default function WorkspaceOnboarding({ onCreate, onBrowse }) {
    return (
        <div className="ws-onboarding">
            <div className="ws-onboarding-eyebrow">B2CSQL Studio</div>
            <h2 className="ws-onboarding-title">Начните с пространства</h2>
            <p className="ws-onboarding-sub">
                Пространство объединяет команду и витрины данных в единый контекст. Создайте своё или присоединитесь к&nbsp;существующему.
            </p>

            <div className="ws-onboarding-cards">
                <button className="ws-onboarding-card create" type="button" onClick={onCreate}>
                    <div className="ws-ob-icon">
                        <i className="fas fa-layer-group" />
                    </div>
                    <div className="ws-ob-title">Создать пространство</div>
                    <div className="ws-ob-desc">
                        Новое рабочее пространство для вашей команды. Добавляйте участников, управляйте ролями и создавайте витрины данных.
                    </div>
                    <div className="ws-ob-btn">
                        <i className="fas fa-plus" /> Создать
                    </div>
                </button>

                <button className="ws-onboarding-card join" type="button" onClick={onBrowse}>
                    <div className="ws-ob-icon">
                        <i className="fas fa-search" />
                    </div>
                    <div className="ws-ob-title">Найти пространство</div>
                    <div className="ws-ob-desc">
                        Просмотрите публичные пространства вашей организации и подайте заявку на&nbsp;участие. Администратор её одобрит.
                    </div>
                    <div className="ws-ob-btn">
                        <i className="fas fa-arrow-right" /> Найти
                    </div>
                </button>
            </div>
        </div>
    );
}
