"use client";

import Checkbox from "@/icons/Checkbox";
import CheckboxEmpty from "@/icons/CheckboxEmpty";
import { cn } from "@/lib/utils";

interface CheckboxRowProps {
  checked: boolean;
  label: string;
  onToggle: () => void;
  className?: string;
}

/** 탈퇴 화면의 확인 체크 한 줄. 문구 전체를 눌러도 체크된다. */
const CheckboxRow = ({ checked, label, onToggle, className }: CheckboxRowProps) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={checked}
    className={cn(
      "body-5 flex items-start gap-1.5 text-left text-font-2 hover:text-font-1",
      className,
    )}
    onClick={onToggle}
  >
    {checked ? (
      <Checkbox className="size-5 shrink-0 text-font-1" />
    ) : (
      <CheckboxEmpty className="size-5 shrink-0 text-font-2" />
    )}
    <span>{label}</span>
  </button>
);

export default CheckboxRow;
