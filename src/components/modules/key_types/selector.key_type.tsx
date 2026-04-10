import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/table/data-table'
import { useGetAllKeyType } from '@/hooks/key_type/useQuery.key_type'
import { useTableFilters } from '@/hooks/use-table-filters'
import type { KeyType } from '@/services/key_type/key_type.schema'
import type { ColumnDef } from '@tanstack/react-table'
import { useAppStore } from '@/store/app'
import { Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface KeyTypeSelectorProps {
  onSelect: (keyType: KeyType) => void
  dialogId?: string
}

export function KeyTypeSelector({ onSelect, dialogId }: KeyTypeSelectorProps) {
  const {
    offset,
    limit,
    searchQuery,
    setOffset,
    setLimit,
    setSearchQuery,
  } = useTableFilters()
  const { closeDialog } = useAppStore()

  const { data, isLoading } = useGetAllKeyType({
    offset,
    limit,
    search: searchQuery,
  })

  const handleSelectKeyType = (keyType: KeyType) => {
    onSelect(keyType)
    if (dialogId) {
      setTimeout(() => {
        closeDialog(dialogId)
      }, 100)
    }
  }

  const columns: ColumnDef<KeyType>[] = [
    {
      accessorKey: 'name',
      header: 'Nombre',
      cell: ({ row }) => {
        const keyType = row.original
        return (
          <div className="flex items-center gap-2">
            <span>{keyType.name}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1">
                    <p className="font-semibold text-xs border-bottom mb-1">Permisos:</p>
                    {keyType.permissions && keyType.permissions.length > 0 ? (
                      <ul className="list-disc list-inside text-xs">
                        {keyType.permissions.map((p) => (
                          <li key={p.id}>{p.name}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs italic text-muted-foreground">Sin permisos asignados</p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )
      },
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
    <div className="w-full space-y-4">
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
