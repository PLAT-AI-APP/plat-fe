import { http, HttpResponse } from "msw";
import { endpoint } from "../utils";
import type { FeedbackSuggestType } from "@/api/feedback/postFeedbackSuggest";

const TITLE_MAX_LENGTH = 200;
const CONTENT_MAX_LENGTH = 2000;

/** 실서버 FeedbackType 전체. 프론트는 suggest 에 이 중 일부만 쓰지만 enum 검증은 전체 값 기준입니다. */
const FEEDBACK_TYPES = [
  "HASHTAG",
  "SERVICE",
  "USER",
  "CHARACTER",
  "MESSAGE",
  "COMMENT",
];

interface FieldLengthErrors {
  title?: string;
  content?: string;
}

/** SuggestRequest 는 title(<=200)/content(<=2000)만 @Size로 검증하고 공백은 막지 않습니다. */
const getLengthFieldErrors = (
  title: string,
  content: string,
): FieldLengthErrors | null => {
  const fields: FieldLengthErrors = {};

  if (title.length > TITLE_MAX_LENGTH) {
    fields.title = `${TITLE_MAX_LENGTH}자 이하로 입력해 주세요.`;
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    fields.content = `${CONTENT_MAX_LENGTH}자 이하로 입력해 주세요.`;
  }

  return Object.keys(fields).length > 0 ? fields : null;
};

export const feedbackHandlers = [
  // 건의사항 등록. 실서버 SuggestUseCase는 상태(PENDING)만 저장하고 조회 API가 따로 없어
  // 목업도 인메모리로 쌓아 두지 않습니다 — 어차피 확인할 방법이 없습니다.
  http.post(endpoint("/feedback/suggest"), async ({ request }) => {
    const body = (await request.json()) as {
      type?: FeedbackSuggestType;
      title?: string;
      content?: string;
    };

    // JSON 역직렬화 단계에서 FeedbackType enum에 없는 값이면 실서버는
    // HttpMessageNotReadableException → 공통 400(INVALID_REQUEST)으로 떨어집니다.
    if (!body.type || !FEEDBACK_TYPES.includes(body.type)) {
      return HttpResponse.json(
        { code: "INVALID_REQUEST", message: "요청 형식이 올바르지 않습니다." },
        { status: 400 },
      );
    }

    const fields = getLengthFieldErrors(body.title ?? "", body.content ?? "");
    if (fields) {
      return HttpResponse.json(
        {
          code: "INVALID_INPUT",
          message: "요청 값이 올바르지 않습니다.",
          fields,
        },
        { status: 400 },
      );
    }

    // ResponseEntity.noContent() 그대로 204.
    return new HttpResponse(null, { status: 204 });
  }),
];
