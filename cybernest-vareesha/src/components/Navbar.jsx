import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Smartphone, 
  Settings, 
  AlertTriangle, 
  Users, 
  LogOut, 
  Shield,
  Menu
} from 'lucide-react';

export default function Navbar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/devices', label: 'Devices', icon: Smartphone },
    { path: '/commands', label: 'Commands', icon: AlertTriangle },
    { path: '/policies', label: 'Policies', icon: Settings },
    { path: '/admins', label: 'Admins', icon: Users },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 ${
        sidebarOpen ? 'w-56' : 'w-20'
      } bg-slate-900 border-r border-slate-800 flex flex-col`}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
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
        {!sidebarOpen && (
          <button onClick={() => setSidebarOpen(true)} className="p-1 hover:bg-slate-800 rounded">
             <Menu className="w-4 h-4 text-slate-400" />
          </button>
        )}
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors duration-200 text-sm font-medium ${
                active
                  ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
              title={!sidebarOpen ? item.label : ""}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer (Logout) */}
      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-red-900/20 transition-colors text-sm font-medium"
          title={!sidebarOpen ? "Logout" : ""}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}