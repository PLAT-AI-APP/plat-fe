import { http, HttpResponse } from "msw";
import { endpoint } from "../utils";

const NEW_WORK_SEEDS = [
  {
    title: "흐물거리는 무말랭이",
    description: "매일 밤 골목 고양이들과 나누는 시시콜콜한 이야기",
    nickname: "흐물거리는무말랭이",
    chatCount: 235,
  },
  {
    title: "사이버펑크 해커 리온",
    description:
      "네온 사인이 깜빡이는 뒷골목. 어떤 정보를 찾으러 왔어? 내 보안망은 아무나 못 뚫을 텐데.",
    nickname: "리온빌더",
    chatCount: 1204,
  },
  {
    title: "판타지 엘프 마법사",
    description:
      "고대 숲의 깊은 곳. 은빛 머리카락이 흩날리는 그녀가 당신에게 조용히 손을 내밉니다.",
    nickname: "숲의마법사",
    chatCount: 89,
  },
  {
    title: "냉혹한 춤꾼",
    description: "음악이 멈추면 모든 게 끝나는 거야. 마지막 춤을 출 준비는 됐어?",
    nickname: "춤추는그림자",
    chatCount: 5421,
  },
  {
    title: "우주 정거장 AI 안나",
    description:
      "현재 산소 포화도 98%입니다. 사령관님, 다음 목적지인 화성까지의 궤도를 수정할까요?",
    nickname: "안나개발자",
    chatCount: 312,
  },
  {
    title: "조선 시대 무사 강혁",
    description:
      "이 칼 끝은 오직 정의만을 향한다. 네가 찾는 도적이 정말 이곳에 숨어 있다고 생각하느냐?",
    nickname: "강혁의칼",
    chatCount: 47,
  },
];

const NEW_WORK_ITEMS = Array.from({ length: 24 }, (_, index) => {
  const seed = NEW_WORK_SEEDS[index % NEW_WORK_SEEDS.length];

  return {
    universeId: `new-work-${index}`,
    images: [`https://picsum.photos/seed/new-work-${index}/374/490`],
    title: seed.title,
    description: seed.description,
    creator: {
      creatorId: `creator-${index}`,
      nickname: seed.nickname,
    },
    chatCount: seed.chatCount,
  };
});

export const homeHandlers = [
  http.get(endpoint("/home/new-work"), ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? 0);
    const size = Number(url.searchParams.get("size") ?? 10);
    const start = page * size;

    return HttpResponse.json(NEW_WORK_ITEMS.slice(start, start + size));
  }),
];
