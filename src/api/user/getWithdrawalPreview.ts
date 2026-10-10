import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import type { AppError } from "@/type/api";
import type { WithdrawalPreview } from "@/type/withdrawal";
import { useAuthStore } from "@/store/useAuthStore";
import { userQueryKeys } from "./queryKeys";

const getWithdrawalPreview = async () => {
  const response = await authAxios.get<WithdrawalPreview>(
    "/users/me/withdrawal/preview",
  );

  return response.data;
};

/**
 * 탈퇴 미리보기. 남기기/삭제를 고를 세계관과, 남길 수 없는 이유를 알려 준다.
 * 탈퇴 화면에서만 쓰고, 열 때마다 최신 상태를 받는다.
 */
export const useWithdrawalPreviewQuery = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return useQuery<WithdrawalPreview, AppError>({
    queryKey: userQueryKeys.withdrawalPreview(),
    queryFn: getWithdrawalPreview,
    enabled: isLoggedIn,
    staleTime: 0,
    gcTime: 0,
  });
};
