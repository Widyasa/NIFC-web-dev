import { z } from "zod"
import { useArticleStore } from "@/stores/articleStore"

const idSchema = z.number().int({ message: "ID artikel tidak valid" })

export async function deleteArticleRequest(articleId: number) {
  const result = idSchema.safeParse(articleId)

  if (!result.success) {
    return { success: false, message: result.error.errors[0].message }
  }

  try {
    await useArticleStore.getState().deleteArticle(result.data)
    return { success: true, message: "Artikel berhasil dihapus" }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? `Terjadi kesalahan: ${error.message}`
          : "Terjadi kesalahan saat menghapus artikel",
    }
  }
}