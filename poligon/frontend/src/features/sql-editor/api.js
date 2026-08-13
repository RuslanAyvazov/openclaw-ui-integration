// API surface for SQL Editor. Currently returns mock data from mockData.js.
// When backend is ready, replace these with real fetch calls through shared/api.js.

import { DATABASES, SPARK_SESSIONS, FW_VERSIONS, MOCK_COLS, MOCK_ROWS, EXPLAIN_TEXT,
         MODEL_DELAY, buildDistManifest } from './mock';
import { request } from '../../shared/api';
import { parseProjectFiles, normalizeProjectPaths } from '../../shared/etlTemplates';

export const fetchDatamart  = (id) => request(`/datamarts/${id}`);
export const fetchDatamarts = ()   => request('/datamarts');

export async function fetchDatabases()     { return DATABASES; }
export async function fetchSparkSessions() { return SPARK_SESSIONS; }
export async function fetchFwVersions()    { return FW_VERSIONS; }

// Simulates query execution; returns rows + explain plan after a small delay.
export async function executeQuery(/* { sql, sessionId, fwVersion } */) {
    await new Promise(r => setTimeout(r, 700));
    return { columns: MOCK_COLS, rows: MOCK_ROWS, explain: EXPLAIN_TEXT };
}

// AI assistant —————————————————————————————————————————————
export async function fetchAiModels() { return request('/ai/agents'); }

export function fetchLlmConnection() {
    return request('/ai/llm-connection');
}

export function saveLlmConnection(token) {
    return request('/ai/llm-connection', {
        method: 'PUT',
        body: JSON.stringify({ token }),
    });
}

const conversationScope = scope => encodeURIComponent(String(scope || 'global'));
const conversationId = id => encodeURIComponent(String(id));

export function fetchAiConversations(scope) {
    return request(`/ai/conversations?scope=${conversationScope(scope)}`);
}

export function saveAiConversation(scope, id, data) {
    return request(`/ai/conversations/${conversationId(id)}?scope=${conversationScope(scope)}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export function deleteAiConversation(scope, id) {
    return request(`/ai/conversations/${conversationId(id)}?scope=${conversationScope(scope)}`, {
        method: 'DELETE',
    });
}

export function setActiveAiConversation(scope, id) {
    return request('/ai/conversations/active', {
        method: 'PUT',
        body: JSON.stringify({ scope: String(scope || 'global'), conversationId: String(id || '') }),
    });
}

// Pulls the first ```sql fenced block out of a markdown reply → { text, sql? }.
function splitSqlFromReply(raw = '') {
    const match = raw.match(/```sql\s*\n([\s\S]*?)```/i);
    if (!match) return { text: raw.trim() };
    const sql = match[1].trim();
    const text = (raw.slice(0, match.index) + raw.slice(match.index + match[0].length)).trim();
    return { text: text || 'Готово — запрос ниже.', sql };
}

// Pulls the b2c-project block (datamart project from the agent)
// → { text, project?: { mart, files } }.
// Агенты оформляют блок по-разному — принимаем несколько вариантов:
//   1) строгий: ```b2c-project\n…```
//   2) язык на своей строке: ```\nb2c-project\n…```
//   3) вообще без фенса — просто маркеры mart:/===FILE:=== в тексте.
function splitProjectFromReply(raw = '') {
    let block = null, start = -1, end = -1;

    let m = raw.match(/```+[ \t]*b2c-project[ \t]*\r?\n([\s\S]*?)```+/i);
    if (!m) m = raw.match(/```+[ \t]*\r?\n[ \t]*b2c-project[ \t]*\r?\n([\s\S]*?)```+/i);
    if (m) {
        block = m[1];
        start = m.index;
        end = m.index + m[0].length;
    } else if (/^===\s*FILE:/m.test(raw)) {
        const fileM = raw.match(/^===\s*FILE:/m);
        const martM = raw.match(/^[ \t]*mart:[ \t]*\S.*$/m);
        start = (martM && martM.index < fileM.index) ? martM.index : fileM.index;
        end = raw.length;
        block = raw.slice(start);
    }
    if (block == null) return { text: raw };

    const parsed = parseProjectFiles(block);
    parsed.files = normalizeProjectPaths(parsed.mart, parsed.files);
    const text = (raw.slice(0, start) + raw.slice(end)).trim();
    const hasFiles = parsed.files && Object.keys(parsed.files).length > 0;
    return { text: text || raw.trim(), project: hasFiles ? parsed : undefined };
}

async function attachmentPayload(file) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    let binary = '';
    const chunkSize = 0x8000;
    for (let index = 0; index < bytes.length; index += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
    }
    return { name: file.name, base64: btoa(binary) };
}

export async function sendAgentMessage({
    prompt,
    model = 'b2c-sql-agent',
    history = [],
    conversationId,
    attachments = [],
    storage = 'iceberg',
    onDelta,
}) {
    const messages = [
        ...history.slice(-12).map(m => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: [
                m.sql ? `${m.text}\n\`\`\`sql\n${m.sql}\n\`\`\`` : m.text,
                m.uploadPath ? `Ранее загруженный пакет в workspace: ${m.uploadPath}.` : '',
            ].filter(Boolean).join('\n\n'),
        })),
        { role: 'user', content: prompt },
    ];
    // An agent turn can be slow and must not be retried automatically: the
    // gateway may already have accepted the first request.
    const res = await fetch('/api/ai/chat', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            messages,
            agentId: model,
            conversationId,
            attachments: await Promise.all(attachments.map(attachmentPayload)),
            storage,
        }),
    });
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `${res.status} ${res.statusText}`);
    }
    if (!res.body) throw new Error('Сервер не вернул поток ответа.');

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let rawText = '';
    let usage = null;

    function consumeEvent(block) {
        const data = block.split(/\r?\n/)
            .filter(line => line.startsWith('data:'))
            .map(line => line.slice(5).trimStart())
            .join('\n');
        if (!data || data === '[DONE]') return;
        let payload;
        try {
            payload = JSON.parse(data);
        } catch {
            return;
        }
        if (payload.error) {
            throw new Error(payload.error.message || payload.error || 'Ошибка ответа модели.');
        }
        if (payload.usage) usage = payload.usage;
        const choice = payload.choices?.[0] || {};
        const content = choice.delta?.content ?? choice.message?.content;
        const delta = typeof content === 'string'
            ? content
            : (Array.isArray(content) ? content.map(item => item?.text || '').join('') : '');
        if (!delta) return;
        rawText += delta;
        onDelta?.(rawText);
    }

    while (true) {
        const { value, done } = await reader.read();
        buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
        let boundary = buffer.match(/\r?\n\r?\n/);
        while (boundary) {
            const block = buffer.slice(0, boundary.index);
            buffer = buffer.slice(boundary.index + boundary[0].length);
            consumeEvent(block);
            boundary = buffer.match(/\r?\n\r?\n/);
        }
        if (done) break;
    }
    if (buffer.trim()) consumeEvent(buffer);

    const uploadPath = res.headers.get('X-B2C-Upload-Path');
    const { text: withoutProject, project } = splitProjectFromReply(rawText);
    const { text, sql } = splitSqlFromReply(withoutProject);
    return {
        role: 'assistant',
        text,
        sql,
        project,
        model,
        usage,
        upload: uploadPath ? { uploadPath } : null,
    };
}

async function jsonFetch(url, options = {}) {
    const res = await fetch(url, { credentials: 'same-origin', ...options });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `${res.status} ${res.statusText}`);
    return data;
}

// The generated context and project files stay in a short-lived server draft
// until the user explicitly confirms creation of a datamart card.
export function buildMartDraft(payload) {
    return jsonFetch('/api/ai/build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
}

export function fetchMartDraft(id) {
    return jsonFetch(`/api/ai/drafts/${encodeURIComponent(id)}`);
}

export function discardMartDraft(id) {
    return jsonFetch(`/api/ai/drafts/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

// Simulates building a datamart distribution from the chosen SQL windows.
// noInsert: keeps the manifest inside the dialog so it never spawns editor tabs.
export async function buildDistribution({ windows = [], model = 'glm-5' }) {
    await new Promise(r => setTimeout(r, MODEL_DELAY[model] ?? 800));
    return {
        role: 'assistant',
        text: `Собрал дистрибутив витрины из ${windows.length} ${windows.length === 1 ? 'окна' : 'окон'}: ${windows.join(', ')}. Манифест ниже — скопируйте при необходимости.`,
        sql: buildDistManifest(windows),
        model,
        noInsert: true,
    };
}
