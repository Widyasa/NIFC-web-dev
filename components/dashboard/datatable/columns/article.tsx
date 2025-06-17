"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableActions } from "@/components/dashboard/datatable/datatable-actions"
import type { Article } from "@/types"

type ArticleColumnsProps = {
  actions?: (row: Article) => { label: string; onClick: () => void }[]
}

export function getArticleColumns({ actions }: ArticleColumnsProps): ColumnDef<Article>[] {
  return [
    {
      accessorKey: "title",
      header: "Judul Artikel",
      cell: ({ row }) => (
        <div className="font-medium line-clamp-1">{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "category_name",
      header: "Kategori",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("category_name")}</div>
      ),
    },
    {
      accessorKey: "is_publish",
      header: "Status",
      cell: ({ row }) => {
        const isPublish = row.getValue("is_publish") as boolean
        return (
          <span className={isPublish ? "text-green-600" : "text-gray-400"}>
            {isPublish ? "Published" : "Draft"}
          </span>
        )
      },
    },
    {
      accessorKey: "read_duration",
      header: "Durasi Baca",
      cell: ({ row }) => <span>{row.getValue("read_duration")} menit</span>,
    },
    {
      accessorKey: "created_at",
      header: "Tanggal",
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"))
        return <span>{date.toLocaleDateString("id-ID")}</span>
      },
    },
    {
      id: "actions",
      cell: ({ row }) =>
        actions ? <DataTableActions row={row.original} actions={actions(row.original)} /> : null,
    },
  ]
}