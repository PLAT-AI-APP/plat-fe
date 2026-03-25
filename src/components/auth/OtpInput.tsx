import React from "react";

interface OtpInputProps {
  code: string[];
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  handleChange: (index: number, value: string) => void;
  handleKeyDown: (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => void;
  handlePaste: (e: React.ClipboardEvent) => void;
}

const OtpInput = ({
  code,
  inputRefs,
  handleChange,
  handleKeyDown,
  handlePaste,
}: OtpInputProps) => {
  return (
    <section id="otp-auth-section" className="flex flex-col gap-3">
      <p id="otp-auth-label" className="text-sm font-medium text-font-1">
        인증번호
      </p>

      <div
        id="otp-input-group"
        className="flex gap-1.5 justify-between"
        onPaste={handlePaste}
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
            className="w-11 h-11 shrink-0 text-center font-semibold text-lg bg-black/20 border border-white/20 rounded-lg focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all text-white"
          />
        ))}
      </div>
    </section>
  );
};

export default OtpInput;
