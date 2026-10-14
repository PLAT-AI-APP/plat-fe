import type { QueryClient } from "@tanstack/react-query";
import type { WalletBalance } from "@/type/wallet";
import { walletQueryKeys } from "./queryKeys";

/** 첫 확인은 바로, 이어서 서버가 보상을 넣을 때까지 짧은 간격으로 다시 확인한다. */
const REFRESH_DELAYS_MS = [0, 1000, 2000, 3000] as const;

const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const readAvailable = (queryClient: QueryClient) =>
  queryClient.getQueryData<WalletBalance>(walletQueryKeys.balance())
    ?.availableBalance ?? 0;

/**
 * 보상 노트가 들어올 때까지 지갑 잔액을 다시 받는다.
 *
 * 성인인증 보상 같은 지급은 인증 응답 뒤에 서버가 비동기로 넣는다(커밋 후 이벤트). 그래서 인증 응답 직후 한 번만
 * 다시 받으면 아직 예전 잔액이 와서, 새로고침하기 전까지 늘어난 노트가 보이지 않았다.
 * 잔액이 늘면 바로 멈추고, 끝내 안 늘어도(이미 받은 사람 등) 짧게 끝난다.
 */
export const refreshWalletAfterReward = async (queryClient: QueryClient) => {
  const before = readAvailable(queryClient);

  for (const delay of REFRESH_DELAYS_MS) {
    if (delay > 0) await wait(delay);

    // 화면에 잔액을 쓰는 곳이 없어 비활성인 조회도 받아 둔다.
    await queryClient.invalidateQueries({
      queryKey: walletQueryKeys.balance(),
      refetchType: "all",
    });

    if (readAvailable(queryClient) > before) return;
  }
};
