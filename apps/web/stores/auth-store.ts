import { create } from "zustand";

import type { AuthStatus, PublicUser } from "../lib/auth.types";

interface AuthState {
  user: PublicUser | null;
  status: AuthStatus;
  setUser: (user: PublicUser | null) => void;
  setStatus: (status: AuthStatus) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: "idle",
  setUser: (user) => set({ user }),
  setStatus: (status) => set({ status }),
  reset: () => set({ user: null, status: "unauthenticated" }),
}));
