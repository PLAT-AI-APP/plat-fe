import type { ReactNode } from "react";
import { Moon, Sun } from "@/icons";
import { cn } from "@/lib/utils";

interface SwitchProps {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
  /** 화면모드 스위치만 해·달 아이콘을 그린다. 다른 스위치는 빈 손잡이다. */
  themeIcon?: boolean;
  disabled?: boolean;
  /** md: 설정 화면 기본 크기. sm: 헤더처럼 좁은 자리. label: 손잡이 안에 짧은 글자를 넣는 헤더용. */
  size?: "md" | "sm" | "label";
  /** 손잡이 안에 그릴 내용(예: 19). themeIcon 보다 우선한다. */
  thumbContent?: ReactNode;
  /** 켜졌을 때 색. brand: 기본. danger: 성인 콘텐츠처럼 주의가 필요한 스위치. */
  tone?: "brand" | "danger";
  className?: string;
}

const SIZE = {
  md: {
    track: "h-8.5 w-16.5",
    thumb: "left-0.75 top-0.75 size-7",
    on: "translate-x-8",
  },
  sm: {
    track: "h-5 w-9",
    thumb: "left-0.5 top-0.5 size-4",
    on: "translate-x-4",
  },
  label: {
    track: "h-7 w-[52px]",
    thumb: "left-0.5 top-0.5 size-6",
    on: "translate-x-6",
  },
} as const;

const TONE = {
  brand: {
    track: "bg-brand/20",
    thumb: "bg-brand text-on-brand",
    offTrack: "bg-darkest",
    offThumb: "bg-font-disabled text-font-1",
  },
  /** 성인 콘텐츠: 켜지면 붉은 트랙 위 흰 손잡이에 붉은 글자 — 지금 켜져 있다는 걸 멀리서도 알아보게 */
  danger: {
    track: "bg-danger shadow-[inset_0_1px_3px_rgba(0,0,0,0.25)]",
    thumb: "bg-white text-danger shadow-[0_2px_6px_rgba(0,0,0,0.3)]",
    offTrack: "bg-darkest ring-1 ring-inset ring-main",
    offThumb: "bg-card text-font-2 shadow-[0_1px_3px_rgba(0,0,0,0.25)]",
  },
} as const;

/** 켜고 끄는 스위치. 설정 화면과 헤더의 19 토글이 함께 쓴다. */
const Switch = ({
  checked,
  label,
  onChange,
  themeIcon = true,
  disabled,
  size = "md",
  thumbContent,
  tone = "brand",
  className,
}: SwitchProps) => {
  const sizeStyle = SIZE[size];
  const toneStyle = TONE[tone];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative shrink-0 rounded-full transition-colors disabled:opacity-60",
        sizeStyle.track,
        checked ? toneStyle.track : toneStyle.offTrack,
        className,
      )}
    >
      <span
        className={cn(
          "absolute flex items-center justify-center rounded-full transition duration-slow ease-[cubic-bezier(0.32,0.72,0,1)]",
          sizeStyle.thumb,
          checked
            ? cn(sizeStyle.on, toneStyle.thumb)
            : cn("translate-x-0", toneStyle.offThumb),
        )}
      >
        {thumbContent ??
          (themeIcon &&
            (checked ? <Sun className="size-5" /> : <Moon className="size-5" />))}
      </span>
    </button>
  );
};

export default Switch;
