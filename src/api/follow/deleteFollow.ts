import { useMutation } from "@tanstack/react-query";
import { authAxios } from "..";
import { ApiSuccessResponse, AppError } from "@/type/api";

const deleteFollow = async (userId: string) => {
  const response = await authAxios.delete<ApiSuccessResponse<null>>(
    `/follow/${userId}`,
  );
  return response.data;
};

/** 언팔로우 api */
export const useUnFollowMutation = () => {
  return useMutation<ApiSuccessResponse<null>, AppError, { userId: string }>({
    mutationKey: ["delete-follow"],
    mutationFn: ({ userId }) => deleteFollow(userId),
  });
};
