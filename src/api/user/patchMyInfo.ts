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

const createProfilePayload = (data: PatchMyInfoProps) => ({
  nickname: data.nickname,
  bio: data.bio || "",
  ...(data.birth ? { birth: data.birth } : {}),
  ...(data.gender ? { gender: data.gender } : {}),
});

const PatchMyInfo = async (data: PatchMyInfoProps) => {
  const payload = createProfilePayload(data);

  if (!(data.profileImgFile instanceof File)) {
    const response = await authAxios.patch<ApiSuccessResponse>(
      "/users/me",
      payload,
    );

    return response.data.data;
  }

  const formData = new FormData();
  formData.append("nickname", payload.nickname);
  formData.append("bio", payload.bio);
  if (payload.birth) formData.append("birth", payload.birth);
  if (payload.gender) formData.append("gender", payload.gender);
  formData.append("profileImage", data.profileImgFile);

  const response = await authAxios.patch<ApiSuccessResponse>(
    "/users/me",
    formData,
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
      queryClient.invalidateQueries({ queryKey: ["get-my-info"] });
    },
  });
};
