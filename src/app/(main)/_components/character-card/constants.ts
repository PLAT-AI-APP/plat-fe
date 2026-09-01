import type { CardSize, SizeConfig } from "./types";

/**
 * 카드 크기별 타입 배치.
 *
 * 카드가 커진다고 모든 글자가 같이 커지면 안 된다. 제목만 한 단계 올리고,
 * 설명과 메타(작성자·채팅수)는 카드 크기와 무관하게 낮은 단계를 유지해
 * 제목 → 설명 → 메타 순서가 어느 크기에서나 똑같이 읽히게 한다.
 *
 * L 은 정보 영역이 사진 위 어두운 그라디언트 위에 놓인다. 그 자리 글자는
 * 테마를 따라가면 안 되므로(라이트에서 검은 글자가 된다) overlay-font 를 쓴다.
 */
export const SIZE_CONFIG: Record<CardSize, SizeConfig> = {
  S: {
    wrapper: "w-[186.67px] gap-2",
    imageArea: "w-full h-[245px] rounded-[16px]",
    infoArea: "gap-0.5",
    title: "title-5 text-font-0",
    desc: "body-6 text-font-2",
    isIntegrated: false,
    creatorName: "body-6 text-font-2",
    chatCount: "body-6 text-font-2",
    chatCountIcon: "text-font-disabled",
  },
  M: {
    wrapper: "w-[227.2px]",
    imageArea: "w-full h-[227.2px] rounded-tl-2xl rounded-tr-2xl",
    infoArea: "px-4 py-4 gap-0.5 bg-darkest rounded-bl-2xl rounded-br-2xl",
    title: "title-5 text-font-0",
    desc: "body-6 text-font-2",
    isIntegrated: false,
    creatorName: "body-6 text-font-2",
    chatCount: "body-6 text-font-2",
    chatCountIcon: "text-font-disabled",
  },
  L: {
    wrapper: "size-96 rounded-2xl overflow-hidden",
    imageArea: "w-full h-full rounded-2xl",
    infoArea:
      "h-36 px-4 pt-6 pb-5 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.4)_20%,rgba(0,0,0,0.8)_100%)] gap-1",
    title: "title-3 text-overlay-font",
    desc: "body-5 text-overlay-font/70",
    creatorName: "body-6 text-overlay-font/60",
    isIntegrated: true,
    chatCount: "body-6 text-overlay-font/60",
    chatCountIcon: "text-overlay-font/50",
  },
  XL: {
    wrapper: "w-96.5 justify-between",
    imageArea: "w-full h-96 rounded-t-2xl",
    infoArea: "px-5 py-5 bg-darkest rounded-b-2xl gap-1.5",
    title: "title-3 text-font-0",
    desc: "body-5 text-font-2",
    isIntegrated: true,
    creatorName: "body-6 text-font-2",
    chatCount: "body-6 text-font-2",
    chatCountIcon: "text-font-disabled",
  },
};

export const LAST_SWIPE_THRESHOLD = 40;
