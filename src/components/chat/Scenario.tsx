import React from "react";
import { Message } from "@/icons";

interface ScenarioProps {
  text: string;
  className?: string;
}

const Scenario = ({ text, className = "" }: ScenarioProps) => {
  return (
    <section id="scenario-item" className={`flex gap-5 ${className}`}>
      <Message className="size-6 shrink-0 text-font-2" />
      <p className="body-5 whitespace-pre-wrap text-font-2">{text}</p>
    </section>
  );
};

export default Scenario;
