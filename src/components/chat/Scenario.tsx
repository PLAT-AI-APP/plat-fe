import React from "react";
import { Message } from "@/icons";
import { cn } from "@/lib/utils";

interface ScenarioProps {
  text: string;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}

const Scenario = ({
  text,
  className,
  iconClassName = "size-6",
  textClassName,
}: ScenarioProps) => {
  return (
    <section id="scenario-item" className={cn("flex gap-5", className)}>
      <Message className={cn("shrink-0 text-font-2", iconClassName)} />
      <p className={cn("body-5 whitespace-pre-wrap text-font-2", textClassName)}>
        {text}
      </p>
    </section>
  );
};

export default Scenario;
