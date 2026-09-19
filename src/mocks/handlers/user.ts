import { http, HttpResponse } from "msw";
import type { UserInfo } from "@/store/useUserStore";
import { endpoint, pathValue } from "../utils";

interface MockUserProfileResponse {
  id: string;
  email: string;
  nickname: string;
  bio: string | null;
  profileImageUrl: string | null;
  birth: string | null;
  gender: UserInfo["gender"] | null;
  provider: UserInfo["provider"];
}

let mockUser: MockUserProfileResponse = {
  id: "1234567890123456789",
  nickname: "플랫유저",
  bio: "안녕하세요. PLAT를 사용 중입니다.",
  profileImageUrl: "/images/sample.png",
  birth: "2000-01-15",
  gender: "MALE",
  provider: "EMAIL",
  email: "mock@example.com",
};

interface PatchUserBody {
  nickname: string;
  bio?: string;
  birth?: string;
  gender?: UserInfo["gender"];
  removeImage?: boolean;
  profileImageFileId?: string;
}

/** 다른 유저와 겹치면 안 되는(이미 쓰이고 있는) 닉네임. auth.ts 의 목록과 같은 성격입니다. */
const TAKEN_NICKNAMES = ["admin", "test", "plat"];

const NICKNAME_PATTERN = /^[\p{L}\p{N}]+$/u;
const NICKNAME_MAX_LENGTH = 20;
const BIO_MAX_LENGTH = 100;
const BIRTH_MIN_AGE = 14;
const BIRTH_MAX_AGE = 90;

/** NicknameValidator 와 동일: 필수 → 길이 → 패턴 순으로 검증합니다. */
const validateNicknameField = (nickname?: string): string | null => {
  if (!nickname || nickname.trim() === "") return "닉네임을 입력해주세요.";
  if (nickname.length > NICKNAME_MAX_LENGTH) return "닉네임은 20자 이하여야 합니다.";
  if (!NICKNAME_PATTERN.test(nickname)) return "닉네임은 1~20자까지 사용할 수 있습니다.";
  return null;
};

/** BirthValidator 와 동일: 과거 날짜 → 최소 나이 → 최대 나이 순으로 검증합니다. */
const validateBirthField = (birth?: string): string | null => {
  if (!birth) return null; // @Birth(required = false)

  const date = new Date(birth);
  if (Number.isNaN(date.getTime())) return "생년월일이 유효하지 않습니다.";

  const today = new Date();
  if (date >= today) return "생년월일은 과거 날짜여야 합니다.";

  const ageBoundary = (years: number) => {
    const boundary = new Date(today);
    boundary.setUTCFullYear(boundary.getUTCFullYear() - years);
    return boundary;
  };

  if (date > ageBoundary(BIRTH_MIN_AGE)) return `만 ${BIRTH_MIN_AGE}세 이상이어야 합니다.`;
  if (date < ageBoundary(BIRTH_MAX_AGE)) return `만 ${BIRTH_MAX_AGE}세 이하여야 합니다.`;
  return null;
};

const LIKED_UNIVERSE_TOTAL = 27;

const LIKED_UNIVERSE_SEEDS = [
  { title: "밤하늘의 약속", description: "별을 보며 나눈 이야기를 잊지 않는 캐릭터입니다.", nickname: "은하" },
  { title: "카페 사장 리나", description: "단골손님을 반갑게 맞아주는 카페 사장님입니다.", nickname: "리나" },
  { title: "탐정 조수 케이", description: "사건을 함께 추리하며 실마리를 찾아가는 조수입니다.", nickname: "케이" },
];

/** 찜한 시각 역순으로 내려오는 서버 동작을 흉내 냅니다. liked 는 전부 true 입니다. */
const likedUniversePage = (page: number, size: number) => {
  const from = page * size;
  const content = Array.from(
    { length: Math.max(Math.min(size, LIKED_UNIVERSE_TOTAL - from), 0) },
    (_, index) => {
      const order = from + index;
      const seed = LIKED_UNIVERSE_SEEDS[order % LIKED_UNIVERSE_SEEDS.length];

      return {
        universeId: `liked-${order}`,
        images: [`https://picsum.photos/seed/liked-${order}/374/490`],
        title: `${seed.title} ${order + 1}`,
        description: seed.description,
        creator: { creatorId: `creator-${order}`, nickname: seed.nickname },
        chatCount: 40 + order * 3,
        isNew: order % 5 === 0,
        isOfficial: order % 7 === 0,
        liked: true,
      };
    },
  );
  const totalPages = Math.ceil(LIKED_UNIVERSE_TOTAL / size);

  return {
    page: {
      number: page,
      size,
      numberOfElements: content.length,
      hasNext: page + 1 < totalPages,
      totalElements: LIKED_UNIVERSE_TOTAL,
      totalPages,
    },
    content,
  };
};

const OTHER_USER_UNIVERSE_TOTAL = 8;

/**
 * 특정 유저가 만든 세계관 목록. UserController.userUniverses 는 로그인 없이도 조회할 수 있고,
 * 그때는 liked 가 전부 false 로 내려옵니다 — 여기서는 Authorization 헤더 유무로 로그인 여부를 흉내 냅니다.
 */
const userUniversePage = (
  userId: string,
  page: number,
  size: number,
  authenticated: boolean,
) => {
  const from = page * size;
  const content = Array.from(
    { length: Math.max(Math.min(size, OTHER_USER_UNIVERSE_TOTAL - from), 0) },
    (_, index) => {
      const order = from + index;

      return {
        universeId: `user-${userId}-universe-${order}`,
        images: [`https://picsum.photos/seed/user-${userId}-${order}/374/490`],
        title: `${userId}의 세계관 ${order + 1}`,
        description: "프로필 작품 탭에서 보이는 세계관입니다.",
        creator: { creatorId: userId, nickname: `유저_${userId}` },
        chatCount: 10 + order * 5,
        isNew: order === 0,
        isOfficial: false,
        liked: authenticated && order % 3 === 0,
      };
    },
  );
  const totalPages = Math.ceil(OTHER_USER_UNIVERSE_TOTAL / size);

  return {
    page: {
      number: page,
      size,
      numberOfElements: content.length,
      hasNext: page + 1 < totalPages,
      totalElements: OTHER_USER_UNIVERSE_TOTAL,
      totalPages,
    },
    content,
  };
};

export const userHandlers = [
  http.get(endpoint("/users/me/likes"), ({ request }) => {
    const params = new URL(request.url).searchParams;

    return HttpResponse.json(
      likedUniversePage(
        Number(params.get("page") ?? 0),
        Number(params.get("size") ?? 20),
      ),
    );
  }),

  http.get(endpoint("/users/me"), async () => {
    return HttpResponse.json(mockUser);
  }),

  http.patch(endpoint("/users/me"), async ({ request }) => {
    const body = (await request.json()) as PatchUserBody;

    // EditUserProfileRequest 빈 검증(닉네임/자기소개/생년월일)을 한 번에 모읍니다.
    const fields: Record<string, string> = {};
    const nicknameError = validateNicknameField(body.nickname);
    if (nicknameError) fields.nickname = nicknameError;
    if (body.bio && body.bio.length > BIO_MAX_LENGTH) {
      fields.bio = "소개글은 100자 이하여야 합니다.";
    }
    const birthError = validateBirthField(body.birth);
    if (birthError) fields.birth = birthError;

    if (Object.keys(fields).length > 0) {
      return HttpResponse.json(
        {
          code: "INVALID_INPUT",
          message: "요청 값이 올바르지 않습니다.",
          fields,
        },
        { status: 400 },
      );
    }

    // 프로필 수정 화면에서 토스트 디자인을 확인할 때 사용하는 검수 전용 케이스입니다(백엔드에는 없는 목업 전용 트리거).
    if (body.nickname === "toast-alert") {
      return HttpResponse.json(
        {
          code: "TOO_MANY_REQUESTS",
          message:
            "지금은 프로필을 수정할 수 없어요. 잠시 후 다시 시도해 주세요.",
        },
        { status: 429 },
      );
    }

    // UserProfileService.editProfile: 닉네임이 바뀌었고 그 닉네임을 다른 유저가 쓰고 있으면 거부합니다.
    if (
      body.nickname !== mockUser.nickname &&
      TAKEN_NICKNAMES.includes(body.nickname.toLowerCase())
    ) {
      return HttpResponse.json(
        {
          code: "NICKNAME_DUPLICATED",
          message: "이미 사용 중인 닉네임입니다.",
        },
        { status: 409 },
      );
    }

    // editProfile 은 부분 수정이 아니라 매 필드를 통째로 교체합니다 — bio/birth/gender 를 보내지 않으면
    // null 로 덮어써집니다. profileImageUrl 만 새 이미지/삭제 요청이 없을 때 기존 값을 유지합니다.
    mockUser = {
      ...mockUser,
      nickname: body.nickname,
      bio: body.bio ?? null,
      birth: body.birth ?? null,
      gender: body.gender ?? null,
      profileImageUrl: body.removeImage
        ? null
        : body.profileImageFileId
          ? `https://picsum.photos/seed/user-profile-${body.profileImageFileId}/320/320`
          : mockUser.profileImageUrl,
    };

    return new HttpResponse(null, { status: 204 });
  }),

  /** 로그인 없이도 조회 가능한 특정 유저의 작품(세계관) 목록. */
  http.get(/\/users\/[^/]+\/universes(?:\?.*)?$/, ({ request }) => {
    const userId = pathValue(request.url, /\/users\/([^/]+)\/universes$/) ?? "";
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? 0);
    const size = Number(url.searchParams.get("size") ?? 20);
    const authHeader = request.headers.get("Authorization");
    const authenticated = Boolean(authHeader?.startsWith("Bearer "));

    return HttpResponse.json(userUniversePage(userId, page, size, authenticated));
  }),

  /**
   * 특정 유저의 공개 프로필. 로그인 없이 조회할 수 있고 비공개 정보(이메일·생년월일 등)는 없습니다.
   * "/users/me" 핸들러보다 뒤에 두어야 "me" 가 여기로 새지 않습니다.
   */
  http.get(/\/users\/[^/]+(?:\?.*)?$/, ({ request }) => {
    const userId = pathValue(request.url, /\/users\/([^/]+)$/) ?? "";

    // PublicUserProfileService: 없거나 비활성인 유저는 404 로 끊습니다("999" 는 항상 재현 가능한 고정 트리거).
    if (userId === "999") {
      return HttpResponse.json(
        { code: "USER_NOT_FOUND", message: "유저를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    // 프런트는 "/" 로 시작하는 이미지를 API 호스트 기준으로 바꿔 요청하므로, 목업에서는 로컬 파일 대신
    // 절대 URL 을 내려준다. 안 그러면 목업 모드에서 이미지가 API 호스트의 없는 파일을 찾아 깨진다.
    const fallbackImageUrl = `https://picsum.photos/seed/user-profile-${userId}/320/320`;

    // 내 계정은 프로필 수정 결과가 그대로 이어지게 mockUser 를 돌려줍니다.
    if (userId === mockUser.id) {
      return HttpResponse.json({
        id: mockUser.id,
        nickname: mockUser.nickname,
        bio: mockUser.bio,
        profileImageUrl: mockUser.profileImageUrl?.startsWith("http")
          ? mockUser.profileImageUrl
          : fallbackImageUrl,
      });
    }

    return HttpResponse.json({
      id: userId,
      nickname: `유저_${userId}`,
      bio: `${userId} 님의 자기소개입니다.\n캐릭터를 만들며 이야기를 나누고 있어요.`,
      profileImageUrl: fallbackImageUrl,
    });
  }),

  http.delete(endpoint("/users/me"), async () => {
    return new HttpResponse(null, {
      status: 204,
      headers: {
        "Set-Cookie": "refreshToken=; Path=/; Max-Age=0; SameSite=Lax",
      },
    });
  }),
];
