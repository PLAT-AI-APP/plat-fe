import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { ApiSuccessResponse } from "@/type/api";
import { useAuthStore } from "@/store/useAuthStore";

export const postRefresh = async () => {
  const response = await axiosInstance.post<
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
