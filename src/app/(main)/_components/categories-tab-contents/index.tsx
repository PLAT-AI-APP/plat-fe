import React from "react";
import CharacterShowcase from "../CharacterShowcase";
import { Sort } from "@/icons";

export const DUMMY_CHARACTERS = [
  {
    id: "398292",
    name: "옆자리 불량학생",
    creatorName: "플랫메이커", // 새로 추가된 속성
    dec: "옆자리 불량학생이 매일 학교에서 일어나는 일들을 이야기해주는 채팅입니다.",
    tag: ["학교", "일상", "친구", "고교생", "츤데레"],
    img: "/images/sample.png", // URL 대신 실제 사용하실 샘플 이미지로 변경
  },
  {
    id: "398293",
    name: "다정한 동아리 선배",
    creatorName: "로맨스장인",
    dec: "언제나 나를 챙겨주는 다정한 사진부 선배와의 두근거리는 일상",
    tag: ["학교", "선배", "다정", "로맨스"],
    img: "/images/sample.png",
  },
  {
    id: "398294",
    name: "비밀을 아는 소꿉친구",
    creatorName: "스토리텔러",
    dec: "10년 지기 소꿉친구가 내 흑역사를 빌미로 장난을 치기 시작했다.",
    tag: ["일상", "소꿉친구", "장난스러움", "개그"],
    img: "/images/sample.png",
  },
  {
    id: "398295",
    name: "냉혹한 황태자",
    creatorName: "판타지조아",
    dec: "피도 눈물도 없는 제국의 황태자. 하지만 내게만은 다르다?",
    tag: ["판타지", "카리스마", "연상", "로맨스"],
    img: "/images/sample.png",
  },
  // 필요에 따라 객체를 더 복사해서 사용하세요.
];

const CategoriesTabContents = () => {
  return (
    <article className="flex grow w-full mt-13 bg-bg-darker">
      <div className="flex-1 flex flex-col gap-5.5 justify-start">
        <header className="flex items-center justify-between">
          검색 결과 12건
          <div className="px-3 py-2 bg-btn-hover rounded-lg inline-flex justify-center items-center gap-2">
            <Sort className="size-5" />

            {/* 텍스트 관련 테일윈드는 이전 요청 내용에 맞추어 정리할 수 있습니다 */}
            <div className="justify-start text-font-1 text-sm font-normal">
              최신순
            </div>
          </div>
        </header>

        <CharacterShowcase
          charArray={DUMMY_CHARACTERS}
          cardSize="M"
          columnGap={16}
          rowGap={16}
        />
      </div>
    </article>
  );
};

export default CategoriesTabContents;
