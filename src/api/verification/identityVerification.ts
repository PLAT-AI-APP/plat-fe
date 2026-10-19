"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import type { AppError } from "@/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import { refreshWalletAfterReward } from "@/api/wallet/refreshWalletAfterReward";
import { earningQueryKeys } from "@/api/earning/queryKeys";
import { invalidateAdultScopedQueries } from "./invalidateAdultScopedQueries";
import type {
  CompleteDevIdentityVerificationRequest,
  ConfirmIdentityVerificationResponse,
  StartIdentityVerificationResponse,
} from "./types";

/** consentDocumentId: 동의한 본인인증 정보 수집·이용 동의서. 서버가 시행 중인 버전인지 보고 인증 기록에 남긴다. */
const startIdentityVerification = async (consentDocumentId: string) => {
  const response = await authAxios.post<StartIdentityVerificationResponse>(
    "/verifications/identity",
    { consentDocumentId },
  );

  return response.data;
};

const confirmIdentityVerification = async (verificationId: string) => {
  const response = await authAxios.post<ConfirmIdentityVerificationResponse>(
    `/verifications/identity/${encodeURIComponent(verificationId)}/confirm`,
  );

  return response.data;
};

const completeDevIdentityVerification = async ({
  verificationId,
  body,
}: {
  verificationId: string;
  body: CompleteDevIdentityVerificationRequest;
}) => {
  await authAxios.post(
    `/dev/identity-verifications/${encodeURIComponent(verificationId)}/complete`,
    body,
  );
};

/** 본인인증 건을 연다. 실패 문구는 모달 안에 직접 그린다. */
export const useStartIdentityVerificationMutation = () =>
  useMutation<StartIdentityVerificationResponse, AppError, string>({
    mutationKey: ["post-identity-verification-start"],
    mutationFn: startIdentityVerification,
    meta: { silent: true },
  });

/**
 * 인증 창에서 끝낸 건을 확정한다. 응답의 새 access 토큰(idu·adu 클레임)을 바로 쓰고,
 * 성인 노출·접근이 갈리는 조회를 모두 다시 받게 한다.
 */
export const useConfirmIdentityVerificationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ConfirmIdentityVerificationResponse, AppError, string>({
    mutationKey: ["post-identity-verification-confirm"],
    mutationFn: confirmIdentityVerification,
    meta: { silent: true },
    onSuccess: (result) => {
      useAuthStore.getState().setAccessToken(result.accessToken);
      // /users/me 를 다시 받기 전에도 배지·생년월일 잠금이 바로 바뀌도록 아는 값만 먼저 채운다.
      const now = new Date().toISOString();
      useUserStore.getState().updateUser({
        identityVerifiedAt: now,
        identityVerifiedUntil: result.identityVerifiedUntil,
        ...(result.adult
          ? { adultVerifiedAt: now, adultVerifiedUntil: result.adultVerifiedUntil }
          : {}),
        birthLocked: true,
      });
      invalidateAdultScopedQueries(queryClient);
      // 수익 요약의 인증 여부와 상품권 받는 번호(본인인증 휴대폰)가 바뀐다.
      void queryClient.invalidateQueries({ queryKey: earningQueryKeys.all() });
      // 처음 성인인증을 마치면 보상 노트가 비동기로 들어온다. 잔액이 늘 때까지 짧게 다시 확인한다.
      if (result.adult) void refreshWalletAfterReward(queryClient);
    },
  });
};

/** dev 가짜 인증 페이지가 인증 건을 "끝낸" 상태로 만든다(서버 dev 전용 API). */
export const useCompleteDevIdentityVerificationMutation = () =>
  useMutation<
    void,
    AppError,
    { verificationId: string; body: CompleteDevIdentityVerificationRequest }
  >({
    mutationKey: ["post-dev-identity-verification-complete"],
    mutationFn: completeDevIdentityVerification,
    meta: { silent: true },
  });
