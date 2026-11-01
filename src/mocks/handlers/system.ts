import { http, HttpResponse } from "msw";
import { endpoint } from "../utils";

/**
 * 앱이 첫 화면에서 부르는 공통 API. 목업에 없으면 워커가 실제 서버로 넘기다 실패해
 * 요청이 TIMEOUT 으로 끝나므로, 평소 상태(점검 없음 · 동의 완료)를 돌려준다.
 */
export const systemHandlers = [
  http.get(endpoint("/system/maintenance"), () =>
    HttpResponse.json({
      phase: "OPEN",
      drainStartsAt: null,
      closesAt: null,
      expectedEndsAt: null,
      message: null,
    }),
  ),

  http.get(endpoint("/system/site-settings"), () =>
    HttpResponse.json({
      companyName: "PLAT",
      representative: "",
      businessNumber: "",
      mailOrderNumber: "",
      address: "",
      phone: "",
      email: "",
      supportHours: "",
      privacyOfficer: "",
      privacyOfficerContact: "",
    }),
  ),

  /** 필수 동의를 모두 받은 상태. pending 이 비어 있어야 동의 화면이 끼어들지 않는다. */
  http.get(endpoint("/users/me/agreements"), () =>
    HttpResponse.json({ pending: [], firstConsent: false, marketingAgreed: false }),
  ),

  http.post(endpoint("/users/me/agreements"), () => new HttpResponse(null, { status: 204 })),
];
