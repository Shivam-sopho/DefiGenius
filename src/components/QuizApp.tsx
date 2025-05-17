
import React, { useState, useEffect } from "react";
import CSVUploader from "./CSVUploader";
import QuizConfig from "./QuizConfig";
import Quiz from "./Quiz";
import ResultCard from "./ResultCard";
import QuizReview from "./QuizReview";
import PastScores from "./PastScores";
import { QuizQuestion, QuizConfig as QuizConfigType, QuizResult, SavedQuizResult } from "@/types/quiz-types";
import { saveQuizResult, getQuizResults } from "@/utils/storageUtils";

export default function QuizApp() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [config, setConfig] = useState<QuizConfigType | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [step, setStep] = useState<"upload" | "config" | "quiz" | "result" | "review">("upload");
  const [pastResults, setPastResults] = useState<SavedQuizResult[]>([]);
  const [isPassed, setIsPassed] = useState<boolean>(false);

  // Load past results when component mounts
  useEffect(() => {
    setPastResults(getQuizResults());
  }, []);

  const handleQuestionsLoaded = (loadedQuestions: QuizQuestion[]) => {
    setQuestions(loadedQuestions);
    setStep("config");
  };

  const handleConfigSubmit = (quizConfig: QuizConfigType) => {
    setConfig(quizConfig);
    setStep("quiz");
  };

  const handleQuizComplete = (result: QuizResult, answers: Record<number, string>) => {
    const scorePercentage = (result.score / result.maxPossibleScore) * 100;
    const passed = scorePercentage >= 40;
    
    setQuizResult(result);
    setSelectedAnswers(answers);
    setIsPassed(passed);
    setStep("result");
    
    // Save the result
    const savedResult: SavedQuizResult = {
      timestamp: new Date().toISOString(),
      score: result.score,
      maxPossibleScore: result.maxPossibleScore,
      passed
    };
    
    saveQuizResult(savedResult);
    // Update the displayed past results
    setPastResults(prevResults => [...prevResults, savedResult]);
  };

  const handleReset = () => {
    setQuestions([]);
    setConfig(null);
    setQuizResult(null);
    setSelectedAnswers({});
    setStep("upload");
  };

  const handleReviewQuiz = () => {
    setStep("review");
  };

  const handleFinishReview = () => {
    setStep("result");
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      {step === "upload" && (
        <>
          <CSVUploader onQuestionsLoaded={handleQuestionsLoaded} />
          {pastResults.length > 0 && <PastScores results={pastResults} />}
        </>
      )}
      
      {step === "config" && questions.length > 0 && (
        <QuizConfig
          onConfigSubmit={handleConfigSubmit}
          questionsCount={questions.length}
        />
      )}
      
      {step === "quiz" && questions.length > 0 && config && (
        <Quiz
          questions={questions}
          config={config}
          onQuizComplete={handleQuizComplete}
          onReset={handleReset}
        />
      )}
      
      {step === "result" && quizResult && (
        <>
          <ResultCard
            result={quizResult}
            onReset={handleReset}
            onReviewQuiz={handleReviewQuiz}
            isPassed={isPassed}
          />
          <PastScores results={pastResults} />
        </>
      )}
      
      {step === "review" && questions.length > 0 && (
        <QuizReview
          questions={questions}
          selectedAnswers={selectedAnswers}
          onFinishReview={handleFinishReview}
        />
      )}
    </div>
  );
}
