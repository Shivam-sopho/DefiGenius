
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SavedQuizResult } from "@/types/quiz-types";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { Check, X } from "lucide-react";

interface PastScoresProps {
  results: SavedQuizResult[];
}

export default function PastScores({ results }: PastScoresProps) {
  if (results.length === 0) {
    return (
      <Card className="w-full mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Past Attempts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">No previous quiz attempts found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Past Attempts</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Percentage</TableHead>
              <TableHead>Result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result, index) => {
              const scorePercentage = (result.score / result.maxPossibleScore) * 100;
              
              return (
                <TableRow key={index}>
                  <TableCell>{formatDistanceToNow(new Date(result.timestamp), { addSuffix: true })}</TableCell>
                  <TableCell>{result.score.toFixed(2)} / {result.maxPossibleScore.toFixed(2)}</TableCell>
                  <TableCell>{scorePercentage.toFixed(1)}%</TableCell>
                  <TableCell>
                    {result.passed ? (
                      <span className="flex items-center text-green-600">
                        <Check className="mr-1" size={16} /> Pass
                      </span>
                    ) : (
                      <span className="flex items-center text-red-600">
                        <X className="mr-1" size={16} /> Fail
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
