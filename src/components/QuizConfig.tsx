
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QuizConfig as QuizConfigType } from "@/types/quiz-types";

interface QuizConfigProps {
  onConfigSubmit: (config: QuizConfigType) => void;
  questionsCount: number;
}

export default function QuizConfig({ onConfigSubmit, questionsCount }: QuizConfigProps) {
  const [timeLimit, setTimeLimit] = useState(30);
  const [positiveMarks, setPositiveMarks] = useState(1.0);
  const [negativeMarks, setNegativeMarks] = useState(0.25);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfigSubmit({
      timeLimit,
      positiveMarks,
      negativeMarks
    });
  };

  return (
    <Card className="p-6 bg-white shadow-md">
      <h2 className="text-xl font-semibold mb-4">Quiz Settings</h2>
      
      <div className="text-green-600 font-medium mb-4 bg-green-50 p-3 rounded-md">
        {questionsCount} questions loaded successfully
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
          <Input
            id="timeLimit"
            type="number"
            min="1"
            max="180"
            value={timeLimit}
            onChange={e => setTimeLimit(Number(e.target.value))}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="positiveMarks">Marks for Correct Answer</Label>
          <Input
            id="positiveMarks"
            type="number"
            min="0"
            step="0.01"
            value={positiveMarks}
            onChange={e => setPositiveMarks(Number(e.target.value))}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="negativeMarks">Negative Marks for Wrong Answer</Label>
          <Input
            id="negativeMarks"
            type="number"
            min="0"
            step="0.01"
            value={negativeMarks}
            onChange={e => setNegativeMarks(Number(e.target.value))}
            required
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full mt-4 bg-quiz-gradient hover:opacity-90"
        >
          Start Quiz
        </Button>
      </form>
    </Card>
  );
}
