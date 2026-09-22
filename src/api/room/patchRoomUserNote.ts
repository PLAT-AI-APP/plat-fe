import { useMutation } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";

interface PatchRoomUserNoteProps {
  roomId: string;
  /** 최대 4000자 */
  userNote: string;
}

const patchRoomUserNote = async ({
  roomId,
  userNote,
}: PatchRoomUserNoteProps) => {
  await authAxios.patch(`/rooms/${roomId}/note`, { userNote });
};

/** 채팅방 유저 노트 수정 */
export const usePatchRoomUserNoteMutation = () => {
  return useMutation<void, AppError, PatchRoomUserNoteProps>({
    mutationKey: ["patch-room-user-note"],
    mutationFn: patchRoomUserNote,
  });
};
