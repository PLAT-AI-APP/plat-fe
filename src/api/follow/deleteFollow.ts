import { useMutation } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";

const deleteFollow = async (userId: string) => {
  await authAxios.delete(`/follow/${userId}`);
};

/** 언팔로우 api */
export const useUnFollowMutation = () => {
  return useMutation<void, AppError, { userId: string }>({
    mutationKey: ["delete-follow"],
    mutationFn: ({ userId }) => deleteFollow(userId),
  });
};
