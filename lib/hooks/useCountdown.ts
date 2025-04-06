import { useEffect, useMemo, useState } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function useCountdown(endTime: Date | string | null) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Memoize the end time to prevent unnecessary re-renders
  const memoizedEndTime = useMemo(() => {
    if (!endTime) return null;
    return typeof endTime === 'string' ? new Date(endTime) : endTime;
  }, [endTime?.toString()]); // Use toString() to compare Date objects

  useEffect(() => {
    if (!memoizedEndTime) return;

    const calculateTimeLeft = () => {
      const difference = memoizedEndTime.getTime() - new Date().getTime();

      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    // Update immediately
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Cleanup
    return () => clearInterval(timer);
  }, [memoizedEndTime]); // Only re-run when memoizedEndTime changes

  return timeLeft;
} 