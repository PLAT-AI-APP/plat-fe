import { http, HttpResponse } from "msw";

// 타입 정의
interface NoticeItem {
  noticeId: number;
  type: "NOTICE" | "UPDATE" | "EVENT";
  title: string;
  createdAt: string;
  isPinned: boolean;
}

interface NoticeDetail extends NoticeItem {
  content: string;
  updatedAt: string | null;
}

// 1. 100개의 목 데이터 생성 (목록용 + 상세용)
const generateMockData = () => {
  const types: ("NOTICE" | "UPDATE" | "EVENT")[] = [
    "NOTICE",
    "UPDATE",
    "EVENT",
  ];
  const list: NoticeItem[] = [];
  const details: Record<number, NoticeDetail> = {};

  for (let i = 100; i >= 1; i--) {
    const type = types[i % 3];
    const isPinned = i > 97; // 최신 3개는 상단 고정 테스트용
    const date = new Date(2026, 3, i).toISOString(); // 날짜 분산

    const item: NoticeItem = {
      noticeId: i,
      type,
      title: `${type === "NOTICE" ? "공지" : type === "UPDATE" ? "업데이트" : "이벤트"} - ${i}번째 게시글입니다.`,
      createdAt: date,
      isPinned,
    };

    list.push(item);

    // 상세 데이터 매핑
    details[i] = {
      ...item,
      content: `안녕하세요, PLAT 팀입니다.\n\n이것은 ${i}번 게시물의 상세 내용입니다.\n\n서비스 이용에 참고 부탁드립니다.`,
      updatedAt: date,
    };
  }
  return { list, details };
};

const { list: mockNotices, details: mockNoticeDetails } = generateMockData();

export const noticeHandlers = [
  // 공지사항 목록 조회 API
  http.get("*/notice", ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "0", 10);
    const size = parseInt(url.searchParams.get("size") || "20", 10);
    const type = url.searchParams.get("type");

    // 1. 필터링
    let filteredNotices = [...mockNotices];
    if (type && ["NOTICE", "UPDATE", "EVENT"].includes(type)) {
      filteredNotices = filteredNotices.filter((item) => item.type === type);
    }

    // 2. 상단 고정(isPinned) 처리 (고정글 우선, 그 다음 최신순)
    filteredNotices.sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return b.noticeId - a.noticeId;
    });

    // 3. 페이지네이션
    const totalElements = filteredNotices.length;
    const totalPages = Math.ceil(totalElements / size);
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedContent = filteredNotices.slice(startIndex, endIndex);

    return HttpResponse.json({
      result: "OK",
      data: {
        content: paginatedContent,
        totalElements,
        totalPages,
        number: page,
        size,
        first: page === 0,
        last: page >= totalPages - 1 || totalPages === 0,
      },
    });
  }),

  // 공지사항 상세 조회 API (100개 데이터 모두 연동)
  http.get("*/notice/:noticeId", ({ params }) => {
    const { noticeId } = params;
    const id = parseInt(noticeId as string, 10);
    const notice = mockNoticeDetails[id];

    if (!notice) {
      return new HttpResponse(null, {
        status: 404,
        statusText: "NoSuchElementException",
      });
    }

    return HttpResponse.json({
      result: "OK",
      data: notice,
    });
  }),
];
