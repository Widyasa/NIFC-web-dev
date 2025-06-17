"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Clock, User, Calendar, BookOpen, Heart, Facebook, Twitter, LinkIcon } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"


export default function ArticleDetailPage() {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const [articleData, setArticleData] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const { slug } = useParams()
  const [relatedArticles, setRelatedArticles] = useState<any[]>([])


  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  }

  const staggerChildren = {
    animate: { transition: { staggerChildren: 0.2 } },
  }

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("view_articles_with_category")
        .select("*")
        .eq("slug", slug)
        .single()
      if (error) console.error("Error fetching article:", error)
      else {
        setArticleData({
          ...data,
        })
      }
      if (data) {
        const { data: related, error: relatedError } = await supabase
        .from("view_articles_with_category")
        .select("*")
        .eq("category_id", data.category_id)
        .neq("id", data.id)
        .eq("is_publish", true)
        .limit(2) 
        if (relatedError) {
            console.error("Error fetching related articles:", relatedError)
          } else {
            setRelatedArticles(related)
          }
      }
      setLoading(false)
    }

    fetchArticle()
    
  }, [slug])

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setReadingProgress(Math.min(progress, 100))
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const shareArticle = (platform: string) => {
    const url = window.location.href
    const title = articleData?.title
    if (!title) return

    switch (platform) {
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank")
        break
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, "_blank")
        break
      case "copy":
        navigator.clipboard.writeText(url)
        break
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
  if (loading || !articleData) return <p className="text-center py-20">Loading...</p>
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-blue-100 z-50">
        <div className="h-full bg-blue-600 transition-all duration-150" style={{ width: `${readingProgress}%` }} />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
        {/* Navigation */}
        <motion.div className="mb-8" initial="initial" animate="animate" variants={fadeInUp}>
          <Button asChild variant="ghost" className="mb-6 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            <Link href="/articles">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Artikel
            </Link>
          </Button>
        </motion.div>

        {/* Article Header */}
        <motion.div className="mb-12" initial="initial" animate="animate" variants={staggerChildren}>
          <motion.div variants={fadeInUp} className="mb-6">
            <Badge variant={'outline'} className="bg-blue-100 text-blue-700 border border-blue-200 mb-4">{articleData.category_name}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">{articleData.title}</h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">{articleData.excerpt}</p>
          </motion.div>

          {/* Article Meta */}
          <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span className="font-medium">{articleData.psychologist_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{articleData.read_duration} menit baca</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{formatDate(articleData.created_at)}</span>
            </div>
          </motion.div>

          {/* Share Buttons */}
          <motion.div variants={fadeInUp} className="flex items-center gap-4 mb-8">
            <span className="text-gray-600 font-medium">Bagikan:</span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => shareArticle("facebook")}
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                <Facebook className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => shareArticle("twitter")}
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                <Twitter className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => shareArticle("copy")}
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                <LinkIcon className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </motion.div>

        {/* Featured Image */}
        <motion.div
          className="mb-12 rounded-2xl overflow-hidden shadow-2xl"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <img
            src={articleData.thumbnail_url || "/placeholder.svg"}
            alt={articleData.title}
            className="w-full h-64 md:h-96 object-cover"
          />
        </motion.div>

        {/* Article Content */}
        <motion.div className="prose prose-lg max-w-none mb-12" initial="initial" animate="animate" variants={fadeInUp}>
          <div
            className="text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: articleData.content }}
            style={{
              fontSize: "18px",
              lineHeight: "1.8",
            }}
          />
        </motion.div>

        {/* Hashtags */}
        <motion.div className="mb-12" initial="initial" animate="animate" variants={fadeInUp}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {articleData.hashtags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </motion.div>

        <Separator className="mb-12" />

        {/* Author Info */}
        {/* <motion.div className="mb-12" initial="initial" animate="animate" variants={fadeInUp}>
          <Card className="border border-blue-200 bg-blue-50/50">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{articleData.psychologist_name}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Psikolog klinis dengan pengalaman lebih dari 10 tahun dalam menangani kasus stres dan kecemasan.
                    Aktif memberikan edukasi kesehatan mental melalui berbagai platform dan workshop.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div> */}

        {/* Related Articles */}
        <motion.div className="mb-12" initial="initial" animate="animate" variants={fadeInUp}>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Artikel Terkait</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {relatedArticles.map((article) => (
              <Card
                key={article.id}
                className="hover:shadow-xl transition-all duration-300 border border-blue-200 group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={article.thumbnail_url || "/placeholder.svg"}
                    alt={article.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge variant={"outline"} className="absolute top-4 left-4 bg-blue-600 text-white">{article.category_name}</Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {article.readTime}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center bg-blue-50 rounded-2xl p-8 border border-blue-200"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Butuh Dukungan Lebih Lanjut?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Jika Anda merasa membutuhkan bantuan profesional untuk mengatasi stres atau masalah kesehatan mental
            lainnya, jangan ragu untuk berkonsultasi dengan ahli.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/chat">Chat dengan AI Support</Link>
            </Button>
            <Button asChild variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
              <Link href="/quiz">Tes Kesehatan Mental</Link>
            </Button>
          </div>
        </motion.div>
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
