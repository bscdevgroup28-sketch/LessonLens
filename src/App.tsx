import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { ViewState, AnalysisResult, ClassStats } from './types';
import { checkOllamaStatus, analyzeWorksheet } from './services/ollama';
import { saveAnalysis, getClassStats, generateId } from './services/storage';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Scanner from './components/Scanner';
import Analyzing from './components/Analyzing';
import AnalysisPanel from './components/AnalysisPanel';
import Dashboard from './components/Dashboard';

function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [progress, setProgress] = useState(0);
  const [ollamaOnline, setOllamaOnline] = useState(false);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [currentStudentName, setCurrentStudentName] = useState('');
  const [stats, setStats] = useState<ClassStats>(getClassStats());

  // Check Ollama on mount
  useEffect(() => {
    checkOllamaStatus().then(setOllamaOnline);
    const interval = setInterval(() => {
      checkOllamaStatus().then(setOllamaOnline);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const refreshStats = useCallback(() => {
    setStats(getClassStats());
  }, []);

  const handleNavigate = useCallback((v: ViewState) => {
    setView(v);
    if (v === 'landing' || v === 'scanner') {
      setProgress(0);
    }
    if (v === 'dashboard') {
      refreshStats();
    }
  }, [refreshStats]);

  const handleReset = useCallback(() => {
    setView('landing');
    setProgress(0);
    setCurrentResult(null);
  }, []);

  const handleCapture = useCallback(
    async (imageBase64: string, studentName: string) => {
      setCurrentStudentName(studentName);
      setView('analyzing');
      setProgress(0);

      // Start progress animation
      const progressInterval = setInterval(() => {
        setProgress((p) => (p < 90 ? p + 1 : p));
      }, 80);

      try {
        const result = await analyzeWorksheet(imageBase64);
        clearInterval(progressInterval);
        setProgress(100);

        // Save to local storage
        saveAnalysis({
          id: generateId(),
          studentName,
          timestamp: Date.now(),
          imageData: imageBase64.substring(0, 200), // Store thumbnail only
          analysis: result,
        });

        setCurrentResult(result);
        refreshStats();

        // Brief pause at 100% then show results
        setTimeout(() => setView('results'), 500);
      } catch {
        clearInterval(progressInterval);
        setProgress(0);
        setView('scanner');
      }
    },
    [refreshStats],
  );

  return (
    <div className="app-container gradient-bg">
      <Navbar
        ollamaOnline={ollamaOnline}
        onNavigate={handleNavigate}
        onReset={handleReset}
      />

      <main
        className="main-content"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '40px',
        }}
      >
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <Landing onNavigate={handleNavigate} totalScans={stats.totalScans} />
          )}

          {view === 'scanner' && (
            <Scanner
              onCapture={handleCapture}
              onCancel={() => handleNavigate('landing')}
            />
          )}

          {view === 'analyzing' && <Analyzing progress={progress} />}

          {view === 'results' && currentResult && (
            <AnalysisPanel
              result={currentResult}
              studentName={currentStudentName}
              onNavigate={handleNavigate}
            />
          )}

          {view === 'dashboard' && (
            <Dashboard
              stats={stats}
              onNavigate={handleNavigate}
              onRefresh={refreshStats}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
