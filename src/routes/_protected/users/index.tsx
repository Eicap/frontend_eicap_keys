import { useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/table/data-table'
import { useBreadcrumbStore } from '@/store/breadcrumb'
import { useTableFilters } from '@/hooks/use-table-filters'
import { useAppStore } from '@/store/app'
import type { User } from '@/services/user/user.schema'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import UserForm from '@/components/modules/users/user.form'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useQueryUser } from '@/hooks/users/useQuery.user'

export const Route = createFileRoute('/_protected/users/')({
  component: Users,
})

function Users() {
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
  const { openDialog } = useAppStore()

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Usuarios', path: '/users' }
    ])
  }, [setBreadcrumbs])

  const { data, isLoading } = useQueryUser({
    offset,
    limit,
    search: searchQuery,
    search_field: searchField,
  })

  // Función para abrir el diálogo de crear usuario
  const handleOpenCreateDialog = () => {
    const dialogId = `user-create-${Date.now()}`
    openDialog({
      id: dialogId,
      title: 'Crear Nuevo Usuario',
      content: <UserForm dialogId={dialogId} />,
      confirmText: undefined,
      cancelText: 'Cerrar',
    })
  }

  // Función para abrir el diálogo de editar usuario
  const handleOpenEditDialog = (user: User) => {
    const dialogId = `user-edit-${user.id}`
    openDialog({
      id: dialogId,
      title: 'Editar Usuario',
      content: <UserForm user={user} dialogId={dialogId} />,
      confirmText: undefined,
      cancelText: 'Cerrar',
    })
  }

  // Definir columnas
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
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
      accessorKey: 'role',
      header: 'Rol',
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const user = row.original

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
                  window.location.href = `/users/${user.id}`
                }}
              >
                Ver detalles
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  handleOpenEditDialog(user)
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
          <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
          <p className="text-muted-foreground mt-1">Gestiona los usuarios del sistema</p>
        </div>
        <Button onClick={handleOpenCreateDialog}>Nuevo Usuario</Button>
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
            { key: 'role', label: 'Rol' },
          ]
        }}
      />
    </div>
  )
}
