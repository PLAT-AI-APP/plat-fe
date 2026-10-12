import { http, HttpResponse } from "msw";
import { endpoint } from "../utils";
import type {
  CreatorTierInfo,
  CreatorTierStatus,
  EarningLedgerItem,
  EarningSummary,
  NoteConversionRequest,
  RedeemGiftCardRequest,
  RewardProduct,
  RewardRedemption,
} from "@/type/earning";

/*
 * 제작자 수익 목 데이터. 실서버 계약(plat-earning /earnings/**)과 같은 모양이다.
 * 상품권 신청·노트 전환은 목 안에서 잔액과 내역을 실제로 바꿔, 화면 흐름을 서버 없이 확인할 수 있게 한다.
 */

const MIN_REDEEM = 5000;

const summary: EarningSummary = {
  available: 12480,
  pending: 1320,
  tier: "PLANET",
  noteUnitPrice: 2.85,
  identityVerified: true,
};

const tierBenefits = [
  [],
  [{ label: "메인 우선 노출", value: "지원" }],
  [
    { label: "메인 우선 노출", value: "지원" },
    { label: "추천 작품 선정", value: "우대" },
  ],
  [
    { label: "메인 우선 노출", value: "지원" },
    { label: "추천 작품 선정", value: "우대" },
    { label: "특별 노출", value: "지원" },
    { label: "신기능 우선 체험", value: "제공" },
    { label: "전담 소통 채널", value: "제공" },
  ],
  [
    { label: "메인 우선 노출", value: "지원" },
    { label: "추천 작품 선정", value: "최우선" },
    { label: "특별 노출", value: "우선 지원" },
    { label: "신기능 우선 체험", value: "제공" },
    { label: "전담 소통 채널", value: "제공" },
    { label: "확장 협업 기회", value: "제공" },
  ],
];

/** 서버 시드와 같은 등급표. 목에서는 플래닛까지 올라 있고 노바 조건 중 팔로워만 모자란다. */
const tierInfos: CreatorTierInfo[] = (
  [
    ["DUST", 1, 1_000, 10, 1100, 200, 7, 0, "2026-02-11T05:00:00Z"],
    ["COMET", 2, 20_000, 50, 1200, 200, 7, 1000, "2026-05-03T12:00:00Z"],
    ["PLANET", 3, 100_000, 200, 1300, 300, 7, 5000, "2026-09-02T09:20:00Z"],
    ["NOVA", 5, 500_000, 500, 1400, 400, 5, 20000, null],
    ["GALAXY", 10, 2_000_000, 1000, 1500, 500, 3, 50000, null],
  ] as const
).map(
  (
    [code, characters, chats, followers, share, boost, hold, gift, achievedAt],
    index,
  ) => ({
    code,
    sortOrder: index + 1,
    minPublicUniverses: characters,
    minPaidTurns: chats,
    minFollowers: followers,
    shareBps: share,
    boostBps: boost,
    holdDays: hold,
    giftNotes: gift,
    benefits: tierBenefits[index],
    achievedAt,
  }),
);

const tierStatus: CreatorTierStatus = {
  currentTier: "PLANET",
  locked: false,
  celebrationPending: false,
  canPromote: false,
  publicUniverses: 5,
  paidTurns: 523_400,
  followers: 412,
  baseShareBps: 1000,
  baseHoldDays: 7,
  tiers: tierInfos,
};

const products: RewardProduct[] = [
  {
    productId: "1",
    name: "네이버페이 5,000원권",
    imageUrl: null,
    pointPrice: 5000,
  },
  {
    productId: "3",
    name: "네이버페이 10,000원권",
    imageUrl: null,
    pointPrice: 10000,
  },
];

const day = (daysAgo: number, hour = 0) =>
  new Date(Date.now() - daysAgo * 86_400_000 + hour * 3_600_000).toISOString();

const ledger = (
  item: Pick<
    EarningLedgerItem,
    "ledgerId" | "type" | "amount" | "balanceAfter" | "createdAt"
  > &
    Partial<EarningLedgerItem>,
): EarningLedgerItem => ({
  rewardType: null,
  productName: null,
  noteAmount: null,
  redemptionStatus: null,
  rejectReason: null,
  ...item,
});

const ledgers: EarningLedgerItem[] = [
  ledger({
    ledgerId: "10",
    type: "ACCRUE",
    amount: 584,
    balanceAfter: 12480,
    createdAt: day(1),
  }),
  ledger({
    ledgerId: "9",
    type: "ACCRUE",
    amount: 702,
    balanceAfter: 11896,
    createdAt: day(2),
  }),
  ledger({
    ledgerId: "8",
    type: "REDEEM",
    amount: -5000,
    balanceAfter: 11194,
    rewardType: "GIFT_CARD",
    productName: "네이버페이 5,000원권",
    redemptionStatus: "ISSUED",
    createdAt: day(3, 14),
  }),
  ledger({
    ledgerId: "7",
    type: "ACCRUE",
    amount: 1328,
    balanceAfter: 16194,
    createdAt: day(3),
  }),
  ledger({
    ledgerId: "5",
    type: "ACCRUE",
    amount: 2412,
    balanceAfter: 14866,
    createdAt: day(5),
  }),
  ledger({
    ledgerId: "4",
    type: "REDEEM",
    amount: -2000,
    balanceAfter: 12454,
    rewardType: "NOTE",
    productName: "노트 전환",
    noteAmount: 500,
    redemptionStatus: "ISSUED",
    createdAt: day(13, 20),
  }),
  ledger({
    ledgerId: "2",
    type: "REDEEM_CANCEL",
    amount: 5000,
    balanceAfter: 14454,
    rewardType: "GIFT_CARD",
    productName: "네이버페이 5,000원권",
    redemptionStatus: "REJECTED",
    rejectReason:
      "수신 번호가 올바르지 않아요. 번호를 확인한 뒤 다시 신청해 주세요.",
    createdAt: day(40, 16),
  }),
];

let sequence = 100;

/** KST 기준 달(YYYY-MM)의 내역만 최신순으로 자른다. */
const monthSlice = (url: URL) => {
  const month = url.searchParams.get("month") ?? "";
  const page = Number(url.searchParams.get("page") ?? 0);
  const size = Number(url.searchParams.get("size") ?? 20);
  const inMonth = ledgers.filter(
    (item) =>
      new Date(new Date(item.createdAt).getTime() + 9 * 3_600_000)
        .toISOString()
        .slice(0, 7) === month,
  );
  const content = inMonth.slice(page * size, page * size + size);
  return {
    page: {
      number: page,
      size,
      numberOfElements: content.length,
      hasNext: (page + 1) * size < inMonth.length,
    },
    content,
  };
};

const error = (status: number, code: string, message: string) =>
  HttpResponse.json({ code, message }, { status });

const insufficient = () =>
  error(422, "EARNING_INSUFFICIENT_POINTS", "교환 가능한 포인트가 부족합니다.");

export const earningHandlers = [
  http.get(endpoint("/earnings/summary"), () => HttpResponse.json(summary)),

  http.get(endpoint("/earnings/tier"), () => HttpResponse.json(tierStatus)),

  http.post(endpoint("/earnings/tier/promotions"), () =>
    HttpResponse.json(
      {
        code: "EARNING_TIER_NOT_ELIGIBLE",
        message: "다음 등급의 승급 조건을 아직 모두 채우지 못했습니다.",
      },
      { status: 422 },
    ),
  ),

  http.post(
    endpoint("/earnings/tier/celebration/ack"),
    () => new HttpResponse(null, { status: 204 }),
  ),

  http.get(endpoint("/earnings/ledgers"), ({ request }) =>
    HttpResponse.json(monthSlice(new URL(request.url))),
  ),

  http.get(endpoint("/earnings/reward-products"), () =>
    HttpResponse.json(products),
  ),

  http.post(endpoint("/earnings/redemptions"), async ({ request }) => {
    const body = (await request.json()) as RedeemGiftCardRequest;
    const product = products.find((item) => item.productId === body.productId);
    if (!product) {
      return error(
        404,
        "EARNING_PRODUCT_NOT_FOUND",
        "교환 상품을 찾을 수 없습니다.",
      );
    }
    if (product.pointPrice < MIN_REDEEM) {
      return error(
        422,
        "EARNING_BELOW_MIN_REDEEM",
        "최소 교환 포인트보다 적습니다.",
      );
    }
    if (summary.available < product.pointPrice) {
      return insufficient();
    }

    const now = new Date().toISOString();
    const redemption: RewardRedemption = {
      redemptionId: String((sequence += 1)),
      productName: product.name,
      type: "GIFT_CARD",
      pointAmount: product.pointPrice,
      noteAmount: null,
      status: "REQUESTED",
      requestedAt: now,
      processedAt: null,
      rejectReason: null,
    };
    summary.available -= product.pointPrice;
    ledgers.unshift(
      ledger({
        ledgerId: String((sequence += 1)),
        type: "REDEEM",
        amount: -product.pointPrice,
        balanceAfter: summary.available,
        rewardType: "GIFT_CARD",
        productName: product.name,
        redemptionStatus: "REQUESTED",
        createdAt: now,
      }),
    );
    return HttpResponse.json(redemption, { status: 201 });
  }),

  http.post(endpoint("/earnings/note-conversions"), async ({ request }) => {
    const { notes } = (await request.json()) as NoteConversionRequest;
    if (!Number.isInteger(notes) || notes <= 0) {
      return error(400, "EARNING_INVALID_INPUT", "입력값을 다시 확인해주세요.");
    }
    const cost = notes * summary.noteUnitPrice;
    if (summary.available < cost) {
      return insufficient();
    }

    const now = new Date().toISOString();
    summary.available -= cost;
    ledgers.unshift(
      ledger({
        ledgerId: String((sequence += 1)),
        type: "REDEEM",
        amount: -cost,
        balanceAfter: summary.available,
        rewardType: "NOTE",
        productName: "노트 전환",
        noteAmount: notes,
        redemptionStatus: "ISSUED",
        createdAt: now,
      }),
    );
    const redemption: RewardRedemption = {
      redemptionId: String((sequence += 1)),
      productName: "노트 전환",
      type: "NOTE",
      pointAmount: cost,
      noteAmount: notes,
      status: "ISSUED",
      requestedAt: now,
      processedAt: now,
      rejectReason: null,
    };
    return HttpResponse.json(redemption, { status: 201 });
  }),
];
