import { useState, useEffect, useCallback, useRef } from "react";

export const useCountdown = (initialSeconds: number = 300) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 타이머 시작/재시작
  const startTimer = useCallback(() => {
    setTimeLeft(initialSeconds);
    setIsActive(true);
  }, [initialSeconds]);

  // 타이머 중지
  const stopTimer = useCallback(() => {
    setIsActive(false);
  }, []);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  // 시간을 00:00 형식으로 변환하는 유틸리티
  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return { timeLeft, startTimer, stopTimer, isActive, formatTime };
};
