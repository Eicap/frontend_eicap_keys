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
}

interface AppStore {
  dialogs: DialogConfig[]
  openDialog: (dialog: Omit<DialogConfig, 'id'>) => string
  closeDialog: (id: string) => void
  closeAllDialogs: () => void
  updateDialog: (id: string, updates: Partial<DialogConfig>) => void
}

export const useAppStore = create<AppStore>((set) => ({
  dialogs: [],

  openDialog: (dialog) => {
    const id = `dialog-${Date.now()}-${Math.random()}`
    set((state) => ({
      dialogs: [...state.dialogs, { ...dialog, id }],
    }))
    return id
  },

  closeDialog: (id) => {
    set((state) => ({
      dialogs: state.dialogs.filter((d) => d.id !== id),
    }))
  },

  closeAllDialogs: () => {
    set({ dialogs: [] })
  },

  updateDialog: (id, updates) => {
    set((state) => ({
      dialogs: state.dialogs.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      ),
    }))
  },
}))
