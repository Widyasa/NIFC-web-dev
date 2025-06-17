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

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { supabase } from "@/lib/supabase"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
}

interface Article {
  id: string;
  title: string;
  image: string | null;
  category: string;
  readTime: string; 
}

export default function ChatPage() {
  const searchParams = useSearchParams()
  const fromQuiz = searchParams?.get("fromQuiz") === "true"
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [quizResult, setQuizResult] = useState<any>(null)
  const [allArticles, setAllArticles] = useState<Article[]>([])
  const [loadingArticles, setLoadingArticles] = useState(true);


  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
    api: "/api/chat",
    initialMessages: [],
    body: {
      fromQuiz: fromQuiz,
      quizResult: quizResult 
    }
  })

  const [processedMessages, setProcessedMessages] = useState<any[]>([]);

  const fetchArticles = useCallback(async () => {
    setLoadingArticles(true);
    const { data, error } = await supabase
      .from('view_articles_with_category')
      .select('*');

    if (error) {
      console.error("Error fetching articles:", error);
      setAllArticles([]);
    } else {
      setAllArticles(data as Article[]);
      console.log("Articles fetched from Supabase:", data); // LOG INI
    }
    setLoadingArticles(false);
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const getArticlesByTitles = useCallback((titles: string[]) => { 
    if (!allArticles.length) {
      console.log("No articles loaded yet or allArticles is empty."); // LOG INI
      return []; 
    }
    const foundArticles = allArticles.filter(article => 
      titles.some(requestedTitle => article.title === requestedTitle)
    );
    
    
    console.log("Requested titles:", titles); // LOG INI
    console.log("Article titles:", allArticles[2].title); // LOG INI
    console.log("Found articles:", foundArticles); // LOG INI
    return foundArticles;
  }, [allArticles]); 

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
        console.log("Original Assistant Message:", msg.content); // LOG INI

        // REGEX PERBAIKAN: Pastikan ini cocok dengan output AI Anda
        // Ekspresi reguler Anda saat ini adalah /(\[ARTIKEL_REKOMENDASI\]:[\s\S]*)/
        // Ini akan mencocokkan "[ARTIKEL_REKOMENDASI]:" diikuti oleh karakter apa pun, termasuk newline.
        // Jika AI Anda memberikan format yang lebih ketat, misal hanya di satu baris atau ada list bullet,
        // regex ini mungkin perlu disesuaikan.
        // Contoh umum: "[ARTIKEL_REKOMENDASI]: "Judul Artikel 1", "Judul Artikel 2""
        const articleTagRegex = /(\[ARTIKEL_REKOMENDASI\]:[\s\S]*)/; 
        const match = messageContentForDisplay.match(articleTagRegex);
        console.log("Regex Match Result:", match); // LOG INI

        let extractedTitles: string[] = [];
        if (match && match[1]) {
          const rawTitlesPart = match[1];
          const titleExtractorRegex = /"([^"]+)"/g; 
          let titleMatch;
          while ((titleMatch = titleExtractorRegex.exec(rawTitlesPart)) !== null) {
            extractedTitles.push(titleMatch[1].trim());
          }
          console.log("Extracted Titles:", extractedTitles); // LOG INI
          
          if (msg.id === messages[messages.length - 1].id) {
            const newArticles = getArticlesByTitles(extractedTitles) as Article[]; // Ubah tipe menjadi Article[]
            processedMsg.recommendedArticlesForThisMessage = newArticles;
            console.log("Recommended Articles for this message:", newArticles); // LOG INI
          }

          messageContentForDisplay = messageContentForDisplay.replace(articleTagRegex, '').trim(); 
          
          processedMsg.hasRecommendation = true; 
        } else {
          processedMsg.hasRecommendation = false;
          processedMsg.recommendedArticlesForThisMessage = []; 
          console.log("No article recommendations found in this message."); // LOG INI
        }

        processedMsg.mainContent = messageContentForDisplay;

      } else {
        processedMsg.mainContent = msg.content;
        processedMsg.recommendedArticlesForThisMessage = []; 
      }
      return processedMsg;
    });

    setProcessedMessages(newProcessedMessages);

    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    
  }, [messages, getArticlesByTitles]) 

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    
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
                <Badge  variant={"outline"}  className="w-fit bg-green-100 text-green-800">✓ Hasil kuis telah dimuat</Badge>
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
                    {/* Render Recommended Articles di sini */}
                    {message.role === 'assistant' && message.recommendedArticlesForThisMessage && message.recommendedArticlesForThisMessage.length > 0 && (
                      <motion.div
                        className="mt-4 space-y-2" 
                        initial="initial"
                        animate="animate"
                        variants={fadeInUp}
                      >
                        <h4 className="text-sm font-semibold text-gray-800">Artikel yang Mungkin Membantu:</h4>
                        <div className="grid gap-2 grid-cols-1 md:grid-cols-2"> 
                          {message.recommendedArticlesForThisMessage.map((article: Article) => ( 
                            <Card key={article.id} className="h-full hover:shadow-lg transition-all duration-300 border-blue-100 group">
                              <div className="relative overflow-hidden rounded-t-lg">
                                <img
                                  src={article.thumbnail_url || "/placeholder.svg"}
                                  alt={article.title}
                                  className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <Badge className="absolute top-1 left-1 bg-blue-600 hover:bg-blue-700 text-xs px-1 py-0.5">
                                  {article.category_name}
                                </Badge>
                              </div>
                              <CardHeader className="p-3"> 
                                <CardTitle className="text-xs group-hover:text-blue-600 transition-colors line-clamp-2">
                                  {article.title}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="p-3 pt-0"> 
                                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                  <span>{article.read_duration} menit</span>
                                </div>
                                <Button
                                  size="sm"
                                  className="w-full bg-blue-600 hover:bg-blue-700 text-xs py-1 h-auto" 
                                  asChild
                                >
                                  <Link href={`/articles/${article.slug}`}>Baca Selengkapnya</Link>
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
            <CardContent className="p-4 pt-4">
              <form onSubmit={onSubmit} className="flex space-x-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ketik pesan Anda di sini..."
                  className="flex-1"
                  disabled={isLoading || loadingArticles} 
                />
                <Button type="submit" disabled={isLoading || !input.trim() || loadingArticles} className="bg-blue-600 hover:bg-blue-700">
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