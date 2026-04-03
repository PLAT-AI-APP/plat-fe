import React from "react";

interface OtpInputProps {
  code: string[];
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  handleChange: (index: number, value: string) => void;
  handleKeyDown: (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => void;
  // handlePaste: (e: React.ClipboardEvent) => void;
  timeLeft: number;
  error?: string;
}

const OtpInput = ({
  code,
  inputRefs,
  handleChange,
  handleKeyDown,
  // handlePaste,
  timeLeft,
  error,
}: OtpInputProps) => {
  // 시간 포맷 변환 함수 (300 -> 05:00)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <section id="otp-auth-section" className="flex flex-col gap-3">
      <p id="otp-auth-label" className="text-sm font-medium text-font-1">
        인증번호
      </p>

      <div
        id="otp-input-group"
        className="flex gap-1.5 justify-between"
        // onPaste={handlePaste}
      >
        {code.map((value, index) => (
          <input
            key={index}
            id={`otp-input-field-${index}`}
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
        {error ? (
          <p
            id="otp-error-message"
            className="text-sm font-medium text-font-accents"
          >
            {error}
          </p>
        ) : (
          <div />
        )}
        {/* 타이머 표시부 */}
        <span
          className={`text-sm flex gap-2 ${timeLeft > 0 ? "" : "text-font-accents"}`}
        >
          {timeLeft > 0 ? formatTime(timeLeft) : "0:00"}
          <button
            type="button"
            className="text-xs text-font-2 hover:text-font-1"
          >
            재전송
          </button>
        </span>
      </div>
    </section>
  );
};

export default React.memo(OtpInput);
