import { z } from "zod"
import { useArticleStore } from "@/stores/articleStore"
import type { UpdateArticle } from "@/types"

const updateArticleSchema = z.object({
  id: z.number().int({ message: "ID artikel harus berupa angka bulat" }),
  title: z.string().min(2, { message: "Judul artikel minimal 2 karakter" }).trim(),
  category_id: z.number().int({ message: "Kategori harus berupa angka bulat" }),
  thumbnail_url: z.string().url({ message: "URL thumbnail tidak valid" }),
  content: z.string().min(10, { message: "Konten harus minimal 10 karakter" }),
  excerpt: z.string().min(10, { message: "Excerpt harus minimal 10 karakter" }),
  is_publish: z.boolean(),
  read_duration: z.number().int().min(1, { message: "Durasi baca harus lebih dari 0" }),
  psychologist_name: z.string().min(2, { message: "Nama psikolog minimal 2 karakter" }),
  hashtags: z.array(z.string()).default([]),
})

export async function updateArticleRequest(articleData: UpdateArticle) {
  const result = updateArticleSchema.safeParse(articleData)

  if (!result.success) {
    const errorMessage = result.error.errors
      .map((err) => `${err.path.join(".")}: ${err.message}`)
      .join(", ")
    return { success: false, message: errorMessage }
  }

  try {
    await useArticleStore.getState().updateArticle(result.data)
    return { success: true, message: "Artikel berhasil diperbarui" }
  } catch (error) {
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return {
        success: false,
        message: "Judul artikel sudah digunakan, silakan pilih judul lain",
      }
    }

    return {
      success: false,
      message:
        error instanceof Error
          ? `Terjadi kesalahan: ${error.message}`
          : "Terjadi kesalahan saat memperbarui artikel",
    }
  }
}