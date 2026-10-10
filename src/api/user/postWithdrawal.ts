import { useMutation } from "@tanstack/react-query";
import { authAxios } from "..";
import type { AppError } from "@/type/api";
import type { WithdrawalRequest } from "@/type/withdrawal";
import { DELETE_USER_MUTATION_KEY } from "./deleteUser";

const postWithdrawal = async (request: WithdrawalRequest) => {
  await authAxios.post("/users/me/withdrawal", request);
};

/**
 * 인수 후보를 고른 탈퇴. 고를 세계관이 없으면 deleteUser 를 쓴다.
 * 진행 상태를 같은 키로 구독할 수 있도록 deleteUser 와 키를 공유한다.
 */
export const usePostWithdrawalMutation = () =>
  useMutation<void, AppError, WithdrawalRequest>({
    mutationKey: DELETE_USER_MUTATION_KEY,
    mutationFn: postWithdrawal,
  });
