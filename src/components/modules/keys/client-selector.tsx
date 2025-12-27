import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DataTable } from '@/components/table/data-table'
import { useQueryClient } from '@/hooks/clients/useQuery.client'
import { useTableFilters } from '@/hooks/use-table-filters'
import type { Client } from '@/services/client/client.schema'
import type { ColumnDef } from '@tanstack/react-table'

interface ClientSelectorProps {
  open: boolean
  onClose: () => void
  onSelect: (client: Client) => void
}

export function ClientSelector({ open, onClose, onSelect }: ClientSelectorProps) {
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

  const { data, isLoading } = useQueryClient({
    offset,
    limit,
    search: searchQuery,
    search_field: searchField,
  })

  const handleSelectClient = (client: Client) => {
    onSelect(client)
    onClose()
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Seleccionar Cliente</DialogTitle>
        </DialogHeader>
        
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
      </DialogContent>
    </Dialog>
  )
}
