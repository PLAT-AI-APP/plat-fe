import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { ApiSuccessResponse, AppError } from "@/type/api";

interface PatchMyInfoProps {
  nickname: string;
  bio: string;
  birth: string;
  gender: string;
  profileImage: File | string;
  phone: {
    countryCode: string;
    number: string;
  };
}

const PatchMyInfo = async (data: PatchMyInfoProps) => {
  const formData = new FormData();

  formData.append("nickname", data.nickname);
  formData.append("bio", data.bio || "");
  formData.append("birth", data.birth);
  formData.append("gender", data.gender);

  formData.append("phone.countryCode", data.phone.countryCode || "");
  formData.append("phone.number", data.phone.number || "");

  // 만약 profileImg가 File 객체라면 파일 전송
  if (data.profileImage instanceof File) {
    formData.append("profileImage", data.profileImage);
    formData.append("removeImage", "false");
  }
  // 만약 profileImg가 아예 없거나 빈 값이라면 이미지 삭제 처리
  else if (!data.profileImage) {
    formData.append("removeImage", "true");
  }
  // 기존 URL(string) 유지 시
  else {
    formData.append("removeImage", "false");
  }

  const response = await authAxios.patch<ApiSuccessResponse>(
    `/users/me`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data.data;
};

/** 내 정보 수정 */
export const useUpdateMyInfoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AppError<PatchMyInfoProps>, PatchMyInfoProps>({
    mutationKey: ["patch-my-info"],
    mutationFn: PatchMyInfo,
    onSuccess: () => {
      // 내 정보 GET 쿼리 무효화 (최신화)
      queryClient.invalidateQueries({ queryKey: ["get-my-info"] });
    },
  });
};
