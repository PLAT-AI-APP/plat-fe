import { http, HttpResponse } from "msw";
import type { UserInfo } from "@/store/useUserStore";
import { endpoint } from "../utils";

let mockUser: UserInfo = {
  id: "1234567890123456789",
  nickname: "플랫유저",
  bio: "안녕하세요. PLAT을 사용 중입니다.",
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
    return HttpResponse.json({
      result: "OK",
      data: mockUser,
    });
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
          result: "ERROR",
          code: "FIELD_ERROR",
          message: "입력값을 확인해 주세요.",
          data: { fields },
        },
        { status: 400 },
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

    return HttpResponse.json({
      result: "OK",
      data: mockUser,
      message: "내 정보가 수정되었습니다.",
    });
  }),

  http.delete(endpoint("/users/me"), async () => {
    return HttpResponse.json({
      result: "OK",
      message: "회원탈퇴가 완료되었습니다.",
    });
  }),
];
