import { useState, useEffect } from 'react';
import PassportSection from './PassportSection';
import { checkedToNames } from '../utils';

const EMPTY = {
    displayName: '', owner: '', block: '', datamartGroup: '', datamartName: '',
    ciItService: '', ciAsFp: '', sqPrKey: '', emails: '', externalLibs: '',
    lineup: 'cxb2c', clusterChecked: {},
};

// `initial` — необязательный префилл полей (например, из проекта ИИ-ассистента).
// `requireAll` — строгий режим: название, владелец, block, group, name и хотя бы
// один кластер обязательны (используется при создании карточки из SQL-редактора).
export default function CreateDatamartModal({ open, onClose, onCreate, initial = null, requireAll = false }) {
    const [passport, setPassport] = useState(EMPTY);
    const [submitting, setSubmitting] = useState(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { if (open) setPassport({ ...EMPTY, ...(initial || {}) }); }, [open]);

    if (!open) return null;

    const clustersPicked = checkedToNames(passport.clusterChecked).length > 0;
    const missingRequired = requireAll && (
        !passport.displayName.trim() || !passport.owner.trim() || !passport.block.trim()
        || !passport.datamartGroup.trim() || !passport.datamartName.trim() || !clustersPicked
    );

    async function submit() {
        if (!passport.datamartName.trim() || missingRequired || submitting) return;
        setSubmitting(true);
        try {
            const clusters = checkedToNames(passport.clusterChecked);
            const result = await onCreate({
                name: passport.displayName.trim() || passport.datamartName.trim(),
                displayName: passport.displayName.trim() || passport.datamartName.trim(),
                owner: passport.owner.trim() || 'Администратор',
                description: '',
                status: 'draft',
                createdAt: new Date().toISOString().slice(0, 10),
                passport: {
                    displayName: passport.displayName.trim(),
                    owner: passport.owner.trim(),
                    block: passport.block.trim(),
                    datamartGroup: passport.datamartGroup.trim(),
                    datamartName: passport.datamartName.trim(),
                    ciItService: passport.ciItService.trim(),
                    ciAsFp: passport.ciAsFp.trim(),
                    sqPrKey: passport.sqPrKey.trim(),
                    emails: passport.emails.trim(),
                    externalLibs: passport.externalLibs.trim(),
                    lineup: passport.lineup,
                    clusters,
                    frameworkVars: [],
                },
            });
            if (result !== false) onClose();
        } finally { setSubmitting(false); }
    }

    return (
        <div
            className="modal passport-modal active"
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="modal-content passport-modal-content">
                <div className="modal-header passport-modal-header">
                    <div className="passport-modal-title-wrap">
                        <i className="fas fa-id-card passport-modal-icon"></i>
                        <div>
                            <div className="modal-title">Паспорт новой витрины</div>
                            <div className="passport-modal-subtitle">Заполните параметры — они задаются один раз при создании</div>
                        </div>
                    </div>
                    <button className="modal-close" type="button" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body passport-modal-body">
                    <PassportSection values={passport} onChange={setPassport} />
                </div>

                <div className="modal-footer" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 12, color: missingRequired ? '#e67e22' : '#a0aec0', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <i className={missingRequired ? 'fas fa-circle-exclamation' : 'fas fa-shield-alt'} style={{ color: missingRequired ? '#e67e22' : '#b3c6e0' }}></i>
                        {missingRequired
                            ? 'Заполните название, владельца, block, group, name и выберите хотя бы один кластер'
                            : 'Параметры можно изменить позже в настройках витрины'}
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button className="btn btn-secondary" type="button" onClick={onClose}>Отмена</button>
                        <button
                            className="btn btn-primary"
                            type="button"
                            disabled={!passport.datamartName.trim() || missingRequired || submitting}
                            onClick={submit}
                            style={{ display: 'flex', alignItems: 'center', gap: 7 }}
                        >
                            <i className="fas fa-plus"></i>
                            {submitting ? 'Создание…' : 'Создать витрину'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
