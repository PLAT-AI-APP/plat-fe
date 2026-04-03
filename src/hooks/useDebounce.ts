import { useState, useEffect } from "react";

interface UseDebounceProps {
  value: string;
  delay: number;
}
export const useDebounce = ({ value, delay }: UseDebounceProps) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler); // 사용자가 다시 타이핑하면 이전 타이머를 취소함
    };
  }, [value, delay]);

  return debouncedValue;
};
