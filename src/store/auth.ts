import userService from '@/services/user/user.service'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthStore {
  isAuthenticated: boolean
  loading: boolean
  token: string
  login: (email: string, password: string) => Promise<void>
  setToken: (token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      loading: false,
      token: '',

      login: async (email: string, password: string) => {
        set({ loading: true })
        try {
          const token = await userService.login({ email, password })
          set({ token, isAuthenticated: true })
        } catch (error) {
          console.error('Error al iniciar sesión:', error)
          throw error
        } finally {
          set({ loading: false })
        }
      },

      setToken: (token: string) => {
        set({ token, isAuthenticated: true })
      },

      logout: () => {
        set({ isAuthenticated: false, token: '' })
      },
    }),
    {
      name: 'auth-store', 
      partialize: (state) => ({
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }), 
    }
  )
)