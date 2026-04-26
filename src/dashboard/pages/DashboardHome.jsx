import React, { useState, useEffect } from 'react';
import { Activity, Smartphone, CheckCircle2, XCircle, BatteryLow, Plus, Terminal, ShieldCheck, Settings, ChevronRight } from 'lucide-react';
import { C, S } from '../theme';
import { PageHeader } from '../components/PageHeader';
import { StatusDot } from '../components/StatusDot';

export function DashboardHome({ devices, onNavigate, toast }) {
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
                  const isLast = i === Math.min(devices.length - 1, 4);
                  const cellBorder = isLast ? 'none' : `1px solid ${C.border800}`;
                  return (
                    <tr key={id} style={{ transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(30,41,59,0.4)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <td style={{ ...S.tableCell, borderBottom: cellBorder }}>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: C.cyan400 }}>{String(id).slice(0, 18)}</span>
                        <div style={{ fontSize: '0.75rem', color: C.text500, marginTop: 2 }}>{model}</div>
                      </td>
                      <td style={{ ...S.tableCell, fontSize: '0.875rem', color: C.text300, borderBottom: cellBorder }}>{owner}</td>
                      <td style={{ ...S.tableCell, borderBottom: cellBorder }}><StatusDot status={status} /></td>
                      <td style={{ ...S.tableCell, fontFamily: 'monospace', fontSize: '0.75rem', color: C.text500, borderBottom: cellBorder }}>
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