import { http, HttpResponse } from "msw";
import type { CharacterScenario } from "@/type/character";
import { endpoint, pathValue } from "../utils";

const mockScenarios: CharacterScenario[] = [
  {
    scenarioId: "1",
    name: "첫 만남",
    situation: "카페에서 처음 만나는 상황",
    firstDialogue: "기다리고 있었어요. 오늘은 어떤 이야기를 해볼까요?",
    lang: "KO",
  },
  {
    scenarioId: "2",
    name: "비 오는 날",
    situation: "같이 우산을 쓰고 걷는 상황",
    firstDialogue: "비가 꽤 오네요. 조금 더 가까이 와도 괜찮아요.",
    lang: "KO",
  },
];

export const characterHandlers = [
  http.get(/\/character\/[^/]+\/scenarios(?:\?.*)?$/, ({ request }) => {
    const characterId = pathValue(
      request.url,
      /\/character\/([^/]+)\/scenarios$/,
    );

    if (characterId === "999") {
      return HttpResponse.json(
        {
          result: "ERROR",
          code: "MESSAGE",
          message: "존재하지 않는 캐릭터입니다.",
        },
        { status: 404 },
      );
    }

    return HttpResponse.json({
      result: "OK",
      data: mockScenarios,
    });
  }),

  http.post(endpoint("/character"), async ({ request }) => {
    const body = (await request.json()) as {
      name?: string;
      description?: string;
      tagIds?: number[];
    };

    if (!body.name) {
      return HttpResponse.json(
        {
          result: "ERROR",
          code: "FIELD_ERROR",
          message: "입력값을 확인해 주세요.",
          data: {
            fields: {
              name: "캐릭터 이름을 입력해 주세요.",
            },
          },
        },
        { status: 400 },
      );
    }

    return HttpResponse.json({
      result: "OK",
      data: null,
      message: "캐릭터가 생성되었습니다.",
    });
  }),
];
