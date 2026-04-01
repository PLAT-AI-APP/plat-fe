"use client";
import CharacterGrid from "@/components/character/CharacterGrid";
import { MainBannerCarousel } from "@/components/MainBannerCarousel";
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
    <article
      id="home-container"
      className="flex flex-col gap-7.5 w-full flex-1"
    >
      {/* 메인 비주얼/슬라이드 영역 */}
      <MainBannerCarousel />

      <div className="max-w-300 w-full flex flex-col px-4 mx-auto gap-6.5 items-center">
        {/* 카테고리 필터 영역 */}
        <nav
          id="category-navigation"
          aria-label="캐릭터 카테고리"
          className="w-full flex gap-2 font-medium"
        >
          {categoryArray.map((category) => (
            <Link
              key={category.name}
              id={`category-link-${category.name}`} // 각 링크에도 고유 ID 부여 (트래킹 용이)
              href={category.link}
              className={`px-2.5 py-2 flex gap-1 items-center justify-center text-sm
          ${pathname === category.link ? "text-font-1 box-border border-b-2 border-brand" : "font-normal text-font-2 hover:text-font-1"}`}
            >
              {category.name}
              {category.icon && (
                <category.icon className="w-4.5 h-4.5 inline text-white" />
              )}
            </Link>
          ))}
        </nav>
        <div
          id="contents-wrapper"
          className="flex flex-col gap-15 w-full mx-auto"
        >
          {/* 오늘의 PICK 섹션 */}
          <section
            id="today-pick-section"
            className="w-full max-w-300 flex flex-col gap-4 justify-center"
          >
            <CharacterGrid
              char={CharArray}
              lineCount={2}
              cardHeight={277}
              title="오늘의 PICK"
            />
          </section>

          {/* 추천 신작 섹션 */}
          <section id="trending-new-section" className="flex flex-col gap-4">
            <CharacterGrid
              char={CharArray}
              lineCount={1}
              cardHeight={277}
              isNew={true}
              title="떠오르는 추천 신작"
              TitleLogo={<New className="w-4.5 h-4.5" />}
            />
          </section>

          {/* 공식 캐릭터 섹션 */}
          <section
            id="official-characters-section"
            className="flex flex-col gap-4"
          >
            <CharacterGrid
              char={CharArray}
              lineCount={1}
              cardHeight={277}
              isOfficial={true}
              title="플랫의 공식 캐릭터"
              TitleLogo={<Logo className="w-4.5 h-4.5" />}
            />
          </section>
        </div>
      </div>
    </article>
  );
}
