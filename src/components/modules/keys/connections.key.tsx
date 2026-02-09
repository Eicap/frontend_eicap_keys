import { SimpleTable } from "@/components/table/simple.table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutationDeleteKeyConnections } from "@/hooks/key_login.tsx/useMutation.key_login";
import { useGetKeyConnections } from "@/hooks/keys/useQuery.key";
import { useConfirmAction } from "@/hooks/shared/use-confirm-action";
import type { ComputerInfo } from "@/services/computer_info/computer_info.schema";
import type { Key } from "@/services/key/key.schema"
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

interface KeysConnectionsProps {
    Key: Key;
}

export default function KeysConnections({ Key }: KeysConnectionsProps) {
    const { data, isLoading } = useGetKeyConnections(Key.id);
    const deleteConnections = useMutationDeleteKeyConnections(Key.id);
    const { confirm } = useConfirmAction();

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

    const columns: ColumnDef<ComputerInfo>[] = [
        {
            header: 'Nombre',
            accessorKey: 'computer_name',
        },
        {
            header: 'Estado',
            accessorKey: 'state',
        },
        {
            header: 'Sistema operativo',
            accessorKey: 'os',
        },
        {
            header: 'MAC',
            accessorKey: 'mac_address',
        },
    ];

    const handleDeleteConnections = () => {
        confirm({
            title: '¿Estás seguro?',
            description: `Esta acción eliminará todas las conexiones de ${Key?.code}. Esta acción no se puede deshacer.`,
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
        <div className="w-full">
      <Button
        variant="destructive"
        className="mb-4"
        onClick={handleDeleteConnections}
        disabled={isLoading || data?.length === 0 || deleteConnections.isPending}
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