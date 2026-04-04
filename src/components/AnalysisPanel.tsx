import { motion } from 'framer-motion';
import { BookOpen, Languages, User, AlertTriangle, FileText, Target, ArrowLeft } from 'lucide-react';
import type { AnalysisResult, ViewState } from '../types';
import { ResultCard, GapBadge } from './ResultCard';

interface AnalysisPanelProps {
  result: AnalysisResult;
  studentName: string;
  onNavigate: (view: ViewState) => void;
}

export default function AnalysisPanel({ result, studentName, onNavigate }: AnalysisPanelProps) {
  const scoreColor =
    result.score >= 80
      ? 'var(--success)'
      : result.score >= 60
        ? 'var(--accent)'
        : 'var(--danger)';

  return (
    <motion.div
      key="results"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{ width: '100%', maxWidth: '1200px' }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h2>Analysis: {studentName}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {result.subject}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={() => onNavigate('scanner')}>
            <ArrowLeft size={18} /> Scan Another
          </button>
          <button className="btn btn-primary" onClick={() => onNavigate('dashboard')}>
            View Dashboard
          </button>
        </div>
      </div>

      {/* Score banner */}
      <div
        className="glass-card animate-fade-in"
        style={{
          padding: '24px 32px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>Overall Grade</p>
          <span style={{ fontSize: '3rem', fontWeight: 700, color: scoreColor, fontFamily: 'var(--font-display)' }}>
            {result.grade}
          </span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>Score</p>
          <div className="score-ring" style={{ '--score-color': scoreColor, '--score-pct': `${result.score}%` } as React.CSSProperties}>
            <span>{result.score}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>Gaps Found</p>
          <span style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
            {result.conceptualGaps.length}
          </span>
        </div>
      </div>

      {/* Result cards grid */}
      <div className="results-grid">
        {/* Conceptual Gaps */}
        <ResultCard
          icon={<AlertTriangle size={24} color="var(--danger)" />}
          title="Conceptual Gaps Identified"
          staggerClass="stagger-1"
        >
          {result.conceptualGaps.map((gap, i) => (
            <GapBadge key={i} gap={gap} />
          ))}
        </ResultCard>

        {/* Simplified Reading */}
        <ResultCard
          icon={<BookOpen size={24} color="var(--primary)" />}
          title="Simplified Explanation (Lexile 400L)"
          staggerClass="stagger-2"
        >
          {result.simplifiedReading.split('\n').map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </ResultCard>

        {/* Spanish Translation */}
        <ResultCard
          icon={<Languages size={24} color="var(--secondary)" />}
          title="Spanish Translation (A2 CEFR)"
          staggerClass="stagger-3"
        >
          {result.translation.split('\n').map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </ResultCard>

        {/* Teacher Prompts */}
        <ResultCard
          icon={<User size={24} color="var(--accent)" />}
          title="Teacher Instructional Prompts"
          staggerClass="stagger-4"
        >
          {result.teacherPrompts.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </ResultCard>

        {/* Assessment Questions */}
        <ResultCard
          icon={<FileText size={24} color="var(--secondary)" />}
          title="Formative Assessment Questions"
          staggerClass="stagger-1"
        >
          <ol>
            {result.assessmentQuestions.map((q, i) => (
              <li key={i} style={{ marginBottom: '8px' }}>{q}</li>
            ))}
          </ol>
        </ResultCard>

        {/* Intervention Plan */}
        <ResultCard
          icon={<Target size={24} color="var(--primary-dark)" />}
          title="Personalized Intervention Plan"
          staggerClass="stagger-2"
        >
          <p>{result.interventionPlan}</p>
        </ResultCard>
      </div>
    </motion.div>
  );
}
