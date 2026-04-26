import { CheckCircle2, XCircle, Info } from 'lucide-react';
import { C } from '../theme';

export function Toast({ toasts }) {
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 16px', borderRadius: 10, minWidth: 260,
          background: t.type === 'success' ? 'rgba(6,78,59,0.95)' : t.type === 'error' ? 'rgba(127,29,29,0.95)' : 'rgba(15,40,80,0.95)',
          border: `1px solid ${t.type === 'success' ? C.emerald600 : t.type === 'error' ? C.red600 : C.cyan700}`,
          color: t.type === 'success' ? C.emerald400 : t.type === 'error' ? C.red400 : C.cyan400,
          fontSize: 13, fontFamily: 'monospace',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          animation: 'cn-slide-in 0.25s ease',
        }}>
          {t.type === 'success' ? <CheckCircle2 size={15} /> : t.type === 'error' ? <XCircle size={15} /> : <Info size={15} />}
          <span style={{ flex: 1 }}>{t.message}</span>
        </div>
      ))}
    </div>
  );
}