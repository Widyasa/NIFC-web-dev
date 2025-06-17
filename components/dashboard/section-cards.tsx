"use client";

import { useEffect } from "react";
import { useStatisticStore } from "@/stores/statisticStore";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SectionCards() {
  const {
    totalArticles,
    totalPublishedArticles,
    totalDraftArticles,
    totalCategories,
    fetchTotals,
    loading,
  } = useStatisticStore();

  useEffect(() => {
    fetchTotals();
  }, [fetchTotals]);

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Artikel</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? "..." : totalArticles}
          </CardTitle>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          Jumlah semua artikel di sistem
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Artikel Terpublikasi</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? "..." : totalPublishedArticles}
          </CardTitle>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          Telah dipublikasikan ke publik
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Artikel Draft</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? "..." : totalDraftArticles}
          </CardTitle>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          Belum dipublikasikan (draft)
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Kategori Artikel</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? "..." : totalCategories}
          </CardTitle>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          Kategori yang tersedia untuk artikel
        </CardFooter>
      </Card>
    </div>
  );
}