"use client";

import React, { useState, useRef, memo } from "react";
import { cn } from "@/lib/utils";

interface OtpInputProps {
  length?: number;
  timeLeft: number;
  error?: string;
  onComplete: (code: string) => void; // 6자리 완성 시 호출
  onResend?: () => void;
}

const OtpInput = ({
  length = 6,
  timeLeft,
  error,
  onComplete,
  onResend,
}: OtpInputProps) => {
  const [code, setCode] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleChange = (index: number, value: string) => {
    const char = value.slice(-1);
    if (char && !/^\d+$/.test(char)) return;

    const newCode = [...code];
    newCode[index] = char;
    setCode(newCode);

    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    const fullCode = newCode.join("");
    if (fullCode.length === length) onComplete(fullCode);
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const newCode = [...code];
      newCode[index - 1] = "";
      setCode(newCode);
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <section className="flex flex-col gap-3">
      <p className="text-sm font-medium text-font-1">인증번호</p>
      <div className="flex gap-1.5 justify-between">
        {code.map((value, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-11 h-11 shrink-0 text-center font-semibold text-lg bg-black/20 border border-white/20 rounded-lg focus:border-font-1 focus:ring-1 outline-none transition-all text-white"
          />
        ))}
      </div>
      <div className="flex justify-between items-end min-h-5">
        <p className="text-sm font-medium text-font-accents">{error || ""}</p>
        <span
          className={cn(
            "text-sm flex gap-2",
            timeLeft <= 0 && "text-font-accents",
          )}
        >
          {timeLeft > 0 ? formatTime(timeLeft) : "0:00"}
          <button
            type="button"
            onClick={onResend}
            className="text-xs text-font-2 hover:text-font-1"
          >
            재전송
          </button>
        </span>
      </div>
    </section>
  );
};

export default memo(OtpInput);
