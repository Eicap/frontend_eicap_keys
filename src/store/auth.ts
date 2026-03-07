import userService from "@/services/user/user.service";
import type { User } from "@/services/user/user.schema";
import { isTokenExpired } from "@/lib/jwt";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  loading: boolean;
  token: string;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  fetchUserProfile: () => Promise<void>;
  checkIsAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      loading: false,
      token: "",
      user: null,

      login: async (email: string, password: string) => {
        set({ loading: true });
        try {
          const token = await userService.login({ email, password });
          set({ token });

          // Obtener el perfil del usuario después del login
          await get().fetchUserProfile();
        } catch (error) {
          console.error("Error al iniciar sesión:", error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      fetchUserProfile: async () => {
        try {
          const user = await userService.getProfile();
          set({ user });
        } catch (error) {
          console.error("Error al obtener el perfil:", error);
        }
      },

      setToken: (token: string) => {
        set({ token });
      },

      setUser: (user: User) => {
        set({ user });
      },

      logout: () => {
        set({ token: "", user: null, });
      },

      // Verificar si el usuario está autenticado (token válido)
      checkIsAuthenticated: () => {
        const { token } = get();
        if (!token) return false;
        if (isTokenExpired(token)) {
          get().logout();
          return false;
        }
        return true;
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);
