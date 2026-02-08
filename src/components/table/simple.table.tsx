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

interface SimpleTableProps<TData> {
    columns: ColumnDef<TData>[]
    data: TData[]
    showRowNumber?: boolean
}

export function SimpleTable<TData>({
    columns,
    data,
    showRowNumber = true,
}: SimpleTableProps<TData>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        {showRowNumber && <TableHead className="w-12 text-center">#</TableHead>}
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
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={columns.length + (showRowNumber ? 1 : 0)} className="h-24 text-center">
                                No hay registros
                            </TableCell>
                        </TableRow>
                    ) : (
                        table.getRowModel().rows.map((row, index) => (
                            <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                {showRowNumber && (
                                    <TableCell className="text-center text-muted-foreground text-sm font-medium">
                                        {index + 1}
                                    </TableCell>
                                )}
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
    )
}
