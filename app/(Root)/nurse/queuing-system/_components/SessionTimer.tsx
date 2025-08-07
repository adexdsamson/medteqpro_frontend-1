import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

type SessionTimerProps = {
  onEndSession?: () => void;
};

export default function SessionTimer({ onEndSession }: SessionTimerProps) {
  const [time, setTime] = useState<string>('00:00');
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [seconds, setSeconds] = useState<number>(0);
  console.log({ seconds })

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => {
          const newSeconds = prevSeconds + 1;
          const minutes = Math.floor(newSeconds / 60);
          const remainingSeconds = newSeconds % 60;
          
          setTime(
            `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
          );
          
          return newSeconds;
        });
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const handleEndSession = () => {
    setIsRunning(false);
    if (onEndSession) onEndSession();
  };

  return (
    <div className="relative inline-grid h-9 grid-cols-[1fr_1fr] items-center text-sm font-medium bg-gray-300 p-0.5">
      <div className="pointer-events-none relative me-0.5 flex items-center justify-center px-2 text-center h-full bg-white">
        <div className="text-[10px] font-medium uppercase flex justify-between gap-3 items-center">
          <Clock className="inline-block h-4 w-4 text-red-400" />
          <h6 className="text-base font-bold uppercase">{time}</h6>
        </div>
      </div>
      <button 
        onClick={handleEndSession}
        className="pointer-events-auto relative ms-0.5 flex items-center justify-center px-2 text-center cursor-pointer"
      >
        <span className="text-[10px] font-medium uppercase">End Session</span>
      </button>
    </div>
  );
}