"use client";
import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { ApiSuccessResponse, AppError } from "@/type/api";
import { useEffect } from "react";
import { UserInfo, useUserStore } from "@/store/useUserStore";
import { useAuthStore } from "@/store/useAuthStore";

const GetMyInfo = async () => {
  const response =
    await authAxios.get<ApiSuccessResponse<UserInfo>>(`/users/me`);

  return response.data.data;
};

/** 내 정보 조회 */
export const useMyInfoQuery = () => {
  const setUser = useUserStore((state) => state.setUser);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const query = useQuery<UserInfo, AppError>({
    queryKey: ["get-my-info"],
    queryFn: GetMyInfo,
    staleTime: 1000 * 60 * 5,
    enabled: isLoggedIn,
  });

  // 데이터가 성공적으로 로드되면 Zustand 스토어에 저장
  useEffect(() => {
    if (query.data) {
      setUser(query.data);
    }
  }, [query.data, setUser]);

  return query;
};
