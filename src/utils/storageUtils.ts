
import { SavedQuizResult } from "@/types/quiz-types";

const QUIZ_RESULTS_KEY = "quiz_results";

export const saveQuizResult = (result: SavedQuizResult): void => {
  try {
    const existingResults = getQuizResults();
    const updatedResults = [...existingResults, result];
    localStorage.setItem(QUIZ_RESULTS_KEY, JSON.stringify(updatedResults));
  } catch (error) {
    console.error("Error saving quiz result:", error);
  }
};

export const getQuizResults = (): SavedQuizResult[] => {
  try {
    const results = localStorage.getItem(QUIZ_RESULTS_KEY);
    return results ? JSON.parse(results) : [];
  } catch (error) {
    console.error("Error retrieving quiz results:", error);
    return [];
  }
};
