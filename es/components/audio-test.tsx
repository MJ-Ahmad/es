"use client"

import { useState } from "react"
import { Button } from "@/es/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/es/components/ui/card"
import { Volume2 } from "lucide-react"

export function AudioTest() {
  const [testResult, setTestResult] = useState<string>("")
  const [isPlaying, setIsPlaying] = useState(false)

  const testSpeechSynthesis = () => {
    setIsPlaying(true)
    setTestResult("Testing...")

    if ("speechSynthesis" in window) {
      speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance("Hello, this is a test")
      utterance.lang = "en-US"
      utterance.rate = 0.8
      utterance.volume = 1

      utterance.onstart = () => {
        setTestResult("✅ Speech Synthesis is working!")
      }

      utterance.onend = () => {
        setIsPlaying(false)
      }

      utterance.onerror = (event) => {
        setTestResult(`❌ Speech Synthesis error: ${event.error}`)
        setIsPlaying(false)
      }

      setTimeout(() => {
        speechSynthesis.speak(utterance)
      }, 100)
    } else {
      setTestResult("❌ Speech Synthesis not supported in this browser")
      setIsPlaying(false)
    }
  }

  const testWebAudio = () => {
    if ("AudioContext" in window || "webkitAudioContext" in window) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      const audioContext = new AudioContext()

      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(440, audioContext.currentTime)
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)

      oscillator.start()
      oscillator.stop(audioContext.currentTime + 0.5)

      setTestResult("✅ Web Audio API is working!")
    } else {
      setTestResult("❌ Web Audio API not supported")
    }
  }

  const getVoiceInfo = () => {
    if ("speechSynthesis" in window) {
      const voices = speechSynthesis.getVoices()
      const englishVoices = voices.filter((voice) => voice.lang.startsWith("en"))

      setTestResult(`
        📊 Voice Information:
        - Total voices: ${voices.length}
        - English voices: ${englishVoices.length}
        - Available English voices: ${englishVoices.map((v) => v.name).join(", ")}
      `)
    } else {
      setTestResult("❌ Speech Synthesis not available")
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Volume2 className="w-5 h-5" />
          <span>Audio System Test</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Button onClick={testSpeechSynthesis} disabled={isPlaying} className="w-full">
            {isPlaying ? "Playing..." : "Test Speech Synthesis"}
          </Button>

          <Button onClick={testWebAudio} variant="outline" className="w-full">
            Test Web Audio API
          </Button>

          <Button onClick={getVoiceInfo} variant="outline" className="w-full">
            Check Available Voices
          </Button>
        </div>

        {testResult && (
          <div className="p-3 bg-gray-50 rounded border">
            <pre className="text-xs whitespace-pre-wrap">{testResult}</pre>
          </div>
        )}

        <div className="text-xs text-gray-600 space-y-1">
          <p>💡 Tips for better audio:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Use Chrome or Firefox browser</li>
            <li>Make sure your volume is turned up</li>
            <li>Allow audio permissions if prompted</li>
            <li>Try refreshing the page if audio doesn't work</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
