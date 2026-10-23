import { http, HttpResponse } from "msw";
import { endpoint } from "../utils";

// 결제 완료 이력이 없는 유저로 둔다. 비대상 화면은 false 로 바꿔 확인한다.
const mockFirstPurchaseEligibility = { eligible: true };

export const paymentHandlers = [
  http.get(endpoint("/payments/orders/first-purchase"), () => {
    return HttpResponse.json(mockFirstPurchaseEligibility);
  }),
];
