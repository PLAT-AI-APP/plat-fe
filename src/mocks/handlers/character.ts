import { http, HttpResponse } from "msw";

// Mock 데이터 정의
const mockScenarios = {
  KO: [
    {
      scenarioId: 1,
      name: "기본 시나리오",
      situation: "카페에서 처음 만난 상황",
      firstDialogue: "나 정말 기다렸어. 네가 오늘 꼭 올 줄 알았거든.",
      lang: "KO",
    },
    {
      scenarioId: 2,
      name: "비 오는 날",
      situation: "함께 우산을 쓰고 걷는 상황",
      firstDialogue: "비가 많이 오네. 어깨 안 젖게 이쪽으로 붙어.",
      lang: "KO",
    },
  ],
  EN: [
    {
      scenarioId: 1,
      name: "Default Scenario",
      situation: "Meeting for the first time at a cafe",
      firstDialogue: "I've been waiting. I knew you'd come today.",
      lang: "EN",
    },
  ],
  JA: [
    {
      scenarioId: 1,
      name: "基本シナリオ",
      situation: "カフェで初めて会った状況",
      firstDialogue: "ずっと待ってたよ。君が今日必ず来るって信じてたから。",
      lang: "JA",
    },
  ],
};

export const characterHandlers = [
  /** 캐릭터의 시나리오 목록 조회 */
  http.get("*/character/:characterId/scenarios", ({ params, request }) => {
    const { characterId } = params;

    if (characterId === "999") {
      // 에러 가공 로직이 기대하는 JSON 구조를 Body에 담아서 반환합니다.
      return HttpResponse.json(
        {
          result: "ERROR",
          code: "MESSAGE",
          message: "존재하지 않는 캐릭터입니다",
        },
        { status: 404 },
      );
    }

    const url = new URL(request.url);
    const lang = url.searchParams.get("lang") || "KO";
    const data =
      mockScenarios[lang as keyof typeof mockScenarios] || mockScenarios["KO"];

    return HttpResponse.json({
      result: "OK",
      data: data,
    });
  }),
];
