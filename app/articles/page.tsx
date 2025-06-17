"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Clock, User, ArrowLeft, BookOpen, Filter, Grid, List, Heart } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import Navbar from "@/components/navbar"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"
import { log } from "console"

interface Article {
  id: number
  title: string
  slug: string
  thumbnail_url: string
  content: string
  excerpt: string
  is_publish: boolean
  read_duration: number
  psychologist_name: string
  hashtags: string[]
  created_at: string
  category_id: number
  category_name: string
}

interface Category {
  id: number
  category_name: string
}

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

const getCategoryColor = (category: string) => {
  const colors = {
    "Hubungan": "bg-red-100 text-red-700 border-red-200",
    "Pengembangan Diri": "bg-purple-100 text-purple-700 border-purple-200",
    "Keluarga": "bg-orange-100 text-orange-700 border-orange-200",
    "Produktivitas": "bg-pink-100 text-pink-700 border-pink-200",
    "Kesehatan Mental": "bg-green-100 text-green-700 border-green-200",
  }
  return colors[category as keyof typeof colors]
}

export default function EnhancedArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Semua")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    const fetchArticles = async () => {
      const { data, error } = await supabase
        .from("view_articles_with_category")
        .select("*")
        .eq("is_publish", true)

      if (error) {
        console.error("Error fetching articles:", error)
        return
      }

      const parsed = data.map((article: any) => ({
        ...article,
        hashtags: Array.isArray(article.hashtags)
          ? article.hashtags
          : JSON.parse(article.hashtags || "[]"),
      }))

      setArticles(parsed)
    }

    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
      if (error) {
        console.error("Error fetching categories:", error)
        return
      }

      setCategories([{ id: 0, category_name: "Semua" }, ...(data || [])])
    }

    fetchArticles()
    fetchCategories()
  }, [])

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.hashtags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )

    const matchesCategory =
      selectedCategory === "Semua" ||
      article.category_name === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
        <motion.div className="mb-12" initial="initial" animate="animate" variants={fadeInUp}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 rounded-full px-6 py-2 mb-6 shadow-sm">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span className="text-blue-800 font-medium text-sm">Artikel Kesehatan Mental</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Artikel <span className="text-blue-600">Kesehatan Mental</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Kumpulan artikel kredibel dan mudah dipahami untuk mendukung perjalanan kesehatan mental Anda dengan
              informasi yang terpercaya dan praktis
            </p>
          </div>
        </motion.div>

        <motion.div
          className="mb-12 bg-white rounded-2xl p-8 shadow-lg border border-blue-100"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Cari artikel berdasarkan judul, konten, atau tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-4 text-lg border-2 border-blue-100 focus:border-blue-300 rounded-xl"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter Kategori:</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Tampilan:</span>
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 transition-colors ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 transition-colors ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.category_name ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.category_name)}
                className={`rounded-full px-6 py-2 font-medium transition-all duration-200 ${
                  selectedCategory === category.category_name
                    ? "bg-blue-600 hover:bg-blue-700 shadow-lg"
                    : "border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                }`}
              >
                {category.category_name}
              </Button>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-gray-600">
              Menampilkan <span className="font-semibold text-blue-600">{filteredArticles.length}</span> artikel
              {selectedCategory !== "Semua" && (
                <span>
                  {" "}
                  dalam kategori <span className="font-semibold text-blue-600">{selectedCategory}</span>
                </span>
              )}
            </p>
          </div>
        </motion.div>

        <motion.div
          className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}
          initial="initial"
          animate="animate"
          variants={staggerChildren}
        >
          {filteredArticles.map((article) => (
            <motion.div key={article.id} variants={fadeInUp}>
              {viewMode === "grid" ? (
                <Card className="h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-blue-200 bg-white group overflow-hidden">
                  <div className="relative overflow-hidden">
                    <img
                      src={article.thumbnail_url || "/placeholder.svg"}
                      alt={article.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <Badge variant={'outline'} className={`absolute top-4 left-4 shadow-lg border ${getCategoryColor(article.category_name)}`}>
                      {article.category_name}
                    </Badge>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {article.read_duration} min read
                        </div>
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {article.psychologist_name}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {article.hashtags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {article.hashtags.length > 3 && (
                        <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                          +{article.hashtags.length - 3}
                        </Badge>
                      )}
                    </div>
                    <Button
                      asChild
                      className="w-full bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Link href={`/articles/${article.slug}`}>Baca Selengkapnya</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="hover:shadow-xl transition-all duration-300 border border-blue-200 bg-white group">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 relative overflow-hidden">
                      <img
                        src={article.thumbnail_url || "/placeholder.svg"}
                        alt={article.title}
                        className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge variant={"outline"} className={`absolute top-4 left-4 shadow-lg border ${getCategoryColor(article.category_name)}`}>
                        {article.category_name}
                      </Badge>
                    </div>
                    <div className="md:w-2/3 p-6">
                      <CardTitle className="text-xl group-hover:text-blue-600 transition-colors mb-3">
                        {article.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 mb-4 line-clamp-2">{article.excerpt}</CardDescription>
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <Clock className="w-4 h-4 mr-1" />
                        {article.read_duration} min read
                        <span className="mx-2">•</span>
                        <User className="w-4 h-4 mr-1" />
                        {article.psychologist_name}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.hashtags.slice(0, 4).map((tag) => (
                          <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button asChild className="bg-blue-600 hover:bg-blue-700 rounded-full">
                        <Link href={`/articles/${article.slug}`}>Baca Selengkapnya</Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </motion.div>
          ))}
        </motion.div>

        {filteredArticles.length === 0 && (
          <motion.div
            className="text-center py-16 bg-white rounded-2xl shadow-lg border border-blue-100"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Artikel Tidak Ditemukan</h3>
            <p className="text-gray-500 text-lg mb-6">
              Tidak ada artikel yang sesuai dengan pencarian Anda. Coba ubah kata kunci atau kategori.
            </p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("Semua")
              }}
              className="bg-blue-600 hover:bg-blue-700 rounded-full px-8"
            >
              Reset Filter
            </Button>
          </motion.div>
        )}
      </div>
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">MindEasy</span>
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
            <p>&copy; 2025 MindEasy. All Right Serve.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
