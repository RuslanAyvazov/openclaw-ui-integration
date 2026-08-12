import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/auth.css';
import { useAuth } from './AuthContext';

// ─── Data Constellation Engine ────────────────────────────────────────────────
// Narrative: entering B2CSQL Studio means plugging into a living data mesh —
// a network of marts, pipelines, and transformations, visualised as a 3D graph.

const MART_LABELS = [
    'mart.orders', 'mart.customers', 'stg.pipeline',
    'dw.schema', 'etl.transform', 'mart.products',
    'spark.session', 'flink.stream', 'hdfs.storage',
    'mart.metrics',
];

class DataMesh {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.w = 0;
        this.h = 0;
        this.nodes = [];
        this.edges = [];
        this.particles = [];
        this.time = 0;
        this.rotX = 0.14;
        this.rotY = 0;
        this.tRotX = 0.14;
        this.tRotY = 0;
        this.mx = 0;
        this.my = 0;
        this.assembleT = performance.now();
        this.ASSEMBLE = 2200;
        this.rafId = null;

        this._onResize = () => this._resize();
        this._onMouse = (e) => {
            this.mx = (e.clientX / window.innerWidth - 0.5) * 2;
            this.my = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener('resize', this._onResize);
        window.addEventListener('mousemove', this._onMouse);
        this._resize();
        this._build();
    }

    _resize() {
        this.w = this.canvas.width = window.innerWidth;
        this.h = this.canvas.height = window.innerHeight;
    }

    _build() {
        const N = 62;
        const R = Math.min(this.w, this.h) * 0.34;

        // Distribute nodes on a fuzzy sphere using golden ratio spiral
        this.nodes = Array.from({ length: N }, (_, i) => {
            const phi = Math.acos(1 - 2 * (i + 0.5) / N);
            const theta = Math.PI * (1 + Math.sqrt(5)) * i;
            const r = R * (0.45 + 0.55 * Math.cbrt(Math.random()));
            return {
                x: r * Math.sin(phi) * Math.cos(theta),
                y: r * Math.sin(phi) * Math.sin(theta),
                z: r * Math.cos(phi),
                // Start position for assembly animation (near origin, random offset)
                ox: (Math.random() - 0.5) * 120,
                oy: (Math.random() - 0.5) * 120,
                oz: (Math.random() - 0.5) * 120,
                size: 1.6 + Math.random() * 3.8,
                bright: 0.45 + Math.random() * 0.55,
                phase: Math.random() * Math.PI * 2,
                pSpeed: 0.35 + Math.random() * 1.4,
                label: i % 6 === 0 ? MART_LABELS[Math.floor(i / 6) % MART_LABELS.length] : null,
            };
        });

        // Connect nearest neighbours (max 3 edges per node)
        const MAX_D = R * 0.72;
        const cnt = new Uint8Array(N);
        this.edges = [];

        for (let i = 0; i < N; i++) {
            const ni = this.nodes[i];
            const near = [];
            for (let j = i + 1; j < N; j++) {
                const nj = this.nodes[j];
                const d = Math.hypot(ni.x - nj.x, ni.y - nj.y, ni.z - nj.z);
                if (d < MAX_D) near.push({ j, d });
            }
            near.sort((a, b) => a.d - b.d);
            for (const { j, d } of near.slice(0, 3)) {
                if (cnt[i] < 4 && cnt[j] < 4) {
                    this.edges.push({ from: i, to: j, alpha: 1 - d / MAX_D });
                    cnt[i]++; cnt[j]++;
                }
            }
        }

        // Spawn particles flowing along edges
        this.particles = this.edges.flatMap(e =>
            Array.from({ length: 2 + (Math.random() * 2 | 0) }, () => ({
                e,
                t: Math.random(),
                spd: 0.0006 + Math.random() * 0.0012,
                sz: 0.9 + Math.random() * 1.5,
            }))
        );
    }

    // Rotation helpers
    _rot(x, y, z, rx, ry) {
        // Y-axis rotation
        const cy = Math.cos(ry), sy = Math.sin(ry);
        const x2 = x * cy + z * sy;
        const z2 = -x * sy + z * cy;
        // X-axis rotation
        const cx = Math.cos(rx), sx = Math.sin(rx);
        const y3 = y * cx - z2 * sx;
        const z3 = y * sx + z2 * cx;
        return { x: x2, y: y3, z: z3 };
    }

    _proj(x, y, z) {
        const fov = 530;
        const d = Math.max(z + 920, 50);
        const s = fov / d;
        return { sx: x * s + this.w / 2, sy: y * s + this.h / 2, s, z };
    }

    _easeOut3(t) { return 1 - Math.pow(1 - t, 3); }

    _frame() {
        const { ctx, w, h, time } = this;
        ctx.clearRect(0, 0, w, h);

        // Smooth rotation — auto-orbit + mouse parallax
        const baseY = time * 0.0028;
        this.tRotY = baseY + this.mx * 0.38;
        this.tRotX = 0.14 + this.my * 0.28;
        this.rotX += (this.tRotX - this.rotX) * 0.04;
        this.rotY += (this.tRotY - this.rotY) * 0.04;

        // Assembly progress (cubic ease-out)
        const ap = this._easeOut3(Math.min((performance.now() - this.assembleT) / this.ASSEMBLE, 1));
        const edgeAp = Math.max(0, (ap - 0.3) / 0.7);
        const ptAp = Math.max(0, (ap - 0.55) / 0.45);
        const lblAp = Math.max(0, (ap - 0.78) / 0.22);

        // Project all nodes
        const proj = this.nodes.map(n => {
            const x = n.ox + (n.x - n.ox) * ap;
            const y = n.oy + (n.y - n.oy) * ap;
            const z = n.oz + (n.z - n.oz) * ap;
            const r = this._rot(x, y, z, this.rotX, this.rotY);
            return { ...this._proj(r.x, r.y, r.z), n };
        });

        // Back-to-front sort for proper depth layering
        const order = proj.map((_, i) => i).sort((a, b) => proj[b].z - proj[a].z);

        // ── Edges ──────────────────────────────────────────────────────────────
        if (edgeAp > 0) {
            this.edges.forEach(e => {
                const f = proj[e.from], t = proj[e.to];
                ctx.beginPath();
                ctx.moveTo(f.sx, f.sy);
                ctx.lineTo(t.sx, t.sy);
                ctx.strokeStyle = `rgba(52,152,219,${e.alpha * edgeAp * 0.28})`;
                ctx.lineWidth = 0.65;
                ctx.stroke();
            });
        }

        // ── Particles ──────────────────────────────────────────────────────────
        if (ptAp > 0) {
            this.particles.forEach(p => {
                p.t += p.spd;
                if (p.t > 1) p.t -= 1;
                const f = proj[p.e.from], t = proj[p.e.to];
                const px = f.sx + (t.sx - f.sx) * p.t;
                const py = f.sy + (t.sy - f.sy) * p.t;
                const sc = (f.s + t.s) * 0.5;
                const r = Math.max(p.sz * sc, 0.4);
                ctx.beginPath();
                ctx.arc(px, py, r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(96,184,255,${p.e.alpha * ptAp * 0.72})`;
                ctx.fill();
            });
        }

        // ── Nodes + Labels (front to back) ────────────────────────────────────
        order.reverse();
        order.forEach(i => {
            const { sx, sy, s, n } = proj[i];
            const pulse = 0.82 + 0.18 * Math.sin(time * 0.7 * n.pSpeed + n.phase);
            const size = n.size * s * pulse * ap;
            if (size < 0.3) return;

            const alpha = n.bright * Math.min(s * 2.2, 1) * ap;

            // Soft glow halo
            const grd = ctx.createRadialGradient(sx, sy, 0, sx, sy, size * 5.5);
            grd.addColorStop(0, `rgba(52,152,219,${alpha * 0.32})`);
            grd.addColorStop(1, 'rgba(52,152,219,0)');
            ctx.beginPath();
            ctx.arc(sx, sy, size * 5.5, 0, Math.PI * 2);
            ctx.fillStyle = grd;
            ctx.fill();

            // Node core
            ctx.beginPath();
            ctx.arc(sx, sy, Math.max(size, 0.4), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(100,180,255,${alpha})`;
            ctx.fill();

            // Data label (appears last during assembly)
            if (n.label && lblAp > 0 && s > 0.5) {
                const fs = Math.max(8, Math.floor(9 * s));
                ctx.font = `${fs}px 'JetBrains Mono', monospace`;
                ctx.fillStyle = `rgba(96,184,255,${lblAp * alpha * 0.65})`;
                ctx.fillText(n.label, sx + size + 5, sy + 3);
            }
        });

        this.time++;
    }

    start() {
        const loop = () => { this._frame(); this.rafId = requestAnimationFrame(loop); };
        loop();
    }

    destroy() {
        if (this.rafId) cancelAnimationFrame(this.rafId);
        window.removeEventListener('resize', this._onResize);
        window.removeEventListener('mousemove', this._onMouse);
    }
}

// ─── Auth Page Component ──────────────────────────────────────────────────────

const TECH_CHIPS = [
    { icon: 'fas fa-bolt',            label: 'Apache Spark' },
    { icon: 'fas fa-layer-group',     label: 'Batch' },
    { icon: 'fas fa-history',         label: 'SCD' },
    { icon: 'fas fa-table',           label: 'HBase' },
    { icon: 'fas fa-stream',          label: 'Kafka' },
    { icon: 'fas fa-server',          label: 'HDFS' },
    { icon: 'fas fa-terminal',        label: 'SQL Editor' },
    { icon: 'fas fa-project-diagram', label: 'ETL Designer' },
];

export default function AuthPage() {
    const canvasRef = useRef(null);
    const cardRef = useRef(null);
    const navigate = useNavigate();
    const { signIn, signUp } = useAuth();
    const [mode, setMode] = useState('login');
    const [leaving, setLeaving] = useState(false);
    const [form, setForm] = useState({ login: '', name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [visible, setVisible] = useState(false);

    // Mount the 3D canvas
    useEffect(() => {
        const mesh = new DataMesh(canvasRef.current);
        mesh.start();
        // Slight delay before revealing UI so the mesh can partially assemble first
        const t = setTimeout(() => setVisible(true), 180);
        return () => { mesh.destroy(); clearTimeout(t); };
    }, []);

    // Mouse-tracked tilt on the form card — gives the glass surface a subtle
    // sense of depth without re-rendering on every mouse move.
    function onCardMouseMove(e) {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
        const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
        cardRef.current.style.setProperty('--tx', x.toFixed(3));
        cardRef.current.style.setProperty('--ty', y.toFixed(3));
    }
    function onCardMouseLeave() {
        if (!cardRef.current) return;
        cardRef.current.style.setProperty('--tx', '0');
        cardRef.current.style.setProperty('--ty', '0');
    }

    function switchMode(next) {
        if (next === mode || loading) return;
        setLeaving(true);
        setError('');
        setTimeout(() => {
            setMode(next);
            setLeaving(false);
        }, 260);
    }

    const upd = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

    async function handleSubmit(e) {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        setError('');
        try {
            if (mode === 'login') {
                await signIn({ login: form.login, password: form.password });
            } else {
                await signUp(form);
            }
            navigate('/', { replace: true });
        } catch (submitError) {
            setError(submitError?.message || 'Не удалось выполнить вход.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="ar">
            {/* 3D constellation canvas — full bleed background */}
            <canvas ref={canvasRef} className="ar-canvas" aria-hidden="true" />

            {/* Aurora orbs — drifting blurred gradients for ambient depth */}
            <div className="ar-aurora" aria-hidden="true">
                <div className="ar-aurora-orb ar-aurora-orb--a" />
                <div className="ar-aurora-orb ar-aurora-orb--b" />
                <div className="ar-aurora-orb ar-aurora-orb--c" />
            </div>

            {/* Atmospheric vignette overlay */}
            <div className="ar-vig" aria-hidden="true" />

            {/* Main layout */}
            <div className={`ar-layout ${visible ? 'visible' : ''}`}>

                {/* ── Brand side ─────────────────────────────────────────── */}
                <div className="ar-brand" aria-hidden="true">
                    {/* Monumental 3D wordmark — depth via layered duplicates */}
                    <h1 className="ar-hl-3d" aria-label="B2C-SQL">
                        <span className="ar-hl-3d-text" data-text="B2C-SQL">B2C-SQL</span>
                    </h1>

                    <p className="ar-sub">
                        Платформа управления витринами данных.<br />
                        От разработки — до RDT.
                    </p>

                    {/* Tech stack chips */}
                    <div className="ar-chips">
                        {TECH_CHIPS.map(({ icon, label }, i) => (
                            <div key={label} className="ar-chip" style={{ '--d': `${700 + i * 105}ms` }}>
                                <i className={icon} />
                                <span>{label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Animated data stream — flowing dots represent live data */}
                    <div className="ar-stream">
                        {[0, 550, 1100, 1650].map(d => (
                            <div key={d} className="ar-stream-dot" style={{ '--sd': `${d}ms` }} />
                        ))}
                    </div>
                </div>

                {/* ── Form side ──────────────────────────────────────────── */}
                <div className="ar-form-side">
                    <div
                        ref={cardRef}
                        className="ar-card"
                        role="main"
                        onMouseMove={onCardMouseMove}
                        onMouseLeave={onCardMouseLeave}
                    >
                        {/* 3D depth markers — top-edge highlight + bottom rim */}
                        <span className="ar-card-rim" aria-hidden="true" />
                        <span className="ar-card-glow" aria-hidden="true" />

                        {/* Tab switcher */}
                        <div className="ar-tabs" role="tablist" aria-label="Режим авторизации">
                            <button
                                role="tab"
                                aria-selected={mode === 'login'}
                                className={`ar-tab ${mode === 'login' ? 'active' : ''}`}
                                onClick={() => switchMode('login')}
                            >
                                Войти
                            </button>
                            <button
                                role="tab"
                                aria-selected={mode === 'register'}
                                className={`ar-tab ${mode === 'register' ? 'active' : ''}`}
                                onClick={() => switchMode('register')}
                            >
                                Регистрация
                            </button>
                        </div>

                        {/* Contextual greeting */}
                        <div className="ar-greeting">
                            {mode === 'login' ? 'С возвращением,' : 'Добро пожаловать,'}
                            <br />
                            <strong>{mode === 'login' ? 'войдите в аккаунт' : 'создайте аккаунт'}</strong>
                        </div>

                        {/* Form with cross-fade transition between modes */}
                        <form
                            className={`ar-form-body ${leaving ? 'out' : 'in'}`}
                            onSubmit={handleSubmit}
                            aria-label={mode === 'login' ? 'Форма входа' : 'Форма регистрации'}
                        >
                            <label className="ar-field">
                                <span>Логин Sigma</span>
                                <div className="ar-input-wrap">
                                    <i className="fas fa-id-badge" aria-hidden="true" />
                                    <input
                                        type="text"
                                        className="ar-input"
                                        placeholder="i.ivanov"
                                        value={form.login}
                                        onChange={upd('login')}
                                        required
                                        autoComplete="username"
                                    />
                                </div>
                            </label>

                            {mode === 'register' && (
                                <label className="ar-field">
                                    <span>ФИО пользователя</span>
                                    <div className="ar-input-wrap">
                                        <i className="fas fa-user" aria-hidden="true" />
                                        <input
                                            type="text"
                                            className="ar-input"
                                            placeholder="Иванов Иван Иванович"
                                            value={form.name}
                                            onChange={upd('name')}
                                            required
                                            autoComplete="name"
                                        />
                                    </div>
                                </label>
                            )}

                            {mode === 'register' && (
                                <label className="ar-field">
                                    <span>Почта Sigma</span>
                                    <div className="ar-input-wrap">
                                        <i className="fas fa-envelope" aria-hidden="true" />
                                        <input
                                            type="email"
                                            className="ar-input"
                                            placeholder="i.ivanov@sigma.local"
                                            value={form.email}
                                            onChange={upd('email')}
                                            required
                                            autoComplete="email"
                                        />
                                    </div>
                                </label>
                            )}

                            <label className="ar-field">
                                <span>Пароль</span>
                                <div className="ar-input-wrap">
                                    <i className="fas fa-lock" aria-hidden="true" />
                                    <input
                                        type="password"
                                        className="ar-input"
                                        placeholder="············"
                                        value={form.password}
                                        onChange={upd('password')}
                                        required
                                        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                                    />
                                </div>
                                {mode === 'register' && <small className="ar-field-hint">Не менее 8 символов</small>}
                            </label>

                            {error && (
                                <div className="ar-error" role="alert">
                                    <i className="fas fa-exclamation-circle" aria-hidden="true" />
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className={`ar-btn ${loading ? 'loading' : ''}`}
                                disabled={loading}
                            >
                                {loading ? (
                                    <><span className="ar-spin" aria-hidden="true" /> {mode === 'login' ? 'Входим…' : 'Создаём аккаунт…'}</>
                                ) : mode === 'login' ? (
                                    'Войти в систему'
                                ) : (
                                    'Создать аккаунт'
                                )}
                            </button>
                        </form>

                        {/* Card footer */}
                        <div className="ar-footer">
                            <span className="ar-version-badge">v1.010.13</span>
                            <span>© 2026 B2C-SQL</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
