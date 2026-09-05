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
    creatorName: "body-6 text-font-disabled",
    chatCount: "body-6 text-font-disabled",
    chatCountIcon: "text-font-disabled",
  },
  M: {
    wrapper: "w-[227.2px]",
    imageArea: "w-full h-[227.2px] rounded-tl-2xl rounded-tr-2xl",
    infoArea: "px-4 py-4 gap-0.5 bg-darkest rounded-bl-2xl rounded-br-2xl",
    title: "title-5 text-font-0",
    desc: "body-6 text-font-2",
    isIntegrated: false,
    creatorName: "body-6 text-font-disabled",
    chatCount: "body-6 text-font-disabled",
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
    creatorName: "body-6 text-font-disabled",
    chatCount: "body-6 text-font-disabled",
    chatCountIcon: "text-font-disabled",
  },
};

/**
 * 카드가 카드 그리드 안에서 폭을 100%로 채워야 할 때(예: 그리드가 폭에 맞춰 열 개수를
 * 재계산하는 CharacterShowcase의 grid 레이아웃) 쓰는 대체 크기 세트.
 * 캐러셀·한 줄 나열처럼 카드 자체의 고정폭에 기대는 다른 화면은 SIZE_CONFIG(고정폭)를
 * 그대로 쓰고, 이 값은 fluid=true로 명시한 곳에서만 적용된다.
 *
 * max-width로 카드 자체를 캡핑하지 않는다. 아이템 수가 열 개수보다 적어 트랙이 넓어지는
 * 상황(예: limit=3 미리보기가 한 줄에 다 들어갈 때)에도 카드가 트랙 폭을 그대로 채워야
 * 하기 때문. 카드가 과도하게 넓어지지 않게 막는 것은 CARD_COLUMNS_CLASS 의 열 계약이다.
 */
export const FLUID_SIZE_OVERRIDE: Record<
  CardSize,
  { wrapper: string; imageArea: string }
> = {
  S: {
    wrapper: "w-full gap-2",
    imageArea: "w-full aspect-[187/245] rounded-[16px]",
  },
  M: {
    wrapper: "w-full",
    imageArea: "w-full aspect-square rounded-tl-2xl rounded-tr-2xl",
  },
  L: {
    // non-fluid(size-96)와 같은 1:1. 같은 size 인데 배치 방식에 따라 비율이
    // 달라지면 "카드 비율 고정"이 성립하지 않는다.
    wrapper: "w-full aspect-square rounded-2xl overflow-hidden",
    imageArea: "w-full h-full rounded-2xl",
  },
  XL: {
    wrapper: "w-full",
    imageArea: "w-full aspect-square rounded-t-2xl",
  },
};

/**
 * 카드 한 장의 기준 폭(px). 콘텐츠 영역 1200px 에서의 폭이다.
 *
 * 격자는 열 계약이 폭을 정하므로 이 값을 쓰지 않는다. 쓰는 곳은 가로 캐러셀 하나다 —
 * 캐러셀은 "한 줄에 몇 개"가 아니라 "카드 한 장이 몇 px"로 슬라이드 폭이 정해지고,
 * 남는 것은 옆으로 밀어서 본다. 화면이 카드보다 좁으면 카드가 화면을 넘지 않게
 * 100% 로 잘린다(min()).
 */
export const CARD_BASE_WIDTH: Record<CardSize, number> = {
  S: 186.67,
  M: 227.2,
  L: 388.67,
  XL: 386.5,
};

export const LAST_SWIPE_THRESHOLD = 40;

/**
 * 섹션이 한 줄에 몇 개를 보여줄지의 계약.
 *
 * 예전에는 이 계약을 쓰는 섹션(홈 탭)과 auto-fit + minmax 로 열 수를 역산하는 섹션
 * (프로필·공식·스튜디오)과 고정폭 카드를 flex-wrap 하는 섹션(랭킹·신작·검색)이 섞여 있었다.
 * 같은 size="S" 카드가 화면에 따라 폭 171px 로도, 358px 로도 그려져 "카드 크기"라는 말이
 * 성립하지 않았다. 이제 카드 격자는 이 표 하나만 쓴다(CardGrid).
 *
 * 기준은 콘텐츠 영역 폭 1200px(= --content-max-width). 컨테이너 쿼리를 쓰므로
 * 뷰포트가 아니라 카드가 실제로 놓이는 영역의 폭에 반응한다 — 사이드바를 펼치거나
 * 접어도 즉시 올바른 열 수로 맞춰진다.
 *
 *   1200px 기준 카드 폭: 6열 186.67px · 5열 227.2px · 3열 389.33px (gap 16px)
 *
 * 단계는 "어느 폭에서도 카드가 기준 폭 근처에 머무르도록" 잡는다. 열이 늘어나는 지점을
 * 늦게 두면 마지막 한 열이 남는 폭을 전부 먹어 카드가 기준의 1.5~2배로 부푼다.
 *
 *   6열: 139~216px · 5열: 152~279px · 3열: 280~575px
 */
export type CardColumnCount = 3 | 5 | 6;

export const CARD_COLUMNS_CLASS: Record<CardColumnCount, string> = {
  6: "grid-cols-2 @md:grid-cols-3 @2xl:grid-cols-4 @4xl:grid-cols-5 @6xl:grid-cols-6",
  5: "grid-cols-2 @xl:grid-cols-3 @3xl:grid-cols-4 @5xl:grid-cols-5",
  3: "grid-cols-1 @xl:grid-cols-2 @4xl:grid-cols-3",
};

/**
 * 카드 크기가 정해지면 한 줄에 몇 개인지도 정해진다 — 같은 크기의 카드가 화면마다
 * 다른 열 수로 깔리면 크기 자체가 의미를 잃는다. 그래서 열 수는 기본값이 있고,
 * 섹션이 특별히 다르게 보여야 할 때만 columns 로 덮어쓴다.
 */
export const DEFAULT_CARD_COLUMNS: Record<CardSize, CardColumnCount> = {
  S: 6,
  M: 5,
  L: 3,
  XL: 3,
};
