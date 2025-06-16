"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, BookOpen, Brain, ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import StatsSection from "@/components/section/stats"
import FeaturesSection from "@/components/section/feature"
import HeroSection from "@/components/section/hero"
import CTASection from "@/components/section/cta"
import Navbar from "@/components/navbar"
import TestimonialsSection from "@/components/section/testimony"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function HomePage() {
  return (
    <div className="">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Stats Section */}
      <StatsSection />
      
      {/* CTA Section */}
      <CTASection />

      {/* Testimonial Section */}
      <TestimonialsSection />


      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">MindEase</span>
              </div>
              <p className="text-gray-400">Platform kesehatan mental yang mendukung perjalanan well-being Anda.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Fitur</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/articles" className="hover:text-white transition-colors">
                    Artikel
                  </Link>
                </li>
                <li>
                  <Link href="/quiz" className="hover:text-white transition-colors">
                    Kuis Mental
                  </Link>
                </li>
                <li>
                  <Link href="/chat" className="hover:text-white transition-colors">
                    AI Chatbot
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Dukungan</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Kontak
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privasi
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Kontak</h3>
              <p className="text-gray-400">
                Email: support@mindeasy.com
                <br />
                Telepon: (021) 1234-5678
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MindEase. Semua hak dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
