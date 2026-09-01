import { Moon, Sun } from "@/icons";
import { cn } from "@/lib/utils";

interface SettingToggleProps {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}

const SettingToggle = ({ checked, label, onChange }: SettingToggleProps) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-8.5 w-16.5 rounded-4xl transition-colors",
        checked ? "bg-brand/20" : "bg-darkest",
      )}
    >
      <span
        className={cn(
          "absolute top-0.75 flex size-7 items-center justify-center rounded-[15px] transition-all",
          checked
            ? "left-8.75 bg-brand text-on-brand"
            : "left-0.75 bg-font-disabled text-font-1",
        )}
      >
        {checked ? <Sun className="size-5" /> : <Moon className="size-5" />}
      </span>
    </button>
  );
};

export default SettingToggle;
