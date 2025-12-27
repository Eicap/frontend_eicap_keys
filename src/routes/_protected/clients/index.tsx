import ClientForm from '@/components/modules/clients/client.form'
import { DataTable } from '@/components/table/data-table'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { breadcrumb } from '@/constants/breadcrumb'
import { useQueryClient } from '@/hooks/clients/useQuery.client'
import { useTableFilters } from '@/hooks/use-table-filters'
import type { Client } from '@/services/client/client.schema'
import { useAppStore } from '@/store/app'
import { useBreadcrumbStore } from '@/store/breadcrumb'
import { createFileRoute } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { useEffect } from 'react'

export const Route = createFileRoute('/_protected/clients/')({
  component: Clients,
})

function Clients() {
  const {
    offset,
    limit,
    searchQuery,
    searchField,
    setOffset,
    setLimit,
    setSearchQuery,
    setSearchField
  } = useTableFilters({ initialSearchField: 'name' })
  const { setBreadcrumbs } = useBreadcrumbStore()
  const { openDialog, updateDialog } = useAppStore()

  useEffect(() => {
    setBreadcrumbs([
      { label: breadcrumb.clients.label, path: breadcrumb.clients.path }
    ])
  }, [setBreadcrumbs]);

  const { data, isLoading } = useQueryClient({
    offset,
    limit,
    search: searchQuery,
    search_field: searchField,
  });

  const handleOpenCreateDialog = () => {
    const dialogId = openDialog({
      title: 'Crear Nuevo Cliente',
      content: null,
      confirmText: undefined,
      cancelText: 'Cerrar',
    })
    updateDialog(dialogId, {
      content: <ClientForm dialogId={dialogId} />,
    })
  }

  // Función para abrir el diálogo de editar usuario
  const handleOpenEditDialog = (client: Client) => {
    const dialogId = openDialog({
      title: 'Editar Cliente',
      content: null,
      confirmText: undefined,
      cancelText: 'Cerrar',
    })
    updateDialog(dialogId, {
      content: <ClientForm client={client} dialogId={dialogId} />,
    })
  }

  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: 'name',
      header: 'Nombre',
    },
    {
      accessorKey: 'email',
      header: 'Email de Contacto',
    },
    {
      accessorKey: 'phone',
      header: 'Teléfono',
    },
    {
      accessorKey: 'created_at',
      header: 'Fecha de Creación',
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const client = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  window.location.href = `/clients/${client.id}`
                }}
              >
                Ver detalles
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  handleOpenEditDialog(client)
                }}
              >
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Eliminar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div className="flex flex-col gap-8 p-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
              <p className="text-muted-foreground mt-1">Gestiona los clientes del sistema</p>
            </div>
            <Button onClick={handleOpenCreateDialog}>Nuevo Cliente</Button>
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
              field: searchField,
              onQueryChange: setSearchQuery,
              onFieldChange: setSearchField,
              columns: [
                { key: 'name', label: 'Nombre' },
                { key: 'email', label: 'Email' },
                { key: 'phone', label: 'Teléfono' },
              ]
            }}
          />
        </div>
  )
}
