import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/table/data-table'
import { useGetAllKeyType } from '@/hooks/key_type/useQuery.key_type'
import { useTableFilters } from '@/hooks/use-table-filters'
import type { KeyType } from '@/services/key_type/key_type.schema'
import type { ColumnDef } from '@tanstack/react-table'
import { useAppStore } from '@/store/app'

interface KeyTypeSelectorProps {
  onSelect: (keyType: KeyType) => void
  dialogId?: string
}

export function KeyTypeSelector({ onSelect, dialogId }: KeyTypeSelectorProps) {
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
  const { closeDialog } = useAppStore()

  const { data, isLoading } = useGetAllKeyType({
    offset,
    limit,
    search: searchQuery,
    search_field: searchField,
  })

  const handleSelectKeyType = (keyType: KeyType) => {
    console.log('[KeyTypeSelector] KeyType seleccionado:', keyType)
    onSelect(keyType)
    if (dialogId) {
      // Usar setTimeout para garantizar que React procese completamente todos los cambios de estado
      setTimeout(() => {
        console.log('[KeyTypeSelector] Cerrando dialog:', dialogId)
        closeDialog(dialogId)
      }, 100)
    }
  }

  const columns: ColumnDef<KeyType>[] = [
    {
      accessorKey: 'name',
      header: 'Nombre',
    },
    {
      accessorKey: 'description',
      header: 'Descripción',
    },
    {
      id: 'select',
      header: 'Seleccionar',
      cell: ({ row }) => {
        const keyType = row.original
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleSelectKeyType(keyType)}
          >
            Seleccionar
          </Button>
        )
      },
    },
  ]

  return (
    <div className="w-full">
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
            { key: 'description', label: 'Descripción' },
          ]
        }}
      />
    </div>
  )
}
