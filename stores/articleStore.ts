import { create } from "zustand";
import type { Article, NewArticle, UpdateArticle } from "@/types";
import { supabaseClient } from "@/utils/supabase";
import { generateSlug } from "@/utils/slug";

const supabase = supabaseClient;

interface ArticleState {
  articles: Article[];
  selectedArticle: Article | null;
  loading: boolean;
  loadingCrud: boolean;
  fetchArticles: () => Promise<void>;
  createArticle: (newArticle: Omit<NewArticle, 'slug'>) => Promise<void>;
  getArticleById: (articleId: number) => Promise<void>;
  updateArticle: (updatedArticle: Partial<Omit<UpdateArticle, 'slug' | 'created_at'>> & { id: number }) => Promise<void>;
  deleteArticle: (articleId: number) => Promise<void>;
}

export const useArticleStore = create<ArticleState>((set) => ({
  articles: [],
  selectedArticle: null,
  loading: false,
  loadingCrud: false,

  fetchArticles: async () => {
    set({ loading: true });
    const { data, error } = await supabase
      .from("view_articles_with_category")
      .select("*")
      .order("created_at", { ascending: false });

    set({ loading: false });

    if (error) throw new Error("Gagal mengambil data artikel!");

    set({ articles: data });
  },

  createArticle: async (newArticleInput) => {
    set({ loadingCrud: true });

    const slug = generateSlug(newArticleInput.title);
    const newArticle = { ...newArticleInput, slug };

    const { data, error } = await supabase
      .from("articles")
      .insert(newArticle)
      .select()
      .single();

    set({ loadingCrud: false });

    if (error) throw new Error(error.message);

    set((state) => ({ articles: [data, ...state.articles] }));
  },

  getArticleById: async (id: number) => {
    set({ loading: true });

    const { data, error } = await supabase
      .from("view_articles_with_category")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      set({ selectedArticle: null, loading: false });
      console.error("Error fetching article:", error);
      return;
    }

    let hashtags = [];
    try {
      hashtags = Array.isArray(data.hashtags) ? data.hashtags : JSON.parse(data.hashtags || "[]");
    } catch (err) {
      console.warn("Failed to parse hashtags", err);
    }

    const article = { ...data, hashtags };
    set({ selectedArticle: article, loading: false });
  },

  updateArticle: async (updateInput) => {
    set({ loadingCrud: true });

    const { id, title, ...rest } = updateInput;
    const slug = title ? generateSlug(title) : undefined;
    const updatePayload = { ...rest, ...(title && { title, slug }) };

    const { data, error } = await supabase
      .from("articles")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    set({ loadingCrud: false });

    if (error) throw new Error(error.message);

    set((state) => ({
      articles: state.articles.map((a) => (a.id === id ? data : a)),
      selectedArticle: data,
    }));
  },

  deleteArticle: async (articleId) => {
    set({ loadingCrud: true });

    const { error } = await supabase
      .from("articles")
      .delete()
      .eq("id", articleId);

    set({ loadingCrud: false });

    if (error) throw new Error(error.message);

    set((state) => ({
      articles: state.articles.filter((a) => a.id !== articleId),
      selectedArticle: state.selectedArticle?.id === articleId ? null : state.selectedArticle,
    }));
  },
}));