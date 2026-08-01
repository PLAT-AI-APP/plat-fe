import { http, HttpResponse } from "msw";
import type { UserInfo } from "@/store/useUserStore";
import { endpoint } from "../utils";

let mockUser: UserInfo = {
  id: "1234567890123456789",
  nickname: "플랫유저",
  bio: "안녕하세요. PLAT를 사용 중입니다.",
  profileImage: "/images/sample.png",
  birth: "2000-01-15",
  gender: "MALE",
  phone: {
    countryCode: "+82",
    number: "01012345678",
  },
  provider: "EMAIL",
  email: "mock@example.com",
};

type PatchUserBody = {
  nickname?: string;
  bio?: string;
  birth?: string;
  gender?: UserInfo["gender"];
  removeImage?: boolean;
  profileImageFile?: File | null;
};

const parsePatchUserBody = async (request: Request): Promise<PatchUserBody> => {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();

    return {
      nickname: String(formData.get("nickname") ?? ""),
      bio: String(formData.get("bio") ?? ""),
      birth: String(formData.get("birth") ?? ""),
      gender: String(formData.get("gender") ?? "") as UserInfo["gender"],
      removeImage: formData.get("removeImage") === "true",
      profileImageFile: formData.get("profileImage") as File | null,
    };
  }

  return (await request.json()) as PatchUserBody;
};

export const userHandlers = [
  http.get(endpoint("/users/me"), async () => {
    return HttpResponse.json(mockUser);
  }),

  http.patch(endpoint("/users/me"), async ({ request }) => {
    const body = await parsePatchUserBody(request);
    const nickname = body.nickname ?? "";
    const bio = body.bio ?? "";
    const birth = body.birth ?? mockUser.birth;
    const gender = body.gender ?? mockUser.gender;
    const removeImage = body.removeImage === true;
    const profileImageFile = body.profileImageFile;

    const fields: Record<string, string> = {};
    if (!nickname) fields.nickname = "닉네임을 입력해 주세요.";

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
    if (nickname === "toast-alert") {
      return HttpResponse.json(
        {
          code: "TOO_MANY_REQUESTS",
          message: "지금은 프로필을 수정할 수 없어요. 잠시 후 다시 시도해 주세요.",
        },
        { status: 429 },
      );
    }

    mockUser = {
      ...mockUser,
      nickname,
      bio,
      birth,
      gender,
      profileImage: removeImage
        ? ""
        : profileImageFile instanceof File
          ? URL.createObjectURL(profileImageFile)
          : mockUser.profileImage,
    };

    return HttpResponse.json(mockUser);
  }),

  http.delete(endpoint("/users/me"), async () => {
    return new HttpResponse(null, { status: 204 });
  }),
];
