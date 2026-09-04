import { http, HttpResponse } from "msw";
import { endpoint } from "../utils";
import type { Product } from "@/type/product";

const mockProducts: Product[] = [
  {
    code: "NOTE_5000",
    productId: 1,
    display: { name: "노트 5,000", description: "노트 5,000개" },
    price: { currency: "KRW", amountMinor: 4900, taxIncluded: true },
    credits: { base: 5000, bonus: 0, total: 5000 },
  },
  {
    code: "NOTE_10000",
    productId: 2,
    display: { name: "노트 10,000", description: "노트 10,000개 + 보너스 500" },
    price: { currency: "KRW", amountMinor: 9900, taxIncluded: true },
    credits: { base: 10000, bonus: 500, total: 10500 },
  },
  {
    code: "NOTE_20000",
    productId: 3,
    display: {
      name: "노트 20,000",
      description: "노트 20,000개 + 보너스 2,500",
    },
    price: { currency: "KRW", amountMinor: 19900, taxIncluded: true },
    credits: { base: 20000, bonus: 2500, total: 22500 },
  },
  {
    code: "NOTE_46000",
    productId: 4,
    display: {
      name: "노트 46,000",
      description: "노트 46,000개 + 보너스 5,000",
    },
    price: { currency: "KRW", amountMinor: 30900, taxIncluded: true },
    credits: { base: 46000, bonus: 5000, total: 51000 },
  },
  {
    code: "NOTE_90000",
    productId: 5,
    display: {
      name: "노트 90,000",
      description: "노트 90,000개 + 보너스 11,000",
    },
    price: { currency: "KRW", amountMinor: 79900, taxIncluded: true },
    credits: { base: 90000, bonus: 11000, total: 101000 },
  },
];

export const productHandlers = [
  // 실서버는 platform 쿼리 파라미터가 필수라 없으면 400을 반환합니다. 목업도 동일하게 맞춥니다.
  http.get(endpoint("/products"), ({ request }) => {
    const url = new URL(request.url);
    const platform = url.searchParams.get("platform");

    if (!platform) {
      return HttpResponse.json(
        {
          code: "MISSING_PARAMETER",
          message: "platform 파라미터가 필요합니다.",
        },
        { status: 400 },
      );
    }

    return HttpResponse.json(mockProducts);
  }),
];
