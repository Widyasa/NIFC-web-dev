"use client";

import { useState, useEffect } from "react";
import { useArticleStore } from "@/stores/articleStore";
import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel } from "@tanstack/react-table";
import { getArticleColumns } from "@/components/dashboard/datatable/columns/article";
import { DataTable } from "@/components/dashboard/datatable/datatable";
import { DataTablePagination } from "@/components/dashboard/datatable/datatable-pagination";
import { TableSearch } from "@/components/dashboard/datatable/table-search";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DeleteArticleDialog } from "@/components/dashboard/forms/article/delete";

export default function ArticlePage() {
  const [globalFilter, setGlobalFilter] = useState("");
  const { articles, fetchArticles, loading} = useArticleStore();
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState(0);
  const [selectedArticleTitle, setSelectedArticleTitle] = useState("");

  useEffect(() => {
    const getArticles = async () => {
      try {
        await fetchArticles();
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Terjadi kesalahan saat mengambil data article");
        }
      }
    };
    getArticles();
  }, [fetchArticles]);

  const table = useReactTable({
    data: articles,
    columns: getArticleColumns({
      actions: (row) => [
        {
          label: "Lihat Detail",
          onClick: () => {
            router.push(`/dashboard/article/${row.id}`);
          },
        },
        {
          label: "Ubah",
          onClick: () => {
            router.push(`/dashboard/article/${row.id}/update`);
          },
        },
        {
          label: "Hapus",
          onClick: async () => {
            setSelectedArticleId(row.id);
            setSelectedArticleTitle(row.title);
            setDeleteDialogOpen(true);
          },
        },
      ],
    }),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
  });  

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Daftar Artikel</CardTitle>
          <div className="flex gap-5 items-center mt-2">
            <TableSearch value={globalFilter} onChange={setGlobalFilter} />
            <Button asChild>
              <Link href="/dashboard/article/create"><IconPlus className="w-5 h-5 mr-2" />Tambah Artikel</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Memproses...</p>
          ) : (
            <>
              <DataTable table={table} columnsLength={getArticleColumns({}).length} />
              <DataTablePagination table={table} />
            </>
          )}
        </CardContent>
      </Card>
      <DeleteArticleDialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} articleId={selectedArticleId} articleTitle={selectedArticleTitle} />
    </div>
  );
}