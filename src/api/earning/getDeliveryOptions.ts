import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { RewardDeliveryOptions } from "@/type/earning";
import { useAuthReady } from "@/hooks/data/useAuthReady";
import { earningQueryKeys } from "./queryKeys";

const getDeliveryOptions = async () => {
  const response = await authAxios.get<RewardDeliveryOptions>(
    "/earnings/delivery-channels",
  );
  return response.data;
};

/** 상품권 받는 방법과 휴대폰으로 받을 때 쓰는 본인인증 번호(가린 값). */
export const useDeliveryOptionsQuery = () => {
  const authReady = useAuthReady();

  return useQuery<RewardDeliveryOptions, AppError>({
    queryKey: earningQueryKeys.deliveryChannels(),
    queryFn: getDeliveryOptions,
    enabled: authReady,
  });
};
