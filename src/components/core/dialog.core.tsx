import { useAppStore, type DialogConfig } from '@/store/app'
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
import { useState, useEffect } from 'react'

export function DialogCore() {
  const { dialogs, closeDialog, updateDialog } = useAppStore()

  if (dialogs.length === 0) return null

  return (
    <>
      {dialogs.map((dialog) => (
        <DialogInstance
          key={dialog.id}
          dialog={dialog}
          onConfirm={async () => {
            updateDialog(dialog.id, { isLoading: true })
            await dialog.onConfirm?.()
            closeDialog(dialog.id)
          }}
          onCancel={() => {
            dialog.onCancel?.()
            closeDialog(dialog.id)
          }}
        />
      ))}
    </>
  )
}

interface DialogInstanceProps {
  dialog: DialogConfig
  onConfirm: () => void | Promise<void>
  onCancel: () => void
}

function DialogInstance({ dialog, onConfirm, onCancel }: DialogInstanceProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const getWidthValue = (width?: string): string => {
    const widthMap: Record<string, string> = {
      'max-w-sm': '384px',
      'max-w-md': '448px',
      'max-w-lg': '512px',
      'max-w-xl': '576px',
      'max-w-2xl': '672px',
      'max-w-3xl': '768px',
      'max-w-4xl': '896px',
      'max-w-5xl': '1024px',
      'max-w-6xl': '1152px',
      'max-w-7xl': '1280px',
    }
    return widthMap[width || 'max-w-2xl'] || '90vw'
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    setIsDragging(true)
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, offset])
  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) {
          onCancel()
        }
      }}
    >
      <DialogContent 
        className="h-[80vh] flex flex-col p-0 gap-0"
        onInteractOutside={(e) => e.preventDefault()}
        style={{
          width: getWidthValue(dialog.width),
          maxWidth: '95vw',
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: isDragging ? 'none' : 'transform 0.15s ease-out',
        } as React.CSSProperties}
      >
        <DialogHeader 
          className="shrink-0 border-b px-6 py-4 cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          style={{ touchAction: 'none', userSelect: 'none' }}
        >
          <DialogTitle>{dialog.title}</DialogTitle>
          {dialog.description && (
            <DialogDescription>{dialog.description}</DialogDescription>
          )}
        </DialogHeader>

        {dialog.content && (
          <ScrollArea className="flex-1 overflow-hidden">
            <div className="px-6 py-4 overflow-x-auto">{dialog.content}</div>
          </ScrollArea>
        )}

        <DialogFooter className="shrink-0 border-t px-6 py-4">
          <Button variant="outline" onClick={onCancel} disabled={dialog.isLoading}>
            {dialog.cancelText || 'Cancelar'}
          </Button>
          {dialog.onConfirm && (
            <Button
              onClick={onConfirm}
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
