import { useState, useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { CreateBatchSchema, type CreateBatch } from '@/services/batch/batch.schema'
import { useCreateBatchMutation } from '@/hooks/batchs/useMutation.batch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useAppStore } from '@/store/app'
import { ClientSelector } from '../clients/selector.client'
import { KeyTypeSelector } from './selector.key_type'
import type { Client } from '@/services/client/client.schema'
import type { KeyType } from '@/services/key_type/key_type.schema'

interface BatchCreateFormProps {
  dialogId?: string
}

export default function BatchCreateForm({ dialogId }: BatchCreateFormProps) {
  const [selectedClient, setSelectedClient] = useState<{ id: string; name: string; email: string } | null>(null)
  const [selectedKeyType, setSelectedKeyType] = useState<{ id: string; name: string } | null>(null)
  const { openDialog } = useAppStore()
  
  // Log cuando cambia selectedClient
  useEffect(() => {
    console.log('[BatchCreateForm] selectedClient cambió:', selectedClient)
  }, [selectedClient])

  // Log cuando cambia selectedKeyType
  useEffect(() => {
    console.log('[BatchCreateForm] selectedKeyType cambió:', selectedKeyType)
  }, [selectedKeyType])
  
  const mutation = useCreateBatchMutation({ dialogId })
  const schema = CreateBatchSchema

  const defaultValues: CreateBatch = {
    title: '',
    quantity: 1,
    description: '',
    key_type_id: '',
    client_id: '',
  }

  const form = useForm({
    defaultValues,
    onSubmit: async (values) => {
      const formValues = values.value as CreateBatch

      // Validar que los selectores tengan valores
      if (!selectedClient) {
        toast.error('Debes seleccionar un cliente')
        return
      }

      if (!selectedKeyType) {
        toast.error('Debes seleccionar un tipo de key')
        return
      }

      const dataToSubmit = {
        ...formValues,
        client_id: selectedClient.id,
        key_type_id: selectedKeyType.id,
      }

      const result = schema.safeParse(dataToSubmit)
      if (!result.success) {
        const errors = result.error.issues.map(e => e.message).join(', ')
        toast.error(`Validación fallida: ${errors}`)
        return
      }

      toast.promise(mutation.mutateAsync(dataToSubmit), {
        loading: 'Creando lote...',
        success: 'Lote creado exitosamente',
        error: (err) => (err as Error).message || 'Error al crear lote',
      })
    },
  })

  const handleOpenClientSelector = () => {
    console.log('[BatchCreateForm] handleOpenClientSelector llamado')
    const selectorDialogId = `batch-create-client-selector-${Date.now()}`
    console.log('[BatchCreateForm] Dialog abierto con ID:', selectorDialogId)
    openDialog({
      id: selectorDialogId,
      title: 'Seleccionar Cliente',
      width: 'max-w-6xl',
      content: (
        <ClientSelector
          dialogId={selectorDialogId}
          onSelect={(client: Client) => {
            console.log('[BatchCreateForm] onSelect callback ejecutado con cliente:', client)
            console.log('[BatchCreateForm] Antes de setSelectedClient, selectedClient es:', selectedClient)
            
            setSelectedClient({
              id: client.id,
              name: client.name,
              email: client.email,
            })
            console.log('[BatchCreateForm] setSelectedClient ejecutado')
            
            console.log('[BatchCreateForm] Antes de form.setFieldValue, form.state.values:', form.state.values)
            form.setFieldValue('client_id', client.id)
            console.log('[BatchCreateForm] form.setFieldValue ejecutado con client_id:', client.id)
          }}
        />
      ),
      confirmText: undefined,
      cancelText: 'Cerrar',
    })
  }

  const handleOpenKeyTypeSelector = () => {
    console.log('[BatchCreateForm] handleOpenKeyTypeSelector llamado')
    const selectorDialogId = `batch-create-keytype-selector-${Date.now()}`
    console.log('[BatchCreateForm] Dialog abierto con ID:', selectorDialogId)
    openDialog({
      id: selectorDialogId,
      title: 'Seleccionar Tipo de Key',
      width: 'max-w-6xl',
      content: (
        <KeyTypeSelector
          dialogId={selectorDialogId}
          onSelect={(keyType: KeyType) => {
            console.log('[BatchCreateForm] onSelect callback ejecutado con keyType:', keyType)
            console.log('[BatchCreateForm] Antes de setSelectedKeyType, selectedKeyType es:', selectedKeyType)
            
            setSelectedKeyType({
              id: keyType.id,
              name: keyType.name,
            })
            console.log('[BatchCreateForm] setSelectedKeyType ejecutado')
            
            console.log('[BatchCreateForm] Antes de form.setFieldValue, form.state.values:', form.state.values)
            form.setFieldValue('key_type_id', keyType.id)
            console.log('[BatchCreateForm] form.setFieldValue ejecutado con key_type_id:', keyType.id)
          }}
        />
      ),
      confirmText: undefined,
      cancelText: 'Cerrar',
    })
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-4"
    >
      {/* Título */}
      <form.Field
        name="title"
        validators={{
          onChange: ({ value }) => {
            if (!value) return 'El título es requerido'
            if (value.length < 1) return 'El título es requerido'
            if (value.length > 100) return 'El título no puede exceder 100 caracteres'
            return undefined
          },
        }}
        children={(field) => (
          <div>
            <label htmlFor={field.name} className="text-sm font-medium">
              Título
            </label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => {
                console.log('[BatchCreateForm] Campo "title" cambió a:', e.target.value)
                field.handleChange(e.target.value)
              }}
              placeholder="Nombre del lote"
              disabled={mutation.isPending}
            />
            {field.state.meta.errors?.length > 0 && (
              <p className="text-sm text-destructive mt-1">{field.state.meta.errors[0]}</p>
            )}
          </div>
        )}
      />

      {/* Cantidad */}
      <form.Field
        name="quantity"
        validators={{
          onChange: ({ value }) => {
            if (!value) return 'La cantidad es requerida'
            if (value < 1) return 'La cantidad debe ser mayor a 0'
            return undefined
          },
        }}
        children={(field) => (
          <div>
            <label htmlFor={field.name} className="text-sm font-medium">
              Cantidad
            </label>
            <Input
              id={field.name}
              name={field.name}
              type="number"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => {
                console.log('[BatchCreateForm] Campo "quantity" cambió a:', e.target.value)
                field.handleChange(parseInt(e.target.value) || 0)
              }}
              placeholder="Número de keys"
              disabled={mutation.isPending}
            />
            {field.state.meta.errors?.length > 0 && (
              <p className="text-sm text-destructive mt-1">{field.state.meta.errors[0]}</p>
            )}
          </div>
        )}
      />

      {/* Descripción */}
      <form.Field
        name="description"
        validators={{
          onChange: ({ value }) => {
            if (value && value.length > 255) return 'La descripción no puede exceder 255 caracteres'
            return undefined
          },
        }}
        children={(field) => (
          <div>
            <label htmlFor={field.name} className="text-sm font-medium">
              Descripción
            </label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => {
                console.log('[BatchCreateForm] Campo "description" cambió a:', e.target.value)
                field.handleChange(e.target.value)
              }}
              placeholder="Descripción del lote"
              disabled={mutation.isPending}
            />
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

      {/* Tipo de Key */}
      <div>
        <label className="text-sm font-medium">
          Tipo de Key
        </label>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start text-left font-normal"
          onClick={handleOpenKeyTypeSelector}
          disabled={mutation.isPending}
        >
          {selectedKeyType ? selectedKeyType.name : 'Selecciona un tipo de key'}
        </Button>
      </div>

      <Button type="submit" disabled={mutation.isPending} className="w-full">
        Crear Lote
      </Button>
    </form>
  )
}
