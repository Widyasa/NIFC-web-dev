"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SetupInstructions() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="border-green-100 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center text-green-800">
            <CheckCircle className="w-5 h-5 mr-2" />
            Setup Gemini API - MindEasy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">1. Buat file .env.local</h3>
            <p className="text-sm text-gray-600 mb-2">
              Buat file <code className="bg-gray-100 px-1 rounded">.env.local</code> di root folder project Anda:
            </p>
            <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-sm relative">
              <code>GOOGLE_GENERATIVE_AI_API_KEY=...</code>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
                onClick={() => copyToClipboard("GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyByRwuJavATSVmZHIkw6asubUHHVEO_Wyw")}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">2. Install Dependencies</h3>
            <p className="text-sm text-gray-600 mb-2">Pastikan Anda sudah menginstall package yang diperlukan:</p>
            <div className="bg-gray-900 text-blue-400 p-3 rounded-lg font-mono text-sm relative">
              <code>npm install ai @ai-sdk/google</code>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
                onClick={() => copyToClipboard("npm install ai @ai-sdk/google")}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">3. Restart Development Server</h3>
            <p className="text-sm text-gray-600 mb-2">Restart server development Anda:</p>
            <div className="bg-gray-900 text-yellow-400 p-3 rounded-lg font-mono text-sm relative">
              <code>npm run dev</code>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
                onClick={() => copyToClipboard("npm run dev")}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800">Keamanan API Key</h4>
                <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                  <li>• Jangan pernah commit file .env.local ke Git</li>
                  <li>• Pastikan .env.local ada di .gitignore</li>
                  <li>• Untuk production, set environment variable di hosting platform</li>
                  <li>• Monitor penggunaan API key di Google Cloud Console</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Status Integrasi</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <Badge className="bg-green-100 text-green-800 mr-2">✓</Badge>
                <span className="text-sm">Gemini API Key dikonfigurasi</span>
              </div>
              <div className="flex items-center">
                <Badge className="bg-green-100 text-green-800 mr-2">✓</Badge>
                <span className="text-sm">Chat endpoint siap</span>
              </div>
              <div className="flex items-center">
                <Badge className="bg-green-100 text-green-800 mr-2">✓</Badge>
                <span className="text-sm">Quiz integration aktif</span>
              </div>
              <div className="flex items-center">
                <Badge className="bg-green-100 text-green-800 mr-2">✓</Badge>
                <span className="text-sm">Auto-response untuk hasil kuis</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="text-blue-800">Cara Menguji Integrasi</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">
                1
              </span>
              <span>Buka halaman kuis mental health di aplikasi</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">
                2
              </span>
              <span>Selesaikan kuis dengan menjawab semua pertanyaan</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">
                3
              </span>
              <span>Klik tombol "Chat dengan AI Support" di halaman hasil</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">
                4
              </span>
              <span>Gemini AI akan otomatis menganalisis hasil kuis dan memberikan respons personal</span>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
