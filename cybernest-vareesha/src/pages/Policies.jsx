import React, { useState } from 'react';
import {
  Shield,
  Smartphone,
  Settings,
  LogOut,
  Menu,
  BarChart3,
  AlertTriangle,
  Search,
  ChevronDown,
  CheckCircle2,
  Plus,
  X,
  Lock,
  Smartphone as PhoneIcon,
  Package,
  Download,
  Zap,
} from 'lucide-react';

export default function CyberNestPolicies() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav, setActiveNav] = useState('settings');
  const [kioskModeEnabled, setKioskModeEnabled] = useState(false);
  const [appSearchTerm, setAppSearchTerm] = useState('');
  const [selectedApps, setSelectedApps] = useState(new Set(['com.google.android.calculator', 'com.google.android.apps.chrome']));
  const [whitelistMode, setWhitelistMode] = useState(true); // true = whitelist, false = blacklist

  // Available apps
  const availableApps = [
    { id: 'com.google.android.calculator', name: 'Calculator', category: 'Productivity', icon: '🧮' },
    { id: 'com.google.android.apps.chrome', name: 'Chrome', category: 'Browser', icon: '🌐' },
    { id: 'com.android.calendar', name: 'Calendar', category: 'Productivity', icon: '📅' },
    { id: 'com.android.email', name: 'Email', category: 'Communication', icon: '📧' },
    { id: 'com.android.systemui', name: 'System UI', category: 'System', icon: '⚙️' },
    { id: 'com.android.messaging', name: 'Messages', category: 'Communication', icon: '💬' },
    { id: 'com.spotify.music', name: 'Spotify', category: 'Media', icon: '🎵' },
    { id: 'com.whatsapp', name: 'WhatsApp', category: 'Communication', icon: '💬' },
    { id: 'com.facebook.katana', name: 'Facebook', category: 'Social', icon: 'f' },
    { id: 'com.instagram.android', name: 'Instagram', category: 'Social', icon: '📷' },
    { id: 'com.twitter.android', name: 'Twitter', category: 'Social', icon: '𝕏' },
    { id: 'com.android.youtube', name: 'YouTube', category: 'Media', icon: '▶️' },
  ];

  const filteredApps = availableApps.filter(app =>
    app.name.toLowerCase().includes(appSearchTerm.toLowerCase()) ||
    app.category.toLowerCase().includes(appSearchTerm.toLowerCase())
  );

  const toggleApp = (appId) => {
    const newSelected = new Set(selectedApps);
    if (newSelected.has(appId)) {
      newSelected.delete(appId);
    } else {
      newSelected.add(appId);
    }
    setSelectedApps(newSelected);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'devices', label: 'Devices', icon: Smartphone },
    { id: 'commands', label: 'Commands', icon: AlertTriangle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans">
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(51, 65, 85, 0.1) 25%, rgba(51, 65, 85, 0.1) 26%, transparent 27%, transparent 74%, rgba(51, 65, 85, 0.1) 75%, rgba(51, 65, 85, 0.1) 76%, transparent 77%, transparent),
                              linear-gradient(90deg, transparent 24%, rgba(51, 65, 85, 0.1) 25%, rgba(51, 65, 85, 0.1) 26%, transparent 27%, transparent 74%, rgba(51, 65, 85, 0.1) 75%, rgba(51, 65, 85, 0.1) 76%, transparent 77%, transparent)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative flex h-screen overflow-hidden">
        {/* SIDEBAR */}
        <div
          className={`fixed inset-y-0 left-0 z-40 transition-all duration-300 ${
            sidebarOpen ? 'w-56' : 'w-20'
          } bg-slate-900 border-r border-slate-800 flex flex-col`}
        >
          <div className="p-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                <Shield className="w-5 h-5 text-cyan-400" />
              </div>
              {sidebarOpen && (
                <div>
                  <h1 className="text-sm font-semibold text-slate-50">CyberNest</h1>
                  <p className="text-xs text-slate-500">MDM Platform</p>
                </div>
              )}
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors duration-200 text-sm font-medium ${
                    isActive
                      ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {sidebarOpen && (
            <div className="p-4 border-t border-slate-800">
              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-red-900/20 transition-colors text-sm font-medium">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>

        {/* MAIN CONTENT */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-56' : 'ml-20'}`}>
          {/* TOP BAR */}
          <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-30">
            <div className="px-8 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {!sidebarOpen && (
                  <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-slate-800 rounded transition-colors">
                    <Menu className="w-5 h-5 text-slate-400" />
                  </button>
                )}
                <h2 className="text-lg font-semibold text-slate-50">Policies & Settings</h2>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-slate-800 border border-slate-700">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-slate-300 font-mono">Backend: Online</span>
                </div>

                <div className="flex items-center gap-2 pl-6 border-l border-slate-800">
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-50">Admin</p>
                    <p className="text-xs text-slate-500">Level: ADMIN</p>
                  </div>
                  <div className="w-8 h-8 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-semibold text-xs">
                    AD
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PAGE CONTENT */}
          <div className="flex-1 overflow-auto p-8">
            {/* KIOSK MODE SECTION */}
            <div className="mb-8">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 mb-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-50 flex items-center gap-3">
                      <Lock className="w-6 h-6 text-cyan-400" />
                      Kiosk Mode
                    </h2>
                    <p className="text-sm text-slate-500 mt-2">
                      Lock devices into a single app or set of approved apps. Perfect for retail displays, patient check-ins, and controlled environments.
                    </p>
                  </div>

                  <button
                    onClick={() => setKioskModeEnabled(!kioskModeEnabled)}
                    className={`relative w-16 h-8 rounded-full transition-all duration-300 flex-shrink-0 ${
                      kioskModeEnabled ? 'bg-emerald-600' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${
                        kioskModeEnabled ? 'transform translate-x-8' : ''
                      }`}
                    ></div>
                  </button>
                </div>

                {kioskModeEnabled && (
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-sm text-slate-300">
                    ✓ Kiosk Mode is <span className="text-emerald-400 font-semibold">ENABLED</span> globally
                  </div>
                )}
              </div>

              {/* APP MANAGEMENT - Only show if Kiosk Mode enabled */}
              {kioskModeEnabled && (
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-50 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-cyan-400" />
                    App Management
                  </h3>

                  {/* Whitelist / Blacklist Toggle */}
                  <div className="mb-6 p-4 bg-slate-800/50 border border-slate-700 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-50">Enforcement Mode</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {whitelistMode
                          ? 'Only allow selected apps'
                          : 'Block selected apps'}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setWhitelistMode(true)}
                        className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                          whitelistMode
                            ? 'bg-cyan-600 text-white'
                            : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                        }`}
                      >
                        Whitelist
                      </button>
                      <button
                        onClick={() => setWhitelistMode(false)}
                        className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                          !whitelistMode
                            ? 'bg-red-600 text-white'
                            : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                        }`}
                      >
                        Blacklist
                      </button>
                    </div>
                  </div>

                  {/* App Search */}
                  <div className="mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Search apps by name or category..."
                        value={appSearchTerm}
                        onChange={(e) => setAppSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-50 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors hover:bg-slate-700/50"
                      />
                    </div>
                  </div>

                  {/* Selected Apps Summary */}
                  <div className="mb-6 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                    <p className="text-xs text-slate-400 mb-3 font-medium uppercase">
                      {whitelistMode ? '✓ Allowed' : '✗ Blocked'} Apps ({selectedApps.size})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(selectedApps).map(appId => {
                        const app = availableApps.find(a => a.id === appId);
                        return app ? (
                          <span
                            key={appId}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-slate-700 border border-slate-600 rounded-full text-xs text-slate-300"
                          >
                            <span>{app.icon}</span>
                            <span>{app.name}</span>
                            <button
                              onClick={() => toggleApp(appId)}
                              className="ml-1 text-slate-500 hover:text-red-400 transition-colors"
                            >
                              ×
                            </button>
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>

                  {/* Available Apps Grid */}
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase mb-4">Available Apps</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {filteredApps.map(app => {
                        const isSelected = selectedApps.has(app.id);
                        return (
                          <button
                            key={app.id}
                            onClick={() => toggleApp(app.id)}
                            className={`p-4 rounded-lg border-2 transition-all duration-200 text-left group hover:shadow-lg ${
                              isSelected
                                ? 'border-cyan-500 bg-cyan-900/20 hover:bg-cyan-900/30'
                                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-slate-50 flex items-center gap-2">
                                  <span className="text-lg">{app.icon}</span>
                                  {app.name}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">{app.category}</p>
                              </div>
                              <div
                                className={`flex-shrink-0 w-5 h-5 rounded border-2 transition-all ${
                                  isSelected
                                    ? 'bg-cyan-500 border-cyan-500'
                                    : 'border-slate-600 group-hover:border-slate-500'
                                }`}
                              >
                                {isSelected && (
                                  <CheckCircle2 className="w-5 h-5 text-white" />
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {filteredApps.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-slate-500">No apps found matching your search</p>
                      </div>
                    )}
                  </div>

                  {/* Save Button */}
                  <div className="mt-6 pt-6 border-t border-slate-800">
                    <button className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium text-sm transition-colors">
                      Save Configuration
                    </button>
                  </div>
                </div>
              )}

              {!kioskModeEnabled && (
                <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-8 text-center">
                  <Lock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 font-medium">Kiosk Mode is currently disabled</p>
                  <p className="text-slate-500 text-sm mt-2">Enable Kiosk Mode above to manage app restrictions</p>
                </div>
              )}
            </div>

            {/* OTHER POLICIES SECTION */}
            <div>
              <h3 className="text-lg font-semibold text-slate-50 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                Other Policy Settings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Policy Card Template */}
                {[
                  { title: 'Screen Lock', description: 'Enforce minimum screen lock requirements', icon: '🔒' },
                  { title: 'Update Policy', description: 'Control automatic app and OS updates', icon: '⬆️' },
                  { title: 'VPN Configuration', description: 'Force VPN connection for all traffic', icon: '🔐' },
                  { title: 'WiFi Restrictions', description: 'Restrict WiFi to enterprise networks only', icon: '📡' },
                ].map((policy, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition-all duration-200 hover:bg-slate-800/30 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-2xl">{policy.icon}</span>
                      <ChevronDown className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
                    </div>
                    <h4 className="text-sm font-semibold text-slate-50">{policy.title}</h4>
                    <p className="text-xs text-slate-500 mt-2">{policy.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}