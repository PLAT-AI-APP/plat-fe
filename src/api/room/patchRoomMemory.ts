import { useMutation } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";

interface PatchRoomMemoryProps {
  roomId: string;
  /** 최대 4000자 */
  memory: string;
}

const patchRoomMemory = async ({ roomId, memory }: PatchRoomMemoryProps) => {
  await authAxios.patch(`/rooms/${roomId}/memory`, { memory });
};

/** 채팅방 장기기억 수정 */
export const usePatchRoomMemoryMutation = () => {
  return useMutation<void, AppError, PatchRoomMemoryProps>({
    mutationKey: ["patch-room-memory"],
    mutationFn: patchRoomMemory,
  });
};
