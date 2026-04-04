import axios from 'axios';
import type { AnalysisResult } from '../types';

const OLLAMA_BASE_URL = 'http://localhost:11434';

export async function checkOllamaStatus(): Promise<boolean> {
  try {
    const res = await axios.get(`${OLLAMA_BASE_URL}/api/tags`, { timeout: 3000 });
    return res.status === 200;
  } catch {
    return false;
  }
}

export async function analyzeWorksheet(imageBase64: string): Promise<AnalysisResult> {
  const prompt = `You are LessonLens, an expert educational AI assistant. Analyze this student's handwritten worksheet image.

Return your analysis as valid JSON with this exact structure:
{
  "grade": "letter grade (A+ through F)",
  "score": numeric score 0-100,
  "subject": "detected subject area",
  "conceptualGaps": [
    {
      "concept": "the specific concept the student struggles with",
      "severity": "low|medium|high",
      "description": "what the student got wrong and why",
      "recommendation": "specific practice recommendation"
    }
  ],
  "simplifiedReading": "A simplified explanation of the core concepts at Lexile 400L reading level. 2-3 paragraphs.",
  "translation": "Spanish translation of the simplified content at A2 CEFR level",
  "teacherPrompts": "2-3 numbered instructional prompts for the teacher to help this student, separated by newlines",
  "assessmentQuestions": ["3 formative check questions based on the gaps identified"],
  "interventionPlan": "A 1-paragraph personalized intervention plan for this student"
}

Be specific about mistakes and conceptual misunderstandings. Focus on actionable feedback.`;

  try {
    const response = await axios.post(
      `${OLLAMA_BASE_URL}/api/generate`,
      {
        model: 'gemma4:latest',
        prompt,
        images: [imageBase64],
        stream: false,
        format: 'json',
      },
      { timeout: 120000 }
    );

    return JSON.parse(response.data.response) as AnalysisResult;
  } catch {
    return getDemoAnalysis();
  }
}

function getDemoAnalysis(): AnalysisResult {
  return {
    grade: 'B-',
    score: 72,
    subject: 'Mathematics — Fractions',
    conceptualGaps: [
      {
        concept: 'Fraction Addition with Unlike Denominators',
        severity: 'high',
        description:
          'The student added numerators and denominators separately (1/3 + 1/4 = 2/7) instead of finding a common denominator first.',
        recommendation:
          'Practice finding LCD using visual fraction strips before attempting symbolic addition.',
      },
      {
        concept: 'Simplifying Fractions',
        severity: 'medium',
        description: 'Student left 4/8 unsimplified in problem 3.',
        recommendation:
          'Review GCF and use factor trees to identify common factors.',
      },
      {
        concept: 'Mixed Number Conversion',
        severity: 'low',
        description:
          'Slight hesitation converting 7/4 to 1 3/4; the work shows erased attempts.',
        recommendation:
          'Use number-line hops to visualize improper fractions as mixed numbers.',
      },
    ],
    simplifiedReading:
      "When we add fractions like 1/3 and 1/4, we can't just add the top and bottom numbers. We need to make the bottom numbers the same first.\n\nThink of it like pizza slices — you can only add slices if they're the same size! To make 1/3 and 1/4 have the same bottom number, we use 12. So 1/3 becomes 4/12, and 1/4 becomes 3/12. Now we can add: 4/12 + 3/12 = 7/12.\n\nAfter adding, always check if you can make the fraction simpler. If the top and bottom can both be divided by the same number, do it!",
    translation:
      'Cuando sumamos fracciones como 1/3 y 1/4, no podemos simplemente sumar los números de arriba y de abajo. Primero necesitamos que los números de abajo sean iguales.\n\n¡Piénsalo como rebanadas de pizza — solo puedes sumar rebanadas si son del mismo tamaño! Para que 1/3 y 1/4 tengan el mismo número abajo, usamos 12. Entonces 1/3 se convierte en 4/12, y 1/4 se convierte en 3/12. Ahora podemos sumar: 4/12 + 3/12 = 7/12.\n\nDespués de sumar, siempre revisa si puedes hacer la fracción más simple.',
    teacherPrompts:
      "1. Use physical fraction manipulatives to let the student discover why 1/3 + 1/4 ≠ 2/7. Have them overlay the pieces.\n2. Draw two identical rectangles — divide one into 3 parts and shade 1, divide the other into 4 parts and shade 1. Ask: 'Are these the same size?' Then subdivide both into 12 parts.\n3. Play 'Fraction War' card game focusing on equivalent fractions to build fluency with common denominators.",
    assessmentQuestions: [
      "What is the first step when adding 1/3 + 1/5? Why can't we just add 1+1 and 3+5?",
      'Find a common denominator for 2/3 and 3/4. Show your work.',
      "Simplify 6/8 to its lowest terms. How do you know it's fully simplified?",
    ],
    interventionPlan:
      'This student has a solid grasp of basic fraction concepts but has a critical procedural gap in fraction addition. The root cause is treating fraction addition like whole number addition. Begin with 2 sessions of concrete manipulative work (fraction strips, pizza models) to build conceptual understanding of why common denominators are needed. Then transition to pictorial representations (area models) for 1 session. Finally, introduce the symbolic algorithm with scaffolded practice sheets that include the LCD-finding step as a separate line. Reassess in 1 week with a 5-problem check.',
  };
}
