import { SimpleTable } from "@/components/table/simple.table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useConfirmAction } from "@/hooks/shared/use-confirm-action"
import { useComputerConnections } from "@/hooks/computer_info/useQuery.computer_info"
import { useMutationDeleteComputerConnections } from "@/hooks/key_login.tsx/useMutation.key_login"
import type { ComputerInfo } from "@/services/computer_info/computer_info.schema"
import type { Key } from "@/services/key/key.schema"
import type { ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"

interface RouteComponentProps {
  computerInfo: ComputerInfo
}

export default function ComputerConnections({ computerInfo }: RouteComponentProps) {
  const { data, isLoading } = useComputerConnections(computerInfo.id)
  const deleteConnections = useMutationDeleteComputerConnections(computerInfo.id)
  const { confirm } = useConfirmAction()

  if (isLoading) {
    return <div className="flex w-full max-w-sm flex-col gap-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <div className="flex gap-4" key={index}>
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  }

  const columns: ColumnDef<Key>[] = [
    {
      header: 'Código',
      accessorKey: 'code',
    },
    {
      header: 'Estado',
      accessorKey: 'state',
    },
    {
      header: 'Cliente',
      accessorKey: 'client.name',
    },
  ]

  const handleDeleteConnections = () => {
    confirm({
      title: '¿Estás seguro?',
      description: `Esta acción eliminará todas las conexiones de ${computerInfo?.computer_name}. Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      isDestructive: true,
      onConfirm: () => {
        toast.promise(deleteConnections.mutateAsync(), {
          loading: "Eliminando conexiones...",
          success: "Conexiones eliminadas exitosamente",
          error: (err) => (err as Error).message || "Error al eliminar conexiones",
        })
      },
    })
  }

  return (
    <div>
      <Button
        variant="destructive"
        className="mb-4"
        onClick={handleDeleteConnections}
        disabled={isLoading || data?.length === 0}
      >
        Elimar todas las conexiones
      </Button>
      <SimpleTable
        columns={columns}
        data={data ?? []}
      />
    </div>
  )
}