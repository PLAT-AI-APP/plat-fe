import SmartInput from "@/components/SmartInput";
import { Plus } from "@/icons";
import { cn } from "@/lib/utils";
import { CharacterCreateFormValues } from "@/type/character";
import React, { useRef, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

const Scenario = () => {
  const { control, watch, register } =
    useFormContext<CharacterCreateFormValues>();

  const { fields, append } = useFieldArray({
    control,
    name: "scenarioName",
  });
  // 전체 시나리오 데이터를 watch 합니다.
  const scenarios = watch("scenarioName");
  const [activeId, setActiveId] = useState<string>(fields[0].id);
  const currentIndex = fields.findIndex((f) => f.id === activeId);
  const currentScenarioName = watch(`scenarioName.${currentIndex}.name`) || "";

  const selectScenario = (id: string) => {
    setActiveId(id);
  };
  const addScenario = () => {
    append({
      name: "다른 시나리오",
      scenarioName: "",
    });
  };

  // 스크롤 관련
  const scrollRef = useRef<HTMLUListElement>(null);
  const [isDrag, setIsDrag] = useState(false);
  const [startX, setStartX] = useState(0);

  const onDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!scrollRef.current) return;

    setIsDrag(true);
    // 현재 클릭한 마우스 위치와 이미 스크롤된 양을 기록
    setStartX(e.pageX + scrollRef.current.scrollLeft);
  };

  const onDragEnd = () => {
    setIsDrag(false);
  };

  const onDragMove = (e: React.MouseEvent) => {
    if (!isDrag || !scrollRef.current) return;

    // 마우스가 움직인 만큼 스크롤 위치를 이동
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
          onMouseLeave={onDragEnd} // 마우스가 영역을 벗어나도 드래그 중지
          className={cn(
            "flex items-center gap-1.5 h-10 max-w-105 no-scrollbar overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-hide py-1 select-none",
            isDrag ? "cursor-grabbing" : "cursor-grab", // 잡고 있을 때 커서 모양 변경
          )}
        >
          {fields.map(
            (
              { id },
              i, // name 대신 인덱스 i를 가져옵니다.
            ) => (
              <li
                key={id}
                onClick={() => !isDrag && selectScenario(id)} // 드래그 중에는 클릭이 무시되도록 처리
                className={cn(
                  "px-3 py-1.5 bg-card text-sm rounded-[100px] shrink-0 transition-all",
                  activeId === id
                    ? "border border-font-1"
                    : "text-font-2 hover:bg-card-hover border border-transparent",
                )}
              >
                {/* scenarios에서 해당 인덱스의 실시간 이름을 가져옵니다. */}
                {scenarios[i]?.name}
              </li>
            ),
          )}
        </ul>
        <button
          type="button"
          onClick={addScenario}
          className="shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-card hover:bg-card-hover"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <SmartInput
        {...register(`scenarioName.${currentIndex}.name`, {
          required: true,
        })}
        label="시나리오명"
        required
        maxLength={20}
        value={currentScenarioName}
      />
    </section>
  );
};

export default Scenario;
