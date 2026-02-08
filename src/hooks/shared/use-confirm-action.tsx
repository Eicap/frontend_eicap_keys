import { useAppStore } from '@/store/app'

interface ConfirmActionOptions {
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
  isDestructive?: boolean
}

export function useConfirmAction() {
  const { openDialog } = useAppStore()

  const confirm = (options: ConfirmActionOptions) => {
    openDialog({
      id: "confirm-action",
      title: options.title,
      description: options.description,
      confirmText: options.confirmText || 'Confirmar',
      cancelText: options.cancelText || 'Cancelar',
      onConfirm: options.onConfirm,
      onCancel: options.onCancel,
      isDestructive: options.isDestructive || false,
    })
  }

  return { confirm }
}
