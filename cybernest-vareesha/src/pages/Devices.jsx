import React, { useState, useMemo } from 'react';
import {
  Search, Smartphone, ChevronDown, 
  Signal, Plus, X, QrCode, Lock, RefreshCw,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Devices() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [selectedDevices, setSelectedDevices] = useState(new Set());
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);

  const allDevices = [
    { id: 'SM-A725F-001', model: 'Samsung Galaxy A72', owner: 'John Doe', battery: 85, status: 'online', lastSeen: '2 mins ago', group: 'Staff Devices' },
    { id: 'iPad-Gen7-002', model: 'iPad (7th Gen)', owner: 'Jane Smith', battery: 12, status: 'online', lastSeen: '1 min ago', group: 'Kiosk Devices' },
    { id: 'Pixel-6Pro-003', model: 'Google Pixel 6 Pro', owner: 'Mike Johnson', battery: 45, status: 'online', lastSeen: '5 mins ago', group: 'Staff Devices' },
    { id: 'iPhone-14-004', model: 'iPhone 14 Pro', owner: 'Sarah Williams', battery: 92, status: 'offline', lastSeen: '45 mins ago', group: 'Staff Devices' },
    { id: 'Galaxy-S23-005', model: 'Samsung Galaxy S23', owner: 'David Brown', battery: 67, status: 'online', lastSeen: '3 mins ago', group: 'Kiosk Devices' },
  ];

  const groups = ['Staff Devices', 'Kiosk Devices'];

  const filteredDevices = useMemo(() => {
    let filtered = allDevices.filter((device) => {
      const matchesSearch = 
        device.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.owner.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || device.status === statusFilter;
      const matchesGroup = groupFilter === 'all' || device.group === groupFilter;
      return matchesSearch && matchesStatus && matchesGroup;
    });

    if (sortBy === 'battery') filtered.sort((a, b) => b.battery - a.battery);
    else if (sortBy === 'status') {
      filtered.sort((a, b) => {
        if (a.status === 'online' && b.status === 'offline') return -1;
        if (a.status === 'offline' && b.status === 'online') return 1;
        return 0;
      });
    } else filtered.sort((a, b) => a.model.localeCompare(b.model));

    return filtered;
  }, [searchTerm, statusFilter, groupFilter, sortBy]);

  const toggleDeviceSelection = (deviceId) => {
    const newSelected = new Set(selectedDevices);
    if (newSelected.has(deviceId)) newSelected.delete(deviceId);
    else newSelected.add(deviceId);
    setSelectedDevices(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const toggleAllDevices = () => {
    if (selectedDevices.size === filteredDevices.length) {
      setSelectedDevices(new Set());
      setShowBulkActions(false);
    } else {
      setSelectedDevices(new Set(filteredDevices.map(d => d.id)));
      setShowBulkActions(true);
    }
  };

  const handleBulkAction = (action) => {
    alert(`Executing ${action} on ${selectedDevices.size} devices`);
    setSelectedDevices(new Set());
    setShowBulkActions(false);
  };

  const getBatteryColor = (battery) => {
    if (battery > 60) return 'bg-emerald-600';
    if (battery > 30) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const getStatusBadge = (status) => {
    if (status === 'online') {
      return (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="text-xs font-medium text-emerald-400">Online</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-slate-500"></div>
        <span className="text-xs font-medium text-slate-400">Offline</span>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full w-full">
      {/* TOP BAR */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-slate-50">Device Fleet</h2>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowEnrollModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium text-sm transition-all duration-200 shadow-lg shadow-cyan-500/30"
            >
              <Plus className="w-4 h-4" />
              <span>Enroll Device</span>
            </button>
          </div>
        </div>
      </div>

      {/* PAGE CONTENT */}
      <div className="flex-1 p-8">
        {/* FILTERS */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search devices, models, owners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-50 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>
            <div className="relative">
              <select value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)} className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-50 focus:outline-none focus:border-cyan-400 appearance-none cursor-pointer">
                <option value="all">All Groups</option>
                {groups.map(group => <option key={group} value={group}>{group}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
            <div className="relative">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-50 focus:outline-none focus:border-cyan-400 appearance-none cursor-pointer">
                <option value="all">All Status</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
            <div className="relative">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-50 focus:outline-none focus:border-cyan-400 appearance-none cursor-pointer">
                <option value="name">Sort: Model</option>
                <option value="battery">Sort: Battery</option>
                <option value="status">Sort: Status</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Showing {filteredDevices.length} of {allDevices.length} devices
              {selectedDevices.size > 0 && ` • ${selectedDevices.size} selected`}
            </p>
            {showBulkActions && (
              <div className="flex items-center gap-3 px-4 py-2 bg-cyan-900/30 border border-cyan-800 rounded-lg">
                <span className="text-xs font-medium text-cyan-400">{selectedDevices.size} selected</span>
                <div className="w-px h-4 bg-slate-700"></div>
                <div className="flex gap-2">
                  <button onClick={() => handleBulkAction('Bulk Lock')} className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition-colors">
                    <Lock className="w-3 h-3" /> Bulk Lock
                  </button>
                  <button onClick={() => handleBulkAction('Bulk Sync')} className="flex items-center gap-1 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-xs font-medium transition-colors">
                    <RefreshCw className="w-3 h-3" /> Bulk Sync
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-4 text-left">
                    <input type="checkbox" checked={selectedDevices.size === filteredDevices.length && filteredDevices.length > 0} onChange={toggleAllDevices} className="w-4 h-4 rounded border-slate-700 bg-slate-800 accent-cyan-600 cursor-pointer"/>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Device ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Model</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Owner</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Battery</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredDevices.map((device) => (
                  <tr key={device.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-4">
                      <input type="checkbox" checked={selectedDevices.has(device.id)} onChange={() => toggleDeviceSelection(device.id)} className="w-4 h-4 rounded border-slate-700 bg-slate-800 accent-cyan-600 cursor-pointer"/>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => navigate(`/device/${device.id}`)} className="text-sm font-mono text-cyan-400 hover:text-cyan-300 underline underline-offset-2">
                        {device.id}
                      </button>
                    </td>
                    <td className="px-6 py-4"><span className="text-sm text-slate-300">{device.model}</span></td>
                    <td className="px-6 py-4"><span className="text-sm text-slate-400">{device.owner}</span></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-16 bg-slate-700 rounded-full overflow-hidden">
                          <div className={`h-full ${getBatteryColor(device.battery)} rounded-full`} style={{ width: `${device.battery}%` }}></div>
                        </div>
                        <span className="text-xs text-slate-400 font-mono">{device.battery}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(device.status)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => navigate(`/device/${device.id}`)} className="p-2 hover:bg-slate-700 rounded transition-colors" title="View Details">
                          <Signal className="w-4 h-4 text-slate-400 hover:text-cyan-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredDevices.length === 0 && (
            <div className="p-8 text-center">
              <Smartphone className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400 font-medium">No devices found</p>
            </div>
          )}
        </div>
      </div>

      {/* ENROLLMENT MODAL */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-50">Enroll New Device</h2>
                <p className="text-sm text-slate-500 mt-1">Add a device to your MDM fleet</p>
              </div>
              <button onClick={() => setShowEnrollModal(false)} className="p-2 hover:bg-slate-800 rounded">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col items-center">
                <p className="text-sm font-semibold text-slate-50 mb-4">Step 1: Scan QR Code</p>
                <div className="w-64 h-64 bg-slate-800 border-2 border-slate-700 rounded-lg flex items-center justify-center mb-4">
                  <QrCode className="w-24 h-24 text-slate-600" />
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-semibold text-slate-50 mb-4">Step 2: Manual Entry</p>
                  <input
                    type="text"
                    placeholder="Enter Device ID"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  <button className="w-full mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors">
                    Enroll Device
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}