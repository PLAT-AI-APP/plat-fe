import { Message } from "@/icons";
import React from "react";

interface ScenarioProps {
  text: string;
  className?: string;
}

const Scenario = ({ text, className = "" }: ScenarioProps) => {
  return (
    <section id="scenario-item" className={`flex gap-5 ${className || ""}`}>
      <Message className="w-7 h-7 text-font-2 shrink-0" />
      <p className="body-4 text-font-2">{text}</p>
    </section>
  );
};

export default Scenario;
