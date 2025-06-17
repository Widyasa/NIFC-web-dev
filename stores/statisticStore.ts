import { create } from "zustand";
import { supabaseClient } from "@/utils/supabase";

const supabase = supabaseClient;

interface ArticleCategoryStat {
  category_name: string;
  article_count: number;
}

interface ArticleDurationStat {
  category_name: string;
  average_read_duration: number;
}

interface MonthlyArticleStat {
  article_year: number;
  article_month_number: number;
  article_month_name: string;
  article_count: number;
}

interface StatisticState {
  totalArticles: number;
  totalPublishedArticles: number;
  totalDraftArticles: number;
  totalCategories: number;
  articlePerCategory: ArticleCategoryStat[];
  avgReadDurationPerCategory: ArticleDurationStat[];
  articlesLast12Months: MonthlyArticleStat[];
  loading: boolean;

  fetchTotals: () => Promise<void>;
  fetchArticlePerCategory: () => Promise<void>;
  fetchAvgReadDurationPerCategory: () => Promise<void>;
  fetchArticlesLast12Months: () => Promise<void>;
}

export const useStatisticStore = create<StatisticState>((set) => ({
  totalArticles: 0,
  totalPublishedArticles: 0,
  totalDraftArticles: 0,
  totalCategories: 0,
  articlePerCategory: [],
  avgReadDurationPerCategory: [],
  articlesLast12Months: [],
  loading: false,

  fetchTotals: async () => {
    set({ loading: true });

    const [
      { data: totalArticles, error: err1 },
      { data: totalPublished, error: err2 },
      { data: totalDraft, error: err3 },
      { data: totalCategories, error: err4 }
    ] = await Promise.all([
      supabase.rpc("get_total_articles"),
      supabase.rpc("get_total_published_articles"),
      supabase.rpc("get_total_draft_articles"),
      supabase.rpc("get_total_categories")
    ]);

    set({ loading: false });

    if (err1 || err2 || err3 || err4) {
      console.error("Statistik Error:", { err1, err2, err3, err4 });
      throw new Error("Gagal mengambil data statistik total artikel!");
    }

    set({
      totalArticles: totalArticles ?? 0,
      totalPublishedArticles: totalPublished ?? 0,
      totalDraftArticles: totalDraft ?? 0,
      totalCategories: totalCategories ?? 0,
    });
  },

  fetchArticlePerCategory: async () => {
    set({ loading: true });

    const { data, error } = await supabase.rpc("get_article_count_per_category");

    set({ loading: false });

    if (error) {
      console.error("Error artikel per kategori:", error);
      throw new Error("Gagal mengambil jumlah artikel per kategori!");
    }

    set({ articlePerCategory: data || [] });
  },

  fetchAvgReadDurationPerCategory: async () => {
    set({ loading: true });

    const { data, error } = await supabase.rpc("get_average_read_duration_per_category");

    set({ loading: false });

    if (error) {
      console.error("Error rata-rata durasi baca:", error);
      throw new Error("Gagal mengambil rata-rata durasi baca per kategori!");
    }

    set({ avgReadDurationPerCategory: data || [] });
  },

  fetchArticlesLast12Months: async () => {
    set({ loading: true });

    const { data, error } = await supabase.rpc("get_articles_written_last_12_months");

    set({ loading: false });

    if (error) {
      console.error("Error artikel 12 bulan:", error);
      throw new Error("Gagal mengambil statistik artikel 12 bulan terakhir!");
    }

    set({ articlesLast12Months: data || [] });
  },
}));