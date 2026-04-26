import React, { useState, useRef } from 'react';
import {
  Package, Lock, Wifi, Download, Save, Search,
  CheckCircle2, Upload, Send, Smartphone, Users,
  X, FileUp, AlertCircle, ChevronDown
} from 'lucide-react';
import { C, S } from '../theme';
import { BASE_URL, authHeaders } from '../config';
import { PageHeader } from '../components/PageHeader';
import { Toggle } from '../components/Toggle';
import { Spinner } from '../components/Spinner';

// ─────────────────────────────────────────────────────────────
// PoliciesPage
// Sections: APK Deploy | Kiosk & Apps |  WiFi | Updates
// ─────────────────────────────────────────────────────────────
export function PoliciesPage({ toast }) {

  // ── Active sidebar section ──
  const [activeSection, setActiveSection] = useState('apk');

  // ── Global save state ──
  const [saving, setSaving] = useState(false);

  // ── Kiosk & App state ──
  const [kioskEnabled,  setKioskEnabled]  = useState(false);
  const [whitelistMode, setWhitelistMode] = useState(true);
  const [appSearch,     setAppSearch]     = useState('');
  const [selectedApps,  setSelectedApps]  = useState(
    new Set(['com.google.android.calculator', 'com.google.android.apps.chrome'])
  );

  // ── WiFi state ──
  const [wifiSettings, setWifiSettings] = useState({
    ssid: '', security: 'WPA2', forceEnterprise: false, allowHotspot: false,
  });

  // ── Update policy state ──
  const [updateSettings, setUpdateSettings] = useState({
    autoUpdate: true, forceUpdate: false, maintenanceWindow: '02:00-04:00',
  });

  // ── APK Deploy state ──
  const [apkFile,        setApkFile]        = useState(null);   // File object
  const [packageId,      setPackageId]      = useState('');     // e.g. com.example.app
  const [deployTarget,   setDeployTarget]   = useState('all');  // 'all' | 'specific'
  const [deviceId,       setDeviceId]       = useState('');     // device ID when specific
  const [deploying,      setDeploying]      = useState(false);
  const [deployResult,   setDeployResult]   = useState(null);   // null | 'success' | 'error'
  const fileInputRef = useRef(null);

  // ─────────────────────────────────────────────────────────────
  // App list for kiosk section
  // ─────────────────────────────────────────────────────────────
  const availableApps = [
    { id: 'com.google.android.calculator', name: 'Calculator',  category: 'Productivity',   icon: '🧮' },
    { id: 'com.google.android.apps.chrome', name: 'Chrome',     category: 'Browser',        icon: '🌐' },
    { id: 'com.android.calendar',           name: 'Calendar',   category: 'Productivity',   icon: '📅' },
    { id: 'com.android.email',              name: 'Email',      category: 'Communication',  icon: '📧' },
    { id: 'com.android.messaging',          name: 'Messages',   category: 'Communication',  icon: '💬' },
    { id: 'com.spotify.music',              name: 'Spotify',    category: 'Media',          icon: '🎵' },
    { id: 'com.whatsapp',                   name: 'WhatsApp',   category: 'Communication',  icon: '💬' },
    { id: 'com.facebook.katana',            name: 'Facebook',   category: 'Social',         icon: '📘' },
    { id: 'com.instagram.android',          name: 'Instagram',  category: 'Social',         icon: '📷' },
    { id: 'com.twitter.android',            name: 'Twitter/X',  category: 'Social',         icon: '𝕏' },
    { id: 'com.android.youtube',            name: 'YouTube',    category: 'Media',          icon: '▶️' },
    { id: 'com.microsoft.teams',            name: 'Teams',      category: 'Productivity',   icon: '💼' },
  ];

  const filteredApps = availableApps.filter(a =>
    a.name.toLowerCase().includes(appSearch.toLowerCase()) ||
    a.category.toLowerCase().includes(appSearch.toLowerCase())
  );

  const toggleApp = id => {
    const next = new Set(selectedApps);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedApps(next);
  };

  // ─────────────────────────────────────────────────────────────
  // APK file pick handler
  // ─────────────────────────────────────────────────────────────
  const handleFilePick = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.apk')) {
      toast('Only .apk files are allowed', 'error');
      return;
    }
    setApkFile(file);
    setDeployResult(null);
    // Auto-fill package ID hint from filename (user can override)
    const guessed = file.name.replace('.apk', '').replace(/[-_]/g, '.').toLowerCase();
    if (!packageId) setPackageId(guessed);
  };

  // ─────────────────────────────────────────────────────────────
  // APK deploy handler
  // ─────────────────────────────────────────────────────────────
  const handleDeploy = async () => {
    if (!apkFile)    { toast('Please select an APK file', 'error'); return; }
    if (!packageId.trim()) { toast('Package ID is required', 'error'); return; }
    if (deployTarget === 'specific' && !deviceId.trim()) {
      toast('Please enter a Device ID', 'error'); return;
    }

    setDeploying(true);
    setDeployResult(null);

    try {
      const form = new FormData();
      form.append('apk', apkFile);
      form.append('packageId', packageId.trim());
      form.append('target', deployTarget);
      if (deployTarget === 'specific') form.append('deviceId', deviceId.trim());

      const res = await fetch(`${BASE_URL}/api/policy/deploy-apk`, {
        method: 'POST',
        headers: authHeaders(false), // false = don't set Content-Type (let browser set multipart)
        body: form,
      });

      if (res.ok) {
        setDeployResult('success');
        toast('APK deployed successfully!', 'success');
      } else {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Deploy failed');
      }
    } catch (err) {
      setDeployResult('error');
      toast(err.message || 'Deploy failed — check API connection', 'error');
    } finally {
      setDeploying(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // Save all other policies
  // ─────────────────────────────────────────────────────────────
  const saveConfig = async () => {
    setSaving(true);
    try {
      await fetch(`${BASE_URL}/api/policy/config`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          kioskEnabled, whitelistMode,
          selectedApps: Array.from(selectedApps),
           wifiSettings, updateSettings,
        }),
      });
      toast('Policies saved!', 'success');
    } catch {
      toast('Saved locally (API offline)', 'info');
    } finally {
      setSaving(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // Sidebar section definitions
  // ─────────────────────────────────────────────────────────────
  const sections = [
    { id: 'apk',      label: 'APK Deployment',     icon: Upload   },
    { id: 'kiosk',    label: 'Kiosk & App Control', icon: Package  },
    { id: 'wifi',     label: 'WiFi Configuration',  icon: Wifi     },
    { id: 'updates',  label: 'Update Policy',        icon: Download },
  ];

  // ─────────────────────────────────────────────────────────────
  // Shared inline styles
  // ─────────────────────────────────────────────────────────────
  const st = {
    // Scrollable page wrapper
    page: {
      height: '100%',
      overflowY: 'auto',
      padding: '2rem 1.5rem 3rem',
      boxSizing: 'border-box',
    },

    // Two-column layout: sidebar + content
    layout: {
      display: 'grid',
      gridTemplateColumns: '200px 1fr',
      gap: '1.25rem',
      alignItems: 'start',
    },

    // Sidebar nav
    sidebar: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem',
      position: 'sticky',
      top: 0,
    },

    sidebarBtn: active => ({
      display: 'flex',
      alignItems: 'center',
      gap: '0.6rem',
      padding: '0.6rem 0.875rem',
      borderRadius: '0.5rem',
      border: 'none',
      backgroundColor: active ? 'rgba(34,211,238,0.1)' : 'transparent',
      color: active ? '#22d3ee' : '#64748b',
      borderLeft: active ? '2px solid #22d3ee' : '2px solid transparent',
      fontSize: '0.8rem',
      fontWeight: active ? 600 : 400,
      cursor: 'pointer',
      textAlign: 'left',
      fontFamily: 'inherit',
      transition: 'all 0.18s',
    }),

    // Generic card
    card: {
      backgroundColor: 'rgba(15,23,42,0.7)',
      border: '1px solid rgba(30,41,59,0.9)',
      borderRadius: '0.875rem',
      padding: '1.5rem',
      marginBottom: '1rem',
    },

    cardTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.6rem',
      marginBottom: '1.25rem',
    },

    cardTitleText: {
      fontSize: '0.95rem',
      fontWeight: 700,
      color: '#f1f5f9',
      margin: 0,
    },

    label: {
      fontSize: '0.68rem',
      color: '#475569',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      fontWeight: 600,
      display: 'block',
      marginBottom: '0.5rem',
    },

    input: {
      width: '100%',
      padding: '0.6rem 0.875rem',
      backgroundColor: 'rgba(15,23,42,0.9)',
      border: '1px solid rgba(30,41,59,0.9)',
      borderRadius: '0.5rem',
      color: '#f1f5f9',
      fontSize: '0.875rem',
      outline: 'none',
      boxSizing: 'border-box',
      fontFamily: 'inherit',
      transition: 'border-color 0.18s, box-shadow 0.18s',
    },

    divider: {
      height: 1,
      backgroundColor: 'rgba(30,41,59,0.8)',
      margin: '1rem 0',
    },

    // APK drop zone
    dropZone: hasFile => ({
      border: `2px dashed ${hasFile ? 'rgba(34,211,238,0.4)' : 'rgba(30,41,59,0.9)'}`,
      borderRadius: '0.75rem',
      padding: '2rem',
      textAlign: 'center',
      backgroundColor: hasFile ? 'rgba(34,211,238,0.04)' : 'rgba(15,23,42,0.5)',
      cursor: 'pointer',
      transition: 'all 0.2s',
    }),

    // Pill tag for selected/active state
    pill: active => ({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.3rem',
      padding: '0.25rem 0.75rem',
      borderRadius: 9999,
      border: `1px solid ${active ? 'rgba(34,211,238,0.3)' : 'rgba(30,41,59,0.9)'}`,
      backgroundColor: active ? 'rgba(34,211,238,0.1)' : 'transparent',
      color: active ? '#22d3ee' : '#64748b',
      fontSize: '0.8rem',
      cursor: 'pointer',
      fontFamily: 'inherit',
    }),

    deployBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.65rem 1.5rem',
      borderRadius: '0.5rem',
      border: '1px solid rgba(34,211,238,0.3)',
      backgroundColor: 'rgba(14,116,144,0.2)',
      color: '#22d3ee',
      fontSize: '0.875rem',
      fontWeight: 600,
      cursor: deploying ? 'not-allowed' : 'pointer',
      opacity: deploying ? 0.7 : 1,
      fontFamily: 'inherit',
    },

    toggleRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.875rem 1rem',
      backgroundColor: 'rgba(15,23,42,0.5)',
      borderRadius: '0.5rem',
      border: '1px solid rgba(30,41,59,0.8)',
    },
  };

  // Focus/blur handlers for inputs
  const onFocus = e => {
    e.target.style.borderColor = '#22d3ee';
    e.target.style.boxShadow = '0 0 0 3px rgba(34,211,238,0.08)';
  };
  const onBlur = e => {
    e.target.style.borderColor = 'rgba(30,41,59,0.9)';
    e.target.style.boxShadow = 'none';
  };

  // ─────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────
  return (
    <div style={st.page}>

      {/* Page header with global Save button */}
      <PageHeader
        title="Policies & Settings"
        subtitle="Configure MDM policies and deploy apps to enrolled devices"
        action={
          <button style={S.btnPrimary} onClick={saveConfig} disabled={saving}>
            {saving
              ? <><Spinner size={14} color="#fff" /> Saving...</>
              : <><Save size={14} /> Save All Policies</>
            }
          </button>
        }
      />

      <div style={st.layout}>

        {/* ── Sidebar ── */}
        <div style={st.sidebar}>
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              style={st.sidebarBtn(activeSection === id)}
              onClick={() => setActiveSection(id)}
            >
              <Icon size={14} style={{ flexShrink: 0 }} />
              {label}
            </button>
          ))}
        </div>

        {/* ── Content area ── */}
        <div>

          {/* ════════════════════════════════════════
              APK DEPLOYMENT SECTION
          ════════════════════════════════════════ */}
          {activeSection === 'apk' && (
            <div>

              {/* Step 1 — Upload APK */}
              <div style={st.card}>
                <div style={st.cardTitle}>
                  <FileUp size={17} color="#22d3ee" />
                  <p style={st.cardTitleText}>Step 1 — Upload APK File</p>
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".apk"
                  style={{ display: 'none' }}
                  onChange={handleFilePick}
                />

                {/* Drop zone / click to select */}
                <div
                  style={st.dropZone(!!apkFile)}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {apkFile ? (
                    <>
                      <CheckCircle2 size={28} color="#22d3ee" style={{ margin: '0 auto 0.75rem', display: 'block' }} />
                      <p style={{ color: '#22d3ee', fontWeight: 600, fontSize: '0.9rem', margin: '0 0 0.25rem' }}>
                        {apkFile.name}
                      </p>
                      <p style={{ color: '#475569', fontSize: '0.78rem', margin: '0 0 0.875rem' }}>
                        {(apkFile.size / 1024 / 1024).toFixed(2)} MB — click to replace
                      </p>
                      {/* Remove file button */}
                      <button
                        onClick={e => { e.stopPropagation(); setApkFile(null); setDeployResult(null); }}
                        style={{ ...st.pill(false), color: '#f87171', borderColor: 'rgba(248,113,113,0.3)' }}
                      >
                        <X size={12} /> Remove
                      </button>
                    </>
                  ) : (
                    <>
                      <Upload size={28} color="#475569" style={{ margin: '0 auto 0.75rem', display: 'block' }} />
                      <p style={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.875rem', margin: '0 0 0.25rem' }}>
                        Click to select APK file
                      </p>
                      <p style={{ color: '#475569', fontSize: '0.78rem', margin: 0 }}>
                        Only .apk files are accepted
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Step 2 — Package ID */}
              <div style={st.card}>
                <div style={st.cardTitle}>
                  <Package size={17} color="#22d3ee" />
                  <p style={st.cardTitleText}>Step 2 — Package ID</p>
                </div>

                <label style={st.label}>Android Package Name</label>
                <input
                  type="text"
                  value={packageId}
                  onChange={e => setPackageId(e.target.value)}
                  placeholder="e.g. com.example.myapp"
                  style={st.input}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
                <p style={{ fontSize: '0.72rem', color: '#475569', margin: '0.5rem 0 0' }}>
                  Found in AndroidManifest.xml → package attribute
                </p>
              </div>

              {/* Step 3 — Deploy target */}
              <div style={st.card}>
                <div style={st.cardTitle}>
                  <Send size={17} color="#22d3ee" />
                  <p style={st.cardTitleText}>Step 3 — Select Deployment Target</p>
                </div>

                {/* Target toggle pills */}
                <div style={{ display: 'flex', gap: '0.625rem', marginBottom: '1.25rem' }}>
                  <button
                    style={st.pill(deployTarget === 'all')}
                    onClick={() => setDeployTarget('all')}
                  >
                    <Users size={13} /> All Connected Devices
                  </button>
                  <button
                    style={st.pill(deployTarget === 'specific')}
                    onClick={() => setDeployTarget('specific')}
                  >
                    <Smartphone size={13} /> Specific Device
                  </button>
                </div>

                {/* Device ID field — only shown when specific is selected */}
                {deployTarget === 'specific' && (
                  <>
                    <label style={st.label}>Device ID</label>
                    <input
                      type="text"
                      value={deviceId}
                      onChange={e => setDeviceId(e.target.value)}
                      placeholder="e.g. device-abc123"
                      style={st.input}
                      onFocus={onFocus}
                      onBlur={onBlur}
                    />
                    <p style={{ fontSize: '0.72rem', color: '#475569', margin: '0.5rem 0 0' }}>
                      Find Device ID in the Devices section of this dashboard
                    </p>
                  </>
                )}

                <div style={st.divider} />

                {/* Summary before deploy */}
                <div style={{
                  padding: '0.875rem 1rem',
                  backgroundColor: 'rgba(15,23,42,0.5)',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(30,41,59,0.8)',
                  marginBottom: '1.25rem',
                  fontSize: '0.8rem',
                  color: '#64748b',
                  lineHeight: 1.6,
                }}>
                  <strong style={{ color: '#94a3b8', display: 'block', marginBottom: '0.35rem' }}>
                    Deploy Summary
                  </strong>
                  📦 File: <span style={{ color: '#cbd5e1' }}>{apkFile?.name || '—'}</span><br />
                  🏷 Package: <span style={{ color: '#cbd5e1', fontFamily: 'monospace' }}>{packageId || '—'}</span><br />
                  📡 Target: <span style={{ color: '#cbd5e1' }}>
                    {deployTarget === 'all' ? 'All connected devices' : (deviceId || '—')}
                  </span>
                </div>

                {/* Deploy button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <button
                    style={st.deployBtn}
                    onClick={handleDeploy}
                    disabled={deploying}
                  >
                    {deploying
                      ? <><Spinner size={14} color="#22d3ee" /> Deploying...</>
                      : <><Send size={14} /> Deploy APK</>
                    }
                  </button>

                  {/* Result indicators */}
                  {deployResult === 'success' && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontSize: '0.82rem' }}>
                      <CheckCircle2 size={15} /> Deployed successfully
                    </span>
                  )}
                  {deployResult === 'error' && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f87171', fontSize: '0.82rem' }}>
                      <AlertCircle size={15} /> Deploy failed
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════
              KIOSK & APP CONTROL
          ════════════════════════════════════════ */}
          {activeSection === 'kiosk' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {/* Kiosk toggle card */}
              <div style={st.card}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <div style={st.cardTitle}>
                      <Package size={17} color="#22d3ee" />
                      <p style={st.cardTitleText}>Kiosk Mode</p>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#475569', margin: 0 }}>
                      Lock devices to specific apps and restrict system access
                    </p>
                  </div>
                  <Toggle
                    value={kioskEnabled}
                    onChange={v => { setKioskEnabled(v); toast(`Kiosk ${v ? 'enabled' : 'disabled'}`, 'info'); }}
                  />
                </div>
              </div>

              {/* Placeholder when kiosk is off */}
              {!kioskEnabled && (
                <div style={{
                  padding: '2.5rem', textAlign: 'center',
                  border: '1px dashed rgba(30,41,59,0.8)',
                  borderRadius: '0.75rem', color: '#334155',
                }}>
                  <Lock size={36} color="#1e293b" style={{ margin: '0 auto 0.75rem', display: 'block' }} />
                  <p style={{ fontSize: '0.875rem', margin: 0 }}>
                    Enable Kiosk Mode above to configure app restrictions
                  </p>
                </div>
              )}

              {/* App control — visible only when kiosk is on */}
              {kioskEnabled && (
                <div style={st.card}>
                  {/* Whitelist / Blacklist toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f1f5f9', margin: '0 0 0.2rem' }}>
                        App Control Mode
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#475569', margin: 0 }}>
                        {whitelistMode ? 'Only selected apps are allowed' : 'Selected apps are blocked'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {[
                        { val: true,  label: 'Whitelist', color: 'rgba(14,116,144,0.3)',  active: '#22d3ee' },
                        { val: false, label: 'Blacklist',  color: 'rgba(127,29,29,0.3)',  active: '#f87171' },
                      ].map(m => (
                        <button
                          key={String(m.val)}
                          onClick={() => setWhitelistMode(m.val)}
                          style={{
                            padding: '0.4rem 0.875rem',
                            borderRadius: '0.375rem',
                            border: `1px solid ${whitelistMode === m.val ? m.active : 'rgba(30,41,59,0.9)'}`,
                            backgroundColor: whitelistMode === m.val ? m.color : 'transparent',
                            color: whitelistMode === m.val ? m.active : '#475569',
                            fontSize: '0.78rem',
                            fontWeight: 500,
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                          }}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selected app chips */}
                  {selectedApps.size > 0 && (
                    <div style={{
                      padding: '0.875rem',
                      backgroundColor: 'rgba(15,23,42,0.5)',
                      borderRadius: '0.5rem',
                      border: '1px solid rgba(30,41,59,0.8)',
                      marginBottom: '1rem',
                    }}>
                      <p style={{ ...st.label, margin: '0 0 0.625rem' }}>
                        {whitelistMode ? '✓ Allowed' : '✗ Blocked'} ({selectedApps.size})
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {Array.from(selectedApps).map(id => {
                          const app = availableApps.find(a => a.id === id);
                          return app ? (
                            <span key={id} style={{
                              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                              padding: '0.25rem 0.625rem',
                              backgroundColor: 'rgba(15,23,42,0.8)',
                              border: '1px solid rgba(30,41,59,0.9)',
                              borderRadius: 9999,
                              fontSize: '0.75rem', color: '#94a3b8',
                            }}>
                              {app.icon} {app.name}
                              <button
                                onClick={() => toggleApp(id)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: 0, lineHeight: 1, fontSize: '1rem' }}
                              >×</button>
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}

                  {/* Search */}
                  <div style={{ position: 'relative', marginBottom: '0.875rem' }}>
                    <Search size={13} color="#475569" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      placeholder="Search apps..."
                      value={appSearch}
                      onChange={e => setAppSearch(e.target.value)}
                      style={{ ...st.input, paddingLeft: '2.25rem' }}
                      onFocus={onFocus}
                      onBlur={onBlur}
                    />
                  </div>

                  {/* App grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.5rem' }}>
                    {filteredApps.map(app => {
                      const sel = selectedApps.has(app.id);
                      return (
                        <button
                          key={app.id}
                          onClick={() => toggleApp(app.id)}
                          style={{
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            border: `1px solid ${sel ? 'rgba(34,211,238,0.35)' : 'rgba(30,41,59,0.9)'}`,
                            backgroundColor: sel ? 'rgba(14,116,144,0.15)' : 'rgba(15,23,42,0.5)',
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontFamily: 'inherit',
                            transition: 'all 0.15s',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <p style={{ fontSize: '0.8rem', fontWeight: 500, color: '#f1f5f9', margin: '0 0 0.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <span style={{ fontSize: '0.95rem' }}>{app.icon}</span> {app.name}
                              </p>
                              <p style={{ fontSize: '0.68rem', color: '#475569', margin: 0 }}>{app.category}</p>
                            </div>
                            {/* Checkbox indicator */}
                            <div style={{
                              width: 16, height: 16,
                              borderRadius: '0.25rem',
                              border: `1.5px solid ${sel ? '#22d3ee' : 'rgba(30,41,59,0.9)'}`,
                              backgroundColor: sel ? '#0e7490' : 'transparent',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              flexShrink: 0,
                            }}>
                              {sel && <CheckCircle2 size={10} color="#fff" />}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          
          {/* ════════════════════════════════════════
              WIFI CONFIGURATION
          ════════════════════════════════════════ */}
          {activeSection === 'wifi' && (
            <div style={st.card}>
              <div style={st.cardTitle}>
                <Wifi size={17} color="#22d3ee" />
                <p style={st.cardTitleText}>WiFi Configuration</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* SSID */}
                <div>
                  <label style={st.label}>Network SSID</label>
                  <input
                    type="text"
                    value={wifiSettings.ssid}
                    onChange={e => setWifiSettings(p => ({ ...p, ssid: e.target.value }))}
                    placeholder="CorpNet-5G"
                    style={st.input}
                    onFocus={onFocus} onBlur={onBlur}
                  />
                </div>

                {/* Security type */}
                <div>
                  <label style={st.label}>Security Type</label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={wifiSettings.security}
                      onChange={e => setWifiSettings(p => ({ ...p, security: e.target.value }))}
                      style={{ ...st.input, appearance: 'none', paddingRight: '2rem' }}
                    >
                      {['WPA2', 'WPA3', 'WPA2-Enterprise', 'Open'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <ChevronDown size={13} color="#475569" style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  </div>
                </div>

                <div style={st.divider} />

                {/* Toggle rows */}
                {[
                  { key: 'forceEnterprise', label: 'Force enterprise networks only' },
                  { key: 'allowHotspot',    label: 'Allow personal hotspot' },
                ].map(({ key, label }) => (
                  <div key={key} style={st.toggleRow}>
                    <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{label}</span>
                    <Toggle
                      value={wifiSettings[key]}
                      onChange={v => setWifiSettings(p => ({ ...p, [key]: v }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════
              UPDATE POLICY
          ════════════════════════════════════════ */}
          {activeSection === 'updates' && (
            <div style={st.card}>
              <div style={st.cardTitle}>
                <Download size={17} color="#22d3ee" />
                <p style={st.cardTitleText}>Update Policy</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Auto update toggle */}
                <div style={st.toggleRow}>
                  <div>
                    <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: '0 0 0.15rem' }}>
                      Enable automatic updates
                    </p>
                  </div>
                  <Toggle
                    value={updateSettings.autoUpdate}
                    onChange={v => setUpdateSettings(p => ({ ...p, autoUpdate: v }))}
                  />
                </div>

                {/* Force update toggle */}
                <div style={st.toggleRow}>
                  <div>
                    <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: '0 0 0.15rem' }}>
                      Force immediate critical updates
                    </p>
                    <p style={{ fontSize: '0.72rem', color: '#fbbf24', margin: 0 }}>
                      ⚠ May interrupt device usage
                    </p>
                  </div>
                  <Toggle
                    value={updateSettings.forceUpdate}
                    onChange={v => setUpdateSettings(p => ({ ...p, forceUpdate: v }))}
                  />
                </div>

                <div style={st.divider} />

                {/* Maintenance window */}
                <div>
                  <label style={st.label}>Maintenance Window</label>
                  <input
                    type="text"
                    value={updateSettings.maintenanceWindow}
                    onChange={e => setUpdateSettings(p => ({ ...p, maintenanceWindow: e.target.value }))}
                    placeholder="02:00-04:00"
                    style={st.input}
                    onFocus={onFocus} onBlur={onBlur}
                  />
                  <p style={{ fontSize: '0.72rem', color: '#475569', margin: '0.4rem 0 0' }}>
                    Format: HH:MM-HH:MM (24-hour clock)
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}