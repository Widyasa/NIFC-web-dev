"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

export default function TestimonialsSection() {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  }

  const staggerChildren = {
    animate: { transition: { staggerChildren: 0.2 } },
  }

  const testimonials = [
    {
      id: 1,
      name: "Sarah Putri",
      role: "Mahasiswa",
      avatar: "https://images.unsplash.com/photo-1521566652839-697aa473761a?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 5,
      text: "MindEase benar-benar membantu saya mengatasi kecemasan selama masa kuliah. Artikel-artikelnya mudah dipahami dan chatbot AI-nya sangat responsif. Terima kasih MindEase!",
    },
    {
      id: 2,
      name: "Ahmad Rizki",
      role: "Karyawan Swasta",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Sebagai pekerja yang sering stres, MindEase memberikan solusi praktis yang bisa saya terapkan langsung. Kuis mental health-nya juga membantu saya lebih memahami kondisi diri.",
    },
    {
      id: 3,
      name: "Maya Sari",
      role: "Ibu Rumah Tangga",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Platform yang sangat membantu untuk self-care. Saya jadi lebih aware dengan kesehatan mental dan belajar mencintai diri sendiri. Artikelnya berkualitas dan mudah dimengerti.",
    },
    {
      id: 4,
      name: "Budi Santoso",
      role: "Entrepreneur",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "MindEase membantu saya mengelola stres dalam berbisnis. Fitur chatbot 24/7 sangat membantu ketika butuh dukungan emosional di tengah malam. Highly recommended!",
    },
    {
      id: 5,
      name: "Rina Handayani",
      role: "Guru",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Sebagai pendidik, saya sering menghadapi tekanan. MindEase memberikan wawasan baru tentang kesehatan mental dan cara berkomunikasi yang lebih baik dengan siswa.",
    },
    {
      id: 6,
      name: "Dika Pratama",
      role: "Fresh Graduate",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Masa transisi dari kuliah ke dunia kerja membuat saya cemas. MindEase membantu saya memahami perasaan ini normal dan memberikan strategi untuk mengatasinya.",
    },
  ]

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-20"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 rounded-full px-6 py-2 mb-6 shadow-sm">
            <Quote className="w-4 h-4 text-blue-600" />
            <span className="text-blue-800 font-medium text-sm">Testimoni Pengguna</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Apa Kata <span className="text-blue-600">Pengguna Kami</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Ribuan pengguna telah merasakan manfaat MindEase dalam perjalanan kesehatan mental mereka. Berikut adalah
            cerita mereka.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerChildren}
        >
          {testimonials.map((testimonial) => (
            <motion.div key={testimonial.id} variants={fadeInUp}>
              <Card className="h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-blue-200 bg-white group relative overflow-hidden">
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 text-blue-200 group-hover:text-blue-300 transition-colors">
                  <Quote className="w-8 h-8" />
                </div>

                <CardContent className="p-8">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-gray-700 leading-relaxed mb-8 text-lg italic">"{testimonial.text}"</p>

                  {/* User Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg">
                      <img
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">{testimonial.name}</h4>
                      <p className="text-blue-600 text-sm font-medium">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>

                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-300 rounded-full transform translate-x-16 translate-y-16"></div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
