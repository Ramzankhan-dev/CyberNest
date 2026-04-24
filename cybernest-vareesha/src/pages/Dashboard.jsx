// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Activity,
  XCircle,
  TrendingUp,
  Clock,
  Wifi,
  Shield,
} from 'lucide-react';
import { MOCK_ACTIVITY_LOG } from '../utils/constants';

export default function CyberNestDashboard() {
  const navigate = useNavigate();
  const [liveActivityLines, setLiveActivityLines] = useState(MOCK_ACTIVITY_LOG);
  const [connectionPulse, setConnectionPulse] = useState(true);

  // --- LOGIC: Simulate live activity updates ---
  useEffect(() => {
    const interval = setInterval(() => {
      const events = [
        '2024-01-15 14:34:01 - Device Pixel-6Pro-042 policy enforced',
        '2024-01-15 14:34:22 - Offline: Galaxy-S10-089',
        '2024-01-15 14:34:45 - Sync request from iPad-Air-M1-007',
        '2024-01-15 14:35:03 - Location update received',
        '2024-01-15 14:35:28 - Config push successful - 45/50 devices',
        '2024-01-15 14:36:15 - New device enrolled: iPhone-14-Pro-101',
        '2024-01-15 14:37:42 - Policy violation detected on SM-A725F-015',
      ];
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      setLiveActivityLines((prev) => [...prev.slice(-8), randomEvent]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // --- LOGIC: Simulate connection pulse ---
  useEffect(() => {
    const pulse = setInterval(() => {
      setConnectionPulse((prev) => !prev);
    }, 2000);
    return () => clearInterval(pulse);
  }, []);

  const stats = [
    {
      label: 'Total Enrolled',
      value: '50',
      icon: Smartphone,
      trend: '+2',
      trendLabel: 'this week',
      color: 'text-[#22d3ee]',
      bgColor: 'bg-cyan-900/20',
      borderColor: 'border-cyan-800/50',
    },
    {
      label: 'Active Now',
      value: '47',
      icon: CheckCircle2,
      trend: '+3',
      trendLabel: 'last 24h',
      color: 'text-[#10b981]',
      bgColor: 'bg-emerald-900/20',
      borderColor: 'border-emerald-800/50',
    },
    {
      label: 'Offline',
      value: '3',
      icon: XCircle,
      trend: '0',
      trendLabel: 'change',
      color: 'text-[#ef4444]',
      bgColor: 'bg-red-900/20',
      borderColor: 'border-red-800/50',
    },
    {
      label: 'Policy Violations',
      value: '2',
      icon: AlertTriangle,
      trend: '1',
      trendLabel: 'new',
      color: 'text-[#f59e0b]',
      bgColor: 'bg-amber-900/20',
      borderColor: 'border-amber-800/50',
    },
  ];

  const recentAlerts = [
    {
      id: 1,
      type: 'offline',
      title: 'Device Offline',
      description: 'SM-A725F-023 has been offline for 2 hours',
      timestamp: '2 hours ago',
      icon: XCircle,
      color: 'text-red-400',
      borderColor: 'border-red-900/50',
    },
    {
      id: 2,
      type: 'battery',
      title: 'Low Battery',
      description: 'iPad-Gen7-015 battery at 12% - Please charge device',
      timestamp: '15 mins ago',
      icon: AlertTriangle,
      color: 'text-yellow-400',
      borderColor: 'border-yellow-900/50',
    },
    {
      id: 3,
      type: 'sync',
      title: 'Policy Sync Complete',
      description: 'Successfully synced policies to 47/50 devices',
      timestamp: '5 mins ago',
      icon: Activity,
      color: 'text-cyan-400',
      borderColor: 'border-cyan-900/50',
    },
  ];

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity, path: '/' },
    { id: 'devices', label: 'Devices', icon: Smartphone, path: '/devices' },
    { id: 'commands', label: 'Commands', icon: AlertTriangle, path: '/commands' },
    { id: 'policies', label: 'Policies', icon: Shield, path: '/policies' },
  ];

  return (
    <div className="min-h-screen bg-[#020617]">
      {/* Background Grid Layer */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(51, 65, 85, 0.1) 25%, rgba(51, 65, 85, 0.1) 26%, transparent 27%, transparent 74%, rgba(51, 65, 85, 0.1) 75%, rgba(51, 65, 85, 0.1) 76%, transparent 77%, transparent),
                              linear-gradient(90deg, transparent 24%, rgba(51, 65, 85, 0.1) 25%, rgba(51, 65, 85, 0.1) 26%, transparent 27%, transparent 74%, rgba(51, 65, 85, 0.1) 75%, rgba(51, 65, 85, 0.1) 76%, transparent 77%, transparent)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="flex-1 relative z-10 p-8 min-w-0">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-50 mb-2">Dashboard</h1>
          <p className="text-sm text-slate-400">Real-time device management overview</p>
        </div>

        {/* Stats Cards - Grid stays 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className={`relative overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)] hover:-translate-y-1 ${stat.borderColor} ${stat.bgColor} backdrop-blur-md p-6`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
                      {stat.label}
                    </p>
                    <h2 className={`text-4xl font-bold text-slate-50 ${stat.color}`}>
                      {stat.value}
                    </h2>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color} opacity-80`} />
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <TrendingUp className={`w-3 h-3 ${stat.color}`} />
                  <span className={stat.color}>
                    {stat.trend === '0' ? 'No change' : `+${stat.trend}`} {stat.trendLabel}
                  </span>
                </div>

                <div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r"
                  style={{
                    backgroundImage: `linear-gradient(90deg, ${
                      stat.color.includes('cyan')
                        ? '#22d3ee'
                        : stat.color.includes('emerald')
                        ? '#10b981'
                        : stat.color.includes('red')
                        ? '#ef4444'
                        : '#f59e0b'
                    }, transparent)`,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* --- STACKED SECTIONS (Vertical Layout) --- */}
        <div className="flex flex-col gap-8">
          
          {/* 1. LIVE ACTIVITY TERMINAL (TOP - FULL WIDTH) */}
          <div className="w-full">
            <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 backdrop-blur-md overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.3)]">
              {/* Terminal Header */}
              <div className="px-6 py-4 border-b border-slate-800/50 bg-slate-900/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <h3 className="text-sm font-semibold text-slate-50 tracking-widest uppercase">
                    Live Activity Terminal
                  </h3>
                  <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20">
                    REAL-TIME
                  </span>
                </div>
                {/* Connection Status */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full bg-emerald-400 transition-all ${
                      connectionPulse ? 'shadow-[0_0_10px_#10b981]' : ''
                    }`}
                  />
                  <span className="text-xs text-slate-400 font-mono">System: Connected</span>
                </div>
              </div>

              {/* Terminal Content */}
              <div className="p-6 font-mono text-sm space-y-2 h-80 overflow-y-auto bg-black/40">
                {liveActivityLines.map((line, idx) => {
                  const isAlert =
                    line.includes('alert') ||
                    line.includes('Alert') ||
                    line.includes('violation') ||
                    line.includes('offline');
                  const isSuccess = line.includes('successful') || line.includes('Complete');

                  return (
                    <div
                      key={idx}
                      className={`transition-all duration-200 hover:bg-slate-800/20 px-2 py-1 rounded flex items-start gap-3 ${
                        isAlert
                          ? 'text-red-400 bg-red-400/5'
                          : isSuccess
                          ? 'text-emerald-400 bg-emerald-400/5'
                          : 'text-slate-400'
                      }`}
                    >
                      <span className="text-slate-600 shrink-0 font-bold">❯</span> 
                      <span>{line}</span>
                    </div>
                  );
                })}
              </div>

              {/* Terminal Footer */}
              <div className="px-6 py-2 border-t border-slate-800/50 bg-slate-900/30 text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                Showing {liveActivityLines.length} latest events
              </div>
            </div>
          </div>

          {/* 2. RECENT EVENTS (BELOW TERMINAL - FULL WIDTH) */}
          <div className="w-full">
            <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 backdrop-blur-md overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.3)]">
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-800/50 bg-slate-900/50 flex items-center gap-3">
                <Clock className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-slate-50">Critical Incident History</h3>
              </div>

              {/* Events Grid (3 columns on desktop) */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentAlerts.map((alert) => {
                  const AlertIcon = alert.icon;
                  return (
                    <div
                      key={alert.id}
                      className={`p-5 rounded-lg border transition-all duration-300 hover:border-slate-500 ${alert.borderColor} bg-slate-800/20`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg bg-slate-900/50 border ${alert.borderColor}`}>
                           <AlertIcon className={`w-5 h-5 flex-shrink-0 ${alert.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-bold ${alert.color}`}>
                            {alert.title}
                          </p>
                          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                            {alert.description}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-800/50 flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {alert.timestamp}
                        </span>
                        <span className="text-[10px] font-mono text-slate-600 uppercase tracking-tighter">ID: #{alert.id}092</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-800/50 bg-slate-900/30">
                <button 
                  onClick={() => navigate('/commands')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-bold tracking-wide uppercase flex items-center gap-2"
                >
                  Explore Activity Logs <TrendingUp className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* 3. ACTIVITY SUMMARY GRAPH (BOTTOM) */}
          <div className="w-full rounded-xl border border-slate-800/50 bg-slate-900/30 backdrop-blur-md p-6 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-sm font-semibold text-slate-50 flex items-center gap-2">
                 <Activity className="w-4 h-4 text-cyan-400" />
                 Global Connectivity Analytics
               </h3>
               <span className="text-[10px] text-slate-500 font-mono">Interval: 24h</span>
            </div>

            <div className="h-48 rounded-xl bg-black/40 border border-slate-800/50 flex items-center justify-center relative overflow-hidden group">
               {/* Visual placeholder decorative lines */}
               <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                  <div className="h-full w-full" style={{ backgroundImage: 'linear-gradient(90deg, #1e293b 1px, transparent 1px), linear-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
               </div>
               
               <div className="text-center relative z-10">
                <Wifi className="w-12 h-12 text-slate-700 mx-auto mb-3 animate-pulse" />
                <p className="text-sm text-slate-400 font-medium tracking-wide">Infrastructure Load Graph</p>
                <p className="text-[10px] text-slate-600 mt-1 uppercase tracking-widest">Real-time data visualization offline</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}