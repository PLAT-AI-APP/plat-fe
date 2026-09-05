"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { Gender, Provider, UserInfo, useUserStore } from "@/store/useUserStore";
import { useAuthStore } from "@/store/useAuthStore";

interface UserProfileResponse {
  id: string;
  email: string;
  nickname: string;
  bio: string | null;
  profileImageUrl: string | null;
  birth: string | null;
  gender: Gender | null;
  provider: Provider;
}

const normalizeUserInfo = (user: UserProfileResponse): UserInfo => ({
  id: user.id,
  nickname: user.nickname,
  bio: user.bio ?? "",
  profileImage: user.profileImageUrl ?? "",
  birth: user.birth ?? "",
  gender: user.gender ?? "",
  provider: user.provider,
  email: user.email,
});

const GetMyInfo = async () => {
  const response = await authAxios.get<UserProfileResponse>(`/users/me`);

  return normalizeUserInfo(response.data);
};

/** 내 정보 조회 */
export const useMyInfoQuery = () => {
  const setUser = useUserStore((state) => state.setUser);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isAuthReady = useAuthStore((state) => state.isAuthReady);
  const accessToken = useAuthStore((state) => state.accessToken);

  const query = useQuery<UserInfo, AppError>({
    queryKey: ["get-my-info"],
    queryFn: GetMyInfo,
    staleTime: 1000 * 60 * 5,
    enabled: isAuthReady && isLoggedIn && !!accessToken,
  });

  useEffect(() => {
    if (query.data) {
      setUser(query.data);
    }
  }, [query.data, setUser]);

  return query;
};
