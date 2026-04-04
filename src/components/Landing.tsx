import { Camera, Languages, BookOpen, Link2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ViewState } from '../types';

interface LandingProps {
  onNavigate: (view: ViewState) => void;
  totalScans: number;
}

export default function Landing({ onNavigate, totalScans }: LandingProps) {
  return (
    <motion.div
      key="landing"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card"
      style={{
        maxWidth: '800px',
        width: '100%',
        padding: '48px',
        textAlign: 'center',
        marginTop: '40px',
      }}
    >
      <h1 className="gradient-text" style={{ fontSize: '3.5rem', marginBottom: '16px' }}>
        Every student learns differently.
      </h1>
      <p
        style={{
          fontSize: '1.2rem',
          color: 'var(--text-secondary)',
          maxWidth: '600px',
          margin: '0 auto 40px',
        }}
      >
        Take a photo of any worksheet. LessonLens uses{' '}
        <strong>Gemma&nbsp;4</strong> to instantly grade it, identify conceptual
        gaps, and generate personalized interventions — completely offline.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <button
          className="btn btn-primary animate-pulse-slow"
          style={{ padding: '16px 32px', fontSize: '1.2rem' }}
          onClick={() => onNavigate('scanner')}
        >
          <Camera size={24} />
          Scan Worksheet
        </button>
        {totalScans > 0 && (
          <button
            className="btn btn-outline"
            style={{ padding: '16px 32px', fontSize: '1.2rem' }}
            onClick={() => onNavigate('dashboard')}
          >
            View Dashboard ({totalScans})
          </button>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          margin: '60px 0 20px',
          textAlign: 'left',
        }}
      >
        <div style={{ flex: 1, padding: '0 20px' }}>
          <Languages size={32} color="var(--secondary)" style={{ marginBottom: '16px' }} />
          <h3 style={{ marginBottom: '8px' }}>Bilingual Support</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Instantly translate complex materials into native tongues while
            scaffolding English vocabulary.
          </p>
        </div>
        <div style={{ flex: 1, padding: '0 20px' }}>
          <BookOpen size={32} color="var(--primary)" style={{ marginBottom: '16px' }} />
          <h3 style={{ marginBottom: '8px' }}>Personalized Grading</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Automatically grade worksheets, detect specific conceptual gaps, and
            generate targeted intervention plans.
          </p>
        </div>
        <div style={{ flex: 1, padding: '0 20px' }}>
          <Link2 size={32} color="var(--accent)" style={{ marginBottom: '16px' }} />
          <h3 style={{ marginBottom: '8px' }}>100% Edge-Based</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Powered by Gemma&nbsp;4 via Ollama. No internet required. Built for
            low-connectivity environments.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
