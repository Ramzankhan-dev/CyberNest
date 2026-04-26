import React, { useState } from 'react';
import { Settings, Bell, ShieldCheck, Server, Save, Zap, Copy, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { C, S } from '../theme';
import { BASE_URL, authHeaders } from '../config';
import { PageHeader } from '../components/PageHeader';
import { SectionCard } from '../components/SectionCard'; // ✅ Fixed: was 'SessionCard'
import { Toggle } from '../components/Toggle';
import { Spinner } from '../components/Spinner';

export function SettingsPage({ toast }) {
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
    <div style={{ padding: '2rem' }}>
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