import { http, HttpResponse } from "msw";
import { endpoint, pathValue } from "../utils";
import type { DraftType } from "@/api/draft/postDraftCreate";
import type { DraftResponse } from "@/api/draft/getDraft";

/**
 * DraftController(plat-boot) 기준.
 * 실제 서비스는 관리자(NOTICE)/크리에이터(CHARACTER, UNIVERSE) 두 종류의 소유자가 있지만,
 * plat-fe 는 항상 크리에이터로 로그인한 사용자만 호출하므로 이 목업도 크리에이터 권한만 흉내 냅니다.
 * 그래서 type=NOTICE 요청은 실제 서버처럼 항상 DRAFT_TYPE_INVALID 로 거부됩니다.
 */

const CREATOR_ALLOWED_TYPES: DraftType[] = ["CHARACTER", "UNIVERSE"];
const MAX_DRAFTS_PER_OWNER = 20;
const MAX_TITLE_LENGTH = 60;
const MAX_PAYLOAD_BYTES = 256 * 1024;
const RETENTION_MS = 30 * 24 * 60 * 60 * 1000;

let draftSequence = 1;
const nextDraftId = () => String(2000 + draftSequence++);

const drafts = new Map<string, DraftResponse>();

// 최초 진입 시 화면에서 "불러오기"를 바로 시도해볼 수 있도록 세계관 초안 하나를 미리 심어 둡니다.
const seedDraftId = nextDraftId();
drafts.set(seedDraftId, {
  draftId: seedDraftId,
  type: "UNIVERSE",
  title: "별빛 마법학교 (임시저장)",
  payload: { version: 1, introduce: "별의 힘을 배우는 마법학교" },
  expiresAt: new Date(Date.now() + RETENTION_MS).toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const draftNotFound = () =>
  HttpResponse.json(
    { code: "DRAFT_NOT_FOUND", message: "임시 저장 내용을 찾을 수 없습니다." },
    { status: 404 },
  );

const draftTypeInvalid = () =>
  HttpResponse.json(
    {
      code: "DRAFT_TYPE_INVALID",
      message: "이 경로에서 저장할 수 없는 임시 저장 유형입니다.",
    },
    { status: 400 },
  );

const fieldError = (field: string, message: string) =>
  HttpResponse.json(
    { code: "INVALID_INPUT", message: "요청 값이 올바르지 않습니다.", fields: { [field]: message } },
    { status: 400 },
  );

/** title·payload 검증. 통과하면 null, 실패하면 바로 돌려줄 응답을 반환합니다. */
const validateTitleAndPayload = (title: string, payload: unknown) => {
  const normalizedTitle = title?.trim() ?? "";
  if (!normalizedTitle) {
    return fieldError("title", "임시 저장 제목을 입력해주세요.");
  }
  if (normalizedTitle.length > MAX_TITLE_LENGTH) {
    return fieldError("title", "임시 저장 제목은 60자 이하여야 합니다.");
  }
  if (payload != null && typeof payload !== "object") {
    return fieldError("payload", "임시 저장 내용은 JSON 객체여야 합니다.");
  }
  const payloadBytes = new TextEncoder().encode(JSON.stringify(payload ?? {})).length;
  if (payloadBytes > MAX_PAYLOAD_BYTES) {
    return fieldError("payload", "임시 저장 내용은 256KiB 이하여야 합니다.");
  }
  return null;
};

export const draftHandlers = [
  // 초안 생성. 같은 타입 초안이 이미 있으면 409, 20개를 넘기면 409.
  http.post(endpoint("/drafts"), async ({ request }) => {
    const body = (await request.json()) as {
      type?: DraftType;
      title?: string;
      payload?: unknown;
    };

    if (!body.type || !CREATOR_ALLOWED_TYPES.includes(body.type)) {
      return draftTypeInvalid();
    }

    const hasCurrent = [...drafts.values()].some((draft) => draft.type === body.type);
    if (hasCurrent) {
      return HttpResponse.json(
        { code: "DRAFT_ALREADY_EXISTS", message: "동일한 유형의 임시 저장이 이미 존재합니다." },
        { status: 409 },
      );
    }
    if (drafts.size >= MAX_DRAFTS_PER_OWNER) {
      return HttpResponse.json(
        { code: "DRAFT_LIMIT_EXCEEDED", message: "임시 저장은 최대 20개까지 보관할 수 있습니다." },
        { status: 409 },
      );
    }

    const invalid = validateTitleAndPayload(body.title ?? "", body.payload);
    if (invalid) return invalid;

    const now = new Date();
    const draftId = nextDraftId();
    drafts.set(draftId, {
      draftId,
      type: body.type,
      title: body.title!.trim(),
      payload: (body.payload as Record<string, unknown>) ?? {},
      expiresAt: new Date(now.getTime() + RETENTION_MS).toISOString(),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });

    return HttpResponse.json({ draftId }, { status: 201 });
  }),

  // 현재 초안 조회. 유저·타입 조합당 최대 1개라 있으면 그 하나가 "현재 초안"이다. 없으면 204.
  http.get(endpoint("/drafts/current"), ({ request }) => {
    const type = new URL(request.url).searchParams.get("type") as DraftType | null;
    if (!type || !CREATOR_ALLOWED_TYPES.includes(type)) {
      return draftTypeInvalid();
    }

    const current = [...drafts.values()].find((draft) => draft.type === type);
    if (!current) return new HttpResponse(null, { status: 204 });

    return HttpResponse.json({ draftId: current.draftId });
  }),

  // 초안 단건 조회
  http.get(/\/drafts\/([^/]+)(?:\?.*)?$/, ({ request }) => {
    const draftId = pathValue(request.url, /\/drafts\/([^/]+)$/);
    const draft = draftId ? drafts.get(draftId) : undefined;
    if (!draft) return draftNotFound();

    return HttpResponse.json(draft);
  }),

  // 초안 수정. payload 는 부분 병합이 아니라 전체 교체.
  http.put(/\/drafts\/([^/]+)(?:\?.*)?$/, async ({ request }) => {
    const draftId = pathValue(request.url, /\/drafts\/([^/]+)$/);
    const draft = draftId ? drafts.get(draftId) : undefined;
    if (!draft || !draftId) return draftNotFound();

    const body = (await request.json()) as { title?: string; payload?: unknown };
    const invalid = validateTitleAndPayload(body.title ?? "", body.payload);
    if (invalid) return invalid;

    const now = new Date();
    drafts.set(draftId, {
      ...draft,
      title: body.title!.trim(),
      payload: (body.payload as Record<string, unknown>) ?? {},
      updatedAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + RETENTION_MS).toISOString(),
    });

    return HttpResponse.json({ draftId });
  }),
];
