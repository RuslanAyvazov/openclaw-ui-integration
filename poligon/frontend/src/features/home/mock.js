// Mock API responses for Home feature.
// PM_LINEUPS will eventually come from /api/lineups when backend is ready.
// Workspace data will come from /api/workspaces when backend is ready.

export const MOCK_CURRENT_USER = {
    id: 'u1', name: 'Иван Петров', email: 'ipetrov@company.ru', initials: 'ИП',
};

export const MOCK_WORKSPACES = [
    {
        id: 'ws1', name: 'CX B2C Analytics', slug: 'cxb2c',
        description: 'Аналитические витрины для CX B2C продуктов банка',
        color: '#3498db', membersCount: 12, datamartsCount: 8,
        role: 'admin', isPublic: false,
    },
    {
        id: 'ws2', name: 'SBOL Data Team', slug: 'sbol',
        description: 'Витрины данных для дистанционных каналов',
        color: '#27ae60', membersCount: 5, datamartsCount: 3,
        role: 'developer', isPublic: false,
    },
];

export const MOCK_WORKSPACE_MEMBERS = [
    { id: 'u1', name: 'Иван Петров',    email: 'ipetrov@company.ru',   initials: 'ИП', role: 'admin',     joinedAt: '2024-01-15' },
    { id: 'u2', name: 'Мария Сидорова', email: 'msidorova@company.ru', initials: 'МС', role: 'developer', joinedAt: '2024-01-20' },
    { id: 'u3', name: 'Алексей Козлов', email: 'akozlov@company.ru',   initials: 'АК', role: 'analyst',   joinedAt: '2024-02-01' },
    { id: 'u4', name: 'Елена Новикова', email: 'enovikova@company.ru', initials: 'ЕН', role: 'analyst',   joinedAt: '2024-02-10' },
    { id: 'u5', name: 'Дмитрий Волков', email: 'dvolkov@company.ru',   initials: 'ДВ', role: 'developer', joinedAt: '2024-02-15' },
];

export const MOCK_WORKSPACE_REQUESTS = [
    { id: 'r1', user: { id: 'u6', name: 'Светлана Морозова', email: 'smoroz@company.ru',   initials: 'СМ' }, message: 'Хочу присоединиться к команде аналитиков', requestedAt: '2024-03-01' },
    { id: 'r2', user: { id: 'u7', name: 'Павел Лебедев',     email: 'plebedev@company.ru', initials: 'ПЛ' }, message: 'Разработчик витрин данных, хочу контрибьютить', requestedAt: '2024-03-05' },
];

export const MOCK_PUBLIC_WORKSPACES = [
    { id: 'ws3', name: 'Розничная аналитика',  description: 'Розничные витрины для RZTK', membersCount: 24, datamartsCount: 15, color: '#e74c3c' },
    { id: 'ws4', name: 'Premium Intelligence', description: 'Аналитика для Premium сегмента', membersCount: 8, datamartsCount: 5, color: '#9b59b6' },
    { id: 'ws5', name: 'Digital Marketing',    description: 'Витрины для маркетинговой аналитики', membersCount: 16, datamartsCount: 11, color: '#f39c12' },
    { id: 'ws6', name: 'NPS & CX Metrics',     description: 'Метрики клиентского опыта', membersCount: 7, datamartsCount: 4, color: '#1abc9c' },
];

export const PM_LINEUPS = {
    cxb2c: { dev: ['devbalsdpganza9','devsdpcxb2c'], ift: ['iftsdpganza9'], psi: ['psisdpganza9'], rdt: ['utsklsdprozn2'], prom: ['arnsdprozn'] },
    blago: { dev: ['devbalsdpblago'], ift: ['iftsdpblago'], psi: [], rdt: ['utsklsdpblago'], prom: ['arnsdpblago'] },
    rozn2: { dev: ['devsdprozn1','devsdprozn2'], ift: ['iftsdprozn1'], psi: ['psisdprozn1'], rdt: ['utsklsdprozn1'], prom: ['arnsdprozn2'] },
    tkp:   { dev: ['devsdptkp1'], ift: ['iftsdptkp1'], psi: [], rdt: ['utsklsdptkp1','utsklsdptkp2'], prom: ['arnsdptkp1'] },
    nba:   { dev: ['devsdpnba1'], ift: [], psi: ['psisdpnba1'], rdt: ['utsklsdpnba1'], prom: ['arnsdpnba1'] },
    sbol:  { dev: ['devbalsdpsbol1','devsdpsbol2'], ift: ['iftsdpsbol1'], psi: ['psisdpsbol1'], rdt: ['utsklsdpsbol1'], prom: ['arnsdpsbol1'] },
    ecom:  { dev: ['devsdpecom1'], ift: ['iftsdpecom1'], psi: [], rdt: ['utsklsdpecom1'], prom: ['arnsdpecom1'] },
    ub:    { dev: ['devsdpub1'], ift: [], psi: [], rdt: ['utsklsdpub1'], prom: ['arnsdpub1'] },
    prem:  { dev: ['devsdpprem1'], ift: ['iftsdpprem1'], psi: ['psisdpprem1'], rdt: ['utsklsdpprem1'], prom: ['arnsdpprem1','arnsdpprem2'] },
};
