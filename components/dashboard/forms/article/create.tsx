"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useCategoryStore } from "@/stores/categoryStore";
import { createArticleRequest } from "@/requests/article/create";

export default function CreateArticleForm() {
  const router = useRouter();
  const { categories, fetchCategories } = useCategoryStore();

  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [isPublish, setIsPublish] = useState(false);
  const [readDuration, setReadDuration] = useState(3);
  const [psychologistName, setPsychologistName] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const updateHashtag = (index: number, value: string) => {
    const newHashtags = [...hashtags];
    newHashtags[index] = value;
    setHashtags(newHashtags);
  };

  const addHashtag = () => setHashtags([...hashtags, ""]);
  const removeHashtag = (index: number) => {
    if (hashtags.length > 1) {
      setHashtags(hashtags.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const result = await createArticleRequest({
      title,
      category_id: parseInt(categoryId),
      thumbnail_url: thumbnailUrl,
      content,
      excerpt,
      is_publish: isPublish,
      read_duration: readDuration,
      psychologist_name: psychologistName,
      hashtags,
    });
    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      router.push("/dashboard/article");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="space-y-6">
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Judul Artikel</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul artikel" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nama Psikolog</label>
            <Input value={psychologistName} onChange={(e) => setPsychologistName(e.target.value)} placeholder="Nama psikolog" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Thumbnail URL</label>
            <Input value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} placeholder="URL Gambar" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Durasi Baca (menit)</label>
            <Input type="number" value={readDuration} onChange={(e) => setReadDuration(Number(e.target.value))} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Konten</label>
          <textarea
            className="w-full border border-gray-300 rounded p-2"
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Isi artikel"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Excerpt</label>
          <textarea
            className="w-full border border-gray-300 rounded p-2"
            rows={3}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Cuplikan singkat artikel"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Hashtags</label>
          {hashtags.map((tag, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={tag}
                onChange={(e) => updateHashtag(index, e.target.value)}
                placeholder={`Hashtag ${index + 1}`}
              />
              {hashtags.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeHashtag(index)}
                >
                  <IconTrash className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" onClick={addHashtag} className="mt-2">
            <IconPlus className="w-4 h-4 mr-1" /> Tambah Hashtag
          </Button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Kategori</label>
          <Select value={categoryId} onValueChange={(val) => setCategoryId(val)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Kategori" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={String(cat.id)}>
                  {cat.category_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox checked={isPublish} onCheckedChange={(checked) => setIsPublish(Boolean(checked))} />
          <span>Publikasikan Artikel</span>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan Artikel"}
        </Button>
      </form>
    </div>
  );
}