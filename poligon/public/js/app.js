        // Инициализация DOM элементов
        const homePage = document.getElementById('homePage');
        const monitoringPage = document.getElementById('monitoringPage');
        const designerPage = document.getElementById('designerPage');
        const tilesContainer = document.getElementById('tilesContainer');
        const addTile = document.getElementById('addTile');
        const addTileContextMenu = document.getElementById('addTileContextMenu');
        const createModal = document.getElementById('createModal');
        const importDatamartModal = document.getElementById('importDatamartModal');
        const closeImportDatamartModal = document.getElementById('closeImportDatamartModal');
        const cancelImportDatamartBtn = document.getElementById('cancelImportDatamartBtn');
        const importDatamartSubmitBtn = document.getElementById('importDatamartSubmitBtn');
        const importDatamartBitbucketLink = document.getElementById('importDatamartBitbucketLink');
        const closeModal = document.getElementById('closeModal');
        const cancelCreate = document.getElementById('cancelCreate');
        const submitCreate = document.getElementById('submitCreate');
        const createForm = document.getElementById('createForm');
        const editModal = document.getElementById('editModal');
        const closeEditModal = document.getElementById('closeEditModal');
        const cancelEdit = document.getElementById('cancelEdit');
        const saveEdit = document.getElementById('saveEdit');
        const deleteDatamartBtn = document.getElementById('deleteDatamartBtn');
        const editForm = document.getElementById('editForm');
        const editTabButtons = document.querySelectorAll('.modal-tab-btn[data-edit-tab]');
        const editTabPanes = document.querySelectorAll('.modal-tab-pane[data-edit-pane]');
        const designerGrid = document.getElementById('designerGrid');
        const propertiesPanel = document.getElementById('propertiesPanel');
        const propertiesResizer = document.getElementById('propertiesResizer');
        const propertiesHeader = document.getElementById('propertiesHeader');
        const propertiesHeaderTitle = document.getElementById('propertiesHeaderTitle');
        const propertiesCloseBtn = document.getElementById('propertiesCloseBtn');
        const propertiesDiscardBtn = document.getElementById('propertiesDiscardBtn');
        const propertiesSaveBtn = document.getElementById('propertiesSaveBtn');
        const sidebarConfirmModal = document.getElementById('sidebarConfirmModal');
        const sidebarConfirmSaveBtn = document.getElementById('sidebarConfirmSaveBtn');
        const sidebarConfirmDiscardBtn = document.getElementById('sidebarConfirmDiscardBtn');
        const sidebarConfirmCancelBtn = document.getElementById('sidebarConfirmCancelBtn');
        const defaultPropertiesContent = document.getElementById('defaultPropertiesContent');
        const move2paPropertiesContent = document.getElementById('move2paPropertiesContent');
        const checkpointPropertiesContent = document.getElementById('checkpointPropertiesContent');
        const engineSparkPropertiesContent = document.getElementById('engineSparkPropertiesContent');
        const engineFlinkPropertiesContent = document.getElementById('engineFlinkPropertiesContent');
        const coalescePropertiesContent = document.getElementById('coalescePropertiesContent');
        const historyPropertiesContent = document.getElementById('historyPropertiesContent');
        const historyOptionalToggle = document.getElementById('historyOptionalToggle');
        const historyOptionalFields = document.getElementById('historyOptionalFields');
        const homeBreadcrumb = document.getElementById('homeBreadcrumb');
        const currentDatamart = document.getElementById('currentDatamart');
        const logo = document.getElementById('logo');
        const logoMonitoring = document.getElementById('logoMonitoring');
        const logoDesigner = document.getElementById('logoDesigner');
        const notification = document.getElementById('notification');
        const homeMonitoringNav = document.getElementById('homeMonitoringNav');
        const designerMonitoringNav = document.getElementById('designerMonitoringNav');
        const monitoringDatamartsNav = document.getElementById('monitoringDatamartsNav');
        const homeDatamartsToggle = document.getElementById('homeDatamartsToggle');
        const designerDatamartsToggle = document.getElementById('designerDatamartsToggle');
        const homeDatamartsMenu = document.getElementById('homeDatamartsMenu');
        const designerDatamartsMenu = document.getElementById('designerDatamartsMenu');
        const monitoringColgroup = document.getElementById('monitoringColgroup');
        const monitoringHeaderRow = document.getElementById('monitoringHeaderRow');
        const monitoringTableBody = document.getElementById('monitoringTableBody');
        const monitoringFilterMenu = document.getElementById('monitoringFilterMenu');
        const resetMonitoringFiltersBtn = document.getElementById('resetMonitoringFiltersBtn');
        const monitoringRowsPerPage = document.getElementById('monitoringRowsPerPage');
        const monitoringPrevPageBtn = document.getElementById('monitoringPrevPageBtn');
        const monitoringNextPageBtn = document.getElementById('monitoringNextPageBtn');
        const monitoringPageInfo = document.getElementById('monitoringPageInfo');
        const ribbonTabs = document.querySelectorAll('.ribbon-tab');
        const ribbonMain = document.getElementById('ribbonMain');
        const ribbonHelp = document.getElementById('ribbonHelp');
        const designerMain = document.querySelector('.designer-main');

        // Кнопки для выбора engine
        const sparkBtn = document.getElementById('sparkBtn');
        const flinkBtn = document.getElementById('flinkBtn');
        const checkpointBtn = document.getElementById('checkpointBtn');
        const deployBtn = document.getElementById('deployBtn');
        const deployModal = document.getElementById('deployModal');
        const closeDeployModalBtn = document.getElementById('closeDeployModal');
        const cancelDeployModalBtn = document.getElementById('cancelDeployModal');
        const saveDeployModalBtn = document.getElementById('saveDeployModal');
        const deployModeStd = document.getElementById('deployModeStd');
        const deployModePar = document.getElementById('deployModePar');
        const deployVersionInput = document.getElementById('deployVersionInput');
        const deployAccountInput = document.getElementById('deployAccountInput');
        const deployFlowList = document.getElementById('deployFlowList');
        const deployFlowToggleAll = document.getElementById('deployFlowToggleAll');
        const deployFlowSummary = document.getElementById('deployFlowSummary');
        const deployScenarioClusters = document.getElementById('deployScenarioClusters');
        const deployScenarioButtons = document.querySelectorAll('[data-deploy-scenario]');
        const deployResultModal = document.getElementById('deployResultModal');
        const closeDeployResultModalBtn = document.getElementById('closeDeployResultModal');
        const okDeployResultModalBtn = document.getElementById('okDeployResultModal');

        // View Selector элементы - ОБНОВЛЕНО
        const viewSelector = document.getElementById('viewSelector');
        const directoryViewBtn = document.getElementById('directoryViewBtn');
        const sqlViewBtn = document.getElementById('sqlViewBtn');
        const designerViewBtn = document.getElementById('designerViewBtn');
        const graphViewBtn = document.getElementById('graphViewBtn');
        const directoryView = document.getElementById('directoryView');
        const sqlEditorView = document.getElementById('sqlEditorView');
        const designerView = document.getElementById('designerView');
        const graphView = document.getElementById('graphView');

        // Элементы SQL редактора
        const sqlEditor = document.getElementById('sqlEditor');
        const executeBtn = document.getElementById('executeBtn');
        const cancelBtn = document.getElementById('cancelBtn');
        const fwVersionSelect = document.getElementById('fwVersionSelect');
        const tabResults = document.getElementById('tabResults');
        const tabExplain = document.getElementById('tabExplain');
        const tableContainer = document.getElementById('tableContainer');
        const sparkPlan = document.getElementById('sparkPlan');
        const outputPanel = document.getElementById('outputPanel');
        const toggleOutputBtn = document.getElementById('toggleOutputBtn');
        const closeOutputBtn = document.getElementById('closeOutputBtn');
        const dbSidebar = document.getElementById('dbSidebar');
        const toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
        const sparkSessionList = document.getElementById('sparkSessionList');
        const addSparkSessionBtn = document.getElementById('addSparkSessionBtn');
        const dbFilterInput = document.getElementById('dbFilterInput');
        const tabContainer = document.getElementById('tabContainer');
        const newTabBtnHeader = document.getElementById('newTabBtnHeader');
        const tableHeader = document.getElementById('tableHeader');
        const tableBody = document.getElementById('tableBody');
        const connStatus = document.getElementById('connStatus');
        const connStatusText = document.getElementById('connStatusText');
        const sqlMainPanel = document.querySelector('#sqlEditorView .main-panel');

        // Элементы для управления вкладками
        const canvasPages = document.getElementById('canvasPages');
        const canvasTabs = document.getElementById('canvasTabs');
        const tabsContainer = document.getElementById('tabsContainer');
        const addTabBtn = document.getElementById('addTabBtn');
        const scrollLeftBtn = document.getElementById('scrollLeftBtn');
        const scrollRightBtn = document.getElementById('scrollRightBtn');
        const pageModal = document.getElementById('pageModal');
        const closePageModal = document.getElementById('closePageModal');
        const cancelPageCreate = document.getElementById('cancelPageCreate');
        const submitPageCreate = document.getElementById('submitPageCreate');
        const pageForm = document.getElementById('pageForm');
        const sparkConfigModal = document.getElementById('sparkConfigModal');
        const closeSparkConfigModal = document.getElementById('closeSparkConfigModal');
        const cancelSparkConfig = document.getElementById('cancelSparkConfig');
        const saveSparkConfig = document.getElementById('saveSparkConfig');
        const sparkProfilesTableModal = document.getElementById('sparkProfilesTableModal');
        const closeSparkProfilesTableModal = document.getElementById('closeSparkProfilesTableModal');
        const closeSparkProfilesTableBtn = document.getElementById('closeSparkProfilesTableBtn');
        const sparkCommonTextModal = document.getElementById('sparkCommonTextModal');
        const closeSparkCommonTextModal = document.getElementById('closeSparkCommonTextModal');
        const cancelSparkCommonTextModal = document.getElementById('cancelSparkCommonTextModal');
        const saveSparkCommonTextModal = document.getElementById('saveSparkCommonTextModal');
        const sparkCommonTextEditor = document.getElementById('sparkCommonTextEditor');
        const sparkConfigCode = document.getElementById('sparkConfigCode');
        const sparkSessionNameInput = document.getElementById('sparkSessionNameInput');
        const sqlPreviewGroup = document.getElementById('sqlPreviewGroup');
        const sqlPreviewTextarea = document.getElementById('sqlPreviewTextarea');
        const moduleEnabledToggle = document.getElementById('moduleEnabledToggle');
        const moduleCommentInput = document.getElementById('moduleCommentInput');
        const openSqlEditorBtn = document.getElementById('openSqlEditorBtn');
        const sqlEditorModal = document.getElementById('sqlEditorModal');
        const sqlModalElementName = document.getElementById('sqlModalElementName');
        const sqlModalTextarea = document.getElementById('sqlModalTextarea');
        const sqlModalValidation = document.getElementById('sqlModalValidation');
        const closeSqlModalBtn = document.getElementById('closeSqlModalBtn');
        const cancelSqlModalBtn = document.getElementById('cancelSqlModalBtn');
        const saveSqlModalBtn = document.getElementById('saveSqlModalBtn');
        const dbSidebarResizer = document.getElementById('dbSidebarResizer');
        const sparkSessionsPanel = document.getElementById('sparkSessionsPanel');
        const sparkDbResizer = document.getElementById('sparkDbResizer');

        // Переменные для хранения данных
        let datamartCounter = 3;
        let currentDatamartId = null;
        let currentDatamartName = "Модель продаж";
        let selectedElement = null;
        let selectedElements = [];
        let selectionBox = null;
        let selectionDragState = null;
        let suppressNextCanvasBackgroundClear = false;
        let deletedElementsHistory = [];
        let elements = [];
        let elementCounter = 0;
        let dagConnectionCounter = 0;
        let dagLinkPreview = null;
        let dagLinkDragState = null;
        let sqlModalDraft = '';
        let sqlModalOriginal = '';
        let sqlModalTargetElementId = null;
        const defaultPropertiesPanelWidth = 390;
        let propertiesPanelWidth = defaultPropertiesPanelWidth;
        let sidebarHasChanges = false;
        let sidebarSnapshot = null;

        const moduleTypeConfig = {
            'query:transform': { sqlCapable: true },
            'query:history': { sqlCapable: true },
            'query:quality': { sqlCapable: true },
            'query:reconciliation': { sqlCapable: true },
            'insert:move2pa': { sqlCapable: true },
            'insert:coalesce': { sqlCapable: true }
        };

        const sqlFunctionMap = {
            transform: 'ICEBERG.TRANSFORM',
            history: 'ICEBERG.HISTORICITY',
            quality: 'ICEBERG.QUALITY_CHECK',
            reconciliation: 'ICEBERG.RECONCILIATION',
            move2pa: 'ICEBERG.MOVE2PA',
            coalesce: 'iceberg_pckg.coalesce'
        };

        const sqlAllowedArgsBySubtype = {
            transform: ['params', 'data_source'],
            quality: ['params', 'data_source'],
            reconciliation: ['params', 'data_source'],
            move2pa: ['pa_table', 'hist_table'],
            coalesce: ['tables', 'schema', 'target_file_size_mb', 'compression_codec', 'parallel_degree', 'snapshot_retention', 'rewrite_manifests', 'delete_orphan_files', 'exclude_partitions', 'include_partitions', 'analyze_by', 'custom_strategy'],
            history: [
                'mode',
                'incr_table',
                'pa_table',
                'hist_table',
                'mapping_inc',
                'mapping_pa',
                'pk_inc',
                'pk_pa',
                'hash_policy_algo',
                'hash_policy_exclude_cols',
                'hash_policy_hash_col',
                'dedup_policy_on_duplicate_order_by_clause',
                'target_table',
                'snapshot_table',
                'hash_algorithm'
            ]
        };

        // Текущие выбранные опции
        const designerState = {
            engine: null,
            checkpointActive: false,
            checkpointStartMode: 'FROM_START'
        };
        let activeSidebarModule = null;
        let currentView = 'designer'; // 'directory', 'sql' или 'designer'

        // Управление страницами canvas
        let pages = [];
        let currentPageId = null;
        let pageCounter = 0;
        let editingTab = null;

        // SQL Editor переменные
        const sqlQueries = {
            1: `-- query_1.sql
-- Запрос для default базы данных
-- Нажмите Execute для результатов (20 строк × 15 колонок)

SELECT
    u.user_id,
    u.username,
    u.email,
    u.created_at,
    u.last_login,
    u.status,
    p.product_name,
    p.category,
    p.price,
    p.stock_quantity,
    o.order_id,
    o.order_date,
    o.total_amount,
    o.status as order_status,
    o.shipping_address
FROM users u
JOIN orders o ON u.user_id = o.user_id
JOIN products p ON o.product_id = p.product_id
WHERE o.status = 'completed'
ORDER BY o.order_date DESC
LIMIT 20;`,
            2: `-- query_2.sql
-- Анализ продаж по категориям
-- custom_b2c_ar_test database

SELECT
    c.category_name,
    COUNT(DISTINCT o.order_id) as total_orders,
    SUM(od.quantity) as items_sold,
    ROUND(SUM(od.unit_price * od.quantity * (1 - od.discount)), 2) as revenue,
    ROUND(AVG(od.unit_price * od.quantity * (1 - od.discount)), 2) as avg_order_value,
    MIN(o.order_date) as first_order,
    MAX(o.order_date) as last_order,
    COUNT(DISTINCT c.customer_id) as unique_customers,
    SUM(od.quantity * p.weight) as total_weight,
    ROUND(AVG(od.discount), 3) as avg_discount,
    COUNT(DISTINCT p.supplier_id) as suppliers_count,
    SUM(CASE WHEN o.shipped_date IS NOT NULL THEN 1 ELSE 0 END) as shipped_orders,
    ROUND(AVG(o.freight), 2) as avg_freight,
    COUNT(DISTINCT o.employee_id) as employees_involved,
    SUM(od.quantity * p.volume) as total_volume
FROM categories c
JOIN products p ON c.category_id = p.category_id
JOIN order_details od ON p.product_id = od.product_id
JOIN orders o ON od.order_id = o.order_id
JOIN customers c ON o.customer_id = c.customer_id
WHERE o.order_date >= '2024-01-01'
GROUP BY c.category_name
ORDER BY revenue DESC;`
        };
        const sqlTabTitles = {
            1: 'query_1.sql',
            2: 'query_2.sql'
        };
        const sqlTabSessionMap = {
            1: null,
            2: null
        };
        const sqlTabConnectionState = {
            1: 'disconnected',
            2: 'disconnected'
        };
        let tabCounter = 2;

        let sparkSessionCounter = 3;
        let editingSparkSessionId = null;
        let activeSparkSessionId = 1;
        let sparkTableRowsCache = [];
        let sparkTableHeadersCache = [];
        let sparkTableFilters = {};
        let sparkTableColWidths = [];
        let sparkTableSelectedCol = -1;
        let sparkTableWrappedCols = {};
        let sparkSessions = [
            {
                id: 1,
                name: 'Spark DEV Small',
                params: {
                    master: 'yarn',
                    executorMemory: '4g',
                    executors: 2,
                    shufflePartitions: 64
                }
            },
            {
                id: 2,
                name: 'Spark PROD Balanced',
                params: {
                    master: 'yarn',
                    executorMemory: '8g',
                    executors: 6,
                    shufflePartitions: 200
                }
            },
            {
                id: 3,
                name: 'Spark ADHOC Fast',
                params: {
                    master: 'local[*]',
                    executorMemory: '6g',
                    executors: 3,
                    shufflePartitions: 120
                }
            }
        ];

        // Пример данных витрин
        const datamarts = {
            1: { id: 1, name: "Модель продаж", status: "active", owner: "Администратор", description: "Агрегированные данные по продажам по регионам, категориям и временным периодам.", createdAt: "2023-06-15", pages: [] },
            2: { id: 2, name: "Анализ клиентов", status: "active", owner: "Администратор", description: "Детализированная информация о клиентах, их покупках и предпочтениях.", createdAt: "2023-06-10", pages: [] },
            3: { id: 3, name: "Финансовые отчеты", status: "draft", owner: "Администратор", description: "Консолидированные финансовые данные для отчетности и планирования.", createdAt: "2023-06-05", pages: [] }
        };

        // Функции для SQL редактора
        function generateLargeDataset() {
            const companies = ['Vins et alcools', 'Toms Spezialitäten', 'Hanari Carnes', 'Victuailles en stock', 'Suprêmes délices',
                              'Bottom-Dollar Markets', 'Save-a-lot Markets', 'Richter Supermarkt', 'Wellington Importadora',
                              'HILARION-Abastos', 'Ernst Handel', 'Familia Arquibaldo', 'FISSA Fabrica', 'Frankenversand',
                              'France restauration', 'Furia Bacalhau', 'Galería del gastrónomo', 'Godos Cocina Típica',
                              'Gourmet Lanchonetes', 'Great Lakes Food Market'];

            const firstNames = ['John', 'Jane', 'Bob', 'Alice', 'Mike', 'Sarah', 'David', 'Lisa', 'Tom', 'Emma',
                               'Chris', 'Anna', 'Paul', 'Laura', 'Mark', 'Sophie', 'Kevin', 'Rachel', 'Brian', 'Nancy'];

            const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
                              'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

            const cities = ['Seattle', 'Portland', 'San Francisco', 'Los Angeles', 'San Diego', 'Denver', 'Phoenix', 'Dallas', 'Houston', 'Chicago',
                           'Miami', 'Atlanta', 'Boston', 'New York', 'Philadelphia', 'Washington', 'Nashville', 'Memphis', 'New Orleans', 'Orlando'];

            const products = ['Chai', 'Chang', 'Aniseed Syrup', 'Chef Antons Cajun Seasoning', 'Grandmas Boysenberry Spread',
                             'Uncle Bobs Organic Dried Pears', 'Northwoods Cranberry Sauce', 'Mishi Kobe Niku', 'Ikura', 'Queso Cabrales',
                             'Queso Manchego La Pastora', 'Konbu', 'Tofu', 'Genen Shouyu', 'Pavlova', 'Carnarvon Tigers', 'Teatime Chocolate Biscuits'];

            const headers = [
                'order_id', 'company_name', 'order_date', 'total', 'ship_name',
                'ship_address', 'ship_city', 'ship_country', 'contact_name', 'contact_title',
                'phone', 'fax', 'product_id', 'quantity', 'discount'
            ];

            const rows = [];

            for (let i = 0; i < 20; i++) {
                const company = companies[i % companies.length];
                const firstName = firstNames[i % firstNames.length];
                const lastName = lastNames[i % lastNames.length];
                const city = cities[i % cities.length];
                const product = products[i % products.length];
                const productId = 100 + i;
                const quantity = 5 + Math.floor(Math.random() * 30);
                const unitPrice = 10 + Math.random() * 40;
                const discount = Math.random() * 0.2;
                const total = (unitPrice * quantity * (1 - discount)).toFixed(2);

                rows.push([
                    10248 + i,                                          // order_id
                    company,                                            // company_name
                    `2024-07-${(i+1).toString().padStart(2, '0')}`,    // order_date
                    total,                                              // total
                    `Order ${String.fromCharCode(65 + i)}`,            // ship_name
                    `${i+100} Main St`,                                 // ship_address
                    city,                                               // ship_city
                    'USA',                                              // ship_country
                    `${firstName} ${lastName}`,                         // contact_name
                    i % 2 === 0 ? 'Sales Representative' : 'Owner',    // contact_title
                    `(555) ${100 + i}-${2000 + i}`,                    // phone
                    i % 3 === 0 ? `(555) ${300 + i}-${4000 + i}` : '—', // fax
                    productId,                                          // product_id
                    quantity,                                           // quantity
                    discount.toFixed(2)                                 // discount
                ]);
            }
            return { headers, rows };
        }

        function renderLargeData() {
            const { headers, rows } = generateLargeDataset();
            let headerHtml = '<tr>' + headers.map(h => `<th>${h}</th>`).join('') + '</tr>';
            tableHeader.innerHTML = headerHtml;

            let bodyHtml = '';
            rows.forEach(r => {
                bodyHtml += '<tr>' + r.map(c => `<td>${c}</td>`).join('') + '</tr>';
            });
            tableBody.innerHTML = bodyHtml;

            const statusBarSpan = document.querySelector('.status-bar span:first-child');
            if (statusBarSpan) {
                statusBarSpan.innerHTML = '<i class="fas fa-table"></i> 20 rows · 15 columns';
            }
        }

        function setConnectionStatus(status = 'connected') {
            if (!connStatus || !connStatusText) return;
            const disconnected = status === 'disconnected';
            const connecting = status === 'connecting';
            connStatus.classList.toggle('disconnected', disconnected);
            connStatus.classList.toggle('connecting', connecting);
            if (connecting) {
                connStatusText.textContent = 'Connecting...';
            } else {
                connStatusText.textContent = disconnected ? 'Disconnected' : 'Connected';
            }
        }

        function switchSqlTab(tabId) {
            document.querySelectorAll('.tab').forEach(t => {
                t.classList.remove('active');
            });

            const activeTab = document.querySelector(`.tab[data-tab="${tabId}"]`);
            if (activeTab) {
                activeTab.classList.add('active');
            }

            sqlEditor.value = sqlQueries[tabId] || `-- query_${tabId}.sql
-- New SQL query

SELECT * FROM your_table LIMIT 20;`;
            sqlEditor.setAttribute('data-tab', tabId);

            const linkedSessionId = sqlTabSessionMap[tabId] ?? null;
            if (linkedSessionId && sparkSessions.some(item => item.id === linkedSessionId)) {
                selectSparkSession(linkedSessionId);
            } else if (!linkedSessionId && activeSparkSessionId !== null) {
                activeSparkSessionId = null;
                renderSparkSessions();
            }

            setConnectionStatus(sqlTabConnectionState[tabId] || 'connected');
        }

        function attachSqlTabHandlers(tabElement) {
            tabElement.addEventListener('click', function(e) {
                if (e.target.classList.contains('fa-times')) {
                    return;
                }
                switchSqlTab(this.getAttribute('data-tab'));
            });

            const closeBtn = tabElement.querySelector('.fa-times');
            if (!closeBtn) return;

            closeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const tabId = this.getAttribute('data-tab');
                const tabNode = document.querySelector(`.tab[data-tab="${tabId}"]`);

                if (document.querySelectorAll('.tab').length > 1) {
                    if (tabNode && tabNode.classList.contains('active')) {
                        const remainingTab = document.querySelector('.tab:not([data-tab="' + tabId + '"])');
                        if (remainingTab) {
                            switchSqlTab(remainingTab.getAttribute('data-tab'));
                        }
                    }
                    if (tabNode) tabNode.remove();
                    delete sqlQueries[tabId];
                    delete sqlTabTitles[tabId];
                    delete sqlTabSessionMap[tabId];
                    delete sqlTabConnectionState[tabId];
                } else {
                    alert('Cannot close the last tab');
                }
            });
        }

        function renderSparkSessions() {
            if (!sparkSessionList) return;

            sparkSessionList.innerHTML = sparkSessions.map(session => `
                <div class="spark-session-item ${session.id === activeSparkSessionId ? 'active' : ''}" data-session-id="${session.id}">
                    <div class="spark-session-top">
                        <div class="spark-session-name">
                            <i class="fas fa-fire"></i>
                            <span title="${session.name}">${session.name}</span>
                        </div>
                        <div class="spark-session-actions">
                            <button type="button" class="spark-session-action" data-action="open" title="Подключить Spark сессию к текущему SQL окну"><i class="fas fa-play"></i></button>
                            <button type="button" class="spark-session-action" data-action="stop" title="Остановить Spark сессию"><i class="fas fa-stop"></i></button>
                            <button type="button" class="spark-session-action" data-action="edit" title="Редактировать"><i class="fas fa-cog"></i></button>
                            <button type="button" class="spark-session-action" data-action="delete" title="Удалить"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                    <div class="spark-session-meta">${session.params.master} · ${session.params.executors}×${session.params.executorMemory} · shuffle ${session.params.shufflePartitions}</div>
                </div>
            `).join('');

            sparkSessionList.querySelectorAll('.spark-session-item').forEach(item => {
                item.addEventListener('click', function(e) {
                    const sessionId = Number(this.getAttribute('data-session-id'));
                    const actionBtn = e.target.closest('[data-action]');

                    if (!actionBtn) {
                        if (activeSparkSessionId === sessionId) {
                            unselectSparkSession();
                        } else {
                            selectSparkSession(sessionId);
                        }
                        return;
                    }

                    const action = actionBtn.getAttribute('data-action');
                    if (action === 'open') {
                        connectSparkSessionToActiveTab(sessionId);
                    } else if (action === 'stop') {
                        stopSparkSession(sessionId);
                    } else if (action === 'edit') {
                        editSparkSessionPreset(sessionId);
                    } else if (action === 'delete') {
                        deleteSparkSessionPreset(sessionId);
                    }
                });
            });
        }

        function selectSparkSession(sessionId) {
            const session = sparkSessions.find(item => item.id === sessionId);
            if (!session) return;
            activeSparkSessionId = sessionId;
            renderSparkSessions();
        }

        function unselectSparkSession() {
            activeSparkSessionId = null;
            renderSparkSessions();
        }

        function connectSparkSessionToActiveTab(sessionId) {
            const session = sparkSessions.find(item => item.id === sessionId);
            if (!session) return;

            const activeTabId = sqlEditor.getAttribute('data-tab');
            if (!activeTabId) return;

            sqlTabSessionMap[activeTabId] = sessionId;
            sqlTabConnectionState[activeTabId] = 'connecting';
            selectSparkSession(sessionId);
            setConnectionStatus('connecting');

            setTimeout(() => {
                const stillActiveTabId = sqlEditor.getAttribute('data-tab');
                if (String(stillActiveTabId) !== String(activeTabId)) return;
                if (sqlTabSessionMap[activeTabId] !== sessionId) return;
                sqlTabConnectionState[activeTabId] = 'connected';
                setConnectionStatus('connected');
            }, 700);
        }

        function stopSparkSession(sessionId) {
            const session = sparkSessions.find(item => item.id === sessionId);
            if (!session) return;

            Object.keys(sqlTabSessionMap).forEach(tabId => {
                if (sqlTabSessionMap[tabId] === sessionId) {
                    sqlTabConnectionState[tabId] = 'disconnected';
                }
            });

            const activeTabId = sqlEditor.getAttribute('data-tab');
            if (activeTabId && sqlTabSessionMap[activeTabId] === sessionId) {
                setConnectionStatus('disconnected');
            }
        }

        function normalizeSparkParams(rawParams, fallback = {}) {
            const next = {
                master: fallback.master || 'yarn',
                executorMemory: fallback.executorMemory || '4g',
                executors: fallback.executors || 1,
                shufflePartitions: fallback.shufflePartitions || 64
            };

            if (rawParams.master !== undefined) next.master = String(rawParams.master).trim() || next.master;
            if (rawParams['spark.master'] !== undefined) next.master = String(rawParams['spark.master']).trim() || next.master;

            if (rawParams.executorMemory !== undefined) next.executorMemory = String(rawParams.executorMemory).trim() || next.executorMemory;
            if (rawParams['spark.executor.memory'] !== undefined) next.executorMemory = String(rawParams['spark.executor.memory']).trim() || next.executorMemory;

            const instancesValue = rawParams.executors ?? rawParams['spark.executor.instances'];
            const parsedExecutors = parseInt(instancesValue, 10);
            if (Number.isFinite(parsedExecutors) && parsedExecutors > 0) next.executors = parsedExecutors;

            const shuffleValue = rawParams.shufflePartitions ?? rawParams['spark.sql.shuffle.partitions'];
            const parsedShuffle = parseInt(shuffleValue, 10);
            if (Number.isFinite(parsedShuffle) && parsedShuffle > 0) next.shufflePartitions = parsedShuffle;

            return next;
        }

        function buildSparkSessionConfigCode(session) {
            return [
                'import org.apache.spark.sql.SparkSession',
                '',
                'val spark = SparkSession.builder()',
                `  .appName("${session.name}")`,
                `  .master("${session.params.master}")`,
                `  .config("spark.executor.memory", "${session.params.executorMemory}")`,
                `  .config("spark.executor.instances", "${session.params.executors}")`,
                `  .config("spark.sql.shuffle.partitions", "${session.params.shufflePartitions}")`,
                '  .getOrCreate()'
            ].join('\n');
        }

        function parseSparkSessionConfigCode(code, fallbackSession) {
            const source = (code || '').trim();
            if (!source) {
                throw new Error('Введите Scala-код создания SparkSession.');
            }

            const fallback = fallbackSession?.params || {};
            const parsedParams = {};

            const masterMatch = source.match(/\.master\(\s*"([^"]+)"\s*\)/i);
            if (masterMatch) parsedParams.master = masterMatch[1];

            const configRegex = /\.config\(\s*"([^"]+)"\s*,\s*("([^"]*)"|([^\)\s]+))\s*\)/gi;
            let configMatch = null;
            while ((configMatch = configRegex.exec(source)) !== null) {
                const key = configMatch[1];
                const value = (configMatch[3] ?? configMatch[4] ?? '').trim();
                parsedParams[key] = value;
            }

            const params = normalizeSparkParams(parsedParams, fallback);

            const codeNameMatch = source.match(/\.appName\(\s*"([^"]+)"\s*\)/i);
            const inputName = (sparkSessionNameInput.value || '').trim();
            const name = inputName || (codeNameMatch ? codeNameMatch[1].trim() : '') || fallbackSession?.name || '';

            if (!name) {
                throw new Error('Укажите название карточки Spark-сессии.');
            }

            return { name, params };
        }

        function closeSparkSessionConfigModal() {
            editingSparkSessionId = null;
            sparkConfigCode.value = '';
            sparkSessionNameInput.value = '';
            sparkConfigModal.classList.remove('active');
        }

        function openSparkSessionConfigModal(sessionId) {
            const session = sparkSessions.find(item => item.id === sessionId);
            if (!session) return;
            editingSparkSessionId = sessionId;
            sparkSessionNameInput.value = session.name;
            sparkConfigCode.value = buildSparkSessionConfigCode(session);
            sparkConfigModal.classList.add('active');
            sparkConfigCode.focus();
        }

        function saveSparkSessionFromCode() {
            if (!editingSparkSessionId) return;

            const session = sparkSessions.find(item => item.id === editingSparkSessionId);
            if (!session) return;

            try {
                const parsed = parseSparkSessionConfigCode(sparkConfigCode.value, session);
                const changed = session.name !== parsed.name || JSON.stringify(session.params) !== JSON.stringify(parsed.params);
                session.name = parsed.name;
                session.params = parsed.params;

                if (changed) {
                    Object.keys(sqlTabSessionMap).forEach(tabId => {
                        if (sqlTabSessionMap[tabId] === session.id) {
                            sqlTabConnectionState[tabId] = 'disconnected';
                        }
                    });

                    const activeTabId = sqlEditor.getAttribute('data-tab');
                    if (activeTabId && sqlTabSessionMap[activeTabId] === session.id) {
                        setConnectionStatus('disconnected');
                    }
                }

                selectSparkSession(session.id);
                closeSparkSessionConfigModal();
            } catch (error) {
                alert(error.message || 'Не удалось сохранить Spark-сессию.');
            }
        }

        function editSparkSessionPreset(sessionId) {
            openSparkSessionConfigModal(sessionId);
        }

        function deleteSparkSessionPreset(sessionId) {
            const session = sparkSessions.find(item => item.id === sessionId);
            if (!session) return;

            const allowDelete = confirm(`Удалить spark сессию "${session.name}"?`);
            if (!allowDelete) return;

            sparkSessions = sparkSessions.filter(item => item.id !== sessionId);
            Object.keys(sqlTabSessionMap).forEach(tabId => {
                if (sqlTabSessionMap[tabId] === sessionId) {
                    sqlTabSessionMap[tabId] = null;
                    sqlTabConnectionState[tabId] = 'disconnected';
                }
            });

            if (sparkSessions.length === 0) {
                activeSparkSessionId = null;
            } else if (activeSparkSessionId === sessionId) {
                activeSparkSessionId = sparkSessions[0].id;
            }

            renderSparkSessions();
        }

        function createSparkSessionPreset() {
            sparkSessionCounter += 1;
            const newSession = {
                id: sparkSessionCounter,
                name: `Spark Session ${sparkSessionCounter}`,
                params: {
                    master: 'yarn',
                    executorMemory: '4g',
                    executors: 2,
                    shufflePartitions: 64
                }
            };

            sparkSessions.unshift(newSession);
            activeSparkSessionId = newSession.id;
            renderSparkSessions();
            openSparkSessionConfigModal(newSession.id);
        }

        function createNewSqlTab(options = {}) {
            tabCounter++;
            const newTabId = tabCounter;
            const tabTitle = options.title || `query_${newTabId}.sql`;
            const tabQuery = options.query || `-- ${tabTitle}
-- New SQL query

SELECT * FROM your_table LIMIT 20;`;
            const tabSessionId = options.sessionId ?? null;
            const tabConnectionState = tabSessionId ? 'connected' : 'disconnected';

            const newTab = document.createElement('div');
            newTab.className = 'tab';
            newTab.setAttribute('data-tab', newTabId);
            newTab.innerHTML = `<i class="fas fa-file-code"></i> ${tabTitle} <i class="fas fa-times" data-tab="${newTabId}"></i>`;

            tabContainer.insertBefore(newTab, newTabBtnHeader);

            sqlTabTitles[newTabId] = tabTitle;
            sqlQueries[newTabId] = tabQuery;
            sqlTabSessionMap[newTabId] = tabSessionId;
            sqlTabConnectionState[newTabId] = tabConnectionState;

            switchSqlTab(newTabId);
            attachSqlTabHandlers(newTab);
            newTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'end' });
        }

        function toggleDb(caretId, listId) {
            const caret = document.getElementById(caretId);
            const list = document.getElementById(listId);
            if (!caret || !list) return;
            if (list.style.display === 'none') {
                list.style.display = 'block';
                caret.className = 'fas fa-caret-down';
            } else {
                list.style.display = 'none';
                caret.className = 'fas fa-caret-right';
            }
        }

        function toggleDatamartDropdown(toggleButton, menu) {
            const isOpen = menu.classList.toggle('open');
            toggleButton.classList.toggle('open', isOpen);
            toggleButton.setAttribute('aria-expanded', String(isOpen));
        }

        function renderDatamartMenu(menu) {
            if (!menu) return;

            const datamartList = Object.values(datamarts)
                .slice()
                .sort((a, b) => Number(a.id) - Number(b.id));

            menu.innerHTML = datamartList.map(datamart => `
                <a class="nav-subitem ${String(currentDatamartId) === String(datamart.id) ? 'active' : ''}" href="#" data-datamart-id="${datamart.id}">
                    ${datamart.name}
                </a>
            `).join('');

            menu.querySelectorAll('.nav-subitem').forEach(item => {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    const datamartId = this.dataset.datamartId;
                    const datamart = datamarts[datamartId];
                    if (!datamart) return;
                    openDatamart(datamart.id, datamart.name);
                });
            });
        }

        function refreshDatamartMenus() {
            renderDatamartMenu(homeDatamartsMenu);
            renderDatamartMenu(designerDatamartsMenu);
        }

        function formatDisplayDate(dateValue) {
            if (!dateValue) return '-';

            const parsed = new Date(dateValue);
            if (!Number.isNaN(parsed.getTime())) {
                return parsed.toLocaleDateString('ru-RU');
            }

            return dateValue;
        }

        function getStatusPresentation(status) {
            return status === 'active'
                ? { text: 'Активна', className: 'status-active' }
                : { text: 'Черновик', className: 'status-draft' };
        }

        function escHtml(value) {
            return String(value ?? '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }

        function updateTileFromDatamart(tile, datamart) {
            if (!tile || !datamart) return;

            const titleElement = tile.querySelector('.tile-title');
            const contentElement = tile.querySelector('.tile-content');
            const statusElement = tile.querySelector('.tile-status');
            const ownerElement = tile.querySelector('.tile-owner');
            const createdAtElement = tile.querySelector('.tile-created-at');
            const statusInfo = getStatusPresentation(datamart.status);

            if (titleElement) {
                titleElement.textContent = datamart.name;
            }

            if (contentElement) {
                contentElement.textContent = datamart.description || 'Описание не указано';
            }

            if (statusElement) {
                statusElement.textContent = statusInfo.text;
                statusElement.classList.remove('status-active', 'status-draft');
                statusElement.classList.add(statusInfo.className);
            }

            if (ownerElement) {
                ownerElement.textContent = datamart.owner || '—';
            }

            if (createdAtElement) {
                createdAtElement.textContent = formatDisplayDate(datamart.createdAt);
            }
        }

        function removeDatamartById(datamartId, datamartName) {
            const tile = document.querySelector(`.tile[data-datamart-id="${datamartId}"]`);
            if (tile) {
                tile.remove();
            }

            delete datamarts[datamartId];
            refreshDatamartMenus();

            if (String(currentDatamartId) === String(datamartId)) {
                currentDatamartId = null;
                currentDatamartName = '';
                currentDatamart.textContent = 'Витрины данных';
                switchAppPage('homePage');
            }

            showNotification(`Витрина "${datamartName}" удалена`);
        }

        function openEditDatamartModal(datamartId) {
            const datamart = datamarts[datamartId];
            if (!datamart) return;

            document.getElementById('editDatamartId').value = datamart.id;
            document.getElementById('editDatamartName').value = datamart.name || '';
            document.getElementById('editDatamartDescription').value = datamart.description || '';
            document.getElementById('editDatamartStatus').value = datamart.status || 'draft';
            document.getElementById('editDatamartOwner').value = datamart.owner || '';

            // Populate passport pane fields
            const p = datamart.passport || {};
            document.getElementById('edit_pm_display_name').value = datamart.name || '';
            document.getElementById('edit_pm_owner').value = datamart.owner || '';
            document.getElementById('edit_pm_block').value = p.block || '';
            document.getElementById('edit_pm_datamart_group').value = p.datamartGroup || '';
            document.getElementById('edit_pm_datamart_name').value = p.datamartName || '';
            document.getElementById('edit_pm_ci_it_service').value = p.ciItService || '';
            document.getElementById('edit_pm_ci_as_fp').value = p.ciAsFp || '';
            document.getElementById('edit_pm_sq_pr_key').value = p.sqPrKey || '';
            document.getElementById('edit_pm_emails').value = p.emails || '';
            document.getElementById('edit_pm_external_libs').value = p.externalLibs || '';

            // Restore lineup & clusters from saved passport
            editPmCurrentLineup = p.lineup || 'cxb2c';
            editPmChecked = {};
            (p.clusters || []).forEach(clusterName => {
                // Найти id кластера по имени в текущей линейке
                const lineup = PM_LINEUPS[editPmCurrentLineup] || {};
                PM_CONTOURS.forEach(contour => {
                    const list = lineup[contour] || [];
                    const idx = list.indexOf(clusterName);
                    if (idx !== -1) editPmChecked[pmClId(editPmCurrentLineup, contour, idx)] = true;
                });
            });

            editPmUpdateHdfsPath();
            editMartState = {
                activeCluster: '',
                activeStream: '',
                byCluster: JSON.parse(JSON.stringify((datamart.passport && datamart.passport.martByCluster) || {})),
                byClusterStream: JSON.parse(JSON.stringify((datamart.passport && datamart.passport.martByClusterStream) || {})),
                sections: editMartDefaultSections(),
                clusterCollapsed: false,
                streamCollapsed: false
            };
            editFlowState.sqlVars = JSON.parse(JSON.stringify((datamart.passport && datamart.passport.flowSqlByWorkflow) || editFlowState.sqlVars));
            editFlowState.frameworkVars = JSON.parse(JSON.stringify((datamart.passport && datamart.passport.flowFrameworkByWorkflow) || {}));
            editFlowState.profilesByWorkflow = JSON.parse(JSON.stringify((datamart.passport && datamart.passport.flowProfilesByWorkflow) || {}));
            editFlowState.sparkCommonParamsByWorkflow = JSON.parse(JSON.stringify((datamart.passport && datamart.passport.flowCommonParamsByWorkflow) || {}));
            editMartReadOnly = true;
            editFlowReadOnly = true;
            editMartRenderPane();
            editFlowRenderPane();

            // Start in view (read-only) mode
            setPassportViewMode();
            switchEditTab('passport');
            editModal.classList.add('active');
        }

        function closeDatamartEditModal() {
            editModal.classList.remove('active');
            editForm.reset();
            setPassportViewMode();
            switchEditTab('passport');
        }

        const EDIT_PM_FIELD_IDS = [
            'edit_pm_display_name', 'edit_pm_owner', 'edit_pm_block',
            'edit_pm_datamart_group', 'edit_pm_datamart_name',
            'edit_pm_ci_it_service', 'edit_pm_ci_as_fp',
            'edit_pm_sq_pr_key', 'edit_pm_emails', 'edit_pm_external_libs'
        ];

        // ── Состояние линейки/кластеров для edit-модала ──
        let editPmCurrentLineup = 'cxb2c';
        let editPmChecked = {};
        let editPmReadOnly = true;
        let editMartReadOnly = true;

        function editPmRenderLineupChips() {
            const el = document.getElementById('edit_pm_dvLineupChips');
            if (!el) return;
            el.innerHTML = Object.keys(PM_LINEUPS).map(name =>
                `<div class="dv-lineup-chip ${name === editPmCurrentLineup ? 'active' : ''}"
                      onclick="editPmSelectLineup('${name}')">${name}</div>`
            ).join('');
        }

        function editPmSelectLineup(name) {
            editPmCurrentLineup = name;
            editPmChecked = {};
            editPmRenderLineupChips();
            editPmRenderMatrix();
            editMartRenderPane();
            editFlowRenderPane();
            if (isSparkSidebarActive()) renderEngineSparkSidebarPanel();
        }

        function editPmRenderMatrix() {
            const el = document.getElementById('edit_pm_dvClusterMatrix');
            if (!el) return;
            const lineup = PM_LINEUPS[editPmCurrentLineup] || {};
            const maxRows = Math.max(...PM_CONTOURS.map(c => (lineup[c] || []).length), 0);
            if (maxRows === 0) {
                el.innerHTML = '<div class="matrix-empty">Нет кластеров в линейке</div>';
                return;
            }
            const thead = `<thead><tr>
                <th style="font-size:10px;color:#bbb;padding:7px 8px;border-bottom:2px solid #e8e8e8"></th>
                ${PM_CONTOURS.map(c => `<th class="col-${PM_ENV_COLORS[c]}">${PM_ENV_LABELS[c]}</th>`).join('')}
            </tr></thead>`;

            let rows = '';
            for (let i = 0; i < maxRows; i++) {
                const yLabel = i === 0
                    ? `<td rowspan="${maxRows}" style="writing-mode:vertical-rl;transform:rotate(180deg);font-size:10px;font-weight:700;color:#bbb;text-transform:uppercase;letter-spacing:1px;padding:6px 4px;text-align:center;white-space:nowrap;border-right:1px solid #eff0f5">Кластера</td>`
                    : '';
                const cells = PM_CONTOURS.map(c => {
                    const clusters = lineup[c] || [];
                    const clName = clusters[i];
                    if (!clName) return '<td></td>';
                    const id = pmClId(editPmCurrentLineup, c, i);
                    const checked = editPmChecked[id] ? 'checked' : '';
                    const disabledAttr = editPmReadOnly ? 'disabled' : '';
                    return `<td>
                        <label class="cluster-cb-item">
                            <input type="checkbox" ${checked} ${disabledAttr} onchange="editPmToggleCluster('${id}', this.checked)">
                            <span class="cluster-cb-label">${clName}</span>
                        </label>
                    </td>`;
                }).join('');
                rows += `<tr>${yLabel}${cells}</tr>`;
            }

            el.innerHTML = `
                <table class="cluster-matrix">${thead}<tbody>${rows}</tbody></table>
                <div class="matrix-summary" id="edit_pm_dvMatrixSummary"></div>
            `;
            editPmRenderSummary();
        }

        function editPmToggleCluster(id, checked) {
            if (checked) editPmChecked[id] = true;
            else delete editPmChecked[id];
            editPmRenderSummary();
            editMartRenderPane();
            editFlowRenderPane();
            if (isSparkSidebarActive()) renderEngineSparkSidebarPanel();
        }

        function editPmRenderSummary() {
            const el = document.getElementById('edit_pm_dvMatrixSummary');
            if (!el) return;
            const ids = Object.keys(editPmChecked);
            if (!ids.length) {
                el.innerHTML = '<span style="color:#bbb"><i class="fas fa-info-circle" style="margin-right:5px"></i>Кластеры не выбраны — деплой не будет запущен</span>';
                return;
            }
            el.innerHTML = '<span style="color:#555;font-weight:600">Деплой на:</span> '
                + ids.map(id => `<span class="matrix-summary-tag">${pmClusterName(id)}</span>`).join(' ');
        }

        function editMartDefaultSections() {
            return { framework: true };
        }

        let editMartState = { activeCluster: '', activeStream: '', byCluster: {}, byClusterStream: {}, sections: editMartDefaultSections(), clusterCollapsed: false, streamCollapsed: false };

        function editMartSelectedClusters() {
            return Object.keys(editPmChecked).map(id => {
                const parts = id.split('__');
                return { id, contour: parts[1] || 'dev', name: pmClusterName(id) };
            });
        }

        function editMartEnsureClusterState(name) {
            if (!editMartState.byCluster[name]) {
                editMartState.byCluster[name] = {
                    infra: { yarnQueue: '', userName: '' },
                    sparkJvm: {
                        spark_executor_extraJavaOptions: '-XX:+UseCompressedOops -XX:+UseG1GC -XX:+UseNUMA -Dlog4j2.configurationFile=log4j2.xml',
                        spark_driver_extraJavaOptions: '-XX:+UseCompressedOops -Dlog4j2.configurationFile=log4j2.xml'
                    },
                    frameworkVars: editMartDefaultFrameworkParams(),
                    dwh: { h2kBootstrap: '', h2kCertKey: '', h2kCn: '', k2hCertKey: '' },
                    sparkMain: '--conf spark.submit.deployMode=cluster\n--conf spark.master=yarn',
                    sqlVars: []
                };
            }
            const state = editMartState.byCluster[name];
            if (!state.infra) state.infra = { yarnQueue: '', userName: '' };
            if (!state.sparkJvm) {
                state.sparkJvm = {
                    spark_executor_extraJavaOptions: '-XX:+UseCompressedOops -XX:+UseG1GC -XX:+UseNUMA -Dlog4j2.configurationFile=log4j2.xml',
                    spark_driver_extraJavaOptions: '-XX:+UseCompressedOops -Dlog4j2.configurationFile=log4j2.xml'
                };
            }
            if (!Array.isArray(state.frameworkVars)) state.frameworkVars = editMartDefaultFrameworkParams();
            return state;
        }

        function editMartEnsureClusterStreamState(key) {
            if (!editMartState.byClusterStream) editMartState.byClusterStream = {};
            if (!editMartState.byClusterStream[key]) {
                editMartState.byClusterStream[key] = { frameworkVars: editMartDefaultFrameworkParams() };
            }
            const state = editMartState.byClusterStream[key];
            if (!Array.isArray(state.frameworkVars)) state.frameworkVars = editMartDefaultFrameworkParams();
            return state;
        }

        function editMartSelectStream(id) {
            editMartState.activeStream = id;
            editMartRenderPane();
        }


        function getFrameworkTemplateDefaults() {
            return [
                { key: 'b2c.sql.conf.path', value: 'hdfs:///oozie-app/b2/{block}/{group}/{datamart_name}/conf/external/external.conf' },
                { key: 'b2c.sql.engine.spark.cmd', value: '${spark_submit_cmd_main} ${spark_submit_cmd_high}' },
                { key: 'b2c.sql.external.function.path', value: 'hdfs:///oozie-app/{block}/{group}/{datamart_name}/external/function' },
                { key: 'b2c.sql.external.udf.path', value: 'hdfs:///oozie-app/{block}/{group}/{datamart_name}/external/udf' },
                { key: 'b2c.sql.java.xmx', value: '8192M' },
                { key: 'b2c.sql.log.level', value: 'info' },
                { key: 'b2c.sql.pipelines.config.path', value: 'hdfs:///oozie-app/{block}/{group}/{datamart_name}/etl/wfs/regress_test/pipeline.json' },
                { key: 'b2c.sql.secman.conf.hdfs.path', value: 'hdfs:///oozie-app/{block}/{group}/{datamart_name}/conf/secman/secman-test-3.conf' },
                { key: 'description', value: '"devbalsdpganza9-b2c-sql-regress-D-01.010.13"' },
                { key: 'DEV_TEAM_EMAIL', value: 'AASukharnikov@sberbank.ru' },
                { key: 'DL_D', value: '0,999305556' },
                { key: 'mapreduce.job.queuename', value: 'default' },
                { key: 'mapreduce.map.memory.mb', value: '16384' },
                { key: 'migratedToOozie2', value: 'true' },
                { key: 'oozie.wf.application.path', value: 'hdfs:///oozie-app/b2c/fw/b2c-sql/D-01.010.13' },
                { key: 'yarn.app.mapreduce.am.resource.mb', value: '16384' }
            ];
        }

        function editMartDefaultFrameworkParams() {
            const vars = {
                block: (document.getElementById('edit_pm_block')?.value || '').trim() || '{block}',
                group: (document.getElementById('edit_pm_datamart_group')?.value || '').trim() || '{group}',
                datamart_name: (document.getElementById('edit_pm_datamart_name')?.value || '').trim() || '{datamart_name}'
            };
            const withVars = (raw) => String(raw || '')
                .replace(/\{block\}/g, vars.block)
                .replace(/\{group\}/g, vars.group)
                .replace(/\{datamart_name\}/g, vars.datamart_name);
            return getFrameworkTemplateDefaults().map(row => ({ key: row.key, value: withVars(row.value) }));
        }

        function editMartRefreshFrameworkTemplateVars() {
            const vars = {
                block: (document.getElementById('edit_pm_block')?.value || '').trim() || '{block}',
                group: (document.getElementById('edit_pm_datamart_group')?.value || '').trim() || '{group}',
                datamart_name: (document.getElementById('edit_pm_datamart_name')?.value || '').trim() || '{datamart_name}'
            };
            const replaceVars = (raw) => String(raw || '')
                .replace(/\{block\}/g, vars.block)
                .replace(/\{group\}/g, vars.group)
                .replace(/\{datamart_name\}/g, vars.datamart_name);

            const templateMap = new Map(
                getFrameworkTemplateDefaults().map(row => [row.key, replaceVars(row.value)])
            );

            Object.keys(editMartState.byCluster || {}).forEach(clusterName => {
                const state = editMartEnsureClusterState(clusterName);
                (state.frameworkVars || []).forEach(row => {
                    if (!row || !row.key) return;
                    if (templateMap.has(row.key)) row.value = templateMap.get(row.key);
                });
            });
        }

        function editMartSelectCluster(name) {
            editMartState.activeCluster = name;
            editMartRenderPane();
        }

        function editMartSetField(section, key, value) {
            const name = editMartState.activeCluster;
            if (!name) return;
            const state = editMartEnsureClusterState(name);
            if (section === 'sparkMain') state.sparkMain = value;
            else state[section][key] = value;
        }

        function editMartSetSql(idx, field, value) {
            const name = editMartState.activeCluster;
            if (!name) return;
            const state = editMartEnsureClusterState(name);
            if (!state.sqlVars[idx]) state.sqlVars[idx] = { key: '', value: '' };
            state.sqlVars[idx][field] = value;
        }

        function editMartAddSqlVar() {
            const name = editMartState.activeCluster;
            if (!name) return;
            editMartEnsureClusterState(name).sqlVars.push({ key: '', value: '' });
            editMartRenderPane();
        }

        function editMartDelSqlVar(idx) {
            const name = editMartState.activeCluster;
            if (!name) return;
            const arr = editMartEnsureClusterState(name).sqlVars;
            arr.splice(idx, 1);
            editMartRenderPane();
        }

        function editMartSetFrameworkVar(idx, field, value) {
            const name = editMartState.activeCluster;
            const stream = editMartState.activeStream;
            if (!name) return;
            const state = editMartEnsureClusterStreamState(`${name}::${stream}`);
            if (!state.frameworkVars[idx]) state.frameworkVars[idx] = { key: '', value: '' };
            state.frameworkVars[idx][field] = value;
        }

        function editMartAddFrameworkVar() {
            const name = editMartState.activeCluster;
            const stream = editMartState.activeStream;
            if (!name) return;
            const state = editMartEnsureClusterStreamState(`${name}::${stream}`);
            state.frameworkVars.push({ key: '', value: '' });
            editMartRenderPane();
        }

        function editMartDelFrameworkVar(idx) {
            const name = editMartState.activeCluster;
            const stream = editMartState.activeStream;
            if (!name) return;
            const state = editMartEnsureClusterStreamState(`${name}::${stream}`);
            state.frameworkVars.splice(idx, 1);
            editMartRenderPane();
        }

        function editMartToggleSection(section) {
            if (!editMartState.sections || !(section in editMartState.sections)) return;
            editMartState.sections[section] = !editMartState.sections[section];
            editMartRenderPane();
        }

        function toggleMartSidebar(type) {
            if (type === 'cluster') editMartState.clusterCollapsed = !editMartState.clusterCollapsed;
            else editMartState.streamCollapsed = !editMartState.streamCollapsed;
            editMartRenderPane();
        }

        function editMartRenderPane() {
            const listEl = document.getElementById('edit_mart_cluster_list');
            const countEl = document.getElementById('edit_mart_cluster_count');
            const contentEl = document.getElementById('edit_mart_content');
            const streamListEl = document.getElementById('edit_mart_stream_list');
            const streamCountEl = document.getElementById('edit_mart_stream_count');
            const clusterSidebarEl = document.getElementById('edit_mart_cluster_sidebar');
            const streamSidebarEl = document.getElementById('edit_mart_stream_sidebar');
            if (!listEl || !countEl || !contentEl) return;

            const selected = editMartSelectedClusters();
            countEl.textContent = selected.length;

            if (!selected.length) {
                listEl.innerHTML = '';
                if (clusterSidebarEl) clusterSidebarEl.style.display = 'none';
                if (streamSidebarEl) streamSidebarEl.style.display = 'none';
                contentEl.innerHTML = `<div class="mart-empty"><b>Не выбраны кластеры для деплоя.</b><br>Выбрать кластер/кластера можно на странице «Паспорт витрины» в секции «Линейка и кластеры».</div>`;
                editMartState.activeCluster = '';
                return;
            }
            if (clusterSidebarEl) clusterSidebarEl.style.display = '';
            if (streamSidebarEl) streamSidebarEl.style.display = '';

            // Apply collapsed states
            if (clusterSidebarEl) clusterSidebarEl.classList.toggle('mart-sidebar-collapsed', !!editMartState.clusterCollapsed);
            if (streamSidebarEl) streamSidebarEl.classList.toggle('mart-sidebar-collapsed', !!editMartState.streamCollapsed);

            // Update collapse button icons via header
            const clusterHeader = document.getElementById('edit_mart_cluster_sidebar_header');
            const streamHeader = document.getElementById('edit_mart_stream_sidebar_header');
            if (clusterHeader) {
                clusterHeader.innerHTML = editMartState.clusterCollapsed
                    ? `<button type="button" class="mart-collapse-btn" onclick="toggleMartSidebar('cluster')" title="Развернуть"><i class="fas fa-angle-double-right"></i></button>`
                    : `<span class="mart-sidebar-title">Кластеры</span><span class="mart-count" id="edit_mart_cluster_count">${selected.length}</span><button type="button" class="mart-collapse-btn" onclick="toggleMartSidebar('cluster')" title="Свернуть"><i class="fas fa-angle-double-left"></i></button>`;
            }

            if (!selected.some(x => x.name === editMartState.activeCluster)) {
                editMartState.activeCluster = selected[0].name;
            }

            const contourOrder = ['dev','ift','psi','prom','rdt','uat'];
            const grouped = contourOrder.map(contour => ({
                contour,
                items: selected.filter(x => (x.contour || '').toLowerCase() === contour)
            })).filter(g => g.items.length);

            listEl.innerHTML = grouped.map(g => `
                <div class="mart-group-label"><span class="mart-group-dot mart-dot-${g.contour}"></span>${g.contour.toUpperCase()}</div>
                ${g.items.map(item => `<div class="mart-item ${item.name === editMartState.activeCluster ? 'active' : ''}" onclick="editMartSelectCluster('${item.name}')"><span class="mart-dot mart-dot-${item.contour}"></span>${item.name}</div>`).join('')}
            `).join('');

            // Render stream sidebar
            const streams = (Array.isArray(pages) && pages.length > 0)
                ? pages.map((p, i) => ({ id: p.id || `flow-${i + 1}`, name: p.name || `Поток ${i + 1}` }))
                : [{ id: 'default', name: 'Поток 1' }];
            if (streamCountEl) streamCountEl.textContent = streams.length;
            if (!editMartState.activeStream || !streams.some(s => s.id === editMartState.activeStream)) {
                editMartState.activeStream = streams[0].id;
            }
            if (streamHeader) {
                streamHeader.innerHTML = editMartState.streamCollapsed
                    ? `<button type="button" class="mart-collapse-btn" onclick="toggleMartSidebar('stream')" title="Развернуть"><i class="fas fa-angle-double-right"></i></button>`
                    : `<span class="mart-sidebar-title">Потоки</span><span class="mart-count" id="edit_mart_stream_count">${streams.length}</span><button type="button" class="mart-collapse-btn" onclick="toggleMartSidebar('stream')" title="Свернуть"><i class="fas fa-angle-double-left"></i></button>`;
            }
            if (streamListEl) {
                streamListEl.innerHTML = streams.map(s =>
                    `<div class="mart-item ${s.id === editMartState.activeStream ? 'active' : ''}" onclick="editMartSelectStream('${escHtml(s.id)}')"><i class="fas fa-stream" style="font-size:10px;color:#888;flex-shrink:0"></i><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escHtml(s.name)}</span></div>`
                ).join('');
            }

            const clusterName = editMartState.activeCluster;
            const streamId = editMartState.activeStream;
            const readonly = editMartReadOnly ? 'disabled' : '';
            const csKey = `${clusterName}::${streamId}`;
            const state = editMartEnsureClusterStreamState(csKey);
            const sections = editMartState.sections || (editMartState.sections = editMartDefaultSections());
            const frameworkRows = (state.frameworkVars || []).map((row, idx) => `
                <div class="mart-sql-row">
                    <input class="mart-input" placeholder="Ключ" ${readonly} value="${escHtml(row.key || '')}" oninput="editMartSetFrameworkVar(${idx}, 'key', this.value)">
                    <input class="mart-input" placeholder="Значение" ${readonly} value="${escHtml(row.value || '')}" oninput="editMartSetFrameworkVar(${idx}, 'value', this.value)">
                    <button type="button" class="mart-del" ${readonly} onclick="editMartDelFrameworkVar(${idx})">✕</button>
                </div>
            `).join('');

            contentEl.innerHTML = `
                <div class="mart-group">
                    <button type="button" class="mart-title mart-title-toggle" onclick="editMartToggleSection('framework')" aria-expanded="${sections.framework}">
                        <i class="fas fa-sliders-h"></i> Параметры фреймворка
                        <span class="mart-chevron">${sections.framework ? '▼' : '▶'}</span>
                    </button>
                    ${sections.framework ? `${frameworkRows}<button type="button" class="mart-add" ${readonly} onclick="editMartAddFrameworkVar()"><i class="fas fa-plus"></i> Добавить параметр</button>` : ''}
                </div>
            `;
        }

        let editFlowReadOnly = true;
        const editFlowState = {
            activeCluster: '',
            activeWorkflow: 'batch_autopay',
            collapsed: { cluster: false, workflow: false },
            sections: { spark: true, dwh: true, sql: true },
            sparkSidebarCollapsedByWorkflow: {},
            sparkSidebarClusterCollapsed: {},
            sparkSidebarClusterSectionCollapsed: {},
            sparkSidebarSectionsCollapsed: { common: false, individual: false },
            sparkCommonParamsByWorkflow: {},
            sqlVars: {
                batch_autopay: [{ key: 'dt', value: '{{ ds }}' }],
                nrt_autopay: [{ key: 'run_id', value: '{{ runId }}' }]
            },
            frameworkVars: {},
            profilesByWorkflow: {}
        };

        function editFlowWorkflows() {
            return [
                { id: 'batch_autopay', icon: 'fa-stream' },
                { id: 'nrt_autopay', icon: 'fa-bolt' }
            ];
        }

        function editFlowDefaultProfiles() {
            return [
                { name: 'low', cmd: 'spark_submit_cmd_low', tone: 'low', params: [{ key: 'executor-memory', value: '4g' }, { key: 'executor-cores', value: '2' }, { key: 'dynamicAllocation.maxExecutors', value: '20' }, { key: 'sql.shuffle.partitions', value: '200' }] },
                { name: 'mid', cmd: 'spark_submit_cmd_mid', tone: 'mid', params: [{ key: 'executor-memory', value: '8g' }, { key: 'executor-cores', value: '3' }, { key: 'dynamicAllocation.maxExecutors', value: '40' }, { key: 'sql.shuffle.partitions', value: '500' }] },
                { name: 'high', cmd: 'spark_submit_cmd_high', tone: 'high', params: [{ key: 'executor-memory', value: '12g' }, { key: 'executor-cores', value: '4' }, { key: 'dynamicAllocation.maxExecutors', value: '80' }, { key: 'sql.shuffle.partitions', value: '1000' }] },
                { name: 'super', cmd: 'spark_submit_cmd_super', tone: 'super', params: [{ key: 'executor-memory', value: '18g' }, { key: 'executor-cores', value: '5' }, { key: 'dynamicAllocation.maxExecutors', value: '140' }, { key: 'sql.shuffle.partitions', value: '1600' }] }
            ];
        }

        function editFlowEnsureProfiles(workflowId) {
            if (!editFlowState.profilesByWorkflow[workflowId]) {
                editFlowState.profilesByWorkflow[workflowId] = JSON.parse(JSON.stringify(editFlowDefaultProfiles()));
            }
            return editFlowState.profilesByWorkflow[workflowId];
        }

        function editFlowEnsureCommonParams(workflowId) {
            if (!editFlowState.sparkCommonParamsByWorkflow[workflowId]) {
                const defaults = [
                    '--conf spark.submit.deployMode=${b2c.sql.engine.spark.deploy}',
                    '--conf spark.master=yarn',
                    '--conf spark.yarn.maxAppAttempts=1',
                    '--conf spark.port.maxRetries=50',
                    '--conf spark.network.timeout=600s',
                    '--conf spark.serializer=org.apache.spark.serializer.KryoSerializer',
                    '--conf spark.kryoserializer.buffer.max=128M',
                    '--conf spark.debug.maxToStringFields=100',
                    '--conf spark.dynamicAllocation.enabled=true',
                    '--conf spark.dynamicAllocation.shuffleTracking.enabled=true',
                    '--conf spark.shuffle.service.enabled=true',
                    '--conf spark.hadoop.hive.exec.dynamic.partition=true',
                    '--conf spark.hadoop.hive.exec.dynamic.partition.mode=nonstrict',
                    '--conf spark.hadoop.mapreduce.input.fileinputformat.input.dir.recursive=true',
                    '--conf spark.sql.broadcastTimeout=6000',
                    '--conf spark.sql.catalogImplementation=hive',
                    '--conf spark.sql.inMemoryColumnarStorage.compressed=true',
                    '--conf spark.sql.hive.convertMetastoreParquet=false',
                    '--conf spark.sql.hive.manageFilesourcePartitions=false',
                    '--conf spark.sql.mapKeyDedupPolicy=LAST_WIN'
                ];
                editFlowState.sparkCommonParamsByWorkflow[workflowId] = defaults.map(line => {
                    const body = line.replace(/^--conf\s+/, '').trim();
                    const idx = body.indexOf('=');
                    if (idx === -1) return { key: body, value: '' };
                    return { key: body.slice(0, idx).trim(), value: body.slice(idx + 1).trim() };
                });
            }
            return editFlowState.sparkCommonParamsByWorkflow[workflowId];
        }

        function editFlowDefaultFrameworkParams() {
            return [
                { key: 'b2c.sql.conf.path', value: 'hdfs:///oozie-app/b2/{block}/{group}/{datamart_name}/conf/external/external.conf' },
                { key: 'b2c.sql.engine.spark.cmd', value: '${spark_submit_cmd_main} ${spark_submit_cmd_high}' },
                { key: 'b2c.sql.external.function.path', value: 'hdfs:///oozie-app/{block}/{group}/{datamart_name}/external/function' },
                { key: 'b2c.sql.external.udf.path', value: 'hdfs:///oozie-app/{block}/{group}/{datamart_name}/external/udf' },
                { key: 'b2c.sql.java.xmx', value: '8192M' },
                { key: 'b2c.sql.log.level', value: 'info' },
                { key: 'b2c.sql.pipelines.config.path', value: 'hdfs:///oozie-app/{block}/{group}/{datamart_name}/etl/wfs/regress_test/pipeline.json' },
                { key: 'b2c.sql.secman.conf.hdfs.path', value: 'hdfs:///oozie-app/{block}/{group}/{datamart_name}/conf/secman/secman-test-3.conf' },
                { key: 'description', value: '"devbalsdpganza9-b2c-sql-regress-D-01.010.13"' },
                { key: 'DEV_TEAM_EMAIL', value: 'AASukharnikov@sberbank.ru' },
                { key: 'DL_D', value: '0,999305556' },
                { key: 'mapreduce.job.queuename', value: 'default' },
                { key: 'mapreduce.map.memory.mb', value: '16384' },
                { key: 'migratedToOozie2', value: 'true' },
                { key: 'oozie.wf.application.path', value: 'hdfs:///oozie-app/b2c/fw/b2c-sql/D-01.010.13' },
                { key: 'yarn.app.mapreduce.am.resource.mb', value: '16384' }
            ];
        }

        function editFlowEnsureFrameworkVars(workflowId) {
            if (!editFlowState.frameworkVars[workflowId]) {
                editFlowState.frameworkVars[workflowId] = JSON.parse(JSON.stringify(editFlowDefaultFrameworkParams()));
            }
            return editFlowState.frameworkVars[workflowId];
        }

        function persistFlowProfilesToPassport() {
            if (!currentDatamartId || !datamarts[currentDatamartId]) return;
            const datamart = datamarts[currentDatamartId];
            datamart.passport = datamart.passport || {};
            datamart.passport.flowFrameworkByWorkflow = JSON.parse(JSON.stringify(editFlowState.frameworkVars || {}));
            datamart.passport.flowProfilesByWorkflow = JSON.parse(JSON.stringify(editFlowState.profilesByWorkflow || {}));
            datamart.passport.flowCommonParamsByWorkflow = JSON.parse(JSON.stringify(editFlowState.sparkCommonParamsByWorkflow || {}));
        }

        function editFlowSelectCluster(name) {
            editFlowState.activeCluster = name;
            editFlowRenderPane();
        }

        function editFlowSelectWorkflow(id) {
            editFlowState.activeWorkflow = id;
            editFlowRenderPane();
            renderEngineSparkSidebarPanel();
        }

        function editFlowSetSql(idx, field, value) {
            const wf = editFlowState.activeWorkflow;
            if (!editFlowState.sqlVars[wf]) editFlowState.sqlVars[wf] = [];
            if (!editFlowState.sqlVars[wf][idx]) editFlowState.sqlVars[wf][idx] = { key: '', value: '' };
            editFlowState.sqlVars[wf][idx][field] = value;
        }

        function editFlowSetFrameworkVar(idx, field, value) {
            const wf = editFlowState.activeWorkflow;
            const rows = editFlowEnsureFrameworkVars(wf);
            if (!rows[idx]) rows[idx] = { key: '', value: '' };
            rows[idx][field] = value;
        }

        function editFlowAddFrameworkVar() {
            const wf = editFlowState.activeWorkflow;
            const rows = editFlowEnsureFrameworkVars(wf);
            rows.push({ key: '', value: '' });
            editFlowRenderPane();
            renderEngineSparkSidebarPanel();
        }

        function editFlowDelFrameworkVar(idx) {
            const wf = editFlowState.activeWorkflow;
            const rows = editFlowEnsureFrameworkVars(wf);
            rows.splice(idx, 1);
            editFlowRenderPane();
            renderEngineSparkSidebarPanel();
        }

        function editFlowAddSqlVar() {
            const wf = editFlowState.activeWorkflow;
            if (!editFlowState.sqlVars[wf]) editFlowState.sqlVars[wf] = [];
            editFlowState.sqlVars[wf].push({ key: '', value: '' });
            editFlowRenderPane();
            renderEngineSparkSidebarPanel();
        }

        function editFlowDelSqlVar(idx) {
            const wf = editFlowState.activeWorkflow;
            if (!editFlowState.sqlVars[wf]) return;
            editFlowState.sqlVars[wf].splice(idx, 1);
            editFlowRenderPane();
            renderEngineSparkSidebarPanel();
        }

        function editFlowSetClusterInfraField(clusterName, field, value) {
            if (!clusterName) return;
            const state = editMartEnsureClusterState(clusterName);
            state.infra[field] = value;
        }

        function editFlowSetClusterJvmField(clusterName, field, value) {
            if (!clusterName) return;
            const state = editMartEnsureClusterState(clusterName);
            state.sparkJvm[field] = value;
        }

        function editFlowSetProfileField(profileIdx, field, value) {
            const profiles = editFlowEnsureProfiles(editFlowState.activeWorkflow);
            if (!profiles[profileIdx]) return;
            profiles[profileIdx][field] = value;
            persistFlowProfilesToPassport();
        }

        function editFlowAddProfile() {
            const profiles = editFlowEnsureProfiles(editFlowState.activeWorkflow);
            profiles.push({ cmd: 'spark_submit_cmd_new', tone: 'mid', params: [] });
            persistFlowProfilesToPassport();
            editFlowRenderPane();
            renderEngineSparkSidebarPanel();
        }

        function editFlowDelProfile(profileIdx) {
            const profiles = editFlowEnsureProfiles(editFlowState.activeWorkflow);
            profiles.splice(profileIdx, 1);
            persistFlowProfilesToPassport();
            editFlowRenderPane();
            renderEngineSparkSidebarPanel();
        }

        function editFlowSetProfileParam(profileIdx, paramIdx, field, value) {
            const profiles = editFlowEnsureProfiles(editFlowState.activeWorkflow);
            if (!profiles[profileIdx]) return;
            if (!profiles[profileIdx].params[paramIdx]) profiles[profileIdx].params[paramIdx] = { key: '', value: '' };
            profiles[profileIdx].params[paramIdx][field] = value;
            persistFlowProfilesToPassport();
        }

        function editFlowAddProfileParam(profileIdx) {
            const profiles = editFlowEnsureProfiles(editFlowState.activeWorkflow);
            if (!profiles[profileIdx]) return;
            profiles[profileIdx].params.push({ key: '', value: '' });
            persistFlowProfilesToPassport();
            editFlowRenderPane();
            renderEngineSparkSidebarPanel();
        }

        function editFlowDelProfileParam(profileIdx, paramIdx) {
            const profiles = editFlowEnsureProfiles(editFlowState.activeWorkflow);
            if (!profiles[profileIdx]) return;
            profiles[profileIdx].params.splice(paramIdx, 1);
            persistFlowProfilesToPassport();
            editFlowRenderPane();
            renderEngineSparkSidebarPanel();
        }

        function editFlowSetCommonParam(idx, field, value) {
            const wf = editFlowState.activeWorkflow;
            const params = editFlowEnsureCommonParams(wf);
            if (!params[idx]) params[idx] = { key: '', value: '' };
            params[idx][field] = value;
            persistFlowProfilesToPassport();
        }

        function editFlowAddCommonParam() {
            const wf = editFlowState.activeWorkflow;
            editFlowEnsureCommonParams(wf).push({ key: '', value: '' });
            persistFlowProfilesToPassport();
            renderEngineSparkSidebarPanel();
        }

        function editFlowDelCommonParam(idx) {
            const wf = editFlowState.activeWorkflow;
            const params = editFlowEnsureCommonParams(wf);
            params.splice(idx, 1);
            persistFlowProfilesToPassport();
            renderEngineSparkSidebarPanel();
        }

        function openSparkCommonTextEditor() {
            if (!sparkCommonTextModal || !sparkCommonTextEditor) return;
            const wf = editFlowState.activeWorkflow;
            const params = editFlowEnsureCommonParams(wf);
            sparkCommonTextEditor.value = params.map(item => `--conf ${item.key || ''}=${item.value || ''}`).join('\n');
            sparkCommonTextModal.classList.add('active');
        }

        function closeSparkCommonTextEditor() {
            if (!sparkCommonTextModal) return;
            sparkCommonTextModal.classList.remove('active');
        }

        function applySparkCommonTextEditor() {
            if (!sparkCommonTextEditor) return;
            const wf = editFlowState.activeWorkflow;
            const lines = sparkCommonTextEditor.value.split('\n');
            const parsed = [];
            lines.forEach(line => {
                const clean = String(line || '').trim();
                if (!clean || !clean.startsWith('--conf')) return;
                const body = clean.replace(/^--conf\s+/, '').trim();
                const idx = body.indexOf('=');
                if (idx === -1) parsed.push({ key: body, value: '' });
                else parsed.push({ key: body.slice(0, idx).trim(), value: body.slice(idx + 1).trim() });
            });
            editFlowState.sparkCommonParamsByWorkflow[wf] = parsed;
            persistFlowProfilesToPassport();
            closeSparkCommonTextEditor();
            renderEngineSparkSidebarPanel();
        }

        function engineSparkSelectWorkflow(workflowId) {
            editFlowState.activeWorkflow = workflowId;
            editFlowRenderPane();
            renderEngineSparkSidebarPanel();
        }

        function isSparkSidebarProfileCollapsed(workflowId, profileIdx) {
            const map = editFlowState.sparkSidebarCollapsedByWorkflow || {};
            const list = map[workflowId] || [];
            return Boolean(list[profileIdx]);
        }

        function toggleSparkSidebarProfile(profileIdx) {
            const workflowId = editFlowState.activeWorkflow;
            if (!workflowId) return;
            if (!editFlowState.sparkSidebarCollapsedByWorkflow[workflowId]) {
                editFlowState.sparkSidebarCollapsedByWorkflow[workflowId] = [];
            }
            const list = editFlowState.sparkSidebarCollapsedByWorkflow[workflowId];
            list[profileIdx] = !list[profileIdx];
            renderEngineSparkSidebarPanel();
        }

        function isSparkSidebarClusterCollapsed(clusterName) {
            return Boolean(editFlowState.sparkSidebarClusterCollapsed && editFlowState.sparkSidebarClusterCollapsed[clusterName]);
        }

        function toggleSparkSidebarCluster(clusterName) {
            if (!clusterName) return;
            if (!editFlowState.sparkSidebarClusterCollapsed) editFlowState.sparkSidebarClusterCollapsed = {};
            editFlowState.sparkSidebarClusterCollapsed[clusterName] = !editFlowState.sparkSidebarClusterCollapsed[clusterName];
            renderEngineSparkSidebarPanel();
        }

        function isSparkSidebarClusterSectionCollapsed(clusterName, sectionKey) {
            const map = editFlowState.sparkSidebarClusterSectionCollapsed || {};
            const clusterSections = map[clusterName] || {};
            return Boolean(clusterSections[sectionKey]);
        }

        function toggleSparkSidebarClusterSection(clusterName, sectionKey) {
            if (!clusterName || !sectionKey) return;
            if (!editFlowState.sparkSidebarClusterSectionCollapsed) editFlowState.sparkSidebarClusterSectionCollapsed = {};
            if (!editFlowState.sparkSidebarClusterSectionCollapsed[clusterName]) {
                editFlowState.sparkSidebarClusterSectionCollapsed[clusterName] = {};
            }
            const clusterSections = editFlowState.sparkSidebarClusterSectionCollapsed[clusterName];
            clusterSections[sectionKey] = !clusterSections[sectionKey];
            renderEngineSparkSidebarPanel();
        }

        function toggleSparkSidebarIndividualSection() {
            if (!editFlowState.sparkSidebarSectionsCollapsed) editFlowState.sparkSidebarSectionsCollapsed = { common: false, individual: false };
            editFlowState.sparkSidebarSectionsCollapsed.individual = !editFlowState.sparkSidebarSectionsCollapsed.individual;
            renderEngineSparkSidebarPanel();
        }

        function toggleSparkSidebarCommonSection() {
            if (!editFlowState.sparkSidebarSectionsCollapsed) editFlowState.sparkSidebarSectionsCollapsed = { common: false, individual: false };
            editFlowState.sparkSidebarSectionsCollapsed.common = !editFlowState.sparkSidebarSectionsCollapsed.common;
            renderEngineSparkSidebarPanel();
        }

        function getSparkSidebarSelectedClusters() {
            const createModalEl = document.getElementById('createModal');
            const editModalEl = document.getElementById('editModal');

            if (createModalEl && createModalEl.classList.contains('active')) {
                return Object.keys(pmChecked).map(id => pmClusterName(id));
            }

            if (editModalEl && editModalEl.classList.contains('active')) {
                return editMartSelectedClusters().map(item => item.name);
            }

            const datamart = currentDatamartId ? datamarts[currentDatamartId] : null;
            const savedClusters = datamart && datamart.passport && Array.isArray(datamart.passport.clusters)
                ? datamart.passport.clusters
                : [];
            if (savedClusters.length) return savedClusters;

            return editMartSelectedClusters().map(item => item.name);
        }

        function renderEngineSparkSidebarPanel() {
            const root = document.getElementById('engineSparkProfilesSync');
            if (!root) return;
            const workflows = editFlowWorkflows();
            if (!workflows.some(w => w.id === editFlowState.activeWorkflow)) {
                editFlowState.activeWorkflow = workflows[0]?.id || '';
            }
            const profiles = editFlowEnsureProfiles(editFlowState.activeWorkflow);
            const commonParams = editFlowEnsureCommonParams(editFlowState.activeWorkflow);
            const selectedClusters = getSparkSidebarSelectedClusters();
            const cards = profiles.map((p, pIdx) => `
                <div class="flow-card">
                    <div class="flow-card-head">
                        <div class="flow-card-name">
                            <span class="flow-prof-icon flow-prof-${escHtml(p.tone || 'mid')}">${escHtml(((p.cmd || 'profile').replace('spark_submit_cmd_','')[0] || 'P').toUpperCase())}</span>
                            <input class="param-input monospace" value="${escHtml(p.cmd || '')}" oninput="editFlowSetProfileField(${pIdx}, 'cmd', this.value)" style="min-width:180px">
                        </div>
                        <div style="display:flex;align-items:center;gap:4px">
                            <button type="button" class="mart-del" onclick="toggleSparkSidebarProfile(${pIdx})">${isSparkSidebarProfileCollapsed(editFlowState.activeWorkflow, pIdx) ? '▶' : '▼'}</button>
                            <button type="button" class="mart-del" onclick="editFlowDelProfile(${pIdx})">✕</button>
                        </div>
                    </div>
                    ${isSparkSidebarProfileCollapsed(editFlowState.activeWorkflow, pIdx) ? '' : `${(p.params || []).map((pr, prIdx) => `<div class="mart-sql-row"><input class="mart-input" value="${escHtml(pr.key || '')}" oninput="editFlowSetProfileParam(${pIdx}, ${prIdx}, 'key', this.value)"><input class="mart-input" value="${escHtml(pr.value || '')}" oninput="editFlowSetProfileParam(${pIdx}, ${prIdx}, 'value', this.value)"><button type="button" class="mart-del" onclick="editFlowDelProfileParam(${pIdx}, ${prIdx})">✕</button></div>`).join('')}
                    <button type="button" class="mart-add" onclick="editFlowAddProfileParam(${pIdx})"><i class="fas fa-plus"></i> Добавить параметр</button>`}
                </div>
            `).join('');

            const commonRows = commonParams.map((row, idx) => `
                <div class="mart-sql-row">
                    <input class="mart-input" style="min-width:0" value="${escHtml(row.key || '')}" oninput="editFlowSetCommonParam(${idx}, 'key', this.value)" placeholder="Ключ">
                    <input class="mart-input" style="min-width:0" value="${escHtml(row.value || '')}" oninput="editFlowSetCommonParam(${idx}, 'value', this.value)" placeholder="Значение">
                    <button type="button" class="mart-del" onclick="editFlowDelCommonParam(${idx})">✕</button>
                </div>
            `).join('');

            const clusterBlocks = selectedClusters.map(clusterName => {
                const clusterState = editMartEnsureClusterState(clusterName);
                return `
                <div class="mart-group spark-cluster-level">
                    <div class="flow-title" style="margin-bottom:8px;display:flex;align-items:center;gap:8px">
                        <i class="fas fa-server"></i> Кластер ${escHtml(clusterName)}
                        <button type="button" class="mart-del" style="margin-left:auto" onclick='toggleSparkSidebarCluster(${JSON.stringify(clusterName)})'>${isSparkSidebarClusterCollapsed(clusterName) ? '▶' : '▼'}</button>
                    </div>
                    ${isSparkSidebarClusterCollapsed(clusterName) ? '' : `
                    <div class="mart-group spark-cluster-sublevel" style="margin-bottom:10px">
                        <button type="button" class="flow-title spark-subsection-toggle" style="margin-bottom:8px;display:flex;align-items:center;gap:8px" onclick='toggleSparkSidebarClusterSection(${JSON.stringify(clusterName)}, "infra")'>
                            <i class="fas fa-id-badge"></i> Инфраструктура кластера
                            <span class="spark-sub-chevron">${isSparkSidebarClusterSectionCollapsed(clusterName, 'infra') ? '▶' : '▼'}</span>
                        </button>
                        ${isSparkSidebarClusterSectionCollapsed(clusterName, 'infra') ? '' : `<div class="mart-grid" style="grid-template-columns:1fr">
                            <div class="mart-row"><div class="mart-label">YARN queue <span class="hint">YARN_QUEUE</span></div><input class="mart-input" value="${escHtml(clusterState.infra?.yarnQueue || '')}" oninput="editFlowSetClusterInfraField(${JSON.stringify(clusterName)}, 'yarnQueue', this.value)"></div>
                            <div class="mart-row"><div class="mart-label">Пользователь <span class="hint">USER_NAME</span></div><input class="mart-input" value="${escHtml(clusterState.infra?.userName || '')}" oninput="editFlowSetClusterInfraField(${JSON.stringify(clusterName)}, 'userName', this.value)"></div>
                        </div>`}
                    </div>
                    <div class="mart-group spark-cluster-sublevel" style="margin-bottom:10px">
                        <button type="button" class="flow-title spark-subsection-toggle" style="margin-bottom:8px;display:flex;align-items:center;gap:8px" onclick='toggleSparkSidebarClusterSection(${JSON.stringify(clusterName)}, "jvm")'>
                            <i class="fas fa-microchip"></i> JVM опции для Spark
                            <span class="spark-sub-chevron">${isSparkSidebarClusterSectionCollapsed(clusterName, 'jvm') ? '▶' : '▼'}</span>
                        </button>
                        ${isSparkSidebarClusterSectionCollapsed(clusterName, 'jvm') ? '' : `<div class="mart-grid" style="grid-template-columns:1fr">
                            <div class="mart-row"><div class="mart-label">Executor Java options <span class="hint">spark_executor_extraJavaOptions</span></div><textarea class="mart-text" rows="2" oninput="editFlowSetClusterJvmField(${JSON.stringify(clusterName)}, 'spark_executor_extraJavaOptions', this.value)">${escHtml(clusterState.sparkJvm?.spark_executor_extraJavaOptions || '')}</textarea></div>
                            <div class="mart-row"><div class="mart-label">Driver Java options <span class="hint">spark_driver_extraJavaOptions</span></div><textarea class="mart-text" rows="2" oninput="editFlowSetClusterJvmField(${JSON.stringify(clusterName)}, 'spark_driver_extraJavaOptions', this.value)">${escHtml(clusterState.sparkJvm?.spark_driver_extraJavaOptions || '')}</textarea></div>
                        </div>`}
                    </div>
                    <div class="mart-group spark-cluster-sublevel" style="margin-bottom:10px">
                        <button type="button" class="flow-title spark-subsection-toggle" style="margin-bottom:8px;display:flex;align-items:center;gap:8px" onclick='toggleSparkSidebarClusterSection(${JSON.stringify(clusterName)}, "profiles")'>
                            <i class="fas fa-layer-group"></i> Профили ресурсов Spark
                            <span class="spark-sub-chevron">${isSparkSidebarClusterSectionCollapsed(clusterName, 'profiles') ? '▶' : '▼'}</span>
                        </button>
                        ${isSparkSidebarClusterSectionCollapsed(clusterName, 'profiles') ? '' : `<div class="engine-profile-stack">${cards}</div>
                        <button type="button" class="mart-add" onclick="editFlowAddProfile()"><i class="fas fa-plus"></i> Добавить профиль</button>`}
                    </div>`}
                </div>
            `;
            }).join('');

            root.innerHTML = `
                <div class="mart-group">
                    <div class="flow-title" style="margin-bottom:8px;display:flex;align-items:center;gap:8px">
                        <i class="fas fa-globe"></i> Общие параметры для всех кластеров
                        <button type="button" class="mart-add" style="margin-left:auto" onclick="openSparkCommonTextEditor()">Text Editor</button>
                        <button type="button" class="mart-del" onclick="toggleSparkSidebarCommonSection()">${editFlowState.sparkSidebarSectionsCollapsed?.common ? '▶' : '▼'}</button>
                    </div>
                    ${editFlowState.sparkSidebarSectionsCollapsed?.common ? '' : `${commonRows}
                    <button type="button" class="mart-add" onclick="editFlowAddCommonParam()"><i class="fas fa-plus"></i> Добавить общий параметр</button>`}
                </div>
                <div class="mart-group">
                    <div class="flow-title" style="margin-bottom:8px;display:flex;align-items:center;gap:8px">
                        <i class="fas fa-sitemap"></i> Индивидуальные параметры кластеров
                        <button type="button" class="mart-add" style="margin-left:auto" onclick="openSparkProfilesTableModal()">см. таблицу параметров</button>
                        <button type="button" class="mart-del" onclick="toggleSparkSidebarIndividualSection()">${editFlowState.sparkSidebarSectionsCollapsed?.individual ? '▶' : '▼'}</button>
                    </div>
                    ${editFlowState.sparkSidebarSectionsCollapsed?.individual ? '' : (selectedClusters.length
                        ? clusterBlocks
                        : `<div class="mart-empty" style="padding:10px 12px">Кластеры не выбраны в «Паспорте витрины».</div>`)}
                </div>
            `;
        }

        function openSparkProfilesTableModal() {
            const wrap = document.getElementById('sparkProfilesTableWrap');
            if (!sparkProfilesTableModal || !wrap) return;

            const clusters = getSparkSidebarSelectedClusters();
            const wf = editFlowState.activeWorkflow;
            const profiles = editFlowEnsureProfiles(wf);
            const commonParams = editFlowEnsureCommonParams(wf);
            sparkTableFilters = {};

            if (!clusters.length) {
                wrap.innerHTML = '<div class="mart-empty">Нет выбранных кластеров для построения таблицы.</div>';
                sparkProfilesTableModal.classList.add('active');
                return;
            }

            const rows = [];
            commonParams.forEach(param => rows.push({ profile: 'common', param: param.key || '', value: param.value || '' }));
            profiles.forEach(profile => {
                (profile.params || []).forEach(param => {
                    rows.push({ profile: profile.cmd || 'spark_submit_cmd', param: param.key || '', value: param.value || '' });
                });
            });

            if (!rows.length) rows.push({ profile: 'common', param: '', value: '' });
            sparkTableHeadersCache = ['Spark профиль', 'Параметр', ...clusters];
            sparkTableRowsCache = rows.map(row => [row.profile || '', row.param || '', ...clusters.map(() => row.value || '')]);
            sparkTableColWidths = sparkTableHeadersCache.map((_, idx) => idx === 0 ? 200 : idx === 1 ? 220 : 180);

            wrap.innerHTML = `
                <div style="display:flex;justify-content:flex-end;gap:8px;margin-bottom:8px">
                    <button type="button" class="btn btn-secondary" style="padding:5px 10px" onclick="toggleWrapSelectedSparkTableColumn()">Перенос в выделенной колонке</button>
                    <button type="button" class="btn btn-secondary" style="padding:5px 10px" onclick="clearSparkTableFilters()">Снять все фильтры</button>
                </div>
                <div style="height:58vh;border:1px solid #d7e3f5;border-radius:10px;overflow:auto;background:linear-gradient(180deg,#ffffff 0%,#f7fbff 100%);box-shadow:0 6px 20px rgba(28,68,123,.08)">
                <table class="cluster-matrix" id="sparkProfilesTableGrid" style="min-width:980px;border-collapse:separate;border-spacing:0;table-layout:fixed">
                    <thead style="position:sticky;top:0;z-index:2">
                        <tr>${sparkTableHeadersCache.map((header, idx) => `
                            <th class="spark-col-header" data-col-idx="${idx}" ondblclick="autoFitSparkTableColumn(${idx})" style="position:relative;width:${sparkTableColWidths[idx]}px;min-width:${sparkTableColWidths[idx]}px;max-width:${sparkTableColWidths[idx]}px;background:#1f3d73;color:#fff;white-space:nowrap;border-right:1px solid rgba(255,255,255,.35);padding:10px 12px">
                                <div style="display:flex;align-items:center;justify-content:space-between;gap:10px">
                                    <span style="cursor:pointer" onclick="selectSparkTableColumn(${idx})">${escHtml(header)}</span>
                                    <button type="button" class="mart-del spark-table-filter-btn" style="color:#fff;opacity:1;font-size:14px;line-height:1;padding:2px 6px;border:1px solid ${sparkTableFilters[idx] ? '#ffd36b' : 'rgba(255,255,255,.45)'};background:${sparkTableFilters[idx] ? 'rgba(255,211,107,.25)' : 'transparent'};border-radius:4px;flex-shrink:0" onclick="openSparkTableFilterMenu(${idx}, this)">▼</button>
                                </div>
                                <div class="spark-col-resizer" data-col-idx="${idx}" style="position:absolute;top:0;right:-3px;width:6px;height:100%;cursor:col-resize"></div>
                            </th>
                        `).join('')}</tr>
                    </thead>
                    <tbody>
                        ${sparkTableRowsCache.map((row, rowIdx) => `<tr class="spark-table-row" data-row-idx="${rowIdx}">
                            ${row.map((cell, cellIdx) => `<td data-col-idx="${cellIdx}" style="width:${sparkTableColWidths[cellIdx]}px;min-width:${sparkTableColWidths[cellIdx]}px;max-width:${sparkTableColWidths[cellIdx]}px;border-right:1px solid #e2e9f7;border-bottom:1px solid #eaf0fb;${cellIdx > 1 ? 'text-align:center' : ''}"><span style="color:#1a335f;font-weight:${cellIdx > 1 ? 600 : 500}">${escHtml(cell)}</span></td>`).join('')}
                        </tr>`).join('')}
                    </tbody>
                </table>
                </div>
                <div id="sparkTableFilterMenu" style="display:none;position:fixed;z-index:9999;background:#fff;border:1px solid #d7e3f5;border-radius:10px;box-shadow:0 8px 24px rgba(24,53,97,.24);width:280px;padding:10px"></div>
            `;

            applySparkTableFilters();
            refreshSparkTableFilterIndicators();
            applySparkTableColumnPresentation();
            setupSparkTableInteractions();

            sparkProfilesTableModal.classList.add('active');
        }

        function applySparkTableFilters() {
            const table = document.getElementById('sparkProfilesTableGrid');
            if (!table) return;
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const rowIdx = Number(row.dataset.rowIdx);
                const rowData = sparkTableRowsCache[rowIdx] || [];
                const visible = Object.entries(sparkTableFilters).every(([colStr, allowedSet]) => {
                    if (!allowedSet || !allowedSet.size) return true;
                    const col = Number(colStr);
                    return allowedSet.has(String(rowData[col] || ''));
                });
                row.style.display = visible ? '' : 'none';
            });
        }

        function openSparkTableFilterMenu(colIdx, trigger) {
            const menu = document.getElementById('sparkTableFilterMenu');
            if (!menu || !trigger) return;
            const header = sparkTableHeadersCache[colIdx] || `Колонка ${colIdx + 1}`;
            const allValues = Array.from(new Set(sparkTableRowsCache.map(row => String(row[colIdx] || '')))).sort((a, b) => a.localeCompare(b, 'ru'));
            const selected = sparkTableFilters[colIdx] ? new Set([...sparkTableFilters[colIdx]]) : new Set(allValues);
            menu.innerHTML = `
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
                    <div style="font-size:12px;font-weight:700;color:#1f3d73">${escHtml(header)}</div>
                    <button type="button" class="mart-del" onclick="closeSparkTableFilterMenu()">✕</button>
                </div>
                <div style="max-height:220px;overflow:auto;border:1px solid #edf2fb;border-radius:8px;padding:6px">
                    <label style="display:flex;align-items:center;gap:8px;padding:4px 2px;font-size:12px;color:#1f3d73;font-weight:700;border-bottom:1px solid #edf2fb;margin-bottom:4px">
                        <input type="checkbox" class="spark-filter-select-all" ${selected.size === allValues.length ? 'checked' : ''} onchange="toggleSparkTableFilterSelectAll(this)">
                        <span>(Выделить все)</span>
                    </label>
                    ${allValues.map((value, idx) => `<label style="display:flex;align-items:center;gap:8px;padding:4px 2px;font-size:12px;color:#334e7e"><input type="checkbox" class="spark-filter-check" data-col="${colIdx}" data-value="${encodeURIComponent(value)}" ${selected.has(value) ? 'checked' : ''} onchange="syncSparkTableSelectAllState()"><span>${escHtml(value || '∅ (пусто)')}</span></label>`).join('')}
                </div>
                <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:10px">
                    <button type="button" class="btn btn-primary" style="padding:5px 10px" onclick="applySparkTableFilterSelection(${colIdx})">OK</button>
                    <button type="button" class="btn btn-secondary" style="padding:5px 10px" onclick="closeSparkTableFilterMenu()">Отмена</button>
                </div>
            `;
            const rect = trigger.getBoundingClientRect();
            menu.style.left = `${Math.max(8, rect.left - 220)}px`;
            menu.style.top = `${rect.bottom + 6}px`;
            menu.style.display = 'block';
        }

        function clearSparkTableFilters() {
            sparkTableFilters = {};
            closeSparkTableFilterMenu();
            applySparkTableFilters();
            refreshSparkTableFilterIndicators();
        }

        function toggleSparkTableFilterSelectAll(source) {
            const menu = document.getElementById('sparkTableFilterMenu');
            if (!menu || !source) return;
            menu.querySelectorAll('.spark-filter-check').forEach(ch => { ch.checked = source.checked; });
        }

        function syncSparkTableSelectAllState() {
            const menu = document.getElementById('sparkTableFilterMenu');
            if (!menu) return;
            const selectAll = menu.querySelector('.spark-filter-select-all');
            const checks = Array.from(menu.querySelectorAll('.spark-filter-check'));
            if (!selectAll || !checks.length) return;
            selectAll.checked = checks.every(ch => ch.checked);
        }

        function applySparkTableFilterSelection(colIdx) {
            const menu = document.getElementById('sparkTableFilterMenu');
            if (!menu) return;
            const checks = Array.from(menu.querySelectorAll('.spark-filter-check'));
            const selected = new Set(checks.filter(ch => ch.checked).map(ch => decodeURIComponent(ch.dataset.value || '')));
            const allValues = new Set(sparkTableRowsCache.map(row => String(row[colIdx] || '')));
            if (selected.size === allValues.size) delete sparkTableFilters[colIdx];
            else sparkTableFilters[colIdx] = selected;
            closeSparkTableFilterMenu();
            applySparkTableFilters();
            refreshSparkTableFilterIndicators();
        }

        function closeSparkTableFilterMenu() {
            const menu = document.getElementById('sparkTableFilterMenu');
            if (!menu) return;
            menu.style.display = 'none';
            menu.innerHTML = '';
        }

        function refreshSparkTableFilterIndicators() {
            const table = document.getElementById('sparkProfilesTableGrid');
            if (!table) return;
            const buttons = table.querySelectorAll('.spark-table-filter-btn');
            buttons.forEach((btn, idx) => {
                const active = Boolean(sparkTableFilters[idx] && sparkTableFilters[idx].size);
                btn.style.border = active ? '1px solid #ffd36b' : '1px solid rgba(255,255,255,.45)';
                btn.style.background = active ? 'rgba(255,211,107,.25)' : 'transparent';
            });
        }

        function selectSparkTableColumn(colIdx) {
            sparkTableSelectedCol = colIdx;
            applySparkTableColumnPresentation();
        }

        function toggleWrapSelectedSparkTableColumn() {
            if (sparkTableSelectedCol < 0) return;
            sparkTableWrappedCols[sparkTableSelectedCol] = !sparkTableWrappedCols[sparkTableSelectedCol];
            applySparkTableColumnPresentation();
        }

        function applySparkTableColumnPresentation() {
            const table = document.getElementById('sparkProfilesTableGrid');
            if (!table) return;
            const selectedCol = sparkTableSelectedCol;
            table.querySelectorAll('thead th').forEach((th, idx) => {
                th.style.background = idx === selectedCol ? '#274b8b' : '#1f3d73';
            });
            table.querySelectorAll('tbody td').forEach(td => {
                const idx = Number(td.dataset.colIdx);
                if (idx === selectedCol) td.style.background = '#eef4ff';
                else td.style.background = '';
                const wrap = Boolean(sparkTableWrappedCols[idx]);
                td.style.whiteSpace = wrap ? 'normal' : 'nowrap';
                td.style.wordBreak = wrap ? 'break-word' : 'normal';
            });
        }

        function setupSparkTableInteractions() {
            const table = document.getElementById('sparkProfilesTableGrid');
            if (!table) return;
            table.querySelectorAll('tbody td').forEach(td => {
                td.addEventListener('mouseenter', function() {
                    if (Number(this.dataset.colIdx) !== sparkTableSelectedCol) this.style.background = '#f6f9ff';
                });
                td.addEventListener('mouseleave', function() {
                    if (Number(this.dataset.colIdx) !== sparkTableSelectedCol) this.style.background = '';
                });
            });

            table.querySelectorAll('.spark-col-resizer').forEach(handle => {
                handle.addEventListener('mouseenter', () => { handle.style.background = 'rgba(255,211,107,.45)'; });
                handle.addEventListener('mouseleave', () => { handle.style.background = 'transparent'; });
                handle.addEventListener('mousedown', function(event) {
                    event.preventDefault();
                    const colIdx = Number(this.dataset.colIdx);
                    const startX = event.clientX;
                    const startWidth = sparkTableColWidths[colIdx];
                    function onMove(e) {
                        const next = Math.max(120, startWidth + (e.clientX - startX));
                        sparkTableColWidths[colIdx] = next;
                        const th = table.querySelectorAll('thead th')[colIdx];
                        if (th) {
                            th.style.width = `${next}px`;
                            th.style.minWidth = `${next}px`;
                            th.style.maxWidth = `${next}px`;
                        }
                        table.querySelectorAll(`tbody td[data-col-idx="${colIdx}"]`).forEach(td => {
                            td.style.width = `${next}px`;
                            td.style.minWidth = `${next}px`;
                            td.style.maxWidth = `${next}px`;
                        });
                    }
                    function onUp() {
                        document.removeEventListener('mousemove', onMove);
                        document.removeEventListener('mouseup', onUp);
                    }
                    document.addEventListener('mousemove', onMove);
                    document.addEventListener('mouseup', onUp);
                });
            });
        }

        function autoFitSparkTableColumn(colIdx) {
            const table = document.getElementById('sparkProfilesTableGrid');
            if (!table) return;
            const header = sparkTableHeadersCache[colIdx] || '';
            const values = sparkTableRowsCache.map(row => String(row[colIdx] || ''));
            const maxLen = Math.max(header.length, ...values.map(v => v.length), 8);
            const width = Math.min(560, Math.max(140, maxLen * 8 + 34));
            sparkTableColWidths[colIdx] = width;
            const headerCell = table.querySelectorAll('thead th')[colIdx];
            if (headerCell) {
                headerCell.style.width = `${width}px`;
                headerCell.style.minWidth = `${width}px`;
                headerCell.style.maxWidth = `${width}px`;
            }
            table.querySelectorAll(`tbody td[data-col-idx="${colIdx}"]`).forEach(td => {
                td.style.width = `${width}px`;
                td.style.minWidth = `${width}px`;
                td.style.maxWidth = `${width}px`;
            });
        }

        function closeSparkProfilesTable() {
            if (!sparkProfilesTableModal) return;
            closeSparkTableFilterMenu();
            sparkProfilesTableModal.classList.remove('active');
        }

        function toggleFlowSidebar(sidebarType) {
            if (sidebarType === 'workflow') editFlowState.collapsed.workflow = !editFlowState.collapsed.workflow;
            else editFlowState.collapsed.cluster = !editFlowState.collapsed.cluster;
            editFlowRenderPane();
        }

        function toggleFlowSection(section) {
            editFlowState.sections[section] = !editFlowState.sections[section];
            editFlowRenderPane();
        }

        function editFlowRenderPane() {
            const root = document.getElementById('edit_flow_root');
            if (!root) return;
            const selected = editMartSelectedClusters();
            if (!selected.length) {
                root.innerHTML = `<div class="mart-empty"><b>Не выбраны кластеры для деплоя.</b><br>Выбрать кластер/кластера можно на странице «Паспорт витрины» в секции «Линейка и кластеры».</div>`;
                return;
            }

            if (!selected.some(x => x.name === editFlowState.activeCluster)) editFlowState.activeCluster = selected[0].name;
            const workflows = editFlowWorkflows();
            if (!workflows.some(w => w.id === editFlowState.activeWorkflow)) editFlowState.activeWorkflow = workflows[0].id;
            const activeContour = selected.find(x => x.name === editFlowState.activeCluster)?.contour || 'dev';
            const readonly = editFlowReadOnly ? 'disabled' : '';
            const profiles = editFlowEnsureProfiles(editFlowState.activeWorkflow);
            const sqlRows = (editFlowState.sqlVars[editFlowState.activeWorkflow] || []).map((r, idx) => `
                <div class="mart-sql-row">
                    <input class="mart-input" value="${escHtml(r.key)}" ${readonly} oninput="editFlowSetSql(${idx}, 'key', this.value)">
                    <input class="mart-input" value="${escHtml(r.value)}" ${readonly} oninput="editFlowSetSql(${idx}, 'value', this.value)">
                    <button type="button" class="mart-del" ${readonly} onclick="editFlowDelSqlVar(${idx})">✕</button>
                </div>`).join('');
            const profileCards = profiles.map((p, pIdx) => `
                <div class="flow-card">
                    <div class="flow-card-head">
                        <div class="flow-card-name"><span class="flow-prof-icon flow-prof-${escHtml(p.tone || 'mid')}">${escHtml(((p.cmd || 'profile').replace('spark_submit_cmd_','')[0] || 'P').toUpperCase())}</span><input class="param-input monospace" ${readonly} value="${escHtml(p.cmd || '')}" oninput="editFlowSetProfileField(${pIdx}, 'cmd', this.value)" style="min-width:240px"></div>
                        <div style="display:flex;gap:6px;align-items:center">
                            <button type="button" class="mart-del" ${readonly} onclick="editFlowDelProfile(${pIdx})">✕</button>
                        </div>
                    </div>
                    ${(p.params || []).map((pr, prIdx) => `<div class="mart-sql-row"><input class="mart-input" ${readonly} value="${escHtml(pr.key || '')}" oninput="editFlowSetProfileParam(${pIdx}, ${prIdx}, 'key', this.value)"><input class="mart-input" ${readonly} value="${escHtml(pr.value || '')}" oninput="editFlowSetProfileParam(${pIdx}, ${prIdx}, 'value', this.value)"><button type="button" class="mart-del" ${readonly} onclick="editFlowDelProfileParam(${pIdx}, ${prIdx})">✕</button></div>`).join('')}
                    <button type="button" class="mart-add" ${readonly} onclick="editFlowAddProfileParam(${pIdx})"><i class="fas fa-plus"></i> Добавить параметр</button>
                </div>`).join('');

            root.innerHTML = `
                <div class="flow-layout">
                    <div class="flow-sidebar ${editFlowState.collapsed.cluster ? 'collapsed' : ''}" id="flowClusterSidebar">
                        <div class="flow-sidebar-header"><span class="flow-sidebar-title">Кластер</span><button type="button" class="flow-collapse-btn" onclick="toggleFlowSidebar('cluster')"><i class="fas fa-angle-double-left"></i></button></div>
                        <button type="button" class="flow-expand-btn" onclick="toggleFlowSidebar('cluster')" title="Развернуть"><i class="fas fa-angle-double-right"></i></button>
                        ${selected.map(c => `<div class="flow-item ${c.name===editFlowState.activeCluster?'active':''}" onclick="editFlowSelectCluster('${c.name}')"><span class="flow-dot flow-dot-${c.contour}"></span>${c.name}</div>`).join('')}
                    </div>
                    <div class="flow-sidebar wf ${editFlowState.collapsed.workflow ? 'collapsed' : ''}" id="flowWorkflowSidebar">
                        <div class="flow-sidebar-header"><span class="flow-sidebar-title">Потоки</span><span class="flow-count">${workflows.length}</span><button type="button" class="flow-collapse-btn" onclick="toggleFlowSidebar('workflow')"><i class="fas fa-angle-double-left"></i></button></div>
                        <button type="button" class="flow-expand-btn" onclick="toggleFlowSidebar('workflow')" title="Развернуть"><i class="fas fa-angle-double-right"></i></button>
                        ${workflows.map(w => `<div class="flow-item ${w.id===editFlowState.activeWorkflow?'active':''}" onclick="editFlowSelectWorkflow('${w.id}')"><i class="fas ${w.icon}" style="font-size:12px;color:#888"></i>${w.id}</div>`).join('')}
                    </div>
                    <div class="flow-content">
                        <div class="flow-file-path"><i class="fas fa-folder-open" style="color:#2a5298;margin-right:6px"></i>etl/workflows/${editFlowState.activeWorkflow}/mart.yml <span style="margin:0 8px;color:#ddd">|</span> <span class="flow-dot flow-dot-${activeContour}"></span>${editFlowState.activeCluster}</div>
                        <div class="flow-title" style="cursor:pointer" onclick="toggleFlowSection('spark')"><i class="fas fa-cogs"></i> Spark профили и ресурсы <span style="margin-left:auto;font-size:11px;color:#7b8da6">${editFlowState.sections.spark ? '▼' : '▶'}</span></div>
                        ${editFlowState.sections.spark ? `<div style="margin-bottom:12px">${profileCards}<button type="button" class="mart-add" ${readonly} onclick="editFlowAddProfile()"><i class="fas fa-plus"></i> Добавить профиль</button></div>` : ''}
                        <div class="flow-title" style="cursor:pointer" onclick="toggleFlowSection('dwh')"><i class="fas fa-stream"></i> DWH Services для потока <span style="margin-left:auto;font-size:11px;color:#7b8da6">${editFlowState.sections.dwh ? '▼' : '▶'}</span></div>
                        ${editFlowState.sections.dwh ? `<div class="flow-grid"><div class="param-row"><div class="param-label">HDFS2Kafka topic</div><input class="param-input monospace" placeholder="topic.batch.autopay" disabled></div><div class="param-row"><div class="param-label">Kafka2HDFS topic</div><input class="param-input monospace" placeholder="topic.nrt.autopay" disabled></div></div>` : ''}
                        <div class="mart-group" style="margin-top:12px;margin-bottom:0">
                            <div class="mart-title" style="cursor:pointer" onclick="toggleFlowSection('sql')"><i class="fas fa-code"></i> Переменные SQL <span style="margin-left:auto;font-size:11px;color:#7b8da6">${editFlowState.sections.sql ? '▼' : '▶'}</span></div>
                            ${editFlowState.sections.sql ? `${sqlRows}<button type="button" class="mart-add" ${readonly} onclick="editFlowAddSqlVar()"><i class="fas fa-plus"></i> Добавить переменную</button>` : ''}
                        </div>
                    </div>
                </div>`;
            renderEngineSparkSidebarPanel();
        }

        function editPmUpdateHdfsPath() {
            const block  = document.getElementById('edit_pm_block')?.value  || '{block}';
            const group  = document.getElementById('edit_pm_datamart_group')?.value || '{datamart_group}';
            const name   = document.getElementById('edit_pm_datamart_name')?.value  || '{datamart_name}';
            const sep = s => `<span class="hdfs-seg-sep">${s}</span>`;
            const fix = s => `<span class="hdfs-seg-fixed">${s}</span>`;
            const par = s => `<span class="hdfs-seg-param">${s}</span>`;
            const martPathEl = document.getElementById('edit_pm_dvHdfsPathInline');
            if (martPathEl) martPathEl.innerHTML = fix('hdfs:///oozie-app') + sep('/') + par(block) + sep('/') + par(group) + sep('/') + par(name);
            const dataPathEl = document.getElementById('edit_pm_dvDataHdfsPathInline');
            if (dataPathEl) dataPathEl.innerHTML = fix('hdfs:///data/custom') + sep('/') + par(block) + sep('/') + par(name);
            editMartRefreshFrameworkTemplateVars();
            const isDatamartTabActive = document.querySelector('.modal-tab-pane.active')?.dataset.editPane === 'datamartParams';
            if (isDatamartTabActive) editMartRenderPane();
        }

        function setEditFooterMode(isEdit) {
            const deleteBtn  = document.getElementById('deleteDatamartBtn');
            const cancelBtn  = document.getElementById('cancelEdit');
            const editBtn    = document.getElementById('editPassportBtn');
            const discardBtn = document.getElementById('discardEditBtn');
            const saveBtn    = document.getElementById('saveEdit');
            if (deleteBtn)  { deleteBtn.style.display  = isEdit ? 'none' : ''; }
            if (cancelBtn)  { cancelBtn.style.display  = isEdit ? 'none' : ''; }
            if (editBtn)    { editBtn.style.display    = isEdit ? 'none' : 'flex'; }
            if (discardBtn) { discardBtn.style.display = isEdit ? 'flex' : 'none'; }
            if (saveBtn)    { saveBtn.style.display    = isEdit ? '' : 'none'; }
        }

        function setPassportViewMode() {
            editPmReadOnly = true;
            EDIT_PM_FIELD_IDS.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.disabled = true;
            });
            const lineupBody = document.getElementById('edit_pm_lineupSectionBody');
            if (lineupBody) lineupBody.classList.add('is-readonly');
            editPmRenderLineupChips();
            editPmRenderMatrix();
            setEditFooterMode(false);
        }

        function setPassportEditMode() {
            editPmReadOnly = false;
            EDIT_PM_FIELD_IDS.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.disabled = false;
            });
            const lineupBody = document.getElementById('edit_pm_lineupSectionBody');
            if (lineupBody) lineupBody.classList.remove('is-readonly');
            editPmRenderLineupChips();
            editPmRenderMatrix();
            setEditFooterMode(true);
        }

        function setDatamartViewMode() {
            editMartReadOnly = true;
            editMartRenderPane();
            setEditFooterMode(false);
        }

        function setDatamartEditMode() {
            editMartReadOnly = false;
            editMartRenderPane();
            setEditFooterMode(true);
        }

        function setFlowViewMode() {
            editFlowReadOnly = true;
            editFlowRenderPane();
            setEditFooterMode(false);
        }

        function setFlowEditMode() {
            editFlowReadOnly = false;
            editFlowRenderPane();
            setEditFooterMode(true);
        }

        function setEditModeForActiveTab() {
            const activeTab = document.querySelector('.modal-tab-pane.active')?.dataset.editPane;
            if (activeTab === 'datamartParams') setDatamartEditMode();
            else if (activeTab === 'flowParams') setFlowEditMode();
            else setPassportEditMode();
        }

        function switchEditTab(tabName) {
            editTabButtons.forEach(button => {
                button.classList.toggle('active', button.dataset.editTab === tabName);
            });

            editTabPanes.forEach(pane => {
                pane.classList.toggle('active', pane.dataset.editPane === tabName);
            });

            if (tabName === 'datamartParams') setDatamartViewMode();
            else if (tabName === 'flowParams') setFlowViewMode();
            else setPassportViewMode();
        }


        function closeAllTileContextMenus() {
            document.querySelectorAll('.tile-context-menu.open').forEach(menu => {
                menu.classList.remove('open');
            });
        }

        function attachTileHandlers(tile) {
            if (!tile) return;

            tile.addEventListener('click', function() {
                const datamartId = this.dataset.datamartId;
                const datamartName = this.querySelector('.tile-title').textContent;
                openDatamart(datamartId, datamartName);
            });

            const menuTrigger = tile.querySelector('.tile-menu-trigger');
            const contextMenu = tile.querySelector('.tile-context-menu');
            if (!menuTrigger || !contextMenu) return;

            menuTrigger.addEventListener('click', function(e) {
                e.stopPropagation();
                const shouldOpen = !contextMenu.classList.contains('open');
                closeAllTileContextMenus();
                contextMenu.classList.toggle('open', shouldOpen);
            });

            contextMenu.querySelectorAll('.tile-context-item').forEach(item => {
                item.addEventListener('click', function(e) {
                    e.stopPropagation();
                    contextMenu.classList.remove('open');

                    const action = this.dataset.action;
                    const datamartId = tile.dataset.datamartId;
                    const datamartName = tile.querySelector('.tile-title').textContent;

                    if (action === 'edit') {
                        openEditDatamartModal(datamartId);
                        return;
                    }

                    if (action === 'delete') {
                        removeDatamartById(datamartId, datamartName);
                    }
                });
            });
        }

        // Данные для дерева файлов (демо-структура потока/витрины в стиле GitHubTree)
        const baseFileStructure = {
            repo: "project/mart-flow",
            name: "mart-flow",
            type: "folder",
            children: [
                {
                    name: "etl",
                    type: "folder",
                    children: [
                        {
                            name: "ddl",
                            type: "folder",
                            children: [
                                { name: "create_tables.sql", type: "file" },
                                { name: "drop_tables.sql", type: "file" }
                            ]
                        },
                        {
                            name: "workflows",
                            type: "folder",
                            children: [
                                { name: "orders", type: "folder", children: [
                                    { name: "orders_load.sql", type: "file" },
                                    { name: "orders_transform.sql", type: "file" }
                                ]},
                                { name: "customers", type: "folder", children: [
                                    { name: "customers_load.sql", type: "file" },
                                    { name: "customers_quality.sql", type: "file" }
                                ]}
                            ]
                        }
                    ]
                },
                {
                    name: "external",
                    type: "folder",
                    children: [
                        {
                            name: "functions",
                            type: "folder",
                            children: [
                                { name: "DateNormalize.scala", type: "file" },
                                { name: "HashBucketizer.java", type: "file" }
                            ]
                        },
                        {
                            name: "udfs",
                            type: "folder",
                            children: [
                                { name: "MaskPhoneUdf.java", type: "file" },
                                { name: "SafeCastUdf.scala", type: "file" }
                            ]
                        }
                    ]
                },
                {
                    name: "resources",
                    type: "folder",
                    children: [
                        {
                            name: "ctl",
                            type: "folder",
                            children: [
                                { name: "ctl.yml", type: "file" }
                            ]
                        },
                        {
                            name: "devops",
                            type: "folder",
                            children: [
                                { name: "devops.json", type: "file" },
                                { name: "devsecops.json", type: "file" }
                            ]
                        },
                        {
                            name: "docs",
                            type: "folder",
                            children: [
                                { name: "s2t.xlsx", type: "file" }
                            ]
                        },
                        {
                            name: "external",
                            type: "folder",
                            children: [
                                { name: "functions-registry.yml", type: "file" }
                            ]
                        },
                        {
                            name: "secman",
                            type: "folder",
                            children: [
                                { name: "secman.yml", type: "file" }
                            ]
                        },
                        { name: "mart.yml", type: "file" }
                    ]
                },
                { name: "pom.xml", type: "file" },
                { name: "settings.xml", type: "file" }
            ]
        };

        const fileContentsByPath = {
            "etl/ddl/create_tables.sql": `CREATE TABLE mart.orders (
  order_id BIGINT,
  customer_id BIGINT,
  created_at TIMESTAMP
);`,
            "etl/ddl/drop_tables.sql": `DROP TABLE IF EXISTS mart.orders;
DROP TABLE IF EXISTS mart.customers;`,
            "resources/ctl/ctl.yml": `pipeline:
  name: mart-flow
  retries: 2
  schedule: "0 2 * * *"`,
            "resources/devops/devops.json": `{
  "spark.executor.instances": 6,
  "spark.sql.shuffle.partitions": 200
}`,
            "pom.xml": `<project>
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.acme.data</groupId>
  <artifactId>mart-flow</artifactId>
</project>`,
            "settings.xml": `<settings>
  <mirrors>
    <mirror>
      <id>corp-nexus</id>
      <url>https://nexus.local/repository/maven-public/</url>
    </mirror>
  </mirrors>
</settings>`
        };

        const branchState = {
            branches: {
                main: {
                    structure: JSON.parse(JSON.stringify(baseFileStructure)),
                    contents: JSON.parse(JSON.stringify(fileContentsByPath))
                }
            },
            activeBranch: 'main',
            selectedPath: null,
            searchTerm: '',
            collapsedFolders: new Set(),
            sidebarCollapsed: false,
            isEditingFile: false,
            draggingFilePath: null,
            isOverviewMode: true
        };

        function getActiveBranchData() {
            return branchState.branches[branchState.activeBranch];
        }

        function getActiveStructure() {
            return getActiveBranchData().structure;
        }

        function getActiveContents() {
            return getActiveBranchData().contents;
        }

        function buildDefaultFileContent(path) {
            return `# ${path}

# Демо-содержимое файла
# (искусственные данные для просмотра структуры в стиле GitHub)`;
        }

        function renderBranchSelect() {
            const branchDropdown = document.getElementById('branchDropdown');
            const activeBranchLabel = document.getElementById('activeBranchLabel');
            if (!branchDropdown || !activeBranchLabel) return;

            const names = Object.keys(branchState.branches);
            activeBranchLabel.textContent = branchState.activeBranch;

            branchDropdown.innerHTML = names.map(name => {
                const deleteBtn = name === 'main'
                    ? ''
                    : `<button class="branch-delete-btn" data-delete-branch="${name}" title="Удалить ветку"><i class="fas fa-trash"></i></button>`;

                return `
                    <div class="branch-option ${name === branchState.activeBranch ? 'active' : ''}" data-branch-name="${name}">
                        <span>${name}</span>
                        ${deleteBtn}
                    </div>
                `;
            }).join('');

            branchDropdown.querySelectorAll('.branch-option').forEach(item => {
                item.addEventListener('click', function(e) {
                    if (e.target.closest('.branch-delete-btn')) return;
                    const name = this.dataset.branchName;
                    branchState.activeBranch = name;
                    branchState.selectedPath = null;
                    renderBranchSelect();
                    initFileTree({ keepOpenedFile: false });
                    branchDropdown.classList.remove('open');
                    showNotification(`Переключено на ветку: ${branchState.activeBranch}`);
                });
            });

            branchDropdown.querySelectorAll('.branch-delete-btn').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const branchName = this.dataset.deleteBranch;
                    deleteCurrentBranch(branchName);
                });
            });
        }

        function ensureFileContent(path) {
            const contents = getActiveContents();
            if (!contents[path]) {
                contents[path] = buildDefaultFileContent(path);
            }
            return contents[path];
        }

        function clearFilePreview() {
            const emptyState = document.getElementById('filePanelEmpty');
            const filePanelContent = document.getElementById('filePanelContent');
            const openedFilePath = document.getElementById('openedFilePath');
            const openedFileContent = document.getElementById('openedFileContent');
            emptyState.style.display = 'flex';
            filePanelContent.classList.remove('active');
            openedFilePath.textContent = '—';
            openedFileContent.textContent = '';
            setFileEditingMode(false);
        }

        function setFileEditingMode(editing) {
            const openedFileContent = document.getElementById('openedFileContent');
            const editBtn = document.getElementById('editFileBtn');
            if (!openedFileContent || !editBtn) return;

            branchState.isEditingFile = editing;
            openedFileContent.contentEditable = editing ? 'true' : 'false';
            openedFileContent.classList.toggle('editing', editing);

            const icon = editBtn.querySelector('i');
            if (icon) {
                icon.className = editing ? 'fas fa-check' : 'fas fa-pencil-alt';
            }
            editBtn.classList.toggle('active', editing);
        }

        function openFileInDirectoryView(path) {
            const structure = getActiveStructure();
            const emptyState = document.getElementById('filePanelEmpty');
            const filePanelContent = document.getElementById('filePanelContent');
            const openedFilePath = document.getElementById('openedFilePath');
            const openedFileContent = document.getElementById('openedFileContent');

            if (branchState.isEditingFile && branchState.selectedPath) {
                getActiveContents()[branchState.selectedPath] = openedFileContent.textContent;
            }

            branchState.selectedPath = path;
            openedFilePath.textContent = `${structure.name}/${path}`;
            openedFileContent.textContent = ensureFileContent(path);
            setFileEditingMode(false);

            emptyState.style.display = 'none';
            filePanelContent.classList.add('active');

            document.querySelectorAll('.tree-item.file').forEach(item => {
                item.classList.toggle('active', item.dataset.path === path);
            });
        }

        function findNodeByPath(rootNode, path) {
            if (!path) return null;
            const parts = path.split('/');
            let current = rootNode;

            for (const part of parts) {
                if (!current.children) return null;
                current = current.children.find(child => child.name === part);
                if (!current) return null;
            }

            return current;
        }

        function getFolderPathFromSelection() {
            if (!branchState.selectedPath) return '';
            const node = findNodeByPath(getActiveStructure(), branchState.selectedPath);
            if (!node) return '';
            if (node.type === 'folder') return branchState.selectedPath;

            const lastSlashIndex = branchState.selectedPath.lastIndexOf('/');
            return lastSlashIndex === -1 ? '' : branchState.selectedPath.slice(0, lastSlashIndex);
        }

        function addFileByPath(rootNode, path) {
            const parts = path.split('/').filter(Boolean);
            if (!parts.length) return false;

            const fileName = parts.pop();
            let current = rootNode;
            for (const part of parts) {
                let next = (current.children || []).find(child => child.name === part && child.type === 'folder');
                if (!next) {
                    next = { name: part, type: 'folder', children: [] };
                    current.children = current.children || [];
                    current.children.push(next);
                }
                current = next;
            }

            current.children = current.children || [];
            const exists = current.children.some(child => child.name === fileName);
            if (exists) return false;
            current.children.push({ name: fileName, type: 'file' });
            return true;
        }

        function removeNodeByPath(rootNode, path) {
            const parts = path.split('/').filter(Boolean);
            if (!parts.length) return false;
            const targetName = parts.pop();

            let parent = rootNode;
            for (const part of parts) {
                parent = (parent.children || []).find(child => child.name === part && child.type === 'folder');
                if (!parent) return false;
            }

            if (!parent.children) return false;
            const before = parent.children.length;
            parent.children = parent.children.filter(child => child.name !== targetName);
            return parent.children.length < before;
        }

        function relocateFileInStructure(sourcePath, targetFolderPath = '') {
            if (!sourcePath) return { ok: false, message: 'Файл для переноса не выбран' };

            const root = getActiveStructure();
            const sourceNode = findNodeByPath(root, sourcePath);
            if (!sourceNode || sourceNode.type !== 'file') {
                return { ok: false, message: 'Можно переносить только файлы' };
            }

            const sourceName = sourcePath.split('/').pop();
            const sourceParentPath = sourcePath.includes('/') ? sourcePath.substring(0, sourcePath.lastIndexOf('/')) : '';
            if (sourceParentPath === targetFolderPath) {
                return { ok: false, message: 'Файл уже находится в этой директории' };
            }

            const targetFolder = targetFolderPath ? findNodeByPath(root, targetFolderPath) : root;
            if (!targetFolder || targetFolder.type !== 'folder') {
                return { ok: false, message: 'Целевая директория не найдена' };
            }

            targetFolder.children = targetFolder.children || [];
            if (targetFolder.children.some(child => child.name === sourceName)) {
                return { ok: false, message: `Файл ${sourceName} уже существует в целевой директории` };
            }

            const removed = removeNodeByPath(root, sourcePath);
            if (!removed) {
                return { ok: false, message: 'Не удалось переместить файл' };
            }

            targetFolder.children.push({ name: sourceName, type: 'file' });

            const newPath = targetFolderPath ? `${targetFolderPath}/${sourceName}` : sourceName;
            const contents = getActiveContents();
            contents[newPath] = contents[sourcePath] || buildDefaultFileContent(newPath);
            if (newPath !== sourcePath) delete contents[sourcePath];

            branchState.selectedPath = newPath;
            return { ok: true, newPath };
        }

        function collectFolderPaths(rootNode) {
            const paths = [];
            function walk(node, currentPath = '', isRoot = false) {
                const nodePath = isRoot ? '' : (currentPath ? `${currentPath}/${node.name}` : node.name);
                if (!isRoot && node.type === 'folder') {
                    paths.push(nodePath);
                }
                (node.children || []).forEach(child => walk(child, nodePath, false));
            }
            walk(rootNode, '', true);
            return paths;
        }

        function toggleFolder(path) {
            if (!path) return;
            if (branchState.collapsedFolders.has(path)) {
                branchState.collapsedFolders.delete(path);
            } else {
                branchState.collapsedFolders.add(path);
            }
            initFileTree({ keepOpenedFile: true });
        }

        function setDirectorySidebarCollapsed(collapsed) {
            const sidebar = document.getElementById('directorySidebar');
            const icon = document.getElementById('directorySidebarToggleIcon');
            if (!sidebar || !icon) return;

            branchState.sidebarCollapsed = collapsed;
            sidebar.classList.toggle('collapsed', collapsed);
            icon.classList.toggle('fa-chevron-left', !collapsed);
            icon.classList.toggle('fa-chevron-right', collapsed);
        }

        function setDirectoryOverviewMode(enabled) {
            const content = document.getElementById('directoryContent');
            if (!content) return;

            branchState.isOverviewMode = enabled;
            content.classList.toggle('overview-mode', enabled);

            if (enabled) {
                clearFilePreview();
                branchState.selectedPath = null;
            } else {
                setDirectorySidebarCollapsed(false);
            }
        }

        function setupDirectoryResizer() {
            const content = document.getElementById('directoryContent');
            const sidebar = document.getElementById('directorySidebar');
            const divider = document.getElementById('directoryDivider');
            if (!content || !sidebar || !divider) return;

            let dragging = false;

            divider.addEventListener('mousedown', function() {
                if (branchState.sidebarCollapsed) return;
                dragging = true;
                document.body.style.cursor = 'col-resize';
                document.body.style.userSelect = 'none';
            });

            document.addEventListener('mousemove', function(e) {
                if (!dragging) return;
                const rect = content.getBoundingClientRect();
                const raw = ((e.clientX - rect.left) / rect.width) * 100;
                const clamped = Math.max(20, Math.min(70, raw));
                content.style.setProperty('--sidebar-width', `${clamped}%`);
            });

            document.addEventListener('mouseup', function() {
                if (!dragging) return;
                dragging = false;
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            });
        }

        function searchInProject(term) {
            branchState.searchTerm = (term || '').trim().toLowerCase();
            const list = document.querySelectorAll('.tree-item.file');

            if (!branchState.searchTerm) {
                list.forEach(item => item.classList.remove('matched'));
                return;
            }

            const contents = getActiveContents();
            list.forEach(item => {
                const path = item.dataset.path || '';
                const fileName = path.split('/').pop().toLowerCase();
                const text = (contents[path] || '').toLowerCase();
                const matched = fileName.includes(branchState.searchTerm) || text.includes(branchState.searchTerm);
                item.classList.toggle('matched', matched);
            });
        }

        function initFileTree(options = {}) {
            const { keepOpenedFile = true } = options;
            const fileTree = document.getElementById('fileTree');
            const structure = getActiveStructure();
            fileTree.innerHTML = generateTreeHTML(structure);

            const clearDropTargets = () => {
                fileTree.querySelectorAll('.drop-target').forEach(el => el.classList.remove('drop-target'));
            };

            fileTree.querySelectorAll('.tree-item.folder').forEach(item => {
                item.addEventListener('click', function() {
                    if (branchState.draggingFilePath) return;
                    if (branchState.isOverviewMode) {
                        setDirectoryOverviewMode(false);
                    }
                    const folderPath = this.dataset.path;
                    toggleFolder(folderPath);
                });

                item.addEventListener('dragover', function(e) {
                    if (!branchState.draggingFilePath) return;
                    e.preventDefault();
                    this.classList.add('drop-target');
                });

                item.addEventListener('dragleave', function() {
                    this.classList.remove('drop-target');
                });

                item.addEventListener('drop', function(e) {
                    e.preventDefault();
                    const sourcePath = branchState.draggingFilePath;
                    const targetFolderPath = this.dataset.path || '';
                    const result = relocateFileInStructure(sourcePath, targetFolderPath);
                    clearDropTargets();
                    if (!result.ok) {
                        showNotification(result.message);
                        return;
                    }
                    initFileTree();
                    showNotification(`Файл перемещён: ${result.newPath}`);
                });
            });

            fileTree.querySelectorAll('.tree-item.file').forEach(item => {
                item.draggable = true;

                item.addEventListener('click', function() {
                    if (branchState.isOverviewMode) {
                        setDirectoryOverviewMode(false);
                    }
                    const filePath = this.dataset.path;
                    openFileInDirectoryView(filePath);
                    showNotification(`Открыт файл: ${filePath}`);
                });

                item.addEventListener('dragstart', function(e) {
                    branchState.draggingFilePath = this.dataset.path;
                    this.classList.add('dragging');
                    if (e.dataTransfer) {
                        e.dataTransfer.effectAllowed = 'move';
                        e.dataTransfer.setData('text/plain', this.dataset.path || '');
                    }
                });

                item.addEventListener('dragend', function() {
                    branchState.draggingFilePath = null;
                    this.classList.remove('dragging');
                    clearDropTargets();
                });

                item.addEventListener('dragover', function(e) {
                    if (!branchState.draggingFilePath) return;
                    e.preventDefault();
                    this.classList.add('drop-target');
                });

                item.addEventListener('dragleave', function() {
                    this.classList.remove('drop-target');
                });

                item.addEventListener('drop', function(e) {
                    e.preventDefault();
                    const targetFilePath = this.dataset.path || '';
                    const targetFolderPath = targetFilePath.includes('/') ? targetFilePath.substring(0, targetFilePath.lastIndexOf('/')) : '';
                    const result = relocateFileInStructure(branchState.draggingFilePath, targetFolderPath);
                    clearDropTargets();
                    if (!result.ok) {
                        showNotification(result.message);
                        return;
                    }
                    initFileTree();
                    showNotification(`Файл перемещён: ${result.newPath}`);
                });
            });

            const repoHeader = fileTree.querySelector('.tree-repo');
            if (repoHeader) {
                repoHeader.addEventListener('dragover', function(e) {
                    if (!branchState.draggingFilePath) return;
                    e.preventDefault();
                    this.classList.add('drop-target');
                });

                repoHeader.addEventListener('dragleave', function() {
                    this.classList.remove('drop-target');
                });

                repoHeader.addEventListener('drop', function(e) {
                    e.preventDefault();
                    const result = relocateFileInStructure(branchState.draggingFilePath, '');
                    clearDropTargets();
                    if (!result.ok) {
                        showNotification(result.message);
                        return;
                    }
                    initFileTree();
                    showNotification(`Файл перемещён: ${result.newPath}`);
                });
            }

            if (keepOpenedFile && branchState.selectedPath && findNodeByPath(structure, branchState.selectedPath)) {
                openFileInDirectoryView(branchState.selectedPath);
            } else {
                branchState.selectedPath = null;
                clearFilePreview();
            }

            searchInProject(branchState.searchTerm);
        }

        function generateTreeHTML(rootNode) {
            const rows = [];

            function walk(node, level = 0, isRoot = false, currentPath = '') {
                const nodePath = isRoot ? '' : (currentPath ? `${currentPath}/${node.name}` : node.name);
                rows.push({ name: node.name, type: node.type, path: nodePath, level });

                if (!node.children || node.children.length === 0) return;
                if (!isRoot && node.type === 'folder' && branchState.collapsedFolders.has(nodePath)) return;

                node.children.forEach(child => {
                    walk(child, level + 1, false, nodePath);
                });
            }

            walk(rootNode, 0, true, '');

            const repoHeader = `<div class="tree-repo"><i class="fab fa-github"></i> ${rootNode.repo} · branch: ${branchState.activeBranch}</div>`;
            const treeRows = rows.map(({ name, type, path, level }) => {
                const isCollapsedFolder = type === 'folder' && path && branchState.collapsedFolders.has(path);
                const expander = type === 'folder'
                    ? `<span class="folder-expander"><i class="fas ${isCollapsedFolder ? 'fa-chevron-right' : 'fa-chevron-down'}"></i></span>`
                    : '<span class="folder-expander"></span>';
                const indent = Math.max(0, level - 1) * 18;
                return `
                <div class="tree-item ${type}" ${!path ? '' : `data-path="${path}"`} style="padding-left: ${indent}px;">
                    ${expander}
                    <div class="tree-icon ${type}">
                        <i class="fas ${type === 'folder' ? 'fa-folder' : 'fa-file'}"></i>
                    </div>
                    <div class="tree-name">${name}</div>
                </div>
            `;
            }).join('');

            return repoHeader + treeRows;
        }

        function createBranch() {
            const branchName = prompt('Введите название новой ветки:', 'feature/new-mart');
            if (!branchName) return;
            if (branchState.branches[branchName]) {
                showNotification('Ветка с таким именем уже существует');
                return;
            }

            const current = getActiveBranchData();
            branchState.branches[branchName] = {
                structure: JSON.parse(JSON.stringify(current.structure)),
                contents: JSON.parse(JSON.stringify(current.contents))
            };
            branchState.activeBranch = branchName;
            branchState.selectedPath = null;
            renderBranchSelect();
            initFileTree({ keepOpenedFile: false });
            showNotification(`Ветка создана: ${branchName}`);
        }

        function deleteCurrentBranch(branchName = branchState.activeBranch) {
            if (branchName === 'main') {
                showNotification('Нельзя удалить ветку main');
                return;
            }

            const confirmDelete = confirm(`Удалить ветку ${branchName}?`);
            if (!confirmDelete) return;

            delete branchState.branches[branchName];
            if (branchState.activeBranch === branchName) {
                branchState.activeBranch = 'main';
                branchState.selectedPath = null;
                initFileTree({ keepOpenedFile: false });
            }
            renderBranchSelect();
            showNotification(`Ветка удалена: ${branchName}`);
        }

        function createFileInProject() {
            const folderPath = getFolderPathFromSelection();
            const filePath = prompt('Введите путь нового файла (например etl/workflows/new_flow.sql):', folderPath ? `${folderPath}/new_file.sql` : 'new_file.sql');
            if (!filePath) return;

            const cleanedPath = filePath.trim().replace(/^\/+/, '');
            if (!cleanedPath) return;

            const created = addFileByPath(getActiveStructure(), cleanedPath);
            if (!created) {
                showNotification('Файл с таким именем уже существует');
                return;
            }

            getActiveContents()[cleanedPath] = buildDefaultFileContent(cleanedPath);
            branchState.selectedPath = cleanedPath;
            initFileTree();
            showNotification(`Файл создан: ${cleanedPath}`);
        }

        function editCurrentFile() {
            if (!branchState.selectedPath) {
                showNotification('Сначала выберите файл в дереве');
                return;
            }

            const openedFileContent = document.getElementById('openedFileContent');
            if (!openedFileContent) return;

            if (!branchState.isEditingFile) {
                setFileEditingMode(true);
                openedFileContent.focus();
                showNotification(`Режим редактирования: ${branchState.selectedPath}`);
                return;
            }

            getActiveContents()[branchState.selectedPath] = openedFileContent.textContent;
            setFileEditingMode(false);
            showNotification(`Файл обновлён: ${branchState.selectedPath}`);
        }

        function deleteCurrentFile() {
            if (!branchState.selectedPath) {
                showNotification('Сначала выберите файл в дереве');
                return;
            }

            const path = branchState.selectedPath;
            const confirmDelete = confirm(`Удалить файл ${path}?`);
            if (!confirmDelete) return;

            const removed = removeNodeByPath(getActiveStructure(), path);
            if (!removed) {
                showNotification('Не удалось удалить файл');
                return;
            }

            delete getActiveContents()[path];
            branchState.selectedPath = null;
            setFileEditingMode(false);
            initFileTree({ keepOpenedFile: false });
            showNotification(`Файл удалён: ${path}`);
        }

        // Функции для управления представлениями
        function switchView(view) {
            currentView = view;

            document.querySelectorAll('.view-item').forEach(item => {
                item.classList.remove('active');
            });

            directoryView.classList.remove('active');
            sqlEditorView.classList.remove('active');
            designerView.classList.remove('active');
            if (graphView) graphView.classList.remove('active');

            const isDesignerView = view === 'designer';
            if (!isDesignerView) {
                propertiesPanel.classList.remove('active');
            }

            if (view === 'directory') {
                directoryViewBtn.classList.add('active');
                directoryView.classList.add('active');
                branchState.collapsedFolders = new Set();
                setDirectoryOverviewMode(true);
                initFileTree({ keepOpenedFile: false });
                showNotification('Переключено на представление структуры директорий');
            } else if (view === 'sql') {
                sqlViewBtn.classList.add('active');
                sqlEditorView.classList.add('active');
                showNotification('Переключено на представление SQL редактора');
            } else if (view === 'designer') {
                designerViewBtn.classList.add('active');
                designerView.classList.add('active');
                showNotification('Переключено на представление конструктора');
            } else if (view === 'graph') {
                graphViewBtn.classList.add('active');
                if (graphView) graphView.classList.add('active');
                graphSelectedNodeId = null;
                // Preserve existing drag positions but allow layout for new streams
                renderGraphView();
                showNotification('Переключено на граф потоков');
            }
        }

        // Переключение между вкладками Ribbon
        ribbonTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const ribbonId = this.dataset.ribbon;

                ribbonTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                document.querySelectorAll('.ribbon').forEach(r => r.classList.remove('active'));
                document.getElementById(`ribbon${ribbonId.charAt(0).toUpperCase() + ribbonId.slice(1)}`).classList.add('active');
                updatePropertiesPanelOffset();
            });
        });

        // ── Ribbon view mode: Широкий / Компактный ──────────────────────────────
        let ribbonCompactMode = false;
        let activeDropdownTrigger = null;
        let activeDropdownEl = null;
        let dropdownCloseTimer = null;

        function closeRibbonDropdown() {
            clearTimeout(dropdownCloseTimer);
            if (activeDropdownTrigger) activeDropdownTrigger.classList.remove('trigger-open');
            if (activeDropdownEl) activeDropdownEl.remove();
            activeDropdownTrigger = null;
            activeDropdownEl = null;
        }

        function scheduleCloseDropdown() {
            dropdownCloseTimer = setTimeout(closeRibbonDropdown, 180);
        }

        function openRibbonDropdown(triggerEl, section) {
            clearTimeout(dropdownCloseTimer);
            if (activeDropdownEl) closeRibbonDropdown();

            triggerEl.classList.add('trigger-open');
            activeDropdownTrigger = triggerEl;

            const itemsEl = section.querySelector('.ribbon-items');
            if (!itemsEl) return;

            const dropdown = document.createElement('div');
            dropdown.className = 'ribbon-compact-dropdown';

            // Клонируем все ribbon-item из секции в вертикальный список
            Array.from(itemsEl.querySelectorAll('.ribbon-item')).forEach(origItem => {
                const clone = origItem.cloneNode(true);
                dropdown.appendChild(clone);

                // mousedown нужен только для перетаскиваемых (не button) элементов
                if (!origItem.classList.contains('button')) {
                    clone.addEventListener('mousedown', function(e) {
                        closeRibbonDropdown();
                        origItem.dispatchEvent(new MouseEvent('mousedown', {
                            bubbles: true, cancelable: true,
                            clientX: e.clientX, clientY: e.clientY
                        }));
                    });
                }
                // click → нажатие на оригинале
                clone.addEventListener('click', function() {
                    closeRibbonDropdown();
                    origItem.click();
                });
            });

            const rect = triggerEl.getBoundingClientRect();
            dropdown.style.top  = (rect.bottom + 4) + 'px';
            dropdown.style.left = rect.left + 'px';
            document.body.appendChild(dropdown);
            activeDropdownEl = dropdown;

            // Удерживаем dropdown открытым при наведении на него
            dropdown.addEventListener('mouseenter', () => clearTimeout(dropdownCloseTimer));
            dropdown.addEventListener('mouseleave', scheduleCloseDropdown);
        }

        function buildCompactTriggers() {
            document.querySelectorAll('.ribbon-section').forEach(section => {
                const items = section.querySelectorAll('.ribbon-items .ribbon-item');
                if (items.length < 3) return; // < 3 items: показываем как есть
                const title = section.querySelector('.ribbon-title');
                if (title && title.textContent.includes('Выбор движка')) return; // не схлопываем

                section.classList.add('has-compact-trigger');

                const titleText = section.querySelector('.ribbon-title')?.textContent.trim() || '…';

                const trigger = document.createElement('div');
                trigger.className = 'ribbon-group-trigger';
                trigger.innerHTML = `
                    <i class="fas fa-layer-group ribbon-trigger-icon"></i>
                    <span class="ribbon-trigger-label" title="${titleText}">${titleText}</span>
                    <i class="fas fa-caret-down ribbon-trigger-arrow"></i>`;

                // Hover-механика: hover открывает dropdown
                trigger.addEventListener('mouseenter', () => openRibbonDropdown(trigger, section));
                trigger.addEventListener('mouseleave', scheduleCloseDropdown);

                section.appendChild(trigger);
            });
        }

        function removeCompactTriggers() {
            document.querySelectorAll('.ribbon-section.has-compact-trigger').forEach(section => {
                section.classList.remove('has-compact-trigger');
                section.querySelector('.ribbon-group-trigger')?.remove();
            });
        }

        function setRibbonCompactMode(compact) {
            ribbonCompactMode = compact;
            closeRibbonDropdown();

            document.querySelectorAll('.ribbon').forEach(r => r.classList.toggle('compact-mode', compact));

            if (compact) {
                buildCompactTriggers();
            } else {
                removeCompactTriggers();
            }

            const checkbox = document.getElementById('ribbonViewCheckbox');
            if (checkbox) checkbox.checked = compact;
        }

        document.addEventListener('change', function(e) {
            if (e.target && e.target.id === 'ribbonViewCheckbox') {
                setRibbonCompactMode(e.target.checked);
            }
        });

        // Fallback: закрыть dropdown при клике вне trigger и dropdown
        document.addEventListener('click', function(e) {
            if (!activeDropdownEl) return;
            if (!e.target.closest('.ribbon-compact-dropdown') && !e.target.closest('.ribbon-group-trigger')) {
                closeRibbonDropdown();
            }
        });

        window.addEventListener('resize', updatePropertiesPanelOffset);

        function initializeDesignerRibbon() {
            document.querySelectorAll('.ribbon-item').forEach(item => {
                item.addEventListener('click', function() {
                    if (this.classList.contains('disabled')) return;

                    const { type, subtype } = this.dataset;
                    if (type === 'engine') {
                        handleEngineSelection(subtype);
                        return;
                    }

                    if (type === 'recovery' && subtype === 'checkpoint') {
                        handleCheckpointSelection();
                    }

                    if (type === 'ddl') {
                        openDdlModal(subtype);
                        return;
                    }

                    if (type === 'share' && subtype === 'deploy') {
                        openDeployModal();
                    }
                });
            });

            updateRibbonAvailability();
        }

        function handleEngineSelection(engine) {
            designerState.engine = designerState.engine === engine ? null : engine;

            if (designerState.engine) {
                activeSidebarModule = designerState.engine === 'spark' ? 'engine-spark' : 'engine-flink';
                selectedElements = [];
                selectedElement = null;
                document.querySelectorAll('.canvas-element').forEach(el => {
                    el.classList.remove('selected', 'is-selected');
                });
                propertiesPanel.classList.add('active');
                updatePropertiesPanelOffset();
                updatePropertiesPanel();
                captureSnapshot();
                showNotification(`Выбран ${designerState.engine === 'spark' ? 'Spark' : 'Flink'} engine`);
            } else {
                if (activeSidebarModule === 'engine-spark' || activeSidebarModule === 'engine-flink') {
                    activeSidebarModule = null;
                    propertiesPanel.classList.remove('active');
                }
                showNotification('Выбор engine сброшен');
            }

            updateRibbonAvailability();
        }

        function handleCheckpointSelection() {
            const isCurrentlyOpen = activeSidebarModule === 'checkpoint';

            if (isCurrentlyOpen) {
                closeSidebarWithCheck();
            } else {
                activeSidebarModule = 'checkpoint';
                designerState.checkpointActive = true;
                closeSqlEditorModal(true);
                selectedElements = [];
                selectedElement = null;
                document.querySelectorAll('.canvas-element').forEach(el => {
                    el.classList.remove('selected', 'is-selected');
                });
                propertiesPanel.classList.add('active');
                updatePropertiesPanelOffset();
                updatePropertiesPanel();
                captureSnapshot();
            }

            updateRibbonAvailability();
        }

        let deploySettings = {
            mode: 'par',
            version: 'v1.0',
            account: 'ivanov_ii',
            flows: null,
            scenario: 'dev'
        };

        const DEPLOY_SCENARIO_MAP = {
            dev: ['dev'],
            iftPsi: ['ift', 'psi'],
            rdtUat: ['rdt']
        };

        function deployVal(id, fallback) {
            const el = document.getElementById(id);
            return (el && el.value && el.value.trim()) || fallback;
        }

        function deploySetMode(mode) {
            deploySettings.mode = mode === 'std' ? 'std' : 'par';
            if (deployModeStd) deployModeStd.classList.toggle('active', deploySettings.mode === 'std');
            if (deployModePar) deployModePar.classList.toggle('active', deploySettings.mode === 'par');
            const extras = document.querySelectorAll('.deploy-mode-extra');
            extras.forEach(el => el.classList.toggle('is-disabled', deploySettings.mode !== 'par'));
            if (deployVersionInput) deployVersionInput.disabled = deploySettings.mode !== 'par';
            if (deployAccountInput) deployAccountInput.disabled = deploySettings.mode !== 'par';
            renderDeployFlowSummary();
            deployUpdatePath();
        }

        function getDeployFlowOptions() {
            if (!Array.isArray(pages) || pages.length === 0) {
                return [{ id: 'batch', name: 'Batch поток' }, { id: 'nrt', name: 'NRT поток' }];
            }
            return pages.map((page, idx) => ({
                id: page.id || `flow-${idx + 1}`,
                name: page.name || `Поток ${idx + 1}`
            }));
        }

        function renderDeployFlowPicker() {
            if (!deployFlowList) return;
            const flows = getDeployFlowOptions();
            if (!Array.isArray(deploySettings.flows)) {
                deploySettings.flows = flows.map(flow => flow.id);
            } else {
                deploySettings.flows = deploySettings.flows.filter(id => flows.some(flow => flow.id === id));
            }
            const selected = new Set(deploySettings.flows);
            deployFlowList.innerHTML = flows.map(flow => `
                <label class="deploy-flow-chip">
                    <input type="checkbox" value="${flow.id}" ${selected.has(flow.id) ? 'checked' : ''}>
                    <span>${flow.name}</span>
                </label>
            `).join('');

            deployFlowList.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                cb.addEventListener('change', function() {
                    const ids = Array.from(deployFlowList.querySelectorAll('input[type="checkbox"]:checked')).map(x => x.value);
                    deploySettings.flows = ids;
                    renderDeployFlowSummary();
                });
            });
            if (deployFlowToggleAll) {
                const allSelected = flows.length > 0 && flows.every(flow => selected.has(flow.id));
                const hasAny = flows.some(flow => selected.has(flow.id));
                deployFlowToggleAll.checked = allSelected;
                deployFlowToggleAll.indeterminate = hasAny && !allSelected;
            }
            renderDeployFlowSummary();
        }

        function renderDeployFlowSummary() {
            if (!deployFlowSummary) return;
            const flowOptions = getDeployFlowOptions();
            const selected = flowOptions.filter(f => (deploySettings.flows || []).includes(f.id));
            if (!selected.length) {
                deployFlowSummary.textContent = 'Потоки не выбраны — деплой не запустится ни для одного потока.';
                return;
            }
            deployFlowSummary.textContent = `Выбрано потоков: ${selected.length} (${selected.map(s => s.name).join(', ')})`;
        }

        function getDeployPassportSnapshot() {
            const activeDatamart = datamarts && currentDatamartId ? datamarts[currentDatamartId] : null;
            if (activeDatamart && activeDatamart.passport) {
                const p = activeDatamart.passport;
                return {
                    lineup: p.lineup || pmCurrentLineup,
                    clusters: Array.isArray(p.clusters) ? p.clusters : []
                };
            }
            return {
                lineup: pmCurrentLineup,
                clusters: Object.keys(pmChecked || {}).map(id => pmClusterName(id))
            };
        }

        function renderDeployScenarioClusters() {
            if (!deployScenarioClusters) return;
            const scenarioKey = DEPLOY_SCENARIO_MAP[deploySettings.scenario] ? deploySettings.scenario : 'dev';
            const contours = DEPLOY_SCENARIO_MAP[scenarioKey];
            const snapshot = getDeployPassportSnapshot();
            const lineup = PM_LINEUPS[snapshot.lineup] || {};
            const selected = new Set(snapshot.clusters || []);

            const groups = contours.map(contour => {
                const contourClusters = (lineup[contour] || []).filter(clusterName => selected.has(clusterName));
                return { contour, clusters: contourClusters };
            });

            const hasAny = groups.some(group => group.clusters.length);
            if (!hasAny) {
                deployScenarioClusters.innerHTML = '<span style="color:#8895a9">Для выбранного сценария нет отмеченных кластеров в паспорте витрины.</span>';
                return;
            }

            deployScenarioClusters.innerHTML = groups.map(group => `
                <div class="deploy-scenario-cluster-group">
                    <b>${PM_ENV_LABELS[group.contour] || group.contour.toUpperCase()}:</b>
                    ${group.clusters.length ? group.clusters.map(name => `<span class="deploy-scenario-chip" style="margin-left:6px">${escHtml(name)}</span>`).join('') : '<span style="margin-left:6px;color:#98a4b7">кластеры не выбраны</span>'}
                </div>
            `).join('');
        }

        function setDeployScenario(scenarioKey) {
            deploySettings.scenario = DEPLOY_SCENARIO_MAP[scenarioKey] ? scenarioKey : 'dev';
            deployScenarioButtons.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.deployScenario === deploySettings.scenario);
            });
            renderDeployScenarioClusters();
        }

        function deployUpdatePath() {
            const block  = deployVal('pm_dv_block', '{block}');
            const group  = deployVal('pm_dv_datamart_group', '{datamart_group}');
            const name   = deployVal('pm_dv_datamart_name', '{datamart_name}');
            const version = (deployVersionInput?.value || '').trim() || '{version}';
            const account = (deployAccountInput?.value || '').trim() || '{account}';
            const sep = s => `<span class="hdfs-seg-sep">${s}</span>`;
            const fix = s => `<span class="hdfs-seg-fixed">${s}</span>`;
            const par = s => `<span class="hdfs-seg-param">${s}</span>`;
            let path = fix('hdfs:///oozie-app') + sep('/') + par(block) + sep('/') + par(group) + sep('/') + par(name);
            if (deploySettings.mode === 'par') {
                path += sep('/') + par(version) + sep('/') + par(account);
            }
            const el = document.getElementById('deployHdfsPath');
            if (el) el.innerHTML = path;
        }

        function openDeployModal() {
            if (deployVersionInput) deployVersionInput.value = deploySettings.version;
            if (deployAccountInput) deployAccountInput.value = deploySettings.account;
            deploySettings.flows = getDeployFlowOptions().map(flow => flow.id);
            renderDeployFlowPicker();
            deploySetMode(deploySettings.mode);
            setDeployScenario(deploySettings.scenario);
            deployModal?.classList.add('active');
        }

        function closeDeployModal() {
            deployModal?.classList.remove('active');
        }

        function closeDeployResultModal() {
            deployResultModal?.classList.remove('active');
        }

        function updateRibbonAvailability() {
            const hasEngine = Boolean(designerState.engine);
            const unlockAllRibbonItems = hasEngine;
            const hasSavedDdl = hasCurrentDatamartDdlCode();
            const sparkReadyForFlow = designerState.engine === 'spark' && hasSavedDdl && !isDdlModalCurrentlyOpen();

            document.querySelectorAll('.ribbon-item').forEach(item => {
                const { type, subtype } = item.dataset;

                let shouldEnable = false;
                if (type === 'engine') {
                    shouldEnable = true;
                } else if (type === 'ddl' && subtype === 'script') {
                    shouldEnable = designerState.engine === 'spark';
                } else if (type === 'ddl' && (subtype === 'source' || subtype === 'sync')) {
                    shouldEnable = designerState.engine === 'flink';
                } else if (designerState.engine === 'flink' && type === 'data' && subtype === 'kafka2hdfs') {
                    shouldEnable = false;
                } else if (type === 'share' && subtype === 'deploy') {
                    shouldEnable = true;
                } else {
                    shouldEnable = designerState.engine === 'spark' ? sparkReadyForFlow : unlockAllRibbonItems;
                }

                item.classList.toggle('disabled', !shouldEnable);

                if (type === 'engine') {
                    item.classList.toggle('active', subtype === designerState.engine);
                } else if (type === 'recovery' && subtype === 'checkpoint') {
                    item.classList.toggle('active', activeSidebarModule === 'checkpoint');
                } else if (type === 'ddl' || (type === 'share' && subtype === 'deploy')) {
                    item.classList.remove('active');
                }
            });
            updateDdlGating();
        }

        function hasCurrentDatamartDdlCode() {
            if (!currentDatamartId) return false;
            const scripts = getDdlScriptBucket(currentDatamartId);
            return String(scripts.script || '').trim().length > 0;
        }

        function isDdlModalCurrentlyOpen() {
            return document.getElementById('ddlModal')?.classList.contains('active');
        }

        function switchAppPage(pageId) {
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            document.getElementById(pageId).classList.add('active');
        }

        const monitoringColumns = [
            { key: 'datamart', label: 'Витрина данных', width: 190 },
            { key: 'deployId', label: 'Deploy_id', width: 120 },
            { key: 'createdDate', label: 'Дата создания', width: 130 },
            { key: 'createdTime', label: 'Время создания', width: 115 },
            { key: 'deployDate', label: 'Дата деплоя витрины', width: 150 },
            { key: 'deployTime', label: 'Время деплоя витрины', width: 150 },
            { key: 'flowName', label: 'Название потока', width: 220 },
            { key: 'sourceEnv', label: 'Откуда', width: 100 },
            { key: 'targetEnv', label: 'Куда', width: 130 },
            { key: 'cluster', label: 'Кластер', width: 140 },
            { key: 'datamartStatus', label: 'Статус витрины', width: 145 },
            { key: 'flowStatus', label: 'Статус потока', width: 140 },
            { key: 'deployType', label: 'Тип Деплоя', width: 150 },
            { key: 'checks', label: 'Проверки', width: 280 },
            { key: 'comment', label: 'Комментарий', width: 260 }
        ];
        const monitoringRows = buildMonitoringDeployRows(100);
        const monitoringFilters = {};
        let highlightedMonitoringColumn = null;
        let activeMonitoringFilterKey = null;
        let activeMonitoringFilterAnchor = null;
        let selectedMonitoringCell = null;
        let monitoringCurrentPage = 1;
        let monitoringPageSize = 20;

        function renderMonitoringTable() {
            if (!monitoringHeaderRow || !monitoringTableBody || !monitoringColgroup) return;

            initializeMonitoringFilters();
            monitoringColgroup.innerHTML = monitoringColumns
                .map(col => `<col data-col-key="${col.key}" style="width:${col.width}px">`)
                .join('');

            monitoringHeaderRow.innerHTML = monitoringColumns.map((col, index) => `
                <th data-col-key="${col.key}" data-col-index="${index}">
                    ${col.label}
                    <span class="filter-triangle" data-filter-key="${col.key}" title="Фильтр"></span>
                    <span class="resize-handle" data-col-index="${index}"></span>
                </th>
            `).join('');

            bindMonitoringHeaderActions();
            updateFilterTrianglesState();
            renderMonitoringRows();
        }

        function buildMonitoringDeployRows(deployCount) {
            const datamarts = [
                { name: 'Модель продаж', flows: ['sales_fact_sync', 'sales_margin_refresh', 'sales_kpi_rollup'] },
                { name: 'Анализ клиентов', flows: ['customer_delta_load', 'customer_score_recalc', 'customer_segment_publish'] },
                { name: 'Финансовые отчеты', flows: ['finance_balance_stage', 'finance_pl_aggregate', 'finance_cashflow_daily'] },
                { name: 'Операционный контур', flows: ['ops_incident_merge', 'ops_sla_heartbeat', 'ops_capacity_forecast'] },
                { name: 'Кампанейская аналитика', flows: ['campaign_kpi_rollup', 'campaign_roi_calc', 'campaign_audience_sync'] },
                { name: 'Логистика', flows: ['log_route_fact', 'log_eta_prediction', 'log_stock_daily'] }
            ];
            const clusters = ['cluster-a', 'cluster-b', 'cluster-c', 'cluster-dr'];
            const deployTypes = ['Full', 'Incremental'];
            const sourceEnvs = ['DEV', 'DLPRO'];
            const targetEnvs = ['PSI', 'IFT', 'RDT/UAT', 'PROM'];
            const comments = [
                'Регулярный ночной деплой',
                'Ручной запуск после smoke test',
                'Патч под задачу DEVOPS-714',
                'Переезд части потоков на новый кластер'
            ];
            const rows = [];
            const datamartFlowStatuses = {};

            for (let i = 1; i <= deployCount; i++) {
                const datamart = datamarts[(i - 1) % datamarts.length];
                const deployId = `DPL-${(20000 + i).toString()}`;
                const datamartDeployKey = `${datamart.name}::${deployId}`;
                const flowCount = i % 5 === 0 ? 3 : i % 3 === 0 ? 2 : 1;
                const clusterCount = i % 4 === 0 ? 3 : i % 2 === 0 ? 2 : 1;
                const deployClusters = Array.from({ length: clusterCount }, (_, idx) => clusters[(i + idx) % clusters.length]);
                const createdAt = new Date(Date.now() - i * 41 * 60 * 1000);
                const createdDate = createdAt.toLocaleDateString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
                const createdTime = createdAt.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
                const deployAt = new Date(createdAt.getTime() + (i % 7 + 1) * 26 * 60 * 1000);
                const deployDate = deployAt.toLocaleDateString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
                const deployTime = deployAt.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
                const sourceEnv = sourceEnvs[(i) % sourceEnvs.length];
                const targetEnv = targetEnvs[(i) % targetEnvs.length];
                const deployComment = comments[i % comments.length];

                for (let f = 0; f < flowCount; f++) {
                    const flowName = datamart.flows[(i + f) % datamart.flows.length];
                    const checksTemplate = buildAccessChecks(i, f, 0);
                    const flowStatus = checksTemplate.every(check => check.ok) ? 'Успешно' : 'Ошибка';
                    datamartFlowStatuses[datamartDeployKey] = datamartFlowStatuses[datamartDeployKey] || [];
                    datamartFlowStatuses[datamartDeployKey].push(flowStatus);

                    deployClusters.forEach((cluster, c) => {
                        const checks = checksTemplate.map(check => ({ ...check }));
                        rows.push({
                            datamart: datamart.name,
                            datamartDeployKey,
                            deployId,
                            createdDate,
                            createdTime,
                            deployDate,
                            deployTime,
                            flowName,
                            sourceEnv,
                            targetEnv,
                            cluster,
                            checks,
                            checksFailed: checks.some(check => !check.ok),
                            flowStatus,
                            deployType: deployTypes[(i + c) % deployTypes.length],
                            comment: deployComment
                        });
                    });
                }
            }

            rows.forEach(row => {
                const flowStatuses = datamartFlowStatuses[row.datamartDeployKey] || [];
                row.datamartStatus = flowStatuses.every(status => status === 'Успешно') ? 'Успешно' : 'Ошибка';
            });
            return rows;
        }

        function buildAccessChecks(i, f, c) {
            const checkNames = [
                'Проверка РРМ у ТУЗа',
                'Проверка SberCA движков',
                'Проверка наличия DPM приложения',
                'Проверка наличия DPM сервиса',
                'Проверка наличия доступов у ТУЗа на очередь в Yarn'
            ];
            return checkNames.map((name, idx) => ({
                name,
                ok: ((i + f + c + idx) % 9) !== 0
            }));
        }

        function initializeMonitoringFilters() {
            monitoringColumns.forEach(col => {
                const uniqueValues = [...new Set(monitoringRows.map(row => getMonitoringFilterValue(row, col.key)))];
                monitoringFilters[col.key] = {
                    allValues: uniqueValues,
                    selectedValues: new Set(uniqueValues),
                    draftValues: new Set(uniqueValues),
                    searchQuery: ''
                };
            });
        }

        function renderMonitoringRows() {
            const filteredRows = monitoringRows.filter(row => monitoringColumns.every(col => {
                const state = monitoringFilters[col.key];
                const cellValue = getMonitoringFilterValue(row, col.key);
                const bySelected = state.selectedValues.has(cellValue);
                const bySearch = !state.searchQuery || cellValue.toLowerCase().includes(state.searchQuery);
                return bySelected && bySearch;
            }));

            const totalPages = Math.max(1, Math.ceil(filteredRows.length / monitoringPageSize));
            if (monitoringCurrentPage > totalPages) monitoringCurrentPage = totalPages;
            const pageStart = (monitoringCurrentPage - 1) * monitoringPageSize;
            const pageRows = filteredRows.slice(pageStart, pageStart + monitoringPageSize);

            monitoringTableBody.innerHTML = pageRows.map(row => `
                <tr>
                    ${monitoringColumns.map(col => `<td data-col-key="${col.key}">${formatMonitoringCell(col.key, row[col.key])}</td>`).join('')}
                </tr>
            `).join('');

            selectedMonitoringCell = null;
            bindMonitoringCellInteractions();
            applyMonitoringColumnHighlight();
            updateMonitoringPaginationControls(filteredRows.length, totalPages);
        }

        function updateMonitoringPaginationControls(totalRows, totalPages) {
            if (monitoringPageInfo) {
                monitoringPageInfo.textContent = `Страница ${monitoringCurrentPage} из ${totalPages} · ${totalRows} строк`;
            }
            if (monitoringPrevPageBtn) monitoringPrevPageBtn.disabled = monitoringCurrentPage <= 1;
            if (monitoringNextPageBtn) monitoringNextPageBtn.disabled = monitoringCurrentPage >= totalPages;
        }

        function getMonitoringFilterValue(row, key) {
            if (key === 'checks') {
                return row.checksFailed ? 'Есть непройденные проверки' : 'Все проверки пройдены';
            }
            return String(row[key] ?? '');
        }

        function formatMonitoringCell(key, value) {
            if (key === 'flowStatus' || key === 'datamartStatus') {
                const statusClass = value === 'Успешно'
                    ? 'success'
                    : 'error';
                return `<span class="status-pill ${statusClass}">${value}</span>`;
            }
            if (key === 'checks') {
                const checks = Array.isArray(value) ? value : [];
                return `
                    <button type="button" class="checks-toggle">Показать проверки</button>
                    <div class="checks-list hidden">
                        ${checks.map(check => `<div class="checks-item ${check.ok ? 'ok' : 'fail'}">${check.ok ? '✅' : '⚠️'} <span>${escapeHtml(check.name)}</span></div>`).join('')}
                    </div>
                `;
            }
            return value ?? '';
        }

        function bindMonitoringCellInteractions() {
            monitoringTableBody.querySelectorAll('td').forEach(cell => {
                cell.addEventListener('mouseenter', function() {
                    this.classList.add('cell-hovered');
                });
                cell.addEventListener('mouseleave', function() {
                    this.classList.remove('cell-hovered');
                });
                cell.addEventListener('click', function(event) {
                    const toggleBtn = event.target.closest('.checks-toggle');
                    if (toggleBtn) {
                        const list = this.querySelector('.checks-list');
                        if (list) {
                            const hidden = list.classList.toggle('hidden');
                            toggleBtn.textContent = hidden ? 'Показать проверки' : 'Скрыть проверки';
                        }
                        return;
                    }
                    if (highlightedMonitoringColumn) {
                        highlightedMonitoringColumn = null;
                        applyMonitoringColumnHighlight();
                    }
                    if (selectedMonitoringCell === this) {
                        this.classList.remove('cell-selected');
                        selectedMonitoringCell = null;
                        return;
                    }
                    if (selectedMonitoringCell) {
                        selectedMonitoringCell.classList.remove('cell-selected');
                    }
                    selectedMonitoringCell = this;
                    selectedMonitoringCell.classList.add('cell-selected');
                });
            });
        }

        function bindMonitoringHeaderActions() {
            monitoringHeaderRow.querySelectorAll('th').forEach(th => {
                th.addEventListener('click', function(event) {
                    if (event.target.classList.contains('resize-handle') || event.target.classList.contains('filter-triangle')) return;
                    if (selectedMonitoringCell) {
                        selectedMonitoringCell.classList.remove('cell-selected');
                        selectedMonitoringCell = null;
                    }
                    highlightedMonitoringColumn = this.dataset.colKey;
                    applyMonitoringColumnHighlight();
                });
            });

            monitoringHeaderRow.querySelectorAll('.filter-triangle').forEach(filterTriangle => {
                filterTriangle.addEventListener('click', function(event) {
                    event.stopPropagation();
                    const filterKey = this.dataset.filterKey;
                    if (activeMonitoringFilterKey === filterKey && !monitoringFilterMenu.classList.contains('hidden')) {
                        closeMonitoringFilterMenu();
                        return;
                    }
                    activeMonitoringFilterKey = filterKey;
                    activeMonitoringFilterAnchor = this;
                    openMonitoringFilterMenu(filterKey, this);
                });
            });

            monitoringHeaderRow.querySelectorAll('.resize-handle').forEach(handle => {
                handle.addEventListener('mousedown', startMonitoringResize);
            });
        }

        function applyMonitoringColumnHighlight() {
            document.querySelectorAll('#monitoringTable th, #monitoringTable td').forEach(cell => {
                const key = cell.dataset.colKey;
                cell.classList.toggle('highlight-col', Boolean(highlightedMonitoringColumn && key === highlightedMonitoringColumn));
            });
        }

        function openMonitoringFilterMenu(filterKey, anchorElement) {
            const state = monitoringFilters[filterKey];
            if (!state || !monitoringFilterMenu) return;
            state.draftValues = new Set(state.selectedValues);

            monitoringFilterMenu.innerHTML = `
                <div class="filter-menu-header">${monitoringColumns.find(col => col.key === filterKey)?.label || 'Фильтр'}</div>
                <input type="text" class="filter-menu-search" id="filterMenuSearch" placeholder="Поиск значения...">
                <div class="filter-menu-list">
                    <label class="filter-menu-option">
                        <input type="checkbox" id="filterSelectAll">
                        <span>Выбрать все</span>
                    </label>
                    ${state.allValues.map(value => `
                        <label class="filter-menu-option value-option" data-value-label="${escapeHtml(value).toLowerCase()}">
                            <input type="checkbox" class="filter-value-item" value="${escapeHtml(value)}">
                            <span>${escapeHtml(value) || '(пусто)'}</span>
                        </label>
                    `).join('')}
                </div>
                <div class="filter-menu-footer">
                    <button type="button" class="filter-btn primary" id="filterApplyBtn">Ок</button>
                    <button type="button" class="filter-btn" id="filterCancelBtn">Отмена</button>
                </div>
            `;

            positionMonitoringFilterMenu(anchorElement);
            monitoringFilterMenu.classList.remove('hidden');
            refreshFilterMenuChecks(filterKey);
            const searchInput = document.getElementById('filterMenuSearch');
            if (searchInput) {
                searchInput.value = state.searchQuery || '';
                filterMonitoringMenuByText(searchInput.value);
            }
            updateFilterTrianglesState();
            bindFilterMenuActions(filterKey);
        }

        function bindFilterMenuActions(filterKey) {
            const state = monitoringFilters[filterKey];
            const selectAll = document.getElementById('filterSelectAll');
            const optionItems = [...monitoringFilterMenu.querySelectorAll('.filter-value-item')];
            const searchInput = document.getElementById('filterMenuSearch');

            searchInput?.addEventListener('input', function() {
                filterMonitoringMenuByText(this.value);
            });

            selectAll?.addEventListener('change', function() {
                state.draftValues = this.checked ? new Set(state.allValues) : new Set();
                refreshFilterMenuChecks(filterKey);
            });

            optionItems.forEach(item => {
                item.addEventListener('change', function() {
                    if (this.checked) state.draftValues.add(this.value);
                    else state.draftValues.delete(this.value);
                    refreshFilterMenuChecks(filterKey);
                });
            });

            document.getElementById('filterApplyBtn')?.addEventListener('click', function() {
                state.selectedValues = new Set(state.draftValues);
                state.searchQuery = String(searchInput?.value || '').trim().toLowerCase();
                monitoringCurrentPage = 1;
                closeMonitoringFilterMenu();
                renderMonitoringRows();
                updateFilterTrianglesState();
            });

            document.getElementById('filterCancelBtn')?.addEventListener('click', function() {
                closeMonitoringFilterMenu();
            });
        }

        function filterMonitoringMenuByText(query) {
            const normalized = String(query || '').trim().toLowerCase();
            monitoringFilterMenu.querySelectorAll('.value-option').forEach(item => {
                const label = item.dataset.valueLabel || '';
                item.classList.toggle('hidden', Boolean(normalized && !label.includes(normalized)));
            });
        }

        function refreshFilterMenuChecks(filterKey) {
            const state = monitoringFilters[filterKey];
            if (!state || monitoringFilterMenu.classList.contains('hidden')) return;
            const optionItems = [...monitoringFilterMenu.querySelectorAll('.filter-value-item')];
            optionItems.forEach(item => {
                item.checked = state.draftValues.has(item.value);
            });
            const selectAll = document.getElementById('filterSelectAll');
            if (selectAll) {
                selectAll.checked = state.draftValues.size === state.allValues.length;
                selectAll.indeterminate = state.draftValues.size > 0 && state.draftValues.size < state.allValues.length;
            }
        }

        function closeMonitoringFilterMenu() {
            monitoringFilterMenu?.classList.add('hidden');
            activeMonitoringFilterKey = null;
            activeMonitoringFilterAnchor = null;
            updateFilterTrianglesState();
        }

        function positionMonitoringFilterMenu(anchorElement) {
            const rect = anchorElement.getBoundingClientRect();
            monitoringFilterMenu.style.left = `${Math.min(window.innerWidth - 300, rect.right - 220)}px`;
            monitoringFilterMenu.style.top = `${Math.min(window.innerHeight - 380, rect.bottom + 6)}px`;
        }

        function updateFilterTrianglesState() {
            monitoringHeaderRow.querySelectorAll('.filter-triangle').forEach(triangle => {
                const key = triangle.dataset.filterKey;
                const state = monitoringFilters[key];
                const partiallyFiltered = state && (state.selectedValues.size !== state.allValues.length || Boolean(state.searchQuery));
                triangle.classList.toggle('active', activeMonitoringFilterKey === key);
                triangle.classList.toggle('filtered', Boolean(partiallyFiltered));
            });
        }

        function resetAllMonitoringFilters() {
            monitoringColumns.forEach(col => {
                const state = monitoringFilters[col.key];
                if (!state) return;
                state.selectedValues = new Set(state.allValues);
                state.draftValues = new Set(state.allValues);
                state.searchQuery = '';
            });
            monitoringCurrentPage = 1;
            closeMonitoringFilterMenu();
            renderMonitoringRows();
            updateFilterTrianglesState();
        }

        function escapeHtml(value) {
            return String(value)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }

        function startMonitoringResize(event) {
            event.preventDefault();
            const colIndex = Number(event.target.dataset.colIndex);
            const col = monitoringColgroup.querySelectorAll('col')[colIndex];
            if (!col) return;

            const startX = event.pageX;
            const startWidth = col.getBoundingClientRect().width;

            function onMouseMove(moveEvent) {
                const nextWidth = Math.max(100, startWidth + (moveEvent.pageX - startX));
                col.style.width = `${nextWidth}px`;
            }

            function onMouseUp() {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        }

        function saveCurrentDatamartState() {
            if (!currentDatamartId || !datamarts[currentDatamartId]) return;

            datamarts[currentDatamartId].pages = JSON.parse(JSON.stringify(pages));
            datamarts[currentDatamartId].selectedEngine = designerState.engine;
            datamarts[currentDatamartId].checkpointActive = designerState.checkpointActive;
            datamarts[currentDatamartId].checkpointStartMode = designerState.checkpointStartMode;
            datamarts[currentDatamartId].activeSidebarModule = activeSidebarModule;
            datamarts[currentDatamartId].currentView = currentView;
            datamarts[currentDatamartId].currentPageId = currentPageId;
            datamarts[currentDatamartId].selectedElementId = selectedElement ? selectedElement.id : null;
            datamarts[currentDatamartId].selectedElementPageId = selectedElement ? currentPageId : null;
        }

        function applyDatamartSettings(datamart) {
            sparkBtn.classList.remove('active');
            flinkBtn.classList.remove('active');
            checkpointBtn.classList.remove('active');

            designerState.engine = datamart.selectedEngine || null;
            if (designerState.engine !== 'spark' && designerState.engine !== 'flink') {
                designerState.engine = null;
            }
            designerState.checkpointActive = Boolean(datamart.checkpointActive);
            designerState.checkpointStartMode = datamart.checkpointStartMode || 'FROM_START';
            activeSidebarModule = ['checkpoint', 'engine-spark', 'engine-flink'].includes(datamart.activeSidebarModule)
                ? datamart.activeSidebarModule
                : null;
            updateRibbonAvailability();
        }

        function restoreSelectedElementForCurrentDatamart(datamart) {
            if (!datamart || !datamart.selectedElementId || datamart.selectedElementPageId !== currentPageId) {
                clearElementSelection();
                return;
            }

            const element = document.getElementById(datamart.selectedElementId);
            const page = pages.find(p => p.id === currentPageId);
            const elementObj = page ? page.elements.find(el => el.id === datamart.selectedElementId) : null;

            if (!element || !elementObj) {
                datamart.selectedElementId = null;
                datamart.selectedElementPageId = null;
                clearElementSelection();
                return;
            }

            selectElement(element, elementObj);
        }

        function openDatamart(datamartId, datamartName) {
            saveCurrentDatamartState();

            currentDatamartId = datamartId;
            currentDatamartName = datamartName;
            currentDatamart.textContent = datamartName;
            refreshDatamartMenus();

            const datamart = datamarts[datamartId];
            if (!datamart) return;

            applyDatamartSettings(datamart);

            resetPages();

            if (datamart.pages && datamart.pages.length > 0) {
                loadDatamartElements(datamartId, datamart.currentPageId);
            } else {
                createPage("Главная", "Основная страница витрины", "default");
            }

            switchView(datamart.currentView || 'designer');

            switchAppPage('designerPage');

            restoreSelectedElementForCurrentDatamart(datamart);
            if (activeSidebarModule === 'engine-spark' || activeSidebarModule === 'engine-flink') {
                propertiesPanel.classList.add('active');
                updatePropertiesPanelOffset();
                updatePropertiesPanel();
            }
            showNotification(`Открыта витрина: ${datamartName}`);
        }

        function resetPages() {
            clearElementSelection();

            canvasPages.innerHTML = '';
            tabsContainer.innerHTML = '';
            tabsContainer.appendChild(addTabBtn);

            pages = [];
            currentPageId = null;
            pageCounter = 0;

            canvasPages.style.display = 'none';
        }

        function loadDatamartElements(datamartId, savedPageId = null) {
            if (datamarts[datamartId] && datamarts[datamartId].pages) {
                datamarts[datamartId].pages.forEach(pageData => {
                    const newPage = createPage(pageData.name, pageData.description, pageData.template);
                    newPage.elements = pageData.elements || [];
                    newPage.connections = pageData.connections || [];
                });

                if (pages.length > 0) {
                    const pageToOpen = pages.find(page => page.id === savedPageId) || pages[0];
                    switchPage(pageToOpen.id);
                }
            }
        }

        // Функции для создания страниц и элементов (оставлены без изменений)
        function createPage(name = null, description = "", template = "batch") {
            pageCounter++;
            const pageId = `page-${pageCounter}`;
            const pageName = name || `Страница ${pageCounter}`;

            const pageDiv = document.createElement('div');
            pageDiv.className = 'canvas-page';
            pageDiv.id = pageId;

            pageDiv.innerHTML = `
                <div class="canvas-page-content">
                    <div class="designer-grid" id="grid-${pageId}"></div>
                </div>
            `;

            canvasPages.appendChild(pageDiv);

            const grid = pageDiv.querySelector('.designer-grid');
            setupGridSelection(grid);

            createTab(pageId, pageName);

            const pageData = {
                id: pageId,
                name: pageName,
                description: description,
                template: template,
                elements: [],
                connections: [],
                createdAt: new Date().toISOString()
            };

            pages.push(pageData);

            if (pages.length === 1) {
                switchPage(pageId);
            }

            canvasPages.style.display = 'flex';

            return pageData;
        }

        function createTab(pageId, pageName) {
            const tabDiv = document.createElement('div');
            tabDiv.className = 'canvas-tab';
            tabDiv.dataset.pageId = pageId;

            tabDiv.innerHTML = `
                <div class="tab-name">${pageName}</div>
                <div class="tab-close">
                    <i class="fas fa-times"></i>
                </div>
            `;

            if (!tabsContainer.contains(addTabBtn)) {
                tabsContainer.appendChild(addTabBtn);
            }

            tabsContainer.insertBefore(tabDiv, addTabBtn);

            tabDiv.addEventListener('click', function(e) {
                if (this.classList.contains('editing')) return;

                if (!e.target.classList.contains('tab-close')) {
                    const pageId = this.dataset.pageId;
                    switchPage(pageId);
                }
            });

            tabDiv.querySelector('.tab-close').addEventListener('click', function(e) {
                e.stopPropagation();
                const pageId = this.parentElement.dataset.pageId;
                closePage(pageId);
            });

            updateScrollButtons();

            return tabDiv;
        }

        function startTabRename(tabElement) {
            if (!tabElement || tabElement.classList.contains('editing')) return;

            finishTabRename(true);

            const nameElement = tabElement.querySelector('.tab-name');
            if (!nameElement) return;

            const currentName = nameElement.textContent.trim();
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'tab-name-input';
            input.value = currentName;
            input.setAttribute('aria-label', 'Название потока');

            tabElement.classList.add('editing');
            nameElement.replaceWith(input);
            editingTab = tabElement;

            input.focus();
            input.select();

            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    finishTabRename(true);
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    finishTabRename(false);
                }
            });
        }

        function finishTabRename(saveChanges) {
            if (!editingTab) return;

            const tabElement = editingTab;
            const pageId = tabElement.dataset.pageId;
            const input = tabElement.querySelector('.tab-name-input');
            const page = pages.find(p => p.id === pageId);
            const currentName = page ? page.name : '';

            let nextName = currentName;
            if (saveChanges && input) {
                const trimmedName = input.value.trim();
                if (trimmedName) {
                    nextName = trimmedName;
                }
            }

            const nameElement = document.createElement('div');
            nameElement.className = 'tab-name';
            nameElement.textContent = nextName;

            if (input) {
                input.replaceWith(nameElement);
            }

            if (page) {
                page.name = nextName;
            }

            tabElement.classList.remove('editing');
            editingTab = null;
        }

        function switchPage(pageId) {
            clearElementSelection();

            document.querySelectorAll('.canvas-page').forEach(page => {
                page.classList.remove('active');
            });

            document.querySelectorAll('.canvas-tab').forEach(tab => {
                tab.classList.remove('active');
            });

            const pageElement = document.getElementById(pageId);
            if (pageElement) {
                pageElement.classList.add('active');
                currentPageId = pageId;

                const tabElement = document.querySelector(`.canvas-tab[data-page-id="${pageId}"]`);
                if (tabElement) {
                    tabElement.classList.add('active');
                    scrollToTab(tabElement);
                }

                loadPageElements(pageId);

                updateElementsCount();

                showNotification(`Переключено на страницу: ${getPageName(pageId)}`);
            }
        }

        function getPageName(pageId) {
            const page = pages.find(p => p.id === pageId);
            return page ? page.name : 'Неизвестная страница';
        }

        function closePage(pageId) {
            if (pages.length <= 1) {
                showNotification('Невозможно закрыть последнюю страницу');
                return;
            }

            const pageIndex = pages.findIndex(p => p.id === pageId);
            if (pageIndex === -1) return;

            const pageElement = document.getElementById(pageId);
            if (pageElement) pageElement.remove();

            const tabElement = document.querySelector(`.canvas-tab[data-page-id="${pageId}"]`);
            if (tabElement) tabElement.remove();

            const removedPage = pages.splice(pageIndex, 1)[0];

            if (pageId === currentPageId) {
                const nextPageIndex = pageIndex < pages.length ? pageIndex : pageIndex - 1;
                if (pages.length > 0) {
                    switchPage(pages[nextPageIndex].id);
                }
            }

            showNotification(`Страница "${removedPage.name}" закрыта`);

            updateScrollButtons();
        }

        function scrollTabs(direction) {
            const container = tabsContainer;
            const scrollAmount = 150;

            if (direction === 'left') {
                container.scrollLeft -= scrollAmount;
            } else if (direction === 'right') {
                container.scrollLeft += scrollAmount;
            }

            setTimeout(updateScrollButtons, 100);
        }

        function updateScrollButtons() {
            const container = tabsContainer;

            if (container.scrollLeft <= 0) {
                scrollLeftBtn.classList.add('disabled');
            } else {
                scrollLeftBtn.classList.remove('disabled');
            }

            if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 1) {
                scrollRightBtn.classList.add('disabled');
            } else {
                scrollRightBtn.classList.remove('disabled');
            }
        }

        function scrollToTab(tabElement) {
            const container = tabsContainer;
            const tabRect = tabElement.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();

            if (tabRect.left < containerRect.left) {
                container.scrollLeft -= (containerRect.left - tabRect.left);
            } else if (tabRect.right > containerRect.right) {
                container.scrollLeft += (tabRect.right - containerRect.right);
            }
        }

        function openCreatePageModal() {
            const defaultName = `Поток ${pages.length + 1}`;
            document.getElementById('pageName').value = defaultName;
            document.getElementById('pageTemplate').value = 'batch';

            pageModal.classList.add('active');
            document.getElementById('pageName').focus();
        }

        function closeCreatePageModal() {
            pageModal.classList.remove('active');
            pageForm.reset();
        }

        function createPageFromModal() {
            const name = document.getElementById('pageName').value;
            const description = '';
            const template = document.getElementById('pageTemplate').value;

            if (!name.trim()) {
                showNotification('Пожалуйста, введите название страницы');
                return;
            }

            if (pages.some(page => page.name === name)) {
                showNotification('Страница с таким именем уже существует');
                return;
            }

            const newPage = createPage(name, description, template);

            switchPage(newPage.id);

            closeCreatePageModal();

            showNotification(`Страница "${name}" создана`);
        }

        function getGridRelativePoint(grid, event) {
            const rect = grid.getBoundingClientRect();
            return {
                x: event.clientX - rect.left + grid.scrollLeft,
                y: event.clientY - rect.top + grid.scrollTop
            };
        }

        function getMarqueeRect(startPoint, currentPoint) {
            return {
                left: Math.min(startPoint.x, currentPoint.x),
                top: Math.min(startPoint.y, currentPoint.y),
                right: Math.max(startPoint.x, currentPoint.x),
                bottom: Math.max(startPoint.y, currentPoint.y)
            };
        }

        function intersectsRect(a, b) {
            return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
        }

        function setupGridSelection(grid) {
            if (!grid || grid.dataset.selectionInit === 'true') return;
            grid.dataset.selectionInit = 'true';

            grid.addEventListener('mousedown', function(event) {
                if (event.button !== 0) return;
                if (event.target.closest('.canvas-element')) return;

                event.preventDefault();
                const startPoint = getGridRelativePoint(grid, event);

                selectionDragState = {
                    grid,
                    startPoint,
                    append: event.ctrlKey || event.metaKey,
                    moved: false
                };

                const onMouseMove = (moveEvent) => {
                    if (!selectionDragState || selectionDragState.grid !== grid) return;
                    const currentPoint = getGridRelativePoint(grid, moveEvent);
                    const rect = getMarqueeRect(selectionDragState.startPoint, currentPoint);
                    const width = rect.right - rect.left;
                    const height = rect.bottom - rect.top;

                    if (!selectionDragState.moved && width < 2 && height < 2) {
                        return;
                    }

                    selectionDragState.moved = true;

                    if (!selectionBox) {
                        selectionBox = document.createElement('div');
                        selectionBox.className = 'selection-box';
                        grid.appendChild(selectionBox);
                    }

                    selectionBox.style.left = `${rect.left}px`;
                    selectionBox.style.top = `${rect.top}px`;
                    selectionBox.style.width = `${width}px`;
                    selectionBox.style.height = `${height}px`;

                    const page = pages.find(p => p.id === currentPageId);
                    const elementsInPage = page ? page.elements : [];
                    const inside = elementsInPage.filter(item => {
                        const dom = document.getElementById(item.id);
                        if (!dom) return false;

                        const left = parseInt(dom.style.left) || 0;
                        const top = parseInt(dom.style.top) || 0;
                        const w = parseInt(dom.style.width) || dom.offsetWidth || 0;
                        const h = parseInt(dom.style.height) || dom.offsetHeight || 0;

                        return intersectsRect(rect, {
                            left,
                            top,
                            right: left + w,
                            bottom: top + h
                        });
                    });

                    setSelection(inside, { append: selectionDragState.append, storeSelection: true });
                };

                const onMouseUp = () => {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);

                    if (selectionBox && selectionBox.parentElement === grid) {
                        selectionBox.remove();
                    }
                    selectionBox = null;

                    if (selectionDragState && selectionDragState.moved) {
                        suppressNextCanvasBackgroundClear = true;
                    }

                    if (selectionDragState && !selectionDragState.moved && !(selectionDragState.append)) {
                        clearElementSelection(true);
                    }

                    selectionDragState = null;
                };

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });
        }

        function getGridLinkLayer(grid) {
            if (!grid) return null;

            let svg = grid.querySelector('.dag-link-layer');
            if (svg) return svg;

            svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.classList.add('dag-link-layer');

            const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
            marker.setAttribute('id', 'dagArrowHead');
            marker.setAttribute('markerWidth', '14');
            marker.setAttribute('markerHeight', '11');
            marker.setAttribute('refX', '11');
            marker.setAttribute('refY', '5.5');
            marker.setAttribute('orient', 'auto-start-reverse');
            marker.setAttribute('markerUnits', 'userSpaceOnUse');

            const markerPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            markerPath.setAttribute('d', 'M1,1 L12,5.5 L1,10 Q3,5.5 1,1 z');
            markerPath.setAttribute('fill', '#5d7eb1');

            marker.appendChild(markerPath);
            defs.appendChild(marker);
            svg.appendChild(defs);

            grid.insertBefore(svg, grid.firstChild || null);
            return svg;
        }

        function findElementByIdInPages(elementId) {
            if (!elementId) return null;
            for (const page of pages) {
                const found = (page.elements || []).find(item => item.id === elementId);
                if (found) return found;
            }
            return null;
        }

        function getTaskId(elementObj) {
            if (!elementObj) return '';
            if (!elementObj.taskId) {
                const slug = `${elementObj.type || 'task'}_${elementObj.subtype || 'node'}`
                    .toLowerCase()
                    .replace(/[^a-z0-9_]+/g, '_');
                const suffix = (elementObj.id || '').replace('element-', '') || String(Math.floor(Math.random() * 9999));
                elementObj.taskId = `${slug}_${suffix}`;
            }
            return elementObj.taskId;
        }

        function getPortPoint(elementObj, direction = 'out') {
            const el = document.getElementById(elementObj?.id);
            if (!el) return null;

            const width = parseInt(el.style.width, 10) || el.offsetWidth || 0;
            const height = parseInt(el.style.height, 10) || el.offsetHeight || 0;
            const left = parseInt(el.style.left, 10) || 0;
            const top = parseInt(el.style.top, 10) || 0;

            return {
                x: direction === 'out' ? left + width : left,
                y: top + (height / 2)
            };
        }

        function isElementConfigured(elementObj) {
            if (!elementObj) return false;

            const hasTitle = Boolean(String(elementObj.title || '').trim());
            if (!hasTitle) return false;

            if (isMove2paElement(elementObj)) {
                const config = ensureMove2paConfig(elementObj);
                return Boolean(String(config.pa_table || '').trim());
            }

            if (isCoalesceElement(elementObj)) {
                const config = ensureCoalesceConfig(elementObj);
                const hasBaseConfig = Boolean(String(config.tables || '').trim()) && Boolean(String(config.schema || '').trim());
                if (!hasBaseConfig) return false;

                if (inferCoalesceMode(config) === 'filter') {
                    return Boolean(String(config.include_partitions || '').trim() || String(config.exclude_partitions || '').trim());
                }

                if (inferCoalesceMode(config) === 'abc') {
                    return Boolean(String(config.analyze_by || '').trim());
                }

                return true;
            }

            if (isHistoryElement(elementObj)) {
                const config = ensureHistoryConfig(elementObj);
                const requiredFields = [
                    config.incr_table,
                    config.pa_table,
                    config.hist_table,
                    config.mapping_inc,
                    config.mapping_pa,
                    config.pk_inc,
                    config.pk_pa
                ];
                return requiredFields.every(field => Boolean(String(field || '').trim()));
            }

            if (isSqlCapableElement(elementObj) && !isTransformDataElement(elementObj)) {
                const args = elementObj.sqlArgs || {};
                return Boolean(String(args.params || '').trim()) || Boolean(String(args.data_source || '').trim());
            }

            return true;
        }

        function applyNodeValidationState(elementObj) {
            if (!elementObj?.id) return;
            const nodeElement = document.getElementById(elementObj.id);
            if (!nodeElement) return;

            const isValid = isElementConfigured(elementObj);
            nodeElement.classList.toggle('is-valid', isValid);
            nodeElement.classList.toggle('is-invalid', !isValid);
        }

        function updateGraphValidationIndicator(pageId = currentPageId) {
            const page = pages.find(p => p.id === pageId);
            const grid = document.getElementById(`grid-${pageId}`);
            if (!page || !grid) return;

            const hasInvalid = (page.elements || []).some(item => !isElementConfigured(item));
            grid.classList.toggle('has-invalid-nodes', hasInvalid);
        }

        function refreshCanvasValidationState(pageId = currentPageId) {
            const page = pages.find(p => p.id === pageId);
            if (!page) return;
            (page.elements || []).forEach(applyNodeValidationState);
            updateGraphValidationIndicator(pageId);
        }

        function buildDagPath(fromPoint, toPoint) {
            if (!fromPoint || !toPoint) return '';
            const deltaX = Math.max(60, Math.abs(toPoint.x - fromPoint.x) * 0.45);
            const c1x = fromPoint.x + deltaX;
            const c2x = toPoint.x - deltaX;
            return `M ${fromPoint.x} ${fromPoint.y} C ${c1x} ${fromPoint.y}, ${c2x} ${toPoint.y}, ${toPoint.x} ${toPoint.y}`;
        }

        function renderDagConnections(pageId = currentPageId) {
            if (!pageId) return;
            const page = pages.find(p => p.id === pageId);
            const grid = document.getElementById(`grid-${pageId}`);
            if (!page || !grid) return;

            const layer = getGridLinkLayer(grid);
            if (!layer) return;

            const selectedIds = new Set(selectedElements.map(item => item.id));
            Array.from(layer.querySelectorAll('path.dag-link')).forEach(path => path.remove());

            (page.connections || []).forEach(connection => {
                const fromElement = findElementByIdInPages(connection.from);
                const toElement = findElementByIdInPages(connection.to);
                if (!fromElement || !toElement) return;

                const fromPoint = getPortPoint(fromElement, 'out');
                const toPoint = getPortPoint(toElement, 'in');
                if (!fromPoint || !toPoint) return;

                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.classList.add('dag-link');
                path.setAttribute('d', buildDagPath(fromPoint, toPoint));
                path.dataset.connectionId = connection.id;

                const isSelectedLink = selectedIds.has(connection.from) || selectedIds.has(connection.to);
                path.classList.toggle('is-selected', isSelectedLink);

                path.addEventListener('mouseenter', () => path.classList.add('is-hovered'));
                path.addEventListener('mouseleave', () => path.classList.remove('is-hovered'));
                layer.appendChild(path);
            });

            if (dagLinkPreview && pageId === currentPageId) {
                layer.appendChild(dagLinkPreview);
            }

            refreshCanvasValidationState(pageId);
        }

        function removeConnectionsForElement(elementId, pageId = currentPageId) {
            const page = pages.find(p => p.id === pageId);
            if (!page || !page.connections) return;
            page.connections = page.connections.filter(link => link.from !== elementId && link.to !== elementId);
            renderDagConnections(pageId);
        }

        function hasConnection(page, fromId, toId) {
            if (!page || !page.connections) return false;
            return page.connections.some(link => link.from === fromId && link.to === toId);
        }

        function createConnection(fromId, toId, pageId = currentPageId) {
            if (!fromId || !toId || fromId === toId) return;
            const page = pages.find(p => p.id === pageId);
            if (!page) return;

            page.connections = page.connections || [];
            if (hasConnection(page, fromId, toId)) {
                showNotification('Связь уже существует');
                return;
            }

            dagConnectionCounter++;
            page.connections.push({
                id: `conn-${dagConnectionCounter}`,
                from: fromId,
                to: toId
            });

            renderDagConnections(pageId);
        }

        function beginConnectionDrag(elementObj, event) {
            event.preventDefault();
            event.stopPropagation();

            const grid = document.getElementById(`grid-${currentPageId}`);
            if (!grid) return;

            const startPoint = getPortPoint(elementObj, 'out');
            if (!startPoint) return;

            const layer = getGridLinkLayer(grid);
            if (!layer) return;

            dagLinkDragState = {
                sourceId: elementObj.id,
                pageId: currentPageId
            };

            dagLinkPreview = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            dagLinkPreview.classList.add('dag-link', 'preview');
            dagLinkPreview.setAttribute('d', buildDagPath(startPoint, startPoint));
            const outPort = document.querySelector(`#${elementObj.id} .element-port.out`);
            if (outPort) outPort.classList.add('active');
            layer.appendChild(dagLinkPreview);

            const onMouseMove = (moveEvent) => {
                if (!dagLinkDragState || dagLinkDragState.pageId !== currentPageId) return;
                const rect = grid.getBoundingClientRect();
                const toPoint = {
                    x: moveEvent.clientX - rect.left + grid.scrollLeft,
                    y: moveEvent.clientY - rect.top + grid.scrollTop
                };
                const fromPoint = getPortPoint(elementObj, 'out') || startPoint;
                dagLinkPreview.setAttribute('d', buildDagPath(fromPoint, toPoint));
            };

            const onMouseUp = (upEvent) => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);

                const targetPort = upEvent.target.closest('.element-port.in');
                if (targetPort) {
                    const targetId = targetPort.dataset.elementId;
                    createConnection(elementObj.id, targetId, currentPageId);
                }

                if (dagLinkPreview && dagLinkPreview.parentElement) {
                    dagLinkPreview.remove();
                }
                dagLinkPreview = null;
                dagLinkDragState = null;
                document.querySelectorAll('.element-port.active').forEach(port => port.classList.remove('active'));
                renderDagConnections(currentPageId);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        }

        function loadPageElements(pageId) {
            const page = pages.find(p => p.id === pageId);
            if (!page) return;

            const grid = document.getElementById(`grid-${pageId}`);
            if (!grid) return;

            setupGridSelection(grid);

            grid.innerHTML = '';
            elements = [];
            elementCounter = 0;

            if (page.elements && page.elements.length > 0) {
                page.elements.forEach(elementData => {
                    createCanvasElement(elementData, pageId, { persistInPage: false });
                });
            }

            renderDagConnections(pageId);

            updateElementsCount();
        }

        function updateElementsCount() {
            const page = pages.find(p => p.id === currentPageId);
            const elementsCount = page ? page.elements.length : 0;
        }

        function updatePropertiesPanelOffset() {
            if (!designerMain) return;

            const ribbonTabsElement = designerView.querySelector('.ribbon-tabs');
            const activeRibbon = designerView.querySelector('.ribbon.active');
            const canvasTabsElement = designerView.querySelector('.canvas-tabs');

            const ribbonTabsHeight = ribbonTabsElement ? ribbonTabsElement.offsetHeight : 0;
            const activeRibbonHeight = activeRibbon ? activeRibbon.offsetHeight : 0;
            const canvasTabsHeight = canvasTabsElement ? canvasTabsElement.offsetHeight : 0;
            const topOffset = ribbonTabsHeight + activeRibbonHeight;
            const bottomOffset = canvasTabsHeight;

            propertiesPanel.style.top = `${topOffset}px`;
            propertiesPanel.style.bottom = `${bottomOffset}px`;
            propertiesPanel.style.width = `${propertiesPanelWidth}px`;
        }

        function getDefaultModuleComment(elementObj) {
            if (!elementObj) return '';
            return String(elementObj.moduleComment || '').trim();
        }

        function ensureModuleMeta(elementObj) {
            if (!elementObj) {
                return { enabled: true, comment: '' };
            }

            elementObj.moduleEnabled = typeof elementObj.moduleEnabled === 'boolean' ? elementObj.moduleEnabled : true;
            elementObj.moduleComment = String(elementObj.moduleComment || '').trim();
            return {
                enabled: elementObj.moduleEnabled,
                comment: elementObj.moduleComment
            };
        }

        function getMove2paDefaults() {
            return {
                pa_table: '',
                hist_table: ''
            };
        }

        function ensureMove2paConfig(elementObj) {
            if (!elementObj) return getMove2paDefaults();

            const defaults = getMove2paDefaults();
            const incoming = elementObj.move2paConfig || {};

            elementObj.move2paConfig = {
                pa_table: incoming.pa_table || defaults.pa_table,
                hist_table: incoming.hist_table || defaults.hist_table
            };

            return elementObj.move2paConfig;
        }

        function getCoalesceDefaults() {
            return {
                tables: '',
                schema: '',
                target_file_size_mb: 128,
                compression_codec: 'zstd',
                parallel_degree: 4,
                snapshot_retention: 7,
                rewrite_manifests: true,
                delete_orphan_files: true,
                exclude_partitions: '',
                include_partitions: '',
                analyze_by: '',
                custom_strategy: ''
            };
        }

        function inferCoalesceMode(config = {}) {
            if (String(config.analyze_by || '').trim()) return 'abc';
            if (String(config.include_partitions || '').trim() || String(config.exclude_partitions || '').trim()) return 'filter';
            return 'full';
        }

        function ensureCoalesceConfig(elementObj) {
            if (!elementObj) return getCoalesceDefaults();

            const defaults = getCoalesceDefaults();
            const incoming = elementObj.coalesceConfig || {};
            const readNumber = (value, fallback) => Number.isFinite(Number(value)) ? Number(value) : fallback;

            elementObj.coalesceConfig = {
                tables: incoming.tables || defaults.tables,
                schema: incoming.schema || defaults.schema,
                target_file_size_mb: readNumber(incoming.target_file_size_mb, defaults.target_file_size_mb),
                compression_codec: incoming.compression_codec || defaults.compression_codec,
                parallel_degree: readNumber(incoming.parallel_degree, defaults.parallel_degree),
                snapshot_retention: readNumber(incoming.snapshot_retention, defaults.snapshot_retention),
                rewrite_manifests: typeof incoming.rewrite_manifests === 'boolean' ? incoming.rewrite_manifests : defaults.rewrite_manifests,
                delete_orphan_files: typeof incoming.delete_orphan_files === 'boolean' ? incoming.delete_orphan_files : defaults.delete_orphan_files,
                exclude_partitions: incoming.exclude_partitions || defaults.exclude_partitions,
                include_partitions: incoming.include_partitions || defaults.include_partitions,
                analyze_by: incoming.analyze_by || defaults.analyze_by,
                custom_strategy: incoming.custom_strategy || defaults.custom_strategy
            };

            return elementObj.coalesceConfig;
        }

        function getHistoryDefaults() {
            return {
                mode: 'baseline',
                incr_table: '',
                pa_table: '',
                hist_table: '',
                mapping_inc: '',
                mapping_pa: '',
                pk_inc: '',
                pk_pa: '',
                hash_policy_algo: 'sha256',
                hash_policy_exclude_cols: '',
                hash_policy_hash_col: '',
                dedup_policy_on_duplicate_order_by_clause: ''
            };
        }

        function ensureHistoryConfig(elementObj) {
            if (!elementObj) return getHistoryDefaults();

            const defaults = getHistoryDefaults();
            const incoming = elementObj.historyConfig || {};

            elementObj.historyConfig = {
                mode: incoming.mode || defaults.mode,
                incr_table: incoming.incr_table || defaults.incr_table,
                pa_table: incoming.pa_table || defaults.pa_table,
                hist_table: incoming.hist_table || defaults.hist_table,
                mapping_inc: incoming.mapping_inc || defaults.mapping_inc,
                mapping_pa: incoming.mapping_pa || defaults.mapping_pa,
                pk_inc: incoming.pk_inc || defaults.pk_inc,
                pk_pa: incoming.pk_pa || defaults.pk_pa,
                hash_policy_algo: incoming.hash_policy_algo || defaults.hash_policy_algo,
                hash_policy_exclude_cols: incoming.hash_policy_exclude_cols || defaults.hash_policy_exclude_cols,
                hash_policy_hash_col: incoming.hash_policy_hash_col || defaults.hash_policy_hash_col,
                dedup_policy_on_duplicate_order_by_clause: incoming.dedup_policy_on_duplicate_order_by_clause || defaults.dedup_policy_on_duplicate_order_by_clause
            };

            return elementObj.historyConfig;
        }

        function isMove2paElement(elementObj = selectedElement) {
            return Boolean(elementObj && elementObj.type === 'insert' && elementObj.subtype === 'move2pa');
        }

        function isHistoryElement(elementObj = selectedElement) {
            return Boolean(elementObj && elementObj.type === 'query' && elementObj.subtype === 'history');
        }

        function isCoalesceElement(elementObj = selectedElement) {
            return Boolean(elementObj && elementObj.type === 'insert' && elementObj.subtype === 'coalesce');
        }

        function isTransformDataElement(elementObj = selectedElement) {
            return Boolean(elementObj && elementObj.type === 'query' && elementObj.subtype === 'transform');
        }

        function shouldRenderSidebarForElement(elementObj = selectedElement) {
            return Boolean(elementObj) && !isTransformDataElement(elementObj);
        }

        function isCheckpointSidebarActive() {
            return activeSidebarModule === 'checkpoint';
        }

        function isEngineSidebarActive() {
            return activeSidebarModule === 'engine-spark' || activeSidebarModule === 'engine-flink';
        }

        function isSparkSidebarActive() {
            return activeSidebarModule === 'engine-spark';
        }

        function isFlinkSidebarActive() {
            return activeSidebarModule === 'engine-flink';
        }

        function toDisplayTitle(rawTitle = '') {
            const withoutPrefix = String(rawTitle).replace(/^iceberg[\s._-]*/i, '').trim();
            if (!withoutPrefix) return '';

            return withoutPrefix
                .replace(/[._-]+/g, ' ')
                .split(/\s+/)
                .filter(Boolean)
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
        }

        function getDisplayModuleTitle(elementOrType, subtype) {
            const isObject = typeof elementOrType === 'object' && elementOrType !== null;
            const type = isObject ? elementOrType.type : elementOrType;
            const sub = isObject ? elementOrType.subtype : subtype;
            const rawTitle = isObject
                ? (elementOrType.title || getElementTitle(type, sub))
                : getElementTitle(type, sub);

            if (type === 'query' && sub === 'transform') {
                return 'SQL Transform';
            }

            return toDisplayTitle(rawTitle) || rawTitle;
        }

        function openTransformSqlEditor(elementObj = selectedElement) {
            if (!isTransformDataElement(elementObj)) return;
            openSqlEditorModal(elementObj);
        }

        function getElementConfigKey(elementObj = selectedElement) {
            if (!elementObj) return '';
            return `${elementObj.type}:${elementObj.subtype}`;
        }

        function isSqlCapableElement(elementObj = selectedElement) {
            return Boolean(moduleTypeConfig[getElementConfigKey(elementObj)]?.sqlCapable);
        }

        function getFunctionNameForElement(elementObj = selectedElement) {
            if (!isSqlCapableElement(elementObj)) return null;
            return elementObj.functionName || sqlFunctionMap[elementObj.subtype] || `ICEBERG.${String(elementObj.subtype || '').toUpperCase()}`;
        }

        function getAllowedSqlArgsForElement(elementObj = selectedElement) {
            return sqlAllowedArgsBySubtype[elementObj?.subtype] || [];
        }

        function getEnumOptionsForSqlArg(argName, elementObj = selectedElement) {
            if (!elementObj) return [];

            if (elementObj.subtype === 'coalesce') {
                const selectMap = {
                    compression_codec: 'coalesceCompressionCodec',
                    analyze_by: 'coalesceAnalyzeBy'
                };

                const selectId = selectMap[argName];
                if (!selectId) return [];

                const selectElement = document.getElementById(selectId);
                if (!selectElement) return [];

                return Array.from(selectElement.options).map(option => option.value).filter(Boolean);
            }

            if (elementObj.subtype !== 'history') return [];

            const selectMap = {
                mode: 'historyMode',
                hash_policy_algo: 'historyHashPolicyAlgo',
                hash_algorithm: 'historyHashPolicyAlgo'
            };

            const selectId = selectMap[argName];
            if (!selectId) return [];

            const selectElement = document.getElementById(selectId);
            if (!selectElement) return [];

            return Array.from(selectElement.options).map(option => option.value).filter(Boolean);
        }

        function resolveEnumValueCaseInsensitive(paramName, rawValue, elementObj = selectedElement) {
            const options = getEnumOptionsForSqlArg(paramName, elementObj);
            if (!options.length) {
                return { valid: true, value: rawValue };
            }

            if (rawValue === null || rawValue === undefined || String(rawValue).trim() === '') {
                return { valid: true, value: rawValue };
            }

            const normalizedRaw = String(rawValue).trim().toLowerCase();
            const canonicalValue = options.find(option => option.toLowerCase() === normalizedRaw);
            if (!canonicalValue) {
                return {
                    valid: false,
                    error: `Параметр '${paramName}' должен быть одним из: ${options.join(', ')}.`
                };
            }

            return { valid: true, value: canonicalValue };
        }

        function mapSqlArgumentNameForElement(elementObj, argName) {
            if (!elementObj || !argName) return argName;
            if (elementObj.subtype !== 'history') return argName;

            const aliasMap = {
                target_table: 'hist_table',
                snapshot_table: 'pa_table',
                hash_algorithm: 'hash_policy_algo'
            };

            return aliasMap[argName] || argName;
        }

        function formatSqlArgument(value) {
            if (typeof value === 'number' && Number.isFinite(value)) return String(value);
            if (typeof value === 'boolean') return value ? 'true' : 'false';
            if (value === null) return 'null';

            const stringValue = String(value ?? '').trim();
            if (!stringValue.length) return null;

            if (/^-?\d+(\.\d+)?$/.test(stringValue)) return stringValue;
            if (stringValue === 'true' || stringValue === 'false') return stringValue;

            return `'${stringValue.replace(/'/g, "''")}'`;
        }

        function getMove2paSqlArguments(move2paConfig = {}) {
            return [
                ['pa_table', move2paConfig.pa_table],
                ['hist_table', move2paConfig.hist_table]
            ];
        }

        function getCoalesceSqlArguments(coalesceConfig = {}) {
            return [
                ['tables', coalesceConfig.tables],
                ['schema', coalesceConfig.schema],
                ['target_file_size_mb', coalesceConfig.target_file_size_mb],
                ['compression_codec', coalesceConfig.compression_codec],
                ['parallel_degree', coalesceConfig.parallel_degree],
                ['snapshot_retention', coalesceConfig.snapshot_retention],
                ['rewrite_manifests', coalesceConfig.rewrite_manifests],
                ['delete_orphan_files', coalesceConfig.delete_orphan_files],
                ['exclude_partitions', coalesceConfig.exclude_partitions || null],
                ['include_partitions', coalesceConfig.include_partitions || null],
                ['analyze_by', coalesceConfig.analyze_by || null],
                ['custom_strategy', coalesceConfig.custom_strategy || null]
            ];
        }

        function getHistorySqlArguments(historyConfig = {}) {
            return [
                ['mode', historyConfig.mode],
                ['incr_table', historyConfig.incr_table],
                ['pa_table', historyConfig.pa_table],
                ['hist_table', historyConfig.hist_table],
                ['mapping_inc', historyConfig.mapping_inc],
                ['mapping_pa', historyConfig.mapping_pa],
                ['pk_inc', historyConfig.pk_inc],
                ['pk_pa', historyConfig.pk_pa],
                ['hash_policy_algo', historyConfig.hash_policy_algo],
                ['hash_policy_exclude_cols', historyConfig.hash_policy_exclude_cols],
                ['hash_policy_hash_col', historyConfig.hash_policy_hash_col],
                ['dedup_policy_on_duplicate_order_by_clause', historyConfig.dedup_policy_on_duplicate_order_by_clause]
            ];
        }

        function getSqlArgumentsForElement(elementObj = selectedElement) {
            if (!isSqlCapableElement(elementObj)) return [];

            if (elementObj.subtype === 'history') {
                return getHistorySqlArguments(ensureHistoryConfig(elementObj));
            }

            if (elementObj.subtype === 'move2pa') {
                return getMove2paSqlArguments(ensureMove2paConfig(elementObj));
            }

            if (elementObj.subtype === 'coalesce') {
                return getCoalesceSqlArguments(ensureCoalesceConfig(elementObj));
            }

            if (elementObj.sqlArgs && typeof elementObj.sqlArgs === 'object') {
                return Object.entries(elementObj.sqlArgs);
            }

            return [];
        }

        function injectCommentIntoSql(sqlBody, comment) {
            const trimmedSql = String(sqlBody || '').trim();
            const trimmedComment = String(comment || '').trim();
            if (!trimmedComment.length) return trimmedSql;

            const commentBlock = trimmedComment
                .split(/\r?\n/)
                .map(line => `-- ${line.trim()}`)
                .join('\n');

            return `${commentBlock}\n${trimmedSql}`;
        }

        function stripLeadingSqlComments(sqlText) {
            const source = String(sqlText || '').replace(/\r\n/g, '\n');
            const lines = source.split('\n');
            const commentLines = [];
            let index = 0;

            while (index < lines.length) {
                const line = lines[index];
                const trimmed = line.trim();

                if (!trimmed.length) {
                    if (commentLines.length) {
                        commentLines.push('');
                    }
                    index += 1;
                    continue;
                }

                if (!trimmed.startsWith('--')) {
                    break;
                }

                commentLines.push(trimmed.replace(/^--\s?/, ''));
                index += 1;
            }

            const sql = lines.slice(index).join('\n').trim();
            const comment = commentLines.join('\n').trim();
            return { comment, sql };
        }

        function getSqlAssignmentOperatorForElement(elementObj = selectedElement) {
            return elementObj?.subtype === 'coalesce' ? '=' : '=>';
        }

        function isRestrictedFunctionModule(elementObj = selectedElement) {
            return ['history', 'coalesce', 'move2pa'].includes(elementObj?.subtype);
        }

        function normalizeRestrictedSqlFunctionName(sqlText, elementObj = selectedElement) {
            if (!isRestrictedFunctionModule(elementObj)) return String(sqlText || '');

            const expectedFunctionName = getFunctionNameForElement(elementObj);
            if (!expectedFunctionName) return String(sqlText || '');

            const { comment, sql } = stripLeadingSqlComments(sqlText);
            const normalizedSql = String(sql || '').replace(/^([A-Z_][A-Z0-9_.]*)\s*\(/i, `${expectedFunctionName}(`);
            return injectCommentIntoSql(normalizedSql, comment);
        }

        function getSqlAutocompleteArgsForElement(elementObj = selectedElement) {
            if (!elementObj) return [];

            if (elementObj.subtype === 'history') {
                return getHistorySqlArguments(getHistoryDefaults()).map(([name]) => name);
            }

            if (elementObj.subtype === 'coalesce') {
                return getCoalesceSqlArguments(getCoalesceDefaults()).map(([name]) => name);
            }

            if (elementObj.subtype === 'move2pa') {
                return getMove2paSqlArguments(getMove2paDefaults()).map(([name]) => name);
            }

            return [];
        }

        function buildSqlAutocompleteBlock(elementObj = selectedElement, usedArgs = new Set()) {
            const operator = getSqlAssignmentOperatorForElement(elementObj);
            const args = getSqlAutocompleteArgsForElement(elementObj).filter(arg => !usedArgs.has(arg));
            if (!args.length) return '';

            return args
                .map(arg => `    ${arg} ${operator} `)
                .join(',\n');
        }

        function getRestrictedSqlBodyRange(sqlText, elementObj = selectedElement) {
            if (!isRestrictedFunctionModule(elementObj)) return null;

            const functionName = getFunctionNameForElement(elementObj);
            if (!functionName) return null;

            const source = String(sqlText || '');
            const functionIndex = source.toUpperCase().indexOf(functionName.toUpperCase());
            if (functionIndex < 0) return null;

            const openParenIndex = source.indexOf('(', functionIndex + functionName.length);
            if (openParenIndex < 0) return null;

            const closeParenIndex = source.lastIndexOf(')');
            const endIndex = closeParenIndex > openParenIndex ? closeParenIndex : source.length;

            return {
                functionStart: functionIndex,
                openParenIndex,
                start: openParenIndex + 1,
                end: endIndex,
                hasClosingParen: closeParenIndex > openParenIndex
            };
        }

        function tryAutocompleteRestrictedSqlFunctionName(source, selectionStart, selectionEnd, elementObj = selectedElement) {
            if (!isRestrictedFunctionModule(elementObj) || selectionStart !== selectionEnd) return null;

            const functionName = getFunctionNameForElement(elementObj);
            if (!functionName) return null;

            const beforeCursor = source.slice(0, selectionStart);
            const afterCursor = source.slice(selectionEnd);
            const prefixMatch = beforeCursor.match(/([a-z_][a-z0-9_.]*)?$/i);
            const typedPrefix = prefixMatch?.[1] || '';
            const prefixStart = selectionStart - typedPrefix.length;
            const sqlWithoutPrefix = `${source.slice(0, prefixStart)}${afterCursor}`;

            if (sqlWithoutPrefix.trim().length) return null;
            if (typedPrefix && !functionName.toLowerCase().startsWith(typedPrefix.toLowerCase())) return null;

            return {
                value: `${source.slice(0, prefixStart)}${functionName}${afterCursor}`,
                caretPosition: prefixStart + functionName.length
            };
        }

        function buildRestrictedSqlAutocompleteValue(source, elementObj = selectedElement) {
            const bodyRange = getRestrictedSqlBodyRange(source, elementObj);
            if (!bodyRange) return null;

            const bodySource = source.slice(bodyRange.start, bodyRange.end);
            const usedArgs = new Set(Array.from(bodySource.matchAll(/([a-z_][a-z0-9_]*)\s*(=>|=)/gi)).map(match => match[1].toLowerCase()));
            const autocompleteBlock = buildSqlAutocompleteBlock(elementObj, usedArgs);
            if (!autocompleteBlock) return null;

            const trimmedBody = bodySource.trim();
            const normalizedExistingBody = trimmedBody
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length)
                .map(line => `    ${line}`)
                .join('\n');
            const replacementBody = normalizedExistingBody.length
                ? `\n${normalizedExistingBody.replace(/,\s*$/, '')},\n${autocompleteBlock}\n`
                : `\n${autocompleteBlock}\n`;

            return {
                value: `${source.slice(0, bodyRange.start)}${replacementBody});`,
                caretPosition: bodyRange.start + replacementBody.length,
                bodyRange
            };
        }

        function buildGeneratedSqlForElement(elementObj = selectedElement) {
            if (isTransformDataElement(elementObj)) {
                return '';
            }

            const functionName = getFunctionNameForElement(elementObj);
            if (!functionName) return '';

            const args = getSqlArgumentsForElement(elementObj)
                .map(([name, value]) => [name, formatSqlArgument(value)])
                .filter(([, formatted]) => formatted !== null);

            const operator = getSqlAssignmentOperatorForElement(elementObj);
            const sqlBody = !args.length
                ? `${functionName}();`
                : `${functionName}(\n${args.map(([name, formatted]) => `    ${name} ${operator} ${formatted}`).join(',\n')}\n);`;

            return injectCommentIntoSql(sqlBody, getDefaultModuleComment(elementObj));
        }

        function syncGeneratedSqlForElement(elementObj = selectedElement) {
            if (!isSqlCapableElement(elementObj)) return '';

            elementObj.generatedSql = buildGeneratedSqlForElement(elementObj);
            if (!elementObj.hasManualSqlEdits) {
                elementObj.sql = elementObj.generatedSql;
            }

            return elementObj.generatedSql;
        }

        function shouldUseManualSql(elementObj = selectedElement) {
            if (!elementObj || !elementObj.hasManualSqlEdits) return false;
            return elementObj.subtype !== 'history';
        }

        function refreshOpenSqlModalIfNeeded(elementObj = selectedElement) {
            if (!sqlEditorModal.classList.contains('active')) return;
            if (!sqlModalTargetElementId || !elementObj || sqlModalTargetElementId !== elementObj.id) return;
            if (sqlModalTextarea.value !== sqlModalOriginal) return;

            sqlModalTextarea.value = shouldUseManualSql(elementObj)
                ? (elementObj.editedSql || elementObj.sql || '')
                : syncGeneratedSqlForElement(elementObj);
            sqlModalDraft = sqlModalTextarea.value;
            sqlModalOriginal = sqlModalTextarea.value;
            setSqlEditorValidationState(validateSqlFunctionCall(sqlModalTextarea.value, elementObj));
        }

        function containsCyrillic(value) {
            return /[\u0400-\u04FF]/.test(String(value || ''));
        }

        function parseSqlLiteralValue(rawValue) {
            const value = String(rawValue || '').trim();
            if (!value.length) {
                throw new Error('Пустое значение аргумента.');
            }

            if (/^null$/i.test(value)) {
                return null;
            }

            if (/^'.*'$/.test(value)) {
                const innerValue = value.slice(1, -1);
                if (innerValue.includes("'") && !innerValue.includes("''")) {
                    throw new Error('Неверное экранирование строкового значения.');
                }
                return innerValue.replace(/''/g, "'");
            }

            if (/^".*"$/.test(value)) {
                return value.slice(1, -1).replace(/\\"/g, '"');
            }

            if (/^(true|false)$/i.test(value)) {
                return value.toLowerCase() === 'true';
            }

            if (/^-?\d+(\.\d+)?$/.test(value)) {
                return Number(value);
            }

            throw new Error('Значение должно быть строкой в кавычках, null, числом или boolean.');
        }

        function splitSqlArguments(argumentsSource) {
            const source = String(argumentsSource || '').trim();
            if (!source.length) return [];

            const chunks = [];
            let buffer = '';
            let inSingle = false;
            let inDouble = false;

            for (let i = 0; i < source.length; i++) {
                const char = source[i];
                const nextChar = source[i + 1];

                if (char === "'" && !inDouble) {
                    if (inSingle && nextChar === "'") {
                        buffer += "''";
                        i += 1;
                        continue;
                    }

                    inSingle = !inSingle;
                    buffer += char;
                    continue;
                }

                if (char === '"' && !inSingle) {
                    if (inDouble && source[i - 1] !== '\\') {
                        inDouble = false;
                    } else if (!inDouble) {
                        inDouble = true;
                    }
                    buffer += char;
                    continue;
                }

                if (char === ',' && !inSingle && !inDouble) {
                    chunks.push(buffer.trim());
                    buffer = '';
                    continue;
                }

                buffer += char;
            }

            if (inSingle || inDouble) {
                throw new Error('Незакрытая строковая кавычка в SQL.');
            }

            if (buffer.trim().length) {
                chunks.push(buffer.trim());
            }

            return chunks.filter(Boolean);
        }

        function parseSqlFunctionCall(sqlText) {
            const normalizedText = stripLeadingSqlComments(sqlText).sql;
            const functionMatch = normalizedText.match(/^([A-Z_][A-Z0-9_.]*)\s*\(([\s\S]*)\)\s*;\s*$/i);
            if (!functionMatch) {
                throw new Error('SQL должен быть вызовом функции вида FUNCTION_NAME(...);');
            }

            const functionName = functionMatch[1].toUpperCase();
            const argsText = functionMatch[2].trim();
            const args = {};

            const argEntries = splitSqlArguments(argsText);
            for (const entry of argEntries) {
                const argumentMatch = entry.match(/^([a-z_][a-z0-9_]*)\s*(=>|=)\s*([\s\S]+)$/i);
                if (!argumentMatch) {
                    throw new Error(`Некорректный аргумент: ${entry}`);
                }

                const argName = argumentMatch[1].toLowerCase();
                if (Object.prototype.hasOwnProperty.call(args, argName)) {
                    throw new Error(`Параметр '${argName}' указан более одного раза.`);
                }

                args[argName] = parseSqlLiteralValue(argumentMatch[3]);
            }

            return { functionName, args };
        }

        function validateSqlFunctionCall(sqlText, elementObj = selectedElement) {
            if (!isSqlCapableElement(elementObj)) {
                return { valid: false, error: 'Выбранный элемент не поддерживает SQL.' };
            }

            if (isTransformDataElement(elementObj)) {
                return {
                    valid: true,
                    parsed: {
                        functionName: getFunctionNameForElement(elementObj),
                        args: {}
                    }
                };
            }

            const { sql: sqlWithoutComment } = stripLeadingSqlComments(sqlText);
            if (!sqlWithoutComment) {
                return { valid: false, error: 'SQL не должен быть пустым.' };
            }

            if (containsCyrillic(sqlWithoutComment)) {
                return { valid: false, error: 'SQL не должен содержать кириллицу.' };
            }

            if (isRestrictedFunctionModule(elementObj) && !/;\s*$/.test(sqlWithoutComment)) {
                return { valid: false, error: 'SQL должен заканчиваться точкой с запятой.' };
            }

            let parsed;
            try {
                parsed = parseSqlFunctionCall(sqlText);
            } catch (error) {
                return { valid: false, error: error.message || 'Невозможно разобрать SQL.' };
            }

            const expectedFunctionName = getFunctionNameForElement(elementObj)?.toUpperCase();
            if (!expectedFunctionName || parsed.functionName !== expectedFunctionName) {
                return {
                    valid: false,
                    error: `Ожидается функция ${expectedFunctionName || 'UNKNOWN'}.`
                };
            }

            const allowedArgs = new Set(getAllowedSqlArgsForElement(elementObj));
            const canonicalArgNames = new Set();
            const normalizedArgs = {};

            for (const argName of Object.keys(parsed.args)) {
                if (!allowedArgs.has(argName)) {
                    return { valid: false, error: `Параметр '${argName}' не поддерживается.` };
                }

                const canonicalName = mapSqlArgumentNameForElement(elementObj, argName);
                if (canonicalArgNames.has(canonicalName)) {
                    return { valid: false, error: `Параметр '${argName}' дублируется.` };
                }

                canonicalArgNames.add(canonicalName);

                const enumResolved = resolveEnumValueCaseInsensitive(argName, parsed.args[argName], elementObj);
                if (!enumResolved.valid) {
                    return { valid: false, error: enumResolved.error };
                }

                normalizedArgs[argName] = enumResolved.value;
            }

            return {
                valid: true,
                parsed: {
                    functionName: parsed.functionName,
                    args: normalizedArgs
                }
            };
        }

        function setSqlEditorValidationState(validationResult) {
            const isValid = Boolean(validationResult?.valid);
            const hasChanges = sqlModalTextarea.value !== sqlModalOriginal;
            saveSqlModalBtn.disabled = !isValid || !hasChanges;
            sqlModalValidation.textContent = isValid ? '' : (validationResult?.error || 'SQL содержит ошибки.');
        }

        function applyParsedSqlToElement(elementObj, parsedResult) {
            if (!elementObj || !parsedResult?.args) return;
            if (elementObj.subtype === 'transform') {
                return;
            }
            if (elementObj.subtype === 'history') {
                const config = ensureHistoryConfig(elementObj);
                Object.entries(parsedResult.args).forEach(([argName, value]) => {
                    const configKey = mapSqlArgumentNameForElement(elementObj, argName);
                    config[configKey] = typeof value === 'string' ? value.trim() : value;
                });
                return;
            }

            if (elementObj.subtype === 'move2pa') {
                const config = ensureMove2paConfig(elementObj);
                Object.entries(parsedResult.args).forEach(([argName, value]) => {
                    config[argName] = typeof value === 'string' ? value.trim() : value;
                });
                return;
            }

            if (elementObj.subtype === 'coalesce') {
                const config = ensureCoalesceConfig(elementObj);
                Object.entries(parsedResult.args).forEach(([argName, value]) => {
                    config[argName] = typeof value === 'string' ? value.trim() : value;
                });
                return;
            }

            elementObj.sqlArgs = elementObj.sqlArgs || {};
            Object.entries(parsedResult.args).forEach(([argName, value]) => {
                elementObj.sqlArgs[argName] = typeof value === 'string' ? value.trim() : value;
            });
        }

        function renderSidebarHeader() {
            if (!propertiesHeaderTitle) return;
            if (isCheckpointSidebarActive()) {
                propertiesHeaderTitle.textContent = 'Checkpoints';
                return;
            }
            if (isSparkSidebarActive()) {
                propertiesHeaderTitle.textContent = 'Настройки Spark Session';
                return;
            }
            if (isFlinkSidebarActive()) {
                propertiesHeaderTitle.textContent = 'Flink runtime';
                return;
            }

            if (!selectedElement) {
                propertiesHeaderTitle.textContent = 'Свойства элемента';
                return;
            }

            const headerTitle = getDisplayModuleTitle(selectedElement);
            propertiesHeaderTitle.textContent = headerTitle;
        }

        function captureSnapshot() {
            sidebarHasChanges = false;
            if (isCheckpointSidebarActive()) {
                sidebarSnapshot = {
                    type: 'checkpoint',
                    checkpointActive: designerState.checkpointActive,
                    checkpointStartMode: designerState.checkpointStartMode
                };
            } else if (selectedElement) {
                sidebarSnapshot = {
                    type: 'element',
                    elementId: selectedElement.id,
                    data: JSON.parse(JSON.stringify({
                        title: selectedElement.title,
                        x: selectedElement.x,
                        y: selectedElement.y,
                        width: selectedElement.width,
                        height: selectedElement.height,
                        paramsRaw: selectedElement.paramsRaw,
                        dataSource: selectedElement.dataSource,
                        backgroundColor: selectedElement.backgroundColor,
                        moduleEnabled: selectedElement.moduleEnabled,
                        moduleComment: selectedElement.moduleComment,
                        moduleMeta: selectedElement.moduleMeta,
                        move2paConfig: selectedElement.move2paConfig,
                        coalesceConfig: selectedElement.coalesceConfig,
                        historyConfig: selectedElement.historyConfig,
                        sql: selectedElement.sql,
                        editedSql: selectedElement.editedSql,
                        generatedSql: selectedElement.generatedSql,
                        hasManualSqlEdits: selectedElement.hasManualSqlEdits
                    }))
                };
            } else {
                sidebarSnapshot = null;
            }
        }

        function restoreSnapshot() {
            if (!sidebarSnapshot) return;
            if (sidebarSnapshot.type === 'checkpoint') {
                designerState.checkpointActive = sidebarSnapshot.checkpointActive;
                designerState.checkpointStartMode = sidebarSnapshot.checkpointStartMode;
                updatePropertiesPanel();
                updateRibbonAvailability();
            } else if (sidebarSnapshot.type === 'element' && selectedElement && selectedElement.id === sidebarSnapshot.elementId) {
                Object.assign(selectedElement, sidebarSnapshot.data);
                const el = document.getElementById(selectedElement.id);
                if (el) {
                    el.style.left = `${selectedElement.x}px`;
                    el.style.top = `${selectedElement.y}px`;
                    el.style.width = `${selectedElement.width}px`;
                    el.style.height = `${selectedElement.height}px`;
                    const titleSpan = el.querySelector('.element-title');
                    if (titleSpan) titleSpan.textContent = selectedElement.title || getDisplayModuleTitle(selectedElement);
                    el.style.backgroundColor = selectedElement.backgroundColor || '';
                }
                applyModuleVisualState(selectedElement);
                applyNodeValidationState(selectedElement);
                renderDagConnections(currentPageId);
                updatePropertiesPanel();
            }
            sidebarSnapshot = null;
            sidebarHasChanges = false;
        }

        function closeSidebarPanel() {
            sidebarHasChanges = false;
            sidebarSnapshot = null;
            if (isCheckpointSidebarActive()) {
                activeSidebarModule = null;
                designerState.checkpointActive = false;
                updateRibbonAvailability();
            } else if (isEngineSidebarActive()) {
                activeSidebarModule = null;
            }
            propertiesPanel.classList.remove('active');
            updatePropertiesPanelMode();
        }

        function closeSidebarWithCheck() {
            if (sidebarHasChanges) {
                sidebarConfirmModal.classList.add('active');
            } else {
                closeSidebarPanel();
            }
        }

        function renderSqlPreviewInSidebar() {
            if (!sqlPreviewGroup || !sqlPreviewTextarea) return;

            if (!isSqlCapableElement() || isTransformDataElement()) {
                sqlPreviewGroup.style.display = 'none';
                sqlPreviewTextarea.value = '';
                return;
            }

            syncGeneratedSqlForElement(selectedElement);

            sqlPreviewGroup.style.display = 'block';
            sqlPreviewTextarea.value = shouldUseManualSql(selectedElement)
                ? (selectedElement.editedSql || selectedElement.sql || '')
                : (selectedElement.generatedSql || selectedElement.sql || '');
            refreshOpenSqlModalIfNeeded(selectedElement);
        }

        function openSqlEditorModal(elementObj = selectedElement) {
            if (!isSqlCapableElement(elementObj)) return;

            if (!elementObj) return;

            syncGeneratedSqlForElement(elementObj);

            sqlModalTargetElementId = elementObj.id;
            sqlModalOriginal = shouldUseManualSql(elementObj)
                ? (elementObj.editedSql || elementObj.sql || '')
                : (elementObj.generatedSql || elementObj.sql || '');
            sqlModalDraft = sqlModalOriginal;
            sqlModalTextarea.value = sqlModalDraft;
            sqlModalElementName.textContent = getDisplayModuleTitle(elementObj);
            sqlModalTextarea.readOnly = false;
            saveSqlModalBtn.textContent = 'Сохранить';
            setSqlEditorValidationState(validateSqlFunctionCall(sqlModalTextarea.value, elementObj));
            const sqlVarsSidebar = document.getElementById('sqlVarsSidebar');
            if (sqlVarsSidebar) {
                sqlVarsSidebar.classList.remove('collapsed');
                sqlVarsSidebar.style.display = isTransformDataElement(elementObj) ? '' : 'none';
            }
            sqlEditorModal.classList.add('active');
            syncSqlTransformVarsFromCode();
            sqlModalTextarea.focus();
        }

        function closeSqlEditorModal(discard = true) {
            if (!sqlEditorModal.classList.contains('active')) return;

            if (!discard) {
                sqlModalDraft = sqlModalTextarea.value;
            }

            sqlEditorModal.classList.remove('active');
            sqlModalTargetElementId = null;
            sqlModalOriginal = '';
            sqlModalDraft = '';
            sqlModalValidation.textContent = '';
            saveSqlModalBtn.disabled = false;
            const sqlVarsSidebar = document.getElementById('sqlVarsSidebar');
            if (sqlVarsSidebar) sqlVarsSidebar.style.display = 'none';
        }

        function saveSqlEditorModal() {
            if (!sqlModalTargetElementId) return;

            const activePage = pages.find(page => page.id === currentPageId);
            const targetElement = activePage?.elements?.find(el => el.id === sqlModalTargetElementId)
                || elements.find(el => el.id === sqlModalTargetElementId)
                || selectedElement;

            if (!targetElement) {
                closeSqlEditorModal(true);
                return;
            }

            const validationResult = validateSqlFunctionCall(sqlModalTextarea.value, targetElement);
            setSqlEditorValidationState(validationResult);
            if (!validationResult.valid) {
                return;
            }

            const parsedSqlContent = stripLeadingSqlComments(sqlModalTextarea.value);
            targetElement.moduleComment = parsedSqlContent.comment;

            applyParsedSqlToElement(targetElement, validationResult.parsed);
            targetElement.functionName = validationResult.parsed.functionName;

            targetElement.editedSql = injectCommentIntoSql(parsedSqlContent.sql, targetElement.moduleComment);
            targetElement.generatedSql = buildGeneratedSqlForElement(targetElement);
            targetElement.hasManualSqlEdits = targetElement.subtype === 'history' ? false : true;
            targetElement.sql = targetElement.subtype === 'history'
                ? targetElement.generatedSql
                : targetElement.editedSql;

            if (selectedElement && selectedElement.id === targetElement.id) {
                selectedElement.functionName = targetElement.functionName;
                selectedElement.generatedSql = targetElement.generatedSql;
                selectedElement.editedSql = targetElement.editedSql;
                selectedElement.hasManualSqlEdits = targetElement.hasManualSqlEdits;
                selectedElement.moduleComment = targetElement.moduleComment;
                selectedElement.sql = targetElement.sql;
            }

            updatePropertiesPanel();
            applyNodeValidationState(targetElement);
            renderDagConnections(currentPageId);
            renderSqlPreviewInSidebar();
            sqlModalOriginal = sqlModalTextarea.value;
            sqlModalDraft = sqlModalOriginal;
            setSqlEditorValidationState(validateSqlFunctionCall(sqlModalTextarea.value, targetElement));
            showNotification('SQL скрипт сохранен');
        }

        function updatePropertiesPanelMode() {
            const showMove2paPanel = isMove2paElement();
            const showCheckpointPanel = isCheckpointSidebarActive();
            const showEngineSparkPanel = isSparkSidebarActive();
            const showEngineFlinkPanel = isFlinkSidebarActive();
            const showCoalescePanel = isCoalesceElement();
            const showHistoryPanel = isHistoryElement();
            const hideDefaultProperties = showMove2paPanel || showCheckpointPanel || showEngineSparkPanel || showEngineFlinkPanel || showCoalescePanel || showHistoryPanel || isTransformDataElement();
            moduleSettingsGroup.style.display = (showCheckpointPanel || showEngineSparkPanel || showEngineFlinkPanel) ? 'none' : 'block';
            defaultPropertiesContent.classList.toggle('hidden', hideDefaultProperties);
            move2paPropertiesContent.classList.toggle('active', showMove2paPanel);
            checkpointPropertiesContent.classList.toggle('active', showCheckpointPanel);
            engineSparkPropertiesContent.classList.toggle('active', showEngineSparkPanel);
            engineFlinkPropertiesContent.classList.toggle('active', showEngineFlinkPanel);
            coalescePropertiesContent.classList.toggle('active', showCoalescePanel);
            historyPropertiesContent.classList.toggle('active', showHistoryPanel);

            renderSidebarHeader();
            renderSqlPreviewInSidebar();
        }

        function updateModuleMetaPanel() {
            if (!selectedElement) return;
            const meta = ensureModuleMeta(selectedElement);
            document.getElementById('moduleEnabledToggle').checked = meta.enabled;
            document.getElementById('moduleCommentInput').value = meta.comment;
        }

        function applyModuleVisualState(elementObj = selectedElement) {
            if (!elementObj?.id) return;
            const elementDom = document.getElementById(elementObj.id);
            if (!elementDom) return;

            ensureModuleMeta(elementObj);
            elementDom.style.opacity = elementObj.moduleEnabled ? '1' : '0.55';
            elementDom.style.filter = elementObj.moduleEnabled ? 'none' : 'grayscale(0.15)';
        }

        function updateMove2paPropertiesPanel() {
            if (!isMove2paElement()) return;

            const config = ensureMove2paConfig(selectedElement);
            document.getElementById('move2paPaTable').value = config.pa_table;
            document.getElementById('move2paHistTable').value = config.hist_table;
        }

        function updateCheckpointPropertiesPanel() {
            document.getElementById('checkpointManagerMode').checked = true;
            document.getElementById('checkpointStartMode').value = designerState.checkpointStartMode || 'FROM_START';
            document.getElementById('checkpointStartMode').disabled = false;
        }

        function updateCoalescePropertiesPanel() {
            if (!isCoalesceElement()) return;

            const config = ensureCoalesceConfig(selectedElement);
            document.getElementById('coalesceTables').value = config.tables;
            document.getElementById('coalesceSchema').value = config.schema;
            document.getElementById('coalesceTargetFileSize').value = config.target_file_size_mb;
            document.getElementById('coalesceCompressionCodec').value = config.compression_codec;
            document.getElementById('coalesceParallelDegree').value = config.parallel_degree;
            document.getElementById('coalesceSnapshotRetention').value = config.snapshot_retention;
            document.getElementById('coalesceRewriteManifests').checked = Boolean(config.rewrite_manifests);
            document.getElementById('coalesceDeleteOrphanFiles').checked = Boolean(config.delete_orphan_files);
            document.getElementById('coalesceIncludePartitions').value = config.include_partitions;
            document.getElementById('coalesceExcludePartitions').value = config.exclude_partitions;
            document.getElementById('coalesceAnalyzeBy').value = config.analyze_by || '';
            document.getElementById('coalesceCustomStrategy').value = config.custom_strategy;
        }

        function updateHistoryPropertiesPanel() {
            if (!isHistoryElement()) return;

            const config = ensureHistoryConfig(selectedElement);
            const modeSelect = document.getElementById('historyMode');
            const hashPolicyAlgoSelect = document.getElementById('historyHashPolicyAlgo');
            const defaults = getHistoryDefaults();

            modeSelect.value = Array.from(modeSelect.options).some(option => option.value === config.mode)
                ? config.mode
                : defaults.mode;
            document.getElementById('historyIncrTable').value = config.incr_table;
            document.getElementById('historyPaTable').value = config.pa_table;
            document.getElementById('historyHistTable').value = config.hist_table;
            document.getElementById('historyMappingInc').value = config.mapping_inc;
            document.getElementById('historyMappingPa').value = config.mapping_pa;
            document.getElementById('historyPkInc').value = config.pk_inc;
            document.getElementById('historyPkPa').value = config.pk_pa;
            const resolvedHashPolicy = resolveEnumValueCaseInsensitive('hash_policy_algo', config.hash_policy_algo || defaults.hash_policy_algo, selectedElement);
            hashPolicyAlgoSelect.value = resolvedHashPolicy.valid ? resolvedHashPolicy.value : defaults.hash_policy_algo;
            document.getElementById('historyHashPolicyExcludeCols').value = config.hash_policy_exclude_cols;
            document.getElementById('historyHashPolicyHashCol').value = config.hash_policy_hash_col;
            document.getElementById('historyDedupOrderBy').value = config.dedup_policy_on_duplicate_order_by_clause;
        }

        function applyMove2paProperties() {
            if (!isMove2paElement()) return;

            const config = ensureMove2paConfig(selectedElement);
            config.pa_table = (document.getElementById('move2paPaTable').value || '').trim();
            config.hist_table = (document.getElementById('move2paHistTable').value || '').trim();

            applyModuleVisualState(selectedElement);
            applyNodeValidationState(selectedElement);
            renderDagConnections(currentPageId);
            renderSqlPreviewInSidebar();
        }

        function applyCheckpointProperties() {
            designerState.checkpointActive = document.getElementById('checkpointManagerMode').checked;
            designerState.checkpointStartMode = document.getElementById('checkpointStartMode').value || 'FROM_START';
            document.getElementById('checkpointStartMode').disabled = !designerState.checkpointActive;
            updateRibbonAvailability();
            renderSqlPreviewInSidebar();
        }

        function applyCoalesceProperties() {
            if (!isCoalesceElement()) return;

            const defaults = getCoalesceDefaults();
            const config = ensureCoalesceConfig(selectedElement);
            const parseNumber = (id, fallback) => {
                const value = parseInt(document.getElementById(id).value, 10);
                return Number.isFinite(value) ? value : fallback;
            };

            config.tables = (document.getElementById('coalesceTables').value || '').trim();
            config.schema = (document.getElementById('coalesceSchema').value || '').trim();
            config.target_file_size_mb = parseNumber('coalesceTargetFileSize', defaults.target_file_size_mb);
            config.compression_codec = document.getElementById('coalesceCompressionCodec').value || defaults.compression_codec;
            config.parallel_degree = parseNumber('coalesceParallelDegree', defaults.parallel_degree);
            config.snapshot_retention = parseNumber('coalesceSnapshotRetention', defaults.snapshot_retention);
            config.rewrite_manifests = document.getElementById('coalesceRewriteManifests').checked;
            config.delete_orphan_files = document.getElementById('coalesceDeleteOrphanFiles').checked;
            config.include_partitions = (document.getElementById('coalesceIncludePartitions').value || '').trim();
            config.exclude_partitions = (document.getElementById('coalesceExcludePartitions').value || '').trim();
            config.analyze_by = (document.getElementById('coalesceAnalyzeBy').value || '').trim();
            config.custom_strategy = (document.getElementById('coalesceCustomStrategy').value || '').trim();

            syncGeneratedSqlForElement(selectedElement);
            if (selectedElement.hasManualSqlEdits) {
                selectedElement.editedSql = selectedElement.generatedSql;
                selectedElement.sql = selectedElement.editedSql;
            }

            applyModuleVisualState(selectedElement);
            applyNodeValidationState(selectedElement);
            renderDagConnections(currentPageId);
            renderSqlPreviewInSidebar();
        }

        function applyHistoryProperties() {
            if (!isHistoryElement()) return;

            const config = ensureHistoryConfig(selectedElement);
            config.mode = (document.getElementById('historyMode').value || '').trim() || getHistoryDefaults().mode;
            config.incr_table = (document.getElementById('historyIncrTable').value || '').trim() || getHistoryDefaults().incr_table;
            config.pa_table = (document.getElementById('historyPaTable').value || '').trim() || getHistoryDefaults().pa_table;
            config.hist_table = (document.getElementById('historyHistTable').value || '').trim() || getHistoryDefaults().hist_table;
            config.mapping_inc = (document.getElementById('historyMappingInc').value || '').trim() || getHistoryDefaults().mapping_inc;
            config.mapping_pa = (document.getElementById('historyMappingPa').value || '').trim() || getHistoryDefaults().mapping_pa;
            config.pk_inc = (document.getElementById('historyPkInc').value || '').trim() || getHistoryDefaults().pk_inc;
            config.pk_pa = (document.getElementById('historyPkPa').value || '').trim() || getHistoryDefaults().pk_pa;
            config.hash_policy_algo = document.getElementById('historyHashPolicyAlgo').value || getHistoryDefaults().hash_policy_algo;
            config.hash_policy_exclude_cols = (document.getElementById('historyHashPolicyExcludeCols').value || '').trim();
            config.hash_policy_hash_col = (document.getElementById('historyHashPolicyHashCol').value || '').trim();
            config.dedup_policy_on_duplicate_order_by_clause = (document.getElementById('historyDedupOrderBy').value || '').trim();

            applyNodeValidationState(selectedElement);
            renderDagConnections(currentPageId);
            renderSqlPreviewInSidebar();
        }

        function setupPropertiesResizer() {
            if (!propertiesResizer) return;

            let isResizing = false;

            function onMouseMove(event) {
                if (!isResizing) return;

                const minWidth = 390;
                const maxWidth = Math.floor(window.innerWidth * 0.9);
                const nextWidth = window.innerWidth - event.clientX;
                propertiesPanelWidth = Math.min(maxWidth, Math.max(minWidth, nextWidth));
                propertiesPanel.style.width = `${propertiesPanelWidth}px`;
            }

            function onMouseUp() {
                if (!isResizing) return;
                isResizing = false;
                propertiesPanel.classList.remove('resizing');
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }

            propertiesResizer.addEventListener('mousedown', function(event) {
                event.preventDefault();
                isResizing = true;
                propertiesPanel.classList.add('resizing');
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });
        }

        function setupSparkDbResizer() {
            if (!sparkDbResizer || !sparkSessionsPanel || !dbSidebar) return;

            let isDragging = false;

            function onMouseMove(event) {
                if (!isDragging) return;
                const sidebarRect = dbSidebar.getBoundingClientRect();
                const relativeY = event.clientY - sidebarRect.top;
                const minHeight = 88;
                const maxHeight = Math.max(180, Math.min(520, sidebarRect.height - 220));
                const nextHeight = Math.min(maxHeight, Math.max(minHeight, relativeY));
                sparkSessionsPanel.style.height = `${nextHeight}px`;
            }

            function onMouseUp() {
                if (!isDragging) return;
                isDragging = false;
                sparkDbResizer.classList.remove('dragging');
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }

            sparkDbResizer.addEventListener('mousedown', function(event) {
                event.preventDefault();
                if (dbSidebar.classList.contains('collapsed')) return;
                isDragging = true;
                sparkDbResizer.classList.add('dragging');
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });
        }

        function setupSqlSidebarResizer() {
            if (!dbSidebarResizer || !dbSidebar) return;

            let isDragging = false;

            function onMouseMove(event) {
                if (!isDragging) return;
                const minWidth = 220;
                const maxWidth = Math.min(620, Math.floor(window.innerWidth * 0.55));
                const panelLeft = sqlMainPanel ? sqlMainPanel.getBoundingClientRect().left : 0;
                const relativeX = event.clientX - panelLeft;
                const nextWidth = Math.min(maxWidth, Math.max(minWidth, relativeX));
                dbSidebar.style.width = `${nextWidth}px`;
            }

            function onMouseUp() {
                if (!isDragging) return;
                isDragging = false;
                dbSidebarResizer.classList.remove('dragging');
                dbSidebar.classList.remove('resizing');
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }

            dbSidebarResizer.addEventListener('mousedown', function(event) {
                event.preventDefault();
                if (dbSidebar.classList.contains('collapsed')) return;
                isDragging = true;
                dbSidebarResizer.classList.add('dragging');
                dbSidebar.classList.add('resizing');
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });
        }

        // Обработчики для View Selector
        directoryViewBtn.addEventListener('click', function() {
            if (!this.classList.contains('disabled')) {
                switchView('directory');
            }
        });

        sqlViewBtn.addEventListener('click', function() {
            if (!this.classList.contains('disabled')) {
                switchView('sql');
            }
        });

        designerViewBtn.addEventListener('click', function() {
            if (!this.classList.contains('disabled')) {
                switchView('designer');
            }
        });

        graphViewBtn.addEventListener('click', function() {
            if (!this.classList.contains('disabled')) {
                switchView('graph');
            }
        });

        // Обработчики для SQL редактора
        executeBtn.addEventListener('click', function() {
            renderLargeData();
            tabResults.click();

            if (outputPanel.classList.contains('closed')) {
                outputPanel.classList.remove('closed');
            }

            if (outputPanel.classList.contains('collapsed')) {
                outputPanel.classList.remove('collapsed');
                const icon = toggleOutputBtn.querySelector('i');
                icon.className = 'fas fa-chevron-down';
            }
        });

        cancelBtn.addEventListener('click', function() {
            console.log('Cancel clicked');
        });

        tabResults.addEventListener('click', function() {
            tabResults.classList.add('active');
            tabExplain.classList.remove('active');
            tableContainer.style.display = 'block';
            sparkPlan.style.display = 'none';
        });

        tabExplain.addEventListener('click', function() {
            tabExplain.classList.add('active');
            tabResults.classList.remove('active');
            tableContainer.style.display = 'none';
            sparkPlan.style.display = 'block';
        });

        toggleOutputBtn.addEventListener('click', function() {
            if (outputPanel.classList.contains('closed')) {
                return;
            }

            outputPanel.classList.toggle('collapsed');
            const icon = toggleOutputBtn.querySelector('i');
            if (outputPanel.classList.contains('collapsed')) {
                icon.className = 'fas fa-chevron-up';
            } else {
                icon.className = 'fas fa-chevron-down';
            }
        });

        closeOutputBtn.addEventListener('click', function() {
            outputPanel.classList.add('closed');
            outputPanel.classList.remove('collapsed');
            const icon = toggleOutputBtn.querySelector('i');
            icon.className = 'fas fa-chevron-down';
        });

        function syncSqlSidebarToggleIcon() {
            const collapsed = dbSidebar.classList.contains('collapsed');
            toggleSidebarBtn.classList.remove('fa-chevron-left', 'fa-chevron-right');
            toggleSidebarBtn.classList.add(collapsed ? 'fa-chevron-right' : 'fa-chevron-left');
            toggleSidebarBtn.title = collapsed ? 'Expand sidebar' : 'Collapse sidebar';
        }

        toggleSidebarBtn.addEventListener('click', function() {
            dbSidebar.classList.toggle('collapsed');
            syncSqlSidebarToggleIcon();
        });

        dbFilterInput.addEventListener('input', function(e) {
            const filterText = e.target.value.toLowerCase();
            const dbItems = document.querySelectorAll('.db-item');

            dbItems.forEach(item => {
                const dbName = item.getAttribute('data-db-name').toLowerCase();
                if (dbName.includes(filterText)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });

        document.querySelectorAll('.table-item').forEach(item => {
            item.addEventListener('dblclick', function(e) {
                const tableName = this.getAttribute('data-table') || this.innerText.trim();
                sqlEditor.value += ' ' + tableName + ' ';
                sqlEditor.focus();
            });
        });

        document.querySelector('.db-root[data-db="default"]').addEventListener('click', (e) => {
            if (e.target.closest('.table-item')) return;
            toggleDb('caretDefault', 'tablesDefault');
        });
        document.querySelector('.db-root[data-db="custom_b2c_ar_test"]').addEventListener('click', (e) => {
            if (e.target.closest('.table-item')) return;
            toggleDb('caretArTest', 'tablesArTest');
        });
        document.querySelector('.db-root[data-db="custom_b2c_sql_fw"]').addEventListener('click', (e) => {
            if (e.target.closest('.table-item')) return;
            toggleDb('caretSqlFw', 'tablesSqlFw');
        });

        fwVersionSelect.addEventListener('change', function() {
            const activeTabId = sqlEditor.getAttribute('data-tab');
            if (!activeTabId) return;

            const linkedSessionId = sqlTabSessionMap[activeTabId] ?? null;
            if (!linkedSessionId) {
                setConnectionStatus('disconnected');
                sqlTabConnectionState[activeTabId] = 'disconnected';
                return;
            }

            sqlTabConnectionState[activeTabId] = 'disconnected';
            setConnectionStatus('disconnected');

            setTimeout(() => {
                const stillActiveTabId = sqlEditor.getAttribute('data-tab');
                if (String(stillActiveTabId) !== String(activeTabId)) return;
                if (sqlTabSessionMap[activeTabId] !== linkedSessionId) return;
                sqlTabConnectionState[activeTabId] = 'connecting';
                setConnectionStatus('connecting');

                setTimeout(() => {
                    const finalTabId = sqlEditor.getAttribute('data-tab');
                    if (String(finalTabId) !== String(activeTabId)) return;
                    if (sqlTabSessionMap[activeTabId] !== linkedSessionId) return;
                    sqlTabConnectionState[activeTabId] = 'connected';
                    setConnectionStatus('connected');
                }, 600);
            }, 250);
        });

        // Инициализация SQL редактора
        document.querySelectorAll('.tab').forEach(tab => {
            attachSqlTabHandlers(tab);
        });

        newTabBtnHeader.addEventListener('click', () => createNewSqlTab({
            sessionId: activeSparkSessionId || null
        }));
        addSparkSessionBtn.addEventListener('click', createSparkSessionPreset);

        closeSparkConfigModal.addEventListener('click', closeSparkSessionConfigModal);
        cancelSparkConfig.addEventListener('click', closeSparkSessionConfigModal);
        saveSparkConfig.addEventListener('click', saveSparkSessionFromCode);
        closeSparkProfilesTableModal?.addEventListener('click', closeSparkProfilesTable);
        closeSparkProfilesTableBtn?.addEventListener('click', closeSparkProfilesTable);
        sparkProfilesTableModal?.addEventListener('click', function(event) {
            if (event.target === sparkProfilesTableModal) closeSparkProfilesTable();
        });
        document.addEventListener('click', function(event) {
            const menu = document.getElementById('sparkTableFilterMenu');
            if (!menu || menu.style.display !== 'block') return;
            if (menu.contains(event.target)) return;
            if (event.target.closest('.spark-table-filter-btn')) return;
            closeSparkTableFilterMenu();
        });
        closeSparkCommonTextModal?.addEventListener('click', closeSparkCommonTextEditor);
        cancelSparkCommonTextModal?.addEventListener('click', closeSparkCommonTextEditor);
        saveSparkCommonTextModal?.addEventListener('click', applySparkCommonTextEditor);
        sparkCommonTextModal?.addEventListener('click', function(event) {
            if (event.target === sparkCommonTextModal) closeSparkCommonTextEditor();
        });
        sparkConfigModal.addEventListener('click', function(event) {
            if (event.target === sparkConfigModal) {
                closeSparkSessionConfigModal();
            }
        });

        renderSparkSessions();
        setupSqlSidebarResizer();
        setupSparkDbResizer();
        syncSqlSidebarToggleIcon();
        switchSqlTab(sqlEditor.getAttribute('data-tab') || '1');

        function getNodeCardLayout(title = '', typeLabel = '') {
            const titleSize = Math.ceil(String(title || '').trim().length * 7.3);
            const typeSize = Math.ceil(String(typeLabel || '').trim().length * 6.4);
            const minWidth = Math.max(220, Math.min(460, Math.max(titleSize, typeSize) + 118));
            const minHeight = 52;
            return { minWidth, minHeight };
        }

        function applyNodeSizeConstraints(elementDom, elementObj, options = {}) {
            if (!elementDom || !elementObj) return;
            const { compactHeight = true } = options;
            const { minWidth, minHeight } = getNodeCardLayout(elementObj.title, elementObj.typeLabel);

            elementDom.style.minWidth = `${minWidth}px`;
            elementDom.style.minHeight = `${minHeight}px`;

            const currentWidth = parseInt(elementDom.style.width, 10);
            const currentHeight = parseInt(elementDom.style.height, 10);
            const nextWidth = Number.isFinite(currentWidth) ? Math.max(currentWidth, minWidth) : minWidth;
            const nextHeight = compactHeight
                ? minHeight
                : (Number.isFinite(currentHeight) ? Math.max(currentHeight, minHeight) : minHeight);

            elementDom.style.width = `${nextWidth}px`;
            elementDom.style.height = `${nextHeight}px`;

            elementObj.width = nextWidth;
            elementObj.height = nextHeight;
        }

        // Функция для создания элемента на canvas (оставлена без изменений)
        function createCanvasElement(elementData, pageId = currentPageId, options = {}) {
            const { persistInPage = true } = options;
            if (!pageId) return null;

            elementCounter++;
            const elementId = elementData.id || `element-${elementCounter}`;

            const grid = document.getElementById(`grid-${pageId}`);
            if (!grid) return null;

            const element = document.createElement('div');
            element.className = 'canvas-element';
            element.id = elementId;
            element.style.left = `${elementData.x}px`;
            element.style.top = `${elementData.y}px`;
            element.style.backgroundColor = elementData.backgroundColor || '#f7faff';
            element.style.borderColor = elementData.borderColor || '#dee2e6';
            element.style.borderWidth = `${elementData.borderWidth || 1}px`;

            let icon = 'fa-cube';
            let title = elementData.title || getDisplayModuleTitle(elementData);
            let typeLabel = getElementTypeLabel(elementData.type, elementData.subtype);

            switch(elementData.type) {
                case 'engine':
                    if (elementData.subtype === 'spark') icon = 'fab fa-stack-overflow icon-spark';
                    if (elementData.subtype === 'flink') icon = 'fas fa-bolt';
                    break;
                case 'format':
                    if (elementData.subtype === 'parquet') icon = 'fas fa-table icon-parquet';
                    if (elementData.subtype === 'iceberg') icon = 'fas fa-snowflake icon-iceberg';
                    break;
                case 'recovery':
                    if (elementData.subtype === 'checkpoint') icon = 'fas fa-check-double';
                    if (elementData.subtype === 'rollback') icon = 'fas fa-undo';
                    break;
                case 'data':
                    if (elementData.subtype === 'getdata') icon = 'fas fa-download';
                    if (elementData.subtype === 'kafka2hdfs') icon = 'fas fa-stream icon-kafka';
                    if (elementData.subtype === 's2t') icon = 'fas fa-exchange-alt';
                    break;
                case 'query':
                    if (elementData.subtype === 'transform') icon = 'fas fa-cogs';
                    if (elementData.subtype === 'history') icon = 'fas fa-history';
                    if (elementData.subtype === 'quality') icon = 'fas fa-award';
                    if (elementData.subtype === 'reconciliation') icon = 'fas fa-balance-scale';
                    break;
                case 'insert':
                    if (elementData.subtype === 'hdfs2hbase') icon = 'fas fa-database icon-hbase';
                    if (elementData.subtype === 'hdfs2kafka') icon = 'fas fa-stream icon-kafka';
                    if (elementData.subtype === 'move2pa') icon = 'fas fa-share-square';
                    if (elementData.subtype === 'coalesce') icon = 'fas fa-compress';
                    break;
                case 'share':
                    if (elementData.subtype === 'deploy') icon = 'fab fa-jenkins icon-jenkins';
                    break;
                case 'help':
                    if (elementData.subtype === 'documentation') icon = 'fas fa-book';
                    if (elementData.subtype === 'api') icon = 'fas fa-code';
                    if (elementData.subtype === 'tutorial') icon = 'fas fa-graduation-cap';
                    break;
                case 'support':
                    if (elementData.subtype === 'forum') icon = 'fas fa-comments';
                    if (elementData.subtype === 'ticket') icon = 'fas fa-ticket-alt';
                    if (elementData.subtype === 'contact') icon = 'fas fa-headset';
                    break;
            }

            const taskId = elementData.taskId || `${(elementData.type || 'task')}_${(elementData.subtype || 'node')}_${elementCounter}`;

            element.innerHTML = `
                <div class="element-header">
                    <i class="${icon}"></i>
                    <div class="element-meta">
                        <span class="element-title">${title}</span>
                        <span class="element-type">${typeLabel}</span>
                    </div>
                    <div class="element-actions" role="group" aria-label="Действия узла">
                        <button class="element-action-btn open-settings" type="button" title="Свойства"><i class="fas fa-sliders-h"></i></button>
                        <button class="element-action-btn duplicate-element" type="button" title="Дублировать"><i class="far fa-copy"></i></button>
                        <button class="element-action-btn delete delete-element" type="button" title="Удалить"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                                <button class="element-port in" type="button" data-element-id="${elementId}" title="Вход"></button>
                <button class="element-port out" type="button" data-element-id="${elementId}" title="Выход"></button>
                <div class="element-resize"></div>
            `;

            grid.appendChild(element);

            const elementObj = {
                id: elementId,
                type: elementData.type,
                subtype: elementData.subtype,
                x: elementData.x,
                y: elementData.y,
                width: elementData.width,
                height: elementData.height,
                title: title,
                typeLabel: typeLabel,
                backgroundColor: elementData.backgroundColor,
                borderColor: elementData.borderColor,
                borderWidth: elementData.borderWidth,
                move2paConfig: elementData.move2paConfig,
                coalesceConfig: elementData.coalesceConfig,
                historyConfig: elementData.historyConfig,
                moduleEnabled: typeof elementData.moduleEnabled === 'boolean' ? elementData.moduleEnabled : true,
                moduleComment: String(elementData.moduleComment || '').trim(),
                functionName: elementData.functionName,
                generatedSql: elementData.generatedSql || '',
                editedSql: elementData.editedSql || '',
                hasManualSqlEdits: Boolean(elementData.hasManualSqlEdits),
                sql: elementData.sql,
                taskId
            };

            if (elementObj.type === 'insert' && elementObj.subtype === 'move2pa') {
                ensureMove2paConfig(elementObj);
            }

            if (elementObj.type === 'insert' && elementObj.subtype === 'coalesce') {
                ensureCoalesceConfig(elementObj);
            }

            ensureModuleMeta(elementObj);
            applyNodeSizeConstraints(element, elementObj, { compactHeight: true });
            applyModuleVisualState(elementObj);

            if (elementObj.type === 'query' && elementObj.subtype === 'history') {
                ensureHistoryConfig(elementObj);
            }

            if (isSqlCapableElement(elementObj)) {
                if (!elementObj.functionName) {
                    elementObj.functionName = getFunctionNameForElement(elementObj);
                }

                syncGeneratedSqlForElement(elementObj);

                if (elementObj.hasManualSqlEdits && elementObj.editedSql) {
                    elementObj.sql = elementObj.editedSql;
                }
            }

            elements.push(elementObj);

            const page = pages.find(p => p.id === pageId);
            if (page && persistInPage) {
                page.elements.push(elementObj);
            }

            setupElementEvents(element, elementObj);
            applyNodeValidationState(elementObj);
            updateGraphValidationIndicator(pageId);

            updateElementsCount();

            return elementObj;
        }

        function getElementTitle(type, subtype) {
            const titles = {
                engine: {
                    spark: 'Spark Engine',
                    flink: 'Flink Engine'
                },
                recovery: {
                    checkpoint: 'Checkpoints',
                    rollback: 'Rollback'
                },
                data: {
                    getdata: 'Get Data Source',
                    kafka2hdfs: 'Kafka to HDFS',
                    s2t: 'Stream to Table'
                },
                query: {
                    transform: 'ICEBERG.TRANSFORM',
                    history: 'ICEBERG.HISTORICITY',
                    quality: 'ICEBERG.QUALITY_CHECK',
                    reconciliation: 'ICEBERG.RECONCILIATION'
                },
                insert: {
                    hdfs2hbase: 'HDFS to HBase',
                    hdfs2kafka: 'HDFS to Kafka',
                    move2pa: 'Move2PA',
                    coalesce: 'Coalesce'
                },
                share: {
                    deploy: 'Deploy to Jenkins'
                },
                help: {
                    documentation: 'Documentation',
                    api: 'API Reference',
                    tutorial: 'Tutorials'
                },
                support: {
                    forum: 'Support Forum',
                    ticket: 'Support Ticket',
                    contact: 'Contact Support'
                }
            };

            return titles[type]?.[subtype] || `${type}/${subtype}`;
        }

        function getElementTypeLabel(type, subtype) {
            const labels = {
                engine: 'Engine',
                format: 'Table Format',
                recovery: 'Recovery',
                data: 'Data Operation',
                query: 'DWH Services',
                insert: 'DWH Services',
                share: 'Share',
                help: 'Help',
                support: 'Support'
            };

            return labels[type] || type;
        }

        function setupElementEvents(element, elementObj) {
            const inPort = element.querySelector('.element-port.in');
            const outPort = element.querySelector('.element-port.out');

            element.addEventListener('click', function(e) {
                if (!e.target.closest('.element-actions') &&
                    !e.target.classList.contains('element-resize') &&
                    !e.target.classList.contains('element-port')) {
                    selectElement(element, elementObj, { append: e.ctrlKey || e.metaKey });
                }
            });

            element.addEventListener('dblclick', function(e) {
                if (e.target.closest('.element-actions') ||
                    e.target.classList.contains('element-resize') ||
                    e.target.classList.contains('element-port')) {
                    return;
                }

                selectElement(element, elementObj, { append: e.ctrlKey || e.metaKey, openSidebar: true });

                if (!e.ctrlKey && !e.metaKey && isTransformDataElement(elementObj)) {
                    openTransformSqlEditor(elementObj);
                }
            });

            if (inPort) {
                inPort.addEventListener('mousedown', function(e) {
                    e.stopPropagation();
                });
            }

            if (outPort) {
                outPort.addEventListener('mousedown', function(e) {
                    beginConnectionDrag(elementObj, e);
                });
            }

            element.querySelector('.delete-element').addEventListener('click', function(e) {
                e.stopPropagation();
                deleteElement(element, elementObj);
            });

            const settingsButton = element.querySelector('.open-settings');
            if (settingsButton) {
                settingsButton.addEventListener('click', function(e) {
                    e.stopPropagation();
                    selectElement(element, elementObj);
                });
            }

            const duplicateButton = element.querySelector('.duplicate-element');
            if (duplicateButton) {
                duplicateButton.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const page = pages.find(p => p.id === currentPageId);
                    if (!page) return;
                    const duplicateData = JSON.parse(JSON.stringify(elementObj));
                    duplicateData.id = null;
                    duplicateData.x = (elementObj.x || 0) + 36;
                    duplicateData.y = (elementObj.y || 0) + 30;
                    const duplicatedElement = createCanvasElement(duplicateData, currentPageId, { persistInPage: true });
                    if (duplicatedElement) {
                        selectElement(document.getElementById(duplicatedElement.id), duplicatedElement);
                        renderDagConnections(currentPageId);
                    }
                });
            }

            let isDragging = false;
            let startX, startY;
            let dragTargets = [];

            element.addEventListener('mousedown', function(e) {
                if (e.button !== 0) return;

                if (e.target.classList.contains('element-port') || e.target.closest('.element-actions')) {
                    return;
                }
                if (e.target.classList.contains('element-resize')) {
                    startResize(element, elementObj, e);
                } else {
                    if (e.ctrlKey || e.metaKey) {
                        selectElement(element, elementObj, { append: true });
                    } else if (!selectedElements.some(item => item.id === elementObj.id)) {
                        selectElement(element, elementObj);
                    }

                    isDragging = true;
                    startX = e.clientX;
                    startY = e.clientY;

                    const activeSelection = selectedElements.some(item => item.id === elementObj.id)
                        ? selectedElements
                        : [elementObj];

                    dragTargets = activeSelection.map(item => {
                        const targetElement = document.getElementById(item.id);
                        return {
                            dom: targetElement,
                            data: item,
                            startLeft: parseInt(targetElement?.style.left) || 0,
                            startTop: parseInt(targetElement?.style.top) || 0
                        };
                    }).filter(item => item.dom && item.data);

                    dragTargets.forEach(target => {
                        target.dom.style.zIndex = 100;
                    });

                    document.addEventListener('mousemove', dragElement);
                    document.addEventListener('mouseup', stopDragElement);
                }
            });

            function dragElement(e) {
                if (!isDragging) return;
                e.preventDefault();

                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;

                dragTargets.forEach(target => {
                    const newLeft = Math.max(0, target.startLeft + deltaX);
                    const newTop = Math.max(0, target.startTop + deltaY);

                    target.dom.style.left = `${newLeft}px`;
                    target.dom.style.top = `${newTop}px`;

                    target.data.x = newLeft;
                    target.data.y = newTop;
                });

                updatePropertiesPanel();
                renderDagConnections(currentPageId);
            }

            function stopDragElement() {
                isDragging = false;
                dragTargets.forEach(target => {
                    target.dom.style.zIndex = 10;
                });
                dragTargets = [];
                document.removeEventListener('mousemove', dragElement);
                document.removeEventListener('mouseup', stopDragElement);
                renderDagConnections(currentPageId);
            }

            function startResize(element, elementObj, e) {
                e.stopPropagation();

                const startWidth = parseInt(element.style.width) || 100;
                const startHeight = parseInt(element.style.height) || 80;
                const startX = e.clientX;
                const startY = e.clientY;

                function resizeElement(e) {
                    const deltaX = e.clientX - startX;
                    const deltaY = e.clientY - startY;

                    const { minWidth, minHeight } = getNodeCardLayout(elementObj.title, elementObj.typeLabel);
                    const newWidth = Math.max(minWidth, startWidth + deltaX);
                    const newHeight = Math.max(minHeight, startHeight + deltaY);

                    element.style.width = `${newWidth}px`;
                    element.style.height = `${newHeight}px`;

                    elementObj.width = newWidth;
                    elementObj.height = newHeight;

                    updatePropertiesPanel();
                    renderDagConnections(currentPageId);
                }

                function stopResize() {
                    document.removeEventListener('mousemove', resizeElement);
                    document.removeEventListener('mouseup', stopResize);
                }

                document.addEventListener('mousemove', resizeElement);
                document.addEventListener('mouseup', stopResize);
            }
        }

        function setSelection(elementsToSelect, options = {}) {
            const { append = false, storeSelection = true, openSidebar = false } = options;
            const validElements = (elementsToSelect || []).filter(Boolean);

            if (!append) {
                selectedElements = [];
            }

            validElements.forEach(item => {
                if (!selectedElements.some(existing => existing.id === item.id)) {
                    selectedElements.push(item);
                }
            });

            const selectedIds = new Set(selectedElements.map(item => item.id));
            document.querySelectorAll('.canvas-element').forEach(el => {
                const isNodeSelected = selectedIds.has(el.id);
                el.classList.toggle('selected', isNodeSelected);
                el.classList.toggle('is-selected', isNodeSelected);
            });
            renderDagConnections(currentPageId);

            selectedElement = selectedElements.length > 0 ? selectedElements[selectedElements.length - 1] : null;

            if (!selectedElement) {
                closeSqlEditorModal(true);
                const shouldKeepPinnedSidebar = currentView === 'designer' && (isCheckpointSidebarActive() || isEngineSidebarActive());
                propertiesPanel.classList.toggle('active', shouldKeepPinnedSidebar);
                if (!shouldKeepPinnedSidebar) {
                    sidebarHasChanges = false;
                    sidebarSnapshot = null;
                }
                updatePropertiesPanelMode();
                if (shouldKeepPinnedSidebar) {
                    updatePropertiesPanel();
                }
                if (storeSelection && currentDatamartId && datamarts[currentDatamartId]) {
                    datamarts[currentDatamartId].selectedElementId = null;
                    datamarts[currentDatamartId].selectedElementPageId = null;
                }
                return;
            }

            const wasSidebarActive = propertiesPanel.classList.contains('active');
            const prevSnapshotElementId = sidebarSnapshot ? sidebarSnapshot.elementId : null;

            activeSidebarModule = null;
            updatePropertiesPanelOffset();
            const shouldRenderSidebar = shouldRenderSidebarForElement(selectedElement);
            const shouldActivateSidebar = currentView === 'designer' && shouldRenderSidebar && (openSidebar || propertiesPanel.classList.contains('active'));
            propertiesPanel.classList.toggle('active', shouldActivateSidebar);
            updatePropertiesPanelMode();
            if (shouldActivateSidebar) {
                updatePropertiesPanel();
                if (!wasSidebarActive || prevSnapshotElementId !== selectedElement.id) {
                    captureSnapshot();
                }
            }

            if (storeSelection && currentDatamartId && datamarts[currentDatamartId]) {
                datamarts[currentDatamartId].selectedElementId = selectedElement.id;
                datamarts[currentDatamartId].selectedElementPageId = currentPageId;
            }
        }

        function clearElementSelection(clearStoredSelection = false) {
            setSelection([], { append: false, storeSelection: clearStoredSelection });
        }

        function selectElement(element, elementObj, options = {}) {
            const append = Boolean(options.append);
            const openSidebar = Boolean(options.openSidebar);
            setSelection([elementObj], { append, storeSelection: true, openSidebar });
        }

        function deleteElement(element, elementObj) {
            recordDeletedElements(currentPageId, [elementObj]);
            element.remove();

            const page = pages.find(p => p.id === currentPageId);
            if (page) {
                const index = page.elements.findIndex(el => el.id === elementObj.id);
                if (index !== -1) {
                    page.elements.splice(index, 1);
                }
            }

            const elementsIndex = elements.findIndex(el => el.id === elementObj.id);
            if (elementsIndex !== -1) {
                elements.splice(elementsIndex, 1);
            }

            removeConnectionsForElement(elementObj.id, currentPageId);

            const remainingSelection = selectedElements.filter(item => item.id !== elementObj.id);
            if (remainingSelection.length !== selectedElements.length) {
                setSelection(remainingSelection, { append: false, storeSelection: true });
            }

            updateElementsCount();
            updateGraphValidationIndicator(currentPageId);

            showNotification('Элемент удален');
        }

        function updatePropertiesPanel() {
            if (!selectedElements.length && !isCheckpointSidebarActive() && !isEngineSidebarActive()) return;

            updatePropertiesPanelMode();
            updateModuleMetaPanel();

            if (isCheckpointSidebarActive()) {
                updateCheckpointPropertiesPanel();
                return;
            }
            if (isEngineSidebarActive()) {
                if (isSparkSidebarActive()) renderEngineSparkSidebarPanel();
                return;
            }

            if (isMove2paElement()) {
                updateMove2paPropertiesPanel();
                return;
            }

            if (isCoalesceElement()) {
                updateCoalescePropertiesPanel();
                return;
            }

            if (isHistoryElement()) {
                updateHistoryPropertiesPanel();
                return;
            }

            if (isTransformDataElement()) {
                return;
            }

            ensureModuleMeta(selectedElement);
            document.getElementById('propTitle').value = selectedElement.title || '';
            document.getElementById('propType').value = selectedElement.typeLabel || '';
            document.getElementById('propX').value = selectedElement.x || 0;
            document.getElementById('propY').value = selectedElement.y || 0;
            document.getElementById('propWidth').value = selectedElement.width || 120;
            document.getElementById('propHeight').value = selectedElement.height || 100;
            document.getElementById('propParams').value = selectedElement.paramsRaw || '';
            document.getElementById('propDataSource').value = selectedElement.dataSource || '';

            document.querySelectorAll('.color-option').forEach(option => {
                option.classList.remove('selected');
                if (option.dataset.color === selectedElement.backgroundColor) {
                    option.classList.add('selected');
                }
            });

            renderSqlPreviewInSidebar();
        }

        function applyProperties() {
            if (!selectedElements.length && !isCheckpointSidebarActive()) return;

            if (isCheckpointSidebarActive()) {
                applyCheckpointProperties();
                return;
            }

            if (isMove2paElement()) {
                applyMove2paProperties();
                return;
            }

            if (isCoalesceElement()) {
                applyCoalesceProperties();
                return;
            }

            if (isHistoryElement()) {
                applyHistoryProperties();
                return;
            }

            const element = document.getElementById(selectedElement.id);
            if (!element) return;

            ensureModuleMeta(selectedElement);
            selectedElement.title = document.getElementById('propTitle').value;
            selectedElement.x = parseInt(document.getElementById('propX').value) || 0;
            selectedElement.y = parseInt(document.getElementById('propY').value) || 0;
            selectedElement.width = parseInt(document.getElementById('propWidth').value) || 120;
            selectedElement.height = parseInt(document.getElementById('propHeight').value) || 100;
            selectedElement.paramsRaw = (document.getElementById('propParams').value || '').trim();
            selectedElement.dataSource = (document.getElementById('propDataSource').value || '').trim();

            if (isSqlCapableElement()) {
                selectedElement.sqlArgs = {
                    params: selectedElement.paramsRaw,
                    data_source: selectedElement.dataSource
                };
            }

            element.style.left = `${selectedElement.x}px`;
            element.style.top = `${selectedElement.y}px`;
            element.style.width = `${selectedElement.width}px`;
            element.style.height = `${selectedElement.height}px`;

            const titleSpan = element.querySelector('.element-title');
            if (titleSpan) {
                titleSpan.textContent = selectedElement.title || getDisplayModuleTitle(selectedElement);
            }

            applyNodeSizeConstraints(element, selectedElement, { compactHeight: true });

            const selectedColor = document.querySelector('.color-option.selected');
            if (selectedColor) {
                selectedElement.backgroundColor = selectedColor.dataset.color;
                element.style.backgroundColor = selectedElement.backgroundColor;
            }

            applyModuleVisualState(selectedElement);
            applyNodeValidationState(selectedElement);
            renderDagConnections(currentPageId);
            renderSqlPreviewInSidebar();
        }


        function setupHistoryOptionalFieldsToggle() {
            if (!historyOptionalToggle || !historyOptionalFields) return;

            historyOptionalToggle.addEventListener('click', function() {
                const isCollapsed = historyOptionalFields.classList.toggle('collapsed');
                historyOptionalToggle.setAttribute('aria-expanded', String(!isCollapsed));
            });
        }

        document.querySelectorAll('.property-input').forEach(input => {
            input.addEventListener('change', applyProperties);
        });

        document.getElementById('checkpointStartMode').addEventListener('change', applyCheckpointProperties);

        document.querySelectorAll('.move2pa-input').forEach(input => {
            const eventName = input.tagName === 'SELECT' ? 'change' : 'input';
            input.addEventListener(eventName, applyMove2paProperties);
        });

        document.querySelectorAll('.coalesce-input').forEach(input => {
            const eventName = input.tagName === 'SELECT' || input.type === 'checkbox' ? 'change' : 'input';
            input.addEventListener(eventName, applyCoalesceProperties);
        });

        moduleEnabledToggle.addEventListener('change', function() {
            if (!selectedElement) return;
            ensureModuleMeta(selectedElement);
            selectedElement.moduleEnabled = moduleEnabledToggle.checked;
            applyModuleVisualState(selectedElement);
            renderSqlPreviewInSidebar();
        });

        moduleCommentInput.addEventListener('input', function() {
            if (!selectedElement) return;
            ensureModuleMeta(selectedElement);
            selectedElement.moduleComment = String(moduleCommentInput.value || '').trim();

            if (selectedElement.hasManualSqlEdits && selectedElement.editedSql) {
                const parsedSql = stripLeadingSqlComments(selectedElement.editedSql);
                selectedElement.editedSql = injectCommentIntoSql(parsedSql.sql, selectedElement.moduleComment);
                selectedElement.sql = selectedElement.editedSql;
            }

            syncGeneratedSqlForElement(selectedElement);
            renderSqlPreviewInSidebar();
            refreshOpenSqlModalIfNeeded(selectedElement);
        });

        document.querySelectorAll('.history-input').forEach(input => {
            const eventName = input.tagName === 'SELECT' ? 'change' : 'input';
            input.addEventListener(eventName, applyHistoryProperties);
        });

        document.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', function() {
                document.querySelectorAll('.color-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                this.classList.add('selected');
                applyProperties();
            });
        });

        setupHistoryOptionalFieldsToggle();

        // Track sidebar changes on any input/change inside properties panel
        propertiesPanel.addEventListener('input', function() { sidebarHasChanges = true; });
        propertiesPanel.addEventListener('change', function() { sidebarHasChanges = true; });

        // Properties panel close button
        propertiesCloseBtn.addEventListener('click', function() {
            if (currentView === 'graph') {
                closeGraphNodeSidebar();
            } else {
                closeSidebarWithCheck();
            }
        });

        // Properties panel footer buttons
        propertiesSaveBtn.addEventListener('click', function() {
            captureSnapshot();
        });

        propertiesDiscardBtn.addEventListener('click', function() {
            restoreSnapshot();
            closeSidebarPanel();
        });

        // Confirmation modal buttons
        sidebarConfirmSaveBtn.addEventListener('click', function() {
            sidebarConfirmModal.classList.remove('active');
            closeSidebarPanel();
        });

        sidebarConfirmDiscardBtn.addEventListener('click', function() {
            sidebarConfirmModal.classList.remove('active');
            restoreSnapshot();
            closeSidebarPanel();
        });

        sidebarConfirmCancelBtn.addEventListener('click', function() {
            sidebarConfirmModal.classList.remove('active');
        });

        document.querySelectorAll('.ribbon-item:not(.button)').forEach(item => {
            item.addEventListener('mousedown', function(e) {
                if (this.classList.contains('disabled')) return;
                const type = this.dataset.type;
                const subtype = this.dataset.subtype;
                const sourceItem = this;

                // Ghost element — красивый плавающий клон
                const ghost = this.cloneNode(true);
                ghost.classList.add('ribbon-drag-ghost');
                ghost.style.left = `${e.clientX - 40}px`;
                ghost.style.top = `${e.clientY - 40}px`;
                ghost.style.width = `${this.offsetWidth}px`;
                document.body.appendChild(ghost);

                // Слегка затемняем оригинальный элемент
                sourceItem.classList.add('dragging');

                let dropPlaceholder = null;
                let activeGrid = null;

                function getActiveGrid() {
                    const activePage = document.querySelector('.canvas-page.active');
                    return activePage ? activePage.querySelector('.designer-grid') : null;
                }

                function dragMove(e) {
                    ghost.style.left = `${e.clientX - 40}px`;
                    ghost.style.top = `${e.clientY - 40}px`;

                    const grid = getActiveGrid();
                    if (!grid) return;

                    const canvasRect = grid.getBoundingClientRect();
                    const isOver = e.clientX >= canvasRect.left && e.clientX <= canvasRect.right &&
                                   e.clientY >= canvasRect.top && e.clientY <= canvasRect.bottom;

                    if (isOver) {
                        if (activeGrid !== grid) {
                            if (activeGrid) activeGrid.classList.remove('ribbon-drag-over');
                            grid.classList.add('ribbon-drag-over');
                            activeGrid = grid;
                        }
                        // Показываем placeholder там, где упадёт элемент
                        if (!dropPlaceholder) {
                            dropPlaceholder = document.createElement('div');
                            dropPlaceholder.className = 'ribbon-drop-placeholder';
                            grid.appendChild(dropPlaceholder);
                        }
                        const x = e.clientX - canvasRect.left - 80;
                        const y = e.clientY - canvasRect.top - 50;
                        dropPlaceholder.style.left = `${Math.max(0, x)}px`;
                        dropPlaceholder.style.top = `${Math.max(0, y)}px`;
                    } else {
                        if (activeGrid) {
                            activeGrid.classList.remove('ribbon-drag-over');
                            activeGrid = null;
                        }
                        if (dropPlaceholder) {
                            dropPlaceholder.remove();
                            dropPlaceholder = null;
                        }
                    }
                }

                function dragEnd(e) {
                    document.removeEventListener('mousemove', dragMove);
                    document.removeEventListener('mouseup', dragEnd);

                    ghost.remove();
                    sourceItem.classList.remove('dragging');

                    if (activeGrid) activeGrid.classList.remove('ribbon-drag-over');
                    if (dropPlaceholder) { dropPlaceholder.remove(); dropPlaceholder = null; }

                    const grid = getActiveGrid();
                    if (grid) {
                        const canvasRect = grid.getBoundingClientRect();
                        if (e.clientX >= canvasRect.left && e.clientX <= canvasRect.right &&
                            e.clientY >= canvasRect.top && e.clientY <= canvasRect.bottom) {

                            const x = e.clientX - canvasRect.left - 80;
                            const y = e.clientY - canvasRect.top - 50;

                            const elementData = {
                                type: type,
                                subtype: subtype,
                                x: Math.max(0, x),
                                y: Math.max(0, y),
                                width: 160,
                                height: 140,
                                title: getDisplayModuleTitle(type, subtype)
                            };

                            const created = createCanvasElement(elementData, currentPageId);
                            if (created) {
                                // Анимация появления нового элемента
                                const domEl = document.getElementById(created.id);
                                if (domEl) {
                                    domEl.classList.add('spawning');
                                    domEl.addEventListener('animationend', () => domEl.classList.remove('spawning'), { once: true });
                                }
                            }
                            showNotification(`Добавлен элемент: ${getDisplayModuleTitle(type, subtype)}`);
                        }
                    }
                }

                document.addEventListener('mousemove', dragMove);
                document.addEventListener('mouseup', dragEnd);
            });
        });

        // Sidebar closes only via × button - removed outside-click close for checkpoint

        // Обработчики для модальных окон и навигации
        function openCreateDatamartModal() {
            pmResetForm();
            pmUpdatePath();
            pmRenderLineupChips();
            pmRenderMatrix();
            createModal.classList.add('active');
            const firstInput = document.getElementById('pm_dv_display_name');
            if (firstInput) setTimeout(() => firstInput.focus(), 60);
        }

        function openImportDatamartModal() {
            if (!importDatamartModal) return;
            importDatamartBitbucketLink.value = '';
            importDatamartModal.classList.add('active');
            setTimeout(() => importDatamartBitbucketLink?.focus(), 60);
        }

        function closeImportModal() {
            if (!importDatamartModal) return;
            importDatamartModal.classList.remove('active');
            if (importDatamartBitbucketLink) importDatamartBitbucketLink.value = '';
        }

        addTile.addEventListener('click', function(event) {
            event.stopPropagation();
            if (!addTileContextMenu) {
                openCreateDatamartModal();
                return;
            }
            const shouldOpen = !addTileContextMenu.classList.contains('open');
            closeAllTileContextMenus();
            addTileContextMenu.classList.toggle('open', shouldOpen);
        });

        addTileContextMenu?.querySelectorAll('[data-create-action]').forEach(button => {
            button.addEventListener('click', function(event) {
                event.stopPropagation();
                const action = this.dataset.createAction;
                closeAllTileContextMenus();
                if (action === 'new') {
                    openCreateDatamartModal();
                    return;
                }
                if (action === 'import') {
                    openImportDatamartModal();
                    return;
                }
                if (action === 'migrate') {
                    showNotification('Миграция с Hermes будет доступна в следующей версии');
                }
            });
        });

        function closeCreateModal() {
            createModal.classList.remove('active');
            pmResetForm();
        }

        closeModal.addEventListener('click', closeCreateModal);
        cancelCreate.addEventListener('click', closeCreateModal);
        closeImportDatamartModal?.addEventListener('click', closeImportModal);
        cancelImportDatamartBtn?.addEventListener('click', closeImportModal);
        importDatamartModal?.addEventListener('click', function(event) {
            if (event.target === importDatamartModal) closeImportModal();
        });
        importDatamartSubmitBtn?.addEventListener('click', function() {
            const link = String(importDatamartBitbucketLink?.value || '').trim();
            if (!link) {
                showNotification('Укажите ссылку BitBucket для импорта');
                importDatamartBitbucketLink?.focus();
                return;
            }
            showNotification('Импорт витрины запущен');
            closeImportModal();
        });
        closeEditModal.addEventListener('click', closeDatamartEditModal);
        cancelEdit.addEventListener('click', closeDatamartEditModal);
        closeDeployModalBtn?.addEventListener('click', closeDeployModal);
        cancelDeployModalBtn?.addEventListener('click', closeDeployModal);
        closeDeployResultModalBtn?.addEventListener('click', closeDeployResultModal);
        okDeployResultModalBtn?.addEventListener('click', closeDeployResultModal);
        deployResultModal?.addEventListener('click', function(event) {
            if (event.target === deployResultModal) closeDeployResultModal();
        });
        deployScenarioButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                setDeployScenario(this.dataset.deployScenario);
            });
        });
        deployModeStd?.addEventListener('click', () => deploySetMode('std'));
        deployModePar?.addEventListener('click', () => deploySetMode('par'));
        deployVersionInput?.addEventListener('input', deployUpdatePath);
        deployAccountInput?.addEventListener('input', deployUpdatePath);
        deployFlowToggleAll?.addEventListener('change', function() {
            const flows = getDeployFlowOptions();
            deploySettings.flows = this.checked ? flows.map(flow => flow.id) : [];
            renderDeployFlowPicker();
        });
        saveDeployModalBtn?.addEventListener('click', function() {
            deploySettings.mode = deployModeStd?.classList.contains('active') ? 'std' : 'par';
            deploySettings.version = (deployVersionInput?.value || '').trim() || 'v1.0';
            deploySettings.account = (deployAccountInput?.value || '').trim() || 'ivanov_ii';
            deployUpdatePath();
            closeDeployModal();
            deployResultModal?.classList.add('active');
        });

        document.getElementById('editPassportBtn').addEventListener('click', setEditModeForActiveTab);
        document.getElementById('discardEditBtn').addEventListener('click', function() {
            const datamartId = document.getElementById('editDatamartId').value;
            const datamart = datamarts[datamartId];
            const activeTab = document.querySelector('.modal-tab-pane.active')?.dataset.editPane;
            if (datamart) {
                const p = datamart.passport || {};
                if (activeTab === 'datamartParams') {
                    editMartState = {
                        activeCluster: '',
                        byCluster: JSON.parse(JSON.stringify(p.martByCluster || {})),
                        sections: editMartDefaultSections()
                    };
                    setDatamartViewMode();
                    return;
                }
                if (activeTab === 'flowParams') {
                    editFlowState.sqlVars = JSON.parse(JSON.stringify(p.flowSqlByWorkflow || editFlowState.sqlVars));
                    editFlowState.frameworkVars = JSON.parse(JSON.stringify(p.flowFrameworkByWorkflow || {}));
                    editFlowState.profilesByWorkflow = JSON.parse(JSON.stringify(p.flowProfilesByWorkflow || {}));
                    editFlowState.sparkCommonParamsByWorkflow = JSON.parse(JSON.stringify(p.flowCommonParamsByWorkflow || {}));
                    setFlowViewMode();
                    return;
                }
                document.getElementById('edit_pm_display_name').value = datamart.name || '';
                document.getElementById('edit_pm_owner').value = datamart.owner || '';
                document.getElementById('edit_pm_block').value = p.block || '';
                document.getElementById('edit_pm_datamart_group').value = p.datamartGroup || '';
                document.getElementById('edit_pm_datamart_name').value = p.datamartName || '';
                document.getElementById('edit_pm_ci_it_service').value = p.ciItService || '';
                document.getElementById('edit_pm_ci_as_fp').value = p.ciAsFp || '';
                document.getElementById('edit_pm_sq_pr_key').value = p.sqPrKey || '';
                document.getElementById('edit_pm_emails').value = p.emails || '';
                document.getElementById('edit_pm_external_libs').value = p.externalLibs || '';
                editPmCurrentLineup = p.lineup || 'cxb2c';
                editPmChecked = {};
                (p.clusters || []).forEach(clusterName => {
                    const lineup = PM_LINEUPS[editPmCurrentLineup] || {};
                    PM_CONTOURS.forEach(contour => {
                        const list = lineup[contour] || [];
                        const idx = list.indexOf(clusterName);
                        if (idx !== -1) editPmChecked[pmClId(editPmCurrentLineup, contour, idx)] = true;
                    });
                });
                editPmUpdateHdfsPath();
            }
            setPassportViewMode();
        });
        editTabButtons.forEach(button => {
            button.addEventListener('click', function() {
                switchEditTab(this.dataset.editTab);
            });
        });
        function closeSqlEditorModalWithCheck() {
            if (!sqlEditorModal.classList.contains('active')) return;
            if (sqlModalTextarea.value !== sqlModalOriginal) {
                document.getElementById('sqlCloseWarningModal').classList.add('active');
            } else {
                closeSqlEditorModal(true);
            }
        }

        openSqlEditorBtn.addEventListener('click', () => openSqlEditorModal());
        closeSqlModalBtn.addEventListener('click', closeSqlEditorModalWithCheck);
        cancelSqlModalBtn.addEventListener('click', () => closeSqlEditorModal(true));
        saveSqlModalBtn.addEventListener('click', saveSqlEditorModal);
        // Backdrop click deliberately NOT handled — modal closes only via × or Cancel button

        // Обработчики предупреждения о несохранённых изменениях SQL Editor
        document.getElementById('sqlCloseWarnCancelBtn').addEventListener('click', function() {
            document.getElementById('sqlCloseWarningModal').classList.remove('active');
        });
        document.getElementById('sqlCloseWarnSaveBtn').addEventListener('click', function() {
            document.getElementById('sqlCloseWarningModal').classList.remove('active');
            saveSqlEditorModal();
            if (sqlModalTextarea.value === sqlModalOriginal) closeSqlEditorModal(true);
        });
        document.getElementById('sqlCloseWarnDiscardBtn').addEventListener('click', function() {
            document.getElementById('sqlCloseWarningModal').classList.remove('active');
            closeSqlEditorModal(true);
        });

        // DDL Modal handlers
        const ddlModal = document.getElementById('ddlModal');
        const ddlModalTextarea = document.getElementById('ddlModalTextarea');
        const ddlScripts = {};   // хранилище DDL/Source/Sync скриптов по датамарту
        let ddlSavedContent = ''; // содержимое как в последнем сохранении
        let activeDdlSubtype = 'script';

        function getDdlScriptBucket(datamartId) {
            if (!datamartId) return { script: '', source: '', sync: '' };
            if (!ddlScripts[datamartId] || typeof ddlScripts[datamartId] !== 'object') {
                ddlScripts[datamartId] = { script: '', source: '', sync: '' };
            }
            return ddlScripts[datamartId];
        }

        function ddlSubtypeMeta(subtype) {
            if (subtype === 'source') {
                return {
                    title: 'Source Editor',
                    subtitle: 'Скрипты источника/инжеста для Flink Source',
                    placeholder: '-- Source скрипт\n-- Пример:\nCREATE SOURCE TABLE ...'
                };
            }
            if (subtype === 'sync') {
                return {
                    title: 'Sync Editor',
                    subtitle: 'Скрипты синхронизации и служебной оркестрации',
                    placeholder: '-- Sync скрипт\n-- Пример:\nINSERT INTO target SELECT ...'
                };
            }
            return {
                title: 'DDL Editor',
                subtitle: 'Скрипты создания и изменения структур данных (CREATE, ALTER, DROP)',
                placeholder: '-- DDL скрипты\n-- Пример:\nCREATE TABLE IF NOT EXISTS schema.table_name (\n    id         BIGINT      NOT NULL,\n    name       VARCHAR(255),\n    created_at TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,\n    PRIMARY KEY (id)\n);'
            };
        }

        function updateDdlGating() {
            const isSparkDdlReady = designerState.engine === 'spark' && hasCurrentDatamartDdlCode() && !isDdlModalCurrentlyOpen();
            document.querySelectorAll('[data-ddl-required="true"]').forEach(section => {
                const hasTransform = Boolean(section.querySelector('[data-subtype="transform"]'));
                const hasDeploy = Boolean(section.querySelector('[data-subtype="deploy"]'));
                const unlockForFlink = designerState.engine === 'flink' && hasTransform;
                const unlockDeployAlways = hasDeploy;
                const shouldLock = !(isSparkDdlReady || unlockForFlink || unlockDeployAlways);
                section.classList.toggle('ddl-locked', shouldLock);
            });
        }

        function openDdlModal(subtype = 'script') {
            activeDdlSubtype = ['script', 'source', 'sync'].includes(subtype) ? subtype : 'script';
            const scripts = getDdlScriptBucket(currentDatamartId);
            let currentDdl = scripts[activeDdlSubtype] || '';
            if (activeDdlSubtype === 'script') currentDdl = stripLegacyVardefBlock(currentDdl);
            const meta = ddlSubtypeMeta(activeDdlSubtype);
            const titleEl = document.getElementById('ddlModalTitleText');
            const subtitleEl = document.getElementById('ddlModalSubtitle');
            if (titleEl) titleEl.textContent = meta.title;
            if (subtitleEl) subtitleEl.textContent = meta.subtitle;

            // Variables sidebar: show for DDL/script and SQL Transform
            const varsSidebar = document.getElementById('ddlVarsSidebar');
            if (activeDdlSubtype === 'script') {
                if (varsSidebar) varsSidebar.style.display = '';
                if (varsSidebar) varsSidebar.classList.remove('collapsed');
            } else {
                if (varsSidebar) varsSidebar.style.display = 'none';
            }

            ddlModalTextarea.value = currentDdl;
            ddlModalTextarea.placeholder = meta.placeholder;
            ddlSavedContent = currentDdl;
            ddlModal.classList.add('active');
            if (activeDdlSubtype === 'script') ddlVarsSyncFromCode(true);
            ddlModalTextarea.focus();
            updateRibbonAvailability();
        }

        function closeDdlModal() {
            ddlModal.classList.remove('active');
            updateRibbonAvailability();
        }

        function saveDdlModal() {
            if (activeDdlSubtype === 'script') {
                const cleaned = stripLegacyVardefBlock(ddlModalTextarea.value);
                if (cleaned !== ddlModalTextarea.value) ddlModalTextarea.value = cleaned;
            }
            const content = ddlModalTextarea.value.trim();
            if (currentDatamartId) {
                const scripts = getDdlScriptBucket(currentDatamartId);
                scripts[activeDdlSubtype] = ddlModalTextarea.value;
            }
            ddlSavedContent = ddlModalTextarea.value;
            updateDdlGating();
            updateRibbonAvailability();
            // Модальное окно остаётся открытым после сохранения
            const label = activeDdlSubtype === 'script' ? 'DDL' : (activeDdlSubtype === 'source' ? 'Source' : 'Sync');
            showNotification(content.length > 0 ? `${label} скрипт сохранён` : `${label} очищен`);
        }

        function closeDdlModalWithCheck() {
            if (ddlModalTextarea.value !== ddlSavedContent) {
                document.getElementById('ddlCloseWarningModal').classList.add('active');
            } else {
                closeDdlModal();
            }
        }

        document.getElementById('closeDdlModalBtn').addEventListener('click', closeDdlModalWithCheck);
        document.getElementById('cancelDdlModalBtn').addEventListener('click', closeDdlModalWithCheck);
        document.getElementById('saveDdlModalBtn').addEventListener('click', saveDdlModal);
        document.getElementById('ddlVarsSidebarToggle').addEventListener('click', function() {
            toggleVarsSidebar('ddlVarsSidebar', 'ddlVarsSidebarToggle');
        });
        document.getElementById('sqlVarsSidebarToggle').addEventListener('click', function() {
            toggleVarsSidebar('sqlVarsSidebar', 'sqlVarsSidebarToggle');
        });
        // Backdrop click deliberately NOT handled — modal closes only via × or Cancel button
        // Code → sidebar sync on every keystroke (debounced)
        ddlModalTextarea.addEventListener('input', function() {
            if (activeDdlSubtype === 'script') ddlVarsSyncFromCode();
        });
        ddlModalTextarea.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                e.preventDefault();
                const s = this.selectionStart;
                this.value = this.value.substring(0, s) + '    ' + this.value.substring(this.selectionEnd);
                this.selectionStart = this.selectionEnd = s + 4;
            }
            if (e.key === 'Escape') closeDdlModalWithCheck();
        });

        // Обработчики предупреждения о несохранённых изменениях DDL
        document.getElementById('ddlCloseWarnCancelBtn').addEventListener('click', function() {
            document.getElementById('ddlCloseWarningModal').classList.remove('active');
        });
        document.getElementById('ddlCloseWarnSaveBtn').addEventListener('click', function() {
            document.getElementById('ddlCloseWarningModal').classList.remove('active');
            saveDdlModal();
            closeDdlModal();
        });
        document.getElementById('ddlCloseWarnDiscardBtn').addEventListener('click', function() {
            document.getElementById('ddlCloseWarningModal').classList.remove('active');
            closeDdlModal();
        });

        // ── SQL variables sidebars (DDL + SQL Transform) ──────────────────
        const ddlVarsStore = {}; // { [datamartId]: { general: [{key,value}], clusters: {name:[{key,value}]} } }

        function getDdlVarsBucket(datamartId) {
            if (!datamartId) return { general: [], clusters: {} };
            if (!ddlVarsStore[datamartId]) ddlVarsStore[datamartId] = { general: [], clusters: {} };
            return ddlVarsStore[datamartId];
        }

        function getDdlClusters() {
            const uniq = new Set();
            let createChecked = {};
            let editChecked = {};
            try {
                createChecked = (typeof pmChecked === 'object' && pmChecked) ? pmChecked : {};
            } catch (e) {
                createChecked = {};
            }
            try {
                editChecked = (typeof editPmChecked === 'object' && editPmChecked) ? editPmChecked : {};
            } catch (e) {
                editChecked = {};
            }

            const fromCreateModal = Object.keys(createChecked).map(id => pmClusterName(id));
            fromCreateModal.forEach(name => { if (name) uniq.add(name); });

            const fromEditModal = Object.keys(editChecked).map(id => pmClusterName(id));
            fromEditModal.forEach(name => { if (name) uniq.add(name); });

            const dm = currentDatamartId ? datamarts[currentDatamartId] : null;
            if (dm && dm.passport && Array.isArray(dm.passport.clusters)) {
                dm.passport.clusters.forEach(name => { if (name) uniq.add(name); });
            }

            return Array.from(uniq);
        }

        function stripLegacyVardefBlock(code) {
            return String(code || '').replace(/--\s*@begin\s+vardef[\s\S]*?--\s*@end\s+vardef[^\n]*\n?/gi, '').trimStart();
        }

        function extractSqlTemplateVars(code) {
            const vars = [];
            const seen = new Set();
            const re = /\$\{\$([A-Za-z0-9_.-]+)\}/g;
            let m;
            while ((m = re.exec(String(code || '')))) {
                const key = m[1];
                if (!seen.has(key)) {
                    seen.add(key);
                    vars.push(key);
                }
            }
            return vars;
        }

        function extractSqlTemplateVarsByScope(code) {
            const clusterVars = new Set();
            const generalVars = new Set();
            const src = String(code || '');
            const re = /\$\{\$([A-Za-z0-9_.-]+)\}/g;
            let m;

            while ((m = re.exec(src))) {
                const varName = m[1];
                const left = src.slice(Math.max(0, m.index - 220), m.index).toLowerCase();

                const kwWhere = left.lastIndexOf('where');
                const kwFrom = left.lastIndexOf('from');
                const kwJoin = left.lastIndexOf('join');
                const kwInsertInto = left.lastIndexOf('insert into');
                const kwCreateTable = left.lastIndexOf('create table');
                const strongest = Math.max(kwWhere, kwFrom, kwJoin, kwInsertInto, kwCreateTable);

                if (strongest === -1) continue;
                if (strongest === kwWhere) {
                    generalVars.add(varName);
                } else {
                    clusterVars.add(varName);
                }
            }

            return {
                general: Array.from(generalVars),
                cluster: Array.from(clusterVars)
            };
        }

        function renderSqlVarsSidebar(bodyId, vars) {
            const body = document.getElementById(bodyId);
            if (!body) return;

            if (!vars.length) {
                body.innerHTML = '<div style="font-size:12px;color:#6e7d95;line-height:1.45;"><i class="fas fa-info-circle" style="margin-right:5px"></i>Переменные формата <code>${$name}</code> не найдены.</div>';
                return;
            }

            body.innerHTML = vars.map(function(key) {
                return '<div class="ddl-vars-section"><div class="ddl-vars-section-title"><i class="fas fa-tag" style="color:#1976d2"></i>${$' + escHtml(key) + '}</div></div>';
            }).join('');
        }

        function renderDdlVarsSidebar(vars, clusters, bodyId = 'ddlVarsSidebarBody', readOnly = false) {
            const body = document.getElementById(bodyId);
            if (!body) return;
            let html = '';

            html += '<div class="ddl-vars-section">';
            html += '<div class="ddl-vars-section-title"><i class="fas fa-globe" style="color:#43a047"></i> ALL Общие (DEFAULTMARTVARS)</div>';
            (vars.general || []).forEach(function(row, idx) {
                const generalKeyAttrs = readOnly ? 'readonly disabled' : `oninput="ddlVarsSetGeneral(${idx},'key',this.value)"`;
                const generalValAttrs = readOnly ? 'readonly disabled' : `oninput="ddlVarsSetGeneral(${idx},'value',this.value)"`;
                const generalDel = readOnly ? '<span></span>' : `<button type="button" class="ddl-kv-del" onclick="ddlVarsDelGeneral(${idx})">✕</button>`;
                html += '<div class="ddl-kv-row">' +
                    '<input class="ddl-kv-input" placeholder="ключ" value="' + escHtml(row.key || '') + '" ' + generalKeyAttrs + '>' +
                    '<input class="ddl-kv-input" placeholder="значение" value="' + escHtml(row.value || '') + '" ' + generalValAttrs + '>' +
                    generalDel +
                    '</div>';
            });
            if (!readOnly) html += '<button type="button" class="ddl-kv-add" onclick="ddlVarsAddGeneral()"><i class="fas fa-plus"></i> Добавить</button>';
            html += '</div>';

            clusters.forEach(function(clusterName) {
                const clRows = (vars.clusters && vars.clusters[clusterName]) || [];
                const cj = JSON.stringify(clusterName);
                html += '<div class="ddl-vars-section">';
                html += '<div class="ddl-vars-section-title"><i class="fas fa-server" style="color:#1976d2"></i> ' + escHtml(clusterName) + '</div>';
                clRows.forEach(function(row, idx) {
                    const clusterKeyAttrs = readOnly ? 'readonly disabled' : `oninput="ddlVarsSetCluster(${cj},${idx},'key',this.value)"`;
                    const clusterValAttrs = readOnly ? 'readonly disabled' : `oninput="ddlVarsSetCluster(${cj},${idx},'value',this.value)"`;
                    const clusterDel = readOnly ? '<span></span>' : `<button type="button" class="ddl-kv-del" onclick="ddlVarsDelCluster(${cj},${idx})">✕</button>`;
                    html += '<div class="ddl-kv-row">' +
                        '<input class="ddl-kv-input" placeholder="ключ" value="' + escHtml(row.key || '') + '" ' + clusterKeyAttrs + '>' +
                        '<input class="ddl-kv-input" placeholder="значение" value="' + escHtml(row.value || '') + '" ' + clusterValAttrs + '>' +
                        clusterDel +
                        '</div>';
                });
                if (!readOnly) html += '<button type="button" class="ddl-kv-add" onclick="ddlVarsAddCluster(' + cj + ')"><i class="fas fa-plus"></i> Добавить</button>';
                html += '</div>';
            });

            body.innerHTML = html;
        }

        function renderSharedVarsSidebars() {
            const b = getDdlVarsBucket(currentDatamartId);
            const clusters = getDdlClusters();
            clusters.forEach(function(c) {
                if (!b.clusters[c]) b.clusters[c] = [];
            });
            renderDdlVarsSidebar(b, clusters, 'ddlVarsSidebarBody', false);
            renderDdlVarsSidebar(b, clusters, 'sqlVarsSidebarBody', true);
        }

        function applyScopedVarsToBucket(sourceText) {
            const b = getDdlVarsBucket(currentDatamartId);
            const clusters = getDdlClusters();
            clusters.forEach(function(c) {
                if (!b.clusters[c]) b.clusters[c] = [];
            });

            const detected = extractSqlTemplateVarsByScope(sourceText);

            detected.general.forEach(function(varName) {
                if (!(b.general || []).some(row => row.key === varName)) {
                    b.general.push({ key: varName, value: varName });
                }
            });

            detected.cluster.forEach(function(varName) {
                clusters.forEach(function(clusterName) {
                    if (!b.clusters[clusterName]) b.clusters[clusterName] = [];
                    const exists = b.clusters[clusterName].some(row => row.key === varName);
                    if (!exists) {
                        b.clusters[clusterName].push({ key: varName, value: varName });
                    }
                });
            });
        }

        function ddlVarsSetGeneral(idx, field, val) {
            const b = getDdlVarsBucket(currentDatamartId);
            if (b.general[idx]) b.general[idx][field] = val;
        }
        function ddlVarsDelGeneral(idx) {
            const b = getDdlVarsBucket(currentDatamartId);
            b.general.splice(idx, 1);
            renderSharedVarsSidebars();
        }
        function ddlVarsAddGeneral() {
            const b = getDdlVarsBucket(currentDatamartId);
            b.general.push({ key: '', value: '' });
            renderSharedVarsSidebars();
        }
        function ddlVarsSetCluster(clusterName, idx, field, val) {
            const b = getDdlVarsBucket(currentDatamartId);
            if (!b.clusters[clusterName]) b.clusters[clusterName] = [];
            if (b.clusters[clusterName][idx]) b.clusters[clusterName][idx][field] = val;
        }
        function ddlVarsDelCluster(clusterName, idx) {
            const b = getDdlVarsBucket(currentDatamartId);
            if (b.clusters[clusterName]) b.clusters[clusterName].splice(idx, 1);
            renderSharedVarsSidebars();
        }
        function ddlVarsAddCluster(clusterName) {
            const b = getDdlVarsBucket(currentDatamartId);
            if (!b.clusters[clusterName]) b.clusters[clusterName] = [];
            b.clusters[clusterName].push({ key: '', value: '' });
            renderSharedVarsSidebars();
        }

        function syncSqlTransformVarsFromCode() {
            const sqlVarsSidebar = document.getElementById('sqlVarsSidebar');
            if (!sqlVarsSidebar || !sqlEditorModal.classList.contains('active')) return;
            if (!selectedElement || !isTransformDataElement(selectedElement)) {
                sqlVarsSidebar.style.display = 'none';
                return;
            }
            sqlVarsSidebar.style.display = '';
            applyScopedVarsToBucket(sqlModalTextarea.value);
            renderSharedVarsSidebars();
        }

        function toggleVarsSidebar(sidebarId, toggleId) {
            const sidebar = document.getElementById(sidebarId);
            const toggleBtn = document.getElementById(toggleId);
            if (!sidebar || !toggleBtn) return;
            sidebar.classList.toggle('collapsed');
            const icon = toggleBtn.querySelector('i');
            const isCollapsed = sidebar.classList.contains('collapsed');
            if (icon) {
                icon.classList.toggle('fa-chevron-right', !isCollapsed);
                icon.classList.toggle('fa-chevron-left', isCollapsed);
            }
        }

        // Code → sidebar: parse ${$variable} markers and re-render (debounced)
        let _ddlCodeSyncTimer = null;
        function ddlVarsSyncFromCode(immediate = false) {
            clearTimeout(_ddlCodeSyncTimer);
            const applySync = function() {
                if (activeDdlSubtype !== 'script') return;
                applyScopedVarsToBucket(ddlModalTextarea.value);
                renderSharedVarsSidebars();
            };

            if (immediate) {
                applySync();
                return;
            }
            _ddlCodeSyncTimer = setTimeout(applySync, 500);
        }
        // ── end SQL variables sidebars ─────────────────────────────────────

        sqlModalTextarea.addEventListener('keydown', function(event) {
            if (event.key === 'Tab' && selectedElement && isRestrictedFunctionModule(selectedElement)) {
                const source = sqlModalTextarea.value;
                const selectionStart = sqlModalTextarea.selectionStart;
                const selectionEnd = sqlModalTextarea.selectionEnd;
                const functionNameCompletion = tryAutocompleteRestrictedSqlFunctionName(source, selectionStart, selectionEnd, selectedElement);
                if (functionNameCompletion) {
                    event.preventDefault();
                    sqlModalTextarea.value = functionNameCompletion.value;
                    sqlModalTextarea.selectionStart = functionNameCompletion.caretPosition;
                    sqlModalTextarea.selectionEnd = functionNameCompletion.caretPosition;
                    sqlModalTextarea.dispatchEvent(new Event('input', { bubbles: true }));
                    return;
                }

                const autocompletedSql = buildRestrictedSqlAutocompleteValue(source, selectedElement);
                if (!autocompletedSql) return;

                const { bodyRange, value, caretPosition } = autocompletedSql;
                if (selectionStart < bodyRange.start || selectionEnd > bodyRange.end) return;

                event.preventDefault();

                sqlModalTextarea.value = value;
                sqlModalTextarea.selectionStart = caretPosition;
                sqlModalTextarea.selectionEnd = caretPosition;
                sqlModalTextarea.dispatchEvent(new Event('input', { bubbles: true }));
                return;
            }

            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
                event.preventDefault();
                if (saveSqlModalBtn.disabled) return;
                saveSqlEditorModal();
            }
        });

        sqlModalTextarea.addEventListener('input', function() {
            if (!sqlEditorModal.classList.contains('active') || !selectedElement) return;
            const parsedSql = stripLeadingSqlComments(sqlModalTextarea.value);
            if (document.getElementById('moduleCommentInput')) {
                document.getElementById('moduleCommentInput').value = parsedSql.comment;
            }
            selectedElement.moduleComment = parsedSql.comment;
            setSqlEditorValidationState(validateSqlFunctionCall(sqlModalTextarea.value, selectedElement));
            syncSqlTransformVarsFromCode();
        });

        saveEdit.addEventListener('click', function() {
            const datamartId = document.getElementById('editDatamartId').value;
            const datamart = datamarts[datamartId];
            if (!datamart) return;

            const name = document.getElementById('edit_pm_display_name').value.trim()
                || document.getElementById('editDatamartName').value.trim();
            if (!name) {
                showNotification('Пожалуйста, введите название витрины');
                return;
            }

            datamart.name = name;
            datamart.owner = document.getElementById('edit_pm_owner').value.trim()
                || document.getElementById('editDatamartOwner').value.trim();
            datamart.description = document.getElementById('editDatamartDescription').value.trim();
            datamart.status = document.getElementById('editDatamartStatus').value;

            if (!datamart.passport) datamart.passport = {};
            datamart.passport.block          = document.getElementById('edit_pm_block').value.trim();
            datamart.passport.datamartGroup  = document.getElementById('edit_pm_datamart_group').value.trim();
            datamart.passport.datamartName   = document.getElementById('edit_pm_datamart_name').value.trim();
            datamart.passport.ciItService    = document.getElementById('edit_pm_ci_it_service').value.trim();
            datamart.passport.ciAsFp         = document.getElementById('edit_pm_ci_as_fp').value.trim();
            datamart.passport.sqPrKey        = document.getElementById('edit_pm_sq_pr_key').value.trim();
            datamart.passport.emails         = document.getElementById('edit_pm_emails').value.trim();
            datamart.passport.externalLibs   = document.getElementById('edit_pm_external_libs').value.trim();
            datamart.passport.lineup         = editPmCurrentLineup;
            datamart.passport.clusters       = Object.keys(editPmChecked).map(id => pmClusterName(id));
            datamart.passport.martByCluster = JSON.parse(JSON.stringify(editMartState.byCluster || {}));
            datamart.passport.flowSqlByWorkflow = JSON.parse(JSON.stringify(editFlowState.sqlVars || {}));
            datamart.passport.flowFrameworkByWorkflow = JSON.parse(JSON.stringify(editFlowState.frameworkVars || {}));
            datamart.passport.flowProfilesByWorkflow = JSON.parse(JSON.stringify(editFlowState.profilesByWorkflow || {}));
            datamart.passport.flowCommonParamsByWorkflow = JSON.parse(JSON.stringify(editFlowState.sparkCommonParamsByWorkflow || {}));

            const tile = document.querySelector(`.tile[data-datamart-id="${datamartId}"]`);
            updateTileFromDatamart(tile, datamart);
            refreshDatamartMenus();

            if (String(currentDatamartId) === String(datamartId)) {
                currentDatamartName = datamart.name;
                currentDatamart.textContent = datamart.name;
            }

            const activeTab = document.querySelector('.modal-tab-pane.active')?.dataset.editPane;
            if (activeTab === 'datamartParams') setDatamartViewMode();
            else if (activeTab === 'flowParams') setFlowViewMode();
            else setPassportViewMode();
            showNotification(`Витрина "${datamart.name}" обновлена`);
        });

        deleteDatamartBtn.addEventListener('click', function() {
            const datamartId = document.getElementById('editDatamartId').value;
            const datamart = datamarts[datamartId];
            if (!datamart) return;

            closeDatamartEditModal();
            removeDatamartById(datamartId, datamart.name);
        });

        submitCreate.addEventListener('click', function() {
            // Collect values from passport form
            const displayName   = pmVal('pm_dv_display_name',   '').trim();
            const ownerName     = pmVal('pm_dv_owner',          '').trim();
            const block         = pmVal('pm_dv_block',          '').trim();
            const dmGroup       = pmVal('pm_dv_datamart_group', '').trim();
            const dmName        = pmVal('pm_dv_datamart_name',  '').trim();
            const ciItService   = pmVal('pm_dv_ci_it_service',  '').trim();
            const ciAsFp        = pmVal('pm_dv_ci_as_fp',       '').trim();
            const sqPrKey       = pmVal('pm_dv_sq_pr_key',      '').trim();
            const emails        = pmVal('pm_dv_emails',         '').trim();
            const extLibs       = pmVal('pm_dv_external_libs',  '').trim();

            // Name = display_name, then datamart_name, then group_name fallback
            const name = displayName || dmName || [dmGroup, block].filter(Boolean).join('_') || 'Новая витрина';
            // Description = datamart_group context
            const description = [
                dmGroup ? `Группа: ${dmGroup}` : '',
                block   ? `Блок: ${block}`     : '',
                ciItService ? `КЭ: ${ciItService}` : '',
            ].filter(Boolean).join(' · ') || '';
            const type = 'sales';

            if (!dmName.trim() && !dmGroup.trim()) {
                const firstInput = document.getElementById('pm_dv_datamart_name');
                if (firstInput) firstInput.focus();
                showNotification('Пожалуйста, укажите имя витрины (datamart_name)');
                return;
            }

            const newTile = document.createElement('div');
            newTile.className = 'tile';
            newTile.dataset.datamartId = ++datamartCounter;

            newTile.innerHTML = `
                <div class="tile-header">
                    <div class="tile-title">${name}</div>
                    <div class="tile-actions">
                        <div class="tile-status status-draft">Черновик</div>
                        <button class="tile-menu-trigger" type="button" aria-label="Действия с витриной">
                            <i class="fas fa-ellipsis-h"></i>
                        </button>
                    </div>
                    <div class="tile-context-menu">
                        <button class="tile-context-item" type="button" data-action="edit">
                            <i class="fas fa-gear"></i>
                            <span>Редактировать</span>
                        </button>
                        <button class="tile-context-item delete" type="button" data-action="delete">
                            <i class="fas fa-trash"></i>
                            <span>Удалить</span>
                        </button>
                    </div>
                </div>
                <div class="tile-content">
                    ${description || 'Описание не указано'}
                </div>
                <div class="tile-footer">
                    <div class="tile-meta-row">
                        <span class="tile-meta-label">Владелец:</span>
                        <span class="tile-meta-value tile-owner">${ownerName || 'Администратор'}</span>
                    </div>
                    <div class="tile-meta-row">
                        <span class="tile-meta-label">Дата создания:</span>
                        <span class="tile-meta-value tile-created-at">${new Date().toLocaleDateString('ru-RU')}</span>
                    </div>
                </div>
            `;

            tilesContainer.insertBefore(newTile, addTile);

            attachTileHandlers(newTile);

            datamarts[datamartCounter] = {
                id: datamartCounter,
                name: name,
                status: 'draft',
                description: description,
                owner: ownerName || 'Администратор',
                createdAt: new Date().toISOString(),
                type: type,
                pages: [],
                passport: {
                    displayName:   displayName,
                    block:        block,
                    datamartGroup: dmGroup,
                    datamartName:  dmName,
                    ciItService:   ciItService,
                    ciAsFp:        ciAsFp,
                    sqPrKey:       sqPrKey,
                    emails:        emails,
                    externalLibs:  extLibs,
                    lineup:        pmCurrentLineup,
                    clusters:      Object.keys(pmChecked).map(id => pmClusterName(id)),
                }
            };

            refreshDatamartMenus();

            closeCreateModal();

            showNotification(`Витрина "${name}" успешно создана!`);
        });

        document.querySelectorAll('.tile[data-datamart-id]').forEach(tile => {
            attachTileHandlers(tile);
        });

        document.addEventListener('click', function(e) {
            if (!e.target.closest('.tile-menu-trigger') && !e.target.closest('.tile-context-menu') && !e.target.closest('#addTile')) {
                closeAllTileContextMenus();
            }
        });

        document.addEventListener('click', function(event) {
            if (!monitoringFilterMenu || monitoringFilterMenu.classList.contains('hidden')) return;
            if (event.target.closest('#monitoringFilterMenu') || event.target.closest('.filter-triangle')) return;
            closeMonitoringFilterMenu();
        });

        window.addEventListener('resize', function() {
            if (!monitoringFilterMenu || monitoringFilterMenu.classList.contains('hidden')) return;
            if (activeMonitoringFilterKey && activeMonitoringFilterAnchor) {
                positionMonitoringFilterMenu(activeMonitoringFilterAnchor);
            }
        });

        homeBreadcrumb.addEventListener('click', function() {
            switchAppPage('homePage');
            showNotification('Возврат к списку витрин');
        });

        logo.addEventListener('click', function() {
            switchAppPage('homePage');
        });

        logoMonitoring?.addEventListener('click', function() {
            switchAppPage('homePage');
        });

        logoDesigner.addEventListener('click', function() {
            switchAppPage('homePage');
        });

        homeMonitoringNav?.addEventListener('click', function(event) {
            event.preventDefault();
            switchAppPage('monitoringPage');
            showNotification('Открыт Monitoring CI/CD');
        });

        designerMonitoringNav?.addEventListener('click', function(event) {
            event.preventDefault();
            switchAppPage('monitoringPage');
            showNotification('Открыт Monitoring CI/CD');
        });

        monitoringDatamartsNav?.addEventListener('click', function(event) {
            event.preventDefault();
            switchAppPage('homePage');
        });


        document.getElementById('sidebarToggle').addEventListener('click', function() {
            document.getElementById('sidebar').classList.toggle('collapsed');
        });

        document.getElementById('monitoringSidebarToggle')?.addEventListener('click', function() {
            document.getElementById('monitoringSidebar')?.classList.toggle('collapsed');
        });

        document.getElementById('designerSidebarToggle').addEventListener('click', function() {
            document.getElementById('designerSidebar').classList.toggle('collapsed');
        });

        homeDatamartsToggle.addEventListener('click', function() {
            toggleDatamartDropdown(homeDatamartsToggle, homeDatamartsMenu);
        });

        designerDatamartsToggle.addEventListener('click', function() {
            toggleDatamartDropdown(designerDatamartsToggle, designerDatamartsMenu);
        });

        addTabBtn.addEventListener('click', openCreatePageModal);

        closePageModal.addEventListener('click', closeCreatePageModal);
        cancelPageCreate.addEventListener('click', closeCreatePageModal);
        submitPageCreate.addEventListener('click', createPageFromModal);

        scrollLeftBtn.addEventListener('click', function() {
            if (!this.classList.contains('disabled')) {
                scrollTabs('left');
            }
        });

        scrollRightBtn.addEventListener('click', function() {
            if (!this.classList.contains('disabled')) {
                scrollTabs('right');
            }
        });

        tabsContainer.addEventListener('scroll', updateScrollButtons);

        tabsContainer.addEventListener('dblclick', function(e) {
            const tabName = e.target.closest('.tab-name');
            if (!tabName) return;

            const tabElement = tabName.closest('.canvas-tab');
            if (!tabElement) return;

            startTabRename(tabElement);
        });

        document.addEventListener('click', function(e) {
            if (!editingTab) return;
            if (editingTab.contains(e.target)) return;

            if (!tabsContainer.contains(e.target)) {
                finishTabRename(true);
            }
        });

        document.addEventListener('click', handleCanvasBackgroundSelectionClear);
        document.addEventListener('keydown', handleEscapeSelectionClear);
        resetMonitoringFiltersBtn?.addEventListener('click', resetAllMonitoringFilters);
        monitoringRowsPerPage?.addEventListener('change', function() {
            monitoringPageSize = Number(this.value) || 20;
            monitoringCurrentPage = 1;
            renderMonitoringRows();
        });
        monitoringPrevPageBtn?.addEventListener('click', function() {
            monitoringCurrentPage = Math.max(1, monitoringCurrentPage - 1);
            renderMonitoringRows();
        });
        monitoringNextPageBtn?.addEventListener('click', function() {
            monitoringCurrentPage += 1;
            renderMonitoringRows();
        });
        renderMonitoringTable();

        function handleCanvasBackgroundSelectionClear(event) {
            if (suppressNextCanvasBackgroundClear) {
                suppressNextCanvasBackgroundClear = false;
                return;
            }

            // Don't deselect or close sidebar when clicking canvas - sidebar closes only via × button
            if (propertiesPanel.classList.contains('active')) return;

            if (!selectedElements.length) return;
            if (!designerPage.classList.contains('active')) return;
            if (currentView !== 'designer') return;
            if (!event.target.closest('.designer-grid')) return;
            if (event.target.closest('.canvas-element')) return;

            clearElementSelection(true);
        }

        function cloneElementData(elementData) {
            return {
                id: elementData.id,
                type: elementData.type,
                subtype: elementData.subtype,
                x: elementData.x,
                y: elementData.y,
                width: elementData.width,
                height: elementData.height,
                title: elementData.title,
                typeLabel: elementData.typeLabel,
                backgroundColor: elementData.backgroundColor,
                borderColor: elementData.borderColor,
                borderWidth: elementData.borderWidth,
                move2paConfig: elementData.move2paConfig,
                historyConfig: elementData.historyConfig,
                functionName: elementData.functionName,
                generatedSql: elementData.generatedSql,
                editedSql: elementData.editedSql,
                hasManualSqlEdits: elementData.hasManualSqlEdits,
                sql: elementData.sql,
                taskId: elementData.taskId
            };
        }

        function recordDeletedElements(pageId, deletedItems) {
            if (!deletedItems || !deletedItems.length) return;

            deletedElementsHistory.push({
                pageId,
                elements: deletedItems.map(cloneElementData)
            });

            if (deletedElementsHistory.length > 20) {
                deletedElementsHistory.shift();
            }
        }

        function undoDeleteElements() {
            const lastDeleteAction = deletedElementsHistory.pop();
            if (!lastDeleteAction) {
                showNotification('Нет удалений для отмены');
                return;
            }

            const targetPage = pages.find(page => page.id === lastDeleteAction.pageId);
            if (!targetPage) {
                showNotification('Невозможно восстановить: страница не найдена');
                return;
            }

            if (lastDeleteAction.pageId === currentPageId) {
                const restored = [];
                lastDeleteAction.elements.forEach(item => {
                    const restoredElement = createCanvasElement(cloneElementData(item), currentPageId);
                    if (restoredElement) {
                        restored.push(restoredElement);
                    }
                });

                if (restored.length) {
                    setSelection(restored, { append: false, storeSelection: true });
                }
            } else {
                targetPage.elements.push(...lastDeleteAction.elements.map(cloneElementData));
            }

            updateElementsCount();
            showNotification(lastDeleteAction.elements.length > 1
                ? `Восстановлено элементов: ${lastDeleteAction.elements.length}`
                : 'Элемент восстановлен');
        }

        function isTypingTarget(target) {
            if (!target) return false;
            const tag = (target.tagName || '').toLowerCase();
            return target.isContentEditable || tag === 'input' || tag === 'textarea' || tag === 'select';
        }

        function deleteSelectedElements() {
            if (!selectedElements.length) return;

            recordDeletedElements(currentPageId, selectedElements);

            const selectedIds = new Set(selectedElements.map(item => item.id));
            const selectedCount = selectedIds.size;

            selectedIds.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.remove();
                }
            });

            const page = pages.find(p => p.id === currentPageId);
            if (page) {
                page.elements = page.elements.filter(item => !selectedIds.has(item.id));
                page.connections = (page.connections || []).filter(link => !selectedIds.has(link.from) && !selectedIds.has(link.to));
            }

            elements = elements.filter(item => !selectedIds.has(item.id));

            clearElementSelection(true);
            renderDagConnections(currentPageId);
            updateElementsCount();
            showNotification(selectedCount > 1 ? `Удалено элементов: ${selectedCount}` : 'Элемент удален');
        }

        function handleEscapeSelectionClear(event) {
            if (event.key === 'Escape' && sqlEditorModal.classList.contains('active')) {
                closeSqlEditorModalWithCheck();
                return;
            }

            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
                if (isTypingTarget(event.target)) return;

                event.preventDefault();
                undoDeleteElements();
                return;
            }

            if (event.key === 'Delete') {
                if (isTypingTarget(event.target)) return;
                if (!selectedElements.length) return;

                event.preventDefault();
                deleteSelectedElements();
                return;
            }

            if (event.key !== 'Escape') return;
            if (!selectedElements.length) return;

            clearElementSelection(true);
        }

        function showNotification(message) {
            notification.textContent = message;
            notification.classList.add('show');

            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }

        document.getElementById('createBranchBtn').addEventListener('click', createBranch);

        document.getElementById('branchDropdownBtn').addEventListener('click', function() {
            document.getElementById('branchDropdown').classList.toggle('open');
        });

        document.addEventListener('click', function(e) {
            if (!e.target.closest('.directory-branch-controls')) {
                const branchDropdown = document.getElementById('branchDropdown');
                if (branchDropdown) branchDropdown.classList.remove('open');
            }
        });

        document.getElementById('createFileBtn').addEventListener('click', createFileInProject);
        document.getElementById('editFileBtn').addEventListener('click', editCurrentFile);
        document.getElementById('deleteFileBtn').addEventListener('click', deleteCurrentFile);

        document.getElementById('projectSearchInput').addEventListener('input', function() {
            searchInProject(this.value);
        });

        document.getElementById('directorySidebarToggle').addEventListener('click', function() {
            setDirectorySidebarCollapsed(!branchState.sidebarCollapsed);
        });

        // ══════════════════════════════════════════════════════════════
        //  ПАСПОРТ ВИТРИНЫ — логика модального окна создания
        // ══════════════════════════════════════════════════════════════

        const PM_LINEUPS = {
            cxb2c: {
                dev:  ['devbalsdpganza9','devsdpcxb2c'],
                ift:  ['iftsdpganza9'],
                psi:  ['psisdpganza9'],
                rdt:  ['utsklsdprozn2'],
                prom: ['arnsdprozn'],
            },
            blago: {
                dev:  ['devbalsdpblago'],
                ift:  ['iftsdpblago'],
                psi:  [],
                rdt:  ['utsklsdpblago'],
                prom: ['arnsdpblago'],
            },
            rozn2: {
                dev:  ['devsdprozn1','devsdprozn2'],
                ift:  ['iftsdprozn1'],
                psi:  ['psisdprozn1'],
                rdt:  ['utsklsdprozn1'],
                prom: ['arnsdprozn2'],
            },
            tkp: {
                dev:  ['devsdptkp1'],
                ift:  ['iftsdptkp1'],
                psi:  [],
                rdt:  ['utsklsdptkp1','utsklsdptkp2'],
                prom: ['arnsdptkp1'],
            },
            nba: {
                dev:  ['devsdpnba1'],
                ift:  [],
                psi:  ['psisdpnba1'],
                rdt:  ['utsklsdpnba1'],
                prom: ['arnsdpnba1'],
            },
            sbol: {
                dev:  ['devbalsdpsbol1','devsdpsbol2'],
                ift:  ['iftsdpsbol1'],
                psi:  ['psisdpsbol1'],
                rdt:  ['utsklsdpsbol1'],
                prom: ['arnsdpsbol1'],
            },
            ecom: {
                dev:  ['devsdpecom1'],
                ift:  ['iftsdpecom1'],
                psi:  [],
                rdt:  ['utsklsdpecom1'],
                prom: ['arnsdpecom1'],
            },
            ub: {
                dev:  ['devsdpub1'],
                ift:  [],
                psi:  [],
                rdt:  ['utsklsdpub1'],
                prom: ['arnsdpub1'],
            },
            prem: {
                dev:  ['devsdpprem1'],
                ift:  ['iftsdpprem1'],
                psi:  ['psisdpprem1'],
                rdt:  ['utsklsdpprem1'],
                prom: ['arnsdpprem1','arnsdpprem2'],
            },
        };

        const PM_CONTOURS   = ['dev','ift','psi','rdt','prom'];
        const PM_ENV_COLORS = { dev:'env-dev', ift:'env-ift', psi:'env-psi', rdt:'env-rdt', prom:'env-prom' };
        const PM_ENV_LABELS = { dev:'DEV', ift:'IFT', psi:'PSI', rdt:'RDT', prom:'PROM' };

        let pmCurrentLineup = 'cxb2c';
        let pmChecked = {};   // { "clusterId": true }
        let pmClusterSectionOpen = true;

        function pmVal(id, fallback) {
            const el = document.getElementById(id);
            return (el && el.value && el.value.trim()) || fallback;
        }

        function pmUpdatePath() {
            const block  = pmVal('pm_dv_block',          '{block}');
            const group  = pmVal('pm_dv_datamart_group', '{datamart_group}');
            const name   = pmVal('pm_dv_datamart_name',  '{datamart_name}');
            const sep = s => `<span class="hdfs-seg-sep">${s}</span>`;
            const fix = s => `<span class="hdfs-seg-fixed">${s}</span>`;
            const par = s => `<span class="hdfs-seg-param">${s}</span>`;
            const martPath = fix('hdfs:///oozie-app') + sep('/') + par(block) + sep('/') + par(group) + sep('/') + par(name);
            const dataPath = fix('hdfs:///data/custom') + sep('/') + par(block) + sep('/') + par(name);
            const martPathEl = document.getElementById('pm_dvHdfsPathInline');
            if (martPathEl) martPathEl.innerHTML = martPath;
            const dataPathEl = document.getElementById('pm_dvDataHdfsPathInline');
            if (dataPathEl) dataPathEl.innerHTML = dataPath;

            // Auto-fill SonarQube key if empty
            const sqEl = document.getElementById('pm_dv_sq_pr_key');
            if (sqEl && !sqEl.dataset.userEdited) {
                const g = pmVal('pm_dv_datamart_group', '');
                const n = pmVal('pm_dv_datamart_name',  '');
                if (g || n) sqEl.value = 'b2c-sql-' + [g, n].filter(Boolean).join('_');
                else sqEl.value = '';
            }
        }

        function pmToggleClusterSection() {
            pmClusterSectionOpen = !pmClusterSectionOpen;
            const body = document.getElementById('pm_clusterSectionBody');
            const chev = document.getElementById('pm_clusterChevron');
            if (body) body.style.display = pmClusterSectionOpen ? 'block' : 'none';
            if (chev) {
                chev.classList.toggle('fa-chevron-right', !pmClusterSectionOpen);
                chev.classList.toggle('fa-chevron-down',   pmClusterSectionOpen);
            }
            if (pmClusterSectionOpen) {
                pmRenderLineupChips();
                pmRenderMatrix();
            }
        }

        function pmRenderLineupChips() {
            const el = document.getElementById('pm_dvLineupChips');
            if (!el) return;
            el.innerHTML = Object.keys(PM_LINEUPS).map(name =>
                `<div class="dv-lineup-chip ${name === pmCurrentLineup ? 'active' : ''}"
                      onclick="pmSelectLineup('${name}')">${name}</div>`
            ).join('');
        }

        function pmSelectLineup(name) {
            pmCurrentLineup = name;
            pmChecked = {};
            pmRenderLineupChips();
            pmRenderMatrix();
            if (isSparkSidebarActive()) renderEngineSparkSidebarPanel();
        }

        function pmRenderMatrix() {
            const el = document.getElementById('pm_dvClusterMatrix');
            if (!el) return;
            const lineup = PM_LINEUPS[pmCurrentLineup] || {};
            const maxRows = Math.max(...PM_CONTOURS.map(c => (lineup[c] || []).length), 0);
            if (maxRows === 0) {
                el.innerHTML = '<div class="matrix-empty">Нет кластеров в линейке</div>';
                return;
            }
            const thead = `<thead><tr>
                <th style="font-size:10px;color:#bbb;padding:7px 8px;border-bottom:2px solid #e8e8e8"></th>
                ${PM_CONTOURS.map(c => `<th class="col-${PM_ENV_COLORS[c]}">${PM_ENV_LABELS[c]}</th>`).join('')}
            </tr></thead>`;

            let rows = '';
            for (let i = 0; i < maxRows; i++) {
                const yLabel = i === 0
                    ? `<td rowspan="${maxRows}" style="writing-mode:vertical-rl;transform:rotate(180deg);font-size:10px;font-weight:700;color:#bbb;text-transform:uppercase;letter-spacing:1px;padding:6px 4px;text-align:center;white-space:nowrap;border-right:1px solid #eff0f5">Кластера</td>`
                    : '';
                const cells = PM_CONTOURS.map(c => {
                    const clusters = lineup[c] || [];
                    const clName = clusters[i];
                    if (!clName) return '<td></td>';
                    const id = pmClId(pmCurrentLineup, c, i);
                    const checked = pmChecked[id] ? 'checked' : '';
                    return `<td>
                        <label class="cluster-cb-item">
                            <input type="checkbox" ${checked} onchange="pmToggleCluster('${id}', this.checked)">
                            <span class="cluster-cb-label">${clName}</span>
                        </label>
                    </td>`;
                }).join('');
                rows += `<tr>${yLabel}${cells}</tr>`;
            }

            el.innerHTML = `
                <table class="cluster-matrix">${thead}<tbody>${rows}</tbody></table>
                <div class="matrix-summary" id="pm_dvMatrixSummary"></div>
            `;
            pmRenderSummary();
        }

        function pmClId(lineup, contour, idx) {
            return `${lineup}__${contour}__${idx}`;
        }

        function pmClusterName(id) {
            const [lineup, contour, idx] = id.split('__');
            return (PM_LINEUPS[lineup] && PM_LINEUPS[lineup][contour] && PM_LINEUPS[lineup][contour][+idx]) || id;
        }

        function pmToggleCluster(id, checked) {
            if (checked) pmChecked[id] = true;
            else delete pmChecked[id];
            pmRenderSummary();
            if (isSparkSidebarActive()) renderEngineSparkSidebarPanel();
        }

        function pmRenderSummary() {
            const el = document.getElementById('pm_dvMatrixSummary');
            if (!el) return;
            const ids = Object.keys(pmChecked);
            if (!ids.length) {
                el.innerHTML = '<span style="color:#bbb"><i class="fas fa-info-circle" style="margin-right:5px"></i>Кластеры не выбраны — деплой не будет запущен</span>';
                return;
            }
            el.innerHTML = '<span style="color:#555;font-weight:600">Деплой на:</span> '
                + ids.map(id => `<span class="matrix-summary-tag">${pmClusterName(id)}</span>`).join(' ');
        }

        function pmResetForm() {
            ['pm_dv_display_name','pm_dv_owner','pm_dv_block','pm_dv_datamart_group','pm_dv_datamart_name',
             'pm_dv_ci_it_service','pm_dv_ci_as_fp','pm_dv_sq_pr_key',
             'pm_dv_emails','pm_dv_external_libs'].forEach(id => {
                const el = document.getElementById(id);
                if (el) { el.value = ''; el.dataset.userEdited = ''; }
            });
            pmCurrentLineup = 'cxb2c';
            pmChecked = {};
            const hdfsEl = document.getElementById('pm_dvHdfsPathInline');
            if (hdfsEl) hdfsEl.innerHTML = '';
            const hdfsDataEl = document.getElementById('pm_dvDataHdfsPathInline');
            if (hdfsDataEl) hdfsDataEl.innerHTML = '';
        }

        // Prevent SonarQube auto-fill after user manually edits it
        document.addEventListener('DOMContentLoaded', function() {
            const sqEl = document.getElementById('pm_dv_sq_pr_key');
            if (sqEl) sqEl.addEventListener('input', () => { sqEl.dataset.userEdited = '1'; });

            ['edit_pm_block', 'edit_pm_datamart_group', 'edit_pm_datamart_name'].forEach(id => {
                const el = document.getElementById(id);
                if (!el) return;
                el.addEventListener('input', editPmUpdateHdfsPath);
            });
        });

        // Инициализация
        document.addEventListener('DOMContentLoaded', function() {
            renderBranchSelect();
            setDirectorySidebarCollapsed(false);
            setDirectoryOverviewMode(true);
            setupDirectoryResizer();
            initFileTree({ keepOpenedFile: false });
            refreshDatamartMenus();
            setupPropertiesResizer();
            initializeDesignerRibbon();
            updateScrollButtons();
            updatePropertiesPanelOffset();
            renderLargeData(); // Инициализация данных SQL редактора

            showNotification('Добро пожаловать в B2CSQL Studio! Используйте View Selector для переключения между представлениями и вкладки для управления страницами.');
        });

        // ── Граф потоков ─────────────────────────────────────────────────────────
        let graphSelectedNodeId = null;
        const GRAPH_NODE_W = 240;
        const GRAPH_NODE_H = 68;
        const GRAPH_COL_GAP = 110;
        const GRAPH_ROW_GAP = 70;
        const GRAPH_COLS = 3;
        const GRAPH_PAD_X = 60;
        const GRAPH_PAD_Y = 60;

        // Per-node positions (mutable via drag)
        let graphNodePositions = {};

        function getGraphStreams() {
            if (Array.isArray(pages) && pages.length > 0) {
                return pages.map((p, i) => ({
                    id: p.id || `flow-${i + 1}`,
                    name: p.name || `Поток ${i + 1}`,
                    elementCount: Array.isArray(p.elements) ? p.elements.length : 0,
                    template: p.template || 'batch'
                }));
            }
            return [];
        }

        function getStreamIcon(stream) {
            const isBatch = (stream.template || '').includes('batch') || stream.name.toLowerCase().includes('batch');
            return isBatch ? 'fas fa-stream' : 'fas fa-bolt';
        }

        function getStreamTypeLabel(stream) {
            const isBatch = (stream.template || '').includes('batch') || stream.name.toLowerCase().includes('batch');
            return isBatch ? 'Batch поток' : 'NRT поток';
        }

        function graphRedrawEdges(streams) {
            const svg = document.getElementById('graphEdgesSvg');
            if (!svg) return;
            svg.querySelectorAll('path').forEach(p => p.remove());

            for (let i = 0; i < streams.length - 1; i++) {
                const a = streams[i];
                const b = streams[i + 1];
                const pa = graphNodePositions[a.id];
                const pb = graphNodePositions[b.id];
                if (!pa || !pb) continue;

                const aRightX = pa.x + GRAPH_NODE_W;
                const aRightY = pa.y + GRAPH_NODE_H / 2;
                const bLeftX = pb.x;
                const bLeftY = pb.y + GRAPH_NODE_H / 2;
                const aBottomX = pa.x + GRAPH_NODE_W / 2;
                const aBottomY = pa.y + GRAPH_NODE_H;
                const bTopX = pb.x + GRAPH_NODE_W / 2;
                const bTopY = pb.y;

                let d;
                // Choose connector direction based on relative position
                if (Math.abs(pa.y - pb.y) < GRAPH_NODE_H * 0.8) {
                    // roughly same row → horizontal S-curve
                    const mx = (aRightX + bLeftX) / 2;
                    d = `M${aRightX},${aRightY} C${mx},${aRightY} ${mx},${bLeftY} ${bLeftX},${bLeftY}`;
                } else {
                    // different rows → vertical S-curve
                    const my = (aBottomY + bTopY) / 2;
                    d = `M${aBottomX},${aBottomY} C${aBottomX},${my} ${bTopX},${my} ${bTopX},${bTopY}`;
                }

                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', d);
                path.setAttribute('fill', 'none');
                path.setAttribute('stroke', '#b0bdd6');
                path.setAttribute('stroke-width', '1.5');
                path.setAttribute('marker-end', 'url(#gArrow)');
                svg.appendChild(path);
            }
        }

        function graphAttachDrag(wrapper, streamId, streams) {
            let dragging = false;
            let startMouseX, startMouseY, startElX, startElY;

            wrapper.addEventListener('mousedown', function(e) {
                // Don't interfere with clicks on the element itself (will distinguish by distance moved)
                startMouseX = e.clientX;
                startMouseY = e.clientY;
                startElX = graphNodePositions[streamId].x;
                startElY = graphNodePositions[streamId].y;
                dragging = false;

                function onMove(ev) {
                    const dx = ev.clientX - startMouseX;
                    const dy = ev.clientY - startMouseY;
                    if (!dragging && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
                        dragging = true;
                        wrapper.classList.add('dragging');
                    }
                    if (!dragging) return;
                    const newX = Math.max(0, startElX + dx);
                    const newY = Math.max(0, startElY + dy);
                    graphNodePositions[streamId] = { x: newX, y: newY };
                    wrapper.style.left = newX + 'px';
                    wrapper.style.top = newY + 'px';
                    graphRedrawEdges(streams);
                    graphResizeCanvas();
                }

                function onUp(ev) {
                    document.removeEventListener('mousemove', onMove);
                    document.removeEventListener('mouseup', onUp);
                    if (dragging) {
                        wrapper.classList.remove('dragging');
                        dragging = false;
                        // Suppress the click that fires after mouseup
                        wrapper._suppressClick = true;
                        setTimeout(() => { wrapper._suppressClick = false; }, 10);
                    }
                }

                document.addEventListener('mousemove', onMove);
                document.addEventListener('mouseup', onUp);
            });
        }

        function graphResizeCanvas() {
            const nodesContainer = document.getElementById('graphNodesContainer');
            const svg = document.getElementById('graphEdgesSvg');
            if (!nodesContainer || !svg) return;
            let maxX = 0, maxY = 0;
            Object.values(graphNodePositions).forEach(pos => {
                maxX = Math.max(maxX, pos.x + GRAPH_NODE_W + GRAPH_PAD_X);
                maxY = Math.max(maxY, pos.y + GRAPH_NODE_H + GRAPH_PAD_Y);
            });
            nodesContainer.style.width = maxX + 'px';
            nodesContainer.style.height = maxY + 'px';
            svg.style.width = maxX + 'px';
            svg.style.height = maxY + 'px';
        }

        function renderGraphView() {
            const svg = document.getElementById('graphEdgesSvg');
            const nodesContainer = document.getElementById('graphNodesContainer');
            const wrap = document.getElementById('graphCanvasWrap');
            if (!svg || !nodesContainer || !wrap) return;

            nodesContainer.innerHTML = '';
            svg.querySelectorAll('path').forEach(p => p.remove());

            const streams = getGraphStreams();
            if (!streams.length) {
                if (!wrap.querySelector('.graph-empty-msg')) {
                    const msg = document.createElement('div');
                    msg.className = 'graph-empty-msg';
                    msg.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;color:#9aa3b2;font-size:14px;pointer-events:none;z-index:3';
                    msg.innerHTML = '<i class="fas fa-project-diagram" style="font-size:40px;color:#c8d4e8;display:block;margin-bottom:12px"></i>Создайте потоки в «Конструкторе» —<br>они появятся здесь как узлы графа.';
                    wrap.appendChild(msg);
                }
                return;
            }
            wrap.querySelector('.graph-empty-msg')?.remove();

            // Initialize positions for new streams, keep existing drag positions
            streams.forEach((s, i) => {
                if (!graphNodePositions[s.id]) {
                    const col = i % GRAPH_COLS;
                    const row = Math.floor(i / GRAPH_COLS);
                    graphNodePositions[s.id] = {
                        x: GRAPH_PAD_X + col * (GRAPH_NODE_W + GRAPH_COL_GAP),
                        y: GRAPH_PAD_Y + row * (GRAPH_NODE_H + GRAPH_ROW_GAP)
                    };
                }
            });
            // Remove positions for deleted streams
            const streamIds = new Set(streams.map(s => s.id));
            Object.keys(graphNodePositions).forEach(id => {
                if (!streamIds.has(id)) delete graphNodePositions[id];
            });

            // Render nodes
            streams.forEach(s => {
                const pos = graphNodePositions[s.id];
                const isSelected = s.id === graphSelectedNodeId;
                const icon = getStreamIcon(s);
                const typeLabel = getStreamTypeLabel(s);

                const wrapper = document.createElement('div');
                wrapper.className = 'graph-node-el';
                wrapper.style.cssText = `left:${pos.x}px;top:${pos.y}px;width:${GRAPH_NODE_W}px`;
                wrapper.dataset.nodeId = s.id;

                const el = document.createElement('div');
                el.className = 'canvas-element' + (isSelected ? ' is-selected' : '');
                el.style.cssText = `position:static;width:${GRAPH_NODE_W}px;min-height:${GRAPH_NODE_H}px`;
                el.innerHTML = `
                    <div class="element-header">
                        <i class="${icon}"></i>
                        <div class="element-meta">
                            <span class="element-title">${escHtml(s.name)}</span>
                            <span class="element-type">${escHtml(typeLabel)}</span>
                        </div>
                        <div style="margin-left:auto;font-size:10px;color:#9aa3b2;white-space:nowrap;padding-right:4px">${s.elementCount} эл.</div>
                    </div>
                `;

                wrapper.appendChild(el);
                nodesContainer.appendChild(wrapper);

                // Click handler (only if not drag)
                wrapper.addEventListener('click', function() {
                    if (wrapper._suppressClick) return;
                    selectGraphNode(s.id);
                });

                graphAttachDrag(wrapper, s.id, streams);
            });

            graphResizeCanvas();
            graphRedrawEdges(streams);
        }

        function selectGraphNode(id) {
            graphSelectedNodeId = id;

            // Update selected state visually without full re-render
            document.querySelectorAll('#graphNodesContainer .graph-node-el').forEach(w => {
                const el = w.querySelector('.canvas-element');
                if (!el) return;
                if (w.dataset.nodeId === id) {
                    el.classList.add('is-selected');
                } else {
                    el.classList.remove('is-selected');
                }
            });

            const streams = getGraphStreams();
            const stream = streams.find(s => s.id === id);
            if (!stream) return;

            const isBatch = (stream.template || '').includes('batch') || stream.name.toLowerCase().includes('batch');
            const typeLabel = isBatch ? 'Batch' : 'NRT';
            const typeBg = isBatch ? '#E6F1FB' : '#E1F5EE';
            const typeColor = isBatch ? '#185FA5' : '#0F6E56';
            const icon = getStreamIcon(stream);

            if (propertiesHeaderTitle) propertiesHeaderTitle.innerHTML = `<i class="${icon}" style="margin-right:6px;color:#2a5298"></i>${escHtml(stream.name)}`;

            const scrollArea = propertiesPanel.querySelector('.properties-panel-scroll');
            if (scrollArea) {
                scrollArea.innerHTML = `
                    <div class="property-group">
                        <div class="property-title">Основные</div>
                        <div class="property-item">
                            <label class="property-label">Название потока</label>
                            <input type="text" class="property-input" value="${escHtml(stream.name)}" readonly>
                        </div>
                        <div class="property-item">
                            <label class="property-label">Идентификатор</label>
                            <input type="text" class="property-input" value="${escHtml(stream.id)}" readonly style="font-family:'Cascadia Code','Consolas',monospace;font-size:12px">
                        </div>
                        <div class="property-item">
                            <label class="property-label">Тип потока</label>
                            <div style="padding:6px 0"><span style="background:${typeBg};color:${typeColor};font-size:11px;padding:3px 12px;border-radius:10px;font-weight:700">${typeLabel}</span></div>
                        </div>
                    </div>
                    <div class="property-group">
                        <div class="property-title">Состав</div>
                        <div class="property-item">
                            <label class="property-label">Элементов на холсте</label>
                            <input type="text" class="property-input" value="${stream.elementCount}" readonly>
                        </div>
                    </div>
                `;
            }
            propertiesPanel.style.top = '0';
            propertiesPanel.style.bottom = '0';
            propertiesPanel.classList.add('active');
        }

        function closeGraphNodeSidebar() {
            graphSelectedNodeId = null;
            document.querySelectorAll('#graphNodesContainer .canvas-element').forEach(el => {
                el.classList.remove('is-selected');
            });
            if (currentView === 'graph') {
                propertiesPanel.classList.remove('active');
            }
        }
