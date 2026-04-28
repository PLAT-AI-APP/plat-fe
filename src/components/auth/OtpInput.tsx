"use client";

import React, { useState, useRef, memo, useCallback } from "react";
import { cn } from "@/lib/utils";

interface OtpInputProps {
  length?: number;
  timeLeft: number;
  error?: string;
  onComplete: (code: string) => void;
  onResend?: () => void;
}

/**
 * OTP(인증번호) 입력 컴포넌트
 */
const OtpInput = ({
  length = 6,
  timeLeft,
  error,
  onComplete,
  onResend,
}: OtpInputProps) => {
  const [code, setCode] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  /** 시간 포맷팅 (mm:ss) */
  const formatTime = (seconds: number) => {
    if (seconds <= 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  /** 특정 인덱스의 값을 변경하고 포커스를 조절하는 핸들러 */
  const handleChange = (index: number, value: string) => {
    const char = value.slice(-1); // 마지막 입력값만 취함
    if (char && !/^\d+$/.test(char)) return; // 숫자만 허용

    const newCode = [...code];
    newCode[index] = char;
    setCode(newCode);

    // 값이 입력되었으면 다음 칸으로 포커스 이동
    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // 모든 칸이 채워졌는지 확인 후 콜백 호출
    const fullCode = newCode.join("");
    if (fullCode.length === length) {
      onComplete(fullCode);
    }
  };

  /** 백스페이스 및 키보드 네비게이션 처리 */
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (!code[index] && index > 0) {
        // 현재 칸이 비어있으면 이전 칸으로 이동하며 삭제
        const newCode = [...code];
        newCode[index - 1] = "";
        setCode(newCode);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  /** 복사 붙여넣기(Paste) 지원 핸들러 */
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, length);
    if (!/^\d+$/.test(pasteData)) return; // 숫자일 때만 처리

    const newCode = pasteData.split("");
    const updatedCode = [...code];
    newCode.forEach((char, i) => {
      if (i < length) updatedCode[i] = char;
    });

    setCode(updatedCode);
    onComplete(updatedCode.join(""));

    // 마지막 입력 칸 혹은 데이터 길이만큼 포커스 이동
    const lastIdx = Math.min(newCode.length, length - 1);
    inputRefs.current[lastIdx]?.focus();
  };

  return (
    <section className="flex flex-col gap-3">
      <label className="text-sm font-medium text-font-1">인증번호</label>

      {/* 입력 필드 그룹 */}
      <div className="flex gap-2 justify-between" onPaste={handlePaste}>
        {code.map((value, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code" // 모바일 OTP 자동완성 지원
            maxLength={1}
            value={value}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={cn(
              "w-12 h-12 shrink-0 text-center font-bold text-xl bg-black/20 border border-white/10 rounded-lg",
              "focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all text-white",
              error && "border-font-accents",
              timeLeft <= 0 && "opacity-50 pointer-events-none", // 시간 만료 시 비활성화
            )}
          />
        ))}
      </div>

      {/* (에러 메시지 & 타이머) */}
      <div className="flex justify-between items-center min-h-6">
        <div className="flex-1">
          {error && (
            <p
              role="alert"
              className="text-[12px] font-medium text-font-accents animate-pulse"
            >
              {error}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span
            className={cn("text-sm", timeLeft <= 30 ? "text-font-accents" : "")}
          >
            {formatTime(timeLeft)}
          </span>
          <button
            type="button"
            onClick={onResend}
            className="text-xs font-medium text-font-2 hover:text-white transition-colors"
          >
            재전송
          </button>
        </div>
      </div>
    </section>
  );
};

export default memo(OtpInput);
