import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'dark' | 'light' | 'system'

interface ThemeStore {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'system' as Theme,

      setTheme: (theme: Theme) => {
        set({ theme })

        const root = window.document.documentElement
        root.classList.remove('light', 'dark')

        if (theme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'
          root.classList.add(systemTheme)
        } else {
          root.classList.add(theme)
        }
      },
    }),
    {
      name: 'theme-store',
    }
  )
)

// Aplicar tema al cargar
if (typeof window !== 'undefined') {
  const theme = localStorage.getItem('theme-store')
  if (theme) {
    const parsed = JSON.parse(theme)
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (parsed.state.theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(parsed.state.theme)
    }
  }
}
