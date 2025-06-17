"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useArticleStore } from "@/stores/articleStore";
import { useCategoryStore } from "@/stores/categoryStore";
import { updateArticleRequest } from "@/requests/article/update";

export default function UpdateArticleForm() {
  const router = useRouter();
  const params = useParams();
  const articleId = Number(params.id);

  const { selectedArticle, getArticleById } = useArticleStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [title, setTitle] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [readDuration, setReadDuration] = useState(1);
  const [categoryId, setCategoryId] = useState("");
  const [psychologistName, setPsychologistName] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([""]);
  const [isPublish, setIsPublish] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (articleId) getArticleById(articleId);
  }, [articleId, getArticleById]);

  useEffect(() => {
    if (selectedArticle) {
      setTitle(selectedArticle.title);
      setThumbnailUrl(selectedArticle.thumbnail_url || "");
      setContent(selectedArticle.content);
      setExcerpt(selectedArticle.excerpt || "");
      setReadDuration(selectedArticle.read_duration || 1);
      setCategoryId(String(selectedArticle.category_id));
      setPsychologistName(selectedArticle.psychologist_name || "");
      setHashtags(selectedArticle.hashtags || [""]);
      setIsPublish(selectedArticle.is_publish || false);
    }
  }, [selectedArticle]);

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
    if (!articleId) return;

    setLoading(true);
    const result = await updateArticleRequest({
      id: articleId,
      title,
      thumbnail_url: thumbnailUrl,
      content,
      excerpt,
      read_duration: readDuration,
      category_id: parseInt(categoryId),
      psychologist_name: psychologistName,
      hashtags,
      is_publish: isPublish,
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
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nama Psikolog</label>
            <Input value={psychologistName} onChange={(e) => setPsychologistName(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">URL Thumbnail</label>
          <Input value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Konten</label>
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Excerpt</label>
          <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Durasi Baca (menit)</label>
          <Input type="number" value={readDuration} onChange={(e) => setReadDuration(Number(e.target.value))} />
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

        <div className="flex items-center space-x-2">
          <Checkbox checked={isPublish} onCheckedChange={(val) => setIsPublish(!!val)} />
          <label className="text-sm">Publikasikan Artikel</label>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Menyimpan Perubahan..." : "Simpan Perubahan"}
        </Button>
      </form>
    </div>
  );
}