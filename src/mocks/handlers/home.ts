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
    description:
      "음악이 멈추면 모든 게 끝나는 거야. 마지막 춤을 출 준비는 됐어?",
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

// 실서버 NewWorkCard는 chatCount를 내려주지 않아 목업도 동일하게 맞춥니다.
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
  };
});

const USER_RECOMMEND_ITEMS = Array.from({ length: 24 }, (_, index) => {
  const seed = NEW_WORK_SEEDS[index % NEW_WORK_SEEDS.length];

  return {
    universeId: `user-recommend-${index}`,
    images: [`https://picsum.photos/seed/user-recommend-${index}/374/490`],
    title: seed.title,
    description: seed.description,
    creator: {
      creatorId: `creator-${index}`,
      nickname: seed.nickname,
    },
    chatCount: seed.chatCount,
    isNew: index % 5 === 0,
    isOfficial: index % 7 === 0,
  };
});

const OFFICIAL_PREVIEW_ITEMS = Array.from({ length: 24 }, (_, index) => {
  const seed = NEW_WORK_SEEDS[index % NEW_WORK_SEEDS.length];

  return {
    universeId: `official-preview-${index}`,
    images: [`https://picsum.photos/seed/official-preview-${index}/374/490`],
    title: seed.title,
    description: seed.description,
    tags: ["일상", "판타지"],
    chatCount: seed.chatCount,
    // 대화 수와 일부러 반대로 준다 — 정렬을 바꿨을 때 순서가 실제로 뒤집히는지 보이도록.
    likeCount: 1000 - seed.chatCount,
    remainingFreeChatCount: 5,
    scenarios: [
      {
        episodeNo: 1,
        title: "첫 만남",
        content:
          "방과 후 과학실에서 정체를 알 수 없는 캐릭터와 처음 마주치는 장면",
      },
    ],
  };
});

const ASSET_PREVIEW_ITEMS = Array.from({ length: 24 }, (_, index) => {
  const seed = NEW_WORK_SEEDS[index % NEW_WORK_SEEDS.length];

  return {
    universeId: `asset-preview-${index}`,
    images: [
      `https://picsum.photos/seed/asset-preview-${index}-1/374/490`,
      `https://picsum.photos/seed/asset-preview-${index}-2/374/490`,
      `https://picsum.photos/seed/asset-preview-${index}-3/374/490`,
    ],
    title: seed.title,
    description: seed.description,
    isNew: index % 5 === 0,
    isOfficial: index % 7 === 0,
    // TODO: 백엔드 응답에 chatCount 추가되면 이 목업 값은 실제 스펙에 맞춰 정리
    chatCount: seed.chatCount,
  };
});

const POPULAR_TAG_ITEMS = Array.from({ length: 24 }, (_, index) => {
  const seed = NEW_WORK_SEEDS[index % NEW_WORK_SEEDS.length];

  return {
    universeId: `popular-tag-${index}`,
    images: [`https://picsum.photos/seed/popular-tag-${index}/374/490`],
    title: seed.title,
    description: seed.description,
    creator: {
      creatorId: `creator-${index}`,
      nickname: seed.nickname,
    },
    chatCount: seed.chatCount,
    isNew: index % 5 === 0,
    isOfficial: index % 7 === 0,
  };
});

const TODAY_PICK_ITEMS = Array.from({ length: 24 }, (_, index) => {
  const seed = NEW_WORK_SEEDS[index % NEW_WORK_SEEDS.length];

  return {
    universeId: `today-pick-${index}`,
    images: [`https://picsum.photos/seed/today-pick-${index}/374/490`],
    title: seed.title,
    description: seed.description,
    creator: {
      creatorId: `creator-${index}`,
      nickname: seed.nickname,
    },
    chatCount: seed.chatCount,
    isNew: index % 5 === 0,
    isOfficial: index % 7 === 0,
  };
});

/** 메인 배너. 실제 응답과 마찬가지로 이미지 URL과 이동 링크만 내려갑니다. */
const BANNER_ITEMS = Array.from({ length: 3 }, (_, index) => ({
  mainBannerId: String(index + 1),
  imageUrl: `https://picsum.photos/seed/plat-banner-${index}/1200/437`,
  linkUrl: index === 0 ? null : "/?tab=new",
}));

export const homeHandlers = [
  http.get(endpoint("/home/banners"), () => HttpResponse.json(BANNER_ITEMS)),

  http.get(endpoint("/home/today-pick"), ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? 0);
    const size = Number(url.searchParams.get("size") ?? 10);
    const start = page * size;

    return HttpResponse.json(TODAY_PICK_ITEMS.slice(start, start + size));
  }),

  http.get(endpoint("/home/new-work"), ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? 0);
    const size = Number(url.searchParams.get("size") ?? 10);
    const start = page * size;

    return HttpResponse.json(NEW_WORK_ITEMS.slice(start, start + size));
  }),

  // 실서버는 배열이 아니라 SliceWith({condition, page, content})로 감싸서 내려주고,
  // 선호 태그 근거가 없으면 204 No Content를 내려줍니다. 목업도 같은 계약을 따르게 맞춥니다.
  http.get(endpoint("/home/user-recommend"), ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? 0);
    const size = Number(url.searchParams.get("size") ?? 10);
    const start = page * size;
    const content = USER_RECOMMEND_ITEMS.slice(start, start + size);

    if (content.length === 0) {
      return new HttpResponse(null, { status: 204 });
    }

    return HttpResponse.json({ condition: null, page, content });
  }),

  http.get(endpoint("/home/official-preview"), ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? 0);
    const size = Number(url.searchParams.get("size") ?? 10);
    const sort = url.searchParams.get("sort") ?? "CHAT";
    const start = page * size;

    // 서버처럼 누적 카운터로 줄 세웁니다.
    const sorted = [...OFFICIAL_PREVIEW_ITEMS].sort((a, b) =>
      sort === "LIKE" ? b.likeCount - a.likeCount : b.chatCount - a.chatCount,
    );

    return HttpResponse.json(sorted.slice(start, start + size));
  }),

  http.get(endpoint("/home/asset-preview"), ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? 0);
    const size = Number(url.searchParams.get("size") ?? 10);
    const start = page * size;

    return HttpResponse.json(ASSET_PREVIEW_ITEMS.slice(start, start + size));
  }),

  http.get(endpoint("/home/popular-tag"), ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? 0);
    const size = Number(url.searchParams.get("size") ?? 10);
    const start = page * size;

    return HttpResponse.json(POPULAR_TAG_ITEMS.slice(start, start + size));
  }),
];
