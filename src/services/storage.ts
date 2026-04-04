import type { StudentAnalysis, ClassStats } from '../types';

const STORAGE_KEY = 'lessonlens_analyses';

export function saveAnalysis(analysis: StudentAnalysis): void {
  const existing = getAllAnalyses();
  existing.unshift(analysis);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export function getAllAnalyses(): StudentAnalysis[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StudentAnalysis[]) : [];
  } catch {
    return [];
  }
}

export function deleteAnalysis(id: string): void {
  const existing = getAllAnalyses().filter((a) => a.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export function getClassStats(): ClassStats {
  const analyses = getAllAnalyses();

  const scores = analyses.map((a) => a.analysis.score);
  const averageScore =
    scores.length > 0
      ? Math.round(scores.reduce((s, v) => s + v, 0) / scores.length)
      : 0;

  const gapMap = new Map<string, number>();
  for (const a of analyses) {
    for (const gap of a.analysis.conceptualGaps) {
      gapMap.set(gap.concept, (gapMap.get(gap.concept) ?? 0) + 1);
    }
  }

  const commonGaps = Array.from(gapMap.entries())
    .map(([concept, count]) => ({ concept, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const uniqueStudents = new Set(analyses.map((a) => a.studentName)).size;

  const ranges = ['0-59', '60-69', '70-79', '80-89', '90-100'];
  const scoreDistribution = ranges.map((range) => {
    const [lo, hi] = range.split('-').map(Number);
    return {
      range,
      count: scores.filter((s) => s >= lo && s <= hi).length,
    };
  });

  return {
    totalStudents: uniqueStudents,
    totalScans: analyses.length,
    averageScore,
    commonGaps,
    recentActivity: analyses.slice(0, 10),
    scoreDistribution,
  };
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
