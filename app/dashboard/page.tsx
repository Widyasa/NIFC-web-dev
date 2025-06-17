import ChartAreaArticle from "@/components/dashboard/chart-area-article"
import { ChartPieArticlePerCategory } from "@/components/dashboard/pie-chart-category"
import { SectionCards } from "@/components/dashboard/section-cards"

export default function DashboardPage() {
  return (
    <>
      <SectionCards />
      <div className="px-4 lg:px-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Chart Area di kiri - lebih luas */}
          <div className="flex-1">
            <ChartAreaArticle />
          </div>

          {/* Pie Chart di kanan - lebih kecil */}
          <div className="w-full lg:w-[300px]">
            <ChartPieArticlePerCategory />
          </div>
        </div>
      </div>

    </>
  )
}
