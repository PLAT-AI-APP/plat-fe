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
 * 하기 때문. 과도하게 넓어지는 것은 getCardGridTemplateColumns의 auto-fit + 열 개수
 * 계산(CARD_MIN_WIDTH)이 막아 준다.
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
 * 카드 그리드 컨테이너에 그대로 꽂아 쓰는 gridTemplateColumns 값.
 *
 * auto-fill이 아니라 auto-fit을 쓴다. 아이템 수가 열 개수보다 적을 때(예: limit=3인
 * "상황 에셋이 많은 캐릭터 미리보기"가 한 줄에 다 들어가는 경우) auto-fill은 빈 트랙을
 * 그대로 남겨 오른쪽에 gap보다 훨씬 큰 여백이 생긴다. auto-fit은 빈 트랙을 0으로
 * 접어 그 폭을 실제 아이템이 있는 트랙에 1fr로 재분배해, 카드가 남는 폭을 그대로
 * 나눠 갖고 진짜 gap만 남는다. 한 줄이 꽉 차는 경우는 auto-fill과 결과가 동일해
 * 다른 화면에는 영향이 없다.
 *
 * 상한을 1fr(가변)로 둔다. 고정 px 상한을 쓰면 auto-fit/auto-fill의 열 개수 계산이
 * 그 상한 기준으로 이루어져, 실제로는 min 기준으로 더 들어갈 수 있는 폭에서도 열이
 * 덜 채워지고 빈 공간이 남는다(예: 616px 컨테이너, min 186.67/max 240 → 3열이 들어갈
 * 수 있는데도 2열만 채워짐). 카드가 트랙보다 넓어지는 것은 열 개수 자체가 min 기준으로
 * 최대한 채워지므로 실질적으로 문제가 되지 않는다.
 *
 * auto-fit과 auto-fill은 열 개수 계산 방식은 동일하고, 아이템이 없는 트랙을 접느냐만
 * 다르다. limit이 있어 한 줄이 항상 꽉 차는 미리보기(홈 탭 등)는 auto-fit으로 빈
 * 트랙을 접어 카드가 남는 폭을 나눠 갖게 하고, 프로필의 찜 탭처럼 아이템 수가
 * 들쭉날쭉해 마지막 줄(또는 한 줄짜리 목록 전체)이 자주 덜 찰 수 있는 목록은
 * auto-fill로 빈 트랙을 남겨 카드가 늘어나지 않고 왼쪽 정렬 + 다른 탭과 같은
 * 크기를 유지하게 한다.
 *
 * min 값은 CSS 변수 --card-min-width로 감싸 CARD_MIN_WIDTH[size]를 기본값으로 쓴다.
 * 특정 화면 하나만 "한 줄 → 여러 줄로 바뀌는 폭 기준"을 다르게 주고 싶을 때, 공용
 * 상수를 건드리지 않고 CharacterShowcase의 className으로 이 변수만 오버라이드하면 된다
 * (예: className="[--card-min-width:194.335px]").
 */
export const getCardGridTemplateColumns = (
  size: CardSize,
  fillMode: "auto-fit" | "auto-fill" = "auto-fit",
) =>
  `repeat(${fillMode}, minmax(var(--card-min-width, ${CARD_MIN_WIDTH[size]}px), 1fr))`;

export const LAST_SWIPE_THRESHOLD = 40;

/**
 * 섹션이 한 줄에 몇 개를 보여줄지의 계약.
 *
 * auto-fit + minmax 는 컨테이너 폭에서 열 개수를 역산하므로 "몇 개 보인다"가
 * 확정되지 않는다. 디자인 검수와 QA 가 가능하려면 그 수가 고정이어야 한다.
 *
 * 기준은 콘텐츠 영역 폭 1200px(= --content-max-width). 컨테이너 쿼리를 쓰므로
 * 뷰포트가 아니라 카드가 실제로 놓이는 영역의 폭에 반응한다 — 사이드바를 펼치거나
 * 접어도 즉시 올바른 열 수로 맞춰진다.
 *
 *   1200px 기준 카드 폭: 6열 186.67px · 5열 227.2px · 3열 389.33px (gap 16px)
 */
export type CardColumnCount = 3 | 5 | 6;

export const CARD_COLUMNS_CLASS: Record<CardColumnCount, string> = {
  6: "grid-cols-2 @md:grid-cols-3 @2xl:grid-cols-4 @4xl:grid-cols-5 @6xl:grid-cols-6",
  5: "grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4 @6xl:grid-cols-5",
  3: "grid-cols-1 @2xl:grid-cols-2 @6xl:grid-cols-3",
};
