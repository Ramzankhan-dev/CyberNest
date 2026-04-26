export const C = {
  bg950: '#020817', bg900: '#0f172a', bg800: '#1e293b', bg700: '#334155',
  bg600: '#475569', bg500: '#64748b',
  text50: '#f8fafc', text100: '#f1f5f9', text200: '#e2e8f0',
  text300: '#cbd5e1', text400: '#94a3b8', text500: '#64748b', text600: '#475569',
  cyan400: '#22d3ee', cyan500: '#06b6d4', cyan600: '#0891b2', cyan700: '#0e7490',
  emerald400: '#34d399', emerald500: '#10b981', emerald600: '#059669',
  red400: '#f87171', red500: '#ef4444', red600: '#dc2626',
  yellow400: '#facc15', yellow500: '#eab308', yellow600: '#ca8a04',
  purple400: '#a78bfa', purple600: '#7c3aed',
  orange400: '#fb923c', orange600: '#ea580c',
  border800: '#1e293b', border700: '#334155', border600: '#475569',
};

export const S = {
  card: {
    backgroundColor: C.bg900,
    border: `1px solid ${C.border800}`,
    borderRadius: '0.75rem',
  },
  sidebarBtn: (active) => ({
    width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
    padding: '0.625rem 1rem', borderRadius: '0.5rem',
    border: active ? `1px solid ${C.border700}` : '1px solid transparent',
    backgroundColor: active ? C.bg800 : 'transparent',
    color: active ? C.cyan400 : C.text400,
    fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer',
    transition: 'all 0.2s', fontFamily: 'inherit',
  }),
  input: {
    width: '100%', padding: '0.625rem 0.875rem',
    backgroundColor: C.bg800, border: `1px solid ${C.border700}`,
    borderRadius: '0.5rem', fontSize: '0.875rem', color: C.text50,
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  },
  btnPrimary: {
    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
    padding: '0.625rem 1.25rem', backgroundColor: C.cyan600,
    border: 'none', borderRadius: '0.5rem', color: '#fff',
    fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
  },
  btnSecondary: {
    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
    padding: '0.625rem 1.25rem', backgroundColor: C.bg800,
    border: `1px solid ${C.border700}`, borderRadius: '0.5rem', color: C.text300,
    fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
  },
  btnDanger: {
    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
    padding: '0.625rem 1.25rem',
    backgroundColor: 'rgba(220,38,38,0.12)',
    border: `1px solid rgba(220,38,38,0.3)`, borderRadius: '0.5rem', color: C.red400,
    fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
  },
  tableHeader: {
    padding: '0.75rem 1rem', textAlign: 'left',
    fontSize: '0.65rem', fontWeight: 600, color: C.text500,
    textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap',
  },
  tableCell: {
    padding: '0.875rem 1rem', borderBottom: `1px solid ${C.border800}`,
  },
};