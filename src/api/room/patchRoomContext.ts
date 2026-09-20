import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { PromptMultiplier, RoomLanguage } from "@/type/room";
import { roomQueryKeys } from "./queryKeys";

interface RoomScopedProps {
  roomId: string;
}

interface PatchRoomMemoryProps extends RoomScopedProps {
  /** 최대 4000자 */
  memory: string;
}

interface PatchRoomUserNoteProps extends RoomScopedProps {
  /** 최대 4000자 */
  userNote: string;
}

interface PatchRoomPersonaProps extends RoomScopedProps {
  personaId: string;
}

interface PatchRoomMultiplierProps extends RoomScopedProps {
  multiplier: PromptMultiplier;
}

interface PatchRoomLanguageProps extends RoomScopedProps {
  language: RoomLanguage;
}

const patchRoomMemory = async ({ roomId, memory }: PatchRoomMemoryProps) => {
  await authAxios.patch(`/rooms/${roomId}/memory`, { memory });
};

const patchRoomUserNote = async ({
  roomId,
  userNote,
}: PatchRoomUserNoteProps) => {
  await authAxios.patch(`/rooms/${roomId}/note`, { userNote });
};

const patchRoomPersona = async ({
  roomId,
  personaId,
}: PatchRoomPersonaProps) => {
  await authAxios.patch(`/rooms/${roomId}/persona`, { personaId });
};

const patchRoomMultiplier = async ({
  roomId,
  multiplier,
}: PatchRoomMultiplierProps) => {
  await authAxios.patch(`/rooms/${roomId}/multiplier`, { multiplier });
};

const patchRoomLanguage = async ({
  roomId,
  language,
}: PatchRoomLanguageProps) => {
  await authAxios.patch(`/rooms/${roomId}/language`, { language });
};

/** 채팅방 장기기억 수정 */
export const usePatchRoomMemoryMutation = () => {
  return useMutation<void, AppError, PatchRoomMemoryProps>({
    mutationKey: ["patch-room-memory"],
    mutationFn: patchRoomMemory,
  });
};

/** 채팅방 유저 노트 수정 */
export const usePatchRoomUserNoteMutation = () => {
  return useMutation<void, AppError, PatchRoomUserNoteProps>({
    mutationKey: ["patch-room-user-note"],
    mutationFn: patchRoomUserNote,
  });
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

/** 채팅방 응답 언어 수정 */
export const usePatchRoomLanguageMutation = () => {
  return useMutation<void, AppError, PatchRoomLanguageProps>({
    mutationKey: ["patch-room-language"],
    mutationFn: patchRoomLanguage,
  });
};
