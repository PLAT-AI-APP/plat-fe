import { http, HttpResponse } from "msw";
import { endpoint } from "../utils";
import type { UsageHistoryItemType } from "@/type/note";

const types: UsageHistoryItemType["type"][] = [
  "USE",
  "CHARGE",
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
      ledgerId: String(10000 - index),
      amount: isMinus ? -1 : 450,
      balanceAfter: 5000 - index * 10,
      type,
      referenceType: type === "USE" ? "CHAT" : "WALLET",
      referenceId: `mock-ledger-reference-${index}`,
      description: type === "USE" ? "채팅 1회 사용" : "웰컴 노트 크레딧 지급",
      createdAt: new Date(Date.now() - index * 3600000).toISOString(),
    };
  },
);

export const noteHandler = [
  http.get(endpoint("/wallet/ledgers"), ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? 0);
    const size = Number(url.searchParams.get("size") ?? 20);
    const start = page * size;
    const content = usageItems.slice(start, start + size);
    const totalPages = Math.ceil(usageItems.length / size);

    return HttpResponse.json({
      page: {
        number: page,
        size,
        numberOfElements: content.length,
        hasNext: page < totalPages - 1,
        first: page === 0,
        last: page >= totalPages - 1,
      },
      content,
    });
  }),
];
