import { S, C } from '../theme';

export function SectionCard({ children, style = {} }) {
  return (
    <div style={{ ...S.card, padding: '1.5rem', ...style }}
      onMouseEnter={e => e.currentTarget.style.borderColor = C.border700}
      onMouseLeave={e => e.currentTarget.style.borderColor = C.border800}>
      {children}
    </div>
  );
}