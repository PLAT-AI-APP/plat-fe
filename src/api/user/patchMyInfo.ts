import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { useUserStore } from "@/store/useUserStore";
import { AppError } from "@/type/api";
import { postFileUpload } from "@/api/file/postFileUpload";
import { userQueryKeys } from "./queryKeys";

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
  const updateUser = useUserStore((state) => state.updateUser);

  return useMutation<void, AppError<PatchMyInfoProps>, PatchMyInfoProps>({
    mutationKey: ["patch-my-info"],
    mutationFn: PatchMyInfo,
    onSuccess: (_, { nickname, bio, birth }) => {
      // 헤더 닉네임 등은 store 를 읽는다. 재조회 → effect 로 옮겨 담기를 기다리면 한 박자 늦게
      // 바뀌어, 모달이 닫힌 뒤에도 잠깐 예전 이름이 보였다. 아는 값은 바로 넣는다
      // (프로필 사진은 서버가 만든 주소라 재조회로 받는다).
      updateUser({
        nickname,
        bio,
        ...(birth ? { birth } : {}),
      });
      queryClient.invalidateQueries({ queryKey: userQueryKeys.myInfo() });
      // 내 프로필 페이지도 공개 프로필 API 로 그리므로, 무효화하지 않으면 수정 결과가 캐시 시간만큼 안 보인다.
      queryClient.invalidateQueries({ queryKey: userQueryKeys.profiles() });
    },
  });
};
