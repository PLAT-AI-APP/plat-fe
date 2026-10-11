import { useMutation } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { WithdrawalRequest, WithdrawalResult } from "@/type/withdrawal";

/** 진행 상태를 다른 컴포넌트에서도 구독할 수 있도록 키를 공유합니다. */
export const WITHDRAW_MUTATION_KEY = ["withdraw"];

/**
 * 미리보기를 다시 받아야 풀리는 실패.
 * 그사이 후보·동의서 버전·나이 조건이 바뀌어 지금 화면의 선택이 서버와 어긋났다.
 */
export const WITHDRAWAL_PREVIEW_STALE_CODES: readonly string[] = [
  "WITHDRAW_HANDOVER_DECISION_MISMATCH",
  "HANDOVER_CONSENT_OUTDATED",
  "HANDOVER_MINOR_NOT_ALLOWED",
];

const postWithdrawal = async (body: WithdrawalRequest) => {
  const response = await authAxios.post<WithdrawalResult>(
    "/users/me/withdrawal",
    body,
  );

  return response.data;
};

/**
 * 회원탈퇴. 만든 캐릭터마다 남기기·삭제 선택을 함께 보낸다.
 * 성공하면 서버가 refresh 쿠키를 지운다(예전 DELETE /users/me 와 같다).
 */
export const useWithdrawMutation = () => {
  return useMutation<WithdrawalResult, AppError, WithdrawalRequest>({
    mutationKey: WITHDRAW_MUTATION_KEY,
    mutationFn: postWithdrawal,
  });
};
