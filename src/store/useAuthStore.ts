import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isLoggedIn: boolean;
  setLoggedIn: (status: boolean) => void;
  user: { nickname: string } | null;
  // setUser: (user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      setLoggedIn: (status) => set({ isLoggedIn: status }),
      logout: () => set({ isLoggedIn: false, user: null }),
    }),
    { name: "auth-storage" },
  ),
);
