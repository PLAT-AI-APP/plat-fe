import { http, HttpResponse } from "msw";
import { endpoint } from "../utils";
import type { FeedbackSuggestType } from "@/api/feedback/postFeedbackSuggest";
import type { FeedbackReportType } from "@/api/feedback/postFeedbackReport";

const TITLE_MAX_LENGTH = 200;
const CONTENT_MAX_LENGTH = 2000;

/** 실서버 FeedbackType 전체. suggest/report 각각은 이 중 일부만 프론트에서 쓰지만 바디 검증은 같은 모양입니다. */
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

/** SuggestRequest/ReportRequest 둘 다 title(<=200)/content(<=2000)만 @Size로 검증하고 공백은 막지 않습니다. */
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

  // 신고 등록. COMMENT 신고는 실서버가 접수와 동시에 그 댓글의 신고 수를 올리고,
  // 없는 댓글이면 CommentModerationUseCase가 404(COMMENT_NOT_FOUND)로 끊습니다.
  // 목업엔 댓글 저장소가 없어 targetId가 "not-found"일 때만 그 케이스를 재현합니다.
  http.post(endpoint("/feedback/report"), async ({ request }) => {
    const body = (await request.json()) as {
      type?: FeedbackReportType;
      targetId?: string;
      title?: string;
      content?: string;
    };

    if (!body.type || !FEEDBACK_TYPES.includes(body.type)) {
      return HttpResponse.json(
        { code: "INVALID_REQUEST", message: "요청 형식이 올바르지 않습니다." },
        { status: 400 },
      );
    }

    if (!body.targetId) {
      return HttpResponse.json(
        {
          code: "INVALID_INPUT",
          message: "요청 값이 올바르지 않습니다.",
          fields: { targetId: "신고 대상을 선택해 주세요." },
        },
        { status: 400 },
      );
    }

    if (body.type === "COMMENT" && body.targetId === "not-found") {
      return HttpResponse.json(
        { code: "COMMENT_NOT_FOUND", message: "댓글을 찾을 수 없습니다." },
        { status: 404 },
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

    return new HttpResponse(null, { status: 204 });
  }),
];
