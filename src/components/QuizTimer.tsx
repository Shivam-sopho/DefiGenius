
import React, { useEffect } from 'react';
import { formatTime } from '@/utils/timerUtils';
import { Progress } from '@/components/ui/progress';

interface QuizTimerProps {
  totalTimeInSeconds: number;
  timeRemaining: number;
  onTimeUp: () => void;
  isPaused?: boolean;
}

export default function QuizTimer({
  totalTimeInSeconds,
  timeRemaining,
  onTimeUp,
  isPaused = false,
}: QuizTimerProps) {
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      onTimeUp();
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeUp, isPaused]);

  const percentageRemaining = (timeRemaining / totalTimeInSeconds) * 100;
  
  const getTimeColor = () => {
    if (percentageRemaining > 50) return 'text-green-600';
    if (percentageRemaining > 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = () => {
    if (percentageRemaining > 50) return 'bg-green-500';
    if (percentageRemaining > 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1 items-center">
        <span className="text-sm text-gray-600">Time Remaining</span>
        <span className={`font-medium ${getTimeColor()}`}>
          {formatTime(timeRemaining)}
        </span>
      </div>
      
      <Progress 
        value={percentageRemaining} 
        className="h-2" 
        indicatorColor={getProgressColor()}
      />
    </div>
  );
}
