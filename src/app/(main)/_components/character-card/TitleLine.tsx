import { cn } from "@/lib/utils";
import React from "react";

interface TitleLineProps {
  title: string;
  titleClassName: string;
  icon: React.ReactNode;
}

const TitleLine = ({ title, titleClassName, icon }: TitleLineProps) => (
  <div className="flex w-full items-center gap-1.5">
    <h2 className={cn("min-w-0 truncate text-font-0", titleClassName)}>
      {title}
    </h2>
    {icon}
  </div>
);

export default TitleLine;
