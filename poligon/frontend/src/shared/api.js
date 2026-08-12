const BASE = '/api';

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

// Vite proxy returns 502 when backend isn't ready yet (ECONNREFUSED).
// We retry on 502/503/504 and on network errors (TypeError).
export async function request(path, options = {}) {
    const url = `${BASE}${path}`;
    const fetchOptions = {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        ...options
    };

    for (let attempt = 1; attempt <= 5; attempt++) {
        try {
            const res = await fetch(url, fetchOptions);

            if ([502, 503, 504].includes(res.status) && attempt < 5) {
                await sleep(attempt * 1500);
                continue;
            }

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || `${res.status} ${res.statusText}`);
            }
            if (res.status === 204) return null;
            return res.json();
        } catch (err) {
            if (err instanceof TypeError && attempt < 5) {
                await sleep(attempt * 1500);
            } else {
                throw err;
            }
        }
    }
}
