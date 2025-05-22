"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const PayrollHeader = () => {
  const [timer, setTimer] = useState<string>("00:00");
  const [startTime] = useState<Date>(new Date());
  
  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      const minutes = Math.floor(diffInSeconds / 60);
      const seconds = diffInSeconds % 60;
      setTimer(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [startTime]);
  
  return (
    <Card className="border shadow-sm">
      <CardContent className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 rounded-full p-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 6V12L16 14" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-gray-700 font-medium">{timer}</span>
        </div>
        
        <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600">
          End Session
        </Button>
      </CardContent>
    </Card>
  );
};

export default PayrollHeader;