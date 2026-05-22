import React from "react";
import CharacterCard from "../../CharacterCard";
import Link from "next/link";
import { cn } from "@/lib/utils";

// interface CharacterItem {
//   //   name: string;
//   //   chatCount: number;
//   //   dec: string;
//   //   tag?: string[];
//   //   img: string | string[];
//   //   creatorName?: string;
//   charArray: ;
// }

interface CharacterShowcaseProps {
  title: string; // 섹션 제목 (예: "오늘의 PICK", "주목받는 페르소나")
  charArray: {
    name: string;
    chatCount: number;
    dec: string;
    tag: string[];
    img: string[] | string;
  }[];
  cardSize?: "S" | "M" | "L" | "XL";
  limit?: number; // 보여줄 최대 카드 개수
  allViewLink?: string;
  TitleLogo?: React.ReactNode;
  columnGap?: number;
  rowGap?: number;
}

const CharacterShowcase = ({
  title,
  charArray = [],
  cardSize = "M",
  limit,
  allViewLink,
  TitleLogo,
  columnGap,
  rowGap,
}: CharacterShowcaseProps) => {
  // limit 속성이 있으면 해당 개수만큼만 자르고, 없으면 전체 렌더링
  const displayChars = limit ? charArray.slice(0, limit) : charArray;

  // 데이터가 아예 없을 때의 방어 로직 (선택 사항)
  if (displayChars.length === 0) return null;

  return (
    <section className="w-full h-auto max-w-300 flex flex-col gap-4 justify-center mx-auto">
      <header className="flex justify-between items-center pl-2">
        <h2 className="flex items-center gap-2 heading-3">
          {title} {TitleLogo && TitleLogo}
        </h2>

        {allViewLink && (
          <Link
            href={{
              query: {
                tab: allViewLink,
              },
            }}
            className="title-3 text-white underline"
          >
            전체보기
          </Link>
        )}
      </header>

      <div
        className={cn(
          "flex gap-4 flex-wrap",
          cardSize === "XL" && "justify-between",
        )}
        style={{
          gap: `${rowGap}px ${columnGap}px`, // rowGap과 columnGap을 한 번에 설정
        }}
      >
        {displayChars.map((char, index) => (
          <CharacterCard
            key={index} // 고유 키 보장
            size={cardSize} // 부모에서 받은 사이즈를 그대로 전달
            title={"char.name"}
            description={"char.dec"}
            creatorName={"char.creatorName"} // 더미가 아닌 실제 데이터 매핑
            chatCount={121}
            images={"/images/sample.png"}
          />
        ))}
      </div>
    </section>
  );
};

export default CharacterShowcase;
