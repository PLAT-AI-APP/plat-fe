"use client";

import CheckboxEmpty from "@/icons/CheckboxEmpty";
import CheckboxFill from "@/icons/CheckboxFill";
import { cn } from "@/lib/utils";

interface CheckboxRowProps {
  checked: boolean;
  label: string;
  onToggle: () => void;
  /** plain: 문장 한 줄. card: 눌러 고르는 칸(동의 항목처럼 하나씩 확인시킬 때). */
  variant?: "plain" | "card";
  className?: string;
}

/** 탈퇴 화면의 확인 체크 한 줄. 문구 전체를 눌러도 체크된다. 체크하면 가입 약관 동의와 같은 주황 채움을 쓴다. */
const CheckboxRow = ({
  checked,
  label,
  onToggle,
  variant = "plain",
  className,
}: CheckboxRowProps) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={checked}
    className={cn(
      "flex items-center gap-2.5 text-left transition-colors",
      variant === "card"
        ? cn(
            "body-5 w-full rounded-2xl border px-4 py-3.5",
            checked
              ? "border-font-disabled bg-card text-font-1"
              : "border-main bg-dark text-font-2 hover:bg-card hover:text-font-1",
          )
        : cn("body-5 hover:text-font-1", checked ? "text-font-1" : "text-font-2"),
      className,
    )}
    onClick={onToggle}
  >
    {checked ? (
      <CheckboxFill className="size-5 shrink-0 text-brand" />
    ) : (
      <CheckboxEmpty className="size-5 shrink-0 text-font-2" />
    )}
    <span className="break-keep">{label}</span>
  </button>
);

export default CheckboxRow;
