"use client";
import React, { useMemo } from "react";
import Image from "next/image";
import Scenario from "@/components/chat/Scenario";
import CharacterChat from "@/components/chat/CharacterChat";
import AiSuggestedChat from "./AiSuggestedChat";

interface ChatContentBlockProps {
  rawData: string; // "대사" {img:아이디} 지문... 형태의 문자열
  characterName: string;
  profileImage: string;
  showSuggestions: boolean;
}

const ChatContentBlock = ({
  rawData,
  characterName,
  profileImage,
  showSuggestions,
}: ChatContentBlockProps) => {
  // rawData에서 대사, 이미지 ID, 지문을 추출하는 파싱 로직
  const { chatText, image, scenario } = useMemo(() => {
    // 1. 대사 추출: " " 사이의 텍스트 (쌍따옴표 포함 매칭)
    const dialogueMatch = rawData.match(/"([^"]*)"/);

    // 2. 이미지 ID 추출: {img: } 사이의 값
    const imgMatch = rawData.match(/\{img:([^}]*)\}/);

    // 3. 지문(Scenario) 추출
    // dialogueMatch[0]은 "대사" 전체, imgMatch[0]은 {img:ID} 전체를 의미합니다.
    // 이 두 부분을 원본에서 지우면 나머지 텍스트만 남습니다.
    const scenarioText = rawData
      .replace(dialogueMatch ? dialogueMatch[0] : "", "")
      .replace(imgMatch ? imgMatch[0] : "", "")
      .trim();

    return {
      // 따옴표 안의 알맹이만 저장 (없으면 빈 문자열)
      chatText: dialogueMatch ? dialogueMatch[1] : "",

      // 이미지 태그가 없으면 null 대신 undefined 반환
      image: imgMatch ? imgMatch[1] : undefined,

      // 남은 모든 문자열
      scenario: scenarioText,
    };
  }, [rawData]);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 추출된 대사가 있다면 캐릭터 채팅 렌더링 */}
      {chatText && (
        <CharacterChat
          image={profileImage}
          chatText={chatText}
          CharacterName={characterName}
        />
      )}

      {/* 추출된 이미지 ID가 있다면 이미지 태그 렌더링 */}
      {image && (
        <Image
          // 이미지 경로는 프로젝트 구조에 맞게 수정하세요 (예: /images/4e5fw.png)
          src={image}
          alt="대화 속 캐릭터 이미지"
          width={0}
          height={0}
          unoptimized
          className="w-30 h-auto mx-auto rounded-2xl"
        />
      )}

      {/* 추출된 나머지 텍스트가 있다면 지문(Scenario) 렌더링 */}
      {scenario && <Scenario text={scenario} />}

      {showSuggestions && <AiSuggestedChat />}
    </div>
  );
};

export default React.memo(ChatContentBlock);
