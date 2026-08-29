import { http, HttpResponse } from "msw";
import type { HashtagCategory } from "@/api/hashtag/getHashtagList";
import { endpoint, resolveAcceptLanguage } from "../utils";

// Number로 두면 Number.MAX_SAFE_INTEGER(2^53-1)를 넘는 값이라 +index 연산 시 정밀도가
// 깨져 서로 다른 인덱스가 같은 id로 뭉개집니다(예: +0~+4가 전부 동일한 값으로 반올림됨).
// BigInt로 계산해야 매 인덱스가 실제로 다른 id를 받습니다.
// (tsconfig target이 ES2017이라 BigInt 리터럴(n) 문법 대신 BigInt() 호출로 씁니다.)
const TAG_SEED_ID = BigInt(48088734813523968);

// 실제 서버 enum 11종을 전부 채워서, 카테고리별 폴더 UI(태그 사이드바/태그 추가 모달)를
// 일부 카테고리만 있던 이전 목업보다 훨씬 실제와 가깝게 검증할 수 있게 합니다.
const TAG_LABELS_BY_CATEGORY: Record<HashtagCategory, string[]> = {
  GENRE: [
    "판타지",
    "로맨스",
    "로판",
    "현대판타지",
    "다크판타지",
    "SF",
    "호러",
    "무협",
    "일상",
    "학원",
    "이세계",
    "아포칼립스",
    "사이버펑크",
    "코미디",
    "액션",
    "추리",
    "현대",
    "전쟁",
    "스포츠",
    "서바이벌",
    "시뮬레이션",
    "사극",
    "범죄",
    "게임",
    "RPG",
    "BL",
    "GL",
    "HL",
  ],
  BACKGROUND: [
    "학교",
    "회사",
    "병원",
    "카페",
    "던전",
    "우주선",
    "왕궁",
    "시골",
    "도시",
    "바다",
    "산장",
    "지하철",
    "편의점",
    "기숙사",
    "놀이공원",
    "결혼식장",
    "헬스장",
    "서점",
  ],
  RACE: [
    "뱀파이어",
    "엘프",
    "드래곤",
    "수인",
    "악마",
    "천사",
    "요괴",
    "안드로이드",
    "구미호",
    "외계인",
    "몬스터",
    "서큐버스",
    "인큐버스",
    "늑대인간",
    "유령",
    "인외",
  ],
  CHARACTER: [
    "남자친구",
    "여자친구",
    "누나",
    "여동생",
    "오빠",
    "언니",
    "엄마",
    "아빠",
    "소꿉친구",
    "학생",
    "일진",
    "오타쿠",
    "히키코모리",
    "영애",
    "악역",
    "니트",
  ],
  APPEARANCE: [
    "갈발",
    "은발",
    "흑발",
    "붉은머리",
    "안경",
    "근육",
    "교복",
    "문신",
    "거유",
    "빈유",
    "슬렌더",
    "장신",
    "톰보이",
    "수염",
    "중성",
    "창백",
    "눈가림",
    "단발",
    "소년",
    "소녀",
  ],
  PERSONALITY: [
    "츤데레",
    "얀데레",
    "쿠데레",
    "다정",
    "능글",
    "집착",
    "발랄",
    "무뚝뚝",
    "걸크러시",
    "수줍음",
    "순수",
    "멘헤라",
    "소악마",
    "사이코패스",
    "소시오패스",
    "광기",
    "음침",
    "도도",
    "애교",
    "대담한",
    "지배적",
    "피폐",
    "천연",
    "카리스마",
    "권력",
    "무심",
    "쿨데레",
  ],
  RELATIONSHIP: [
    "친구",
    "연인",
    "비밀연애",
    "가짜연애",
    "주인",
    "라이벌",
    "룸메이트",
    "상사",
    "부하",
    "동료",
    "부부",
    "스승",
    "제자",
    "선배",
    "후배",
    "사내연애",
    "연상",
    "연하",
  ],
  NARRATIVE: [
    "구원",
    "복수",
    "함정",
    "재회",
    "배신",
    "환생",
    "회귀",
    "빙의",
    "짝사랑",
    "첫사랑",
    "결혼",
    "왕따",
    "감금",
    "기억상실",
    "트라우마",
    "계약",
    "반전",
    "가스라이팅",
    "암살",
    "데이터",
    "감성",
    "순애",
    "육성",
    "타락",
    "권태기",
  ],
  OCCUPATION: [
    "의사",
    "군인",
    "경찰",
    "교사",
    "메이드",
    "집사",
    "아이돌",
    "스트리머",
    "배우",
    "기사",
    "용사",
    "마법사",
    "암살자",
    "스파이",
    "헌터",
    "탐정",
    "킬러",
    "공주",
    "여왕",
    "성녀",
    "마녀",
    "CEO",
    "재벌",
    "조폭",
    "마피아",
    "회사원",
    "과학자",
    "퇴마사",
    "히어로",
    "간호사",
    "해적",
    "정보원",
    "빌런",
  ],
  MOOD: [
    "힐링",
    "다크",
    "잔잔",
    "몽환적",
    "긴장감",
    "코믹",
    "스릴러",
    "감성적",
    "청춘",
    "잔혹",
    "몽글몽글",
    "새드",
    "훈훈",
    "미스터리",
    "로맨틱",
    "웅장함",
  ],
  SPECIAL: [
    "하렘",
    "역하렘",
    "이종인격",
    "초능력",
    "TS",
    "오메가버스",
    "세뇌",
    "최면",
    "먼치킨",
    "변신",
    "오토코노코",
    "패러디",
  ],
};

const TAG_SEEDS: { label: string; category: HashtagCategory }[] =
  Object.entries(TAG_LABELS_BY_CATEGORY).flatMap(([category, labels]) =>
    labels.map((label) => ({ label, category: category as HashtagCategory })),
  );

const TAGS = TAG_SEEDS.map(({ label, category }, index) => ({
  // 실제 응답의 id는 safe integer 범위를 넘는 문자열이라 목업에서도 문자열로 맞춥니다.
  id: String(TAG_SEED_ID + BigInt(index)),
  category,
  label,
  isAdult: false,
}));

export const hashtagHandlers = [
  http.get(endpoint("/hashtag/list"), ({ request }) => {
    // 언어는 쿼리파라미터가 아니라 Accept-Language 헤더로만 판별합니다.
    const lang = resolveAcceptLanguage(
      request.headers.get("accept-language"),
    ).toUpperCase();

    return HttpResponse.json({
      lang,
      isAdult: false,
      tags: TAGS,
    });
  }),

  http.post(endpoint("/feedback/report"), async ({ request }) => {
    const body = (await request.json()) as {
      content?: string;
      targetId?: string;
      title?: string;
      type?: "HASHTAG";
    };
    const name = body.title ?? body.targetId ?? "";

    if (!name) {
      return HttpResponse.json(
        {
          code: "INVALID_INPUT",
          message: "태그명을 입력해 주세요.",
          fields: {
            name: "태그명을 입력해 주세요.",
          },
        },
        { status: 400 },
      );
    }

    // 태그 제안 모달에서 토스트 디자인을 확인할 때 사용하는 케이스입니다.
    if (name === "toast-alert") {
      return HttpResponse.json(
        {
          code: "TOO_MANY_REQUESTS",
          message: "태그 제안이 잠시 제한되었어요. 조금 뒤 다시 시도해 주세요.",
        },
        { status: 429 },
      );
    }

    if (TAGS.some((tag) => tag.label === name)) {
      return HttpResponse.json(
        {
          code: "CONFLICT",
          message: "이미 존재하는 태그입니다.",
        },
        { status: 409 },
      );
    }

    return new HttpResponse(null, { status: 204 });
  }),
];
