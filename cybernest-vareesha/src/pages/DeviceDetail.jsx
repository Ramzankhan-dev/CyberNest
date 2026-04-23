import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Smartphone, MapPin, Wifi, Battery, Settings2, Lock, 
  Power, RefreshCw, Camera, Package, Navigation, Shield, ChevronLeft
} from 'lucide-react';

export default function DeviceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [toggleStates, setToggleStates] = useState({
    disableCamera: false,
    blockAppInstall: false,
    forceLocation: true,
    disableBluetooth: false,
    blockUSBDebug: true,
    restrictDownloads: false,
  });

  const device = {
    id: id || 'SM-A725F-001',
    model: 'Samsung Galaxy A72',
    owner: 'John Doe',
    osVersion: 'Android 13',
    ipAddress: '192.168.1.45',
    battery: 85,
    storageUsed: 92,
    storage: 128,
    status: 'online',
    locationName: 'New York, USA',
  };

  const togglePolicy = (policy) => {
    setToggleStates((prev) => ({
      ...prev,
      [policy]: !prev[policy],
    }));
  };

  const policyItems = [
    { id: 'disableCamera', label: 'Disable Camera', description: 'Prevent device camera access', icon: Camera },
    { id: 'blockAppInstall', label: 'Block App Installs', description: 'Prevent installation of new applications', icon: Package },
    { id: 'forceLocation', label: 'Force Location Tracking', description: 'Continuously track device location', icon: Navigation },
    { id: 'disableBluetooth', label: 'Disable Bluetooth', description: 'Disable Bluetooth connectivity', icon: Wifi },
    { id: 'blockUSBDebug', label: 'Block USB Debugging', description: 'Prevent USB debugging access', icon: Settings2 },
  ];

  return (
    <div className="flex-1 p-8 w-full">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/devices')} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-50 flex items-center gap-3">
            {device.model}
            <span className="px-3 py-1 bg-emerald-900/30 text-emerald-400 border border-emerald-800 rounded-full text-xs font-medium">
              {device.status.toUpperCase()}
            </span>
          </h1>
          <p className="text-sm text-slate-400 font-mono mt-1">ID: {device.id} | Assigned to: {device.owner}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Device Stats Card */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm shadow-lg">
          <h2 className="text-lg font-semibold text-slate-50 flex items-center gap-2 mb-6">
            <Smartphone className="w-5 h-5 text-cyan-400" />
            Device Specifications
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-slate-500 mb-1">OS Version</p>
              <p className="text-sm font-medium text-slate-200">{device.osVersion}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">IP Address</p>
              <p className="text-sm font-medium text-slate-200 font-mono">{device.ipAddress}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Location</p>
              <p className="text-sm font-medium text-slate-200 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-cyan-500" /> {device.locationName}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Battery</p>
              <div className="flex items-center gap-2">
                <Battery className={`w-4 h-4 ${device.battery > 50 ? 'text-emerald-400' : 'text-yellow-400'}`} />
                <span className="text-sm font-medium text-slate-200">{device.battery}%</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Storage Usage</p>
              <p className="text-sm font-medium text-slate-200">{device.storageUsed} GB / {device.storage} GB</p>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm shadow-lg">
          <h2 className="text-lg font-semibold text-slate-50 mb-6">Quick Commands</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm transition-colors border border-slate-700">
              <Lock className="w-4 h-4 text-cyan-400" /> Lock Device
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm transition-colors border border-slate-700">
              <RefreshCw className="w-4 h-4 text-cyan-400" /> Sync Data
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded-lg text-sm transition-colors border border-red-900/50 mt-4">
              <Power className="w-4 h-4" /> Remote Wipe
            </button>
          </div>
        </div>

        {/* Security Policies */}
        <div className="lg:col-span-3 bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm shadow-lg mt-2">
          <h2 className="text-lg font-semibold text-slate-50 flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-cyan-400" />
            Active Policies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {policyItems.map((item) => {
              const Icon = item.icon;
              const isEnabled = toggleStates[item.id];
              return (
                <div key={item.id} className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-md ${isEnabled ? 'bg-cyan-900/50 text-cyan-400' : 'bg-slate-800 text-slate-500'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => togglePolicy(item.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isEnabled ? 'bg-cyan-500' : 'bg-slate-600'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}