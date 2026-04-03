export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  id: string;
  prompt: string;
  details?: string;
  correctAnswer: number;
  unit?: string;
  tolerance: number; // e.g. ±1 for rounding
  answerType: "numeric";
}

export interface TrainingModule {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  generateQuestion: (difficulty: Difficulty) => Question;
}

export interface SessionResult {
  moduleId: string;
  difficulty: Difficulty;
  date: string;
  score: number;
  totalQuestions: number;
  totalTimeMs: number;
  questionTimes: number[]; // ms per question
}
