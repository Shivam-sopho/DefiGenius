
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { QuizQuestion, QuizConfig as QuizConfigType, QuizState, QuizResult } from "@/types/quiz-types";
import QuizTimer from "./QuizTimer";
import QuestionCard from "./QuestionCard";
import { calculateQuizResult } from "@/utils/quizUtils";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface QuizProps {
  questions: QuizQuestion[];
  config: QuizConfigType;
  onQuizComplete: (result: QuizResult, answers: Record<number, string>) => void;
  onReset: () => void;
}

export default function Quiz({ questions, config, onQuizComplete, onReset }: QuizProps) {
  const [state, setState] = useState<QuizState>({
    questions,
    config,
    currentQuestionIndex: 0,
    selectedAnswers: {},
    timeRemaining: config.timeLimit * 60, // convert minutes to seconds
    quizStarted: false,
    quizCompleted: false,
  });

  const handleStartQuiz = () => {
    setState(prev => ({
      ...prev,
      quizStarted: true,
    }));
    toast("Quiz started! Good luck!");
  };

  const handleSelectOption = (option: string) => {
    setState(prev => ({
      ...prev,
      selectedAnswers: {
        ...prev.selectedAnswers,
        [questions[state.currentQuestionIndex].id]: option
      }
    }));
  };

  const handleNextQuestion = () => {
    if (state.currentQuestionIndex < questions.length - 1) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    }
  };

  const handlePreviousQuestion = () => {
    if (state.currentQuestionIndex > 0) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1
      }));
    }
  };

  const handleEndQuiz = () => {
    const result = calculateQuizResult(questions, state.selectedAnswers, config);
    
    setState(prev => ({
      ...prev,
      quizCompleted: true
    }));
    
    onQuizComplete(result, state.selectedAnswers);
    toast.info("Quiz ended early!");
  };

  const handleSubmitQuiz = () => {
    // Count unanswered questions
    const answeredCount = Object.keys(state.selectedAnswers).length;
    const unansweredCount = questions.length - answeredCount;
    
    if (unansweredCount > 0) {
      const confirmSubmit = window.confirm(
        `You have ${unansweredCount} unanswered question${unansweredCount > 1 ? 's' : ''}. Are you sure you want to submit?`
      );
      if (!confirmSubmit) return;
    }
    
    const result = calculateQuizResult(questions, state.selectedAnswers, config);
    
    setState(prev => ({
      ...prev,
      quizCompleted: true
    }));
    
    onQuizComplete(result, state.selectedAnswers);
  };

  const handleTimeUpdate = () => {
    setState(prev => {
      if (prev.timeRemaining <= 1) {
        // Time's up, auto-submit
        const result = calculateQuizResult(questions, prev.selectedAnswers, config);
        onQuizComplete(result, prev.selectedAnswers);
        toast.warning("Time's up! Your answers have been submitted.");
        return {
          ...prev,
          timeRemaining: 0,
          quizCompleted: true
        };
      }
      
      return {
        ...prev,
        timeRemaining: prev.timeRemaining - 1
      };
    });
  };

  const currentQuestion = questions[state.currentQuestionIndex];
  const selectedOption = state.selectedAnswers[currentQuestion?.id] || null;
  const totalTimeInSeconds = config.timeLimit * 60;

  if (!state.quizStarted) {
    return (
      <Card className="p-6 bg-white shadow-md">
        <h2 className="text-xl font-semibold mb-4">Ready to Start</h2>
        <div className="space-y-4">
          <p className="text-gray-600">
            You are about to start a quiz with {questions.length} questions.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Time limit: {config.timeLimit} minutes</li>
            <li>Correct answer: +{config.positiveMarks} marks</li>
            <li>Wrong answer: -{config.negativeMarks} marks</li>
          </ul>
          
          <Button 
            onClick={handleStartQuiz}
            className="w-full mt-4 bg-quiz-gradient hover:opacity-90"
          >
            Start Quiz
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <QuizTimer 
            totalTimeInSeconds={totalTimeInSeconds}
            timeRemaining={state.timeRemaining}
            onTimeUp={handleTimeUpdate}
            isPaused={state.quizCompleted}
          />
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                End Quiz
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>End Quiz Early?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to end the quiz now? Your current answers will be submitted and scored.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleEndQuiz}>End Quiz</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        
        <div className="mt-4 flex justify-between text-sm">
          <span>
            Question {state.currentQuestionIndex + 1} of {questions.length}
          </span>
          <span>
            Answered: {Object.keys(state.selectedAnswers).length} / {questions.length}
          </span>
        </div>
      </div>

      <QuestionCard
        question={currentQuestion}
        selectedOption={selectedOption}
        onSelectOption={handleSelectOption}
      />

      <div className="flex justify-between mt-6">
        <Button
          onClick={handlePreviousQuestion}
          disabled={state.currentQuestionIndex === 0}
          variant="outline"
        >
          Previous
        </Button>

        {state.currentQuestionIndex < questions.length - 1 ? (
          <Button onClick={handleNextQuestion}>Next</Button>
        ) : (
          <Button 
            onClick={handleSubmitQuiz} 
            className="bg-green-600 hover:bg-green-700"
          >
            Submit Quiz
          </Button>
        )}
      </div>
    </div>
  );
}
