"use client"

import React, { useEffect } from "react";
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { useStatisticStore } from "@/stores/statisticStore";

const chartConfig = {
  articles: { 
    label: "Total Artikel",
    color: "var(--color-main)", 
  },
} satisfies ChartConfig

export default function ChartAreaArticle() {
  const { articlesLast12Months, loading, fetchArticlesLast12Months } = useStatisticStore();

  useEffect(() => {
    fetchArticlesLast12Months();
  }, [fetchArticlesLast12Months]);

  const chartData = articlesLast12Months.map(item => ({
    month: item.article_month_name,
    articles: item.article_count,
  }));

  const startDate = articlesLast12Months.length > 0
    ? `${articlesLast12Months[0].article_month_name.slice(0, 3)} ${articlesLast12Months[0].article_year}`
    : "";
  const endDate = articlesLast12Months.length > 0
    ? `${articlesLast12Months[articlesLast12Months.length - 1].article_month_name.slice(0, 3)} ${articlesLast12Months[articlesLast12Months.length - 1].article_year}`
    : "";

  return (
    <Card>
        <CardHeader>
          <CardTitle>Total Artikel (12 Bulan Terakhir)</CardTitle>
          <CardDescription>
            Menampilkan jumlah artikel yang dibuat setiap bulan selama 12 bulan terakhir.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <p className="text-muted-foreground">Memuat data artikel...</p>
            </div>
          ) : (
            <ChartContainer config={chartConfig}>
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Area
                  dataKey="articles"
                  type="natural"
                  fill="var(--color-main)" 
                  fillOpacity={0.4}
                  stroke="var(--color-main)"
                />
              </AreaChart>
            </ChartContainer>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 leading-none font-medium">
                Statistik artikel bulanan. <TrendingUp className="h-4 w-4" />
              </div>
              <div className="text-muted-foreground flex items-center gap-2 leading-none">
                {startDate} - {endDate}
              </div>
            </div>
          </div>
        </CardFooter>
    </Card>
  )
}
