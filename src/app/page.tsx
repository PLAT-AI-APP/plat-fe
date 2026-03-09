"use client";
import CharacterGrid from "@/components/character/CharacterGrid";
import Logo from "@/icons/Logo";
import New from "@/icons/New";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Home() {
  const pathname = usePathname();

  const categoryArray = [
    {
      name: "홈",
      link: "/",
    },
    {
      name: "랭킹",
      link: "/ranking",
    },
    {
      name: "신작",
      link: "/new",
      icon: New,
    },
    {
      name: "카테고리",
      link: "/categories",
    },
  ];

  const CharArray = [
    {
      name: "옆자리 불량학생",
      chatCount: 123,
      dec: "옆자리 불량학생이 매일 학교에서 일어나는 일들을 이야기해주는 채팅입니다.",
      tag: ["학교", "일상", "친구", "친구", "친구", "친구"],
      img: "https://picsum.photos/200/300",
    },
    {
      name: "옆자리 불량학생",
      chatCount: 123,
      dec: "옆자리 불량학생이 매일 학교에서 일어나는 일들을 이야기해주는 채팅입니다.",
      tag: ["학교", "일상", "친구", "친구", "친구", "친구"],
      img: "https://picsum.photos/200/300",
    },
    {
      name: "옆자리 불량학생",
      chatCount: 123,
      dec: "옆자리 불량학생이 매일 학교에서 일어나는 일들을 이야기해주는 채팅입니다.",
      tag: ["학교", "일상", "친구", "친구", "친구", "친구"],
      img: "https://picsum.photos/200/300",
    },
    {
      name: "옆자리 불량학생",
      chatCount: 123,
      dec: "옆자리 불량학생이 매일 학교에서 일어나는 일들을 이야기해주는 채팅입니다.",
      tag: ["학교", "일상", "친구", "친구", "친구", "친구"],
      img: "https://picsum.photos/200/300",
    },
    {
      name: "옆자리 불량학생",
      chatCount: 123,
      dec: "옆자리 불량학생이 매일 학교에서 일어나는 일들을 이야기해주는 채팅입니다.",
      tag: ["학교", "일상", "친구", "친구", "친구", "친구"],
      img: "https://picsum.photos/200/300",
    },
    {
      name: "옆자리 불량학생",
      chatCount: 123,
      dec: "옆자리 불량학생이 매일 학교에서 일어나는 일들을 이야기해주는 채팅입니다.",
      tag: ["학교", "일상", "친구", "친구", "친구", "친구"],
      img: "https://picsum.photos/200/300",
    },
    {
      name: "옆자리 불량학생",
      chatCount: 123,
      dec: "옆자리 불량학생이 매일 학교에서 일어나는 일들을 이야기해주는 채팅입니다.",
      tag: ["학교", "일상", "친구", "친구", "친구", "친구"],
      img: "https://picsum.photos/200/300",
    },
    {
      name: "옆자리 불량학생",
      chatCount: 123,
      dec: "옆자리 불량학생이 매일 학교에서 일어나는 일들을 이야기해주는 채팅입니다.",
      tag: ["학교", "일상", "친구", "친구", "친구", "친구"],
      img: "https://picsum.photos/200/300",
    },
  ];
  return (
    <div className="flex flex-col gap-7.5 w-full flex-auto">
      <div>슬라이드</div>

      <div className="flex flex-col px-4 gap-6.5">
        {/* 카테고리 영역 */}
        <div className="flex gap-2 font-medium">
          {categoryArray.map((category) => (
            <Link
              key={category.name}
              href={category.link}
              className={`px-2.5 py-2 flex gap-1 items-center justify-center text-sm
            ${pathname === category.link ? "text-font-1 box-border border-b-2 border-brand" : "text-font-2 hover:text-font-1"}`}
            >
              {category.name}
              {category.icon && (
                <category.icon className="w-4.5 h-4.5 inline text-white" />
              )}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-15 w-full mx-auto">
          {/* 오늘의 PICK */}
          <div className="flex flex-col gap-4">
            <h1 className="pl-2 font-semibold text-[21px]">오늘의 PICK</h1>
            <CharacterGrid char={CharArray} lineCount={2} cardHeight={277} />
          </div>

          {/* 추천 신작 */}
          <div className="flex flex-col gap-4">
            <h1 className="pl-2 font-semibold text-[21px] flex gap-2.5 items-center">
              떠오르는 추천 신작 <New className="w-4.5 h-4.5" />
            </h1>
            <CharacterGrid
              char={CharArray}
              lineCount={1}
              cardHeight={277}
              isNew={true}
            />
          </div>

          {/* 플랫의 공식 캐릭터 */}
          <div className="flex flex-col gap-4">
            <h1 className="pl-2 font-semibold text-[21px] flex gap-2.5 items-center">
              플랫의 공식 캐릭터 <Logo className="w-4.5 h-4.5" />
            </h1>
            <CharacterGrid
              char={CharArray}
              lineCount={1}
              cardHeight={277}
              isOfficial={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
