import CharacterGrid from "@/components/character/CharacterGrid";
import Footer from "@/components/Footer";
import { MainBannerCarousel } from "@/components/MainBannerCarousel";
import MenuTab from "./_components/MenuTab";

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

export default function Home() {
  return (
    <article id="home-container" className="flex flex-col w-full flex-1">
      <div className="flex flex-col gap-7.5 w-full">
        {/* 메인 비주얼/슬라이드 영역 */}
        <MainBannerCarousel />

        <div className="max-w-300 w-full flex flex-col px-4 mx-auto gap-6.5 items-center">
          {/* 카테고리 필터 영역 */}
          <MenuTab />

          <div
            id="contents-wrapper"
            className="flex flex-col gap-15 w-full mx-auto"
          >
            {/* 오늘의 PICK 섹션 */}
            <section
              id="today-pick-section"
              className="w-full h-auto max-w-300 flex flex-col gap-4 justify-center"
            >
              <CharacterGrid
                char={CharArray}
                lineCount={2}
                cardHeight={277}
                // title="오늘의 PICK"
              />
            </section>

            {/* 추천 신작 섹션 */}
            {/* <section id="trending-new-section" className="flex flex-col gap-4">
              <CharacterGrid
                char={CharArray}
                lineCount={1}
                cardHeight={277}
                isNew={true}
                title="떠오르는 추천 신작"
                TitleLogo={<New className="w-4.5 h-4.5" />}
              />
            </section> */}

            {/* 공식 캐릭터 섹션 */}
            {/* <section
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
            </section> */}
          </div>
        </div>
      </div>

      <Footer />
    </article>
  );
}
