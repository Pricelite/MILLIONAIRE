import { create } from "zustand";

type SessionUser = {
  id: string;
  email: string;
  role: string;
};

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: SessionUser | null;
  setSession: (session: { accessToken: string; refreshToken: string; user: SessionUser }) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  setSession: (session) => set({ accessToken: session.accessToken, refreshToken: session.refreshToken, user: session.user }),
  logout: () => set({ accessToken: null, refreshToken: null, user: null })
}));
