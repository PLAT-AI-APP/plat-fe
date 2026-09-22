import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { roomQueryKeys } from "./queryKeys";

interface PatchRoomPersonaProps {
  roomId: string;
  personaId: string;
}

const patchRoomPersona = async ({
  roomId,
  personaId,
}: PatchRoomPersonaProps) => {
  await authAxios.patch(`/rooms/${roomId}/persona`, { personaId });
};

/** 채팅방 페르소나 변경 */
export const usePatchRoomPersonaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, PatchRoomPersonaProps>({
    mutationKey: ["patch-room-persona"],
    mutationFn: patchRoomPersona,
    onSuccess: (_, { roomId }) => {
      // 현재 페르소나는 방 단건 응답에 실려 오므로 갱신 후 다시 읽습니다.
      queryClient.invalidateQueries({ queryKey: roomQueryKeys.detail(roomId) });
      // 방 목록 줄에도 페르소나 이름이 함께 보이므로 같이 갱신합니다.
      queryClient.invalidateQueries({ queryKey: roomQueryKeys.lists() });
    },
  });
};
