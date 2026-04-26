import React, { useState, useEffect } from 'react';
import { QrCode, X, Copy, CheckCircle2, AlertTriangle } from 'lucide-react';
import { C, S } from '../theme';

export function QRModal({ device, onClose }) {
  const qrUrl = device.qr_url || device.qrUrl || device.enrollmentUrl || null;
  const deviceId = device.device_id || device.id || device.deviceId || device._id || 'Device';
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    if (!qrUrl) return;
    navigator.clipboard.writeText(qrUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(2,8,23,0.9)',
        backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 60, padding: '1rem',
      }}
    >
      <div style={{
        backgroundColor: C.bg900,
        border: `1px solid ${C.border700}`,
        borderRadius: '1rem',
        width: '100%', maxWidth: 460,
        boxShadow: '0 40px 80px rgba(0,0,0,0.7)',
        animation: 'cn-fade-in 0.2s ease',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '1.125rem 1.5rem',
          borderBottom: `1px solid ${C.border800}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '0.5rem', background: 'rgba(34,211,238,0.1)', border: `1px solid rgba(34,211,238,0.2)` }}>
              <QrCode size={16} color={C.cyan400} />
            </div>
            <div>
              <p style={{ fontSize: '0.9rem', fontWeight: 700, color: C.text50, margin: 0 }}>Device Enrollment QR</p>
              <p style={{ fontSize: '0.7rem', color: C.text500, margin: 0, fontFamily: 'monospace' }}>{String(deviceId).slice(0, 28)}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ padding: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: C.text500, borderRadius: '0.5rem', display: 'flex', alignItems: 'center' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {qrUrl ? (
            <>
              <div style={{
                borderRadius: '0.75rem',
                overflow: 'hidden',
                border: `1px solid ${C.border700}`,
                background: '#fff',
                marginBottom: '1.25rem',
                position: 'relative',
              }}>
                <iframe
                  src={qrUrl}
                  title="Device QR Code"
                  width="100%"
                  height="380"
                  style={{ display: 'block', border: 'none' }}
                  sandbox="allow-scripts allow-same-origin allow-popups"
                />
                <div style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none',
                  borderRadius: '0.75rem',
                  boxShadow: 'inset 0 0 0 1px rgba(34,211,238,0.15)',
                }} />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <p style={{ fontSize: '0.68rem', color: C.text500, margin: '0 0 0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                  Enrollment URL
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={qrUrl}
                    readOnly
                    style={{ ...S.input, fontFamily: 'monospace', fontSize: '0.72rem', color: C.cyan400 }}
                  />
                  <button
                    onClick={copyLink}
                    style={{
                      padding: '0.625rem 0.875rem',
                      backgroundColor: copied ? 'rgba(6,78,59,0.5)' : C.bg800,
                      border: `1px solid ${copied ? C.emerald600 : C.border700}`,
                      borderRadius: '0.5rem', cursor: 'pointer',
                      color: copied ? C.emerald400 : C.text400,
                      transition: 'all 0.2s', display: 'flex', alignItems: 'center', flexShrink: 0,
                    }}
                  >
                    {copied ? <CheckCircle2 size={15} /> : <Copy size={15} />}
                  </button>
                </div>
              </div>

              <div style={{
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(34,211,238,0.05)',
                border: `1px solid rgba(34,211,238,0.15)`,
                borderRadius: '0.625rem',
                marginBottom: '1.25rem',
              }}>
                <p style={{ fontSize: '0.72rem', color: C.cyan400, margin: '0 0 0.375rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                  ℹ HOW TO ENROLL
                </p>
                {[
                  'Open camera on the target Android device',
                  'Scan the QR code shown above',
                  'Headwind MDM page will open in browser',
                  'Install/open the MDM agent app',
                  'Allow all required permissions',
                  'Device will link automatically — no password needed',
                ].map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', marginBottom: i < 5 ? '0.25rem' : 0 }}>
                    <span style={{
                      flexShrink: 0, width: 16, height: 16, borderRadius: '50%',
                      backgroundColor: 'rgba(8,56,63,0.9)', color: C.cyan400,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.58rem', fontWeight: 700, marginTop: 1,
                    }}>{i + 1}</span>
                    <span style={{ fontSize: '0.75rem', color: C.text400 }}>{step}</span>
                  </div>
                ))}
              </div>

              <div style={{
                padding: '0.625rem 0.875rem',
                backgroundColor: 'rgba(250,204,21,0.05)',
                border: `1px solid rgba(250,204,21,0.15)`,
                borderRadius: '0.5rem',
              }}>
                <p style={{ fontSize: '0.7rem', color: C.yellow400, margin: 0 }}>
                  ⚠ The QR frame above shows Headwind's enrollment page — this is normal behavior. Scan directly from the screen or copy the URL.
                </p>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                backgroundColor: 'rgba(250,204,21,0.1)',
                border: `1px solid rgba(250,204,21,0.2)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1rem',
              }}>
                <AlertTriangle size={28} color={C.yellow400} />
              </div>
              <p style={{ fontSize: '0.9rem', fontWeight: 600, color: C.text300, margin: '0 0 0.5rem' }}>QR URL Not Available</p>
              <p style={{ fontSize: '0.8rem', color: C.text500, margin: '0 0 1.25rem', lineHeight: 1.6 }}>
                This device record does not have a <code style={{ color: C.cyan400, fontFamily: 'monospace' }}>qr_url</code> field.<br />
                Check your backend — it should be returned in <code style={{ color: C.cyan400, fontFamily: 'monospace' }}>GET /api/device/list</code>.
              </p>
            </div>
          )}
        </div>

        <div style={{ padding: '1rem 1.5rem', borderTop: `1px solid ${C.border800}` }}>
          <button style={{ ...S.btnSecondary, width: '100%', justifyContent: 'center' }} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}