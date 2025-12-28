import { useForm } from '@tanstack/react-form'
import { UpdateBacthSchema, type Batch } from '@/services/batch/batch.schema'
import { useUpdateBatchMutation } from '@/hooks/batchs/useMutation.batch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface BatchFormProps {
  batchData: Batch
  dialogId?: string
}

export default function BatchForm({ batchData, dialogId }: BatchFormProps) {  
  const mutation = useUpdateBatchMutation(batchData.id, { dialogId })
  const schema = UpdateBacthSchema

  const defaultValues = {
    title: batchData.title,
    description: batchData.description,
  }

  const form = useForm({
    defaultValues,
    onSubmit: async (values) => {
      const formValues = values.value as typeof defaultValues

      // Solo enviar campos modificados
      const dirtyFields: Record<string, any> = {}
      let hasDirtyFields = false

      // Comparar cada campo
      if (formValues.title !== defaultValues.title) {
        dirtyFields.title = formValues.title
        hasDirtyFields = true
      }

      if (formValues.description !== defaultValues.description) {
        dirtyFields.description = formValues.description
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
        loading: 'Actualizando lote...',
        success: 'Lote actualizado exitosamente',
        error: (err) => (err as Error).message || 'Error al actualizar lote',
      })
    },
  })

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
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Nombre del lote"
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
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Descripción del lote"
                disabled={mutation.isPending}
              />
              {field.state.meta.errors?.length > 0 && (
                <p className="text-sm text-destructive mt-1">{field.state.meta.errors[0]}</p>
              )}
            </div>
          )}
        />

        <Button type="submit" disabled={mutation.isPending} className="w-full">
          Actualizar Lote
        </Button>
      </form>
    </>
  )
}
