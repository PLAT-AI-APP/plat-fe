import { Moon, Sun } from "@/icons";
import { cn } from "@/lib/utils";

interface SwitchProps {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
  /** 화면모드 스위치만 해·달 아이콘을 그린다. 다른 스위치는 빈 손잡이다. */
  themeIcon?: boolean;
  disabled?: boolean;
  /** md: 설정 화면 기본 크기. sm: 헤더처럼 좁은 자리. */
  size?: "md" | "sm";
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
} as const;

/** 켜고 끄는 스위치. 설정 화면과 헤더의 19 토글이 함께 쓴다. */
const Switch = ({
  checked,
  label,
  onChange,
  themeIcon = true,
  disabled,
  size = "md",
  className,
}: SwitchProps) => {
  const sizeStyle = SIZE[size];

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
        checked ? "bg-brand/20" : "bg-darkest",
        className,
      )}
    >
      <span
        className={cn(
          "absolute flex items-center justify-center rounded-2xl transition",
          sizeStyle.thumb,
          checked
            ? cn(sizeStyle.on, "bg-brand text-on-brand")
            : "translate-x-0 bg-font-disabled text-font-1",
        )}
      >
        {themeIcon &&
          (checked ? <Sun className="size-5" /> : <Moon className="size-5" />)}
      </span>
    </button>
  );
};

export default Switch;
