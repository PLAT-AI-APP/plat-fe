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

export const userHandlers = [
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
