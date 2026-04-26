import React, { useState } from 'react';
import { QrCode, X, Copy, CheckCircle2, AlertTriangle } from 'lucide-react';
import { C, S } from '../theme';

export function QRModal({ device, onClose }) {
  const qrUrl = device.qr_url || device.qrUrl || device.enrollmentUrl || null;
  const deviceId = device.device_id || device.id || device.deviceId || device._id || 'Device';
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    if (!qrUrl) return;
    navigator.clipboard.writeText(qrUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 60,
        padding: '1rem',
      }}
    >
      <div style={{
        background: C.bg900,
        border: `1px solid ${C.border700}`,
        borderRadius: '1rem',
        width: '100%',
        maxWidth: 420,
        maxHeight: '90vh',
        overflow: 'auto',
      }}>
        {/* Header */}
        <div style={{
          padding: '1rem 1.25rem',
          borderBottom: `1px solid ${C.border800}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <QrCode size={18} color={C.cyan400} />
            <span style={{ fontWeight: 600, color: C.text100 }}>Enroll Device</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.text500 }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.25rem' }}>
          {qrUrl ? (
            <>
              {/* QR Code */}
              <div style={{
                border: `1px solid ${C.border700}`,
                borderRadius: '0.75rem',
                overflow: 'hidden',
                background: '#fff',
                marginBottom: '1rem',
              }}>
                <iframe
                  src={qrUrl}
                  title="QR Code"
                  width="100%"
                  height="320"
                  style={{ border: 'none' }}
                  sandbox="allow-scripts allow-same-origin allow-popups"
                />
              </div>

              {/* URL + Copy Button */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  value={qrUrl}
                  readOnly
                  style={{
                    ...S.input,
                    fontSize: '0.7rem',
                    fontFamily: 'monospace',
                    background: C.bg800,
                  }}
                />
                <button
                  onClick={copyLink}
                  style={{
                    padding: '0 1rem',
                    background: copied ? C.emerald900 : C.bg800,
                    border: `1px solid ${copied ? C.emerald600 : C.border700}`,
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    color: copied ? C.emerald400 : C.text400,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                  {copied ? 'Done' : 'Copy'}
                </button>
              </div>

              {/* Steps - Short Version */}
              <div style={{
                background: C.bg800,
                borderRadius: '0.75rem',
                padding: '0.75rem',
                marginBottom: '0.75rem',
              }}>
                <p style={{ fontSize: '0.7rem', color: C.cyan400, margin: '0 0 0.5rem', fontWeight: 600 }}>
                  📱 How to enroll:
                </p>
                {[
                  'Open camera on Android device',
                  'Scan QR code above',
                  'Install MDM agent app',
                  'Allow permissions',
                  'Auto-links — no password',
                ].map((step, i) => (
                  <div key={i} style={{ fontSize: '0.7rem', color: C.text400, marginBottom: '0.25rem' }}>
                    {i+1}. {step}
                  </div>
                ))}
              </div>

              {/* Small Warning */}
              <div style={{
                fontSize: '0.65rem',
                color: C.yellow400,
                background: 'rgba(250,204,21,0.05)',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                display: 'flex',
                gap: '0.5rem',
              }}>
                <AlertTriangle size={12} />
                <span>QR shows Headwind page — this is normal</span>
              </div>
            </>
          ) : (
            // No QR URL
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <AlertTriangle size={32} color={C.yellow400} style={{ marginBottom: '0.75rem' }} />
              <p style={{ color: C.text300, marginBottom: '0.5rem' }}>QR URL Not Available</p>
              <p style={{ fontSize: '0.7rem', color: C.text500 }}>Missing qr_url field in API response</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '0.75rem 1.25rem', borderTop: `1px solid ${C.border800}` }}>
        <button
  onClick={onClose}
  style={{
    ...S.btnSecondary,
    width: '100%',padding: '0.5rem',backgroundColor: '#dc2626',borderColor: '#dc2626',color: 'white',textAlign: 'center',display: 'flex',justifyContent: 'center',alignItems: 'center',
  }}
>
  Close
</button>
        </div>
      </div>
    </div>
  );
}