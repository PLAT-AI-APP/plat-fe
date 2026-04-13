import { http, HttpResponse } from "msw";

export const personaHandlers = [
  /** 페르소나 목록 조회 */
  http.get("*/users/me/personas", async () => {
    return HttpResponse.json({
      result: "OK",
      data: [
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
      ],
    });
  }),
];
