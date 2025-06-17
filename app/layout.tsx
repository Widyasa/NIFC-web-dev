import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MindEase - Platform Kesehatan Mental Interaktif",
  description:
    "Platform kesehatan mental yang menyediakan artikel kredibel, kuis kesehatan mental, dan chatbot AI untuk dukungan emosional 24/7",
  keywords: "kesehatan mental, mental health, kuis psikologi, chatbot AI, artikel kesehatan, dukungan emosional",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
