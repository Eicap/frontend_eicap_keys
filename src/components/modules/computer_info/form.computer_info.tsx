import { useUpdateComputerInfoMutation } from "@/hooks/computer_info/useMutation.computer_info"
import type { ComputerInfo, UpdateComputerInfo } from "@/services/computer_info/computer_info.schema"
import { useForm } from "@tanstack/react-form"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

interface ComputerInfoFormProps {
  computerInfo: ComputerInfo
  dialogId?: string
}

export default function ComputerInfoForm({ computerInfo, dialogId }: ComputerInfoFormProps) {
  const mutation = useUpdateComputerInfoMutation(computerInfo.id, { dialogId })

  const defaultValues: UpdateComputerInfo = {
    state: computerInfo.state,
  }

  const form = useForm({
    defaultValues,
    onSubmit: async (values) => {
      const dataToSubmit = values.value

      // Si no hay cambios, no enviar
      if (dataToSubmit.state === defaultValues.state) {
        toast.error("No hay cambios para guardar")
        return
      }

      toast.promise(mutation.mutateAsync(dataToSubmit), {
        loading: "Actualizando estado...",
        success: "Estado actualizado exitosamente",
        error: (err) => (err as Error).message || "Error al actualizar estado",
      })
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
      <form.Field
        name="state"
        children={(field) => (
          <div>
            <label htmlFor={field.name} className="text-sm font-medium">
              Estado
            </label>
            <Select
              value={field.state.value}
              onValueChange={(value) => field.handleChange(value)}
              disabled={mutation.isPending}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">ACTIVO</SelectItem>
                <SelectItem value="INACTIVE">INACTIVO</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      />

      <Button type="submit" disabled={mutation.isPending} className="w-full">
        Actualizar Estado
      </Button>
    </form>
  )
}