"use client";
import React, { useMemo } from "react";
import Image from "next/image";
import Scenario from "@/components/chat/Scenario";
import CharacterChat from "@/components/chat/CharacterChat";
import { Close, Pen, Trash } from "@/icons";
import Check from "@/icons/Check";
import { parsePlat } from "@/lib/platParse";

interface ChatContentBlockProps {
  rawData: string;
  characterName: string;
  profileImage: string;
  isEditMode?: boolean;
  onUpdate?: (newContent: string) => void;
  onDelete?: () => void;
}

const ChatContentBlock = ({
  rawData,
  characterName,
  profileImage,
  isEditMode = false,
  onUpdate,
  onDelete,
}: ChatContentBlockProps) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedContent, setEditedContent] = React.useState(rawData);

  React.useEffect(() => {
    setEditedContent(rawData);
  }, [rawData]);

  const handleUpdate = () => {
    onUpdate?.(editedContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(rawData);
    setIsEditing(false);
  };

  /**
   * 1. 데이터 파싱 로직 교체
   * 정규식 대신 파서를 사용하여 순서가 보장된 블록 배열을 생성합니다.
   */
  const blocks = useMemo(() => parsePlat(rawData), [rawData]);

  if (isEditing) {
    return (
      <div className="flex gap-2 items-end">
        <div className="flex flex-1 h-fit gap-2 bg-card p-2.5 rounded-[0px_16px_16px_16px]">
          <textarea
            ref={(el) => {
              if (!el) return;
              el.style.height = "auto"; // 초기화
              el.style.height = el.scrollHeight + "px"; // 내용만큼 늘림
            }}
            className="w-full resize-none overflow-hidden bg-card-hover p-2.5 rounded-[0px_16px_16px_16px] text-sm font-medium outline-none"
            value={editedContent}
            onChange={(e) => {
              setEditedContent(e.target.value);
            }}
          />
        </div>
        <div className="flex shrink-0 gap-1 text-font-2 h-fit">
          <button
            onClick={handleCancel}
            className="p-1.5 rounded-lg hover:bg-btn-hover flex items-center justify-center"
          >
            <Close className="w-4 h-4" />
          </button>
          <button
            onClick={handleUpdate}
            className="p-1.5 rounded-lg hover:bg-btn-hover flex items-center justify-center"
          >
            <Check className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/** * 2. 렌더링 로직 교체
       * 기존 스타일링(gap-6 등)은 그대로 유지하면서 블록 타입에 맞춰 렌더링합니다.
       */}
      {blocks.map((block, index) => {
        if (block.type === "DIALOGUE") {
          return (
            <CharacterChat
              key={index}
              image={profileImage}
              chatText={block.content}
              CharacterName={characterName}
            />
          );
        }

        if (block.type === "ASSET_IMG") {
          return (
            <Image
              key={index}
              src={block.code}
              alt="대화 속 캐릭터 이미지"
              width={0}
              height={0}
              unoptimized
              className="w-30 h-auto mx-auto rounded-2xl"
            />
          );
        }

        if (block.type === "NARRATIVE") {
          // Scenario 컴포넌트가 string을 받으므로 segments를 합쳐서 전달합니다.
          const fullText = block.segments
            .map((s) => (s.type === "TEXT" ? s.value : "{{user}}"))
            .join("");

          return (
            <div key={index}>
              <Scenario text={fullText} />
            </div>
          );
        }

        return null;
      })}

      {isEditMode && (
        <div className="flex gap-1 pl-12 -mt-4">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 rounded-lg hover:bg-btn-hover"
          >
            <Pen className="w-4 h-4 text-font-2" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg hover:bg-btn-hover"
          >
            <Trash className="w-4 h-4 text-font-2" />
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(ChatContentBlock);
