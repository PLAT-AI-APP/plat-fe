import { http, HttpResponse } from "msw";
import { endpoint } from "../utils";

const TAGS = [
  "일상",
  "친구",
  "학교생활",
  "카페",
  "여행",
  "공부",
  "취미",
  "운동",
  "영화",
  "음악",
  "게임",
  "로맨스",
  "판타지",
  "코미디",
  "힐링",
].map((label, index) => ({
  id: index + 1,
  label,
}));

export const hashtagHandlers = [
  http.get(endpoint("/hashtag/list"), ({ request }) => {
    const url = new URL(request.url);
    const lang = url.searchParams.get("lang") || "KO";

    return HttpResponse.json({
      result: "OK",
      data: {
        lang,
        isAdult: false,
        tags: TAGS,
      },
    });
  }),

  http.post(endpoint("/hashtag/suggest"), async ({ request }) => {
    const body = (await request.json()) as {
      params?: {
        name?: string;
        opinion?: string;
      };
      name?: string;
      opinion?: string;
    };
    const name = body.params?.name ?? body.name ?? "";

    if (!name) {
      return HttpResponse.json(
        {
          result: "ERROR",
          code: "FIELD_ERROR",
          message: "태그명을 입력해 주세요.",
          data: {
            fields: {
              name: "태그명을 입력해 주세요.",
            },
          },
        },
        { status: 400 },
      );
    }

    if (TAGS.some((tag) => tag.label === name)) {
      return HttpResponse.json(
        {
          result: "ERROR",
          code: "MESSAGE",
          message: "이미 존재하는 태그입니다.",
        },
        { status: 409 },
      );
    }

    return HttpResponse.json({
      result: "OK",
      message: "해시태그 제안이 접수되었습니다.",
    });
  }),
];
