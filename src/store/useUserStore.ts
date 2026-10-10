import { create } from "zustand";
import { persist } from "zustand/middleware";

// 성별 유니온 타입 정의
export type Gender = "MALE" | "FEMALE" | "";
export type Provider = "KAKAO" | "GOOGLE" | "EMAIL";

// 유저 데이터 인터페이스 정의
export interface UserInfo {
  id: string;
  nickname: string;
  bio: string;
  profileImage: string;
  birth: string;
  gender: Gender;
  provider: Provider;
  email: string;
  /**
   * 본인인증·성인인증 상태(/users/me). 새로고침 직후(복원된 값)에는 없을 수 있어 선택값이다.
   * 개인정보라 localStorage 에 남기지 않는다(partialize 참고).
   */
  identityVerifiedAt?: string | null;
  identityVerifiedUntil?: string | null;
  adultVerifiedAt?: string | null;
  adultVerifiedUntil?: string | null;
  /** 19 토글. 목록 노출만 정한다. */
  adultContentEnabled?: boolean;
  /** 본인인증으로 생년월일이 확정돼 바꿀 수 없다. */
  birthLocked?: boolean;
}

interface UserState {
  user: UserInfo | null;
  setUser: (user: UserInfo) => void;
  updateUser: (partialUser: Partial<UserInfo>) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,

      // 전체 유저 정보 저장
      setUser: (user) => set({ user }),

      // 특정 필드만 부분 수정 (예: 닉네임만 바꿀 때)
      updateUser: (partialUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partialUser } : null,
        })),

      // 로그아웃 시 데이터 초기화
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-storage", // 로컬 스토리지에 저장될 키 이름
      // 새로고침 직후 헤더를 그리는 데 필요한 것만 남긴다. 이메일·생년월일·성별 같은 개인정보는
      // 공용 PC 의 localStorage 에 두지 않는다 — 나머지는 로그인하면 /users/me 로 곧 다시 채워진다.
      partialize: (state) => ({
        user: state.user
          ? {
              id: state.user.id,
              nickname: state.user.nickname,
              profileImage: state.user.profileImage,
            }
          : null,
      }),
    },
  ),
);
