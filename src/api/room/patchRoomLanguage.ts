import { useMutation } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { RoomLanguage } from "@/type/room";

interface PatchRoomLanguageProps {
  roomId: string;
  language: RoomLanguage;
}

const patchRoomLanguage = async ({
  roomId,
  language,
}: PatchRoomLanguageProps) => {
  await authAxios.patch(`/rooms/${roomId}/language`, { language });
};

/** 채팅방 응답 언어 수정 */
export const usePatchRoomLanguageMutation = () => {
  return useMutation<void, AppError, PatchRoomLanguageProps>({
    mutationKey: ["patch-room-language"],
    mutationFn: patchRoomLanguage,
  });
};
