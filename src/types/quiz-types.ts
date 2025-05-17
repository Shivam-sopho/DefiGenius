
export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: string;
  answerIndex: number | null;
  explanation?: string;
}

export interface QuizConfig {
  timeLimit: number; // in minutes
  positiveMarks: number;
  negativeMarks: number;
}

export interface QuizState {
  questions: QuizQuestion[];
  config: QuizConfig;
  currentQuestionIndex: number;
  selectedAnswers: Record<number, string>;
  timeRemaining: number; // in seconds
  quizStarted: boolean;
  quizCompleted: boolean;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unattempted: number;
  score: number;
  maxPossibleScore: number;
}

export interface SavedQuizResult {
  timestamp: string;
  score: number;
  maxPossibleScore: number;
  passed: boolean;
}
