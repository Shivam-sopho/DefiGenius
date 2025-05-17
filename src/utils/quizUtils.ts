
import { QuizQuestion, QuizResult, QuizConfig } from "@/types/quiz-types";

export const calculateQuizResult = (
  questions: QuizQuestion[],
  selectedAnswers: Record<number, string>,
  config: QuizConfig
): QuizResult => {
  let correctCount = 0;
  let incorrectCount = 0;
  let unattemptedCount = 0;
  
  questions.forEach((question) => {
    const selectedAnswer = selectedAnswers[question.id];
    
    if (!selectedAnswer) {
      unattemptedCount++;
    } else if (selectedAnswer === question.answer) {
      correctCount++;
    } else {
      incorrectCount++;
    }
  });
  
  const positiveScore = correctCount * config.positiveMarks;
  const negativeScore = incorrectCount * config.negativeMarks;
  const totalScore = positiveScore - negativeScore;
  
  return {
    totalQuestions: questions.length,
    correctAnswers: correctCount,
    incorrectAnswers: incorrectCount,
    unattempted: unattemptedCount,
    score: totalScore,
    maxPossibleScore: questions.length * config.positiveMarks
  };
};
