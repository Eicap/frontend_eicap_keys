import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/table/data-table'
import { useQueryClient } from '@/hooks/clients/useQuery.client'
import { useTableFilters } from '@/hooks/use-table-filters'
import type { Client } from '@/services/client/client.schema'
import type { ColumnDef } from '@tanstack/react-table'
import { useAppStore } from '@/store/app'
import ClientForm from './client.form'

interface ClientSelectorProps {
  onSelect: (client: Client) => void
  dialogId?: string
}

export function ClientSelector({ onSelect, dialogId }: ClientSelectorProps) {
  const {
    offset,
    limit,
    searchQuery,
    setOffset,
    setLimit,
    setSearchQuery,
  } = useTableFilters()
  const { closeDialog, openDialog } = useAppStore()

  const { data, isLoading } = useQueryClient({
    offset,
    limit,
    search: searchQuery,
  })

  const handleSelectClient = (client: Client) => {
    console.log('[ClientSelector] Cliente seleccionado:', client)
    onSelect(client)
    if (dialogId) {
      // Usar setTimeout para garantizar que React procese completamente todos los cambios de estado
      setTimeout(() => {
        console.log('[ClientSelector] Cerrando dialog:', dialogId)
        closeDialog(dialogId)
      }, 100)
    }
  }

  const handleOpenCreateClient = () => {
    const createDialogId = `client-create-dialog-${Date.now()}`
    openDialog({
      id: createDialogId,
      title: 'Crear Nuevo Cliente',
      width: 'max-w-md',
      content: (
        <ClientForm
          dialogId={createDialogId}
          onSelect={onSelect}
        />
      ),
      confirmText: undefined,
      cancelText: 'Cancelar',
    })
  }

  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: 'name',
      header: 'Nombre',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'phone',
      header: 'Teléfono',
    },
    {
      id: 'select',
      header: 'Seleccionar',
      cell: ({ row }) => {
        const client = row.original
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleSelectClient(client)}
          >
            Seleccionar
          </Button>
        )
      },
    },
  ]

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-end">
        <Button 
          onClick={handleOpenCreateClient}
          className="bg-green-600 hover:bg-green-700"
        >
          Crear Cliente
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={data?.data || []}
        total={data?.total || 0}
        offset={data?.offset || 0}
        limit={limit}
        onOffsetChange={setOffset}
        onLimitChange={setLimit}
        loading={isLoading}
        search={{
          query: searchQuery,
          onQueryChange: setSearchQuery,
        }}
      />
    </div>
  )
}
