import React, { useState } from 'react';
import { ChevronLeft, Lock, RotateCw, Trash2, Camera, MapPin, Upload, Package, Navigation, Wifi, Settings2, Download } from 'lucide-react';
import { C, S } from '../theme';
import { BASE_URL, authHeaders } from '../config';
import { SectionCard } from '../components/SectionCard';
import { Toggle } from '../components/Toggle';
import { Spinner } from '../components/Spinner';
import { StatusDot } from '../components/StatusDot';

export function DeviceDetailPage({ device, onBack, toast }) {
  const [sending, setSending] = useState(null);
  const [toggleStates, setToggleStates] = useState({
    disableCamera: false, blockAppInstall: false, forceLocation: true,
    disableBluetooth: false, blockUSBDebug: true, restrictDownloads: false,
  });
  const [logs, setLogs] = useState([
    { time: new Date().toLocaleTimeString(), msg: 'Device detail view opened', level: 'info' },
    { time: new Date().toLocaleTimeString(), msg: 'Policy status loaded', level: 'ok' },
  ]);

  const addLog = (msg, level = 'info') => setLogs(p => [{ time: new Date().toLocaleTimeString(), msg, level }, ...p.slice(0, 19)]);

  // ✅ UPDATED: New API endpoint for sending commands
  const sendCommand = async (cmd, commandName) => {
    setSending(cmd);
    
    // Get device ID from device object
    const deviceId = device.device_id || device.id || device.deviceId || device._id;
    
    if (!deviceId) {
      toast('Device ID not found', 'error');
      setSending(null);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/command/send`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          device_id: deviceId,
          command: commandName  // 'lock', 'reboot', 'wipe', etc.
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast(`"${cmd}" command sent successfully!`, 'success');
        addLog(`Command "${cmd}" executed on device ${deviceId}`, 'ok');
      } else {
        toast(`Command failed: ${data.message || response.statusText}`, 'error');
        addLog(`Command "${cmd}" failed: ${data.message || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Command error:', error);
      toast(`Failed to send "${cmd}" command. Check network connection.`, 'error');
      addLog(`Command "${cmd}" failed: Network error`, 'error');
    } finally {
      setSending(null);
    }
  };

  const policyItems = [
    { id: 'disableCamera', label: 'Disable Camera', desc: 'Prevent device camera access', icon: Camera },
    { id: 'blockAppInstall', label: 'Block App Installs', desc: 'Prevent new app installations', icon: Package },
    { id: 'forceLocation', label: 'Force Location Tracking', desc: 'Continuously track device location', icon: Navigation },
    { id: 'disableBluetooth', label: 'Disable Bluetooth', desc: 'Disable Bluetooth connectivity', icon: Wifi },
    { id: 'blockUSBDebug', label: 'Block USB Debugging', desc: 'Prevent USB debugging access', icon: Settings2 },
    { id: 'restrictDownloads', label: 'Restrict Downloads', desc: 'Limit downloads to approved sources', icon: Download },
  ];

  // ✅ UPDATED: Command mapping with proper command names for the API
  const commands = [
    { label: 'Lock Screen', icon: Lock, color: C.cyan400, commandName: 'lock', cmd: 'Lock Screen' },
    { label: 'Reboot', icon: RotateCw, color: C.purple400, commandName: 'reboot', cmd: 'Reboot' },
    { label: 'Factory Reset', icon: Trash2, color: C.red400, commandName: 'wipe', cmd: 'Factory Reset' },
    { label: 'Screenshot', icon: Camera, color: C.emerald400, commandName: 'screenshot', cmd: 'Screenshot' },
    { label: 'Locate', icon: MapPin, color: C.yellow400, commandName: 'locate', cmd: 'Locate' },
    { label: 'Push Config', icon: Upload, color: C.cyan400, commandName: 'push_config', cmd: 'Push Config' },
  ];

  const id = device?.device_id || device?.id || device?.deviceId || device?._id || '—';
  const model = device?.model || device?.deviceModel || device?.deviceName || 'Unknown';
  const owner = device?.owner || device?.userName || '—';
  const status = device?.status || device?.enrollmentStatus || 'unknown';
  const battery = device?.battery || device?.batteryLevel || null;
  const os = device?.os || device?.osVersion || '—';
  const ip = device?.ip || device?.ipAddress || '—';
  const lastSeen = device?.lastSeen || device?.lastSync || '—';

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
        <button onClick={onBack} style={{ ...S.btnSecondary, padding: '0.5rem 0.875rem' }}>
          <ChevronLeft size={14} /> Back
        </button>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: C.text50, margin: '0 0 0.2rem' }}>{model}</h3>
          <p style={{ fontSize: '0.72rem', color: C.text500, margin: 0, fontFamily: 'monospace' }}>ID: {String(id).slice(0, 24)}</p>
        </div>
        <div style={{ marginLeft: 'auto' }}><StatusDot status={status} /></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
        {/* Device Info */}
        <SectionCard>
          <p style={{ fontSize: '0.68rem', color: C.text500, margin: '0 0 1.25rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Device Information</p>
          {[
            ['Model', model], ['Owner', owner], ['OS Version', os],
            ['IP Address', ip], ['Last Seen', typeof lastSeen === 'string' ? lastSeen.slice(0, 16) : lastSeen],
            ['Device ID', id],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.625rem 0', borderBottom: `1px solid ${C.border800}50` }}>
              <span style={{ fontSize: '0.78rem', color: C.text500 }}>{k}</span>
              <span style={{ fontSize: '0.78rem', color: C.text300, fontFamily: 'monospace', fontWeight: 500 }}>{v || '—'}</span>
            </div>
          ))}
          {battery !== null && (
            <div style={{ marginTop: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', color: C.text500 }}>Battery</span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: battery < 20 ? C.red400 : battery < 50 ? C.yellow400 : C.emerald400 }}>{battery}%</span>
              </div>
              <div style={{ height: 6, backgroundColor: C.bg700, borderRadius: 9999, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${battery}%`, backgroundColor: battery < 20 ? C.red500 : battery < 50 ? C.yellow500 : C.emerald500, borderRadius: 9999, transition: 'width 0.5s ease' }} />
              </div>
            </div>
          )}
        </SectionCard>

        {/* Commands */}
        <SectionCard>
          <p style={{ fontSize: '0.68rem', color: C.text500, margin: '0 0 1.25rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Remote Commands</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.625rem' }}>
            {commands.map(({ label, icon: Icon, color, commandName, cmd }) => (
              <button 
                key={cmd} 
                onClick={() => sendCommand(cmd, commandName)} 
                disabled={!!sending}
                style={{ 
                  padding: '0.875rem 0.5rem', 
                  borderRadius: '0.5rem', 
                  border: `1px solid ${sending === cmd ? color + '60' : C.border700}`, 
                  backgroundColor: sending === cmd ? `${color}10` : C.bg800, 
                  cursor: sending ? 'not-allowed' : 'pointer', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  transition: 'all 0.2s', 
                  fontFamily: 'inherit', 
                  opacity: sending && sending !== cmd ? 0.6 : 1 
                }}
                onMouseEnter={e => { 
                  if (!sending) { 
                    e.currentTarget.style.borderColor = color; 
                    e.currentTarget.style.transform = 'translateY(-2px)'; 
                  } 
                }}
                onMouseLeave={e => { 
                  e.currentTarget.style.borderColor = C.border700; 
                  e.currentTarget.style.transform = ''; 
                }}>
                {sending === cmd ? <Spinner size={18} color={color} /> : <Icon size={18} color={color} />}
                <span style={{ fontSize: '0.7rem', color: sending === cmd ? color : C.text400, fontWeight: 500 }}>{label}</span>
              </button>
            ))}
          </div>
          {sending && (
            <div style={{ marginTop: '0.875rem', padding: '0.625rem 0.875rem', background: `${C.cyan400}08`, border: `1px solid ${C.cyan400}20`, borderRadius: '0.5rem', fontSize: '0.75rem', color: C.cyan400, fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Spinner size={12} /> Sending "{sending}" command to device...
            </div>
          )}
        </SectionCard>
      </div>

      {/* Policies */}
      <SectionCard style={{ marginBottom: '1.25rem' }}>
        <p style={{ fontSize: '0.68rem', color: C.text500, margin: '0 0 1.25rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Device Policies</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0.875rem' }}>
          {policyItems.map(({ id: pid, label, desc, icon: Icon }) => (
            <div key={pid} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', backgroundColor: C.bg800, borderRadius: '0.5rem', border: `1px solid ${C.border700}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Icon size={16} color={toggleStates[pid] ? C.cyan400 : C.text600} />
                <div>
                  <p style={{ fontSize: '0.8rem', fontWeight: 500, color: C.text300, margin: '0 0 0.15rem' }}>{label}</p>
                  <p style={{ fontSize: '0.7rem', color: C.text500, margin: 0 }}>{desc}</p>
                </div>
              </div>
              <Toggle 
                value={toggleStates[pid]} 
                onChange={v => { 
                  setToggleStates(p => ({ ...p, [pid]: v })); 
                  toast(`${label} ${v ? 'enabled' : 'disabled'}`, 'info'); 
                  addLog(`Policy "${label}" ${v ? 'enabled' : 'disabled'}`, v ? 'ok' : 'warn'); 
                }} 
              />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Event Log */}
      <SectionCard>
        <p style={{ fontSize: '0.68rem', color: C.text500, margin: '0 0 1rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Event Log</p>
        <div style={{ maxHeight: 200, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {logs.map((log, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.75rem', padding: '0.35rem 0', borderBottom: `1px solid ${C.border800}40`, fontFamily: 'monospace', fontSize: '0.75rem', animation: 'cn-fade-in 0.2s ease' }}>
              <span style={{ color: C.text600, flexShrink: 0 }}>{log.time}</span>
              <span style={{ color: log.level === 'ok' ? C.emerald400 : log.level === 'error' ? C.red400 : log.level === 'warn' ? C.yellow400 : C.text400 }}>{log.msg}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}