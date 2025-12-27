import { useForm } from '@tanstack/react-form'
import { CreateClientSchema, UpdateClientSchema, type Client } from '@/services/client/client.schema'
import { useCreateClientMutation, useUpdateClientMutation } from '@/hooks/clients/useMutation.client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface ClientFormProps {
  client?: Client
  dialogId?: string
}

export default function ClientForm({ client, dialogId }: ClientFormProps) {
  const isEditing = !!client
  const mutation = isEditing 
    ? useUpdateClientMutation(client.id, { dialogId }) 
    : useCreateClientMutation({ dialogId })
  const schema = isEditing ? UpdateClientSchema : CreateClientSchema

  const defaultValues = isEditing
    ? {
        name: client.name,
        email: client.email,
        phone: client.phone,
      }
    : {
        name: '',
        email: '',
        phone: '',
      }

  const form = useForm({
    defaultValues,
    onSubmit: async (values) => {
      let dataToSubmit: any = values.value

      // Si es edición, solo enviar campos modificados
      if (isEditing) {
        const dirtyFields: Record<string, any> = {}
        let hasDirtyFields = false

        Object.entries(dataToSubmit).forEach(([key, value]) => {
          if (value !== defaultValues[key as keyof typeof defaultValues]) {
            dirtyFields[key] = value
            hasDirtyFields = true
          }
        })

        // Si no hay cambios, no enviar
        if (!hasDirtyFields) {
          toast.error('No hay cambios para guardar')
          return
        }

        dataToSubmit = dirtyFields
      }

      const result = schema.safeParse(dataToSubmit)
      if (!result.success) {
        toast.error('Validación fallida')
        return
      }

      if (isEditing) {
        toast.promise(mutation.mutateAsync(dataToSubmit), {
          loading: 'Actualizando cliente...',
          success: 'Cliente actualizado exitosamente',
          error: (err) => (err as Error).message || 'Error al actualizar cliente',
        })
      } else {
        toast.promise(mutation.mutateAsync(dataToSubmit), {
          loading: 'Creando cliente...',
          success: 'Cliente creado exitosamente',
          error: (err) => (err as Error).message || 'Error al crear cliente',
        })
      }
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-4"
    >
      {/* Nombre */}
      <form.Field
        name="name"
        validators={{
          onChange: ({ value }) => {
            if (!value) return 'El nombre es requerido'
            if (value.length < 1) return 'El nombre es requerido'
            return undefined
          },
        }}
        children={(field) => (
          <div>
            <label htmlFor={field.name} className="text-sm font-medium">
              Nombre
            </label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Empresa ABC"
              disabled={mutation.isPending}
            />
            {field.state.meta.errors?.length > 0 && (
              <p className="text-sm text-destructive mt-1">{field.state.meta.errors[0]}</p>
            )}
          </div>
        )}
      />

      {/* Email */}
      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) => {
            if (!value) return 'El email es requerido'
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'El email no es válido'
            return undefined
          },
        }}
        children={(field) => (
          <div>
            <label htmlFor={field.name} className="text-sm font-medium">
              Email
            </label>
            <Input
              id={field.name}
              name={field.name}
              type="email"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="contacto@empresa.com"
              disabled={mutation.isPending}
            />
            {field.state.meta.errors?.length > 0 && (
              <p className="text-sm text-destructive mt-1">{field.state.meta.errors[0]}</p>
            )}
          </div>
        )}
      />

      {/* Teléfono */}
      <form.Field
        name="phone"
        validators={{
          onChange: ({ value }) => {
            if (!value) return 'El teléfono es requerido'
            if (value.length < 1) return 'El teléfono es requerido'
            return undefined
          },
        }}
        children={(field) => (
          <div>
            <label htmlFor={field.name} className="text-sm font-medium">
              Teléfono
            </label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="+34 123 456 789"
              disabled={mutation.isPending}
            />
            {field.state.meta.errors?.length > 0 && (
              <p className="text-sm text-destructive mt-1">{field.state.meta.errors[0]}</p>
            )}
          </div>
        )}
      />

      <Button type="submit" disabled={mutation.isPending} className="w-full">
        {isEditing ? 'Actualizar Cliente' : 'Crear Cliente'}
      </Button>
    </form>
  )
}
