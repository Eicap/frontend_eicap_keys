import ComputerInfoForm from '@/components/modules/computer_info/form.computer_info'
import { DataTable } from '@/components/table/data-table'
import { Button } from '@/components/ui/button'
import { breadcrumb } from '@/constants/breadcrumb'
import { useQueryComputerInfo } from '@/hooks/computer_info/useQuery.computer_info'
import { useTableFilters } from '@/hooks/use-table-filters'
import type { ComputerInfo } from '@/services/computer_info/computer_info.schema'
import { useAppStore } from '@/store/app'
import { useBreadcrumbStore } from '@/store/breadcrumb'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { createFileRoute } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { useEffect } from 'react'
import ComputerConnections from '@/components/modules/computer_info/connections.computer_info'

export const Route = createFileRoute('/_protected/computer_info/')({
  component: RouteComponent,
})

function RouteComponent() {
  const {
    offset,
    limit,
    searchQuery,
    searchField,
    setOffset,
    setLimit,
    setSearchQuery,
    setSearchField
  } = useTableFilters({ initialSearchField: 'computer_name' })
  const { setBreadcrumbs } = useBreadcrumbStore()
  const { openDialog } = useAppStore()

  useEffect(() => {
    setBreadcrumbs([
      { label: breadcrumb.computers.label, path: breadcrumb.computers.path }
    ])
  }, [setBreadcrumbs]);

  const { data, isLoading } = useQueryComputerInfo({
    offset,
    limit,
    search: searchQuery,
    search_field: searchField,
  });

  // Función para abrir el diálogo de editar usuario
  const handleOpenEditDialog = (computerInfo: ComputerInfo) => {
    const dialogId = `computer-info-edit-${computerInfo.id}`
    openDialog({
      id: dialogId,
      title: 'Editar Información de la Computadora',
      content: <ComputerInfoForm computerInfo={computerInfo} dialogId={dialogId} />,
      confirmText: undefined,
      cancelText: 'Cerrar',
      width: 'max-w-sm',
    })
  }

  const handleOpenConnections = (computerInfo: ComputerInfo) => {
    const dialogId = `computer-info-connections-${computerInfo.id}`
    openDialog({
      id: dialogId,
      title: `Conexiones de: ${computerInfo.computer_name}`,
      content: <ComputerConnections computerInfo={computerInfo} />,
      confirmText: undefined,
      cancelText: 'Cerrar',
      width: 'max-w-sm',
    })
  }

  const columns: ColumnDef<ComputerInfo>[] = [
    {
      accessorKey: 'computer_name',
      header: 'Nombre',
    },
    {
      accessorKey: 'ip',
      header: 'IP',
    },
    {
      accessorKey: 'os',
      header: 'Sistema Operativo',
    },
    {
      accessorKey: 'state',
      header: 'Estado',
      cell: ({ row }) => {
        const state = row.getValue('state') as string
        const isActive = state === 'ACTIVE'
        return (
          <span
            className={`px-2 py-1 rounded-full text-white text-sm font-medium ${isActive ? 'bg-green-500' : 'bg-red-500'
              }`}
          >
            {
              state === 'ACTIVE' ? 'ACTIVO' : state === 'INACTIVE' ? 'INACTIVO' : state
            }
          </span>
        )
      },
    },
    {
      accessorKey: 'mac_address',
      header: 'Dirección MAC',
    },
    {
      accessorKey: 'created_at',
      header: 'Fecha de Creación',
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const computerInfo = row.original

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
                  handleOpenConnections(computerInfo)
                }}
              >
                Conexiones
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  handleOpenEditDialog(computerInfo)
                }}
              >
                Editar
              </DropdownMenuItem>
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
          <h1 className="text-3xl font-bold tracking-tight">Información de las Computadoras</h1>
          <p className="text-muted-foreground mt-1">Gestiona la información de las computadoras de los clientes</p>
        </div>
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
            { key: 'computer_name', label: 'Nombre' },
            { key: 'ip', label: 'IP' },
            { key: 'os', label: 'Sistema Operativo' },
            { key: 'state', label: 'Estado' },
            { key: 'mac_address', label: 'Dirección MAC' },
          ]
        }}
      />

    </div>
  )
}
