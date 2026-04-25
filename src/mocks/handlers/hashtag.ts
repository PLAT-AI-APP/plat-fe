import { http, HttpResponse } from "msw";

const TAG_LIST_MOCK = [
  { id: "tag-1", name: "취미", isSelected: false },
  { id: "tag-2", name: "여행", isSelected: false },
  { id: "tag-3", name: "요리", isSelected: false },
  { id: "tag-4", name: "운동", isSelected: false },
  { id: "tag-5", name: "공부", isSelected: false },
  { id: "tag-6", name: "친구", isSelected: false },
  { id: "tag-7", name: "학교생활", isSelected: false },
  { id: "tag-8", name: "아침루틴", isSelected: false },
  { id: "tag-9", name: "카페", isSelected: false },
  { id: "tag-10", name: "독서", isSelected: false },
  { id: "tag-11", name: "반려동물", isSelected: false },
  { id: "tag-12", name: "쇼핑", isSelected: false },
  { id: "tag-13", name: "맛집탐방", isSelected: false },
  { id: "tag-14", name: "데이트", isSelected: false },
  { id: "tag-15", name: "운동회", isSelected: false },
  { id: "tag-16", name: "주말", isSelected: false },
  { id: "tag-17", name: "사진", isSelected: false },
  { id: "tag-18", name: "영화감상", isSelected: false },
  { id: "tag-19", name: "음악", isSelected: false },
  { id: "tag-20", name: "드라마", isSelected: false },
  { id: "tag-21", name: "휴가", isSelected: false },
  { id: "tag-22", name: "취업준비", isSelected: false },
  { id: "tag-23", name: "캠핑", isSelected: false },
  { id: "tag-24", name: "산책", isSelected: false },
  { id: "tag-25", name: "자전거", isSelected: false },
  { id: "tag-26", name: "요가", isSelected: false },
  { id: "tag-27", name: "축제", isSelected: false },
  { id: "tag-28", name: "미술관", isSelected: false },
  { id: "tag-29", name: "공원", isSelected: false },
  { id: "tag-30", name: "책읽기", isSelected: false },
  { id: "tag-31", name: "꽃구경", isSelected: false },
  { id: "tag-32", name: "영화관", isSelected: false },
  { id: "tag-33", name: "카페투어", isSelected: false },
  { id: "tag-34", name: "운동복", isSelected: false },
  { id: "tag-35", name: "아침식사", isSelected: false },
  { id: "tag-36", name: "저녁일상", isSelected: false },
  { id: "tag-37", name: "반려식물", isSelected: false },
  { id: "tag-38", name: "퀴즈", isSelected: false },
  { id: "tag-39", name: "친목모임", isSelected: false },
  { id: "tag-40", name: "웹툰", isSelected: false },
  { id: "tag-41", name: "취미생활", isSelected: false },
  { id: "tag-42", name: "베이킹", isSelected: false },
  { id: "tag-43", name: "인스타그램", isSelected: false },
  { id: "tag-44", name: "플랜테리어", isSelected: false },
  { id: "tag-45", name: "홈카페", isSelected: false },
  { id: "tag-46", name: "산책로", isSelected: false },
  { id: "tag-47", name: "명상", isSelected: false },
  { id: "tag-48", name: "방꾸미기", isSelected: false },
  { id: "tag-49", name: "영화추천", isSelected: false },
  { id: "tag-50", name: "음악감상", isSelected: false },
  { id: "tag-51", name: "드로잉", isSelected: false },
  { id: "tag-52", name: "퍼즐", isSelected: false },
  { id: "tag-53", name: "일기쓰기", isSelected: false },
  { id: "tag-54", name: "재테크", isSelected: false },
  { id: "tag-55", name: "꽃사진", isSelected: false },
  { id: "tag-56", name: "패션", isSelected: false },
  { id: "tag-57", name: "뷰티", isSelected: false },
  { id: "tag-58", name: "운동후기", isSelected: false },
  { id: "tag-59", name: "요리레시피", isSelected: false },
  { id: "tag-60", name: "친구만남", isSelected: false },
  { id: "tag-61", name: "새벽감성", isSelected: false },
  { id: "tag-62", name: "명화감상", isSelected: false },
  { id: "tag-63", name: "요가수련", isSelected: false },
  { id: "tag-64", name: "바다산책", isSelected: false },
  { id: "tag-65", name: "도서관", isSelected: false },
  { id: "tag-66", name: "커피", isSelected: false },
  { id: "tag-67", name: "산속여행", isSelected: false },
  { id: "tag-68", name: "미니멀라이프", isSelected: false },
  { id: "tag-69", name: "공연", isSelected: false },
  { id: "tag-70", name: "아날로그", isSelected: false },
  { id: "tag-71", name: "DIY", isSelected: false },
  { id: "tag-72", name: "마이노트", isSelected: false },
];

export const hashtagHandlers = [
  /** 태그 목록 조회 API */
  http.get("*/hastag/list", ({ request }) => {
    const url = new URL(request.url);
    const lang = url.searchParams.get("lang") || "KO";
    const authHeader = request.headers.get("Authorization");

    // 1. Exception: 탈퇴한 회원 (403 Forbidden 시뮬레이션)
    // 테스트 시 토큰을 "Bearer expired-token"으로 보내면 발생
    if (authHeader === "Bearer expired-token") {
      return HttpResponse.json(
        {
          result: "ERROR",
          message: "탈퇴한 회원입니다.",
        },
        { status: 403 },
      );
    }

    // 2. 성인 인증 여부 판단 로직
    // 명세서 기반: 비회원(토큰X)이면 성인인증 X, 회원이면 성인인증 O로 가정
    const isMember = !!authHeader && authHeader.startsWith("Bearer ");
    const isAdult = isMember; // 회원일 경우 성인인증 완료 상태로 시뮬레이션

    // 3. 태그 필터링 (명세서: 성인인증 X = 성인태그 제외)
    // 시뮬레이션: tag-65번부터 성인 태그라고 가정
    const filteredTags = TAG_LIST_MOCK.filter((tag) => {
      const tagIdNum = parseInt(tag.id.split("-")[1], 10);
      if (!isAdult && tagIdNum >= 65) {
        return false; // 성인인증 안됐는데 성인태그면 제외
      }
      return true;
    });

    // 4. Response Body (명세서 구조 준수)
    return HttpResponse.json({
      result: "OK",
      data: {
        lang: lang,
        isAdult: isAdult,
        // 명세서 상 tags는 String List이므로 이름만 추출
        tags: filteredTags.map((tag) => tag.name),
      },
    });
  }),
];
