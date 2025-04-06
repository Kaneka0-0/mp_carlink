"use client";

import { useEffect, useState } from "react";

type CountdownProps = {
  endDate: Date | string | number;
  onExpire?: () => void;
  className?: string;
};

export default function AuctionCountdown({
  endDate,
  onExpire,
  className = "",
}: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    // Convert any input type to Date object
    const targetDate = new Date(endDate).getTime();

    // Calculate initial time difference
    calculateTimeLeft(targetDate);

    // Set up interval to update the countdown
    const intervalId = setInterval(() => {
      const isFinished = calculateTimeLeft(targetDate);
      if (isFinished && !isExpired) {
        setIsExpired(true);
        if (onExpire) onExpire();
        clearInterval(intervalId);
      }
    }, 1000);

    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, [endDate, onExpire, isExpired]);

  const calculateTimeLeft = (targetDate: number): boolean => {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return true;
    }

    // Calculate time units
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    setTimeLeft({ days, hours, minutes, seconds });
    return false;
  };

  const formatNumber = (num: number): string => {
    return num < 10 ? `0${num}` : `${num}`;
  };

  if (isExpired) {
    return (
      <div className={`text-red-600 font-medium ${className}`}>
        Auction Ended
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="text-sm text-gray-500 mb-1">Auction ends in:</div>
      <div className="flex items-center space-x-3 text-teal-600 font-medium">
        <div className="flex flex-col items-center">
          <span className="text-lg">{timeLeft.days}</span>
          <span className="text-xs text-gray-500">Days</span>
        </div>
        <span className="text-lg">:</span>
        <div className="flex flex-col items-center">
          <span className="text-lg">{formatNumber(timeLeft.hours)}</span>
          <span className="text-xs text-gray-500">Hours</span>
        </div>
        <span className="text-lg">:</span>
        <div className="flex flex-col items-center">
          <span className="text-lg">{formatNumber(timeLeft.minutes)}</span>
          <span className="text-xs text-gray-500">Min</span>
        </div>
        <span className="text-lg">:</span>
        <div className="flex flex-col items-center">
          <span className="text-lg">{formatNumber(timeLeft.seconds)}</span>
          <span className="text-xs text-gray-500">Sec</span>
        </div>
      </div>
    </div>
  );
}
