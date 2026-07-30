import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { ApiSuccessResponse, AppError } from "@/type/api";

interface PatchMyInfoProps {
  nickname: string;
  bio: string;
  birth: string;
  gender: string;
  profileImgFile: File | string;
}

interface PatchMyInfoPayload {
  nickname: string;
  bio: string;
  birth?: string;
  gender?: string;
}

const createProfilePayload = (data: PatchMyInfoProps): PatchMyInfoPayload => ({
  nickname: data.nickname,
  bio: data.bio,
  ...(data.birth ? { birth: data.birth } : {}),
  ...(data.gender ? { gender: data.gender } : {}),
});

/** 프로필 수정 multipart payload 생성 */
const createProfileFormData = (
  payload: PatchMyInfoPayload,
  profileFile: File | string,
) => {
  const formData = new FormData();

  formData.append("nickname", payload.nickname);
  if (payload.bio) formData.append("bio", payload.bio);
  if (payload.birth) formData.append("birth", payload.birth);
  if (payload.gender) formData.append("gender", payload.gender);
  if (profileFile instanceof File) {
    formData.append("profile", profileFile);
  }

  return formData;
};

const PatchMyInfo = async (data: PatchMyInfoProps) => {
  const payload = createProfilePayload(data);

  await authAxios.patch<ApiSuccessResponse>(
    "/users/me",
    createProfileFormData(payload, data.profileImgFile),
  );
};

/** 내 정보 수정 */
export const useUpdateMyInfoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AppError<PatchMyInfoProps>, PatchMyInfoProps>({
    mutationKey: ["patch-my-info"],
    mutationFn: PatchMyInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-my-info"] });
    },
  });
};
