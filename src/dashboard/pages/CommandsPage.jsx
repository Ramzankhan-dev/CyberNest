import React, { useState } from 'react';
import { FileText, ShieldCheck, Search, ChevronDown, CheckCircle2, XCircle, Clock, Info, AlertTriangle, Camera, Package, Navigation, Wifi, Settings2, Download } from 'lucide-react';
import { C, S } from '../theme';
import { PageHeader } from '../components/PageHeader';
import { Toggle } from '../components/Toggle';
import { BASE_URL, authHeaders } from '../config';

export function CommandsPage({ toast }) {
  const [activeTab, setActiveTab] = useState('audit');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
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

      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', backgroundColor: C.bg900, border: `1px solid ${C.border800}`, borderRadius: '0.5rem', padding: '0.25rem', width: 'fit-content' }}>
        {[{ id: 'audit', label: 'Command Audit Log', icon: FileText }, { id: 'policies', label: 'Enforce Policies', icon: ShieldCheck }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none', backgroundColor: activeTab === tab.id ? C.bg700 : 'transparent', color: activeTab === tab.id ? C.text50 : C.text400, fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
            <tab.icon size={13} />{tab.label}
          </button>
        ))}
      </div>

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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
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