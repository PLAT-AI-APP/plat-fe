"use client";

import React, { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import SmartInput from "@/components/smart-input";
import { Close, Plus } from "@/icons";
import { cn } from "@/lib/utils";
import { CharacterCreateFormValues } from "@/schema/character.schema";

interface ScenarioProps {
  activeScenarioIndex: number;
  setActiveScenarioIndex: (index: number) => void;
}

const Scenario = ({
  activeScenarioIndex,
  setActiveScenarioIndex,
}: ScenarioProps) => {
  const t = useTranslations("characterCreate.scenario");
  const { control, register } = useFormContext<CharacterCreateFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "scenarios",
  });
  const scenarios = useWatch({ control, name: "scenarios" });
  const currentIndex = activeScenarioIndex;
  const currentScenarioName =
    useWatch({ control, name: `scenarios.${currentIndex}.name` }) || "";

  const selectScenario = (index: number) => {
    setActiveScenarioIndex(index);
  };

  const addScenario = () => {
    if (fields.length >= 5) {
      alert(t("addLimitAlert"));
      return;
    }

    append({
      // 새 탭을 만들 때 보이는 기본 이름을 실제 input 값에도 같이 넣습니다.
      name: t("fallbackName", { index: fields.length + 1 }),
      contents: [],
    });
  };

  const removeScenario = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();

    if (fields.length <= 1) {
      alert(t("minRequiredAlert"));
      return;
    }

    if (index === activeScenarioIndex && index === fields.length - 1) {
      setActiveScenarioIndex(index - 1);
    } else if (index < activeScenarioIndex) {
      setActiveScenarioIndex(activeScenarioIndex - 1);
    }

    remove(index);
  };

  const scrollRef = useRef<HTMLUListElement>(null);
  const [isDrag, setIsDrag] = useState(false);
  const [startX, setStartX] = useState(0);

  const onDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!scrollRef.current) return;

    setIsDrag(true);
    setStartX(e.pageX + scrollRef.current.scrollLeft);
  };

  const onDragEnd = () => {
    setIsDrag(false);
  };

  const onDragMove = (e: React.MouseEvent) => {
    if (!isDrag || !scrollRef.current) return;
    scrollRef.current.scrollLeft = startX - e.pageX;
  };

  return (
    <section className="flex flex-col gap-6.5">
      <div className="flex items-center gap-1.5">
        <ul
          ref={scrollRef}
          onMouseDown={onDragStart}
          onMouseMove={onDragMove}
          onMouseUp={onDragEnd}
          onMouseLeave={onDragEnd}
          className={cn(
            "no-scrollbar scrollbar-hide flex h-8 max-w-[445px] select-none items-center gap-1.5 overflow-x-auto overflow-y-hidden whitespace-nowrap",
            isDrag ? "cursor-grabbing" : "cursor-grab",
          )}
        >
          {fields.map(({ id }, i) => (
            <li
              key={id}
              onClick={() => !isDrag && selectScenario(i)}
              className={cn(
                "body-4 flex h-8 shrink-0 items-center rounded-[100px] bg-card px-3 text-font-2 transition-none duration-0",
                activeScenarioIndex === i
                  ? "bg-brand/10 font-semibold text-brand-dark"
                  : "hover:bg-card-hover",
              )}
              style={{ transition: "none", animation: "none" }}
            >
              <div className="flex items-center gap-1">
                {scenarios[i]?.name || t("fallbackName", { index: i + 1 })}
                {activeScenarioIndex === i && (
                  <Close
                    onClick={(e) => removeScenario(e, i)}
                    className="h-3 w-3 text-brand-dark"
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={addScenario}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-card text-font-2 transition-none duration-0 hover:bg-card-hover"
          style={{ transition: "none", animation: "none" }}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <SmartInput
        {...register(`scenarios.${currentIndex}.name`, {
          required: true,
        })}
        label={t("nameLabel")}
        required
        maxLength={20}
        placeholderClassName="placeholder:text-font-2"
        counterClassName="text-font-disabled"
        value={currentScenarioName}
        helperMessage=""
      />
    </section>
  );
};

export default Scenario;
