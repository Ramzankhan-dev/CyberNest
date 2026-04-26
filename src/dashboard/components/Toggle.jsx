import { C } from '../theme';

export function Toggle({ value, onChange, color = C.emerald600 }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        position: 'relative', width: 44, height: 22, borderRadius: 9999,
        backgroundColor: value ? color : C.bg700,
        border: 'none', cursor: 'pointer', flexShrink: 0,
        transition: 'background-color 0.2s',
      }}
    >
      <div style={{
        position: 'absolute', top: 3, left: value ? 24 : 3,
        width: 16, height: 16, backgroundColor: '#fff',
        borderRadius: '50%', transition: 'left 0.2s',
      }} />
    </button>
  );
}