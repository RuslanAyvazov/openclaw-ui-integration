async function authRequest(path, options = {}) {
    const response = await fetch(`/api/auth${path}`, {
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
        ...options,
    });
    const data = response.status === 204 ? null : await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data?.error || `${response.status} ${response.statusText}`);
    return data;
}

export const getCurrentUser = () => authRequest('/me');
export const loginUser = credentials => authRequest('/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
});
export const registerUser = fields => authRequest('/register', {
    method: 'POST',
    body: JSON.stringify(fields),
});
export const logoutUser = () => authRequest('/logout', { method: 'POST' });
