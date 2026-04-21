import { http, HttpResponse } from "msw";
// 1. 유저 정보 인터페이스 정의 (profileImage에 null 허용)
interface MockUser {
  id: number;
  nickname: string;
  bio: string;
  profileImage: string | null; // 핵심: string 또는 null 가능
  birth: string;
  gender: string;
  phone: {
    countryCode: string;
    number: string;
  };
}

// 1. 초기 사용자 데이터를 핸들러 외부에 선언 (메모리에 저장됨)
let mockUser: MockUser = {
  id: 1234567890123456789,
  nickname: "깜귀봉",
  bio: "앞으로가 더 찬란할 크리에이터",
  profileImage: "/images/sample.png",
  birth: "2000-01-15",
  gender: "MALE",
  phone: {
    countryCode: "+82",
    number: "01012345678",
  },
};

export const userHandlers = [
  /** 내 정보 조회 */
  http.get("*/users/me", async () => {
    // 2. 현재 mockUser 상태를 그대로 반환
    return HttpResponse.json({
      result: "OK",
      data: mockUser,
    });
  }),

  /** 내 정보 수정 */
  http.patch("*/users/me", async ({ request }) => {
    const formData = await request.formData();

    const nickname = formData.get("nickname") as string;
    const bio = formData.get("bio") as string;
    const birth = formData.get("birth") as string;
    const gender = formData.get("gender") as string;
    const profileImageFile = formData.get("profileImage") as File | null;
    const removeImage = formData.get("removeImage") === "true";

    // --- 검증 로직 (기존과 동일) ---
    const fieldErrors: Record<string, string> = {};
    if (!nickname) fieldErrors.nickname = "닉네임을 입력해 주세요.";
    if (!birth) fieldErrors.birth = "생년월일을 입력해 주세요.";
    if (!gender) fieldErrors.gender = "성별을 입력해 주세요.";

    if (Object.keys(fieldErrors).length > 0) {
      return HttpResponse.json(
        {
          result: "ERROR",
          code: "FIELD_ERROR",
          data: { fields: fieldErrors },
        },
        { status: 400 },
      );
    }

    // --- 데이터 업데이트 (mockUser 변수 수정) ---
    // 3. 요청받은 내용을 바탕으로 전역 변수인 mockUser를 업데이트합니다.
    mockUser = {
      ...mockUser,
      nickname,
      bio: bio || "",
      birth,
      gender,
      // 이미지 처리 로직
      profileImage: removeImage
        ? null
        : profileImageFile
          ? URL.createObjectURL(profileImageFile)
          : mockUser.profileImage, // 새 이미지 없으면 기존 유지
      phone: {
        countryCode:
          (formData.get("phone.countryCode") as string) ||
          mockUser.phone.countryCode,
        number:
          (formData.get("phone.number") as string) || mockUser.phone.number,
      },
    };

    // --- 4. 수정된 데이터 반환 ---
    return HttpResponse.json({
      result: "OK",
    });
  }),
];
