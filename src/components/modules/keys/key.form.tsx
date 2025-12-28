import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { KeyUpdateSchema, type Key } from '@/services/key/key.schema'
import { useUpdateKeyMutation } from '@/hooks/keys/useMutation.key'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ClientSelector } from '../clients/selector.client'
import { useAppStore } from '@/store/app'
import type { Client } from '@/services/client/client.schema'

interface KeyFormProps {
  keyData: Key
  dialogId?: string
}

export default function KeyForm({ keyData, dialogId }: KeyFormProps) {
  const [selectedClient, setSelectedClient] = useState<{ id: string; name: string; email: string } | null>(keyData.client || null)
  const { openDialog, closeDialog } = useAppStore()
  
  const mutation = useUpdateKeyMutation(keyData.id, { dialogId })
  const schema = KeyUpdateSchema

  const defaultValues = {
    code: keyData.code,
    state: keyData.state,
    init_date: keyData.init_date ? keyData.init_date : undefined,
    due_date: keyData.due_date ? keyData.due_date : undefined,
    key_type_id: keyData.key_type.id,
    client_id: keyData.client?.id || undefined,
  }

  const form = useForm({
    defaultValues,
    onSubmit: async (values) => {
      const formValues = values.value as typeof defaultValues

      // Solo enviar campos modificados
      const dirtyFields: Record<string, any> = {}
      let hasDirtyFields = false

      // Comparar cada campo
      if (formValues.code !== defaultValues.code) {
        dirtyFields.code = formValues.code
        hasDirtyFields = true
      }

      if (formValues.state !== defaultValues.state) {
        dirtyFields.state = formValues.state
        hasDirtyFields = true
      }

      if (formValues.init_date !== defaultValues.init_date) {
        dirtyFields.init_date = formValues.init_date ? new Date(formValues.init_date) : null
        hasDirtyFields = true
      }

      if (formValues.due_date !== defaultValues.due_date) {
        dirtyFields.due_date = formValues.due_date ? new Date(formValues.due_date) : null
        hasDirtyFields = true
      }

      if (formValues.client_id !== defaultValues.client_id) {
        dirtyFields.client_id = formValues.client_id || null
        hasDirtyFields = true
      }

      // Si no hay cambios, no enviar
      if (!hasDirtyFields) {
        toast.error('No hay cambios para guardar')
        return
      }

      const result = schema.safeParse(dirtyFields)
      if (!result.success) {
        const errors = result.error.issues.map(e => e.message).join(', ')
        toast.error(`Validación fallida: ${errors}`)
        return
      }

      toast.promise(mutation.mutateAsync(dirtyFields), {
        loading: 'Actualizando key...',
        success: 'Key actualizada exitosamente',
        error: (err) => (err as Error).message || 'Error al actualizar key',
      })
    },
  })

  const handleOpenClientSelector = () => {
    const selectorDialogId = `key-edit-client-selector-${Date.now()}`
    openDialog({
      id: selectorDialogId,
      title: 'Seleccionar Cliente',
      content: (
        <ClientSelector
          onSelect={(client: Client) => {
            setSelectedClient({
              id: client.id,
              name: client.name,
              email: client.email,
            })
            form.setFieldValue('client_id', client.id)
            closeDialog(selectorDialogId)
          }}
        />
      ),
      confirmText: undefined,
      cancelText: 'Cerrar',
    })
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-4"
      >
        {/* Código */}
        <form.Field
          name="code"
          validators={{
            onChange: ({ value }) => {
              if (!value) return 'El código es requerido'
              if (value.length < 1) return 'El código es requerido'
              if (value.length > 100) return 'El código no puede exceder 100 caracteres'
              return undefined
            },
          }}
          children={(field) => (
            <div>
              <label htmlFor={field.name} className="text-sm font-medium">
                Código
              </label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="KEY-001"
                disabled={mutation.isPending}
              />
              {field.state.meta.errors?.length > 0 && (
                <p className="text-sm text-destructive mt-1">{field.state.meta.errors[0]}</p>
              )}
            </div>
          )}
        />

        {/* Estado */}
        <form.Field
          name="state"
          validators={{
            onChange: ({ value }) => {
              if (!value) return 'El estado es requerido'
              return undefined
            },
          }}
          children={(field) => (
            <div>
              <label htmlFor={field.name} className="text-sm font-medium">
                Estado
              </label>
              <Select
                value={field.state.value}
                onValueChange={(value) => field.handleChange(value as any)}
                disabled={mutation.isPending}
              >
                <SelectTrigger id={field.name}>
                  <SelectValue placeholder="Selecciona un estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pendiente</SelectItem>
                  <SelectItem value="ACTIVE">Activo</SelectItem>
                  <SelectItem value="APPROVED">Aprobado</SelectItem>
                  <SelectItem value="INACTIVE">Inactivo</SelectItem>
                  <SelectItem value="EXPIRED">Expirado</SelectItem>
                </SelectContent>
              </Select>
              {field.state.meta.errors?.length > 0 && (
                <p className="text-sm text-destructive mt-1">{field.state.meta.errors[0]}</p>
              )}
            </div>
          )}
        />

        {/* Cliente */}
        <div>
          <label className="text-sm font-medium">
            Cliente
          </label>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start text-left font-normal"
            onClick={handleOpenClientSelector}
            disabled={mutation.isPending}
          >
            {selectedClient ? selectedClient.name : 'Selecciona un cliente'}
          </Button>
          {selectedClient && (
            <p className="text-xs text-muted-foreground mt-1">{selectedClient.email}</p>
          )}
        </div>

        {/* Fecha Inicio */}
        <form.Field
          name="init_date"
          children={(field) => (
            <div>
              <label htmlFor={field.name} className="text-sm font-medium">
                Fecha de Inicio
              </label>
              <Input
                id={field.name}
                name={field.name}
                type="date"
                value={field.state.value ? (typeof field.state.value === 'string' ? field.state.value.split('T')[0] : new Date(field.state.value).toISOString().split('T')[0]) : ''}
                onBlur={field.handleBlur}
                onChange={(e) => {
                  const date = e.target.value ? e.target.value : undefined
                  field.handleChange(date as any)
                }}
                disabled={mutation.isPending}
              />
              {field.state.meta.errors?.length > 0 && (
                <p className="text-sm text-destructive mt-1">{field.state.meta.errors[0]}</p>
              )}
            </div>
          )}
        />

        {/* Fecha Vencimiento */}
        <form.Field
          name="due_date"
          children={(field) => (
            <div>
              <label htmlFor={field.name} className="text-sm font-medium">
                Fecha de Vencimiento
              </label>
              <Input
                id={field.name}
                name={field.name}
                type="date"
                value={field.state.value ? (typeof field.state.value === 'string' ? field.state.value.split('T')[0] : new Date(field.state.value).toISOString().split('T')[0]) : ''}
                onBlur={field.handleBlur}
                onChange={(e) => {
                  const date = e.target.value ? e.target.value : undefined
                  field.handleChange(date as any)
                }}
                disabled={mutation.isPending}
              />
              {field.state.meta.errors?.length > 0 && (
                <p className="text-sm text-destructive mt-1">{field.state.meta.errors[0]}</p>
              )}
            </div>
          )}
        />

        <Button type="submit" disabled={mutation.isPending} className="w-full">
          Actualizar Key
        </Button>
      </form>
    </>
  )
}
