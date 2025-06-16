"use client"

import { Users, FileText, Headphones, Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function StatsSection() {
  const stats = [
    {
      number: "1000+",
      label: "Pengguna Aktif",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      description: "Pengguna yang aktif setiap hari",
    },
    {
      number: "20+",
      label: "Artikel Kredibel",
      icon: FileText,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      description: "Artikel dari psikolog yang kredibel",
    },
    {
      number: "24/7",
      label: "AI Support",
      icon: Headphones,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      description: "Dukungan sepanjang waktu",
    },
    {
      number: "95%",
      label: "Kepuasan User",
      icon: Heart,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200",
      description: "Tingkat kepuasan pengguna",
    },
  ]

  return (
    <section className="min-h-screen flex justify-center items-center px-4 overflow-hidden bg-blue-50/50 relative">
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"></div>
      </div>
      <div className="max-w-7xl mx-auto relative">
      
        {/* Header */}
        <div className="text-center mb-16 relative">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Dipercaya oleh Ribuan Pengguna
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Bergabunglah dengan komunitas yang terus berkembang dan rasakan pengalaman terbaik bersama kami
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Card
                key={index}
                className={`group relative overflow-hidden border-2 ${stat.borderColor} hover:border-opacity-50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 bg-white/80 backdrop-blur-sm`}
              >
                <CardContent className="p-8 text-center">
                  {/* Icon Container */}
                  <div className="relative mb-6">
                    <div
                      className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${stat.bgColor} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}
                    >
                      <IconComponent
                        className={`w-10 h-10 ${stat.color} group-hover:scale-110 transition-transform duration-300`}
                      />
                    </div>

                    {/* Floating decoration */}
                    <div
                      className={`absolute -top-2 -right-2 w-6 h-6 ${stat.bgColor} rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:animate-ping`}
                    ></div>
                  </div>

                  {/* Number */}
                  <div className="space-y-3">
                    <div
                      className={`text-5xl font-bold ${stat.color} group-hover:scale-105 transition-all duration-300 tracking-tight`}
                    >
                      {stat.number}
                    </div>

                    {/* Label */}
                    <div className="text-gray-800 font-semibold text-xl mb-2">{stat.label}</div>

                    {/* Description */}
                    <div className="text-gray-500 text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      {stat.description}
                    </div>
                  </div>

                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                    <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-gradient-to-br from-current to-transparent"></div>
                    <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full bg-gradient-to-tr from-current to-transparent"></div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Bottom Decoration */}
        {/* <div className="flex justify-center mt-16 space-x-3">
          {stats.map((_, index) => (
            <div
              key={index}
              className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse"
              style={{ animationDelay: `${index * 0.3}s` }}
            ></div>
          ))}
        </div> */}
      </div>
    </section>
  )
}
