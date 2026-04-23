// src/pages/cybernest-dashboard.jsx

import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Activity,
  XCircle,
  TrendingUp,
  Clock,
  Wifi,
} from 'lucide-react';
import { MOCK_ACTIVITY_LOG, COLORS } from '../utils/constants';

export default function CyberNestDashboard() {
  const [liveActivityLines, setLiveActivityLines] = useState(MOCK_ACTIVITY_LOG);
  const [connectionPulse, setConnectionPulse] = useState(true);

  // Simulate live activity updates
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

  // Simulate connection pulse
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

  return (
    <main className="min-h-screen bg-[#020617]">
      {/* Background Grid */}
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

      {/* Content */}
      <div className="relative p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-50 mb-2">Dashboard</h1>
          <p className="text-sm text-slate-400">Real-time device management overview</p>
        </div>

        {/* Stats Cards - 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className={`relative overflow-hidden rounded-lg border transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)] hover:-translate-y-1 ${stat.borderColor} ${stat.bgColor}`}
                style={{
                  backgroundColor: stat.bgColor,
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div className="p-6">
                  {/* Card Header */}
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

                  {/* Trend Indicator */}
                  <div className="flex items-center gap-2 text-xs">
                    <TrendingUp className={`w-3 h-3 ${stat.color}`} />
                    <span className={stat.color}>
                      {stat.trend === '0' ? 'No change' : `+${stat.trend}`} {stat.trendLabel}
                    </span>
                  </div>
                </div>

                {/* Bottom accent line */}
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Activity Terminal - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-slate-800/50 bg-slate-900/30 backdrop-blur-md overflow-hidden shadow-[0_0_20px_rgba(34,211,238,0.05)]">
              {/* Terminal Header */}
              <div className="px-6 py-4 border-b border-slate-800/50 bg-slate-900/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <h3 className="text-sm font-semibold text-slate-50 tracking-wide">
                    LIVE ACTIVITY TERMINAL
                  </h3>
                  <span className="text-xs text-slate-500 ml-2">[ REAL-TIME ]</span>
                </div>
                {/* Connection Status */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full bg-emerald-400 transition-all ${
                      connectionPulse ? 'shadow-[0_0_8px_rgba(16,185,129,0.6)]' : ''
                    }`}
                  />
                  <span className="text-xs text-slate-400 font-mono">Connected</span>
                </div>
              </div>

              {/* Terminal Content */}
              <div className="p-6 font-mono text-sm space-y-2 h-72 overflow-y-auto bg-black/20">
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
                      className={`transition-all duration-200 hover:bg-slate-800/20 px-2 py-1 rounded ${
                        isAlert
                          ? 'text-red-400'
                          : isSuccess
                          ? 'text-emerald-400'
                          : 'text-slate-400'
                      }`}
                    >
                      <span className="text-slate-600">&gt;</span> {line}
                    </div>
                  );
                })}
              </div>

              {/* Terminal Footer */}
              <div className="px-6 py-2 border-t border-slate-800/50 bg-slate-900/30 text-xs text-slate-500">
                Displaying {liveActivityLines.length} of last 24 hours activity
              </div>
            </div>
          </div>

          {/* Recent Events Sidebar - 1 column */}
          <div>
            <div className="rounded-lg border border-slate-800/50 bg-slate-900/30 backdrop-blur-md overflow-hidden shadow-[0_0_20px_rgba(34,211,238,0.05)]">
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-800/50 bg-slate-900/50 flex items-center gap-3">
                <Clock className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-slate-50">Recent Events</h3>
              </div>

              {/* Events List */}
              <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                {recentAlerts.map((alert) => {
                  const AlertIcon = alert.icon;
                  return (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-lg border transition-all duration-200 hover:bg-slate-800/20 ${alert.borderColor} bg-slate-800/20`}
                    >
                      <div className="flex items-start gap-3">
                        <AlertIcon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${alert.color}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${alert.color}`}>
                            {alert.title}
                          </p>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                            {alert.description}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 mt-2 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {alert.timestamp}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="px-6 py-3 border-t border-slate-800/50 bg-slate-900/30">
                <button className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                  View All Events →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Summary Section */}
        <div className="mt-8 rounded-lg border border-slate-800/50 bg-slate-900/30 backdrop-blur-md p-6 shadow-[0_0_20px_rgba(34,211,238,0.05)]">
          <h3 className="text-sm font-semibold text-slate-50 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Device Activity Summary
          </h3>

          {/* Activity Graph Placeholder */}
          <div className="h-48 rounded-lg bg-slate-800/30 border border-slate-800/50 flex items-center justify-center">
            <div className="text-center">
              <Wifi className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-500">Activity Graph Placeholder</p>
              <p className="text-xs text-slate-600 mt-1">Real-time device connectivity visualization</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}