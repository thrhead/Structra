"use client"

import * as React from "react"
import {
  IconCircleCheckFilled,
  IconDotsVertical,
  IconLoader,
  IconTrendingUp,
} from "@tabler/icons-react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface CustomerData {
  name: string
  email: string
  totalSpent: number
  jobCount: number
}

const columns: ColumnDef<CustomerData>[] = [
  {
    accessorKey: "name",
    header: "Müşteri",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarFallback className="bg-indigo-50 text-indigo-600 font-black text-[10px]">
            {row.original.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-black italic">{row.original.name}</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase truncate max-w-[150px]">
            {row.original.email}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "jobCount",
    header: "İş Sayısı",
    cell: ({ row }) => (
        <Badge variant="outline" className="rounded-lg border-slate-100 font-black text-[10px] uppercase">
            {row.original.jobCount} GÖREV
        </Badge>
    ),
  },
  {
    accessorKey: "totalSpent",
    header: () => <div className="text-right">Toplam Harcama</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalSpent"))
      const formatted = new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
      }).format(amount)

      return <div className="text-right font-black italic text-indigo-600">{formatted}</div>
    },
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex size-8 text-muted-foreground data-[state=open]:bg-muted ml-auto"
            size="icon"
          >
            <IconDotsVertical size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 rounded-xl">
          <DropdownMenuItem className="text-xs font-bold">Detayları Gör</DropdownMenuItem>
          <DropdownMenuItem className="text-xs font-bold">Düzenle</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-xs font-bold text-red-600">Sil</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export function DataTable({ data }: { data: CustomerData[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="px-4 lg:px-6 py-4">
        <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 overflow-hidden shadow-sm">
        <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-slate-800/30">
            {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                {headerGroup.headers.map((header) => {
                    return (
                    <TableHead key={header.id} className="text-[10px] font-black uppercase tracking-widest text-slate-400 py-4">
                        {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                            )}
                    </TableHead>
                    )
                })}
                </TableRow>
            ))}
            </TableHeader>
            <TableBody>
            {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                <TableRow
                    key={row.id}
                    className="border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                >
                    {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                    ))}
                </TableRow>
                ))
            ) : (
                <TableRow>
                <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-xs font-black uppercase text-slate-400 italic"
                >
                    Sonuç bulunamadı.
                </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
        </div>
    </div>
  )
}
