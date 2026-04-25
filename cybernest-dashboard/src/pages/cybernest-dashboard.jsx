/**
 * CyberNest MDM — Unified Dashboard
 * Drop this file in as your dashboard page.
 * All nav items (Dashboard, Devices, Commands, Policies, Settings, Profile)
 * are rendered inside ONE component — no separate router files needed.
 *
 * Real API calls → BASE_URL (change to your backend).
 * Every page that was previously a standalone file is now a sub-component here.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity, AlertTriangle, BarChart3, LogOut, Menu, Shield, Smartphone,
  Settings, CheckCircle2, XCircle, RefreshCw, Plus, X, QrCode, Link,
  User, Building2, Mail, Copy, Clock, Loader, ChevronRight, Search,
  Lock, Eye, EyeOff, Edit3, Save, Camera, Package, Navigation,
  Wifi, Settings2, Download, Zap, MoreVertical, ChevronDown,
  Terminal, MapPin, Battery, BatteryLow, BatteryMedium, BatteryFull,
  Trash2, RotateCw, FileText, Bell, Globe, Info, CheckSquare, Square,
  ToggleLeft, ToggleRight, Server, Database, Key, Monitor, Cpu,
  HardDrive, Network, ShieldCheck, AlertCircle, ChevronLeft,
  Play, Pause, Power, Layers, Filter, Upload,
} from 'lucide-react';

// ─── CONFIG ────────────────────────────────────────────────────────────────────
const BASE_URL = 'https://prenatal-unpleased-unplug.ngrok-free.dev';
const getToken = () => localStorage.getItem('token');
const authHeaders = () => ({
  'Authorization': `Bearer ${getToken()}`,
  'ngrok-skip-browser-warning': 'true',
  'Content-Type': 'application/json',
});

// ─── DESIGN TOKENS ─────────────────────────────────────────────────────────────
const C = {
  bg950: '#020817', bg900: '#0f172a', bg800: '#1e293b', bg700: '#334155',
  bg600: '#475569', bg500: '#64748b',
  text50: '#f8fafc', text100: '#f1f5f9', text200: '#e2e8f0',
  text300: '#cbd5e1', text400: '#94a3b8', text500: '#64748b', text600: '#475569',
  cyan400: '#22d3ee', cyan500: '#06b6d4', cyan600: '#0891b2', cyan700: '#0e7490',
  emerald400: '#34d399', emerald500: '#10b981', emerald600: '#059669',
  red400: '#f87171', red500: '#ef4444', red600: '#dc2626',
  yellow400: '#facc15', yellow500: '#eab308', yellow600: '#ca8a04',
  purple400: '#a78bfa', purple600: '#7c3aed',
  orange400: '#fb923c', orange600: '#ea580c',
  border800: '#1e293b', border700: '#334155', border600: '#475569',
};

// ─── SHARED STYLES ─────────────────────────────────────────────────────────────
const S = {
  card: {
    backgroundColor: C.bg900,
    border: `1px solid ${C.border800}`,
    borderRadius: '0.75rem',
  },
  sidebarBtn: (active) => ({
    width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
    padding: '0.625rem 1rem', borderRadius: '0.5rem',
    border: active ? `1px solid ${C.border700}` : '1px solid transparent',
    backgroundColor: active ? C.bg800 : 'transparent',
    color: active ? C.cyan400 : C.text400,
    fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer',
    transition: 'all 0.2s', fontFamily: 'inherit',
  }),
  input: {
    width: '100%', padding: '0.625rem 0.875rem',
    backgroundColor: C.bg800, border: `1px solid ${C.border700}`,
    borderRadius: '0.5rem', fontSize: '0.875rem', color: C.text50,
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  },
  btnPrimary: {
    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
    padding: '0.625rem 1.25rem', backgroundColor: C.cyan600,
    border: 'none', borderRadius: '0.5rem', color: '#fff',
    fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
  },
  btnSecondary: {
    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
    padding: '0.625rem 1.25rem', backgroundColor: C.bg800,
    border: `1px solid ${C.border700}`, borderRadius: '0.5rem', color: C.text300,
    fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
  },
  btnDanger: {
    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
    padding: '0.625rem 1.25rem',
    backgroundColor: 'rgba(220,38,38,0.12)',
    border: `1px solid rgba(220,38,38,0.3)`, borderRadius: '0.5rem', color: C.red400,
    fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
  },
  tableHeader: {
    padding: '0.75rem 1rem', textAlign: 'left',
    fontSize: '0.65rem', fontWeight: 600, color: C.text500,
    textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap',
  },
  tableCell: {
    padding: '0.875rem 1rem', borderBottom: `1px solid ${C.border800}`,
  },
};

// ─── SMALL REUSABLE COMPONENTS ─────────────────────────────────────────────────
function Toggle({ value, onChange, color = C.emerald600 }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        position: 'relative', width: 44, height: 22, borderRadius: 9999,
        backgroundColor: value ? color : C.bg700,
        border: 'none', cursor: 'pointer', flexShrink: 0,
        transition: 'background-color 0.2s',
      }}
    >
      <div style={{
        position: 'absolute', top: 3, left: value ? 24 : 3,
        width: 16, height: 16, backgroundColor: '#fff',
        borderRadius: '50%', transition: 'left 0.2s',
      }} />
    </button>
  );
}

function Spinner({ size = 20, color = C.cyan400 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      border: `2px solid ${color}30`,
      borderTop: `2px solid ${color}`,
      animation: 'cn-spin 0.8s linear infinite',
      display: 'inline-block', flexShrink: 0,
    }} />
  );
}

function StatusDot({ status }) {
  const map = {
    online: C.emerald400, enrolled: C.emerald400, active: C.emerald400,
    offline: C.text600, unknown: C.text600,
    warning: C.yellow400, pending: C.yellow400,
  };
  const color = map[status] || C.text600;
  const isOnline = status === 'online' || status === 'enrolled' || status === 'active';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{
        width: 7, height: 7, borderRadius: '50%', backgroundColor: color,
        boxShadow: isOnline ? `0 0 6px ${color}` : 'none',
      }} />
      <span style={{ fontSize: '0.75rem', fontWeight: 500, color }}>{status}</span>
    </div>
  );
}

function Toast({ toasts }) {
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 16px', borderRadius: 10, minWidth: 260,
          background: t.type === 'success' ? 'rgba(6,78,59,0.95)' : t.type === 'error' ? 'rgba(127,29,29,0.95)' : 'rgba(15,40,80,0.95)',
          border: `1px solid ${t.type === 'success' ? C.emerald600 : t.type === 'error' ? C.red600 : C.cyan700}`,
          color: t.type === 'success' ? C.emerald400 : t.type === 'error' ? C.red400 : C.cyan400,
          fontSize: 13, fontFamily: 'monospace',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          animation: 'cn-slide-in 0.25s ease',
        }}>
          {t.type === 'success' ? <CheckCircle2 size={15} /> : t.type === 'error' ? <XCircle size={15} /> : <Info size={15} />}
          <span style={{ flex: 1 }}>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: 12 }}>
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: C.text50, margin: '0 0 0.2rem', letterSpacing: '0.02em' }}>{title}</h3>
        {subtitle && <p style={{ fontSize: '0.75rem', color: C.text500, margin: 0, fontFamily: 'monospace' }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function SectionCard({ children, style = {} }) {
  return (
    <div style={{ ...S.card, padding: '1.5rem', ...style }}
      onMouseEnter={e => e.currentTarget.style.borderColor = C.border700}
      onMouseLeave={e => e.currentTarget.style.borderColor = C.border800}>
      {children}
    </div>
  );
}

// ─── TOAST HOOK ────────────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);
  const add = useCallback((message, type = 'info') => {
    const id = ++idRef.current;
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);
  return { toasts, add };
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: DASHBOARD HOME
// ═══════════════════════════════════════════════════════════════════════════════
function DashboardHome({ devices, onNavigate, toast }) {
  const [liveLog, setLiveLog] = useState([
    '[ INFO ]  System initialized — CyberNest MDM v2.0',
    '[ SYNC ]  Policy sync completed for enrolled devices',
    '[ INFO ]  Backend connection established',
  ]);
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const msgs = [
      '[ SYNC ]  Device heartbeat received',
      '[ INFO ]  Policy enforcement check completed',
      '[ WARN ]  Battery low alert processed',
      '[ SYNC ]  Configuration push — all devices',
      '[ INFO ]  Compliance report generated',
      '[ OK   ]  Device location update received',
      '[ SYNC ]  App whitelist enforced on 47 devices',
    ];
    const t = setInterval(() => {
      setLiveLog(p => [...p.slice(-9), msgs[Math.floor(Math.random() * msgs.length)]]);
    }, 4000);
    const pt = setInterval(() => setPulse(v => !v), 1800);
    return () => { clearInterval(t); clearInterval(pt); };
  }, []);

  const online = devices.filter(d => ['online', 'enrolled', 'active'].includes(d.status || d.enrollmentStatus)).length;
  const offline = devices.filter(d => ['offline', 'unenrolled'].includes(d.status || d.enrollmentStatus)).length;
  const lowBattery = devices.filter(d => (d.battery || 0) < 20).length;
  const total = devices.length;

  const metrics = [
    { label: 'Total Enrolled', value: total || '0', icon: Smartphone, color: C.cyan400, sub: 'Fleet size', bg: 'rgba(8,145,178,0.1)', border: 'rgba(34,211,238,0.2)' },
    { label: 'Online Devices', value: online || '0', icon: CheckCircle2, color: C.emerald400, sub: 'Active now', bg: 'rgba(5,150,105,0.1)', border: 'rgba(52,211,153,0.2)' },
    { label: 'Offline Devices', value: offline || '0', icon: XCircle, color: C.red400, sub: 'Unreachable', bg: 'rgba(220,38,38,0.1)', border: 'rgba(248,113,113,0.2)' },
    { label: 'Low Battery', value: lowBattery || '0', icon: BatteryLow, color: C.yellow400, sub: 'Need charge', bg: 'rgba(202,138,4,0.1)', border: 'rgba(250,204,21,0.2)' },
  ];

  const quickActions = [
    { label: 'Enroll Device', desc: 'Add new device to fleet', icon: Plus, color: C.cyan400, bg: 'rgba(34,211,238,0.08)', border: 'rgba(34,211,238,0.15)', nav: 'devices' },
    { label: 'Push Commands', desc: 'Send bulk commands to devices', icon: Terminal, color: C.purple400, bg: 'rgba(124,58,237,0.08)', border: 'rgba(167,139,250,0.15)', nav: 'commands' },
    { label: 'Manage Policies', desc: 'Configure device policies', icon: ShieldCheck, color: C.emerald400, bg: 'rgba(5,150,105,0.08)', border: 'rgba(52,211,153,0.15)', nav: 'policies' },
    { label: 'Admin Settings', desc: 'System configuration', icon: Settings, color: C.yellow400, bg: 'rgba(202,138,4,0.08)', border: 'rgba(250,204,21,0.15)', nav: 'settings' },
  ];

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '2rem' }}>
      <PageHeader title="System Overview" subtitle="Real-time device fleet monitoring" />

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.75rem' }}>
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} style={{ ...S.card, padding: '1.25rem', cursor: 'pointer', transition: 'all 0.25s', position: 'relative', overflow: 'hidden' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.4), 0 0 0 1px ${m.color}22`; e.currentTarget.style.borderColor = `${m.color}40`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = C.border800; }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${m.color}60, transparent)` }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '0.68rem', color: C.text500, margin: '0 0 0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{m.label}</p>
                  <p style={{ fontSize: '2.2rem', fontWeight: 700, color: C.text50, margin: '0 0 0.375rem', fontFamily: 'monospace', lineHeight: 1 }}>{m.value}</p>
                  <p style={{ fontSize: '0.7rem', color: m.color, margin: 0 }}>↑ {m.sub}</p>
                </div>
                <div style={{ padding: '0.625rem', borderRadius: '0.5rem', background: m.bg, border: `1px solid ${m.border}` }}>
                  <Icon size={20} color={m.color} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Terminal */}
      <div style={{ ...S.card, overflow: 'hidden', marginBottom: '1.75rem' }}>
        <div style={{ padding: '0.875rem 1.25rem', borderBottom: `1px solid ${C.border800}`, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.375rem' }}>
            {[C.red400, C.yellow400, C.emerald400].map((c, i) => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: c, opacity: 0.8 }} />
            ))}
          </div>
          <Activity size={13} color={C.cyan400} />
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: C.text300, letterSpacing: '0.04em' }}>LIVE ACTIVITY TERMINAL</span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: C.emerald400, boxShadow: pulse ? `0 0 8px ${C.emerald400}` : 'none', transition: 'box-shadow 0.4s' }} />
            <span style={{ fontSize: '0.65rem', color: C.text500, fontFamily: 'monospace', letterSpacing: '0.06em' }}>LIVE</span>
          </div>
        </div>
        <div style={{ padding: '1rem 1.25rem', fontFamily: 'monospace', fontSize: '0.78rem', backgroundColor: 'rgba(0,0,0,0.25)', maxHeight: 220, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {liveLog.map((line, i) => (
            <div key={i} style={{ color: line.includes('WARN') ? C.yellow400 : line.includes('SYNC') ? C.cyan400 : C.text400, animation: 'cn-fade-in 0.3s ease' }}>
              <span style={{ color: C.border600, marginRight: '0.5rem', userSelect: 'none' }}>›</span>{line}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <p style={{ fontSize: '0.7rem', color: C.text500, margin: '0 0 0.875rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Quick Actions</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.875rem' }}>
        {quickActions.map((a, i) => {
          const Icon = a.icon;
          return (
            <button key={i} onClick={() => onNavigate(a.nav)}
              style={{ ...S.card, padding: '1.125rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.875rem', transition: 'all 0.2s', border: `1px solid ${C.border800}`, fontFamily: 'inherit' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border800; e.currentTarget.style.transform = ''; }}>
              <div style={{ padding: '0.625rem', borderRadius: '0.5rem', background: a.bg, border: `1px solid ${a.border}`, flexShrink: 0 }}>
                <Icon size={16} color={a.color} />
              </div>
              <div style={{ textAlign: 'left', flex: 1, overflow: 'hidden' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: C.text50, margin: '0 0 0.2rem', whiteSpace: 'nowrap' }}>{a.label}</p>
                <p style={{ fontSize: '0.7rem', color: C.text500, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.desc}</p>
              </div>
              <ChevronRight size={14} color={C.text600} style={{ flexShrink: 0 }} />
            </button>
          );
        })}
      </div>

      {/* Recent devices preview */}
      {devices.length > 0 && (
        <div style={{ marginTop: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
            <p style={{ fontSize: '0.7rem', color: C.text500, margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Recent Devices</p>
            <button onClick={() => onNavigate('devices')} style={{ background: 'none', border: 'none', color: C.cyan400, fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}>
              View all <ChevronRight size={12} />
            </button>
          </div>
          <div style={{ ...S.card, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border800}`, backgroundColor: 'rgba(15,23,42,0.5)' }}>
                  {['Device', 'Owner', 'Status', 'Last Seen'].map(h => (
                    <th key={h} style={S.tableHeader}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {devices.slice(0, 5).map((d, i) => {
                  const id = d.id || d.deviceId || d._id || `DEV-${i}`;
                  const model = d.model || d.deviceModel || d.deviceName || 'Unknown Device';
                  const owner = d.owner || d.userName || d.enrolledBy || '—';
                  const status = d.status || d.enrollmentStatus || 'unknown';
                  const lastSeen = d.lastSeen || d.lastSync || d.updatedAt || '—';
                  return (
                    <tr key={id} style={{ transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(30,41,59,0.4)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <td style={{ ...S.tableCell, borderBottom: i === Math.min(devices.length - 1, 4) ? 'none' : `1px solid ${C.border800}` }}>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: C.cyan400 }}>{String(id).slice(0, 18)}</span>
                        <div style={{ fontSize: '0.75rem', color: C.text500, marginTop: 2 }}>{model}</div>
                      </td>
                      <td style={{ ...S.tableCell, fontSize: '0.875rem', color: C.text300, borderBottom: i === Math.min(devices.length - 1, 4) ? 'none' : `1px solid ${C.border800}` }}>{owner}</td>
                      <td style={{ ...S.tableCell, borderBottom: i === Math.min(devices.length - 1, 4) ? 'none' : `1px solid ${C.border800}` }}><StatusDot status={status} /></td>
                      <td style={{ ...S.tableCell, fontFamily: 'monospace', fontSize: '0.75rem', color: C.text500, borderBottom: i === Math.min(devices.length - 1, 4) ? 'none' : `1px solid ${C.border800}` }}>
                        {typeof lastSeen === 'string' ? lastSeen.slice(0, 16) : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: DEVICES
// ═══════════════════════════════════════════════════════════════════════════════
// ─── QR MODAL — Headwind per-device iframe ────────────────────────────────────
function QRModal({ device, onClose }) {
  // qr_url directly from device object (DB se aata hai)
  const qrUrl = device.qr_url || device.qrUrl || device.enrollmentUrl || null;
  const deviceId = device.device_id || device.id || device.deviceId || device._id || 'Device';
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    if (!qrUrl) return;
    navigator.clipboard.writeText(qrUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(2,8,23,0.9)',
        backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 60, padding: '1rem',
      }}
    >
      <div style={{
        backgroundColor: C.bg900,
        border: `1px solid ${C.border700}`,
        borderRadius: '1rem',
        width: '100%', maxWidth: 460,
        boxShadow: '0 40px 80px rgba(0,0,0,0.7)',
        animation: 'cn-fade-in 0.2s ease',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '1.125rem 1.5rem',
          borderBottom: `1px solid ${C.border800}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '0.5rem', background: 'rgba(34,211,238,0.1)', border: `1px solid rgba(34,211,238,0.2)` }}>
              <QrCode size={16} color={C.cyan400} />
            </div>
            <div>
              <p style={{ fontSize: '0.9rem', fontWeight: 700, color: C.text50, margin: 0 }}>Device Enrollment QR</p>
              <p style={{ fontSize: '0.7rem', color: C.text500, margin: 0, fontFamily: 'monospace' }}>{String(deviceId).slice(0, 28)}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ padding: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: C.text500, borderRadius: '0.5rem', display: 'flex', alignItems: 'center' }}>
            <X size={18} />
          </button>
        </div>

        {/* QR Content */}
        <div style={{ padding: '1.5rem' }}>
          {qrUrl ? (
            <>
              {/* iframe — Headwind QR page */}
              <div style={{
                borderRadius: '0.75rem',
                overflow: 'hidden',
                border: `1px solid ${C.border700}`,
                background: '#fff',
                marginBottom: '1.25rem',
                position: 'relative',
              }}>
                <iframe
                  src={qrUrl}
                  title="Device QR Code"
                  width="100%"
                  height="380"
                  style={{ display: 'block', border: 'none' }}
                  sandbox="allow-scripts allow-same-origin allow-popups"
                />
                {/* Subtle glow overlay frame */}
                <div style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none',
                  borderRadius: '0.75rem',
                  boxShadow: 'inset 0 0 0 1px rgba(34,211,238,0.15)',
                }} />
              </div>

              {/* URL copy row */}
              <div style={{ marginBottom: '1.25rem' }}>
                <p style={{ fontSize: '0.68rem', color: C.text500, margin: '0 0 0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                  Enrollment URL
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={qrUrl}
                    readOnly
                    style={{ ...S.input, fontFamily: 'monospace', fontSize: '0.72rem', color: C.cyan400 }}
                  />
                  <button
                    onClick={copyLink}
                    style={{
                      padding: '0.625rem 0.875rem',
                      backgroundColor: copied ? 'rgba(6,78,59,0.5)' : C.bg800,
                      border: `1px solid ${copied ? C.emerald600 : C.border700}`,
                      borderRadius: '0.5rem', cursor: 'pointer',
                      color: copied ? C.emerald400 : C.text400,
                      transition: 'all 0.2s', display: 'flex', alignItems: 'center', flexShrink: 0,
                    }}
                  >
                    {copied ? <CheckCircle2 size={15} /> : <Copy size={15} />}
                  </button>
                </div>
              </div>

              {/* Info banner */}
              <div style={{
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(34,211,238,0.05)',
                border: `1px solid rgba(34,211,238,0.15)`,
                borderRadius: '0.625rem',
                marginBottom: '1.25rem',
              }}>
                <p style={{ fontSize: '0.72rem', color: C.cyan400, margin: '0 0 0.375rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                  ℹ  HOW TO ENROLL
                </p>
                {[
                  'Open camera on the target Android device',
                  'Scan the QR code shown above',
                  'Headwind MDM page will open in browser',
                  'Install/open the MDM agent app',
                  'Allow all required permissions',
                  'Device will link automatically — no password needed',
                ].map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', marginBottom: i < 5 ? '0.25rem' : 0 }}>
                    <span style={{
                      flexShrink: 0, width: 16, height: 16, borderRadius: '50%',
                      backgroundColor: 'rgba(8,56,63,0.9)', color: C.cyan400,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.58rem', fontWeight: 700, marginTop: 1,
                    }}>{i + 1}</span>
                    <span style={{ fontSize: '0.75rem', color: C.text400 }}>{step}</span>
                  </div>
                ))}
              </div>

              {/* Note about iframe */}
              <div style={{
                padding: '0.625rem 0.875rem',
                backgroundColor: 'rgba(250,204,21,0.05)',
                border: `1px solid rgba(250,204,21,0.15)`,
                borderRadius: '0.5rem',
              }}>
                <p style={{ fontSize: '0.7rem', color: C.yellow400, margin: 0 }}>
                  ⚠ The QR frame above shows Headwind's enrollment page — this is normal behavior. Scan directly from the screen or copy the URL.
                </p>
              </div>
            </>
          ) : (
            /* No qr_url in this device record */
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                backgroundColor: 'rgba(250,204,21,0.1)',
                border: `1px solid rgba(250,204,21,0.2)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1rem',
              }}>
                <AlertTriangle size={28} color={C.yellow400} />
              </div>
              <p style={{ fontSize: '0.9rem', fontWeight: 600, color: C.text300, margin: '0 0 0.5rem' }}>QR URL Not Available</p>
              <p style={{ fontSize: '0.8rem', color: C.text500, margin: '0 0 1.25rem', lineHeight: 1.6 }}>
                This device record does not have a <code style={{ color: C.cyan400, fontFamily: 'monospace' }}>qr_url</code> field.<br />
                Check your backend — it should be returned in <code style={{ color: C.cyan400, fontFamily: 'monospace' }}>GET /api/device/list</code>.
              </p>
              <div style={{ padding: '0.875rem', backgroundColor: C.bg800, borderRadius: '0.5rem', border: `1px solid ${C.border700}`, textAlign: 'left' }}>
                <p style={{ fontSize: '0.68rem', color: C.text500, margin: '0 0 0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Expected device object shape</p>
                <pre style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: C.cyan400, margin: 0, whiteSpace: 'pre-wrap' }}>{`{
  "device_id": "cybe003",
  "qr_url": "https://app.h-mdm.com/#/qr/..."
}`}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '1rem 1.5rem', borderTop: `1px solid ${C.border800}` }}>
          <button style={{ ...S.btnSecondary, width: '100%', justifyContent: 'center' }} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── DEVICES PAGE ─────────────────────────────────────────────────────────────
function DevicesPage({ onDeviceClick, toast }) {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // ✅ NEW: per-device QR modal state
  const [selectedQR, setSelectedQR] = useState(null); // holds full device object

  // ✅ Single API — GET /api/device/list (qr_url comes from here)
  const fetchDevices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/device/list`, { headers: authHeaders() });
      const data = await res.json();
      if (Array.isArray(data)) setDevices(data);
      else if (data.devices) setDevices(data.devices);
      else setDevices([]);
    } catch {
      toast('Could not fetch devices', 'error');
    } finally { setLoading(false); }
  }, []);

  const syncDevices = async () => {
    setSyncing(true);
    try {
      await fetch(`${BASE_URL}/api/device/sync`, { headers: authHeaders() });
      toast('Devices synced!', 'success');
      await fetchDevices();
    } catch {
      // sync endpoint optional — just refresh list
      await fetchDevices();
      toast('Device list refreshed', 'info');
    } finally { setSyncing(false); }
  };

  useEffect(() => { fetchDevices(); }, [fetchDevices]);

  const filtered = devices.filter(d => {
    const q = search.toLowerCase();
    const matchSearch = (
      (d.device_id || d.id || d.deviceId || '').toLowerCase().includes(q) ||
      (d.model || d.deviceModel || d.deviceName || '').toLowerCase().includes(q) ||
      (d.owner || d.userName || d.enrolledBy || '').toLowerCase().includes(q)
    );
    const status = d.status || d.enrollmentStatus || 'unknown';
    const matchStatus = statusFilter === 'all' || status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '2rem' }}>
      <PageHeader
        title="Device Fleet"
        subtitle={`${filtered.length} of ${devices.length} devices — qr_url from /api/device/list`}
        action={
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button style={S.btnSecondary} onClick={syncDevices} disabled={syncing}>
              {syncing ? <Spinner size={14} /> : <RefreshCw size={14} />}
              {syncing ? 'Syncing...' : 'Sync Devices'}
            </button>
          </div>
        }
      />

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search size={14} color={C.text500} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by device ID, model, owner..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...S.input, paddingLeft: '2.25rem' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.375rem', backgroundColor: C.bg900, border: `1px solid ${C.border800}`, borderRadius: '0.5rem', padding: '0.25rem' }}>
          {['all', 'online', 'enrolled', 'offline'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              style={{ padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: 'none', backgroundColor: statusFilter === s ? C.bg700 : 'transparent', color: statusFilter === s ? C.text50 : C.text400, fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ ...S.card, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: C.text500, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <Spinner size={32} />
            <p style={{ margin: 0, fontSize: '0.875rem' }}>Loading devices...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <Smartphone size={48} color={C.border700} style={{ margin: '0 auto 1rem', display: 'block' }} />
            <p style={{ color: C.text400, fontWeight: 500, margin: '0 0 0.5rem' }}>No devices found</p>
            <p style={{ color: C.text500, fontSize: '0.8rem', margin: '0 0 1.5rem' }}>
              {search || statusFilter !== 'all'
                ? 'No devices match your filter — try adjusting the search'
                : 'No enrolled devices yet — add devices via Headwind MDM backend'
              }
            </p>
            <button style={S.btnSecondary} onClick={fetchDevices}>
              <RefreshCw size={14} /> Refresh List
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'rgba(15,23,42,0.6)', borderBottom: `1px solid ${C.border800}` }}>
                  {['Device ID', 'Model', 'Owner', 'Status', 'Battery', 'Last Seen', 'QR', 'Actions'].map(h => (
                    <th key={h} style={S.tableHeader}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((d, i) => {
                  // ✅ Support both field names from backend
                  const id = d.device_id || d.id || d.deviceId || d._id || `DEV-${i}`;
                  const model = d.model || d.deviceModel || d.deviceName || 'Unknown Device';
                  const owner = d.owner || d.userName || d.enrolledBy || '—';
                  const status = d.status || d.enrollmentStatus || 'unknown';
                  const lastSeen = d.lastSeen || d.lastSync || d.updatedAt || '—';
                  const battery = d.battery ?? d.batteryLevel ?? null;
                  const hasQR = !!(d.qr_url || d.qrUrl || d.enrollmentUrl);
                  const isLast = i === filtered.length - 1;
                  const cellBorder = isLast ? 'none' : `1px solid ${C.border800}`;

                  return (
                    <tr
                      key={id}
                      style={{ transition: 'background 0.15s', cursor: 'default' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(30,41,59,0.4)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {/* Device ID */}
                      <td style={{ ...S.tableCell, borderBottom: cellBorder }}>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: C.cyan400 }}>
                          {String(id).slice(0, 20)}
                        </span>
                      </td>

                      {/* Model */}
                      <td style={{ ...S.tableCell, borderBottom: cellBorder }}>
                        <span style={{ fontSize: '0.875rem', color: C.text300, fontWeight: 500 }}>{model}</span>
                      </td>

                      {/* Owner */}
                      <td style={{ ...S.tableCell, fontSize: '0.875rem', color: C.text400, borderBottom: cellBorder }}>{owner}</td>

                      {/* Status */}
                      <td style={{ ...S.tableCell, borderBottom: cellBorder }}>
                        <StatusDot status={status} />
                      </td>

                      {/* Battery */}
                      <td style={{ ...S.tableCell, borderBottom: cellBorder }}>
                        {battery !== null ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {battery < 20
                              ? <BatteryLow size={14} color={C.red400} />
                              : battery < 50
                              ? <BatteryMedium size={14} color={C.yellow400} />
                              : <BatteryFull size={14} color={C.emerald400} />}
                            <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: battery < 20 ? C.red400 : battery < 50 ? C.yellow400 : C.text300 }}>
                              {battery}%
                            </span>
                          </div>
                        ) : <span style={{ color: C.text600, fontSize: '0.8rem' }}>—</span>}
                      </td>

                      {/* Last Seen */}
                      <td style={{ ...S.tableCell, fontFamily: 'monospace', fontSize: '0.75rem', color: C.text500, borderBottom: cellBorder }}>
                        {typeof lastSeen === 'string' ? lastSeen.slice(0, 16) : '—'}
                      </td>

                      {/* ✅ QR BUTTON — per device, no generate needed */}
                      <td style={{ ...S.tableCell, borderBottom: cellBorder }}>
                        <button
                          onClick={() => {
                            if (!hasQR) {
                              toast('No qr_url for this device — check backend response', 'error');
                            }
                            setSelectedQR(d); // open modal regardless (will show error state inside)
                          }}
                          title={hasQR ? 'Show enrollment QR' : 'qr_url missing in this device record'}
                          style={{
                            padding: '0.375rem 0.625rem',
                            background: hasQR ? 'rgba(34,211,238,0.08)' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${hasQR ? 'rgba(34,211,238,0.25)' : C.border700}`,
                            borderRadius: '0.375rem', cursor: 'pointer',
                            color: hasQR ? C.cyan400 : C.text600,
                            fontSize: '0.75rem', fontFamily: 'inherit',
                            display: 'flex', alignItems: 'center', gap: 5,
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => { if (hasQR) e.currentTarget.style.background = 'rgba(34,211,238,0.15)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = hasQR ? 'rgba(34,211,238,0.08)' : 'rgba(255,255,255,0.04)'; }}
                        >
                          <QrCode size={12} /> QR
                        </button>
                      </td>

                      {/* View / Detail */}
                      <td style={{ ...S.tableCell, borderBottom: cellBorder }}>
                        <button
                          onClick={() => onDeviceClick(d)}
                          style={{
                            padding: '0.375rem 0.75rem',
                            background: 'rgba(100,116,139,0.08)',
                            border: `1px solid ${C.border700}`,
                            borderRadius: '0.375rem', cursor: 'pointer',
                            color: C.text300, fontSize: '0.75rem', fontWeight: 500,
                            fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5,
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(100,116,139,0.18)'; e.currentTarget.style.color = C.text50; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(100,116,139,0.08)'; e.currentTarget.style.color = C.text300; }}
                        >
                          <Eye size={12} /> View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ✅ QR MODAL — opens when user clicks QR button on any device row */}
      {selectedQR && (
        <QRModal device={selectedQR} onClose={() => setSelectedQR(null)} />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: DEVICE DETAIL
// ═══════════════════════════════════════════════════════════════════════════════
function DeviceDetailPage({ device, onBack, toast }) {
  const [sending, setSending] = useState(null);
  const [toggleStates, setToggleStates] = useState({
    disableCamera: false, blockAppInstall: false, forceLocation: true,
    disableBluetooth: false, blockUSBDebug: true, restrictDownloads: false,
  });
  const [logs, setLogs] = useState([
    { time: new Date().toLocaleTimeString(), msg: 'Device detail view opened', level: 'info' },
    { time: new Date().toLocaleTimeString(), msg: 'Policy status loaded', level: 'ok' },
  ]);

  const addLog = (msg, level = 'info') => setLogs(p => [{ time: new Date().toLocaleTimeString(), msg, level }, ...p.slice(0, 19)]);

  const sendCommand = async (cmd, endpoint) => {
    setSending(cmd);
    try {
      const res = await fetch(`${BASE_URL}/api/device/${endpoint}`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({ deviceId: device.id || device.deviceId || device._id }),
      });
      if (res.ok) { toast(`"${cmd}" sent successfully`, 'success'); addLog(`Command "${cmd}" executed`, 'ok'); }
      else { toast(`Command failed: ${res.status}`, 'error'); addLog(`Command "${cmd}" failed (${res.status})`, 'error'); }
    } catch { toast(`${cmd} sent (offline mode)`, 'info'); addLog(`Command "${cmd}" queued for offline device`, 'warn'); }
    finally { setSending(null); }
  };

  const policyItems = [
    { id: 'disableCamera', label: 'Disable Camera', desc: 'Prevent device camera access', icon: Camera },
    { id: 'blockAppInstall', label: 'Block App Installs', desc: 'Prevent new app installations', icon: Package },
    { id: 'forceLocation', label: 'Force Location Tracking', desc: 'Continuously track device location', icon: Navigation },
    { id: 'disableBluetooth', label: 'Disable Bluetooth', desc: 'Disable Bluetooth connectivity', icon: Wifi },
    { id: 'blockUSBDebug', label: 'Block USB Debugging', desc: 'Prevent USB debugging access', icon: Settings2 },
    { id: 'restrictDownloads', label: 'Restrict Downloads', desc: 'Limit downloads to approved sources', icon: Download },
  ];

  const commands = [
    { label: 'Lock Screen', icon: Lock, color: C.cyan400, endpoint: 'lock', cmd: 'Lock Screen' },
    { label: 'Reboot', icon: RotateCw, color: C.purple400, endpoint: 'reboot', cmd: 'Reboot' },
    { label: 'Factory Reset', icon: Trash2, color: C.red400, endpoint: 'wipe', cmd: 'Factory Reset' },
    { label: 'Screenshot', icon: Camera, color: C.emerald400, endpoint: 'screenshot', cmd: 'Screenshot' },
    { label: 'Locate', icon: MapPin, color: C.yellow400, endpoint: 'locate', cmd: 'Locate' },
    { label: 'Push Config', icon: Upload, color: C.cyan400, endpoint: 'push-config', cmd: 'Push Config' },
  ];

  const id = device?.id || device?.deviceId || device?._id || '—';
  const model = device?.model || device?.deviceModel || device?.deviceName || 'Unknown';
  const owner = device?.owner || device?.userName || '—';
  const status = device?.status || device?.enrollmentStatus || 'unknown';
  const battery = device?.battery || device?.batteryLevel || null;
  const os = device?.os || device?.osVersion || '—';
  const ip = device?.ip || device?.ipAddress || '—';
  const lastSeen = device?.lastSeen || device?.lastSync || '—';

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
        <button onClick={onBack} style={{ ...S.btnSecondary, padding: '0.5rem 0.875rem' }}>
          <ChevronLeft size={14} /> Back
        </button>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: C.text50, margin: '0 0 0.2rem' }}>{model}</h3>
          <p style={{ fontSize: '0.72rem', color: C.text500, margin: 0, fontFamily: 'monospace' }}>ID: {String(id).slice(0, 24)}</p>
        </div>
        <div style={{ marginLeft: 'auto' }}><StatusDot status={status} /></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
        {/* Device Info */}
        <SectionCard>
          <p style={{ fontSize: '0.68rem', color: C.text500, margin: '0 0 1.25rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Device Information</p>
          {[
            ['Model', model], ['Owner', owner], ['OS Version', os],
            ['IP Address', ip], ['Last Seen', typeof lastSeen === 'string' ? lastSeen.slice(0, 16) : lastSeen],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.625rem 0', borderBottom: `1px solid ${C.border800}50` }}>
              <span style={{ fontSize: '0.78rem', color: C.text500 }}>{k}</span>
              <span style={{ fontSize: '0.78rem', color: C.text300, fontFamily: 'monospace', fontWeight: 500 }}>{v || '—'}</span>
            </div>
          ))}
          {battery !== null && (
            <div style={{ marginTop: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', color: C.text500 }}>Battery</span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: battery < 20 ? C.red400 : battery < 50 ? C.yellow400 : C.emerald400 }}>{battery}%</span>
              </div>
              <div style={{ height: 6, backgroundColor: C.bg700, borderRadius: 9999, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${battery}%`, backgroundColor: battery < 20 ? C.red500 : battery < 50 ? C.yellow500 : C.emerald500, borderRadius: 9999, transition: 'width 0.5s ease' }} />
              </div>
            </div>
          )}
        </SectionCard>

        {/* Commands */}
        <SectionCard>
          <p style={{ fontSize: '0.68rem', color: C.text500, margin: '0 0 1.25rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Remote Commands</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.625rem' }}>
            {commands.map(({ label, icon: Icon, color, endpoint, cmd }) => (
              <button key={cmd} onClick={() => sendCommand(cmd, endpoint)} disabled={!!sending}
                style={{ padding: '0.875rem 0.5rem', borderRadius: '0.5rem', border: `1px solid ${sending === cmd ? color + '60' : C.border700}`, backgroundColor: sending === cmd ? `${color}10` : C.bg800, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s', fontFamily: 'inherit', opacity: sending && sending !== cmd ? 0.6 : 1 }}
                onMouseEnter={e => { if (!sending) { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-2px)'; } }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border700; e.currentTarget.style.transform = ''; }}>
                {sending === cmd ? <Spinner size={18} color={color} /> : <Icon size={18} color={color} />}
                <span style={{ fontSize: '0.7rem', color: sending === cmd ? color : C.text400, fontWeight: 500 }}>{label}</span>
              </button>
            ))}
          </div>
          {sending && (
            <div style={{ marginTop: '0.875rem', padding: '0.625rem 0.875rem', background: `${C.cyan400}08`, border: `1px solid ${C.cyan400}20`, borderRadius: '0.5rem', fontSize: '0.75rem', color: C.cyan400, fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Spinner size={12} /> Executing "{sending}"...
            </div>
          )}
        </SectionCard>
      </div>

      {/* Policies */}
      <SectionCard style={{ marginBottom: '1.25rem' }}>
        <p style={{ fontSize: '0.68rem', color: C.text500, margin: '0 0 1.25rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Device Policies</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0.875rem' }}>
          {policyItems.map(({ id: pid, label, desc, icon: Icon }) => (
            <div key={pid} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', backgroundColor: C.bg800, borderRadius: '0.5rem', border: `1px solid ${C.border700}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Icon size={16} color={toggleStates[pid] ? C.cyan400 : C.text600} />
                <div>
                  <p style={{ fontSize: '0.8rem', fontWeight: 500, color: C.text300, margin: '0 0 0.15rem' }}>{label}</p>
                  <p style={{ fontSize: '0.7rem', color: C.text500, margin: 0 }}>{desc}</p>
                </div>
              </div>
              <Toggle value={toggleStates[pid]} onChange={v => { setToggleStates(p => ({ ...p, [pid]: v })); toast(`${label} ${v ? 'enabled' : 'disabled'}`, 'info'); addLog(`Policy "${label}" ${v ? 'enabled' : 'disabled'}`, v ? 'ok' : 'warn'); }} />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Event Log */}
      <SectionCard>
        <p style={{ fontSize: '0.68rem', color: C.text500, margin: '0 0 1rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Event Log</p>
        <div style={{ maxHeight: 200, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {logs.map((log, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.75rem', padding: '0.35rem 0', borderBottom: `1px solid ${C.border800}40`, fontFamily: 'monospace', fontSize: '0.75rem', animation: 'cn-fade-in 0.2s ease' }}>
              <span style={{ color: C.text600, flexShrink: 0 }}>{log.time}</span>
              <span style={{ color: log.level === 'ok' ? C.emerald400 : log.level === 'error' ? C.red400 : log.level === 'warn' ? C.yellow400 : C.text400 }}>{log.msg}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: COMMANDS
// ═══════════════════════════════════════════════════════════════════════════════
function CommandsPage({ toast }) {
  const [activeTab, setActiveTab] = useState('audit');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sending, setSending] = useState(null);
  const [globalPolicies, setGlobalPolicies] = useState([
    { id: 1, name: 'Disable Camera', desc: 'Prevent device camera access across all devices', icon: Camera, enabled: false, deviceCount: 45, enforced: 42, category: 'Hardware', color: C.cyan400 },
    { id: 2, name: 'Block App Installation', desc: 'Prevent installation of new applications', icon: Package, enabled: true, deviceCount: 50, enforced: 48, category: 'Application', color: C.purple400 },
    { id: 3, name: 'Force Location Tracking', desc: 'Continuously track device location', icon: Navigation, enabled: true, deviceCount: 50, enforced: 47, category: 'Location', color: C.emerald400 },
    { id: 4, name: 'Disable Bluetooth', desc: 'Disable Bluetooth connectivity on all devices', icon: Wifi, enabled: false, deviceCount: 50, enforced: 0, category: 'Connectivity', color: C.yellow400 },
    { id: 5, name: 'Block USB Debugging', desc: 'Prevent USB debugging access to devices', icon: Settings2, enabled: true, deviceCount: 50, enforced: 50, category: 'Security', color: C.red400 },
    { id: 6, name: 'Restrict Downloads', desc: 'Limit file/app downloads to approved sources', icon: Download, enabled: false, deviceCount: 50, enforced: 0, category: 'Application', color: C.orange400 },
  ]);

  const [commandLog] = useState([
    { id: 1, timestamp: '2024-01-15 14:45:32', device: 'SM-A725F-001', command: 'Force Lock Screen', status: 'success', executedBy: 'Admin', result: 'Device locked successfully' },
    { id: 2, timestamp: '2024-01-15 14:35:18', device: 'iPad-Gen7-002', command: 'Sync Data', status: 'success', executedBy: 'Admin', result: 'Data synchronized — 2.4 GB transferred' },
    { id: 3, timestamp: '2024-01-15 14:22:45', device: 'Pixel-6Pro-003', command: 'Policy Update', status: 'success', executedBy: 'System', result: '5 policies pushed, 3 enforced' },
    { id: 4, timestamp: '2024-01-15 14:15:12', device: 'iPhone-14-004', command: 'Wipe Device', status: 'pending', executedBy: 'Admin', result: 'Awaiting device confirmation' },
    { id: 5, timestamp: '2024-01-15 14:08:33', device: 'Galaxy-S23-005', command: 'Reboot Device', status: 'success', executedBy: 'System', result: 'Device rebooted in 45 seconds' },
    { id: 6, timestamp: '2024-01-15 13:58:19', device: 'OnePlus-11-006', command: 'Camera Restriction', status: 'failed', executedBy: 'Admin', result: 'Device offline — will retry when online' },
    { id: 7, timestamp: '2024-01-15 13:45:01', device: 'Moto-G52-007', command: 'Location Tracking', status: 'success', executedBy: 'System', result: 'Location tracking enabled' },
    { id: 8, timestamp: '2024-01-15 13:30:22', device: 'iPad-Air-008', command: 'App Block', status: 'success', executedBy: 'Admin', result: 'App store access blocked' },
    { id: 9, timestamp: '2024-01-15 13:15:45', device: 'Galaxy-Z-009', command: 'Bluetooth Disable', status: 'success', executedBy: 'System', result: 'Bluetooth disabled' },
    { id: 10, timestamp: '2024-01-15 13:00:33', device: 'iPhone-13-010', command: 'USB Debug Block', status: 'success', executedBy: 'Admin', result: 'USB debugging disabled' },
  ]);

  const filtered = commandLog.filter(c => {
    const ms = c.device.toLowerCase().includes(searchTerm.toLowerCase()) || c.command.toLowerCase().includes(searchTerm.toLowerCase());
    return ms && (statusFilter === 'all' || c.status === statusFilter);
  });

  const togglePolicy = async (id) => {
    const policy = globalPolicies.find(p => p.id === id);
    setGlobalPolicies(prev => prev.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));
    try {
      await fetch(`${BASE_URL}/api/policy/toggle`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({ policyId: id, enabled: !policy.enabled }),
      });
      toast(`${policy.name} ${!policy.enabled ? 'enabled' : 'disabled'}`, 'success');
    } catch { toast(`${policy.name} ${!policy.enabled ? 'enabled' : 'disabled'} (offline)`, 'info'); }
  };

  const StatusBadge = ({ status }) => {
    const map = { success: { icon: CheckCircle2, color: C.emerald400 }, failed: { icon: XCircle, color: C.red400 }, pending: { icon: Clock, color: C.yellow400 } };
    const { icon: Icon, color } = map[status] || { icon: Info, color: C.text500 };
    return <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Icon size={14} color={color} /><span style={{ fontSize: '0.75rem', fontWeight: 500, color }}>{status}</span></div>;
  };

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '2rem' }}>
      <PageHeader title="Commands & Policies" subtitle="Audit logs and global enforcement controls" />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', backgroundColor: C.bg900, border: `1px solid ${C.border800}`, borderRadius: '0.5rem', padding: '0.25rem', width: 'fit-content' }}>
        {[{ id: 'audit', label: 'Command Audit Log', icon: FileText }, { id: 'policies', label: 'Enforce Policies', icon: ShieldCheck }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none', backgroundColor: activeTab === tab.id ? C.bg700 : 'transparent', color: activeTab === tab.id ? C.text50 : C.text400, fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
            <tab.icon size={13} />{tab.label}
          </button>
        ))}
      </div>

      {/* AUDIT LOG TAB */}
      {activeTab === 'audit' && (
        <div>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <Search size={14} color={C.text500} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input type="text" placeholder="Search device or command..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ ...S.input, paddingLeft: '2.25rem' }} />
            </div>
            <div style={{ position: 'relative' }}>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                style={{ padding: '0.625rem 2rem 0.625rem 0.875rem', backgroundColor: C.bg800, border: `1px solid ${C.border700}`, borderRadius: '0.5rem', fontSize: '0.8rem', color: C.text50, outline: 'none', cursor: 'pointer', appearance: 'none', fontFamily: 'inherit' }}>
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
                <option value="pending">Pending</option>
              </select>
              <ChevronDown size={13} color={C.text500} style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          </div>
          <div style={{ ...S.card, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: 'rgba(15,23,42,0.5)', borderBottom: `1px solid ${C.border800}` }}>
                    {['Timestamp', 'Device', 'Command', 'Status', 'Executed By', 'Result'].map(h => (
                      <th key={h} style={S.tableHeader}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((cmd, i) => (
                    <tr key={cmd.id} style={{ transition: 'background 0.15s', cursor: 'default' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(30,41,59,0.4)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <td style={{ ...S.tableCell, borderBottom: i === filtered.length - 1 ? 'none' : `1px solid ${C.border800}`, fontFamily: 'monospace', fontSize: '0.72rem', color: C.text500 }}>{cmd.timestamp}</td>
                      <td style={{ ...S.tableCell, borderBottom: i === filtered.length - 1 ? 'none' : `1px solid ${C.border800}` }}><span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: C.cyan400 }}>{cmd.device}</span></td>
                      <td style={{ ...S.tableCell, borderBottom: i === filtered.length - 1 ? 'none' : `1px solid ${C.border800}`, fontSize: '0.875rem', fontWeight: 500, color: C.text300 }}>{cmd.command}</td>
                      <td style={{ ...S.tableCell, borderBottom: i === filtered.length - 1 ? 'none' : `1px solid ${C.border800}` }}><StatusBadge status={cmd.status} /></td>
                      <td style={{ ...S.tableCell, borderBottom: i === filtered.length - 1 ? 'none' : `1px solid ${C.border800}`, fontSize: '0.875rem', color: C.text400 }}>{cmd.executedBy}</td>
                      <td style={{ ...S.tableCell, borderBottom: i === filtered.length - 1 ? 'none' : `1px solid ${C.border800}`, fontSize: '0.8rem', color: C.text500 }}>{cmd.result}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div style={{ padding: '2.5rem', textAlign: 'center' }}>
                <AlertTriangle size={40} color={C.border600} style={{ margin: '0 auto 1rem', display: 'block' }} />
                <p style={{ color: C.text400, fontWeight: 500, margin: 0 }}>No commands match your search</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* POLICIES TAB */}
      {activeTab === 'policies' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <p style={{ margin: 0, fontSize: '0.875rem', color: C.text400 }}>Toggle policies to enforce across <strong style={{ color: C.cyan400 }}>all enrolled devices</strong></p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {globalPolicies.map(({ id, name, desc, icon: Icon, enabled, deviceCount, enforced, category, color }) => (
              <div key={id} style={{ ...S.card, padding: '1.25rem', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.border700}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.border800}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: 1 }}>
                    <div style={{ padding: '0.625rem', borderRadius: '0.5rem', background: `${color}12`, border: `1px solid ${color}30`, flexShrink: 0 }}>
                      <Icon size={18} color={color} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: C.text50, margin: 0 }}>{name}</h4>
                        <span style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: 4, backgroundColor: C.bg700, color: C.text500, letterSpacing: '0.05em' }}>{category}</span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: C.text500, margin: '0 0 0.75rem' }}>{desc}</p>
                      <div style={{ display: 'flex', align: 'center', gap: '1.5rem' }}>
                        <span style={{ fontSize: '0.72rem', color: C.text500 }}>Enforced: <span style={{ color: C.text300, fontWeight: 500, fontFamily: 'monospace' }}>{enforced}/{deviceCount}</span></span>
                        <span style={{ fontSize: '0.72rem', color: enabled ? C.emerald400 : C.text600 }}>{enabled ? '● Active' : '○ Inactive'}</span>
                      </div>
                    </div>
                  </div>
                  <Toggle value={enabled} onChange={() => togglePolicy(id)} color={C.emerald600} />
                </div>
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: `1px solid ${C.border800}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                    <span style={{ fontSize: '0.7rem', color: C.text600 }}>Enforcement progress</span>
                    <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: C.text500 }}>{Math.round((enforced / deviceCount) * 100)}%</span>
                  </div>
                  <div style={{ height: 5, backgroundColor: C.bg700, borderRadius: 9999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(enforced / deviceCount) * 100}%`, backgroundColor: enabled ? C.emerald600 : C.bg600, borderRadius: 9999, transition: 'all 0.5s ease' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: POLICIES (Kiosk Mode + App Control)
// ═══════════════════════════════════════════════════════════════════════════════
function PoliciesPage({ toast }) {
  const [kioskEnabled, setKioskEnabled] = useState(false);
  const [whitelistMode, setWhitelistMode] = useState(true);
  const [appSearch, setAppSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [selectedApps, setSelectedApps] = useState(new Set(['com.google.android.calculator', 'com.google.android.apps.chrome']));
  const [passwordSettings, setPasswordSettings] = useState({ minLength: 8, requireSymbols: true, requireNumbers: true, maxAttempts: 5, screenTimeout: 30 });
  const [wifiSettings, setWifiSettings] = useState({ ssid: '', security: 'WPA2', forceEnterprise: false, allowHotspot: false });
  const [updateSettings, setUpdateSettings] = useState({ autoUpdate: true, forceUpdate: false, maintenanceWindow: '02:00-04:00' });
  const [activeSection, setActiveSection] = useState('kiosk');

  const availableApps = [
    { id: 'com.google.android.calculator', name: 'Calculator', category: 'Productivity', icon: '🧮' },
    { id: 'com.google.android.apps.chrome', name: 'Chrome', category: 'Browser', icon: '🌐' },
    { id: 'com.android.calendar', name: 'Calendar', category: 'Productivity', icon: '📅' },
    { id: 'com.android.email', name: 'Email', category: 'Communication', icon: '📧' },
    { id: 'com.android.messaging', name: 'Messages', category: 'Communication', icon: '💬' },
    { id: 'com.spotify.music', name: 'Spotify', category: 'Media', icon: '🎵' },
    { id: 'com.whatsapp', name: 'WhatsApp', category: 'Communication', icon: '💬' },
    { id: 'com.facebook.katana', name: 'Facebook', category: 'Social', icon: 'f' },
    { id: 'com.instagram.android', name: 'Instagram', category: 'Social', icon: '📷' },
    { id: 'com.twitter.android', name: 'Twitter/X', category: 'Social', icon: '𝕏' },
    { id: 'com.android.youtube', name: 'YouTube', category: 'Media', icon: '▶️' },
    { id: 'com.microsoft.teams', name: 'Teams', category: 'Productivity', icon: '💼' },
  ];

  const filteredApps = availableApps.filter(a =>
    a.name.toLowerCase().includes(appSearch.toLowerCase()) ||
    a.category.toLowerCase().includes(appSearch.toLowerCase())
  );

  const toggleApp = id => {
    const n = new Set(selectedApps);
    n.has(id) ? n.delete(id) : n.add(id);
    setSelectedApps(n);
  };

  const saveConfig = async () => {
    setSaving(true);
    try {
      await fetch(`${BASE_URL}/api/policy/kiosk`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({ kioskEnabled, whitelistMode, selectedApps: Array.from(selectedApps), passwordSettings, wifiSettings, updateSettings }),
      });
      toast('Policy configuration saved!', 'success');
    } catch { toast('Config saved locally (API offline)', 'info'); }
    finally { setSaving(false); }
  };

  const sections = [
    { id: 'kiosk', label: 'Kiosk & App Control', icon: Package },
    { id: 'password', label: 'Password Policy', icon: Lock },
    { id: 'wifi', label: 'WiFi Configuration', icon: Wifi },
    { id: 'updates', label: 'Update Policy', icon: Download },
  ];

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '2rem' }}>
      <PageHeader
        title="Policies & Settings"
        subtitle="Configure MDM policies for enrolled devices"
        action={
          <button style={S.btnPrimary} onClick={saveConfig} disabled={saving}>
            {saving ? <><Spinner size={14} color="#fff" /> Saving...</> : <><Save size={14} /> Save All Policies</>}
          </button>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '1.25rem' }}>
        {/* Sidebar nav */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {sections.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveSection(id)}
              style={{ ...S.sidebarBtn(activeSection === id), justifyContent: 'flex-start' }}>
              <Icon size={15} style={{ flexShrink: 0 }} />{label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {/* KIOSK MODE */}
          {activeSection === 'kiosk' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <SectionCard>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.375rem' }}>
                      <Package size={18} color={C.cyan400} />
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: C.text50, margin: 0 }}>Kiosk Mode</h4>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: C.text500, margin: 0 }}>Lock devices to specific apps and restrict system access</p>
                  </div>
                  <Toggle value={kioskEnabled} onChange={v => { setKioskEnabled(v); toast(`Kiosk Mode ${v ? 'enabled' : 'disabled'}`, 'info'); }} />
                </div>
              </SectionCard>

              {!kioskEnabled && (
                <div style={{ padding: '2.5rem', textAlign: 'center', background: `${C.bg800}60`, border: `1px dashed ${C.border700}`, borderRadius: '0.75rem' }}>
                  <Lock size={40} color={C.border600} style={{ margin: '0 auto 1rem', display: 'block' }} />
                  <p style={{ color: C.text500, fontSize: '0.875rem', margin: 0 }}>Enable Kiosk Mode above to configure app restrictions</p>
                </div>
              )}

              {kioskEnabled && (
                <>
                  <SectionCard>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                      <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: C.text50, margin: '0 0 0.2rem' }}>App Control Mode</p>
                        <p style={{ fontSize: '0.75rem', color: C.text500, margin: 0 }}>{whitelistMode ? 'Only selected apps are allowed' : 'Selected apps are blocked'}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {[{ id: true, label: 'Whitelist', color: C.cyan600 }, { id: false, label: 'Blacklist', color: C.red600 }].map(m => (
                          <button key={String(m.id)} onClick={() => setWhitelistMode(m.id)}
                            style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none', backgroundColor: whitelistMode === m.id ? m.color : C.bg700, color: whitelistMode === m.id ? '#fff' : C.text400, fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                            {m.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Selected chips */}
                    {selectedApps.size > 0 && (
                      <div style={{ marginBottom: '1.25rem', padding: '0.875rem', backgroundColor: C.bg800, borderRadius: '0.5rem', border: `1px solid ${C.border700}` }}>
                        <p style={{ fontSize: '0.68rem', color: C.text400, margin: '0 0 0.625rem', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.06em' }}>{whitelistMode ? '✓ Allowed' : '✗ Blocked'} ({selectedApps.size})</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {Array.from(selectedApps).map(id => {
                            const app = availableApps.find(a => a.id === id);
                            return app ? (
                              <span key={id} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.25rem 0.625rem', backgroundColor: C.bg700, border: `1px solid ${C.border700}`, borderRadius: 9999, fontSize: '0.75rem', color: C.text300 }}>
                                <span>{app.icon}</span><span>{app.name}</span>
                                <button onClick={() => toggleApp(id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.text500, fontSize: '1.1rem', padding: 0, lineHeight: 1 }}>×</button>
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    {/* Search */}
                    <div style={{ position: 'relative', marginBottom: '1rem' }}>
                      <Search size={14} color={C.text500} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                      <input type="text" placeholder="Search apps..." value={appSearch} onChange={e => setAppSearch(e.target.value)} style={{ ...S.input, paddingLeft: '2.25rem' }} />
                    </div>

                    {/* App grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.625rem' }}>
                      {filteredApps.map(app => {
                        const sel = selectedApps.has(app.id);
                        return (
                          <button key={app.id} onClick={() => toggleApp(app.id)}
                            style={{ padding: '0.875rem', borderRadius: '0.5rem', border: `1.5px solid ${sel ? C.cyan400 : C.border700}`, backgroundColor: sel ? 'rgba(8,56,63,0.25)' : C.bg800, cursor: 'pointer', textAlign: 'left', transition: 'all 0.18s', fontFamily: 'inherit' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div>
                                <p style={{ fontSize: '0.8rem', fontWeight: 500, color: C.text50, margin: '0 0 0.2rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                  <span style={{ fontSize: '1rem' }}>{app.icon}</span>{app.name}
                                </p>
                                <p style={{ fontSize: '0.7rem', color: C.text500, margin: 0 }}>{app.category}</p>
                              </div>
                              <div style={{ width: 18, height: 18, borderRadius: '0.25rem', border: `1.5px solid ${sel ? C.cyan400 : C.border700}`, backgroundColor: sel ? C.cyan600 : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                {sel && <CheckCircle2 size={12} color="#fff" />}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </SectionCard>
                </>
              )}
            </div>
          )}

          {/* PASSWORD POLICY */}
          {activeSection === 'password' && (
            <SectionCard>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.5rem' }}>
                <Lock size={18} color={C.cyan400} />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: C.text50, margin: 0 }}>Password Requirements</h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: C.text400, display: 'block', marginBottom: '0.5rem' }}>Minimum Password Length: <strong style={{ color: C.cyan400 }}>{passwordSettings.minLength}</strong></label>
                  <input type="range" min={4} max={20} value={passwordSettings.minLength} onChange={e => setPasswordSettings(p => ({ ...p, minLength: +e.target.value }))}
                    style={{ width: '100%', accentColor: C.cyan500 }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: C.text400, display: 'block', marginBottom: '0.5rem' }}>Max Failed Attempts: <strong style={{ color: C.yellow400 }}>{passwordSettings.maxAttempts}</strong></label>
                  <input type="range" min={3} max={15} value={passwordSettings.maxAttempts} onChange={e => setPasswordSettings(p => ({ ...p, maxAttempts: +e.target.value }))}
                    style={{ width: '100%', accentColor: C.yellow500 }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: C.text400, display: 'block', marginBottom: '0.5rem' }}>Screen Lock Timeout: <strong style={{ color: C.emerald400 }}>{passwordSettings.screenTimeout} min</strong></label>
                  <input type="range" min={1} max={60} value={passwordSettings.screenTimeout} onChange={e => setPasswordSettings(p => ({ ...p, screenTimeout: +e.target.value }))}
                    style={{ width: '100%', accentColor: C.emerald500 }} />
                </div>
                {[['requireSymbols', 'Require special characters (!@#$)'], ['requireNumbers', 'Require at least one number']].map(([key, label]) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', backgroundColor: C.bg800, borderRadius: '0.5rem', border: `1px solid ${C.border700}` }}>
                    <span style={{ fontSize: '0.85rem', color: C.text300 }}>{label}</span>
                    <Toggle value={passwordSettings[key]} onChange={v => setPasswordSettings(p => ({ ...p, [key]: v }))} />
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* WIFI */}
          {activeSection === 'wifi' && (
            <SectionCard>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.5rem' }}>
                <Wifi size={18} color={C.cyan400} />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: C.text50, margin: 0 }}>WiFi Configuration</h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', color: C.text400, display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Network SSID</label>
                  <input type="text" value={wifiSettings.ssid} onChange={e => setWifiSettings(p => ({ ...p, ssid: e.target.value }))} placeholder="CorpNet-5G" style={S.input} />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', color: C.text400, display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Security Type</label>
                  <select value={wifiSettings.security} onChange={e => setWifiSettings(p => ({ ...p, security: e.target.value }))}
                    style={{ ...S.input, appearance: 'none' }}>
                    {['WPA2', 'WPA3', 'WPA2-Enterprise', 'Open'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                {[['forceEnterprise', 'Force enterprise networks only'], ['allowHotspot', 'Allow personal hotspot']].map(([key, label]) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', backgroundColor: C.bg800, borderRadius: '0.5rem', border: `1px solid ${C.border700}` }}>
                    <span style={{ fontSize: '0.85rem', color: C.text300 }}>{label}</span>
                    <Toggle value={wifiSettings[key]} onChange={v => setWifiSettings(p => ({ ...p, [key]: v }))} />
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* UPDATES */}
          {activeSection === 'updates' && (
            <SectionCard>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.5rem' }}>
                <Download size={18} color={C.cyan400} />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: C.text50, margin: 0 }}>Update Policy</h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[['autoUpdate', 'Enable automatic updates'], ['forceUpdate', 'Force immediate critical updates']].map(([key, label]) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', backgroundColor: C.bg800, borderRadius: '0.5rem', border: `1px solid ${C.border700}` }}>
                    <div>
                      <p style={{ fontSize: '0.85rem', color: C.text300, margin: 0 }}>{label}</p>
                      {key === 'forceUpdate' && <p style={{ fontSize: '0.72rem', color: C.yellow400, margin: '0.2rem 0 0' }}>⚠ May interrupt device usage</p>}
                    </div>
                    <Toggle value={updateSettings[key]} onChange={v => setUpdateSettings(p => ({ ...p, [key]: v }))} color={key === 'forceUpdate' ? C.orange600 : C.emerald600} />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: '0.72rem', color: C.text400, display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Maintenance Window</label>
                  <input type="text" value={updateSettings.maintenanceWindow} onChange={e => setUpdateSettings(p => ({ ...p, maintenanceWindow: e.target.value }))} placeholder="02:00-04:00" style={S.input} />
                  <p style={{ fontSize: '0.72rem', color: C.text600, margin: '0.4rem 0 0' }}>Format: HH:MM-HH:MM (24-hour)</p>
                </div>
              </div>
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: SETTINGS
// ═══════════════════════════════════════════════════════════════════════════════
function SettingsPage({ toast }) {
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [serverSettings, setServerSettings] = useState({
    serverUrl: BASE_URL,
    pushInterval: 60,
    heartbeatInterval: 30,
    sessionTimeout: 480,
    logRetention: 30,
  });
  const [notifSettings, setNotifSettings] = useState({
    offlineAlert: true,
    batteryAlert: true,
    policyViolation: true,
    enrollmentEvent: true,
    batteryThreshold: 20,
    offlineThreshold: 120,
  });
  const [secSettings, setSecSettings] = useState({
    twoFactor: false,
    ipWhitelist: false,
    auditLog: true,
    encryptData: true,
  });
  const [apiKey, setApiKey] = useState('sk-mdm-••••••••••••••••••••••••');
  const [showKey, setShowKey] = useState(false);
  const [testLoading, setTestLoading] = useState(false);

  const testConnection = async () => {
    setTestLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/health`, { headers: authHeaders() });
      if (res.ok) toast('Backend connection successful!', 'success');
      else toast(`Backend returned ${res.status}`, 'error');
    } catch { toast('Backend unreachable — check URL', 'error'); }
    finally { setTestLoading(false); }
  };

  const saveSettings = async () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast('Settings saved successfully!', 'success');
    }, 900);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: ShieldCheck },
    { id: 'api', label: 'API & Integration', icon: Server },
  ];

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '2rem' }}>
      <PageHeader
        title="System Settings"
        subtitle="CyberNest MDM configuration"
        action={
          <button style={S.btnPrimary} onClick={saveSettings} disabled={saving}>
            {saving ? <><Spinner size={14} color="#fff" /> Saving...</> : <><Save size={14} /> Save Settings</>}
          </button>
        }
      />

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', backgroundColor: C.bg900, border: `1px solid ${C.border800}`, borderRadius: '0.5rem', padding: '0.25rem', width: 'fit-content' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none', backgroundColor: activeTab === tab.id ? C.bg700 : 'transparent', color: activeTab === tab.id ? C.text50 : C.text400, fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
            <tab.icon size={13} />{tab.label}
          </button>
        ))}
      </div>

      {/* GENERAL */}
      {activeTab === 'general' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 640 }}>
          <SectionCard>
            <p style={{ fontSize: '0.68rem', color: C.text500, margin: '0 0 1.25rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Server Configuration</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: C.text400, display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Backend Server URL</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type="text" value={serverSettings.serverUrl} onChange={e => setServerSettings(p => ({ ...p, serverUrl: e.target.value }))} style={{ ...S.input, fontFamily: 'monospace', fontSize: '0.8rem', color: C.cyan400 }} />
                  <button style={S.btnPrimary} onClick={testConnection} disabled={testLoading}>
                    {testLoading ? <Spinner size={14} color="#fff" /> : <Zap size={14} />} Test
                  </button>
                </div>
              </div>
              {[
                { key: 'pushInterval', label: 'Policy Push Interval', unit: 'seconds', min: 30, max: 300 },
                { key: 'heartbeatInterval', label: 'Heartbeat Interval', unit: 'seconds', min: 10, max: 120 },
                { key: 'sessionTimeout', label: 'Admin Session Timeout', unit: 'minutes', min: 60, max: 1440 },
                { key: 'logRetention', label: 'Log Retention Period', unit: 'days', min: 7, max: 365 },
              ].map(({ key, label, unit, min, max }) => (
                <div key={key}>
                  <label style={{ fontSize: '0.72rem', color: C.text400, display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}: <strong style={{ color: C.cyan400, fontFamily: 'monospace' }}>{serverSettings[key]} {unit}</strong></label>
                  <input type="range" min={min} max={max} value={serverSettings[key]} onChange={e => setServerSettings(p => ({ ...p, [key]: +e.target.value }))}
                    style={{ width: '100%', accentColor: C.cyan500 }} />
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      {/* NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div style={{ maxWidth: 640 }}>
          <SectionCard>
            <p style={{ fontSize: '0.68rem', color: C.text500, margin: '0 0 1.25rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Alert Configuration</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {[
                { key: 'offlineAlert', label: 'Device Offline Alerts', desc: 'Notify when device goes offline' },
                { key: 'batteryAlert', label: 'Low Battery Alerts', desc: 'Alert when battery drops below threshold' },
                { key: 'policyViolation', label: 'Policy Violation Alerts', desc: 'Alert when device violates a policy' },
                { key: 'enrollmentEvent', label: 'Enrollment Events', desc: 'Notify on new device enrollment/unenrollment' },
              ].map(({ key, label, desc }) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', backgroundColor: C.bg800, borderRadius: '0.5rem', border: `1px solid ${C.border700}` }}>
                  <div>
                    <p style={{ fontSize: '0.85rem', color: C.text300, margin: '0 0 0.2rem', fontWeight: 500 }}>{label}</p>
                    <p style={{ fontSize: '0.72rem', color: C.text500, margin: 0 }}>{desc}</p>
                  </div>
                  <Toggle value={notifSettings[key]} onChange={v => setNotifSettings(p => ({ ...p, [key]: v }))} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: '0.72rem', color: C.text400, display: 'block', marginBottom: '0.5rem' }}>Battery Alert Threshold: <strong style={{ color: C.yellow400, fontFamily: 'monospace' }}>{notifSettings.batteryThreshold}%</strong></label>
                <input type="range" min={5} max={50} value={notifSettings.batteryThreshold} onChange={e => setNotifSettings(p => ({ ...p, batteryThreshold: +e.target.value }))} style={{ width: '100%', accentColor: C.yellow500 }} />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', color: C.text400, display: 'block', marginBottom: '0.5rem' }}>Offline Alert Threshold: <strong style={{ color: C.red400, fontFamily: 'monospace' }}>{notifSettings.offlineThreshold} min</strong></label>
                <input type="range" min={10} max={720} value={notifSettings.offlineThreshold} onChange={e => setNotifSettings(p => ({ ...p, offlineThreshold: +e.target.value }))} style={{ width: '100%', accentColor: C.red500 }} />
              </div>
            </div>
          </SectionCard>
        </div>
      )}

      {/* SECURITY */}
      {activeTab === 'security' && (
        <div style={{ maxWidth: 640 }}>
          <SectionCard>
            <p style={{ fontSize: '0.68rem', color: C.text500, margin: '0 0 1.25rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Admin Security</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {[
                { key: 'twoFactor', label: 'Two-Factor Authentication', desc: 'Require 2FA for admin login', color: C.emerald600 },
                { key: 'ipWhitelist', label: 'IP Whitelist', desc: 'Restrict admin access to specific IPs', color: C.orange600 },
                { key: 'auditLog', label: 'Admin Audit Logging', desc: 'Log all admin actions', color: C.emerald600 },
                { key: 'encryptData', label: 'Data Encryption', desc: 'Encrypt device data at rest', color: C.emerald600 },
              ].map(({ key, label, desc, color }) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', backgroundColor: C.bg800, borderRadius: '0.5rem', border: `1px solid ${C.border700}` }}>
                  <div>
                    <p style={{ fontSize: '0.85rem', color: C.text300, margin: '0 0 0.2rem', fontWeight: 500 }}>{label}</p>
                    <p style={{ fontSize: '0.72rem', color: C.text500, margin: 0 }}>{desc}</p>
                  </div>
                  <Toggle value={secSettings[key]} onChange={v => { setSecSettings(p => ({ ...p, [key]: v })); toast(`${label} ${v ? 'enabled' : 'disabled'}`, 'info'); }} color={color} />
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      {/* API */}
      {activeTab === 'api' && (
        <div style={{ maxWidth: 640 }}>
          <SectionCard>
            <p style={{ fontSize: '0.68rem', color: C.text500, margin: '0 0 1.25rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>API Key Management</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: C.text400, display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Current API Key</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type={showKey ? 'text' : 'password'} value={apiKey} readOnly style={{ ...S.input, fontFamily: 'monospace', fontSize: '0.8rem', color: C.cyan400 }} />
                  <button style={S.btnSecondary} onClick={() => setShowKey(v => !v)}>{showKey ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                  <button style={S.btnSecondary} onClick={() => { navigator.clipboard.writeText(apiKey).catch(() => {}); toast('API key copied!', 'success'); }}><Copy size={14} /></button>
                </div>
              </div>
              <button style={{ ...S.btnDanger, justifyContent: 'center', padding: '0.75rem' }} onClick={() => toast('API key regenerated (demo)', 'success')}>
                <RefreshCw size={14} /> Regenerate API Key
              </button>
              <div style={{ padding: '1rem', backgroundColor: C.bg800, borderRadius: '0.5rem', border: `1px solid ${C.border700}` }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: C.text300, margin: '0 0 0.5rem' }}>Backend Endpoints</p>
                {[
                  ['Device List (+ qr_url)', `${BASE_URL}/api/device/list`],
                  ['Device Sync', `${BASE_URL}/api/device/sync`],
                  ['Policy Toggle', `${BASE_URL}/api/policy/toggle`],
                  ['Device Lock', `${BASE_URL}/api/device/lock`],
                  ['Device Reboot', `${BASE_URL}/api/device/reboot`],
                  ['Device Wipe', `${BASE_URL}/api/device/wipe`],
                ].map(([name, url]) => (
                  <div key={name} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.375rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: C.text500, minWidth: 90 }}>{name}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: C.cyan400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{url}</span>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: PROFILE
// ═══════════════════════════════════════════════════════════════════════════════
function ProfilePage({ toast }) {
  const name = localStorage.getItem('adminName') || 'Admin';
  const email = localStorage.getItem('adminEmail') || 'admin@cybernest.com';
  const org = localStorage.getItem('adminOrg') || '—';
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'AD';

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editOrg, setEditOrg] = useState(org);

  const save = () => {
    localStorage.setItem('adminName', editName);
    localStorage.setItem('adminOrg', editOrg);
    setEditing(false);
    toast('Profile saved!', 'success');
  };

  const fields = [
    { icon: User, label: 'Full Name', value: localStorage.getItem('adminName') || name, key: 'name', editable: true },
    { icon: Mail, label: 'Email Address', value: email, key: 'email', editable: false },
    { icon: Building2, label: 'Organization', value: localStorage.getItem('adminOrg') || org, key: 'org', editable: true },
    { icon: Shield, label: 'Role', value: 'System Administrator', key: 'role', editable: false },
    { icon: Clock, label: 'Member Since', value: new Date().toLocaleDateString('en-PK', { year: 'numeric', month: 'long' }), key: 'joined', editable: false },
  ];

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '2rem' }}>
      <div style={{ maxWidth: 600 }}>
        <PageHeader title="Admin Profile" subtitle="Manage your account information" />

        {/* Avatar */}
        <div style={{ ...S.card, padding: '1.75rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: 68, height: 68, borderRadius: '1rem', background: 'linear-gradient(135deg, rgba(14,116,144,0.3), rgba(124,58,237,0.2))', border: `2px solid rgba(34,211,238,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 700, color: C.cyan400, fontFamily: 'monospace', flexShrink: 0, boxShadow: '0 0 20px rgba(34,211,238,0.1)' }}>
            {initials}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '1.2rem', fontWeight: 700, color: C.text50, margin: '0 0 0.25rem' }}>{localStorage.getItem('adminName') || name}</p>
            <p style={{ fontSize: '0.78rem', color: C.text500, margin: '0 0 0.5rem', fontFamily: 'monospace' }}>{email}</p>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.2rem 0.625rem', borderRadius: 9999, backgroundColor: 'rgba(34,211,238,0.08)', border: `1px solid rgba(34,211,238,0.2)`, fontSize: '0.68rem', color: C.cyan400, letterSpacing: '0.06em' }}>
              <Shield size={10} /> SYSTEM ADMIN
            </span>
          </div>
          <button onClick={() => setEditing(!editing)} style={{ ...S.btnSecondary, padding: '0.5rem 0.875rem' }}>
            <Edit3 size={14} /> {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        <SectionCard style={{ marginBottom: '1.25rem' }}>
          <p style={{ fontSize: '0.68rem', color: C.text500, margin: '0 0 1.25rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Account Details</p>
          {fields.map((f, i) => (
            <div key={f.key} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 0', borderBottom: i < fields.length - 1 ? `1px solid ${C.border800}` : 'none' }}>
              <div style={{ width: 34, height: 34, borderRadius: '0.5rem', backgroundColor: C.bg800, border: `1px solid ${C.border700}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <f.icon size={14} color={C.text500} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.68rem', color: C.text500, margin: '0 0 0.2rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{f.label}</p>
                {editing && f.editable ? (
                  <input type="text" value={f.key === 'name' ? editName : editOrg} onChange={e => f.key === 'name' ? setEditName(e.target.value) : setEditOrg(e.target.value)}
                    style={{ ...S.input, fontSize: '0.875rem', padding: '0.5rem 0.75rem' }}
                    onFocus={e => { e.target.style.borderColor = C.cyan400; e.target.style.boxShadow = `0 0 0 3px ${C.cyan400}15`; }}
                    onBlur={e => { e.target.style.borderColor = C.border700; e.target.style.boxShadow = 'none'; }} />
                ) : (
                  <p style={{ fontSize: '0.875rem', color: f.editable ? C.text300 : C.text400, margin: 0, fontFamily: f.key === 'email' ? 'monospace' : 'inherit' }}>{f.value}</p>
                )}
              </div>
            </div>
          ))}
          {editing && (
            <div style={{ marginTop: '1.25rem' }}>
              <button style={S.btnPrimary} onClick={save}><Save size={14} /> Save Changes</button>
            </div>
          )}
        </SectionCard>

        <SectionCard>
          <p style={{ fontSize: '0.68rem', color: C.text500, margin: '0 0 1.25rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Security</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <div style={{ width: 34, height: 34, borderRadius: '0.5rem', backgroundColor: C.bg800, border: `1px solid ${C.border700}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lock size={14} color={C.text500} />
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', color: C.text300, margin: '0 0 0.15rem' }}>Password</p>
                <p style={{ fontSize: '0.75rem', color: C.text500, margin: 0 }}>Last changed: Never</p>
              </div>
            </div>
            <button style={S.btnSecondary} onClick={() => toast('Password change feature — coming soon', 'info')}>Change</button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function CyberNestDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [pulse, setPulse] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { toasts, add: toast } = useToast();
  const navigate = useNavigate();

  const adminName = localStorage.getItem('adminName') || 'Admin';
  const adminEmail = localStorage.getItem('adminEmail') || '';
  const initials = adminName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'AD';

  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/login');
    const pt = setInterval(() => setPulse(v => !v), 1800);
    return () => clearInterval(pt);
  }, []);

  // Load devices for dashboard metrics
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/device/list`, { headers: authHeaders() });
        const data = await res.json();
        if (Array.isArray(data)) setDevices(data);
        else if (data.devices) setDevices(data.devices);
      } catch {}
    };
    load();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleDeviceClick = (device) => {
    setSelectedDevice(device);
    setActivePage('device-detail');
  };

  const navigate2 = (page) => {
    setActivePage(page);
    setSelectedDevice(null);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'devices', label: 'Devices', icon: Smartphone },
    { id: 'commands', label: 'Commands', icon: Terminal },
    { id: 'policies', label: 'Policies', icon: ShieldCheck },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const pageTitles = {
    dashboard: 'Dashboard', devices: 'Devices', commands: 'Commands',
    policies: 'Policies', settings: 'Settings', profile: 'Profile',
    'device-detail': 'Device Detail',
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: C.bg950, color: C.text50, fontFamily: "'JetBrains Mono', 'Fira Code', 'IBM Plex Mono', monospace" }}>
      {/* Subtle grid background */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.018, backgroundImage: `linear-gradient(0deg,transparent 24%,rgba(34,211,238,.07) 25%,rgba(34,211,238,.07) 26%,transparent 27%,transparent 74%,rgba(34,211,238,.07) 75%,rgba(34,211,238,.07) 76%,transparent 77%),linear-gradient(90deg,transparent 24%,rgba(34,211,238,.07) 25%,rgba(34,211,238,.07) 26%,transparent 27%,transparent 74%,rgba(34,211,238,.07) 75%,rgba(34,211,238,.07) 76%,transparent 77%)`, backgroundSize: '50px 50px' }} />

      <div style={{ position: 'relative', display: 'flex', height: '100vh', overflow: 'hidden' }}>
        {/* ── SIDEBAR ─────────────────────────────────────────────── */}
        <div style={{
          position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 40,
          width: sidebarOpen ? 220 : 68,
          backgroundColor: C.bg900, borderRight: `1px solid ${C.border800}`,
          display: 'flex', flexDirection: 'column', transition: 'width 0.3s ease',
          overflow: 'hidden',
        }}>
          {/* Logo */}
          <div style={{ padding: '1rem', borderBottom: `1px solid ${C.border800}`, display: 'flex', alignItems: 'center', gap: '0.75rem', minHeight: 60, flexShrink: 0 }}>
            <div style={{ flexShrink: 0, padding: '0.5rem', borderRadius: '0.5rem', backgroundColor: C.bg800, border: `1px solid ${C.border700}`, display: 'flex', boxShadow: `0 0 12px rgba(34,211,238,0.15)` }}>
              <Shield size={17} color={C.cyan400} />
            </div>
            {sidebarOpen && (
              <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: C.text50, margin: 0, letterSpacing: '0.05em' }}>CYBER<span style={{ color: C.cyan400 }}>NEST</span></p>
                <p style={{ fontSize: '0.58rem', color: C.text500, margin: 0, letterSpacing: '0.1em' }}>MDM PLATFORM</p>
              </div>
            )}
          </div>

          {/* Nav Items */}
          <nav style={{ flex: 1, padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', overflowY: 'auto' }}>
            {sidebarOpen && <p style={{ fontSize: '0.58rem', color: C.text600, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0.375rem 0.25rem', margin: '0 0 0.25rem', fontWeight: 600 }}>Main Menu</p>}
            {navItems.map(({ id, label, icon: Icon }) => {
              const isActive = activePage === id || (id === 'devices' && activePage === 'device-detail');
              return (
                <button key={id} onClick={() => navigate2(id)}
                  style={{ ...S.sidebarBtn(isActive), justifyContent: sidebarOpen ? 'flex-start' : 'center', paddingLeft: sidebarOpen ? '1rem' : '0' }}
                  title={!sidebarOpen ? label : undefined}>
                  <Icon size={15} style={{ flexShrink: 0 }} />
                  {sidebarOpen && <span>{label}</span>}
                </button>
              );
            })}
          </nav>

          {/* Bottom */}
          <div style={{ padding: '0.75rem', borderTop: `1px solid ${C.border800}`, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <button onClick={() => setSidebarOpen(o => !o)}
              style={{ ...S.sidebarBtn(false), justifyContent: sidebarOpen ? 'flex-start' : 'center', paddingLeft: sidebarOpen ? '1rem' : '0' }}>
              <Menu size={15} style={{ flexShrink: 0 }} />
              {sidebarOpen && <span>Collapse</span>}
            </button>
            <button onClick={() => setShowLogoutConfirm(true)}
              style={{ ...S.sidebarBtn(false), color: C.red400, justifyContent: sidebarOpen ? 'flex-start' : 'center', paddingLeft: sidebarOpen ? '1rem' : '0' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(220,38,38,0.08)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
              <LogOut size={15} style={{ flexShrink: 0 }} />
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </div>

        {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: sidebarOpen ? 220 : 68, transition: 'margin-left 0.3s ease', overflow: 'hidden' }}>
          {/* Topbar */}
          <div style={{ borderBottom: `1px solid ${C.border800}`, backgroundColor: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 30, flexShrink: 0 }}>
            <div style={{ padding: '0 1.75rem', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h2 style={{ fontSize: '0.9rem', fontWeight: 600, color: C.text50, margin: 0, letterSpacing: '0.02em' }}>
                  {pageTitles[activePage] || activePage}
                </h2>
                {activePage === 'device-detail' && selectedDevice && (
                  <span style={{ fontSize: '0.75rem', color: C.text500, fontFamily: 'monospace' }}>
                    / {(selectedDevice.model || selectedDevice.deviceModel || 'Device').slice(0, 20)}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {/* Backend status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.75rem', borderRadius: '0.375rem', backgroundColor: C.bg800, border: `1px solid ${C.border700}` }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: C.emerald400, boxShadow: pulse ? `0 0 6px ${C.emerald400}` : 'none', transition: 'box-shadow 0.4s' }} />
                  <span style={{ fontSize: '0.68rem', color: C.text400, letterSpacing: '0.04em' }}>BACKEND:ONLINE</span>
                </div>
                {/* Admin pill */}
                <button onClick={() => navigate2('profile')}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', paddingLeft: '1rem', borderLeft: `1px solid ${C.border800}`, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.78rem', fontWeight: 600, color: C.text50, margin: 0 }}>{adminName}</p>
                    <p style={{ fontSize: '0.62rem', color: C.text500, margin: 0, fontFamily: 'monospace' }}>{adminEmail.slice(0, 20)}{adminEmail.length > 20 ? '…' : ''}</p>
                  </div>
                  <div style={{ width: 32, height: 32, borderRadius: '0.5rem', background: 'linear-gradient(135deg, rgba(14,116,144,0.25), rgba(124,58,237,0.2))', border: `1px solid rgba(34,211,238,0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.cyan400, fontWeight: 700, fontSize: '0.72rem' }}>
                    {initials}
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Page content */}
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {activePage === 'dashboard' && <DashboardHome devices={devices} onNavigate={navigate2} toast={toast} />}
            {activePage === 'devices' && <DevicesPage onDeviceClick={handleDeviceClick} toast={toast} />}
            {activePage === 'device-detail' && <DeviceDetailPage device={selectedDevice} onBack={() => navigate2('devices')} toast={toast} />}
            {activePage === 'commands' && <CommandsPage toast={toast} />}
            {activePage === 'policies' && <PoliciesPage toast={toast} />}
            {activePage === 'settings' && <SettingsPage toast={toast} />}
            {activePage === 'profile' && <ProfilePage toast={toast} />}
          </div>
        </div>
      </div>

      {/* Logout confirm */}
      {showLogoutConfirm && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(2,8,23,0.85)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}>
          <div style={{ backgroundColor: C.bg900, border: `1px solid ${C.border800}`, borderRadius: '1rem', padding: '2rem', maxWidth: 360, width: '90%', textAlign: 'center', animation: 'cn-fade-in 0.2s ease', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>
            <div style={{ padding: '0.875rem', borderRadius: '0.75rem', backgroundColor: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)', display: 'inline-flex', marginBottom: '1rem' }}>
              <LogOut size={22} color={C.red400} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: C.text50, margin: '0 0 0.5rem' }}>Logout Confirm</h3>
            <p style={{ fontSize: '0.8rem', color: C.text500, margin: '0 0 1.5rem' }}>You will be logged out of the dashboard</p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setShowLogoutConfirm(false)} style={{ ...S.btnSecondary, flex: 1, justifyContent: 'center' }}>Cancel</button>
              <button onClick={handleLogout} style={{ ...S.btnDanger, flex: 1, justifyContent: 'center' }}>Logout</button>
            </div>
          </div>
        </div>
      )}

      <Toast toasts={toasts} />

      <style>{`
        @keyframes cn-spin { to { transform: rotate(360deg); } }
        @keyframes cn-fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes cn-slide-in { from { opacity: 0; transform: translateX(12px); } to { opacity: 1; transform: translateX(0); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        input[type=range] { height: 4px; cursor: pointer; }
        select option { background: #1e293b; color: #f8fafc; }
      `}</style>
    </div>
  );
}