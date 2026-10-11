import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { WithdrawalChecks } from "@/type/withdrawal";
import { useAuthReady } from "@/hooks/data/useAuthReady";
import { userQueryKeys } from "./queryKeys";

const getWithdrawalChecks = async () => {
  const response = await authAxios.get<WithdrawalChecks>(
    "/users/me/withdrawal/checks",
  );

  return response.data;
};

/** 탈퇴 전 확인. 환불·교환 상태는 그사이 바뀔 수 있어 화면에 들어올 때마다 다시 받는다. */
export const useWithdrawalChecksQuery = () => {
  const authReady = useAuthReady();

  return useQuery<WithdrawalChecks, AppError>({
    queryKey: userQueryKeys.withdrawalChecks(),
    queryFn: getWithdrawalChecks,
    enabled: authReady,
    staleTime: 0,
  });
};
