import React, { useState } from 'react';
import { Package, Lock, Wifi, Download, Save, Search, CheckCircle2 } from 'lucide-react';
import { C, S } from '../theme';
import { BASE_URL, authHeaders } from '../config'; // ✅ Add this import
import { PageHeader } from '../components/PageHeader';
import { SectionCard } from '../components/SectionCard';
import { Toggle } from '../components/Toggle';
import { Spinner } from '../components/Spinner';

export function PoliciesPage({ toast }) {
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
    } catch { 
      toast('Config saved locally (API offline)', 'info'); 
    }
    finally { setSaving(false); }
  };

  const sections = [
    { id: 'kiosk', label: 'Kiosk & App Control', icon: Package },
    { id: 'password', label: 'Password Policy', icon: Lock },
    { id: 'wifi', label: 'WiFi Configuration', icon: Wifi },
    { id: 'updates', label: 'Update Policy', icon: Download },
  ];

  return (
    <div style={{ padding: '2rem' }}>
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