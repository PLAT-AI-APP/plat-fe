import { useMutation } from "@tanstack/react-query";
import { plainAxios } from "..";
import { ApiSuccessResponse } from "@/type/api";
import { useAuthStore } from "@/store/useAuthStore";

export const postRefresh = async () => {
  const response = await plainAxios.post<
    ApiSuccessResponse<{
      accessToken: string;
    }>
  >("/auth/refresh");

  return response.data.data;
};

/** refreshToken 갱신 */
export const useRefrshMutation = () => {
  const { setAccessToken } = useAuthStore();

  return useMutation({
    mutationFn: postRefresh,
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
    },
  });
};
