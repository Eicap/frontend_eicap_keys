import { useAppStore } from '@/store/app'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export function DialogCore() {
  const { dialogs, closeDialog, updateDialog } = useAppStore()

  if (dialogs.length === 0) return null

  const dialog = dialogs[0]

  const handleConfirm = async () => {
    try {
      updateDialog(dialog.id, { isLoading: true })
      await dialog.onConfirm?.()
    } finally {
      closeDialog(dialog.id)
    }
  }

  const handleCancel = () => {
    dialog.onCancel?.()
    closeDialog(dialog.id)
  }

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) {
          handleCancel()
        }
      }}
    >
      <DialogContent className="w-[95vw] max-w-2xl h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="shrink-0 border-b px-6 py-4">
          <DialogTitle>{dialog.title}</DialogTitle>
          {dialog.description && (
            <DialogDescription>{dialog.description}</DialogDescription>
          )}
        </DialogHeader>

        {dialog.content && (
          <ScrollArea className="flex-1 overflow-hidden">
            <div className="px-6 py-4">{dialog.content}</div>
          </ScrollArea>
        )}

        <DialogFooter className="shrink-0 border-t px-6 py-4">
          <Button variant="outline" onClick={handleCancel} disabled={dialog.isLoading}>
            {dialog.cancelText || 'Cancelar'}
          </Button>
          {dialog.onConfirm && (
            <Button
              onClick={handleConfirm}
              disabled={dialog.isLoading}
              variant={dialog.isDestructive ? 'destructive' : 'default'}
            >
              {dialog.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {dialog.confirmText || 'Confirmar'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
