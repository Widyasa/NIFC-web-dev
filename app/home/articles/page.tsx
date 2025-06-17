"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Clock, User, ArrowLeft, BookOpen, Filter, Grid, List } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { articles } from "@/data/article"
import Navbar from "@/components/navbar"

const categories = ["Semua", "Stres", "Depresi", "Kecemasan", "Self-Love", "Lifestyle", "Komunikasi"]

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

// Category colors for better visual distinction
const getCategoryColor = (category: string) => {
  const colors = {
    Stres: "bg-red-100 text-red-700 border-red-200",
    Depresi: "bg-purple-100 text-purple-700 border-purple-200",
    Kecemasan: "bg-orange-100 text-orange-700 border-orange-200",
    "Self-Love": "bg-pink-100 text-pink-700 border-pink-200",
    Lifestyle: "bg-green-100 text-green-700 border-green-200",
    Komunikasi: "bg-blue-100 text-blue-700 border-blue-200",
  }
  return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-700 border-gray-200"
}

export default function EnhancedArticlesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Semua")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "Semua" || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
        {/* Enhanced Header */}
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

        {/* Enhanced Search and Filter Section */}
        <motion.div
          className="mb-12 bg-white rounded-2xl p-8 shadow-lg border border-blue-100"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Cari artikel berdasarkan judul, konten, atau tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-4 text-lg border-2 border-blue-100 focus:border-blue-300 rounded-xl"
            />
          </div>

          {/* Filter Controls */}
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

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-6 py-2 font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-blue-600 hover:bg-blue-700 shadow-lg"
                    : "border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Results Counter */}
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

        {/* Articles Grid/List */}
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
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <Badge className={`absolute top-4 left-4 shadow-lg border ${getCategoryColor(article.category)}`}>
                      {article.category}
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
                          {article.readTime}
                        </div>
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {article.author}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {article.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100"
                        >
                          #{tag}
                        </Badge>
                      ))}
                      {article.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                          +{article.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                    <Button
                      asChild
                      className="w-full bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Link href={`/articles/${article.id}`}>Baca Selengkapnya</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="hover:shadow-xl transition-all duration-300 border border-blue-200 bg-white group">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 relative overflow-hidden">
                      <img
                        src={article.image || "/placeholder.svg"}
                        alt={article.title}
                        className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className={`absolute top-4 left-4 shadow-lg border ${getCategoryColor(article.category)}`}>
                        {article.category}
                      </Badge>
                    </div>
                    <div className="md:w-2/3 p-6">
                      <CardTitle className="text-xl group-hover:text-blue-600 transition-colors mb-3">
                        {article.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 mb-4 line-clamp-2">{article.excerpt}</CardDescription>
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <Clock className="w-4 h-4 mr-1" />
                        {article.readTime}
                        <span className="mx-2">•</span>
                        <User className="w-4 h-4 mr-1" />
                        {article.author}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags.slice(0, 4).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                      <Button asChild className="bg-blue-600 hover:bg-blue-700 rounded-full">
                        <Link href={`/articles/${article.id}`}>Baca Selengkapnya</Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Empty State */}
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
    </div>
  )
}
