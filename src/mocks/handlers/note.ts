import { http, HttpResponse } from "msw";

export const noteHandler = [
  /** 노트 사용 내역 조회 핸들러 */
  http.get("*/credit/transactions", ({ request }) => {
    const url = new URL(request.url);

    // 1. Query String 파라미터 추출
    const page = parseInt(url.searchParams.get("page") || "0");
    const size = parseInt(url.searchParams.get("size") || "20");

    // 2. Authorization 헤더 체크
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return HttpResponse.json(
        {
          result: "ERROR",
          message: "인증 토큰이 없습니다.",
        },
        { status: 401 },
      );
    }

    // 3. Mock 데이터 생성을 위한 타입 정의
    const types = ["USE", "CHARGE", "REFUND", "EVENT", "ADMIN_GRANT", "EXPIRE"];

    const mockData = Array.from({ length: 100 }).map((_, index) => {
      const overallIndex = page * size + index;
      const transactionId = 9999 - overallIndex;
      const type = types[overallIndex % types.length];

      // 금액 설정 (USE, EXPIRE는 차감 / 나머지는 충전)
      const isDeduced = type === "USE" || type === "EXPIRE";
      const amount = isDeduced ? -1 : 450;

      return {
        transactionId: transactionId,
        // 이미지에서 본 것과 같은 형식의 UUID 생성 (고정값 예시)
        transactionHash: `f363523d-${overallIndex}-4a63-b4b5-${transactionId}edb184`,
        type: type,
        amount: amount,
        balanceAfter: 5000 - overallIndex * 10,
        description: getDescByType(type),
        // 상세 설명: 이미지의 [chat][model][rate] 형식 반영
        detailDescription:
          type === "USE"
            ? "[chat][gemini-2.5-flash][1.0x]여사친이 집에 자꾸 쳐들어옴;;"
            : "[store][package]결제 수단: 신용카드",
        relatedCharacterName: type === "USE" ? "윤아" : null,
        createdAt: new Date(Date.now() - overallIndex * 3600000).toISOString(),
      };
    });

    /** 타입별 설명을 반환하는 헬퍼 함수 */
    function getDescByType(type: string) {
      const descMap: Record<string, string> = {
        USE: "채팅 1턴 사용 - 윤아",
        CHARGE: "스탠다드 패키지 구매",
        REFUND: "결제 취소 환불",
        EVENT: "이벤트 참여 보상",
        ADMIN_GRANT: "관리자 지급",
        EXPIRE: "기간 만료 소멸",
      };
      return descMap[type] || "내역 없음";
    }

    // 4. 요청받은 JSON 구조로 반환
    return HttpResponse.json(
      {
        result: "OK",
        data: {
          content: mockData,
          totalElements: 30, // 예시: 전체 아이템 30개
          totalPages: 2, // 예시: 2페이지 분량
          number: page,
          size: size,
          first: page === 0,
          last: page >= 1, // 0, 1페이지까지 있으므로 1이면 마지막
        },
      },
      { status: 200 },
    );
  }),
];
