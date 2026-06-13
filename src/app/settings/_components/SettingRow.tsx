import { cn } from "@/lib/utils";

interface SettingRowProps {
  children?: React.ReactNode;
  className?: string;
  title: string;
  titleClassName?: string;
}

const SettingRow = ({
  children,
  className,
  title,
  titleClassName,
}: SettingRowProps) => {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-between gap-6 py-3",
        className,
      )}
    >
      <p className={cn("title-2 text-font-1", titleClassName)}>{title}</p>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
};

export default SettingRow;
