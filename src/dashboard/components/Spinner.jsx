import { C } from '../theme';

export function Spinner({ size = 20, color = C.cyan400 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      border: `2px solid ${color}30`,
      borderTop: `2px solid ${color}`,
      animation: 'cn-spin 0.8s linear infinite',
      display: 'inline-block', flexShrink: 0,
    }} />
  );
}