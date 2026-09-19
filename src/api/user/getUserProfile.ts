"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { AppError } from "@/type/api";
import { resolveApiImageUrl } from "@/lib/file";
import { userQueryKeys } from "./queryKeys";

/** 백엔드 PublicUserProfileResponse. 이메일·생년월일 같은 비공개 정보는 내려오지 않습니다. */
interface PublicUserProfileResponse {
  id: string;
  nickname: string;
  bio: string | null;
  profileImageUrl: string | null;
}

export interface UserProfile {
  id: string;
  nickname: string;
  bio: string;
  /** 올리지 않은 유저는 없습니다. 그때는 호출부가 기본 이미지를 씁니다. */
  profileImageUrl?: string;
}

const normalizeUserProfile = (user: PublicUserProfileResponse): UserProfile => ({
  id: user.id,
  nickname: user.nickname,
  bio: user.bio ?? "",
  profileImageUrl: resolveApiImageUrl(user.profileImageUrl),
});

const getUserProfile = async (userId: string) => {
  const response = await axiosInstance.get<PublicUserProfileResponse>(
    `/users/${encodeURIComponent(userId)}`,
  );

  return normalizeUserProfile(response.data);
};

/**
 * 특정 유저의 공개 프로필 조회. 프로필 페이지 헤더가 그립니다.
 *
 * 로그인 없이 조회할 수 있고, 없거나 탈퇴한 유저는 404(USER_NOT_FOUND)입니다.
 * 내 프로필도 같은 엔드포인트로 그립니다 — 수정 뒤에는 useUpdateMyInfoMutation 이 무효화합니다.
 */
export const useUserProfileQuery = (userId: string) => {
  return useQuery<UserProfile, AppError>({
    queryKey: userQueryKeys.profile(userId),
    queryFn: () => getUserProfile(userId),
    enabled: Boolean(userId),
  });
};
