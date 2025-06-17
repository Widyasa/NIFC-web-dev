"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Heart, ArrowLeft, ArrowRight, RotateCcw } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

const questions = [
  {
    id: 1,
    question: "Seberapa sering Anda merasa sedih atau murung dalam 2 minggu terakhir?",
    options: [
      { value: 0, label: "Tidak pernah" },
      { value: 1, label: "Beberapa hari" },
      { value: 2, label: "Lebih dari setengah hari" },
      { value: 3, label: "Hampir setiap hari" },
    ],
  },
  {
    id: 2,
    question: "Seberapa sering Anda kehilangan minat atau kesenangan dalam aktivitas yang biasanya Anda nikmati?",
    options: [
      { value: 0, label: "Tidak pernah" },
      { value: 1, label: "Beberapa hari" },
      { value: 2, label: "Lebih dari setengah hari" },
      { value: 3, label: "Hampir setiap hari" },
    ],
  },
  {
    id: 3,
    question: "Bagaimana kualitas tidur Anda dalam 2 minggu terakhir?",
    options: [
      { value: 0, label: "Tidur nyenyak dan cukup" },
      { value: 1, label: "Kadang sulit tidur" },
      { value: 2, label: "Sering terbangun atau sulit tidur" },
      { value: 3, label: "Hampir tidak bisa tidur dengan baik" },
    ],
  },
  {
    id: 4,
    question: "Seberapa sering Anda merasa lelah atau kehilangan energi?",
    options: [
      { value: 0, label: "Jarang merasa lelah" },
      { value: 1, label: "Kadang-kadang" },
      { value: 2, label: "Sering merasa lelah" },
      { value: 3, label: "Hampir selalu merasa lelah" },
    ],
  },
  {
    id: 5,
    question: "Bagaimana nafsu makan Anda belakangan ini?",
    options: [
      { value: 0, label: "Normal seperti biasa" },
      { value: 1, label: "Sedikit berkurang" },
      { value: 2, label: "Sangat berkurang" },
      { value: 3, label: "Hampir tidak ada nafsu makan" },
    ],
  },
  {
    id: 6,
    question: "Seberapa sering Anda merasa cemas atau khawatir berlebihan?",
    options: [
      { value: 0, label: "Jarang atau tidak pernah" },
      { value: 1, label: "Kadang-kadang" },
      { value: 2, label: "Sering" },
      { value: 3, label: "Hampir setiap saat" },
    ],
  },
  {
    id: 7,
    question: "Bagaimana kemampuan Anda berkonsentrasi dalam aktivitas sehari-hari?",
    options: [
      { value: 0, label: "Sangat baik" },
      { value: 1, label: "Cukup baik" },
      { value: 2, label: "Sulit berkonsentrasi" },
      { value: 3, label: "Sangat sulit berkonsentrasi" },
    ],
  },
  {
    id: 8,
    question: "Seberapa sering Anda merasa tidak berharga atau bersalah?",
    options: [
      { value: 0, label: "Tidak pernah" },
      { value: 1, label: "Kadang-kadang" },
      { value: 2, label: "Sering" },
      { value: 3, label: "Hampir selalu" },
    ],
  },
  {
    id: 9,
    question: "Bagaimana hubungan sosial Anda dengan keluarga dan teman?",
    options: [
      { value: 0, label: "Sangat baik dan aktif" },
      { value: 1, label: "Cukup baik" },
      { value: 2, label: "Mulai menjauh dari orang lain" },
      { value: 3, label: "Sangat terisolasi" },
    ],
  },
  {
    id: 10,
    question: "Seberapa optimis Anda tentang masa depan?",
    options: [
      { value: 0, label: "Sangat optimis" },
      { value: 1, label: "Cukup optimis" },
      { value: 2, label: "Pesimis" },
      { value: 3, label: "Sangat pesimis atau putus asa" },
    ],
  },
]

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
}

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showResult, setShowResult] = useState(false)
  const router = useRouter()

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      calculateResult()
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const calculateResult = () => {
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0)
    const result = {
      score: totalScore,
      maxScore: questions.length * 3,
      percentage: Math.round((totalScore / (questions.length * 3)) * 100),
      level: getResultLevel(totalScore),
      description: getResultDescription(totalScore),
      recommendations: getRecommendations(totalScore),
    }

    // Store result in localStorage for chatbot integration
    localStorage.setItem("quizResult", JSON.stringify(result))
    setShowResult(true)
  }

  const getResultLevel = (score: number) => {
    if (score <= 7) return "Baik"
    if (score <= 14) return "Ringan"
    if (score <= 21) return "Sedang"
    return "Perlu Perhatian"
  }

  const getResultDescription = (score: number) => {
    if (score <= 7) {
      return "Kondisi mental Anda terlihat baik. Terus jaga kesehatan mental dengan pola hidup sehat dan aktivitas positif."
    }
    if (score <= 14) {
      return "Anda mungkin mengalami stres ringan. Cobalah teknik relaksasi dan jangan ragu untuk berbicara dengan orang terdekat."
    }
    if (score <= 21) {
      return "Anda mungkin mengalami tingkat stres yang cukup tinggi. Pertimbangkan untuk mencari dukungan profesional."
    }
    return "Hasil menunjukkan Anda mungkin memerlukan perhatian khusus. Sangat disarankan untuk berkonsultasi dengan profesional kesehatan mental."
  }

  const getRecommendations = (score: number) => {
    if (score <= 7) {
      return ["Lanjutkan pola hidup sehat", "Rutin berolahraga", "Jaga kualitas tidur", "Lakukan hobi yang disukai"]
    }
    if (score <= 14) {
      return [
        "Praktikkan teknik pernapasan",
        "Luangkan waktu untuk relaksasi",
        "Berbagi cerita dengan teman dekat",
        "Kurangi beban kerja jika memungkinkan",
      ]
    }
    if (score <= 21) {
      return [
        "Pertimbangkan konseling profesional",
        "Praktikkan mindfulness",
        "Jaga rutinitas harian",
        "Hindari alkohol dan kafein berlebih",
      ]
    }
    return [
      "Segera konsultasi dengan psikolog/psikiater",
      "Jangan ragu meminta bantuan keluarga",
      "Hindari keputusan besar sementara waktu",
      "Fokus pada perawatan diri",
    ]
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResult(false)
  }

  const goToChatWithResult = () => {
    // Ensure result is saved before navigation
    const result = {
      score: Object.values(answers).reduce((sum, score) => sum + score, 0),
      maxScore: questions.length * 3,
      percentage: Math.round(
        (Object.values(answers).reduce((sum, score) => sum + score, 0) / (questions.length * 3)) * 100,
      ),
      level: getResultLevel(Object.values(answers).reduce((sum, score) => sum + score, 0)),
      description: getResultDescription(Object.values(answers).reduce((sum, score) => sum + score, 0)),
      recommendations: getRecommendations(Object.values(answers).reduce((sum, score) => sum + score, 0)),
    }

    localStorage.setItem("quizResult", JSON.stringify(result))

    // Add a small delay to ensure localStorage is updated
    setTimeout(() => {
      router.push("/chat?fromQuiz=true")
    }, 100)
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  if (showResult) {
    const result = JSON.parse(localStorage.getItem("quizResult") || "{}")

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        {/* Navigation */}
        <nav className="bg-white/80 backdrop-blur-md border-b border-blue-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-blue-900">MindEasy</span>
              </Link>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial="initial" animate="animate" variants={fadeInUp}>
            <Card className="border-blue-100">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl md:text-3xl text-blue-900 mb-4">
                  Hasil Kuis Kesehatan Mental Anda
                </CardTitle>
                <div className="text-6xl font-bold text-blue-600 mb-2">
                  {result.score}/{result.maxScore}
                </div>
                <div className="text-xl text-gray-600">
                  Tingkat:{" "}
                  <span
                    className={`font-semibold ${
                      result.level === "Baik"
                        ? "text-green-600"
                        : result.level === "Ringan"
                          ? "text-yellow-600"
                          : result.level === "Sedang"
                            ? "text-orange-600"
                            : "text-red-600"
                    }`}
                  >
                    {result.level}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Interpretasi Hasil:</h3>
                  <p className="text-gray-700">{result.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-blue-900 mb-3">Rekomendasi untuk Anda:</h3>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Catatan Penting:</strong> Hasil kuis ini hanya untuk skrining awal dan bukan diagnosis
                    medis. Jika Anda merasa memerlukan bantuan profesional, jangan ragu untuk berkonsultasi dengan
                    psikolog atau psikiater.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button onClick={goToChatWithResult} className="flex-1 bg-blue-600 hover:bg-blue-700 text-lg py-3">
                    Chat dengan AI Support
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button onClick={restartQuiz} variant="outline" className="flex-1 text-lg py-3">
                    <RotateCcw className="mr-2 w-5 h-5" />
                    Ulangi Kuis
                  </Button>
                </div>

                <div className="text-center">
                  <Button asChild variant="ghost">
                    <Link href="/articles">Baca Artikel Kesehatan Mental</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-blue-900">MindEasy</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial="initial" animate="animate" variants={fadeInUp}>
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Beranda
            </Link>
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Kuis Kesehatan Mental</h1>
            <p className="text-xl text-gray-600 mb-6">
              Jawab pertanyaan berikut dengan jujur untuk mendapatkan gambaran kondisi kesehatan mental Anda
            </p>

            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>
                  Pertanyaan {currentQuestion + 1} dari {questions.length}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={currentQuestion} initial="initial" animate="animate" exit="exit" variants={fadeInUp}>
              <Card className="border-blue-100">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-900">{questions[currentQuestion].question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={answers[questions[currentQuestion].id]?.toString()}
                    onValueChange={(value) => handleAnswer(questions[currentQuestion].id, Number.parseInt(value))}
                  >
                    {questions[currentQuestion].options.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2 p-3 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                        <Label htmlFor={`option-${option.value}`} className="flex-1 cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>

                  <div className="flex justify-between mt-8">
                    <Button onClick={prevQuestion} disabled={currentQuestion === 0} variant="outline">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Sebelumnya
                    </Button>

                    <Button
                      onClick={nextQuestion}
                      disabled={!answers[questions[currentQuestion].id] && answers[questions[currentQuestion].id] !== 0}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {currentQuestion === questions.length - 1 ? "Lihat Hasil" : "Selanjutnya"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
