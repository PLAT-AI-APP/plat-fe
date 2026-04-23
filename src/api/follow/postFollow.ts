import { useMutation } from "@tanstack/react-query";
import { authAxios } from "..";
import { ApiSuccessResponse, AppError } from "@/type/api";

const postFollow = async (userId: number) => {
  const response = await authAxios.post<ApiSuccessResponse<null>>(
    `/follow/${userId}`,
  );
  return response.data;
};

/** 팔로우 api */
export const useFollowMutation = () => {
  return useMutation<ApiSuccessResponse<null>, AppError, { userId: number }>({
    mutationKey: ["post-follow"],
    mutationFn: ({ userId }) => postFollow(userId),
  });
};
