import SmartInput from "@/components/smart-input";
import { Close, Plus } from "@/icons";
import { cn } from "@/lib/utils";
import { CharacterCreateFormValues } from "@/schema/character.schema";
import React, { useRef, useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

interface ScenarioProps {
  activeScenarioIndex: number;
  setActiveScenarioIndex: (index: number) => void;
}

const Scenario = ({
  activeScenarioIndex,
  setActiveScenarioIndex,
}: ScenarioProps) => {
  const { control, watch, register } =
    useFormContext<CharacterCreateFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "scenarios",
  });
  // 전체 시나리오 데이터를 watch 합니다.
  const scenarios = useWatch({ control, name: "scenarios" });
  const currentIndex = activeScenarioIndex;
  const currentScenarioName =
    useWatch({ control, name: `scenarios.${currentIndex}.name` }) || "";

  const selectScenario = (index: number) => {
    setActiveScenarioIndex(index);
  };
  const addScenario = () => {
    if (fields.length >= 5) return alert("최대 5개까지 추가 가능합니다.");
    append({
      name: "다른 시나리오",
      contents: [],
    });
  };
  const removeScenario = (e: React.MouseEvent, index: number) => {
    e.stopPropagation(); // 삭제 버튼 클릭 시 시나리오가 선택되는 현상 방지

    if (fields.length <= 1) {
      return alert("최소 한 개의 시나리오는 있어야 합니다.");
    }

    // 삭제될 인덱스가 현재 활성화된 인덱스일 때의 처리
    if (index === activeScenarioIndex) {
      // 마지막 항목을 삭제하는 중이라면 이전 인덱스로, 아니면 유지(다음 항목이 올라옴)
      if (index === fields.length - 1) {
        setActiveScenarioIndex(index - 1);
      }
    }
    // 삭제될 인덱스가 현재 활성화된 인덱스보다 앞에 있다면 인덱스 하나 감소
    else if (index < activeScenarioIndex) {
      setActiveScenarioIndex(activeScenarioIndex - 1);
    }

    remove(index);
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
                onClick={() => !isDrag && selectScenario(i)} // 드래그 중에는 클릭이 무시되도록 처리
                className={cn(
                  "flex gap-1 items-center px-3 py-1.5 bg-card body-4 rounded-[100px] shrink-0 transition-all",
                  activeScenarioIndex === i
                    ? "border border-font-1 title-5"
                    : "text-font-2 hover:bg-card-hover border border-transparent",
                )}
              >
                {/* scenarios에서 해당 인덱스의 실시간 이름을 가져옵니다. */}
                {scenarios[i]?.name}

                {activeScenarioIndex === i && (
                  <Close
                    onClick={(e) => removeScenario(e, i)}
                    className="w-3 h-3"
                  />
                )}
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
        {...register(`scenarios.${currentIndex}.name`, {
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
