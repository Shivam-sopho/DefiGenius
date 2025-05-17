
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { QuizQuestion } from "@/types/quiz-types";

interface QuestionCardProps {
  question: QuizQuestion;
  selectedOption: string | null;
  onSelectOption: (option: string) => void;
  showAnswer?: boolean;
}

export default function QuestionCard({
  question,
  selectedOption,
  onSelectOption,
  showAnswer = false,
}: QuestionCardProps) {
  const getOptionClass = (option: string) => {
    if (!showAnswer) return "";
    
    if (option === question.answer) {
      return "bg-green-50 border-green-200";
    }
    
    if (selectedOption === option && option !== question.answer) {
      return "bg-red-50 border-red-200";
    }
    
    return "";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">{question.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedOption || ""}
          onValueChange={onSelectOption}
          disabled={showAnswer}
          className="space-y-3"
        >
          {question.options.map((option, index) => (
            <div
              key={index}
              className={`flex items-center space-x-2 p-3 border rounded-md transition-all ${
                getOptionClass(option)
              }`}
            >
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label
                htmlFor={`option-${index}`}
                className="flex-grow cursor-pointer"
              >
                {option}
                {showAnswer && option === question.answer && (
                  <span className="ml-2 text-green-600 font-medium">(Correct Answer)</span>
                )}
              </Label>
            </div>
          ))}
        </RadioGroup>
        
        {showAnswer && question.explanation && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="font-medium text-blue-700 mb-1">Explanation:</h4>
            <p className="text-sm text-blue-800">{question.explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
