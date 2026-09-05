import { http, HttpResponse } from "msw";
import { endpoint, pathValue } from "../utils";

// 타입 정의
interface NoticeItem {
  noticeId: number;
  category: "SERVICE" | "UPDATE" | "EVENT" | "MAINTENANCE" | "POLICY";
  title: string;
  createdAt: string;
  isPinned: boolean;
}

interface NoticeDetail extends NoticeItem {
  content: string;
  viewCount: number;
  updatedAt: string | null;
}

// 1. 100개의 목 데이터 생성 (목록용 + 상세용)
const generateMockData = () => {
  const categories: NoticeItem["category"][] = [
    "SERVICE",
    "UPDATE",
    "EVENT",
    "MAINTENANCE",
    "POLICY",
  ];
  const categoryLabel: Record<NoticeItem["category"], string> = {
    SERVICE: "공지",
    UPDATE: "업데이트",
    EVENT: "이벤트",
    MAINTENANCE: "점검",
    POLICY: "정책",
  };
  const list: NoticeItem[] = [];
  const details: Record<number, NoticeDetail> = {};

  for (let i = 100; i >= 1; i--) {
    const category = categories[i % categories.length];
    const isPinned = i > 97; // 최신 3개는 상단 고정 테스트용
    const date = new Date(2026, 3, i).toISOString(); // 날짜 분산

    const item: NoticeItem = {
      noticeId: i,
      category,
      title: `${categoryLabel[category]} - ${i}번째 게시글입니다.`,
      createdAt: date,
      isPinned,
    };

    list.push(item);

    // 상세 데이터 매핑
    details[i] = {
      ...item,
      content: `안녕하세요, PLAT 팀입니다.\n\n이것은 ${i}번 게시물의 상세 내용입니다.\n\n서비스 이용에 참고 부탁드립니다.`,
      viewCount: i * 3,
      updatedAt: date,
    };
  }
  return { list, details };
};

const { list: mockNotices, details: mockNoticeDetails } = generateMockData();

export const noticeHandlers = [
  // 공지사항 목록 조회 API — 실서버는 page만 받고, 크기(20)와 카테고리 필터는 지원하지 않습니다.
  http.get(endpoint("/notices"), ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "0", 10);
    const size = 20;

    // 상단 고정(isPinned) 처리 (고정글 우선, 그 다음 최신순)
    const sortedNotices = [...mockNotices].sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return b.noticeId - a.noticeId;
    });

    const totalElements = sortedNotices.length;
    const totalPages = Math.ceil(totalElements / size);
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const content = sortedNotices.slice(startIndex, endIndex);

    return HttpResponse.json({
      condition: null,
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
    const id = parseInt(noticeId ?? "", 10);
    const notice = mockNoticeDetails[id];

    if (!notice) {
      return new HttpResponse(null, {
        status: 404,
        statusText: "NoSuchElementException",
      });
    }

    return HttpResponse.json(notice);
  }),
];
