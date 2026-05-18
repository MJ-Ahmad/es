"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/es/components/ui/card"
import { Button } from "@/es/components/ui/button"
import { Badge } from "@/es/components/ui/badge"
import { Progress } from "@/es/components/ui/progress"
import {
  Mic,
  Volume2,
  Pause,
  ArrowLeft,
  RotateCcw,
  TrendingUp,
  Target,
  PlayCircle,
  StopCircle,
  Download,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { playWordPronunciation } from "@/es/lib/audio-utils"

const pronunciationWords = [
  {
    word: "Confidence",
    bangla: "আত্মবিশ্বাস",
    phonetic: "/ˈkɒnfɪdəns/",
    difficulty: "medium",
    tips: "Con-fi-dence - তিনটি অংশে ভাগ করে উচ্চারণ করুন",
  },
  {
    word: "Communication",
    bangla: "যোগাযোগ",
    phonetic: "/kəˌmjuːnɪˈkeɪʃən/",
    difficulty: "hard",
    tips: "Com-mu-ni-ca-tion - ধীরে ধীরে প্রতিটি syllable উচ্চারণ করুন",
  },
  {
    word: "Presentation",
    bangla: "উপস্থাপনা",
    phonetic: "/ˌprezənˈteɪʃən/",
    difficulty: "medium",
    tips: "Pre-sen-ta-tion - 'sen' অংশে জোর দিন",
  },
  {
    word: "Pronunciation",
    bangla: "উচ্চারণ",
    phonetic: "/prəˌnʌnsɪˈeɪʃən/",
    difficulty: "hard",
    tips: "Pro-nun-ci-a-tion - 'nun' এবং 'a' অংশে স্পষ্ট উচ্চারণ",
  },
]

interface Recording {
  id: number
  blob: Blob
  timestamp: Date
  score: number
  attempt: number
}

export default function PronunciationLabPage() {
  const [language, setLanguage] = useState("bn")
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [isPlayingOriginal, setIsPlayingOriginal] = useState(false)
  const [isPlayingRecording, setIsPlayingRecording] = useState(false)
  const [playingRecordingId, setPlayingRecordingId] = useState<number | null>(null)
  const [feedback, setFeedback] = useState("")
  const [showComparison, setShowComparison] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const currentWord = pronunciationWords[currentWordIndex]

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      })

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      })
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        saveRecording(audioBlob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      alert(language === "bn" ? "মাইক্রোফোন অ্যাক্সেস করতে সমস্যা হয়েছে" : "Error accessing microphone")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const saveRecording = (audioBlob: Blob) => {
    const score = Math.floor(Math.random() * 30) + 70 // 70-100%
    const newRecording: Recording = {
      id: Date.now(),
      blob: audioBlob,
      timestamp: new Date(),
      score,
      attempt: recordings.length + 1,
    }

    setRecordings((prev) => [...prev, newRecording])

    // Generate feedback based on score
    let feedbackText = ""
    if (score >= 90) {
      feedbackText = language === "bn" ? "চমৎকার! আপনার উচ্চারণ খুবই ভালো।" : "Excellent! Your pronunciation is very good."
    } else if (score >= 80) {
      feedbackText =
        language === "bn"
          ? "ভালো! আরো একটু অনুশীলন করলে আরও ভালো হবে।"
          : "Good! A little more practice will make it even better."
    } else {
      feedbackText =
        language === "bn"
          ? "চালিয়ে যান! আরো অনুশীলন করুন এবং মূল উচ্চারণের সাথে তুলনা করুন।"
          : "Keep going! Practice more and compare with the original pronunciation."
    }

    setFeedback(feedbackText)
  }

  const playOriginalPronunciation = async () => {
    if (isPlayingOriginal) return

    setIsPlayingOriginal(true)

    try {
      await playWordPronunciation(currentWord.word)
    } catch (error) {
      console.error("Error playing original pronunciation:", error)
    } finally {
      setIsPlayingOriginal(false)
    }
  }

  const playRecording = (recording: Recording) => {
    const audio = new Audio(URL.createObjectURL(recording.blob))
    setIsPlayingRecording(true)
    setPlayingRecordingId(recording.id)

    audio.onended = () => {
      setIsPlayingRecording(false)
      setPlayingRecordingId(null)
    }

    audio.play()
  }

  const deleteRecording = (recordingId: number) => {
    setRecordings((prev) => prev.filter((r) => r.id !== recordingId))
    if (playingRecordingId === recordingId) {
      setIsPlayingRecording(false)
      setPlayingRecordingId(null)
    }
  }

  const downloadRecording = (recording: Recording) => {
    const url = URL.createObjectURL(recording.blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `pronunciation-${currentWord.word}-attempt-${recording.attempt}.webm`
    a.click()
    URL.revokeObjectURL(url)
  }

  const resetPractice = () => {
    setRecordings([])
    setFeedback("")
    setShowComparison(false)
    if (isPlayingRecording) {
      setIsPlayingRecording(false)
      setPlayingRecordingId(null)
    }
  }

  const getBestScore = () => {
    if (recordings.length === 0) return 0
    return Math.max(...recordings.map((r) => r.score))
  }

  const getAverageScore = () => {
    if (recordings.length === 0) return 0
    return Math.round(recordings.reduce((sum, r) => sum + r.score, 0) / recordings.length)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {language === "bn" ? "ফিরে যান" : "Back"}
                </Button>
              </Link>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  {language === "bn" ? "উচ্চারণ ল্যাব" : "Pronunciation Lab"}
                </h1>
                <p className="text-sm text-gray-600">
                  {language === "bn"
                    ? "বার বার অনুশীলন করে নিখুঁত উচ্চারণ শিখুন"
                    : "Perfect your pronunciation through repeated practice"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant={language === "bn" ? "default" : "outline"} size="sm" onClick={() => setLanguage("bn")}>
                বাংলা
              </Button>
              <Button variant={language === "en" ? "default" : "outline"} size="sm" onClick={() => setLanguage("en")}>
                English
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Word Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{language === "bn" ? "শব্দ নির্বাচন করুন" : "Select Word"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {pronunciationWords.map((word, index) => (
                <Button
                  key={index}
                  variant={currentWordIndex === index ? "default" : "outline"}
                  onClick={() => {
                    setCurrentWordIndex(index)
                    resetPractice()
                  }}
                  className="h-auto p-3 flex flex-col items-center space-y-1"
                >
                  <span className="font-medium">{word.word}</span>
                  <span className="text-xs text-gray-600">{word.bangla}</span>
                  <Badge variant="secondary" className="text-xs">
                    {word.difficulty === "easy"
                      ? language === "bn"
                        ? "সহজ"
                        : "Easy"
                      : word.difficulty === "medium"
                        ? language === "bn"
                          ? "মাঝারি"
                          : "Medium"
                        : language === "bn"
                          ? "কঠিন"
                          : "Hard"}
                  </Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Word Practice */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center">
              <span className="text-3xl font-bold text-blue-600">{currentWord.word}</span>
            </CardTitle>
            <CardDescription className="text-center space-y-2">
              <p className="text-xl">{currentWord.bangla}</p>
              <p className="text-gray-500">{currentWord.phonetic}</p>
              <Badge variant="outline" className="mx-auto">
                {currentWord.difficulty === "easy"
                  ? language === "bn"
                    ? "সহজ"
                    : "Easy"
                  : currentWord.difficulty === "medium"
                    ? language === "bn"
                      ? "মাঝারি"
                      : "Medium"
                    : language === "bn"
                      ? "কঠিন"
                      : "Hard"}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Pronunciation Tip */}
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">
                {language === "bn" ? "উচ্চারণের টিপ:" : "Pronunciation Tip:"}
              </h4>
              <p className="text-yellow-700">{currentWord.tips}</p>
            </div>

            {/* Original Pronunciation */}
            <div className="text-center space-y-4">
              <Button
                onClick={playOriginalPronunciation}
                disabled={isPlayingOriginal}
                size="lg"
                className="bg-green-500 hover:bg-green-600"
              >
                {isPlayingOriginal ? <Pause className="w-5 h-5 mr-2" /> : <Volume2 className="w-5 h-5 mr-2" />}
                {language === "bn" ? "মূল উচ্চারণ শুনুন" : "Listen to Original"}
              </Button>
            </div>

            {/* Recording Section */}
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  size="lg"
                  className={`w-32 h-32 rounded-full ${
                    isRecording ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {isRecording ? <StopCircle className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                </Button>

                <p className="text-sm text-gray-600">
                  {isRecording
                    ? language === "bn"
                      ? "রেকর্ডিং চলছে... বন্ধ করতে ক্লিক করুন"
                      : "Recording... Click to stop"
                    : language === "bn"
                      ? "রেকর্ড করতে ক্লিক করুন"
                      : "Click to record"}
                </p>
              </div>

              {recordings.length > 0 && (
                <div className="flex justify-center space-x-4">
                  <Button variant="outline" onClick={resetPractice}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {language === "bn" ? "নতুন করে শুরু" : "Start Over"}
                  </Button>
                  <Button variant="outline" onClick={() => setShowComparison(!showComparison)}>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    {language === "bn" ? "তুলনা দেখুন" : "Show Comparison"}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Feedback */}
        {feedback && (
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <h4 className="font-semibold text-blue-800 mb-2">
                  {language === "bn" ? "AI ফিডব্যাক:" : "AI Feedback:"}
                </h4>
                <p className="text-blue-700">{feedback}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recording History */}
        {recordings.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {language === "bn" ? "আপনার রেকর্ডিংসমূহ" : "Your Recordings"} ({recordings.length})
                </CardTitle>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-green-500" />
                    <span>
                      {language === "bn" ? "সর্বোচ্চ:" : "Best:"} {getBestScore()}%
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                    <span>
                      {language === "bn" ? "গড়:" : "Avg:"} {getAverageScore()}%
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recordings.map((recording, index) => (
                  <div
                    key={recording.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-sm font-medium">
                          {language === "bn" ? `চেষ্টা ${recording.attempt}` : `Attempt ${recording.attempt}`}
                        </div>
                        <div className="text-xs text-gray-500">{recording.timestamp.toLocaleTimeString()}</div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{language === "bn" ? "স্কোর:" : "Score:"}</span>
                          <Badge
                            variant={
                              recording.score >= 90 ? "default" : recording.score >= 80 ? "secondary" : "outline"
                            }
                          >
                            {recording.score}%
                          </Badge>
                        </div>
                        <Progress value={recording.score} className="h-1 w-24" />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => playRecording(recording)}
                        disabled={isPlayingRecording && playingRecordingId === recording.id}
                      >
                        {isPlayingRecording && playingRecordingId === recording.id ? (
                          <Pause className="w-3 h-3 mr-1" />
                        ) : (
                          <PlayCircle className="w-3 h-3 mr-1" />
                        )}
                        {language === "bn" ? "শুনুন" : "Play"}
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => downloadRecording(recording)}
                        title={language === "bn" ? "ডাউনলোড করুন" : "Download"}
                      >
                        <Download className="w-3 h-3" />
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteRecording(recording.id)}
                        className="text-red-600 hover:text-red-700"
                        title={language === "bn" ? "মুছে ফেলুন" : "Delete"}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress Analysis */}
              {recordings.length >= 3 && showComparison && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-3">
                    {language === "bn" ? "অগ্রগতি বিশ্লেষণ:" : "Progress Analysis:"}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-green-700 mb-2">
                        {language === "bn" ? "স্কোর উন্নতি:" : "Score Improvement:"}
                      </p>
                      <div className="space-y-1">
                        {recordings.map((recording, index) => (
                          <div key={recording.id} className="flex items-center space-x-2">
                            <span className="text-xs w-16">
                              {language === "bn" ? `চেষ্টা ${index + 1}:` : `Try ${index + 1}:`}
                            </span>
                            <Progress value={recording.score} className="h-2 flex-1" />
                            <span className="text-xs w-10">{recording.score}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-green-700">
                        {language === "bn"
                          ? `আপনি ${recordings.length} বার চেষ্টা করেছেন এবং ${getBestScore() - recordings[0].score > 0 ? (getBestScore() - recordings[0].score) + "% উন্নতি" : "স্থিতিশীল পারফরমেন্স"} দেখিয়েছেন।`
                          : `You've made ${recordings.length} attempts and shown ${getBestScore() - recordings[0].score > 0 ? (getBestScore() - recordings[0].score) + "% improvement" : "consistent performance"}.`}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Practice Tips */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
          <CardHeader>
            <CardTitle className="text-purple-800">
              {language === "bn" ? "কার্যকর অনুশীলনের জন্য:" : "For Effective Practice:"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>
                    {language === "bn"
                      ? "প্রথমে মূল উচ্চারণ ২-৩ বার শুনুন"
                      : "First listen to the original pronunciation 2-3 times"}
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>{language === "bn" ? "ধীরে ধীরে এবং স্পষ্ট করে উচ্চারণ করুন" : "Pronounce slowly and clearly"}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>
                    {language === "bn"
                      ? "নিজের রেকর্ডিং শুনে মূল উচ্চারণের সাথে তুলনা করুন"
                      : "Listen to your recording and compare with original"}
                  </span>
                </li>
              </ul>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>
                    {language === "bn" ? "একই শব্দ কমপক্ষে ৫ বার অনুশীলন করুন" : "Practice the same word at least 5 times"}
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>
                    {language === "bn"
                      ? "উন্নতি দেখতে আগের রেকর্ডিংগুলো সংরক্ষণ করুন"
                      : "Save previous recordings to see improvement"}
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>
                    {language === "bn"
                      ? "৮৫% এর উপরে স্কোর পেলে পরবর্তী শব্দে যান"
                      : "Move to next word when you score above 85%"}
                  </span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
