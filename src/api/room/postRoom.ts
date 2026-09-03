import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { CreateRoomRequest } from "@/type/room";
import { ROOM_LIST_QUERY_KEY } from "./getRoomList";

interface CreateRoomResponse {
  roomId: string;
}

const postRoom = async (request: CreateRoomRequest) => {
  const response = await authAxios.post<CreateRoomResponse>("/rooms", request);

  return response.data;
};

/** 채팅방 생성. 생성된 roomId로 채팅 화면에 진입합니다. */
export const usePostRoomMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateRoomResponse, AppError, CreateRoomRequest>({
    mutationKey: ["post-room"],
    mutationFn: postRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROOM_LIST_QUERY_KEY });
    },
  });
};
