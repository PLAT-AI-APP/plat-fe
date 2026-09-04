import { http, HttpResponse } from "msw";
import { endpoint, pathValue } from "../utils";
import type { NoticeCategory, NoticeDetail, NoticeSummary } from "@/type/notice";

const CATEGORIES: NoticeCategory[] = [
  "SERVICE",
  "UPDATE",
  "EVENT",
  "MAINTENANCE",
  "POLICY",
];

const CATEGORY_LABEL: Record<NoticeCategory, string> = {
  SERVICE: "공지",
  UPDATE: "업데이트",
  EVENT: "이벤트",
  MAINTENANCE: "점검",
  POLICY: "정책",
};

// 1. 100개의 목 데이터 생성 (목록용 + 상세용)
const generateMockData = () => {
  const list: NoticeSummary[] = [];
  const details: Record<string, NoticeDetail> = {};

  for (let i = 100; i >= 1; i--) {
    const category = CATEGORIES[i % CATEGORIES.length];
    const isPinned = i > 97; // 최신 3개는 상단 고정 테스트용
    const date = new Date(2026, 3, i).toISOString(); // 날짜 분산
    const noticeId = String(i);

    const item: NoticeSummary = {
      noticeId,
      category,
      title: `${CATEGORY_LABEL[category]} - ${i}번째 게시글입니다.`,
      createdAt: date,
      isPinned,
    };

    list.push(item);

    details[noticeId] = {
      ...item,
      content: `안녕하세요, PLAT 팀입니다.\n\n이것은 ${i}번 게시물의 상세 내용입니다.\n\n서비스 이용에 참고 부탁드립니다.`,
      viewCount: i * 3,
      updatedAt: i % 2 === 0 ? date : null,
    };
  }
  return { list, details };
};

const { list: mockNotices, details: mockNoticeDetails } = generateMockData();

export const noticeHandlers = [
  // 공지사항 목록 조회 API — 백엔드와 동일하게 PageWith 형태로 응답합니다.
  http.get(endpoint("/notices"), ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "0", 10);
    const size = parseInt(url.searchParams.get("size") || "20", 10);
    // 서버처럼 분류를 여기서 거릅니다. 값이 없으면 전체입니다.
    const category = url.searchParams.get("category") as NoticeCategory | null;
    const filtered = category
      ? mockNotices.filter((notice) => notice.category === category)
      : mockNotices;

    // 상단 고정(isPinned) 우선, 그 다음 최신순
    const sorted = [...filtered].sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return Number(b.noticeId) - Number(a.noticeId);
    });

    const totalElements = sorted.length;
    const totalPages = Math.ceil(totalElements / size);
    const content = sorted.slice(page * size, page * size + size);

    return HttpResponse.json({
      page: {
        number: page,
        size,
        numberOfElements: content.length,
        hasNext: page < totalPages - 1,
        totalElements,
        totalPages,
      },
      content,
    });
  }),

  // 공지사항 상세 조회 API
  http.get(/\/notices\/[^/]+(?:\?.*)?$/, ({ request }) => {
    const noticeId = pathValue(request.url, /\/notices\/([^/]+)$/);
    const notice = noticeId ? mockNoticeDetails[noticeId] : undefined;

    if (!notice) {
      return new HttpResponse(null, {
        status: 404,
        statusText: "NoSuchElementException",
      });
    }

    return HttpResponse.json(notice);
  }),
];
