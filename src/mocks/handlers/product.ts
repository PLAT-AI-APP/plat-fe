import { http, HttpResponse } from "msw";
import { endpoint } from "../utils";
import type { Product } from "@/type/product";

const PRODUCT_PLATFORMS = ["IOS", "AOS", "WEB"] as const;
type ProductPlatform = (typeof PRODUCT_PLATFORMS)[number];

// 실서버 CreditProductResponse는 platform 필드도 함께 내려주지만, plat-fe는 웹만 서빙해
// 프론트 Product 타입에는 그 필드가 없습니다. 실제 응답 모양에 맞추기 위해 목업에만 추가합니다.
const mockProducts: (Product & { platform: ProductPlatform })[] = [
  {
    code: "NOTE_5000",
    productId: 1,
    platform: "WEB",
    display: { name: "노트 5,000", description: "노트 5,000개" },
    price: { currency: "KRW", amountMinor: 4900, taxIncluded: true },
    credits: { base: 5000, bonus: 0, total: 5000 },
  },
  {
    code: "NOTE_10000",
    productId: 2,
    platform: "WEB",
    display: { name: "노트 10,000", description: "노트 10,000개 + 보너스 500" },
    price: { currency: "KRW", amountMinor: 9900, taxIncluded: true },
    credits: { base: 10000, bonus: 500, total: 10500 },
  },
  {
    code: "NOTE_20000",
    productId: 3,
    platform: "WEB",
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
    platform: "WEB",
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
    platform: "WEB",
    display: {
      name: "노트 90,000",
      description: "노트 90,000개 + 보너스 11,000",
    },
    price: { currency: "KRW", amountMinor: 79900, taxIncluded: true },
    credits: { base: 90000, bonus: 11000, total: 101000 },
  },
];

export const productHandlers = [
  http.get(endpoint("/products"), ({ request }) => {
    const url = new URL(request.url);
    const platform = url.searchParams.get("platform");
    // 클라이언트가 자기 실행 환경을 밝히는 헤더. 있으면 platform과 값이 같은지 대조합니다.
    const clientPlatform = request.headers.get("x-client-platform");

    // 실서버는 platform이 없으면 MissingServletRequestParameterException → 공통 400(INVALID_REQUEST)으로 떨어집니다.
    if (!platform) {
      return HttpResponse.json(
        { code: "INVALID_REQUEST", message: "요청 형식이 올바르지 않습니다." },
        { status: 400 },
      );
    }

    // enum으로 바인딩되지 않는 값이면 실서버는 MethodArgumentTypeMismatchException → 같은 공통 400입니다.
    if (!PRODUCT_PLATFORMS.includes(platform as ProductPlatform)) {
      return HttpResponse.json(
        { code: "INVALID_REQUEST", message: "요청 형식이 올바르지 않습니다." },
        { status: 400 },
      );
    }

    // 헤더가 왔는데 platform과 다르면 DomainErrorCode.PRODUCT_PLATFORM_MISMATCH.
    // 헤더가 없는 구버전 클라이언트는 그냥 통과시킵니다(CreditProductController와 동일).
    if (clientPlatform && clientPlatform !== platform) {
      return HttpResponse.json(
        {
          code: "PRODUCT_PLATFORM_MISMATCH",
          message: "요청한 플랫폼이 접속 중인 클라이언트와 다릅니다.",
        },
        { status: 400 },
      );
    }

    return HttpResponse.json(
      mockProducts.filter((product) => product.platform === platform),
    );
  }),
];
