import { C } from '../theme';

export function StatusDot({ status }) {
  const map = {
    online: C.emerald400, enrolled: C.emerald400, active: C.emerald400,
    offline: C.text600, unknown: C.text600,
    warning: C.yellow400, pending: C.yellow400,
  };
  const color = map[status] || C.text600;
  const isOnline = status === 'online' || status === 'enrolled' || status === 'active';
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{
        width: 7, height: 7, borderRadius: '50%', backgroundColor: color,
        boxShadow: isOnline ? `0 0 6px ${color}` : 'none',
      }} />
      <span style={{ fontSize: '0.75rem', fontWeight: 500, color }}>{status}</span>
    </div>
  );
}