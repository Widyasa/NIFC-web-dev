"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Brain, MessageCircle, ArrowRight, Sparkles, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function FeaturesSection() {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  }

  const staggerChildren = {
    animate: { transition: { staggerChildren: 0.2 } },
  }

  const scaleIn = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  }

  const features = [
    {
      icon: BookOpen,
      title: "Artikel Kesehatan Mental",
      description: "Kumpulan artikel kredibel tentang stres, depresi, kecemasan, dan self-love",
      benefits: [
        "Bahasa yang mudah dimengerti",
        "Kategori lengkap dan terstruktur",
        "Pencarian berdasarkan topik",
        "Rekomendasi personal",
      ],
      link: "/articles",
      buttonText: "Baca Artikel",
      badge: "50+ Artikel",
    },
    {
      icon: Brain,
      title: "Kuis Kesehatan Mental",
      description: "Deteksi awal kondisi mental dengan pertanyaan psikologis sederhana",
      benefits: [
        "Berbasis penelitian psikologi",
        "Hasil estimasi yang akurat",
        "Terintegrasi dengan chatbot",
        "Rekomendasi tindak lanjut",
      ],
      link: "/quiz",
      buttonText: "Mulai Kuis",
      badge: "5 Menit",
    },
    {
      icon: MessageCircle,
      title: "AI Chatbot Support",
      description: "Teman virtual yang empatik, responsif, dan siap mendengarkan 24/7",
      benefits: [
        "Powered by Gemini AI",
        "Respons empatik dan edukatif",
        "Saran aktivitas dan referensi",
        "Privasi terjamin",
      ],
      link: "/chat",
      buttonText: "Mulai Chat",
      badge: "24/7 Online",
    },
  ]

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8  overflow-hidden">
      {/* Background Decorations */}
     

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-20"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 rounded-full px-6 py-2 mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-blue-800 font-medium text-sm">Fitur Unggulan</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Fitur Unggulan <span className="text-blue-600">MindEasy</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Tiga fitur utama yang saling terintegrasi untuk mendukung perjalanan kesehatan mental Anda dengan pendekatan
            yang komprehensif dan personal
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerChildren}
        >
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <motion.div key={index} variants={scaleIn}>
                <Card className="group h-full hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-blue-200 bg-white relative overflow-hidden hover:border-blue-300">
                  {/* Badge */}
                  <div className="absolute top-4 right-4 bg-blue-100 rounded-full px-3 py-1 text-xs font-semibold text-blue-700">
                    {feature.badge}
                  </div>

                  <CardHeader className="text-center pb-4">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 group-hover:bg-blue-700">
                        <IconComponent className="w-10 h-10 text-white" />
                      </div>

                      {/* Floating decoration */}
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:animate-ping"></div>
                    </div>

                    <CardTitle className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-900 transition-colors">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-3 mb-6">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm leading-relaxed">{benefit}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      asChild
                      className="w-full rounded-full bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:scale-105 transition-all duration-300 text-white border-0 group/btn"
                      size="lg"
                    >
                      <Link href={feature.link} className="flex items-center justify-center">
                        {feature.buttonText}
                        <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>

                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-300 rounded-full transform translate-x-16 translate-y-16"></div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
