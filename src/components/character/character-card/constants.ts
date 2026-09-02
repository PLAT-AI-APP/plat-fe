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

/**
 * 카드가 카드 그리드 안에서 폭을 100%로 채워야 할 때(예: 그리드가 폭에 맞춰 열 개수를
 * 재계산하는 CharacterShowcase의 grid 레이아웃) 쓰는 대체 크기 세트.
 * 캐러셀·한 줄 나열처럼 카드 자체의 고정폭에 기대는 다른 화면은 SIZE_CONFIG(고정폭)를
 * 그대로 쓰고, 이 값은 fluid=true로 명시한 곳에서만 적용된다.
 */
export const FLUID_SIZE_OVERRIDE: Record<
  CardSize,
  { wrapper: string; imageArea: string }
> = {
  S: {
    wrapper: "w-full max-w-[240px] gap-2",
    imageArea: "w-full aspect-[187/245] rounded-[16px]",
  },
  M: {
    wrapper: "w-full max-w-[290px]",
    imageArea: "w-full aspect-square rounded-tl-2xl rounded-tr-2xl",
  },
  L: {
    wrapper: "w-full max-w-[500px] aspect-[389/379] rounded-2xl overflow-hidden",
    imageArea: "w-full h-full rounded-2xl",
  },
  XL: {
    wrapper: "w-full max-w-[500px]",
    imageArea: "w-full aspect-square rounded-t-2xl",
  },
};

/**
 * 카드 그리드가 줄어들 때 flex-wrap처럼 아무 데서나 줄바꿈되며 오른쪽에 빈 여백이
 * 남는 대신, 이 폭을 최소값으로 잡아 grid-template-columns: repeat(auto-fill, minmax(...))
 * 에 사용한다. 컨테이너 폭에 맞춰 열 개수가 정해지고, 남는 폭은 카드들이 고르게 나눠 가진다.
 */
export const CARD_MIN_WIDTH: Record<CardSize, number> = {
  S: 186.67,
  M: 227.2,
  L: 388.67,
  XL: 386.5,
};

/**
 * 남는 폭이 카드 1장 몫도 안 될 때(대표적으로 한 줄에 카드가 1장만 들어갈 때)
 * minmax(min, 1fr)만으로는 그 카드가 컨테이너 폭 전체로 늘어나 지나치게 커진다.
 * 카드가 커져도 되는 상한을 별도로 둬서 그 이상은 늘어나지 않게 한다.
 *
 * 이 값을 grid-template-columns의 minmax 상한으로 직접 쓰면 안 된다. auto-fill의
 * 열 개수는 상한이 고정 px(정해진 값)일 때 그 상한 기준으로 계산돼, 실제로는
 * min 기준으로 더 들어갈 수 있는 폭에서도 열이 덜 채워지고 오른쪽에 빈 공간이
 * 남는다(예: 616px 컨테이너, min 186.67/max 240 → 3열이 들어갈 수 있는데도 2열만
 * 채워짐). 그래서 grid 트랙 자체는 minmax(min, 1fr)로 두어 열 개수는 min 기준으로
 * 최대한 채우고, 이 상한은 FLUID_SIZE_OVERRIDE.wrapper의 max-width로 카드 자신에게만
 * 적용해 트랙보다 카드가 더 크게 늘어나는 것만 막는다.
 */
export const CARD_MAX_WIDTH: Record<CardSize, number> = {
  S: 240,
  M: 290,
  L: 500,
  XL: 500,
};

/**
 * 카드 그리드 컨테이너에 그대로 꽂아 쓰는 gridTemplateColumns 값.
 * 상한을 1fr(가변)로 둬야 auto-fill 열 개수 계산이 min 기준으로 이루어진다.
 * 실제 카드 폭 상한은 CARD_MAX_WIDTH를 쓰는 FLUID_SIZE_OVERRIDE.wrapper가 담당한다.
 */
export const getCardGridTemplateColumns = (size: CardSize) =>
  `repeat(auto-fill, minmax(${CARD_MIN_WIDTH[size]}px, 1fr))`;

export const LAST_SWIPE_THRESHOLD = 40;
