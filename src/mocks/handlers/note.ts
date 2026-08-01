import { http, HttpResponse } from "msw";
import { endpoint } from "../utils";
import type { UsageHistoryItemType } from "@/type/note";

const types: UsageHistoryItemType["type"][] = [
  "USE",
  "PURCHASE",
  "REFUND",
  "EVENT",
  "ADMIN_GRANT",
  "EXPIRE",
];

const usageItems: UsageHistoryItemType[] = Array.from(
  { length: 60 },
  (_, index) => {
    const type = types[index % types.length];
    const isMinus = type === "USE" || type === "EXPIRE";

    return {
      transactionId: String(10000 - index),
      transactionHash: `mock-transaction-${index}`,
      type,
      amount: isMinus ? -1 : 450,
      balanceAfter: 5000 - index * 10,
      description:
        type === "USE" ? "채팅 1회 사용" : "웰컴노트 크레딧 지급",
      detailDescription:
        type === "USE"
          ? "[chat][gemini-2.5-flash][1.0x] 캐릭터와 대화"
          : "[mock] 크레딧 내역",
      relatedCharacterName: type === "USE" ? "테스트 캐릭터" : "",
      createdAt: new Date(Date.now() - index * 3600000).toISOString(),
    };
  },
);

export const noteHandler = [
  http.get(endpoint("/credit/transactions"), ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? 0);
    const size = Number(url.searchParams.get("size") ?? 20);
    const start = page * size;
    const content = usageItems.slice(start, start + size);
    const totalPages = Math.ceil(usageItems.length / size);

    return HttpResponse.json({
      content,
      totalElements: usageItems.length,
      totalPages,
      number: page,
      size,
      first: page === 0,
      last: page >= totalPages - 1,
    });
  }),
];
