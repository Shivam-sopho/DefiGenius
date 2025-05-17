
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { QuizQuestion } from "@/types/quiz-types";
import QuestionCard from "./QuestionCard";

interface QuizReviewProps {
  questions: QuizQuestion[];
  selectedAnswers: Record<number, string>;
  onFinishReview: () => void;
}

export default function QuizReview({ 
  questions, 
  selectedAnswers, 
  onFinishReview 
}: QuizReviewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const selectedOption = selectedAnswers[currentQuestion?.id] || null;

  const questionStatus = () => {
    if (!selectedOption) return "Unattempted";
    return selectedOption === currentQuestion.answer ? "Correct" : "Incorrect";
  };

  const questionStatusColor = () => {
    if (!selectedOption) return "text-gray-600 bg-gray-100";
    return selectedOption === currentQuestion.answer 
      ? "text-green-600 bg-green-50" 
      : "text-red-600 bg-red-50";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Review Answers</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${questionStatusColor()}`}>
          {questionStatus()}
        </span>
      </div>

      <div className="mb-2 text-sm text-gray-500">
        Question {currentQuestionIndex + 1} of {questions.length}
      </div>

      <QuestionCard
        question={currentQuestion}
        selectedOption={selectedOption}
        onSelectOption={() => {}}
        showAnswer={true}
      />

      <div className="flex justify-between mt-6">
        <Button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          variant="outline"
        >
          Previous
        </Button>

        {currentQuestionIndex < questions.length - 1 ? (
          <Button onClick={handleNextQuestion} variant="outline">
            Next
          </Button>
        ) : (
          <Button 
            onClick={onFinishReview} 
            className="bg-quiz-gradient hover:opacity-90"
          >
            Finish Review
          </Button>
        )}
      </div>
    </div>
  );
}
