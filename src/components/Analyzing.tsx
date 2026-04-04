import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface AnalyzingProps {
  progress: number;
}

export default function Analyzing({ progress }: AnalyzingProps) {
  const getProcessingText = () => {
    if (progress < 20) return 'Initializing Gemma 4 local vision model...';
    if (progress < 40) return 'Extracting handwritten text and structure (offline)...';
    if (progress < 60) return 'Identifying conceptual gaps and scoring...';
    if (progress < 80) return 'Generating simplified reading and translation...';
    if (progress < 95) return 'Building personalized intervention plan...';
    return 'Finalizing analysis...';
  };

  return (
    <motion.div
      key="analyzing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="glass-card"
      style={{
        maxWidth: '600px',
        width: '100%',
        padding: '64px 32px',
        textAlign: 'center',
        marginTop: '40px',
      }}
    >
      <Loader2
        size={64}
        color="var(--primary)"
        style={{ animation: 'spin 2s linear infinite', margin: '0 auto 32px' }}
      />
      <h2 style={{ marginBottom: '16px' }}>Analyzing with Gemma 4</h2>

      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <p style={{ color: 'var(--text-secondary)', minHeight: '24px', marginTop: '16px' }}>
        {getProcessingText()}
      </p>

      <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', marginTop: '12px' }}>
        Running entirely on your device — no data leaves this machine.
      </p>
    </motion.div>
  );
}
