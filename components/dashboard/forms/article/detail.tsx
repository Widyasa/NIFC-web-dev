"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useArticleStore } from "@/stores/articleStore";

export default function ArticleDetailForm() {
  const { id } = useParams();
  const {
    selectedArticle,
    getArticleById,
    loading,
  } = useArticleStore();

  useEffect(() => {
    if (id) {
      getArticleById(Number(id));
    }
  }, [id, getArticleById]);

  if (loading || !selectedArticle) {
    return <p>Memproses...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Judul Artikel</label>
          <Input value={selectedArticle.title} readOnly />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Kategori</label>
          <Input value={selectedArticle.category_name || "-"} readOnly />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <Input value={selectedArticle.slug} readOnly />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Durasi Baca</label>
          <Input value={`${selectedArticle.read_duration} menit`} readOnly />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Hashtags</label>
        <Textarea
          value={
            Array.isArray(selectedArticle.hashtags)
              ? selectedArticle.hashtags.join(", ")
              : "-"
          }
          readOnly
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Konten</label>
        <Textarea
          value={selectedArticle.content || "-"}
          readOnly
          rows={10}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <Input
          value={selectedArticle.is_publish ? "Published" : "Draft"}
          readOnly
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tanggal Dibuat</label>
        <Input
          value={
            selectedArticle.created_at
              ? new Date(selectedArticle.created_at).toLocaleString("id-ID")
              : "-"
          }
          readOnly
        />
      </div>
    </div>
  );
}