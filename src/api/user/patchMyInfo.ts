import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { postFileUpload } from "@/api/file/postFileUpload";

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
  profileImageFileId?: string;
}

const createProfilePayload = async (
  data: PatchMyInfoProps,
): Promise<PatchMyInfoPayload> => {
  // 프로필 이미지는 임시 업로드 API로 먼저 fileId를 발급받은 뒤 PATCH 본문에 실어 보냅니다.
  const uploadedFileId =
    data.profileImgFile instanceof File
      ? (
          await postFileUpload({
            fileType: "USER_PROFILE",
            file: data.profileImgFile,
          })
        ).fileId
      : undefined;

  return {
    nickname: data.nickname,
    bio: data.bio,
    ...(data.birth ? { birth: data.birth } : {}),
    ...(data.gender ? { gender: data.gender } : {}),
    ...(uploadedFileId ? { profileImageFileId: uploadedFileId } : {}),
  };
};

const PatchMyInfo = async (data: PatchMyInfoProps) => {
  const payload = await createProfilePayload(data);

  await authAxios.patch("/users/me", payload);
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
