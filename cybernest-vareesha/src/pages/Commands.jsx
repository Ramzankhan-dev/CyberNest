import React, { useState } from 'react';
import {
  AlertTriangle,
  Search,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Clock,
  Camera,
  Package,
  Navigation,
  Wifi,
  Settings2,
  Download,
} from 'lucide-react';

export default function CyberNestCommands() {
  const [activeTab, setActiveTab] = useState('audit');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const commandLog = [
    { id: 1, timestamp: '2024-01-15 14:45:32', device: 'SM-A725F-001', command: 'Force Lock Screen', status: 'success', executedBy: 'Admin User', result: 'Device locked successfully' },
    { id: 2, timestamp: '2024-01-15 14:35:18', device: 'iPad-Gen7-002', command: 'Sync Data', status: 'success', executedBy: 'Admin User', result: 'Data synchronized - 2.4 GB transferred' },
    { id: 3, timestamp: '2024-01-15 14:22:45', device: 'Pixel-6Pro-003', command: 'Policy Update', status: 'success', executedBy: 'System', result: '5 policies pushed, 3 enforced' },
    { id: 4, timestamp: '2024-01-15 14:15:12', device: 'iPhone-14-004', command: 'Wipe Device', status: 'pending', executedBy: 'Admin User', result: 'Awaiting device confirmation' },
    { id: 5, timestamp: '2024-01-15 14:08:33', device: 'Galaxy-S23-005', command: 'Reboot Device', status: 'success', executedBy: 'System', result: 'Device rebooted in 45 seconds' },
    { id: 6, timestamp: '2024-01-15 13:58:19', device: 'OnePlus-11-006', command: 'Camera Restriction', status: 'failed', executedBy: 'Admin User', result: 'Device offline - will retry when online' },
    { id: 7, timestamp: '2024-01-15 13:45:01', device: 'Moto-G52-007', command: 'Location Tracking', status: 'success', executedBy: 'System', result: 'Location tracking enabled' },
    { id: 8, timestamp: '2024-01-15 13:30:22', device: 'iPad-Air-008', command: 'App Installation Block', status: 'success', executedBy: 'Admin User', result: 'App store access blocked' },
    { id: 9, timestamp: '2024-01-15 13:15:45', device: 'Galaxy-Z-Fold-009', command: 'Bluetooth Disable', status: 'success', executedBy: 'System', result: 'Bluetooth disabled on device' },
    { id: 10, timestamp: '2024-01-15 13:00:33', device: 'iPhone-13-010', command: 'USB Debugging Block', status: 'success', executedBy: 'Admin User', result: 'USB debugging disabled' },
  ];

  const [globalPolicies, setGlobalPolicies] = useState([
    { id: 1, name: 'Disable Camera', description: 'Prevent device camera access across all devices', icon: Camera, enabled: false, deviceCount: 45, enforced: 42, category: 'Hardware' },
    { id: 2, name: 'Block App Installation', description: 'Prevent installation of new applications', icon: Package, enabled: true, deviceCount: 50, enforced: 48, category: 'Application' },
    { id: 3, name: 'Force Location Tracking', description: 'Continuously track device location (requires GPS)', icon: Navigation, enabled: true, deviceCount: 50, enforced: 47, category: 'Location' },
    { id: 4, name: 'Disable Bluetooth', description: 'Disable Bluetooth connectivity on all devices', icon: Wifi, enabled: false, deviceCount: 50, enforced: 0, category: 'Connectivity' },
    { id: 5, name: 'Block USB Debugging', description: 'Prevent USB debugging access to devices', icon: Settings2, enabled: true, deviceCount: 50, enforced: 50, category: 'Security' },
    { id: 6, name: 'Restrict Downloads', description: 'Limit file and app downloads to approved sources', icon: Download, enabled: false, deviceCount: 50, enforced: 0, category: 'Application' },
  ]);

  const togglePolicy = (policyId) => {
    setGlobalPolicies((prev) =>
      prev.map((policy) =>
        policy.id === policyId ? { ...policy, enabled: !policy.enabled } : policy
      )
    );
  };

  const filteredCommands = commandLog.filter((cmd) => {
    const matchesSearch = cmd.device.toLowerCase().includes(searchTerm.toLowerCase()) || cmd.command.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || cmd.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'success':
        return (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-400">Success</span>
          </div>
        );
      case 'failed':
        return (
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-400" />
            <span className="text-xs font-medium text-red-400">Failed</span>
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-medium text-yellow-400">Pending</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full w-full">
      {/* TOP BAR & TABS */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-slate-50">Commands & Policies</h2>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-8 flex gap-4">
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'audit'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Command Audit Log
          </button>
          <button
            onClick={() => setActiveTab('policies')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'policies'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Global Policies
          </button>
        </div>
      </div>

      {/* PAGE CONTENT */}
      <div className="flex-1 overflow-auto p-8">
        {/* AUDIT LOG TAB */}
        {activeTab === 'audit' && (
          <div>
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search device ID or command..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-50 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-50 focus:outline-none focus:border-cyan-400 transition-colors appearance-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                  <option value="pending">Pending</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </div>

            {/* Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-900/50 border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Timestamp</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Device</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Command</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Executed By</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Result</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-800">
                    {filteredCommands.map((cmd) => (
                      <tr key={cmd.id} className="hover:bg-slate-800/50 transition-colors duration-200 group">
                        <td className="px-6 py-4">
                          <span className="text-xs font-mono text-slate-500">{cmd.timestamp}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-mono text-cyan-400">{cmd.device}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-slate-300">{cmd.command}</span>
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(cmd.status)}</td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-400">{cmd.executedBy}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-500">{cmd.result}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredCommands.length === 0 && (
                <div className="p-8 text-center">
                  <AlertTriangle className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-400 font-medium">No commands found</p>
                  <p className="text-slate-500 text-sm mt-1">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* POLICIES TAB */}
        {activeTab === 'policies' && (
          <div>
            <h3 className="text-lg font-semibold text-slate-50 mb-6">
              Enforce Policies Across {globalPolicies.length} Devices
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {globalPolicies.map((policy) => {
                const Icon = policy.icon;

                return (
                  <div key={policy.id} className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <Icon className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-slate-50">{policy.name}</h4>
                          <p className="text-xs text-slate-500 mt-1">{policy.description}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => togglePolicy(policy.id)}
                        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                          policy.enabled ? 'bg-cyan-500' : 'bg-slate-600'
                        }`}
                      >
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${policy.enabled ? 'transform translate-x-5' : ''}`}></div>
                      </button>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-800">
                       <div className="flex justify-between items-center mb-2">
                         <span className="text-xs text-slate-500">Category: <span className="text-slate-400">{policy.category}</span></span>
                         <span className="text-xs text-slate-500">{policy.enforced}/{policy.deviceCount}</span>
                       </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${policy.enabled ? 'bg-cyan-500' : 'bg-slate-600'}`}
                          style={{ width: `${(policy.enforced / policy.deviceCount) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}