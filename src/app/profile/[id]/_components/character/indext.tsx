import React, { useRef, useState } from "react";
import Link from "next/link";
import { ModalLayout } from "@/components/ModalLayout";
import { Plus, Sort } from "@/icons";
import Check from "@/icons/Check";
import { cn } from "@/lib/utils";
import CharacterItem from "./CharacterItem";
import Header from "./Header";

export const CHARACTER_LIST_MOCK = [
  {
    id: "char-01",
    title: "옆자리 불량학생",
    thumbnail: "/images/sample.png",
    chatCount: 0,
    likeCount: 12,
    isPublic: true,
    languages: ["KO", "JA"],
  },
  {
    id: "char-02",
    title: "옆자리 불량학생",
    thumbnail: "/images/sample.png",
    chatCount: 123000, // 123K
    likeCount: 1000000, // 1M
    isPublic: false,
    languages: ["KO", "JA", "EN", "ZH", "VI", "TH"],
  },
];

const Character = () => {
  // 데이터 부재 시 렌더링 (Empty State)
  if (CHARACTER_LIST_MOCK.length <= 0)
    return (
      <section
        id="empty-character-section"
        className="h-50 flex flex-col items-center justify-center gap-4"
      >
        <header className="flex flex-col items-center gap-1">
          <span className="text-font-2">아직 캐릭터가 없어요</span>
          <span className="text-xs text-font-disabled">
            나만의 매력적인 AI 캐릭터를 만들어보세요
          </span>
        </header>

        <Link
          href={"/character-creat"}
          className="flex items-center w-fit gap-1 rounded-[100px] border border-border-main p-2 pl-3 text-sm text-font-2"
        >
          캐릭터 만들기
          <Plus className="w-3.5 h-3.5" />
        </Link>
      </section>
    );

  // 데이터 존재 시 렌더링 (List State)
  return (
    <section id="character-list-section" className="flex flex-col gap-1">
      <Header listCount={CHARACTER_LIST_MOCK.length} />

      <ul className="flex flex-col gap-4">
        {CHARACTER_LIST_MOCK.map(
          ({
            chatCount,
            id,
            isPublic,
            languages,
            likeCount,
            thumbnail,
            title,
          }) => (
            <li key={id}>
              <CharacterItem
                chatCount={chatCount}
                id={id}
                isPublic={isPublic}
                languages={languages}
                likeCount={likeCount}
                thumbnail={thumbnail}
                title={title}
              />
            </li>
          ),
        )}
      </ul>
    </section>
  );
};

export default Character;
