import { ActionModal } from "@/components/dashboard/dialogs/action-modal";
import { useArticleStore } from "@/stores/articleStore";
import { useState } from "react";
import { toast } from "sonner";
import { deleteArticleRequest } from "@/requests/article/delete";
import { DeleteConfirmationMessage } from "@/components/ui/delete-confirmation-message";

interface DeleteArticleDialogProps {
  open: boolean;
  onClose: () => void;
  articleId: number;
  articleTitle: string;
}

export function DeleteArticleDialog({
  open,
  onClose,
  articleId,
  articleTitle,
}: DeleteArticleDialogProps) {
  const { fetchArticles } = useArticleStore();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteArticleRequest(articleId);

    if (result.success) {
      await fetchArticles(); // refresh artikel setelah hapus
      toast.success(result.message);
      onClose();
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  return (
    <ActionModal
      open={open}
      onClose={onClose}
      type="delete"
      title={`Hapus Artikel "${articleTitle}"?`}
      onSubmit={handleDelete}
      loading={loading}
    >
      <DeleteConfirmationMessage label={`artikel "${articleTitle}"`} />
    </ActionModal>
  );
}