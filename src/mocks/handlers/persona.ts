import { http, HttpResponse } from "msw";
import type { Persona } from "@/type/persona";
import { endpoint, pathValue } from "../utils";
import { rooms } from "./room";

/** PersonaService.MAX_PERSONA_COUNT와 동일 — 유저당 최대 보유량. */
const MAX_PERSONA_COUNT = 5;
const NAME_MAX_LENGTH = 20;
const DESCRIPTION_MAX_LENGTH = 200;

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

const personaNotFound = () =>
  HttpResponse.json(
    { code: "PERSONA_NOT_FOUND", message: "존재하지 않는 페르소나입니다." },
    { status: 404 },
  );

/** EditPersonaRequest(name: @Size(min=1,max=20), description: @Size(max=200))와 동일한 규칙. */
const validatePersonaFields = (name?: string, description?: string) => {
  const fields: Record<string, string> = {};

  if (!name || name.length < 1 || name.length > NAME_MAX_LENGTH) {
    fields.name = "페르소나 이름은 1~20자여야 합니다.";
  }
  if (description !== undefined && description.length > DESCRIPTION_MAX_LENGTH) {
    fields.description = "페르소나 설명은 200자 이하여야 합니다.";
  }

  if (Object.keys(fields).length === 0) return null;

  return HttpResponse.json(
    { code: "INVALID_INPUT", message: "입력값을 확인해 주세요.", fields },
    { status: 400 },
  );
};

export const personaHandlers = [
  http.get(endpoint("/users/me/personas"), async () => {
    return HttpResponse.json(mockPersonas);
  }),

  http.get(/\/users\/me\/personas\/[^/]+(?:\?.*)?$/, async ({ request }) => {
    const personaId = pathValue(request.url, /\/users\/me\/personas\/([^/]+)$/);
    const targetPersona = mockPersonas.find(
      (persona) => persona.personaId === personaId,
    );

    if (!targetPersona) {
      return personaNotFound();
    }

    return HttpResponse.json(targetPersona);
  }),

  http.post(endpoint("/users/me/personas"), async ({ request }) => {
    const { name, description } = (await request.json()) as {
      name?: string;
      description?: string;
    };

    const invalid = validatePersonaFields(name, description);
    if (invalid) return invalid;

    // PersonaService.postPersona: 최대 보유량을 넘으면 만들 수 없다.
    if (mockPersonas.length >= MAX_PERSONA_COUNT) {
      return HttpResponse.json(
        {
          code: "PERSONA_LIMIT_EXCEEDED",
          message: `페르소나는 최대 ${MAX_PERSONA_COUNT}개까지 생성할 수 있습니다.`,
        },
        { status: 409 },
      );
    }

    mockPersonas = [
      ...mockPersonas,
      {
        personaId: crypto.randomUUID(),
        // validatePersonaFields를 통과했으므로 name은 항상 채워져 있다.
        name: name as string,
        description: description ?? "",
        isDefault: false,
      },
    ];

    return new HttpResponse(null, { status: 204 });
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
      return personaNotFound();
    }

    const invalid = validatePersonaFields(name, description);
    if (invalid) return invalid;

    mockPersonas[targetIndex] = {
      ...mockPersonas[targetIndex],
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
    };

    return new HttpResponse(null, { status: 204 });
  }),

  http.delete(/\/users\/me\/personas\/[^/]+(?:\?.*)?$/, async ({ request }) => {
    const personaId = pathValue(request.url, /\/users\/me\/personas\/([^/]+)$/);
    const target = mockPersonas.find(
      (persona) => persona.personaId === personaId,
    );

    if (!target) {
      return personaNotFound();
    }

    // PersonaService.deletePersona: 기본 페르소나는 지울 수 없다.
    if (target.isDefault) {
      return HttpResponse.json(
        {
          code: "PERSONA_DEFAULT_DELETE_DENIED",
          message: "기본 페르소나는 삭제할 수 없습니다.",
        },
        { status: 409 },
      );
    }

    // PersonaService.deletePersona: 채팅방이 쓰고 있는 페르소나도 지울 수 없다.
    if ([...rooms.values()].some((room) => room.personaId === personaId)) {
      return HttpResponse.json(
        {
          code: "PERSONA_IN_USE",
          message: "채팅방에서 사용 중인 페르소나는 삭제할 수 없습니다.",
        },
        { status: 409 },
      );
    }

    mockPersonas = mockPersonas.filter(
      (persona) => persona.personaId !== personaId,
    );

    return new HttpResponse(null, { status: 204 });
  }),
];
