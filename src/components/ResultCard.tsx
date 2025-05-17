
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuizResult } from "@/types/quiz-types";
import { Progress } from "@/components/ui/progress";

interface ResultCardProps {
  result: QuizResult;
  onReset: () => void;
  onReviewQuiz: () => void;
  isPassed: boolean;
}

export default function ResultCard({ result, onReset, onReviewQuiz, isPassed }: ResultCardProps) {
  const scorePercentage = (result.score / result.maxPossibleScore) * 100;
  const correctPercentage = (result.correctAnswers / result.totalQuestions) * 100;
  
  const getScoreColor = () => {
    if (scorePercentage >= 80) return "text-green-600";
    if (scorePercentage >= 60) return "text-blue-600";
    if (scorePercentage >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl font-bold text-center">
          Quiz Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-medium">Your Score</h3>
          <p className={`text-4xl font-bold mt-2 ${getScoreColor()}`}>
            {result.score.toFixed(2)} / {result.maxPossibleScore.toFixed(2)}
            <span className="text-lg ml-2">({scorePercentage.toFixed(1)}%)</span>
          </p>
          <div className={`mt-2 text-lg font-medium ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
            {isPassed ? 'PASSED!' : 'FAILED'}
            <div className="text-sm font-normal text-gray-500">
              (Passing mark: 40%)
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Correct Answers</span>
              <span className="text-green-600 font-medium">{result.correctAnswers} / {result.totalQuestions}</span>
            </div>
            <Progress value={correctPercentage} className="h-2" indicatorColor="bg-green-500" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Incorrect Answers</span>
              <span className="text-red-600 font-medium">{result.incorrectAnswers} / {result.totalQuestions}</span>
            </div>
            <Progress 
              value={(result.incorrectAnswers / result.totalQuestions) * 100} 
              className="h-2" 
              indicatorColor="bg-red-500" 
            />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Unattempted</span>
              <span className="text-gray-600 font-medium">{result.unattempted} / {result.totalQuestions}</span>
            </div>
            <Progress 
              value={(result.unattempted / result.totalQuestions) * 100} 
              className="h-2" 
              indicatorColor="bg-gray-400" 
            />
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={onReviewQuiz} 
            variant="outline"
            className="flex-1"
          >
            Review Answers
          </Button>
          <Button 
            onClick={onReset} 
            className="flex-1 bg-quiz-gradient hover:opacity-90"
          >
            Start New Quiz
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
