import { http, HttpResponse } from "msw";
import type { HashtagCategory } from "@/api/hashtag/getHashtagList";
import { endpoint } from "../utils";

const TAG_SEED_ID = 48088734813523968;

const TAG_SEEDS: { label: string; category: HashtagCategory }[] = [
  { label: "일상", category: "GENRE" },
  { label: "친구", category: "RELATIONSHIP" },
  { label: "학교생활", category: "GENRE" },
  { label: "카페", category: "GENRE" },
  { label: "여행", category: "GENRE" },
  { label: "공부", category: "GENRE" },
  { label: "취미", category: "GENRE" },
  { label: "운동", category: "GENRE" },
  { label: "영화", category: "GENRE" },
  { label: "음악", category: "GENRE" },
  { label: "게임", category: "GENRE" },
  { label: "로맨스", category: "GENRE" },
  { label: "판타지", category: "GENRE" },
  { label: "코미디", category: "GENRE" },
  { label: "미스터리", category: "GENRE" },
];

const TAGS = TAG_SEEDS.map(({ label, category }, index) => ({
  // 실제 응답의 id는 safe integer 범위를 넘는 문자열이라 목업에서도 문자열로 맞춥니다.
  id: String(TAG_SEED_ID + index),
  category,
  label,
  isAdult: false,
}));

export const hashtagHandlers = [
  http.get(endpoint("/hashtag/list"), ({ request }) => {
    const url = new URL(request.url);
    const lang = url.searchParams.get("lang") || "KO";

    return HttpResponse.json({
      lang,
      isAdult: false,
      tags: TAGS,
    });
  }),

  http.post(endpoint("/feedback/report"), async ({ request }) => {
    const body = (await request.json()) as {
      content?: string;
      targetId?: string;
      title?: string;
      type?: "HASHTAG";
    };
    const name = body.title ?? body.targetId ?? "";

    if (!name) {
      return HttpResponse.json(
        {
          code: "INVALID_INPUT",
          message: "태그명을 입력해 주세요.",
          fields: {
            name: "태그명을 입력해 주세요.",
          },
        },
        { status: 400 },
      );
    }

    // 태그 제안 모달에서 토스트 디자인을 확인할 때 사용하는 케이스입니다.
    if (name === "toast-alert") {
      return HttpResponse.json(
        {
          code: "TOO_MANY_REQUESTS",
          message: "태그 제안이 잠시 제한되었어요. 조금 뒤 다시 시도해 주세요.",
        },
        { status: 429 },
      );
    }

    if (TAGS.some((tag) => tag.label === name)) {
      return HttpResponse.json(
        {
          code: "CONFLICT",
          message: "이미 존재하는 태그입니다.",
        },
        { status: 409 },
      );
    }

    return new HttpResponse(null, { status: 204 });
  }),
];
