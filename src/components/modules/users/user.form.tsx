import { useForm } from '@tanstack/react-form'
import { CreateUserSchema, UpdateUserSchema, type User } from '@/services/user/user.schema'
import { useCreateUserMutation, useUpdateUserMutation } from '@/hooks/users/useMutation.user'
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

interface UserFormProps {
  user?: User
  dialogId?: string
}

export default function UserForm({ user, dialogId }: UserFormProps) {
  const isEditing = !!user
  const mutation = isEditing 
    ? useUpdateUserMutation(user.id, { dialogId }) 
    : useCreateUserMutation({ dialogId })
  const schema = isEditing ? UpdateUserSchema : CreateUserSchema

  const defaultValues = isEditing
    ? {
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        role: user.role,
      }
    : {
        name: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        confirm_password: '',
        role: '',
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
          loading: 'Actualizando usuario...',
          success: 'Usuario actualizado exitosamente',
          error: (err) => (err as Error).message || 'Error al actualizar usuario',
        })
      } else {
        toast.promise(mutation.mutateAsync(dataToSubmit), {
          loading: 'Creando usuario...',
          success: 'Usuario creado exitosamente',
          error: (err) => (err as Error).message || 'Error al crear usuario',
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
              placeholder="Juan Pérez"
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
              placeholder="juan@example.com"
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
              placeholder="+591 712345678"
              disabled={mutation.isPending}
            />
            {field.state.meta.errors?.length > 0 && (
              <p className="text-sm text-destructive mt-1">{field.state.meta.errors[0]}</p>
            )}
          </div>
        )}
      />

      {/* Dirección */}
      <form.Field
        name="address"
        children={(field) => (
          <div>
            <label htmlFor={field.name} className="text-sm font-medium">
              Dirección
            </label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Calle Principal 123"
              disabled={mutation.isPending}
            />
            {field.state.meta.errors?.length > 0 && (
              <p className="text-sm text-destructive mt-1">{field.state.meta.errors[0]}</p>
            )}
          </div>
        )}
      />

      {/* Rol */}
      <form.Field
        name="role"
        validators={{
          onChange: ({ value }) => {
            if (!value) return 'El rol es requerido'
            return undefined
          },
        }}
        children={(field) => (
          <div>
            <label htmlFor={field.name} className="text-sm font-medium">
              Rol
            </label>
            <Select
              value={field.state.value}
              onValueChange={field.handleChange}
              disabled={mutation.isPending}
            >
              <SelectTrigger id={field.name}>
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="INSTALLER">Instalador</SelectItem>
                <SelectItem value="CHIEF_INSTALLER">Jefe Instalador</SelectItem>
                <SelectItem value="SELLER">Vendedor</SelectItem>
                <SelectItem value="DESIGNER">Diseñador</SelectItem>
              </SelectContent>
            </Select>
            {field.state.meta.errors?.length > 0 && (
              <p className="text-sm text-destructive mt-1">{field.state.meta.errors[0]}</p>
            )}
          </div>
        )}
      />

      {/* Password y Confirm Password (solo para crear) */}
      {!isEditing && (
        <>
          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) => {
                if (!value) return 'La contraseña es requerida'
                if (value.length < 6) return 'La contraseña debe tener al menos 6 caracteres'
                return undefined
              },
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="text-sm font-medium">
                  Contraseña
                </label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="••••••••"
                  disabled={mutation.isPending}
                />
                {field.state.meta.errors?.length > 0 && (
                  <p className="text-sm text-destructive mt-1">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          />

          <form.Field
            name="confirm_password"
            validators={{
              onChange: ({ value }) => {
                if (!value) return 'La confirmación de contraseña es requerida'
                return undefined
              },
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="text-sm font-medium">
                  Confirmar Contraseña
                </label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="••••••••"
                  disabled={mutation.isPending}
                />
                {field.state.meta.errors?.length > 0 && (
                  <p className="text-sm text-destructive mt-1">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          />
        </>
      )}

      <Button type="submit" disabled={mutation.isPending} className="w-full">
        {isEditing ? 'Actualizar Usuario' : 'Crear Usuario'}
      </Button>
    </form>
  )
}
