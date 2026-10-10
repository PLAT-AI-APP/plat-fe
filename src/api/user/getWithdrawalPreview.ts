import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { WithdrawalPreview } from "@/type/withdrawal";
import { useAuthReady } from "@/hooks/data/useAuthReady";
import { useLocaleStore } from "@/store/useLocaleStore";
import { userQueryKeys } from "./queryKeys";

const getWithdrawalPreview = async () => {
  const response = await authAxios.get<WithdrawalPreview>(
    "/users/me/withdrawal/preview",
  );

  return response.data;
};

/**
 * 탈퇴 전 캐릭터 처리 미리보기.
 *
 * 탈퇴 요청은 이 목록과 똑같은 후보에 대한 선택을 보내야 통과한다(다르면 409).
 * 그래서 오래된 캐시를 쓰지 않고 화면에 들어올 때마다 다시 받는다.
 */
export const useWithdrawalPreviewQuery = () => {
  const authReady = useAuthReady();
  const locale = useLocaleStore((state) => state.locale);

  return useQuery<WithdrawalPreview, AppError>({
    queryKey: userQueryKeys.withdrawalPreview(locale),
    queryFn: getWithdrawalPreview,
    enabled: authReady,
    staleTime: 0,
  });
};
