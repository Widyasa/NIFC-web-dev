"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Heart, Sparkles, Star, Brain } from "lucide-react"
import Link from "next/link"

export default function HeroSection() {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  }

  const staggerChildren = {
    animate: { transition: { staggerChildren: 0.2 } },
  }

  const floatAnimation = {
    animate: {
      y: [-20, 20, -20],
      transition: { duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
    },
  }

  const rotateAnimation = {
    animate: {
      rotate: [0, 360],
      transition: { duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
    },
  }

  return (
    <section className="relative px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large Background Circles */}
        <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100/30 rounded-full blur-3xl"></div>

        {/* Floating Icons */}
        <motion.div variants={floatAnimation} animate="animate" className="absolute top-20 left-20 text-blue-300/40">
          <Heart className="w-8 h-8" />
        </motion.div>
        <motion.div variants={rotateAnimation} animate="animate" className="absolute top-32 right-32 text-blue-400/40">
          <Star className="w-6 h-6" />
        </motion.div>
        <motion.div
          variants={floatAnimation}
          animate="animate"
          style={{ animationDelay: "2s" }}
          className="absolute bottom-40 left-40 text-blue-300/40"
        >
          <Brain className="w-10 h-10" />
        </motion.div>
        <motion.div
          variants={floatAnimation}
          animate="animate"
          style={{ animationDelay: "4s" }}
          className="absolute bottom-32 right-20 text-blue-400/40"
        >
          <Sparkles className="w-7 h-7" />
        </motion.div>
      </div>

      <div className="relative max-w-7xl mx-auto h-screen">
        <motion.div
          className="text-center flex flex-col items-center justify-center h-full"
          initial="initial"
          animate="animate"
          variants={staggerChildren}
        >
          {/* Enhanced Badge */}
          <motion.div variants={fadeInUp} className="mb-8">
            <Badge className="bg-blue-100 hover:bg-blue-100 text-blue-800 justify-center items-center px-6 py-3 text-base font-semibold border border-blue-200 shadow-lg transition-all duration-300">
              <Sparkles className="w-4 h-4 mr-2" />
                <p className="">
                    Powered by
                </p>
              <img src="./gemini.svg" alt="gemini logo" className="ml-1 w-[27%]"/>
            </Badge>
          </motion.div>

          {/* Enhanced Heading */}
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Jaga Kesehatan Mental Anda dengan{" "}
            <span className="relative">
              <span className="text-blue-600">MindEase</span>
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-1 bg-blue-200 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              ></motion.div>
            </span>
          </motion.h1>

          {/* Enhanced Description */}
          <motion.p
            variants={fadeInUp}
            className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Platform interaktif yang menyediakan <span className="font-semibold text-blue-700">artikel kredibel</span>,{" "}
            <span className="font-semibold text-blue-700">kuis kesehatan mental</span>, dan{" "}
            <span className="font-semibold text-blue-700">chatbot AI</span> yang siap mendengarkan dan memberikan
            dukungan emosional.
          </motion.p>

          {/* Enhanced Buttons */}
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-lg px-10 py-4 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
            >
              <Link href="/quiz" className="flex items-center">
                Mulai Kuis Mental
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-10 py-4 rounded-full border-2 border-blue-200 text-blue-700 hover:bg-blue-50 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <Link href="/chat">Chat dengan AI Support</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        <div className="w-6 h-10 border-2 border-blue-300 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-blue-400 rounded-full mt-2"></div>
        </div>
      </motion.div>
    </section>
  )
}
