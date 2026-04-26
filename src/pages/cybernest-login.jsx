import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, Eye, EyeOff, CheckCircle2, AlertCircle, Loader } from 'lucide-react';

const BASE_URL = 'https://prenatal-unpleased-unplug.ngrok-free.dev';

const S = {
  page: { minHeight: '100vh', backgroundColor: '#020817', color: '#f8fafc', fontFamily: "'JetBrains Mono', 'Fira Code', monospace", display: 'flex', flexDirection: 'column' },
  gridBg: {
    position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.025,
    backgroundImage: `linear-gradient(0deg,transparent 24%,rgba(34,211,238,.08) 25%,rgba(34,211,238,.08) 26%,transparent 27%,transparent 74%,rgba(34,211,238,.08) 75%,rgba(34,211,238,.08) 76%,transparent 77%),linear-gradient(90deg,transparent 24%,rgba(34,211,238,.08) 25%,rgba(34,211,238,.08) 26%,transparent 27%,transparent 74%,rgba(34,211,238,.08) 75%,rgba(34,211,238,.08) 76%,transparent 77%)`,
    backgroundSize: '50px 50px',
  },
  glow: { position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,238,0.04) 0%, transparent 70%)', pointerEvents: 'none' },
  header: { borderBottom: '1px solid #1e293b', backgroundColor: 'rgba(2,8,23,0.8)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 30 },
  headerInner: { maxWidth: '80rem', margin: '0 auto', padding: '0.875rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  main: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' },
  card: { width: '100%', maxWidth: '26rem', backgroundColor: 'rgba(15,23,42,0.9)', border: '1px solid #1e293b', borderRadius: '1rem', padding: '2.5rem', boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(34,211,238,0.03)' },
  label: { display: 'block', fontSize: '0.7rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase' },
  inputWrap: { position: 'relative' },
  inputIcon: { position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' },
  input: { width: '100%', paddingLeft: '2.75rem', paddingRight: '1rem', paddingTop: '0.75rem', paddingBottom: '0.75rem', backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '0.625rem', fontSize: '0.875rem', color: '#f8fafc', outline: 'none', boxSizing: 'border-box', transition: 'border-color .2s, box-shadow .2s', fontFamily: 'inherit' },
  eyeBtn: { position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: 0 },
  errorBox: { padding: '0.875rem', backgroundColor: 'rgba(127,29,29,.25)', border: '1px solid rgba(248,113,113,.2)', borderRadius: '0.625rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' },
  footer: { borderTop: '1px solid #0f172a', backgroundColor: 'rgba(2,8,23,0.5)', padding: '1rem 0' },
  footerInner: { maxWidth: '80rem', margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem', color: '#334155', fontFamily: 'inherit' },
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [pulse, setPulse] = useState(true);
  const [btnHover, setBtnHover] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) navigate('/cybernest-dashboard');
    const t = setInterval(() => setPulse(p => !p), 1800);
    return () => clearInterval(t);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Email aur password dono required hain'); return; }

    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('adminEmail', email);
        // Save name/org if returned by API
        if (data.user) {
          localStorage.setItem('adminName', data.user.name || '');
          localStorage.setItem('adminOrg', data.user.organization_name || '');
        }
        navigate('/index');
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch {
      setError('Connection failed! check your Backend.');
    } finally {
      setIsLoading(false);
    }
  };

  const btnStyle = {
    width: '100%', padding: '0.875rem 1rem', borderRadius: '0.625rem',
    fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.05em',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
    transition: 'all 0.25s ease', opacity: isLoading ? 0.65 : 1,
    background: btnHover && !isLoading
      ? 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)'
      : 'linear-gradient(135deg, #0c4a6e 0%, #0e7490 100%)',
    border: btnHover && !isLoading ? '1px solid #22d3ee' : '1px solid #075985',
    color: '#f8fafc', fontFamily: 'inherit',
    boxShadow: btnHover && !isLoading ? '0 0 28px rgba(34,211,238,0.3)' : '0 2px 8px rgba(0,0,0,0.4)',
    transform: btnHover && !isLoading ? 'translateY(-1px)' : 'translateY(0)',
  };

  const focusInput = e => { e.target.style.borderColor = '#22d3ee'; e.target.style.boxShadow = '0 0 0 3px rgba(34,211,238,.08)'; };
  const blurInput = e => { e.target.style.borderColor = '#1e293b'; e.target.style.boxShadow = 'none'; };

  return (
    <div style={S.page}>
      <div style={S.gridBg} />
      <div style={S.glow} />

      {/* HEADER */}
      <div style={S.header}>
        <div style={S.headerInner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '0.5rem', backgroundColor: '#0f172a', border: '1px solid #1e293b', display: 'flex' }}>
              <Shield size={18} color="#22d3ee" />
            </div>
            <div>
              <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', margin: 0, letterSpacing: '0.05em' }}>CYBERNEST<span style={{ color: '#22d3ee' }}>_MDM</span></p>
              <p style={{ fontSize: '0.65rem', color: '#334155', margin: 0, letterSpacing: '0.08em' }}>MOBILE DEVICE MANAGEMENT</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.875rem', borderRadius: '0.375rem', backgroundColor: '#0f172a', border: '1px solid #1e293b' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#34d399', boxShadow: pulse ? '0 0 6px #34d399' : 'none', transition: 'box-shadow 0.5s' }} />
            <span style={{ fontSize: '0.7rem', color: '#64748b', letterSpacing: '0.05em' }}>SYS:ONLINE</span>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={S.main}>
        <div style={{ width: '100%', maxWidth: '26rem' }}>
          {/* Scan line effect */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'inline-flex', padding: '0.25rem 1rem', borderRadius: '9999px', backgroundColor: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.15)', fontSize: '0.7rem', color: '#22d3ee', letterSpacing: '0.1em', marginBottom: '1rem' }}>
              ◉ SECURE ADMIN PORTAL
            </div>
          </div>

          <div style={S.card}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                <div style={{ padding: '1rem', borderRadius: '0.875rem', backgroundColor: '#0f172a', border: '1px solid rgba(34,211,238,0.2)', display: 'inline-flex', boxShadow: '0 0 20px rgba(34,211,238,0.08)' }}>
                  <Lock size={26} color="#22d3ee" />
                </div>
              </div>
              <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 0.375rem', letterSpacing: '0.02em' }}>Admin Authorization</h2>
              <p style={{ fontSize: '0.8rem', color: '#475569', margin: 0 }}>Secure access to device management system</p>
            </div>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={S.label}>Email Address</label>
                <div style={S.inputWrap}>
                  <span style={S.inputIcon}><Mail size={14} /></span>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="admin@cybernest.com" style={S.input}
                    onFocus={focusInput} onBlur={blurInput} autoComplete="email" />
                </div>
              </div>

              <div>
                <label style={S.label}>Password</label>
                <div style={S.inputWrap}>
                  <span style={S.inputIcon}><Lock size={14} /></span>
                  <input type={showPassword ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                    style={{ ...S.input, paddingRight: '2.75rem' }}
                    onFocus={focusInput} onBlur={blurInput} autoComplete="current-password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={S.eyeBtn}>
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {error && (
                <div style={S.errorBox}>
                  <AlertCircle size={15} color="#f87171" style={{ flexShrink: 0, marginTop: 1 }} />
                  <p style={{ fontSize: '0.8rem', color: '#f87171', margin: 0 }}>{error}</p>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#64748b' }}>
                  <input type="checkbox" style={{ width: 13, height: 13, accentColor: '#0891b2' }} />
                  Remember me
                </label>
                <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#22d3ee', fontSize: '0.8rem', fontFamily: 'inherit' }}>
                  Forgot Password?
                </button>
              </div>

              <button type="submit" disabled={isLoading} style={btnStyle}
                onMouseEnter={() => setBtnHover(true)}
                onMouseLeave={() => setBtnHover(false)}>
                {isLoading
                  ? <><Loader size={15} style={{ animation: 'spin 1s linear infinite' }} /><span>Authenticating...</span></>
                  : <><Lock size={15} /><span>Login</span></>
                }
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#475569', margin: 0 }}>
                Don't Have Account Yet?{' '}
                <span onClick={() => navigate('/signup')} style={{ color: '#22d3ee', cursor: 'pointer', fontWeight: 500 }}>
                  Sign Up
                </span>
              </p>
            </form>

            {/* Demo */}
            <div style={{ marginTop: '1.5rem', padding: '0.875rem', backgroundColor: 'rgba(15,23,42,0.8)', border: '1px solid #0f172a', borderRadius: '0.625rem' }}>
              <p style={{ fontSize: '0.65rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Demo Credentials</p>
              <p style={{ fontSize: '0.75rem', color: '#475569', fontFamily: 'monospace', margin: '2px 0' }}>admin@cybernest.com</p>
              <p style={{ fontSize: '0.75rem', color: '#475569', fontFamily: 'monospace', margin: '2px 0' }}>Admin@123</p>
            </div>
          </div>

          <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.7rem', color: '#334155' }}>
            <CheckCircle2 size={13} color="#34d399" />
            <span>Secure encrypted connection established</span>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={S.footer}>
        <div style={S.footerInner}>
          <span>© 2024 CyberNest MDM. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {['Documentation', 'Support', 'Status'].map(l => (
              <button key={l} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#334155', fontSize: '0.7rem', fontFamily: 'inherit' }}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}
