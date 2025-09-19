import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

/**
 * Session Timer Props Interface
 */
type SessionTimerProps = {
  onEndSession?: () => void;
  autoStart?: boolean;
};

/**
 * Session Timer Component
 * 
 * A timer component that tracks the duration of a queuing session.
 * Displays the elapsed time and provides functionality to end the session.
 * 
 * @param {SessionTimerProps} props - The component props
 * @returns {JSX.Element} The session timer component
 */
export default function SessionTimer({ onEndSession, autoStart = true }: SessionTimerProps) {
  const [time, setTime] = useState("00:00:00");
  const [isRunning, setIsRunning] = useState(autoStart);
  const [seconds, setSeconds] = useState(0);

  // Update timer every second
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => {
          const newSeconds = prevSeconds + 1;
          return newSeconds;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning]);

  // Update formatted time when seconds change
  useEffect(() => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    const formattedTime = [hours, minutes, secs]
      .map(val => val.toString().padStart(2, '0'))
      .join(':');
    
    setTime(formattedTime);
  }, [seconds]);

  /**
   * Handle ending the session
   */
  const handleEndSession = () => {
    setIsRunning(false);
    if (onEndSession) {
      onEndSession();
    }
  };

  return (
    <div className="flex items-center gap-4 bg-white p-3 rounded-lg border shadow-sm">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-medium text-gray-700">Session Time:</span>
        <span className="text-lg font-mono font-bold text-blue-600">{time}</span>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleEndSession}
        className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
      >
        End Session
      </Button>
    </div>
  );
}