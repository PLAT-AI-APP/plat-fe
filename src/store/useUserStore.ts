import { create } from "zustand";
import { persist } from "zustand/middleware";

// 성별 유니온 타입 정의
export type Gender = "MALE" | "FEMALE" | "OTHER";
export type Provider = "google" | "kakao" | "plat";

// 유저 데이터 인터페이스 정의
export interface UserInfo {
  id: number;
  nickname: string;
  bio: string;
  profileImage: string;
  birth: string;
  gender: Gender;
  phone: {
    countryCode: string;
    number: string;
  };
  provider: Provider;
  email: string;
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
      user: {
        id: 0,
        nickname: "",
        bio: "",
        profileImage: "",
        birth: "",
        gender: "MALE",
        phone: {
          countryCode: "",
          number: "",
        },
        provider: "plat",
        email: "",
      },

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
    },
  ),
);
