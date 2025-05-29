'use client';

import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  duration: number; // Duration in seconds
  onComplete: () => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ duration, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft === 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-center text-sm text-gray-600">
      <span>Processing... Please refresh in: </span>
      <span className="ml-1 font-medium">{formatTime(timeLeft)}</span>
    </div>
  );
};