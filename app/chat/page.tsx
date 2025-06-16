// chat page:
"use client"

import type React from "react"

import { useChat } from "ai/react"
import { useState, useEffect, useRef, useCallback } from "react" 
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Heart, ArrowLeft, Send, Bot, User, Loader2 } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useSearchParams } from "next/navigation"
import { articles } from "@/data/article" 

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
}

export default function ChatPage() {
  const searchParams = useSearchParams()
  const fromQuiz = searchParams?.get("fromQuiz") === "true"
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [quizResult, setQuizResult] = useState<any>(null)
  // recommendedArticles state tidak lagi diperlukan di level ini, karena per pesan
  // const [recommendedArticles, setRecommendedArticles] = useState<any[]>([])


  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
    api: "/api/chat",
    initialMessages: [],
    body: {
      fromQuiz: fromQuiz,
      quizResult: quizResult 
    }
  })

  const [processedMessages, setProcessedMessages] = useState<any[]>([]);

  const getArticlesByTitles = useCallback((titles: string[]) => { 
    return articles.filter(article => 
      titles.some(requestedTitle => article.title.toLowerCase() === requestedTitle.toLowerCase())
    ); // Filter articles based on requested titles
  }, [articles]); 

  useEffect(() => {
    if (fromQuiz) {
      const result = localStorage.getItem("quizResult")
      if (result) {
        setQuizResult(JSON.parse(result))
      }
    }
  }, [fromQuiz]) 

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })

    const newProcessedMessages = messages.map(msg => {
      const processedMsg = { ...msg };

      if (msg.role === 'assistant') {
        let messageContentForDisplay = msg.content; 

        const articleTagRegex = /(\[ARTIKEL_REKOMENDASI\]:[\s\S]*)/; 
        const match = messageContentForDisplay.match(articleTagRegex);

        let extractedTitles: string[] = [];
        if (match && match[1]) {
          const rawTitlesPart = match[1];
          const titleExtractorRegex = /"([^"]+)"/g; 
          let titleMatch;
          while ((titleMatch = titleExtractorRegex.exec(rawTitlesPart)) !== null) {
            extractedTitles.push(titleMatch[1].trim());
          }
          
          // Set recommendedArticles di sini, hanya jika ini adalah pesan terakhir
          if (msg.id === messages[messages.length - 1].id) {
            const newArticles = getArticlesByTitles(extractedTitles) as any[];
            // Hanya tambahkan artikel baru yang belum ada di daftar
            // Note: ini menargetkan recommendedArticles di state utama, yang sudah dihapus.
            // Kita perlu memastikan bahwa recommendedArticles hanya diakumulasikan jika ini adalah akumulasi global.
            // Karena sekarang per pesan, kita tidak lagi mengakumulasi global.
            // Logic ini perlu direvisi untuk *mengakumulasi* recommendedArticles global,
            // atau menghapusnya jika kita hanya mau per-pesan.
            // Berdasarkan "tidak menghilang, jadi mungkin bisa dibuat loop juga seperti chatnya"
            // diasumsikan kita mau akumulasi global.
            
            // --- PERBAIKAN: JIKA KITA TETAP MAU AKUMULASI GLOBAL ---
            // Kita harus mengembalikan state `recommendedArticles` di level ChatPage
            // dan `setRecommendedArticles` harus digunakan di sini.
            // Namun, jika setiap pesan menampilkan artikelnya sendiri, akumulasi global bisa jadi tidak relevan.
            // Saya akan asumsikan kita tetap ingin setiap pesan menampilkan rekomendasi *nya sendiri*,
            // dan jika ada rekomendasi, itu akan terlihat di bawah pesan itu.
            // Jika Anda ingin akumulasi global lagi, kita harus mengembalikan `recommendedArticles`
            // di ChatPage dan menggunakannya.
            
            // Untuk skenario "rekomendasi per pesan", kita simpan di processedMsg.
            processedMsg.recommendedArticlesForThisMessage = newArticles;
          }

          // Hapus bagian [ARTIKEL_REKOMENDASI]... dari mainContent yang akan diberikan ke ReactMarkdown
          messageContentForDisplay = messageContentForDisplay.replace(articleTagRegex, '').trim(); 
          
          processedMsg.hasRecommendation = true; 
        } else {
          processedMsg.hasRecommendation = false;
          processedMsg.recommendedArticlesForThisMessage = []; // Pastikan kosong jika tidak ada rekomendasi
        }

        // Konten utama yang akan dirender oleh ReactMarkdown
        processedMsg.mainContent = messageContentForDisplay;

      } else {
        // Untuk pesan user, tidak perlu pemrosesan khusus
        processedMsg.mainContent = msg.content;
        processedMsg.recommendedArticlesForThisMessage = []; // Pastikan pesan user tidak memiliki rekomendasi
      }
      return processedMsg;
    });

    setProcessedMessages(newProcessedMessages);

    // --- Hapus reset recommendedArticles global di sini ---
    // Karena kita tidak lagi menggunakan recommendedArticles global untuk akumulasi
    // jika kita menampilkan rekomendasi per pesan.
    // Jika Anda ingin akumulasi global, maka kita harus mengembalikan state `recommendedArticles`
    // dan mengelolanya di sini.

    // Untuk memastikan messagesEndRef selalu berfungsi
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    
  }, [messages, getArticlesByTitles]) 

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // --- Hapus reset recommendedArticles global di sini ---
    // Karena tidak ada recommendedArticles global yang direset lagi dalam alur ini.
    // Jika Anda ingin akumulasi global lagi, maka kita harus mengembalikan state `recommendedArticles`
    // dan mengelolanya.
    
    handleSubmit(e)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-blue-900">MindEase</span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/articles" className="text-gray-700 hover:text-blue-600 transition-colors">
                Artikel
              </Link>
              <Link href="/quiz" className="text-gray-700 hover:text-blue-600 transition-colors">
                Kuis Mental
              </Link>
              <span className="text-blue-600 font-medium">Chat Support</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <motion.div className="mb-6" initial="initial" animate="animate" variants={fadeInUp}>
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Beranda
            </Link>
          </Button>

          <Card className="border-blue-100 bg-gradient-to-r from-blue-50 to-white">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-900">
                <Bot className="w-6 h-6 mr-2" />
                AI Mental Health Support
              </CardTitle>
              <p className="text-gray-600">
                Saya di sini untuk mendengarkan dan memberikan dukungan. Ceritakan apa yang Anda rasakan atau tanyakan
                apa saja tentang kesehatan mental.
              </p>
              {fromQuiz && quizResult && (
                <Badge className="w-fit bg-green-100 text-green-800">✓ Hasil kuis telah dimuat</Badge>
              )}
            </CardHeader>
          </Card>
        </motion.div>

        {/* Quiz Result Welcome Card */}
        {fromQuiz && quizResult && ( 
          <motion.div initial="initial" animate="animate" variants={fadeInUp} className="mb-4">
            <Card className="border-green-100 bg-gradient-to-r from-green-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center text-green-800">
                  <Bot className="w-5 h-5 mr-2" />
                  Analisis Hasil Kuis Anda
                </CardTitle>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {quizResult.score}/{quizResult.maxScore}
                    </div>
                    <div className="text-sm text-gray-600">Skor Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{quizResult.percentage}%</div>
                    <div className="text-sm text-gray-600">Persentase</div>
                  </div>
                  <div className="text-center">
                    <div
                      className={`text-2xl font-bold ${
                        quizResult.level === "Baik"
                          ? "text-green-600"
                          : quizResult.level === "Ringan"
                            ? "text-yellow-600"
                            : quizResult.level === "Sedang"
                              ? "text-orange-600"
                              : "text-red-600"
                      }`}
                    >
                      {quizResult.level}
                    </div>
                    <div className="text-sm text-gray-600">Tingkat</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">AI</div>
                    <div className="text-sm text-gray-600">Analisis</div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </motion.div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          <AnimatePresence>
            {messages.length === 0 && !isLoading && !fromQuiz && ( 
              
              <motion.div initial="initial" animate="animate" variants={fadeInUp} className="text-center py-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Mulai percakapan dengan AI Support</h3>
                <p className="text-gray-600 mb-4">
                  Saya siap mendengarkan dan membantu Anda. Mulai dengan menceritakan perasaan Anda hari ini.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      append({
                        id: `preset-msg-1-${Date.now()}`,
                        role: "user",
                        content: "Saya merasa stres dengan pekerjaan belakangan ini",
                      })
                    }
                  >
                    "Saya merasa stres dengan pekerjaan"
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      append({
                        id: `preset-msg-2-${Date.now()}`,
                        role: "user",
                        content: "Bagaimana cara mengatasi kecemasan?",
                      })
                    }
                  >
                    "Bagaimana mengatasi kecemasan?"
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      append({
                        id: `preset-msg-3-${Date.now()}`,
                        role: "user",
                        content: "Saya sulit tidur belakangan ini",
                      })
                    }
                  >
                    "Saya sulit tidur"
                  </Button>
                </div>
              </motion.div>
            )}

            {processedMessages.map((message) => ( 
              <motion.div
                key={message.id}
                initial="initial"
                animate="animate"
                variants={fadeInUp}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === "user" ? "bg-blue-600 ml-3" : "bg-gray-200 mr-3"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-200 text-gray-900"
                    } markdown-container`}
                  >
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                    >
                      {message.mainContent}
                    </ReactMarkdown>
                    {message.hasRecommendation && message.recommendationHiddenContent && (
                      <span
                        style={{
                          display: 'block', 
                          height: 0,
                          opacity: 0,
                          overflow: 'hidden',
                          lineHeight: 0, 
                          fontSize: 0,   
                        }}
                      >
                        {message.recommendationHiddenContent}
                      </span>
                    )}
                    {/* --- Render Recommended Articles di sini --- */}
                    {message.role === 'assistant' && message.recommendedArticlesForThisMessage && message.recommendedArticlesForThisMessage.length > 0 && (
                      <motion.div
                        className="mt-4 space-y-2" // Kurangi margin atas agar lebih dekat ke chat
                        initial="initial"
                        animate="animate"
                        variants={fadeInUp}
                      >
                        <h4 className="text-sm font-semibold text-gray-800">Artikel yang Mungkin Membantu:</h4>
                        <div className="grid gap-2 grid-cols-1 md:grid-cols-2"> {/* Layout yang lebih kompak */}
                          {message.recommendedArticlesForThisMessage.map((article: any) => ( // Pastikan tipe any
                            <Card key={article.id} className="h-full hover:shadow-lg transition-all duration-300 border-blue-100 group">
                              <div className="relative overflow-hidden rounded-t-lg">
                                <img
                                  src={article.image || "/placeholder.svg"}
                                  alt={article.title}
                                  className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <Badge className="absolute top-1 left-1 bg-blue-600 hover:bg-blue-700 text-xs px-1 py-0.5">
                                  {article.category}
                                </Badge>
                              </div>
                              <CardHeader className="p-3"> {/* Kurangi padding */}
                                <CardTitle className="text-xs group-hover:text-blue-600 transition-colors line-clamp-2">
                                  {article.title}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="p-3 pt-0"> {/* Kurangi padding */}
                                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                  <span>{article.readTime}</span>
                                </div>
                                <Button
                                  size="sm"
                                  className="w-full bg-blue-600 hover:bg-blue-700 text-xs py-1 h-auto" // Sesuaikan tinggi button
                                  asChild
                                >
                                  <Link href={`/articles#${article.id}`}>Baca Selengkapnya</Link>
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <motion.div initial="initial" animate="animate" variants={fadeInUp} className="flex justify-start">
                <div className="flex max-w-[80%]">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-200 mr-3">
                    <Bot className="w-4 h-4 animate-spin text-blue-600" />
                  </div>
                  <div className="rounded-2xl px-4 py-3 bg-white border border-gray-200">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      <span className="text-gray-600">AI sedang mengetik...</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <motion.div initial="initial" animate="animate" variants={fadeInUp}>
          <Card className="border-blue-100">
            <CardContent className="p-4">
              <form onSubmit={onSubmit} className="flex space-x-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ketik pesan Anda di sini..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading || !input.trim()} className="bg-blue-600 hover:bg-blue-700">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </form>
              <p className="text-xs text-gray-500 mt-2">
                AI ini dirancang untuk memberikan dukungan emosional dan informasi umum. Untuk masalah serius, silakan
                konsultasi dengan profesional kesehatan mental.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}