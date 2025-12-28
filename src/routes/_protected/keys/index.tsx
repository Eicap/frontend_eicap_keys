import { createFileRoute } from '@tanstack/react-router'
import { DataTable } from '@/components/table/data-table'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { breadcrumb } from '@/constants/breadcrumb'
import { useGetAllKey } from '@/hooks/keys/useQuery.key'
import { useTableFilters } from '@/hooks/use-table-filters'
import type { Key } from '@/services/key/key.schema'
import { useBreadcrumbStore } from '@/store/breadcrumb'
import type { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { useEffect } from 'react'
import { useAppStore } from '@/store/app'
import KeyForm from '@/components/modules/keys/key.form'

export const Route = createFileRoute('/_protected/keys/')({
  component: Keys,
})

function Keys() {
  const {
    offset,
    limit,
    searchQuery,
    searchField,
    setOffset,
    setLimit,
    setSearchQuery,
    setSearchField
  } = useTableFilters({ initialSearchField: 'code' })
  const { setBreadcrumbs } = useBreadcrumbStore();
  const { openDialog } = useAppStore();

  useEffect(() => {
    setBreadcrumbs([
      { label: breadcrumb.keys.label, path: breadcrumb.keys.path }
    ])
  }, [setBreadcrumbs]);

  const { data, isLoading } = useGetAllKey({
    offset,
    limit,
    search: searchQuery,
    search_field: searchField,
  });

  const handleUpdateKey = (key: Key) => {
    const dialogId = `key-edit-${key.id}`
    openDialog({
      id: dialogId,
      title: 'Editar Cliente',
      content: <KeyForm keyData={key} dialogId={dialogId} />,
      confirmText: undefined,
      cancelText: 'Cerrar',
    })
  }

  const columns: ColumnDef<Key>[] = [
    {
      accessorKey: 'code',
      header: 'Código',
    },
    {
      accessorKey: 'key_type.name',
      header: 'Tipo de Key',
    },
    {
      accessorKey: 'client.name',
      header: 'Cliente',
    },
    {
      accessorKey: 'state',
      header: 'Estado',
    },
    {
      accessorKey: 'init_date',
      header: 'Fecha Inicio',
      cell: ({ row }) => {
        const date = row.original.init_date
        if (!date) return '-'
        const formatted = new Date(date).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })
        return formatted === '01/01/2001' ? '-' : formatted
      }
    },
    {
      accessorKey: 'due_date',
      header: 'Fecha Vencimiento',
      cell: ({ row }) => {
        const date = row.original.due_date
        if (!date) return '-'
        const formatted = new Date(date).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })
        return formatted === '01/01/2001' ? '-' : formatted
      }
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const key = row.original

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
                  window.location.href = `/keys/${key.id}`
                }}
              >
                Ver detalles
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleUpdateKey(key)}
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
          <h1 className="text-3xl font-bold tracking-tight">Keys</h1>
          <p className="text-muted-foreground mt-1">Gestiona las keys del sistema</p>
        </div>
        <Button>Nueva Key</Button>
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
            { key: 'code', label: 'Código' },
            { key: 'client', label: 'Cliente' },
            { key: 'key_type', label: 'Tipo de Key' },
          ]
        }}
      />

    </div>
  )
}
