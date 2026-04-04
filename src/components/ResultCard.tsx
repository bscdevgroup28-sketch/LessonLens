import type { ConceptualGap } from '../types';

interface ResultCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  staggerClass?: string;
}

export function ResultCard({ icon, title, children, staggerClass }: ResultCardProps) {
  return (
    <div className={`glass-card animate-fade-in ${staggerClass ?? ''}`} style={{ padding: '24px' }}>
      <div className="result-card-header">
        {icon}
        <h3 style={{ margin: 0 }}>{title}</h3>
      </div>
      <div className="markdown-body" style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
        {children}
      </div>
    </div>
  );
}

interface GapBadgeProps {
  gap: ConceptualGap;
}

export function GapBadge({ gap }: GapBadgeProps) {
  const severityColors: Record<string, string> = {
    high: 'var(--danger)',
    medium: 'var(--accent)',
    low: 'var(--success)',
  };

  return (
    <div className="gap-badge" style={{ borderLeftColor: severityColors[gap.severity] }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <strong>{gap.concept}</strong>
        <span
          className="severity-tag"
          style={{ backgroundColor: severityColors[gap.severity] }}
        >
          {gap.severity}
        </span>
      </div>
      <p style={{ margin: '4px 0', fontSize: '0.85rem' }}>{gap.description}</p>
      <p style={{ margin: '4px 0', fontSize: '0.85rem', color: 'var(--primary-dark)', fontStyle: 'italic' }}>
        → {gap.recommendation}
      </p>
    </div>
  );
}
