import { useMutation } from "@tanstack/react-query";
import { plainAxios } from "..";
import { useAuthStore } from "@/store/useAuthStore";

type RefreshResponse = {
  accessToken?: string;
};

let refreshPromise: Promise<string | null> | null = null;

export const postRefresh = async () => {
  const response = await plainAxios.post<RefreshResponse>(
    "/auth/refresh", // 이 경로가 핸들러에 등록된 경로와 토씨 하나 안 틀리고 같아야 합니다.
    {},
    {
      withCredentials: true,
    },
  );
  return response.data;
};

export const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = postRefresh()
      .then((data) => data.accessToken ?? null)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

/** refreshToken 갱신 */
export const useRefrshMutation = () => {
  const { setAccessToken, setLoggedIn } = useAuthStore();

  return useMutation({
    mutationFn: refreshAccessToken,
    onSuccess: (accessToken) => {
      if (!accessToken) return;
      setAccessToken(accessToken);
      setLoggedIn(true);
    },
  });
};
