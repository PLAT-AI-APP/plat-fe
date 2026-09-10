import { useState, useEffect, useCallback, useRef } from "react";

export const useCountdown = (initialSeconds: number = 300) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isStarted, setIsStarted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 타이머 시작/재시작
  const startTimer = useCallback(() => {
    setTimeLeft(initialSeconds);
    setIsStarted(true);
  }, [initialSeconds]);

  // 타이머 중지
  const stopTimer = useCallback(() => {
    setIsStarted(false);
  }, []);

  useEffect(() => {
    if (!isStarted) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        // 0에 닿으면 인터벌이 스스로 멈춘다. 효과 본문에서 setState 를 호출하면
        // 그 자리에서 연쇄 렌더가 시작되므로 갱신은 전부 이 콜백 안에서만 한다.
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isStarted]);

  // "돌고 있는가"는 별도 상태가 아니라 파생값이다. 상태로 두면 0에 닿는 순간을
  // 효과에서 다시 setState 해 주어야 해서 위 문제가 그대로 돌아온다.
  const isActive = isStarted && timeLeft > 0;

  // 시간을 00:00 형식으로 변환하는 유틸리티
  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return { timeLeft, startTimer, stopTimer, isActive, formatTime };
};
