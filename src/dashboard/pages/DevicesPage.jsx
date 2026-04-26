import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Search, Smartphone, Eye, QrCode, BatteryLow, BatteryMedium, BatteryFull } from 'lucide-react';

import { C, S } from '../theme';
import { BASE_URL, authHeaders } from '../config';
import { PageHeader } from '../components/PageHeader';
import { Spinner } from '../components/Spinner';
import { StatusDot } from '../components/StatusDot';
import { QRModal } from '../components/QRModal'; // ✅ This is now correct - named export

export function DevicesPage({ onDeviceClick, toast }) {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedQR, setSelectedQR] = useState(null);

  const fetchDevices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/device/list`, { headers: authHeaders() });
      const data = await res.json();
      if (Array.isArray(data)) setDevices(data);
      else if (data.devices) setDevices(data.devices);
      else setDevices([]);
    } catch {
      toast('Could not fetch devices', 'error');
    } finally { setLoading(false); }
  }, [toast]);

  const syncDevices = async () => {
    setSyncing(true);
    try {
      await fetch(`${BASE_URL}/api/device/sync`, { headers: authHeaders() });
      toast('Devices synced!', 'success');
      await fetchDevices();
    } catch {
      await fetchDevices();
      toast('Device list refreshed', 'info');
    } finally { setSyncing(false); }
  };

  useEffect(() => { fetchDevices(); }, [fetchDevices]);

  const filtered = devices.filter(d => {
    const q = search.toLowerCase();
    const matchSearch = (
      (d.device_id || d.id || d.deviceId || '').toLowerCase().includes(q) ||
      (d.model || d.deviceModel || d.deviceName || '').toLowerCase().includes(q) ||
      (d.owner || d.userName || d.enrolledBy || '').toLowerCase().includes(q)
    );
    const status = d.status || d.enrollmentStatus || 'unknown';
    const matchStatus = statusFilter === 'all' || status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '2rem' }}>
      <PageHeader
        title="Device Fleet"
        subtitle={`${filtered.length} of ${devices.length} devices — qr_url from /api/device/list`}
        action={
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button style={S.btnSecondary} onClick={syncDevices} disabled={syncing}>
              {syncing ? <Spinner size={14} /> : <RefreshCw size={14} />}
              {syncing ? 'Syncing...' : 'Sync Devices'}
            </button>
          </div>
        }
      />

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search size={14} color={C.text500} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by device ID, model, owner..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...S.input, paddingLeft: '2.25rem' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.375rem', backgroundColor: C.bg900, border: `1px solid ${C.border800}`, borderRadius: '0.5rem', padding: '0.25rem' }}>
          {['all', 'online', 'enrolled', 'offline'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              style={{ padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: 'none', backgroundColor: statusFilter === s ? C.bg700 : 'transparent', color: statusFilter === s ? C.text50 : C.text400, fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ ...S.card, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: C.text500, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <Spinner size={32} />
            <p style={{ margin: 0, fontSize: '0.875rem' }}>Loading devices...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <Smartphone size={48} color={C.border700} style={{ margin: '0 auto 1rem', display: 'block' }} />
            <p style={{ color: C.text400, fontWeight: 500, margin: '0 0 0.5rem' }}>No devices found</p>
            <p style={{ color: C.text500, fontSize: '0.8rem', margin: '0 0 1.5rem' }}>
              {search || statusFilter !== 'all'
                ? 'No devices match your filter — try adjusting the search'
                : 'No enrolled devices yet — add devices via Headwind MDM backend'
              }
            </p>
            <button style={S.btnSecondary} onClick={fetchDevices}>
              <RefreshCw size={14} /> Refresh List
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'rgba(15,23,42,0.6)', borderBottom: `1px solid ${C.border800}` }}>
                  {['Device ID', 'Model', 'Owner', 'Status', 'Battery', 'Last Seen', 'QR', 'Actions'].map(h => (
                    <th key={h} style={S.tableHeader}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((d, i) => {
                  const id = d.device_id || d.id || d.deviceId || d._id || `DEV-${i}`;
                  const model = d.model || d.deviceModel || d.deviceName || 'Unknown Device';
                  const owner = d.owner || d.userName || d.enrolledBy || '—';
                  const status = d.status || d.enrollmentStatus || 'unknown';
                  const lastSeen = d.lastSeen || d.lastSync || d.updatedAt || '—';
                  const battery = d.battery ?? d.batteryLevel ?? null;
                  const hasQR = !!(d.qr_url || d.qrUrl || d.enrollmentUrl);
                  const isLast = i === filtered.length - 1;
                  const cellBorder = isLast ? 'none' : `1px solid ${C.border800}`;

                  return (
                    <tr
                      key={id}
                      style={{ transition: 'background 0.15s', cursor: 'default' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(30,41,59,0.4)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ ...S.tableCell, borderBottom: cellBorder }}>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: C.cyan400 }}>
                          {String(id).slice(0, 20)}
                        </span>
                      </td>
                      <td style={{ ...S.tableCell, borderBottom: cellBorder }}>
                        <span style={{ fontSize: '0.875rem', color: C.text300, fontWeight: 500 }}>{model}</span>
                      </td>
                      <td style={{ ...S.tableCell, fontSize: '0.875rem', color: C.text400, borderBottom: cellBorder }}>{owner}</td>
                      <td style={{ ...S.tableCell, borderBottom: cellBorder }}>
                        <StatusDot status={status} />
                      </td>
                      <td style={{ ...S.tableCell, borderBottom: cellBorder }}>
                        {battery !== null ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {battery < 20
                              ? <BatteryLow size={14} color={C.red400} />
                              : battery < 50
                              ? <BatteryMedium size={14} color={C.yellow400} />
                              : <BatteryFull size={14} color={C.emerald400} />}
                            <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: battery < 20 ? C.red400 : battery < 50 ? C.yellow400 : C.text300 }}>
                              {battery}%
                            </span>
                          </div>
                        ) : <span style={{ color: C.text600, fontSize: '0.8rem' }}>—</span>}
                      </td>
                      <td style={{ ...S.tableCell, fontFamily: 'monospace', fontSize: '0.75rem', color: C.text500, borderBottom: cellBorder }}>
                        {typeof lastSeen === 'string' ? lastSeen.slice(0, 16) : '—'}
                      </td>
                      <td style={{ ...S.tableCell, borderBottom: cellBorder }}>
                        <button
                          onClick={() => {
                            if (!hasQR) {
                              toast('No qr_url for this device — check backend response', 'error');
                            }
                            setSelectedQR(d);
                          }}
                          title={hasQR ? 'Show enrollment QR' : 'qr_url missing in this device record'}
                          style={{
                            padding: '0.375rem 0.625rem',
                            background: hasQR ? 'rgba(34,211,238,0.08)' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${hasQR ? 'rgba(34,211,238,0.25)' : C.border700}`,
                            borderRadius: '0.375rem', cursor: 'pointer',
                            color: hasQR ? C.cyan400 : C.text600,
                            fontSize: '0.75rem', fontFamily: 'inherit',
                            display: 'flex', alignItems: 'center', gap: 5,
                            transition: 'all 0.15s',
                          }}>
                          <QrCode size={12} /> QR
                        </button>
                      </td>
                      <td style={{ ...S.tableCell, borderBottom: cellBorder }}>
                        <button
                          onClick={() => onDeviceClick(d)}
                          style={{
                            padding: '0.375rem 0.75rem',
                            background: 'rgba(100,116,139,0.08)',
                            border: `1px solid ${C.border700}`,
                            borderRadius: '0.375rem', cursor: 'pointer',
                            color: C.text300, fontSize: '0.75rem', fontWeight: 500,
                            fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5,
                            transition: 'all 0.15s',
                          }}>
                          <Eye size={12} /> View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedQR && (
        <QRModal device={selectedQR} onClose={() => setSelectedQR(null)} />
      )}
    </div>
  );
}