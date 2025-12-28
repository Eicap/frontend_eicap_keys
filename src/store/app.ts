import { create } from 'zustand'

export interface DialogConfig {
  id: string
  title: string
  description?: string
  content?: React.ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void
  isDestructive?: boolean
  isLoading?: boolean
  width?: string  // Clase Tailwind como 'max-w-4xl', 'max-w-2xl', etc
}

interface AppStore {
  dialogs: DialogConfig[]
  openDialog: (dialog: DialogConfig) => void
  closeDialog: (id: string) => void
  updateDialog: (id: string, updates: Partial<DialogConfig>) => void
  closeAllDialogs: () => void
}

export const useAppStore = create<AppStore>((set) => ({
  dialogs: [],

  openDialog: (dialog) => {
    set((state) => ({
      dialogs: [dialog, ...state.dialogs],
    }))
    return dialog.id
  },

  closeDialog: (id) => {
    set((state) => ({
      dialogs: state.dialogs.filter((d) => d.id !== id),
    }))
  },

  updateDialog: (id, updates) => {
    set((state) => ({
      dialogs: state.dialogs.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      ),
    }))
  },

  closeAllDialogs: () => {
    set({ dialogs: [] })
  },
}))
