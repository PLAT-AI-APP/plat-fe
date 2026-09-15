import { http, HttpResponse } from "msw";
import type { UserInfo } from "@/store/useUserStore";
import { endpoint } from "../utils";

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

    const fields: Record<string, string> = {};
    if (!body.nickname) fields.nickname = "닉네임을 입력해 주세요.";

    if (Object.keys(fields).length > 0) {
      return HttpResponse.json(
        {
          code: "INVALID_INPUT",
          message: "입력값을 확인해 주세요.",
          fields,
        },
        { status: 400 },
      );
    }

    // 프로필 수정 화면에서 토스트 디자인을 확인할 때 사용하는 케이스입니다.
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

    mockUser = {
      ...mockUser,
      nickname: body.nickname,
      bio: body.bio ?? null,
      birth: body.birth ?? mockUser.birth,
      gender: body.gender ?? mockUser.gender,
      profileImageUrl: body.removeImage
        ? null
        : body.profileImageFileId
          ? `https://picsum.photos/seed/user-profile-${body.profileImageFileId}/320/320`
          : mockUser.profileImageUrl,
    };

    return new HttpResponse(null, { status: 204 });
  }),

  http.delete(endpoint("/users/me"), async () => {
    return new HttpResponse(null, { status: 204 });
  }),
];
