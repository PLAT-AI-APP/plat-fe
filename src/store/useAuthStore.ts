import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isLoggedIn: boolean;
  user: { nickname: string } | null;
  // AccessToken은 메모리 관리를 위해 여기에 추가
  accessToken: string | null;
  setLoggedIn: (status: boolean) => void;
  setAccessToken: (token: string | null) => void;
  setUser: (user: { nickname: string } | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      accessToken: null, // 초기값 (새로고침 시 null로 초기화됨)
      setLoggedIn: (status) => set({ isLoggedIn: status }),
      // 토큰 저장 함수
      setAccessToken: (token) => set({ accessToken: token }),
      setUser: (user) => set({ user }),
      logout: () => {
        set({ isLoggedIn: false, user: null, accessToken: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
      }),
    },
  ),
);
