import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Smartphone, Terminal, ShieldCheck, Settings, User, Menu, LogOut, Shield } from 'lucide-react';

import { C, S } from './theme';
import { BASE_URL, authHeaders } from './config';
import { useToast } from './hooks/useToast';
import { Toast } from './components/Toast';
import { DashboardHome } from './pages/DashboardHome';
import { DevicesPage } from './pages/DevicesPage';
import { DeviceDetailPage } from './pages/DeviceDetailPage';
import { CommandsPage } from './pages/CommandsPage';
import { PoliciesPage } from './pages/PoliciesPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProfilePage } from './pages/ProfilePage';
 
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
  }, [navigate]);

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
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.018, backgroundImage: `linear-gradient(0deg,transparent 24%,rgba(34,211,238,.07) 25%,rgba(34,211,238,.07) 26%,transparent 27%,transparent 74%,rgba(34,211,238,.07) 75%,rgba(34,211,238,.07) 76%,transparent 77%),linear-gradient(90deg,transparent 24%,rgba(34,211,238,.07) 25%,rgba(34,211,238,.07) 26%,transparent 27%,transparent 74%,rgba(34,211,238,.07) 75%,rgba(34,211,238,.07) 76%,transparent 77%)`, backgroundSize: '50px 50px' }} />

      <div style={{ position: 'relative', display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <div style={{
          position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 40,
          width: sidebarOpen ? 220 : 68,
          backgroundColor: C.bg900, borderRight: `1px solid ${C.border800}`,
          display: 'flex', flexDirection: 'column', transition: 'width 0.3s ease',
          overflow: 'hidden',
        }}>
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

          <div style={{ padding: '0.75rem', borderTop: `1px solid ${C.border800}`, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <button onClick={() => setSidebarOpen(o => !o)}
              style={{ ...S.sidebarBtn(false), justifyContent: sidebarOpen ? 'flex-start' : 'center', paddingLeft: sidebarOpen ? '1rem' : '0' }}>
              <Menu size={15} style={{ flexShrink: 0 }} />
              {sidebarOpen && <span>Collapse</span>}
            </button>
            <button onClick={() => setShowLogoutConfirm(true)}
              style={{ ...S.sidebarBtn(false), color: C.red400, justifyContent: sidebarOpen ? 'flex-start' : 'center', paddingLeft: sidebarOpen ? '1rem' : '0' }}>
              <LogOut size={15} style={{ flexShrink: 0 }} />
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: sidebarOpen ? 220 : 68, transition: 'margin-left 0.3s ease', overflow: 'hidden' }}>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.75rem', borderRadius: '0.375rem', backgroundColor: C.bg800, border: `1px solid ${C.border700}` }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: C.emerald400, boxShadow: pulse ? `0 0 6px ${C.emerald400}` : 'none', transition: 'box-shadow 0.4s' }} />
                  <span style={{ fontSize: '0.68rem', color: C.text400, letterSpacing: '0.04em' }}>BACKEND:ONLINE</span>
                </div>
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