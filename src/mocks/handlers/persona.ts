import { http, HttpResponse } from "msw";

// 함수 외부에 가짜 DB 선언
let mockPersonas = [
  {
    personaId: 1,
    name: "김철수",
    description: "평범한 직장인",
    isDefault: true,
  },
  {
    personaId: 2,
    name: "마법사 철수",
    description: "마법사 견습생",
    isDefault: false,
  },
];

export const personaHandlers = [
  /** 페르소나 목록 조회 */
  http.get("*/users/me/personas", async () => {
    return HttpResponse.json({
      result: "OK",
      data: mockPersonas,
    });
  }),

  /** 페르소나 상세 조회 */
  http.get("*/users/me/personas/:personaId", async ({ params }) => {
    const { personaId } = params;
    const targetPersona = mockPersonas.find(
      (p) => p.personaId === Number(personaId),
    );

    if (!targetPersona) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json({
      result: "OK",
      data: targetPersona,
    });
  }),

  /** 페르소나 추가 */
  http.post("*/users/me/personas", async ({ request }) => {
    const newPersonaData = (await request.json()) as {
      name: string;
      description: string;
    };

    // 외부 변수(mockPersonas)에 새로운 데이터 push
    const newPersona = {
      personaId: mockPersonas.length + 1, // 단순한 ID 생성 로직
      name: newPersonaData.name,
      description: newPersonaData.description,
      isDefault: false,
    };

    mockPersonas.push(newPersona);

    return HttpResponse.json(
      {
        result: "OK",
        message: "페르소나가 추가되었습니다.",
      },
      { status: 201 },
    );
  }),

  /** 페르소나 수정 */
  http.patch("*/users/me/personas/:personaId", async ({ params, request }) => {
    const { personaId } = params;

    const updateData = (await request.json()) as {
      name?: string;
      description?: string;
    };

    const index = mockPersonas.findIndex(
      (p) => p.personaId === Number(personaId),
    );

    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    mockPersonas[index] = {
      ...mockPersonas[index],
      ...updateData,
    };

    return HttpResponse.json({
      result: "OK",
      data: mockPersonas[index],
      message: "페르소나 정보가 수정되었습니다.",
    });
  }),

  /** 페르소나 삭제 */
  http.delete("*/users/me/personas/:personaId", async ({ params }) => {
    const { personaId } = params;

    const exists = mockPersonas.some((p) => p.personaId === Number(personaId));

    if (!exists) {
      return new HttpResponse(null, { status: 404 });
    }

    // 가짜 DB에서 해당 ID 제외 (삭제 처리)
    mockPersonas = mockPersonas.filter(
      (p) => p.personaId !== Number(personaId),
    );

    return HttpResponse.json({
      result: "OK",
      message: "페르소나가 삭제되었습니다.",
    });
  }),
];
