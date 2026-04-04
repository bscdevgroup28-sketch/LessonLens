export type ViewState = 'landing' | 'dashboard' | 'scanner' | 'analyzing' | 'results';

export interface ConceptualGap {
  concept: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  recommendation: string;
}

export interface AnalysisResult {
  grade: string;
  score: number;
  subject: string;
  conceptualGaps: ConceptualGap[];
  simplifiedReading: string;
  translation: string;
  teacherPrompts: string;
  assessmentQuestions: string[];
  interventionPlan: string;
}

export interface StudentAnalysis {
  id: string;
  studentName: string;
  timestamp: number;
  imageData: string;
  analysis: AnalysisResult;
}

export interface ClassStats {
  totalStudents: number;
  totalScans: number;
  averageScore: number;
  commonGaps: { concept: string; count: number }[];
  recentActivity: StudentAnalysis[];
  scoreDistribution: { range: string; count: number }[];
}
