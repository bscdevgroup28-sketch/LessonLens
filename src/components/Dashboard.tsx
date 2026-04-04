import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, TrendingUp, AlertTriangle, ArrowLeft, Camera, Clock, Trash2, Cloud, CloudOff, Loader2, CheckCircle2 } from 'lucide-react';
import type { ClassStats, ViewState } from '../types';
import { deleteAnalysis } from '../services/storage';
import { syncToCloud, checkCloudStatus } from '../services/sync';

interface DashboardProps {
  stats: ClassStats;
  onNavigate: (view: ViewState) => void;
  onRefresh: () => void;
}

export default function Dashboard({ stats, onNavigate, onRefresh }: DashboardProps) {
  const [syncState, setSyncState] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    deleteAnalysis(id);
    onRefresh();
  };

  const handleSync = async () => {
    setSyncState('syncing');
    try {
      const online = await checkCloudStatus();
      if (!online) {
        setSyncState('error');
        setTimeout(() => setSyncState('idle'), 3000);
        return;
      }
      const result = await syncToCloud('school-001', 'teacher-001', stats);
      if (result.success) {
        setSyncState('success');
        setLastSyncTime(new Date(result.syncedAt).toLocaleTimeString());
        setTimeout(() => setSyncState('idle'), 4000);
      }
    } catch {
      setSyncState('error');
      setTimeout(() => setSyncState('idle'), 3000);
    }
  };

  if (stats.totalScans === 0) {
    return (
      <motion.div
        key="dashboard-empty"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="glass-card"
        style={{ maxWidth: '600px', width: '100%', padding: '64px 32px', textAlign: 'center', marginTop: '40px' }}
      >
        <BarChart3 size={64} color="var(--text-tertiary)" style={{ marginBottom: '24px' }} />
        <h2 style={{ marginBottom: '12px' }}>No Data Yet</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          Start scanning student worksheets to see analytics and class-level insights here.
        </p>
        <button className="btn btn-primary" onClick={() => onNavigate('scanner')}>
          <Camera size={20} /> Scan First Worksheet
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="dashboard"
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
        }}
      >
        <h2>Class Dashboard</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            className={`btn ${syncState === 'success' ? 'btn-success' : syncState === 'error' ? 'btn-danger' : 'btn-secondary'}`}
            onClick={handleSync}
            disabled={syncState === 'syncing'}
            style={{ minWidth: '160px' }}
          >
            {syncState === 'idle' && <><Cloud size={18} /> Sync to Cloud</>}
            {syncState === 'syncing' && <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Syncing...</>}
            {syncState === 'success' && <><CheckCircle2 size={18} /> Synced!</>}
            {syncState === 'error' && <><CloudOff size={18} /> Offline</>}
          </button>
          {lastSyncTime && syncState === 'idle' && (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', alignSelf: 'center' }}>
              Last: {lastSyncTime}
            </span>
          )}
          <button className="btn btn-secondary" onClick={() => onNavigate('landing')}>
            <ArrowLeft size={18} /> Back
          </button>
          <button className="btn btn-primary" onClick={() => onNavigate('scanner')}>
            <Camera size={18} /> New Scan
          </button>
        </div>
      </div>

      {/* Stat cards row */}
      <div className="stats-row">
        <div className="stat-card glass-card animate-fade-in stagger-1">
          <Users size={28} color="var(--secondary)" />
          <div>
            <p className="stat-label">Students</p>
            <p className="stat-value">{stats.totalStudents}</p>
          </div>
        </div>
        <div className="stat-card glass-card animate-fade-in stagger-2">
          <BarChart3 size={28} color="var(--primary)" />
          <div>
            <p className="stat-label">Total Scans</p>
            <p className="stat-value">{stats.totalScans}</p>
          </div>
        </div>
        <div className="stat-card glass-card animate-fade-in stagger-3">
          <TrendingUp size={28} color="var(--success)" />
          <div>
            <p className="stat-label">Avg Score</p>
            <p className="stat-value">{stats.averageScore}%</p>
          </div>
        </div>
        <div className="stat-card glass-card animate-fade-in stagger-4">
          <AlertTriangle size={28} color="var(--danger)" />
          <div>
            <p className="stat-label">Top Gaps</p>
            <p className="stat-value">{stats.commonGaps.length}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Score distribution */}
        <div className="glass-card animate-fade-in stagger-1" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>Score Distribution</h3>
          <div className="bar-chart">
            {stats.scoreDistribution.map((d) => {
              const maxCount = Math.max(...stats.scoreDistribution.map((x) => x.count), 1);
              return (
                <div key={d.range} className="bar-item">
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ height: `${(d.count / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="bar-label">{d.range}</span>
                  <span className="bar-count">{d.count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Common gaps */}
        <div className="glass-card animate-fade-in stagger-2" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>Most Common Gaps</h3>
          {stats.commonGaps.length === 0 ? (
            <p style={{ color: 'var(--text-tertiary)' }}>No gaps recorded yet.</p>
          ) : (
            <div className="gap-list">
              {stats.commonGaps.map((g, i) => (
                <div key={i} className="gap-row">
                  <span className="gap-rank">#{i + 1}</span>
                  <span className="gap-name">{g.concept}</span>
                  <span className="gap-count">{g.count} students</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent activity */}
      <div className="glass-card animate-fade-in" style={{ padding: '24px', marginTop: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>Recent Activity</h3>
        <div className="activity-list">
          {stats.recentActivity.map((a) => (
            <div key={a.id} className="activity-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                <Clock size={16} color="var(--text-tertiary)" />
                <span style={{ fontWeight: 500 }}>{a.studentName}</span>
                <span style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
                  {a.analysis.subject}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span
                  style={{
                    fontWeight: 700,
                    color:
                      a.analysis.score >= 80
                        ? 'var(--success)'
                        : a.analysis.score >= 60
                          ? 'var(--accent)'
                          : 'var(--danger)',
                  }}
                >
                  {a.analysis.grade} ({a.analysis.score}%)
                </span>
                <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
                  {new Date(a.timestamp).toLocaleDateString()}
                </span>
                <button
                  className="btn-icon"
                  title="Delete"
                  onClick={() => handleDelete(a.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
