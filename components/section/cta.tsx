"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function CTASection() {
  return (
    <section className="min-h-screen flex justify-center items-center w-full px-4 sm:px-6 lg:px-[120px]">
      <div className="bg-gradient-to-b from-gray-50 to-gray-100 w-full py-24 rounded-2xl shadow-lg border border-gray-200 relative overflow-hidden">
        {/* Circular Decorations */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 right-4 w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
          <div className="absolute bottom-8 left-8 w-24 h-24 rounded-full bg-gradient-to-tr from-blue-300 to-blue-500"></div>
          <div className="absolute top-8 left-[300px] w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-700"></div>
          <div className="absolute bottom-8 right-[300px] w-24 h-24 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center px-6 relative z-10">
          {/* Enhanced Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight tracking-tight">
            Mulai Perjalanan Mental Anda <span className="text-blue-600">Sekarang Bersama Kami</span>
          </h2>

          {/* Enhanced Description */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
            Bergabunglah dengan <span className="font-semibold text-gray-800">ribuan pengguna</span> yang telah
            merasakan manfaat MindEasy. Temukan kedamaian dan kesejahteraan mental Anda hari ini untuk hidup lebih baik.
          </p>

          {/* Enhanced Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-lg px-10 py-4 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
            >
              <Link href="/quiz" className="flex items-center">
                Mulai Sekarang Gratis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>

            {/* <Button
              variant="outline"
              size="lg"
              className="text-lg px-10 py-4 rounded-full border-2 border-blue-200 text-blue-700 hover:bg-blue-50 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Pelajari Lebih Lanjut
            </Button> */}
          </div>
        </div>
      </div>
    </section>
  )
}
