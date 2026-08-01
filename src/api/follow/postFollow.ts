import { useMutation } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";

const postFollow = async (userId: string) => {
  await authAxios.post(`/follow/${userId}`);
};

/** 팔로우 api */
export const useFollowMutation = () => {
  return useMutation<void, AppError, { userId: string }>({
    mutationKey: ["post-follow"],
    mutationFn: ({ userId }) => postFollow(userId),
  });
};
