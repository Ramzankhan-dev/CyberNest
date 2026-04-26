import { C } from '../theme';

export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: 12 }}>
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: C.text50, margin: '0 0 0.2rem', letterSpacing: '0.02em' }}>{title}</h3>
        {subtitle && <p style={{ fontSize: '0.75rem', color: C.text500, margin: 0, fontFamily: 'monospace' }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}