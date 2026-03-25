import { Eye, EyeOff } from "@/icons";

interface PasswordToggleProps {
  isVisible: boolean;
  onToggle: () => void;
}

export const PasswordToggle = ({
  isVisible,
  onToggle,
}: PasswordToggleProps) => {
  const Icon = isVisible ? Eye : EyeOff;

  return (
    <Icon onClick={onToggle} className="w-5 h-5 cursor-pointer text-font-1" />
  );
};
