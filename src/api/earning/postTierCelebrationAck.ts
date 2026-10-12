import { useMutation } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";

const postTierCelebrationAck = async () => {
  await authAxios.post("/earnings/tier/celebration/ack");
};

/** 관리자가 올린 등급의 승급 연출을 봤다고 알린다. 실패해도 다음 접속 때 한 번 더 보일 뿐이라 토스트를 띄우지 않는다. */
export const useTierCelebrationAckMutation = () =>
  useMutation<void, AppError, void>({
    mutationKey: ["post-earning-tier-celebration-ack"],
    mutationFn: postTierCelebrationAck,
    meta: { silent: true },
  });
