
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { parseCSVToQuestions, parseExcelToQuestions } from "@/utils/csvParser";
import { QuizQuestion } from "@/types/quiz-types";
import { toast } from "sonner";

interface CSVUploaderProps {
  onQuestionsLoaded: (questions: QuizQuestion[]) => void;
}

export default function CSVUploader({ onQuestionsLoaded }: CSVUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsLoading(true);

    try {
      let questions: QuizQuestion[] = [];
      
      // Check file extension
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        // Excel file
        questions = await parseExcelToQuestions(file);
      } else if (file.name.endsWith('.csv')) {
        // CSV file
        const content = await readFileContent(file);
        questions = parseCSVToQuestions(content);
      } else {
        throw new Error('Unsupported file format. Please upload a .xlsx, .xls or .csv file');
      }
      
      if (questions.length === 0) {
        toast.error("No questions found in the file");
        return;
      }
      
      onQuestionsLoaded(questions);
      toast.success(`Successfully loaded ${questions.length} questions`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to parse file");
    } finally {
      setIsLoading(false);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target?.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="p-6 bg-white shadow-md">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Upload Quiz Questions</h2>
        <p className="text-gray-500 text-sm">
          Upload an Excel or CSV file with your quiz questions. The format should be:
          <br />
          <code>Question, Option1, Option2, Option3, Option4, Answer</code>
        </p>
        
        <div className="flex flex-col space-y-2">
          <Input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            onClick={handleUploadClick}
            disabled={isLoading}
            className="w-full bg-quiz-gradient hover:opacity-90"
          >
            {isLoading ? "Processing..." : "Upload File"}
          </Button>
          
          {fileName && (
            <p className="text-sm text-gray-500 mt-2">
              Selected file: {fileName}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
