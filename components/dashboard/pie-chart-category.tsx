"use client"

import { useEffect, useState } from "react"
import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
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
function getMainColorVariants(alphaLevels: number[]) {
  const mainColor = getComputedStyle(document.documentElement).getPropertyValue('--color-main').trim();
  const rgb = hexToRgb(mainColor);

  if (!rgb) return [];

  return alphaLevels.map((alpha) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`);
}

function hexToRgb(hex: string) {
  let sanitizedHex = hex.replace('#', '');
  if (sanitizedHex.length === 3) {
    sanitizedHex = sanitizedHex.split('').map((c) => c + c).join('');
  }

  const bigint = parseInt(sanitizedHex, 16);
  if (isNaN(bigint)) return null;

  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

export function ChartPieArticlePerCategory() {
  const {
    articlePerCategory,
    fetchArticlePerCategory,
  } = useStatisticStore()

  const [colors, setColors] = useState<string[]>([])

  useEffect(() => {
    fetchArticlePerCategory()

    const alphaVariants = [1, 0.8, 0.6, 0.4, 0.2]
    const newColors = getMainColorVariants(alphaVariants)
    setColors(newColors)
  }, [fetchArticlePerCategory])

  const chartData = articlePerCategory.map((item, idx) => ({
    category: item.category_name,
    count: item.article_count,
    fill: colors[idx % colors.length],
  }))

  const chartConfig = Object.fromEntries(
    chartData.map((d) => [
      d.category,
      {
        label: d.category,
        color: d.fill,
      },
    ])
  ) as ChartConfig

  chartConfig["count"] = { label: "Jumlah Artikel" }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Artikel per Kategori</CardTitle>
        <CardDescription>Distribusi berdasarkan kategori</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="category"
              label
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}