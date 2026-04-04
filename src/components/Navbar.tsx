import { Sparkles, CheckCircle2, WifiOff, User, BarChart3 } from 'lucide-react';
import type { ViewState } from '../types';

interface NavbarProps {
  ollamaOnline: boolean;
  onNavigate: (view: ViewState) => void;
  onReset: () => void;
}

export default function Navbar({ ollamaOnline, onNavigate, onReset }: NavbarProps) {
  return (
    <nav className="navbar glass">
      <div className="logo" onClick={onReset} style={{ cursor: 'pointer' }}>
        <Sparkles className="text-primary" size={28} />
        <span>LessonLens</span>
      </div>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <span
          className="status-pill"
          style={{
            color: ollamaOnline ? 'var(--success)' : 'var(--text-tertiary)',
          }}
        >
          {ollamaOnline ? (
            <><CheckCircle2 size={16} /> Local AI Active</>
          ) : (
            <><WifiOff size={16} /> Ollama Offline — Demo Mode</>
          )}
        </span>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => onNavigate('dashboard')}
        >
          <BarChart3 size={16} /> Dashboard
        </button>
        <button className="btn btn-secondary btn-sm">
          <User size={16} /> Offline Profile
        </button>
      </div>
    </nav>
  );
}
