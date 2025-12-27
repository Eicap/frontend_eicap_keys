import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SearchConfig {
  query: string
  field: string
  onQueryChange: (query: string) => void
  onFieldChange: (field: string) => void
  columns: Array<{ key: string; label: string }>
}

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  total: number
  offset: number
  limit: number
  onOffsetChange: (offset: number) => void
  onLimitChange?: (limit: number) => void
  loading?: boolean
  search?: SearchConfig
}

export function DataTable<TData>({
  columns,
  data,
  total,
  offset,
  limit,
  onOffsetChange,
  onLimitChange,
  loading = false,
  search,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  // Calcular el número inicial para la numeración de filas
  const startNumber = offset + 1
  const endNumber = Math.min(offset + limit, total)
  const totalPages = Math.ceil(total / limit)
  const currentPage = Math.floor(offset / limit) + 1

  const handlePreviousPage = () => {
    const newOffset = Math.max(0, offset - limit)
    onOffsetChange(newOffset)
  }

  const handleNextPage = () => {
    const newOffset = offset + limit
    if (newOffset < total) {
      onOffsetChange(newOffset)
    }
  }

  return (
    <div className="space-y-4">
      {/* Buscador */}
      {search && (
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              value={search.query}
              onChange={(e) => search.onQueryChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={search.field} onValueChange={search.onFieldChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Buscar por..." />
            </SelectTrigger>
            <SelectContent>
              {search.columns.map((col) => (
                <SelectItem key={col.key} value={col.key}>
                  {col.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Paginación arriba */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando {data.length === 0 ? 0 : startNumber} - {endNumber} de {total} registros
        </div>
        <div className="flex gap-3 items-center">
          {onLimitChange && (
            <Select value={String(limit)} onValueChange={(value) => onLimitChange(Number(value))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 por página</SelectItem>
                <SelectItem value="20">20 por página</SelectItem>
                <SelectItem value="50">50 por página</SelectItem>
              </SelectContent>
            </Select>
          )}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={offset === 0 || loading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 px-2">
              <span className="text-sm">
                {currentPage} / {totalPages}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={offset + limit >= total || loading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-center">#</TableHead>
              {table.getHeaderGroups().map((headerGroup) =>
                headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                  No hay registros
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row, index) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  <TableCell className="text-center text-muted-foreground text-sm font-medium">
                    {startNumber + index}
                  </TableCell>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
