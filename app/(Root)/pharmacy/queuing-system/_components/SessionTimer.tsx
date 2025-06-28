"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

type SessionTimerProps = {
  onEndSession: () => void;
};

export default function SessionTimer({ onEndSession }: SessionTimerProps) {
  const [time, setTime] = useState(0); // Time in seconds
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleEndSession = () => {
    setIsRunning(false);
    onEndSession();
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        <span className="text-lg font-mono font-semibold">
          {formatTime(time)}
        </span>
      </div>
      <Button 
        variant="destructive" 
        size="sm"
        onClick={handleEndSession}
        className="bg-red-500 hover:bg-red-600"
      >
        End Session
      </Button>
    </div>
  );
}