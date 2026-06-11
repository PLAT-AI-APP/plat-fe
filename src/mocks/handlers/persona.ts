import { http, HttpResponse } from "msw";
import type { Persona } from "@/type/persona";
import { endpoint, pathValue } from "../utils";

let mockPersonas: Persona[] = [
  {
    personaId: "1",
    name: "기본 페르소나",
    description: "차분하고 친근한 기본 페르소나입니다.",
    isDefault: true,
  },
  {
    personaId: "2",
    name: "작업 모드",
    description: "집중해서 작업할 때 사용하는 페르소나입니다.",
    isDefault: false,
  },
];

export const personaHandlers = [
  http.get(endpoint("/users/me/personas"), async () => {
    return HttpResponse.json({
      result: "OK",
      data: {
        data: mockPersonas,
      },
    });
  }),

  http.get(/\/users\/me\/personas\/[^/]+(?:\?.*)?$/, async ({ request }) => {
    const personaId = pathValue(request.url, /\/users\/me\/personas\/([^/]+)$/);
    const targetPersona = mockPersonas.find(
      (persona) => persona.personaId === personaId,
    );

    if (!targetPersona) {
      return HttpResponse.json(
        {
          result: "ERROR",
          code: "MESSAGE",
          message: "존재하지 않는 페르소나입니다.",
        },
        { status: 404 },
      );
    }

    return HttpResponse.json({
      result: "OK",
      data: targetPersona,
    });
  }),

  http.post(endpoint("/users/me/personas"), async ({ request }) => {
    const { name, description } = (await request.json()) as {
      name?: string;
      description?: string;
    };

    if (!name) {
      return HttpResponse.json(
        {
          result: "ERROR",
          code: "FIELD_ERROR",
          message: "입력값을 확인해 주세요.",
          data: {
            fields: {
              name: "페르소나 이름을 입력해 주세요.",
            },
          },
        },
        { status: 400 },
      );
    }

    mockPersonas = [
      ...mockPersonas,
      {
        personaId: crypto.randomUUID(),
        name,
        description: description ?? "",
        isDefault: false,
      },
    ];

    return HttpResponse.json(
      {
        result: "OK",
        message: "페르소나가 추가되었습니다.",
      },
      { status: 201 },
    );
  }),

  http.patch(/\/users\/me\/personas\/[^/]+(?:\?.*)?$/, async ({ request }) => {
    const { name, description } = (await request.json()) as {
      name?: string;
      description?: string;
    };
    const personaId = pathValue(request.url, /\/users\/me\/personas\/([^/]+)$/);
    const targetIndex = mockPersonas.findIndex(
      (persona) => persona.personaId === personaId,
    );

    if (targetIndex < 0) {
      return HttpResponse.json(
        {
          result: "ERROR",
          code: "MESSAGE",
          message: "존재하지 않는 페르소나입니다.",
        },
        { status: 404 },
      );
    }

    mockPersonas[targetIndex] = {
      ...mockPersonas[targetIndex],
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
    };

    return HttpResponse.json({
      result: "OK",
      message: "페르소나가 수정되었습니다.",
    });
  }),

  http.delete(/\/users\/me\/personas\/[^/]+(?:\?.*)?$/, async ({ request }) => {
    const personaId = pathValue(request.url, /\/users\/me\/personas\/([^/]+)$/);
    const exists = mockPersonas.some(
      (persona) => persona.personaId === personaId,
    );

    if (!exists) {
      return HttpResponse.json(
        {
          result: "ERROR",
          code: "MESSAGE",
          message: "존재하지 않는 페르소나입니다.",
        },
        { status: 404 },
      );
    }

    mockPersonas = mockPersonas.filter(
      (persona) => persona.personaId !== personaId,
    );

    return HttpResponse.json({
      result: "OK",
      message: "페르소나가 삭제되었습니다.",
    });
  }),
];
