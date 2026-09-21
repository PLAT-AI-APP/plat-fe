import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { PromptMultiplier } from "@/type/room";
import { roomQueryKeys } from "./queryKeys";

interface PatchRoomMultiplierProps {
  roomId: string;
  multiplier: PromptMultiplier;
}

const patchRoomMultiplier = async ({
  roomId,
  multiplier,
}: PatchRoomMultiplierProps) => {
  await authAxios.patch(`/rooms/${roomId}/multiplier`, { multiplier });
};

/** 채팅방 프롬프트 배수 수정 */
export const usePatchRoomMultiplierMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, PatchRoomMultiplierProps>({
    mutationKey: ["patch-room-multiplier"],
    mutationFn: patchRoomMultiplier,
    onSuccess: (_, { roomId }) => {
      // 배수는 방 단건 응답에 실려 오므로 갱신 후 다시 읽습니다.
      queryClient.invalidateQueries({ queryKey: roomQueryKeys.detail(roomId) });
    },
  });
};
