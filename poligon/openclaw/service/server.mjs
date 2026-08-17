import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { spawn } from 'node:child_process';
import { cpSync, chmodSync, existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { basename, dirname, join, resolve } from 'node:path';

const home = resolve(process.env.OPENCLAW_HOME || '/home/node/.openclaw');
const configPath = resolve(process.env.OPENCLAW_CONFIG_PATH || join(home, 'openclaw.json'));
const controlTokenPath = resolve(process.env.OPENCLAW_CONTROL_TOKEN_FILE || '/run/openclaw-control/token');
const gatewayTokenPath = join(home, '.gateway-token');
const templateDir = '/opt/b2c-openclaw/templates';
const sourceSkillDir = '/opt/b2c-openclaw/skill';
const skillName = 'build-b2c-mart';
const sourcePluginDir = '/opt/b2c-openclaw/plugins/b2c-build-tool';
const pluginName = 'b2c-build-tool';
const provider = process.env.OPENCLAW_PROVIDER || 'custom-routerai-ru';
const providerName = process.env.OPENCLAW_PROVIDER_NAME || 'RouterAI';
const providerBaseUrl = process.env.OPENCLAW_PROVIDER_BASE_URL || 'https://routerai.ru/api/v1';
const model = process.env.OPENCLAW_DEFAULT_MODEL || `${provider}/deepseek/deepseek-v4-pro`;
const modelId = model.startsWith(`${provider}/`) ? model.slice(provider.length + 1) : 'deepseek/deepseek-v4-pro';
const modelName = process.env.OPENCLAW_MODEL_NAME || 'DeepSeek V4 Pro';
const gatewayPort = Number(process.env.OPENCLAW_GATEWAY_PORT || 18789);
const controlPort = Number(process.env.OPENCLAW_CONTROL_PORT || 18890);
const controlHost = process.env.OPENCLAW_CONTROL_HOST || '0.0.0.0';
const deniedTools = ['exec', 'process', 'read', 'write', 'edit', 'apply_patch', 'browser'];
const maximumUploadFiles = 200;
const maximumUploadBytes = 64 * 1024 * 1024;

let gatewayReady = false;
let operationQueue = Promise.resolve();

function atomicWrite(path, content, mode = 0o600) {
    mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
    const temporary = `${path}.${process.pid}.tmp`;
    writeFileSync(temporary, content, { encoding: 'utf8', mode });
    renameSync(temporary, path);
    chmodSync(path, mode);
}

function persistentSecret(path) {
    if (existsSync(path)) return readFileSync(path, 'utf8').trim();
    const value = randomBytes(48).toString('base64url');
    atomicWrite(path, `${value}\n`);
    return value;
}

function readConfig() {
    if (!existsSync(configPath)) return {};
    return JSON.parse(readFileSync(configPath, 'utf8'));
}

function writeConfig(config) {
    atomicWrite(configPath, `${JSON.stringify(config, null, 2)}\n`);
}

function bootstrap(gatewayToken) {
    mkdirSync(home, { recursive: true, mode: 0o700 });
    mkdirSync(join(home, 'workspace'), { recursive: true, mode: 0o700 });
    const installedSkill = join(home, 'skills', skillName);
    rmSync(installedSkill, { recursive: true, force: true });
    mkdirSync(dirname(installedSkill), { recursive: true, mode: 0o700 });
    cpSync(sourceSkillDir, installedSkill, { recursive: true, force: true });

    const config = readConfig();
    config.models = config.models || {};
    config.models.mode = 'merge';
    config.models.providers = config.models.providers || {};
    config.models.providers[provider] = {
        baseUrl: providerBaseUrl,
        api: 'openai-completions',
        models: [{
            id: modelId,
            name: modelName,
            reasoning: false,
            input: ['text'],
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
            contextWindow: 1048576,
            maxTokens: 16384,
            api: 'openai-completions',
        }],
    };
    config.agents = config.agents || {};
    config.agents.defaults = config.agents.defaults || {};
    config.agents.defaults.model = { primary: model };
    config.agents.defaults.models = { ...(config.agents.defaults.models || {}), [`${provider}/*`]: {} };
    config.agents.defaults.workspace = join(home, 'workspace');
    config.agents.defaults.maxConcurrent = 4;
    config.plugins = config.plugins || {};
    config.plugins.load = config.plugins.load || {};
    config.plugins.load.paths = Array.from(new Set([
        ...(Array.isArray(config.plugins.load.paths) ? config.plugins.load.paths : []),
        sourcePluginDir,
    ]));
    config.plugins.entries = config.plugins.entries || {};
    config.plugins.entries[pluginName] = {
        ...(config.plugins.entries[pluginName] || {}),
        enabled: true,
        config: {
            skillRoot: installedSkill,
            backendBaseUrl: process.env.B2C_BACKEND_URL || 'http://backend:8000',
            controlTokenFile: controlTokenPath,
            timeoutSeconds: 900,
        },
    };
    config.gateway = {
        ...(config.gateway || {}),
        port: gatewayPort,
        mode: 'local',
        bind: 'loopback',
        auth: { mode: 'token', token: gatewayToken },
        tailscale: { mode: 'off', resetOnExit: false },
        http: { endpoints: { chatCompletions: { enabled: true } } },
    };
    writeConfig(config);
}

function runOpenClaw(args, { input = '', timeout = 90000 } = {}) {
    return new Promise((resolvePromise, rejectPromise) => {
        const child = spawn('openclaw', args, {
            env: { ...process.env, NO_COLOR: '1' },
            stdio: ['pipe', 'pipe', 'pipe'],
        });
        let stdout = '';
        let stderr = '';
        const timer = setTimeout(() => {
            child.kill('SIGTERM');
            rejectPromise(new Error('Команда OpenClaw превысила допустимое время выполнения.'));
        }, timeout);
        child.stdout.on('data', chunk => { stdout += chunk.toString(); });
        child.stderr.on('data', chunk => { stderr += chunk.toString(); });
        child.on('error', error => {
            clearTimeout(timer);
            rejectPromise(error);
        });
        child.on('close', code => {
            clearTimeout(timer);
            if (code === 0) resolvePromise(stdout);
            else rejectPromise(new Error((stderr || stdout || `OpenClaw завершился с кодом ${code}.`).trim()));
        });
        child.stdin.end(input);
    });
}

async function listAgents() {
    const raw = await runOpenClaw(['agents', 'list', '--json']);
    return JSON.parse(raw);
}

function safeAgentId(value) {
    const agentId = String(value || '').trim().toLowerCase();
    if (!/^[a-z0-9][a-z0-9_-]{0,63}$/.test(agentId)) throw new Error('Некорректный идентификатор агента.');
    return agentId;
}

function agentPaths(agentId) {
    const workspace = resolve(home, 'user-agents', agentId, 'workspace');
    const agentDir = resolve(home, 'agents', agentId, 'agent');
    if (!workspace.startsWith(`${home}/`) || !agentDir.startsWith(`${home}/`)) {
        throw new Error('Каталог агента вышел за границы OpenClaw.');
    }
    return { workspace, agentDir };
}

function safeUploadFileName(value) {
    const name = String(value || '').trim().replaceAll('\\', '/');
    if (!name || name.includes('\0') || basename(name) !== name) {
        throw new Error('Некорректное имя вложения.');
    }
    const safe = name.replace(/[^A-Za-zА-Яа-яЁё0-9_. -]/g, '_').replace(/^\.+/, '');
    if (!safe || safe.length > 240) throw new Error('Некорректное имя вложения.');
    return safe;
}

async function saveAttachments(payload) {
    const agentId = safeAgentId(payload.agentId);
    const files = Array.isArray(payload.files) ? payload.files : [];
    if (!files.length || files.length > maximumUploadFiles) {
        throw new Error(`Нужно передать от 1 до ${maximumUploadFiles} файлов.`);
    }
    if (!(await listAgents()).some(item => item.id === agentId)) {
        throw new Error('Персональный агент не найден.');
    }

    const { workspace } = agentPaths(agentId);
    const packageName = `package-${Date.now().toString(36)}-${randomBytes(6).toString('hex')}`;
    const uploadsRoot = resolve(workspace, 'uploads');
    const uploadPath = `uploads/${packageName}`;
    const target = resolve(workspace, uploadPath);
    const temporary = resolve(uploadsRoot, `.${packageName}.tmp`);
    if (!target.startsWith(`${uploadsRoot}/`) || !temporary.startsWith(`${uploadsRoot}/`)) {
        throw new Error('Каталог загрузки вышел за границы workspace агента.');
    }

    rmSync(temporary, { recursive: true, force: true });
    mkdirSync(temporary, { recursive: true, mode: 0o700 });
    let total = 0;
    const saved = [];
    const savedNames = new Set();
    try {
        for (const item of files) {
            const name = safeUploadFileName(item?.name);
            const nameKey = name.toLocaleLowerCase('ru-RU');
            if (savedNames.has(nameKey)) throw new Error(`Имя файла ${name} повторяется в пакете.`);
            savedNames.add(nameKey);
            const encoded = String(item?.base64 || '');
            if (!encoded || !/^[A-Za-z0-9+/]*={0,2}$/.test(encoded)) {
                throw new Error(`Файл ${name} передан не в base64.`);
            }
            const data = Buffer.from(encoded, 'base64');
            if (!data.length || data.toString('base64').replace(/=+$/, '') !== encoded.replace(/=+$/, '')) {
                throw new Error(`Файл ${name} передан не в base64.`);
            }
            total += data.length;
            if (total > maximumUploadBytes) {
                throw new Error('Общий размер вложений превышает 64 МБ.');
            }
            const destination = resolve(temporary, name);
            if (!destination.startsWith(`${temporary}/`)) {
                throw new Error(`Путь файла ${name} вышел за границы пакета.`);
            }
            writeFileSync(destination, data, { mode: 0o600 });
            saved.push({
                name,
                relativePath: `${uploadPath}/${name}`,
                size: data.length,
            });
        }
        renameSync(temporary, target);
    } catch (error) {
        rmSync(temporary, { recursive: true, force: true });
        throw error;
    }
    return {
        uploadPath,
        agentId,
        sessionKey: String(payload.sessionKey || ''),
        files: saved,
    };
}

function renderTemplate(fileName, values) {
    let text = readFileSync(join(templateDir, fileName), 'utf8');
    for (const [key, value] of Object.entries(values)) text = text.replaceAll(`{{${key}}}`, String(value));
    return text;
}

function hardenAgent(agentId) {
    const config = readConfig();
    const entries = Array.isArray(config.agents?.list) ? config.agents.list : [];
    const entry = entries.find(item => item.id === agentId);
    if (!entry) return;
    const currentTools = entry.tools || {};
    const b2cTools = ['b2c_list_accessible_datamarts', 'b2c_update_mart_from_upload_path'];
    entry.tools = Array.isArray(currentTools.allow)
        ? {
            ...currentTools,
            deny: deniedTools,
            allow: Array.from(new Set([
                ...currentTools.allow.filter(tool => !String(tool).startsWith('b2c_')),
                ...b2cTools,
            ])),
        }
        : {
            ...currentTools,
            deny: deniedTools,
            alsoAllow: Array.from(new Set([
                ...(Array.isArray(currentTools.alsoAllow)
                    ? currentTools.alsoAllow.filter(tool => !String(tool).startsWith('b2c_'))
                    : []),
                ...b2cTools,
            ])),
        };
    writeConfig(config);
}

async function ensureAgent(payload) {
    const agentId = safeAgentId(payload.agentId);
    const agentName = String(payload.agentName || '').trim();
    const userName = String(payload.name || '').trim();
    const requestedModel = String(payload.model || model).trim();
    if (!agentName || !userName || !requestedModel) throw new Error('Не переданы имя агента, пользователь или модель.');
    const { workspace, agentDir } = agentPaths(agentId);
    mkdirSync(workspace, { recursive: true, mode: 0o700 });
    mkdirSync(agentDir, { recursive: true, mode: 0o700 });
    mkdirSync(join(workspace, 'memory'), { recursive: true, mode: 0o700 });
    mkdirSync(join(workspace, 'uploads'), { recursive: true, mode: 0o700 });
    mkdirSync(join(workspace, 'mart-updates'), { recursive: true, mode: 0o700 });
    const sharedSkill = join(home, 'skills', skillName, 'SKILL.md');
    if (!existsSync(sharedSkill)) throw new Error(`Общий навык ${skillName} не установлен.`);

    const values = {
        AGENT_ID: agentId,
        AGENT_NAME: agentName,
        USER_NAME: userName,
        SKILL_NAME: skillName,
    };
    const workspaceTemplates = [
        ['B2C_AGENT.md', 'AGENTS.md'],
        ['IDENTITY.md', 'IDENTITY.md'],
        ['SOUL.md', 'SOUL.md'],
    ];
    for (const [templateName, workspaceName] of workspaceTemplates) {
        atomicWrite(join(workspace, workspaceName), renderTemplate(templateName, values));
    }
    const memoryFile = join(workspace, 'MEMORY.md');
    if (!existsSync(memoryFile)) {
        atomicWrite(memoryFile, renderTemplate('MEMORY.md', values));
    }

    const agents = await listAgents();
    const existing = agents.find(item => item.id === agentId);
    const created = !existing;
    if (created) {
        await runOpenClaw([
            'agents', 'add', agentId,
            '--non-interactive',
            '--workspace', workspace,
            '--agent-dir', agentDir,
            '--model', requestedModel,
            '--json',
        ]);
    }
    if (created || existing.identityName !== agentName) {
        await runOpenClaw([
            'agents', 'set-identity', '--agent', agentId,
            '--name', agentName, '--emoji', '🧱', '--json',
        ]);
    }
    hardenAgent(agentId);
    return {
        agentId,
        agentName,
        model: existing?.model || requestedModel,
        workspace,
        skill: skillName,
        skillSource: 'openclaw-managed',
        created,
    };
}

function credentialProfile(agentId) {
    return `${provider}:${agentId}`;
}

async function credentialStatus(agentId) {
    const { agentDir } = agentPaths(agentId);
    const markerPath = join(agentDir, '.b2c-model-configured');
    if (existsSync(markerPath)) return true;
    const authPath = join(agentDir, 'auth-profiles.json');
    if (existsSync(authPath)) {
        try {
            const profile = JSON.parse(readFileSync(authPath, 'utf8')).profiles?.[credentialProfile(agentId)];
            if (profile && (profile.key || profile.apiKey || profile.token || profile.keyRef)) {
                atomicWrite(markerPath, 'configured\n');
                return true;
            }
        } catch {
            return false;
        }
    }
    return false;
}

async function saveCredential(payload) {
    const agentId = safeAgentId(payload.agentId);
    const token = String(payload.token || '').trim();
    if (token.length < 8 || token.length > 8192) throw new Error('Токен должен содержать от 8 до 8192 символов.');
    const agentExists = (await listAgents()).some(item => item.id === agentId);
    if (!agentExists) throw new Error('Сначала необходимо создать персонального агента.');
    const profileId = credentialProfile(agentId);
    await runOpenClaw([
        'models', 'auth', '--agent', agentId, 'paste-api-key',
        '--provider', provider, '--profile-id', profileId,
    ], { input: `${token}\n` });
    await runOpenClaw([
        'models', 'auth', 'order', 'set', '--provider', provider,
        '--agent', agentId, profileId,
    ]);
    atomicWrite(join(agentPaths(agentId).agentDir, '.b2c-model-configured'), 'configured\n');
    return { configured: true, provider, providerName, model, modelName };
}

function serialized(operation) {
    const next = operationQueue.then(operation, operation);
    operationQueue = next.catch(() => {});
    return next;
}

function jsonResponse(response, status, payload) {
    const body = Buffer.from(JSON.stringify(payload), 'utf8');
    response.writeHead(status, {
        'content-type': 'application/json; charset=utf-8',
        'content-length': body.length,
        'cache-control': 'no-store',
    });
    response.end(body);
}

function authorized(request, expectedToken) {
    const actual = request.headers.authorization || '';
    const expected = `Bearer ${expectedToken}`;
    const actualHash = createHash('sha256').update(actual).digest();
    const expectedHash = createHash('sha256').update(expected).digest();
    return timingSafeEqual(actualHash, expectedHash);
}

async function readJson(request, maximum = 128 * 1024) {
    const chunks = [];
    let size = 0;
    for await (const chunk of request) {
        size += chunk.length;
        if (size > maximum) throw new Error('Слишком большой запрос.');
        chunks.push(chunk);
    }
    if (!size) throw new Error('Пустой запрос.');
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

async function proxyGateway(request, response, gatewayToken, path) {
    const body = request.method === 'POST' ? JSON.stringify(await readJson(request, 4 * 1024 * 1024)) : undefined;
    const upstream = await fetch(`http://127.0.0.1:${gatewayPort}${path}`, {
        method: request.method,
        headers: { authorization: `Bearer ${gatewayToken}`, 'content-type': 'application/json' },
        body,
        signal: AbortSignal.timeout(210000),
    });
    response.writeHead(upstream.status, {
        'content-type': upstream.headers.get('content-type') || 'application/json; charset=utf-8',
        'cache-control': 'no-store',
        'x-accel-buffering': 'no',
    });
    if (!upstream.body) {
        response.end();
        return;
    }
    for await (const chunk of upstream.body) {
        response.write(Buffer.from(chunk));
    }
    response.end();
}

const controlToken = persistentSecret(controlTokenPath);
const gatewayToken = persistentSecret(gatewayTokenPath);
bootstrap(gatewayToken);

const gateway = spawn('openclaw', [
    'gateway', '--port', String(gatewayPort), '--bind', 'loopback', '--auth', 'token', 'run',
], {
    env: { ...process.env, OPENCLAW_GATEWAY_TOKEN: gatewayToken, NO_COLOR: '1' },
    stdio: ['ignore', 'inherit', 'inherit'],
});
gateway.on('exit', code => {
    console.error(`OpenClaw Gateway завершился с кодом ${code}.`);
    process.exit(code || 1);
});

async function refreshGatewayReadiness() {
    try {
        const response = await fetch(`http://127.0.0.1:${gatewayPort}/v1/models`, {
            headers: { authorization: `Bearer ${gatewayToken}` },
            signal: AbortSignal.timeout(2000),
        });
        gatewayReady = response.ok;
    } catch {
        gatewayReady = false;
    }
}
setInterval(refreshGatewayReadiness, 2000).unref();
await refreshGatewayReadiness();

const server = createServer(async (request, response) => {
    try {
        const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);
        if (request.method === 'GET' && url.pathname === '/health') {
            jsonResponse(response, gatewayReady ? 200 : 503, {
                ok: gatewayReady,
                service: 'openclaw',
                provider: providerName,
                model: modelName,
            });
            return;
        }
        if (!authorized(request, controlToken)) {
            jsonResponse(response, 401, { error: 'Неверный внутренний токен OpenClaw.' });
            return;
        }
        if (request.method === 'GET' && url.pathname === '/agents') {
            jsonResponse(response, 200, { items: await listAgents() });
            return;
        }
        if (request.method === 'POST' && url.pathname === '/agents/ensure') {
            const payload = await readJson(request);
            jsonResponse(response, 200, await serialized(() => ensureAgent(payload)));
            return;
        }
        if (request.method === 'GET' && url.pathname === '/agents/credential') {
            const agentId = safeAgentId(url.searchParams.get('agentId'));
            jsonResponse(response, 200, {
                configured: await credentialStatus(agentId), provider, providerName, model, modelName,
            });
            return;
        }
        if (request.method === 'POST' && url.pathname === '/agents/credential') {
            const payload = await readJson(request, 16 * 1024);
            jsonResponse(response, 200, await serialized(() => saveCredential(payload)));
            return;
        }
        if (request.method === 'POST' && url.pathname === '/agents/attachments') {
            const payload = await readJson(request, 96 * 1024 * 1024);
            jsonResponse(response, 201, await saveAttachments(payload));
            return;
        }
        if (url.pathname === '/openclaw/v1/models' && request.method === 'GET') {
            await proxyGateway(request, response, gatewayToken, '/v1/models');
            return;
        }
        if (url.pathname === '/openclaw/v1/chat/completions' && request.method === 'POST') {
            await proxyGateway(request, response, gatewayToken, '/v1/chat/completions');
            return;
        }
        jsonResponse(response, 404, { error: 'Маршрут не найден.' });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        jsonResponse(response, /Некоррект|Пустой|Слишком|Токен/.test(message) ? 400 : 502, { error: message });
    }
});

server.listen(controlPort, controlHost, () => {
    console.log(`OpenClaw control API слушает ${controlHost}:${controlPort}.`);
});

function shutdown(signal) {
    server.close(() => {});
    gateway.kill(signal);
    setTimeout(() => process.exit(0), 5000).unref();
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
