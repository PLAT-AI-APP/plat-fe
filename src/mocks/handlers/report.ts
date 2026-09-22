import { http, HttpResponse } from "msw";
import { endpoint } from "../utils";
import {
  REPORT_REASONS,
  REPORT_TARGET_TYPES,
  type MyReportItem,
  type ReportCreateRequest,
} from "@/type/report";

const DETAIL_MAX_LENGTH = 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

/** 목업 전용 대상 ID. 실서버의 404·409 갈래를 화면에서 재현할 때 쓴다. */
const NOT_FOUND_TARGET_ID = "not-found";
const SELF_TARGET_ID = "self";

const daysAgo = (days: number) =>
  new Date(Date.now() - days * DAY_MS).toISOString();

/** 세 상태를 한 번씩 먼저 보이고, 무한 스크롤을 확인할 수 있게 한 쪽(20건)을 넘기도록 채운다. */
const createSeedReports = (): MyReportItem[] => {
  const samples: MyReportItem[] = [
    {
      reportId: "900000000000000001",
      targetType: "COMMENT",
      targetId: "700000000000000001",
      target: {
        title: "달빛 아래의 기사단",
        excerpt: "이런 캐릭터 만드는 사람들 수준 알 만하다. 다 같이 신고 좀 해 주세요.",
      },
      reason: "HATE",
      detail: "특정 사용자들을 비하하는 표현이 반복돼요.",
      status: "PENDING",
      createdAt: daysAgo(0.1),
    },
    {
      reportId: "900000000000000002",
      targetType: "COMMENT",
      targetId: "700000000000000002",
      target: {
        title: "학교 괴담 수집가",
        excerpt: "무료 노트 받는 법 → 프로필 링크 클릭! 지금 바로 확인하세요",
      },
      reason: "SPAM",
      status: "ACTIONED",
      createdAt: daysAgo(3),
      handledAt: daysAgo(2),
    },
    {
      reportId: "900000000000000003",
      targetType: "UNIVERSE",
      targetId: "600000000000000001",
      target: {
        title: "마법학교의 전학생",
        excerpt: "평범한 전학생인 줄 알았던 당신, 사실은 백 년 만에 나타난 대마법사의 후계자였다.",
      },
      reason: "COPYRIGHT",
      detail: "유명 소설의 설정과 대사를 그대로 가져온 것 같아요.",
      status: "DISMISSED",
      createdAt: daysAgo(7),
      handledAt: daysAgo(5),
    },
  ];

  const statuses = ["PENDING", "ACTIONED", "DISMISSED"] as const;
  const fillers = Array.from({ length: 22 }, (_, index): MyReportItem => {
    const status = statuses[index % statuses.length];
    const createdAt = daysAgo(8 + index);

    return {
      reportId: `9000000000000001${String(index).padStart(2, "0")}`,
      targetType: index % 2 === 0 ? "COMMENT" : "UNIVERSE",
      targetId: `7000000000000001${String(index).padStart(2, "0")}`,
      target: {
        title: `목업 세계관 ${index + 1}`,
        excerpt: `목업 신고 대상 발췌 ${index + 1}`,
      },
      reason: REPORT_REASONS[index % REPORT_REASONS.length],
      ...(index % REPORT_REASONS.length === REPORT_REASONS.length - 1
        ? { detail: "기타 사유 목업 상세" }
        : {}),
      status,
      createdAt,
      ...(status === "PENDING" ? {} : { handledAt: daysAgo(7 + index) }),
    };
  });

  return [...samples, ...fillers];
};

// 새로고침 전까지 접수한 신고가 목록에 이어서 보이도록 인메모리로 쌓는다.
const myReports: MyReportItem[] = createSeedReports();
let nextReportSeq = 1;

const errorResponse = (status: number, code: string, message: string) =>
  HttpResponse.json({ code, message }, { status });

export const reportHandlers = [
  // 목록 정규식은 경로 끝만 보므로 /reports/me/{id} 와 겹치지 않는다. 구체적인 경로를 앞에 둔다.
  http.get(/\/reports\/me\/([^/?]+)(?:\?.*)?$/, ({ request }) => {
    const reportId = new URL(request.url).pathname.split("/").pop();
    const report = myReports.find((item) => item.reportId === reportId);

    if (!report) {
      return errorResponse(404, "REPORT_NOT_FOUND", "신고 내역을 찾을 수 없습니다.");
    }

    return HttpResponse.json(report);
  }),

  http.get(endpoint("/reports/me"), ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? 0);
    const size = Number(url.searchParams.get("size") ?? 20);
    const start = page * size;
    const content = myReports.slice(start, start + size);

    return HttpResponse.json({
      page: {
        number: page,
        size,
        numberOfElements: content.length,
        hasNext: start + size < myReports.length,
      },
      content,
    });
  }),

  // 실서버 규칙: ETC 는 detail 필수, 본인 콘텐츠 409, 볼 수 없는 대상 404, 처리 대기 중 재신고 409.
  http.post(endpoint("/reports"), async ({ request }) => {
    const body = (await request.json()) as Partial<ReportCreateRequest>;

    if (
      !body.targetType ||
      !REPORT_TARGET_TYPES.includes(body.targetType) ||
      !body.reason ||
      !REPORT_REASONS.includes(body.reason) ||
      !body.targetId
    ) {
      return errorResponse(400, "INVALID_REQUEST", "요청 형식이 올바르지 않습니다.");
    }

    const detail = body.detail?.trim() ?? "";
    if (
      (body.reason === "ETC" && !detail) ||
      detail.length > DETAIL_MAX_LENGTH
    ) {
      return HttpResponse.json(
        {
          code: "INVALID_INPUT",
          message: "요청 값이 올바르지 않습니다.",
          fields: {
            detail: detail
              ? `${DETAIL_MAX_LENGTH}자 이하로 입력해 주세요.`
              : "상세 내용을 입력해 주세요.",
          },
        },
        { status: 400 },
      );
    }

    if (body.targetId === NOT_FOUND_TARGET_ID) {
      return errorResponse(404, "REPORT_TARGET_NOT_FOUND", "신고 대상을 찾을 수 없습니다.");
    }

    if (body.targetId === SELF_TARGET_ID) {
      return errorResponse(409, "REPORT_SELF_TARGET", "본인 콘텐츠는 신고할 수 없습니다.");
    }

    const hasPendingReport = myReports.some(
      (item) =>
        item.targetType === body.targetType &&
        item.targetId === body.targetId &&
        item.status === "PENDING",
    );
    if (hasPendingReport) {
      return errorResponse(409, "REPORT_ALREADY_SUBMITTED", "이미 신고한 대상입니다.");
    }

    const reportId = `91000000000000${String(nextReportSeq++).padStart(4, "0")}`;
    myReports.unshift({
      reportId,
      targetType: body.targetType,
      targetId: body.targetId,
      target: {
        title: "목업 신고 대상",
        excerpt: `${body.targetType} ${body.targetId} 스냅샷 발췌`,
      },
      reason: body.reason,
      ...(detail ? { detail } : {}),
      status: "PENDING",
      createdAt: new Date().toISOString(),
    });

    return HttpResponse.json({ reportId }, { status: 201 });
  }),
];
