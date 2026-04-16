import ActiveButton from "@/components/ActiveButton";
import CreatePreviewList from "./CreatePreviewList";
import { useScrollTimeout } from "@/hooks/useScrollTiemout";
import { Asterisk, ImageIcon, SendFill } from "@/icons";
import { cn } from "@/lib/utils";
import {
  CharacterCreateFormValues,
  ScenarioContentItem,
  ScenarioType,
} from "@/type/character";
import React, { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

interface CharacterPreviewProps {
  activeScenarioIndex: number;
}

const CharacterPreview = ({ activeScenarioIndex }: CharacterPreviewProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { watch, setValue, getValues } =
    useFormContext<CharacterCreateFormValues>();
  const scenarios = watch("scenarios");
  const characterName = watch("name") || "캐릭터";
  const contents = scenarios[activeScenarioIndex]?.contents || [];

  const [currentMode, setCurrentMode] = useState<ScenarioType>("chat");
  const handleCurrentMode = (name: ScenarioType) => {
    if (name === currentMode) return setCurrentMode("chat");
    setCurrentMode(name);
  };

  const handleUpdateContent = (id: number, newValue: string) => {
    const updatedContents = contents.map((item) =>
      item.id === id ? { ...item, value: newValue } : item,
    );
    setValue(`scenarios.${activeScenarioIndex}.contents`, updatedContents, {
      shouldValidate: true,
    });
  };

  const handleDeleteContent = (id: number) => {
    const updatedContents = contents.filter((item) => item.id !== id);
    setValue(`scenarios.${activeScenarioIndex}.contents`, updatedContents, {
      shouldValidate: true,
    });
  };

  const handleReorderContents = (newContents: ScenarioContentItem[]) => {
    setValue(`scenarios.${activeScenarioIndex}.contents`, newContents, {
      shouldValidate: true,
    });
  };

  const { isScrolling, onScroll } = useScrollTimeout();

  const [msg, setMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim()) return;

    const newContent = {
      id: Date.now(),
      type: currentMode,
      value: msg,
    };

    const currentContents =
      getValues(`scenarios.${activeScenarioIndex}.contents`) || [];
    setValue(
      `scenarios.${activeScenarioIndex}.contents`,
      [...currentContents, newContent],
      { shouldValidate: true },
    );
    setMsg("");

    // 브라우저가 새 요소를 렌더링한 후 실행되도록 보장
    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        container.scrollTo({
          top: container.scrollHeight, // 이제 새 요소 높이가 포함된 scrollHeight가 계산됨
          behavior: "smooth",
        });
      }
    });
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // {user} 삽입 함수
  const handleInsertUserToken = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart; // 현재 커서 시작 위치
    const end = textarea.selectionEnd; // 현재 커서 끝 위치
    const token = "{{user}}";
    const text = msg;

    // 현재 커서 위치에 {{user}} 삽입
    const before = text.substring(0, start);
    const after = text.substring(end);
    const newText = `${before}${token}${after}`;

    setMsg(newText);

    // 렌더링 후 커서 위치 조정
    setTimeout(() => {
      textarea.focus();
      // 커서를 삽입된 토큰 바로 뒤로 이동 (원래 위치 + 토큰 길이)
      const newCursorPos = start + token.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };
  return (
    <section className="flex flex-col justify-between flex-1 max-w-152.25 min-w-0 max-h-[calc(100vh-156px)]">
      <div
        onScroll={onScroll}
        ref={scrollContainerRef}
        className={cn(
          "flex-1 overflow-y-auto px-4 custom-scrollbar hide-scrollbar-on-idle",
          isScrolling && "is-scrolling",
        )}
      >
        <CreatePreviewList
          contents={contents}
          characterName={characterName}
          profileImage="/images/sample.png"
          isEditable={true}
          onUpdate={handleUpdateContent}
          onDelete={handleDeleteContent}
          onReorder={handleReorderContents}
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="shrink-0 px-3 py-3 mt-1.75 bg-bg-darkest rounded-4xl border border-border-main"
      >
        <textarea
          rows={2}
          ref={textareaRef}
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="메시지 보내기"
          className="mb-2 w-full text-sm placeholder:text-font-disabled outline-none bg-transparent"
        />

        <div className="flex justify-between">
          <div className="flex gap-2 text-sm text-font-2">
            <button
              type="button"
              onClick={() => handleCurrentMode("action")}
              className={cn(
                "flex items-center gap-1.5 py-1.5 pl-2.5 pr-3 rounded-[100px] border border-border-main bg-[#171D28]/50",
                currentMode === "action" && "text-brand border-brand",
              )}
            >
              <Asterisk className="w-4 h-4" />
              상황
            </button>
            <button
              type="button"
              onClick={() => handleCurrentMode("asset")}
              className={cn(
                "flex items-center gap-1.5 py-1.5 pl-2.5 pr-3 rounded-[100px] border border-border-main bg-[#171D28]/50",
                currentMode === "asset" && "text-brand border-brand",
              )}
            >
              <ImageIcon className="w-4 h-4" /> 에셋
            </button>
            <button
              type="button"
              onClick={handleInsertUserToken}
              className="flex items-center gap-1.5 py-1.5 pl-2.5 pr-3 rounded-[100px] border border-border-main bg-[#171D28]/50 "
            >
              {`{user}`}
            </button>
          </div>

          <ActiveButton
            isActive={msg.length > 0}
            text=""
            type="submit"
            className="w-8.5 h-8.5 flex items-center justify-center rounded-full"
          >
            <SendFill className="w-4.5 h-4.5" />
          </ActiveButton>
        </div>
      </form>
    </section>
  );
};

export default CharacterPreview;
