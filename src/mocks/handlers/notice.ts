import { http, HttpResponse } from "msw";

// 공지사항 아이템 타입 정의
interface NoticeItem {
  noticeId: number;
  type: "NOTICE" | "UPDATE" | "EVENT";
  title: string;
  createdAt: string;
  isPinned: boolean; // JSON 구조에 명시된 상단 고정 여부 추가
}
// 목데이터 (Mock Data) 생성
const mockNotices: NoticeItem[] = [
  {
    noticeId: 5,
    type: "NOTICE",
    title: "PLAT 서비스 오픈 안내",
    createdAt: "2026-04-29T09:00:00",
    isPinned: true,
  },
  {
    noticeId: 4,
    type: "UPDATE",
    title: "정기 업데이트 안내 (v1.1.0)",
    createdAt: "2026-04-28T14:00:00",
    isPinned: false,
  },
  {
    noticeId: 3,
    type: "EVENT",
    title: "오픈 기념 포인트 지급 이벤트 🎉",
    createdAt: "2026-04-27T10:00:00",
    isPinned: false,
  },
  {
    noticeId: 2,
    type: "NOTICE",
    title: "개인정보처리방침 개정 안내",
    createdAt: "2026-04-25T11:00:00",
    isPinned: false,
  },
  {
    noticeId: 1,
    type: "UPDATE",
    title: "버그 수정 및 UI/UX 개선 작업 완료",
    createdAt: "2026-04-24T18:30:00",
    isPinned: false,
  },
];

// 공지사항 상세 데이터 타입 정의
interface NoticeDetail {
  noticeId: number;
  type: "NOTICE" | "UPDATE" | "EVENT";
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string | null; // JSON 구조에 명시된 nullable 대응
}
// 목데이터 (이전 목록 API와 ID를 맞춰두면 테스트하기 좋습니다)
const mockNoticeDetails: Record<number, NoticeDetail> = {
  1: {
    noticeId: 1,
    type: "UPDATE",
    title: "버그 수정 및 UI/UX 개선 작업 완료",
    content:
      "안녕하세요, PLAT 팀입니다.\n\n사용자 제보를 바탕으로 일부 레이아웃 깨짐 현상 수정 및 컴포넌트 최적화를 진행했습니다.",
    createdAt: "2026-04-24T18:30:00",
    updatedAt: "2026-04-24T18:30:00",
  },
  5: {
    noticeId: 5,
    type: "NOTICE",
    title: "PLAT 서비스 오픈 안내",
    content:
      "안녕하세요, PLAT 팀입니다.\n\n오늘부터 정식 서비스를 시작합니다. 많은 관심 부탁드립니다!",
    createdAt: "2026-04-29T09:00:00",
    updatedAt: "2026-04-29T09:00:00",
  },
};

export const noticeHandlers = [
  // 공지사항 목록 조회 API
  http.get("*/notice", ({ request }) => {
    const url = new URL(request.url);

    // Query String 파싱 및 기본값 설정
    const page = parseInt(url.searchParams.get("page") || "0", 10);
    const size = parseInt(url.searchParams.get("size") || "20", 10);
    const type = url.searchParams.get("type");

    // 1. 타입 필터링 (NOTICE / UPDATE / EVENT)
    let filteredNotices = [...mockNotices];
    if (type && ["NOTICE", "UPDATE", "EVENT"].includes(type)) {
      filteredNotices = filteredNotices.filter((item) => item.type === type);
    }

    // 2. 페이지네이션 연산
    const totalElements = filteredNotices.length;
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedContent = filteredNotices.slice(startIndex, endIndex);
    const last = endIndex >= totalElements;

    // 명세서 규격에 맞춘 Response 반환
    return HttpResponse.json({
      result: "OK",
      data: {
        content: paginatedContent,
        page,
        size,
        totalElements,
        last,
      },
    });
  }),

  // 공지사항 상세 조회 API
  http.get("*/notice/:noticeId", ({ params }) => {
    const { noticeId } = params;
    const id = parseInt(noticeId as string, 10);

    const notice = mockNoticeDetails[id];

    // 명세서 Exception 처리: 존재하지 않는 공지사항일 경우 404 반환
    if (!notice) {
      return new HttpResponse(null, {
        status: 404,
        statusText: "NoSuchElementException",
      });
    }

    // 성공 시 Response 규격 반환
    return HttpResponse.json({
      result: "OK",
      data: notice,
    });
  }),
];
