"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import type { AppError } from "@/api";
import { userQueryKeys } from "@/api/user/queryKeys";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import { invalidateAdultScopedQueries } from "./invalidateAdultScopedQueries";
import type { AdultContentResponse } from "./types";

const patchAdultContent = async (enabled: boolean) => {
  const response = await authAxios.patch<AdultContentResponse>(
    "/users/me/adult-content",
    { enabled },
  );

  return response.data;
};

interface AdultContentSnapshot {
  previous: boolean | undefined;
}

/**
 * 19 토글. 누르는 즉시 스위치를 옮기고(낙관적), 실패하면 되돌린다.
 * 성공하면 새 access 토큰(adm 클레임)으로 바꾸고 목록을 다시 받는다 — 서버는 토큰으로 노출을 판단한다.
 * 실패 안내는 호출부(토글)가 사유에 맞춰 직접 한다(성인인증 무효면 인증 창을 연다).
 */
export const useAdultContentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<AdultContentResponse, AppError, boolean, AdultContentSnapshot>({
    mutationKey: ["patch-adult-content"],
    mutationFn: patchAdultContent,
    meta: { silent: true },
    onMutate: (enabled) => {
      const previous = useUserStore.getState().user?.adultContentEnabled;
      useUserStore.getState().updateUser({ adultContentEnabled: enabled });
      return { previous };
    },
    onError: (_error, _enabled, context) => {
      useUserStore
        .getState()
        .updateUser({ adultContentEnabled: context?.previous ?? false });
    },
    onSuccess: (result) => {
      useAuthStore.getState().setAccessToken(result.accessToken);
      useUserStore
        .getState()
        .updateUser({ adultContentEnabled: result.adultContentEnabled });
      invalidateAdultScopedQueries(queryClient);
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.myInfo() });
    },
  });
};
