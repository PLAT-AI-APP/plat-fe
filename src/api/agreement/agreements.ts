import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { useAuthStore } from "@/store/useAuthStore";

export type AgreementType =
  "TERMS_OF_SERVICE" | "PRIVACY_POLICY" | "AGE_OVER_14" | "MARKETING";

export interface PendingAgreement {
  type: AgreementType;
  documentId: string | null;
  version: string | null;
}

export interface AgreementStatus {
  /** 아직 받지 않은 필수 동의. 비어 있지 않으면 다른 화면보다 동의 화면이 먼저다. */
  pending: PendingAgreement[];
  /** 동의 이력이 하나도 없다(소셜 가입 직후). "가입 마무리" 와 "약관 개정" 안내를 가른다. */
  firstConsent: boolean;
  marketingAgreed: boolean;
}

export interface AgreementRequest {
  termsOfService: boolean;
  privacyPolicy: boolean;
  ageOver14: boolean;
  /** 비우면 마케팅 상태를 바꾸지 않는다. */
  marketing?: boolean;
}

export const agreementQueryKeys = {
  status: () => ["get-my-agreements"] as const,
};

const getAgreementStatus = async () =>
  (await authAxios.get<AgreementStatus>("/users/me/agreements")).data;

/** 내 동의 상태. 로그인했을 때만 부른다. */
export const useAgreementStatusQuery = () => {
  const isAuthReady = useAuthStore((state) => state.isAuthReady);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  return useQuery<AgreementStatus, AppError>({
    queryKey: agreementQueryKeys.status(),
    queryFn: getAgreementStatus,
    enabled: isAuthReady && isLoggedIn,
    // 약관 개정은 드물다. 화면을 옮길 때마다 다시 묻지 않는다.
    staleTime: 5 * 60 * 1000,
  });
};

/** 밀린 필수 동의(소셜 첫 로그인·약관 개정). */
export const useAgreeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<void, AppError, AgreementRequest>({
    mutationFn: async (request) => {
      await authAxios.post("/users/me/agreements", request);
    },
    // 실패는 동의 창(AgreementGate)이 자기 문구로 알린다. 전역 토스트까지 뜨면 두 번 말한다.
    meta: { silent: true },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: agreementQueryKeys.status() }),
  });
};

/** 설정 화면의 마케팅 수신 동의·철회. */
export const useMarketingAgreementMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<void, AppError, boolean>({
    mutationFn: async (agreed) => {
      await authAxios.patch("/users/me/marketing", { agreed });
    },
    // 실패는 설정 화면이 자기 문구로 알린다. 전역 토스트까지 뜨면 두 번 말한다.
    meta: { silent: true },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: agreementQueryKeys.status() }),
  });
};
