import React from "react";
import CharacterProfile from "./_components/CharacterProfile";
import CharacterBasicInfo from "./_components/CharacterBasicInfo";
import ExpandableDescription from "./_components/ExpandableDescription";
import CommentSection from "./_components/comment";
import { ScenarioSection } from "./_components/scenario";
import { ScenarioData } from "@/type/scenario";
import { Metadata } from "next";

const GAME_INTRO_MARKDOWN = `# [가상 오픈 월드 판타지 RPG]

현실감 넘치는 버추얼 온라인 게임 **'에버그린'**에 접속, 
여신 **'아프로디테'**와 만나 직업을 얻고, 모험가가 되거나 일상생활을 즐겨봅시다.

처음이라 어렵다면 먼저 **모험가 길드**에 들러보시는 게 어떨까요?

> **시스템 업데이트**  
> - \`!요약\` 명령어 추가. 스토리 저장용도입니다.  
> - 상태창 레벨 추가.  

### > 행동 키워드 일람 <

* 🙏 **여신에게 기도**: 여신 아프로디테와 이야기할 수 있습니다. 직업 및 능력 변경 가능.
* 🍳 **요리**: 가지고 있는 재료로 요리합니다.
* 🎣 **낚시**: 근처 강/바다에서 낚시합니다.
* 🗡️ **대장간**: 무기를 구매/판매/강화/분해합니다.
* 🧪 **포션상점**: 포션을 구매하거나 마법소재를 가공합니다. *(추후 마법상점 업데이트 예정)*
* 📦 **잡화점**: 요리도구/재료, 낚시도구/재료 등 생활용품을 판매합니다.
* 🛌 **여관**: 잠을 자서 체력을 회복하거나 식사를 할 수 있습니다.`;

const SCENARIO_MOCK: ScenarioData[] = [
  {
    id: "scenario-1",
    title: "기본 시나리오",
    content:
      "복도에는 남은 발자국 소리 하나뿐이었다. \n그녀는 조용히 뒤를 돌아보며 당신에게 손짓했다.",
    mainImage: "/images/scenario-main-1.png",
    charName: "이윤아",
    charProfile: "/images/profiles/yuna.png",
    charMessage: "잠깐 이리와. 별거 아니고, 금방 끝나.",
  },
  {
    id: "scenario-2",
    title: "방과 후의 교실",
    content:
      "노을이 지는 교실, 창가에 앉은 그가 책장을 넘긴다. \n정적을 깨고 그가 입을 열었다.",
    mainImage: "/images/scenario-main-2.png",
    charName: "강민우",
    charProfile: "/images/profiles/minwoo.png",
    charMessage: "아직 안 갔어? 기다려준 거야?",
  },
  {
    id: "scenario-3",
    title: "비 오는 날의 조우",
    content:
      "쏟아지는 빗줄기 속에서 우산도 없이 서 있는 그녀. \n당신을 발견하자마자 희미하게 웃는다.",
    mainImage: "/images/scenario-main-3.png",
    charName: "서하늘",
    charProfile: "/images/profiles/haneul.png",
    charMessage: "우산... 같이 써도 될까? 조금 춥네.",
  },
];

const TAG_LIST = ["판타지", "일상", "학원", "순애"];
const CHAR_CONTENT = `dfasf dfasf dfasfdfasfdfasfdfasf
safadfasfdfasf dfasfdfasfdfasf
dsfas dfasfdfasf dfasf
fadsfas fadsfasfadsfas fadsfas
fsafasdf
  `;

export const metadata: Metadata = {
  title: "캐릭터 정보",
};
const CharacterDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  console.log(id);
  return (
    <article className="px-5 pt-7.5 pb-25 flex justify-center w-full">
      <div className="flex gap-6.5">
        <CharacterProfile
          creatorImage="/p1.png"
          creatorName="FLAT Official"
          followerCount={5000}
          imageSrc="/images/sample.png"
        />

        <section className="flex flex-col w-full max-w-186">
          <div className="flex flex-col gap-4">
            <CharacterBasicInfo
              chatCount={50000}
              markdownContent={GAME_INTRO_MARKDOWN}
              tags={TAG_LIST}
              title="여사친이 자꾸 집에 쳐들어옴"
            />
          </div>
          <hr className="my-6 text-border-main" />
          <ExpandableDescription content={CHAR_CONTENT} />
          <hr className="my-6 text-border-main" />
          <ScenarioSection scenarioList={SCENARIO_MOCK} />
          <hr className="my-6 text-border-main" />
          <CommentSection />
        </section>
      </div>
    </article>
  );
};

export default CharacterDetailPage;
