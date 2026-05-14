import { useMutation } from "@tanstack/react-query";
import { plainAxios } from "..";
import { useAuthStore } from "@/store/useAuthStore";

export const postRefresh = async () => {
  const response = await plainAxios.post(
    "/auth/refresh", // 이 경로가 핸들러에 등록된 경로와 토씨 하나 안 틀리고 같아야 합니다.
    {},
    {
      withCredentials: true,
    },
  );
  return response.data.data;
};

/** refreshToken 갱신 */
export const useRefrshMutation = () => {
  const { setAccessToken, setLoggedIn } = useAuthStore();

  return useMutation({
    mutationFn: postRefresh,
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setLoggedIn(true);
    },
  });
};
