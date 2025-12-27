import { createFileRoute } from '@tanstack/react-router'
import { DataTable } from '@/components/table/data-table'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { breadcrumb } from '@/constants/breadcrumb'
import { useQueryBatch } from '@/hooks/batchs/useQuery.batch'
import { useTableFilters } from '@/hooks/use-table-filters'
import type { Batch } from '@/services/batch/batch.schema'
import { useBreadcrumbStore } from '@/store/breadcrumb'
import type { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { useEffect } from 'react'
import { useAppStore } from '@/store/app'

export const Route = createFileRoute('/_protected/batchs/')({
  component: Batchs,
})

function Batchs() {
  const {
    offset,
    limit,
    searchQuery,
    searchField,
    setOffset,
    setLimit,
    setSearchQuery,
    setSearchField
  } = useTableFilters({ initialSearchField: 'title' })
  const { setBreadcrumbs } = useBreadcrumbStore();
  const { openDialog } = useAppStore();

  useEffect(() => {
    setBreadcrumbs([
      { label: breadcrumb.batchs.label, path: breadcrumb.batchs.path }
    ])
  }, [setBreadcrumbs]);

  const { data, isLoading } = useQueryBatch({
    offset,
    limit,
    search: searchQuery,
    search_field: searchField,
  });

  const handleUpdateBatch = (batch: Batch) => {
    const dialogId = openDialog({
      title: 'Editar Lote',
      content: null,
      confirmText: undefined,
      cancelText: 'Cerrar',
    })
  }

  const columns: ColumnDef<Batch>[] = [
    {
      accessorKey: 'title',
      header: 'Título',
    },
    {
      accessorKey: 'quantity',
      header: 'Cantidad',
    },
    {
      accessorKey: 'description',
      header: 'Descripción',
    },
    {
      accessorKey: 'created_at',
      header: 'Fecha Creación',
      cell: ({ row }) => {
        const date = row.original.created_at
        if (!date) return '-'
        const formatted = new Date(date).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })
        return formatted === '01/01/2001' ? '-' : formatted
      }
    },
    {
      accessorKey: 'updated_at',
      header: 'Fecha Actualización',
      cell: ({ row }) => {
        const date = row.original.updated_at
        if (!date) return '-'
        const formatted = new Date(date).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })
        return formatted === '01/01/2001' ? '-' : formatted
      }
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const batch = row.original

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
                  window.location.href = `/batchs/${batch.id}`
                }}
              >
                Ver detalles
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleUpdateBatch(batch)}
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
          <h1 className="text-3xl font-bold tracking-tight">Lotes</h1>
          <p className="text-muted-foreground mt-1">Gestiona los lotes del sistema</p>
        </div>
        <Button>Nuevo Lote</Button>
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
            { key: 'title', label: 'Título' },
            { key: 'description', label: 'Descripción' },
          ]
        }}
      />

    </div>
  )
}
