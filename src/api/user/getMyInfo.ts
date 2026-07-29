"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { UserInfo, useUserStore } from "@/store/useUserStore";
import { useAuthStore } from "@/store/useAuthStore";

interface MyInfoApiResponse {
  result?: "OK";
  data?: Partial<UserInfo> | { user?: Partial<UserInfo> };
  user?: Partial<UserInfo>;
}

/** 사용자 정보 기본값 보정 */
const normalizeUserInfo = (user: Partial<UserInfo>): UserInfo => ({
  id: user.id ?? "",
  nickname: user.nickname ?? "",
  bio: user.bio ?? "",
  profileImage: user.profileImage ?? "",
  birth: user.birth ?? "",
  gender: user.gender ?? "",
  phone: {
    countryCode: user.phone?.countryCode ?? "",
    number: user.phone?.number ?? "",
  },
  provider: user.provider ?? "EMAIL",
  email: user.email ?? "",
});

/** 내 정보 응답 위치 보정 */
const getNormalizedMyInfo = (response: MyInfoApiResponse): UserInfo => {
  const data = response.data;
  const user =
    data && "user" in data ? data.user : data ?? response.user ?? response;

  if (user && ("id" in user || "nickname" in user || "email" in user)) {
    return normalizeUserInfo(user);
  }

  throw {
    code: "MESSAGE",
    fields: {},
    message: "내 정보 응답을 확인해 주세요.",
  } satisfies AppError;
};

const GetMyInfo = async () => {
  const response = await authAxios.get<MyInfoApiResponse>(`/users/me`);

  return getNormalizedMyInfo(response.data);
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
