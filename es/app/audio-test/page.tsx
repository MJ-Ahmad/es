"use client"

import { AudioTest } from "@/es/components/audio-test"
import Link from "next/link"
import { Button } from "@/es/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function AudioTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Audio System Test</h1>
              <p className="text-sm text-gray-600">Test if your browser supports audio features</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <AudioTest />
      </div>
    </div>
  )
}
