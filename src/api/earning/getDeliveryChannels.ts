import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { RewardDeliveryChannel } from "@/type/earning";
import { useAuthReady } from "@/hooks/data/useAuthReady";
import { earningQueryKeys } from "./queryKeys";

const getDeliveryChannels = async () => {
  const response = await authAxios.get<RewardDeliveryChannel[]>(
    "/earnings/delivery-channels",
  );
  return response.data;
};

/** 상품권 받는 방법. 발송이 준비된 방법만 온다. */
export const useDeliveryChannelsQuery = () => {
  const authReady = useAuthReady();

  return useQuery<RewardDeliveryChannel[], AppError>({
    queryKey: earningQueryKeys.deliveryChannels(),
    queryFn: getDeliveryChannels,
    enabled: authReady,
    staleTime: Infinity,
  });
};
