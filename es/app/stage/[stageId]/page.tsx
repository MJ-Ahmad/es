"use client"

import { useState, useRef } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/es/components/ui/card"
import { Button } from "@/es/components/ui/button"
import { Badge } from "@/es/components/ui/badge"
import { Progress } from "@/es/components/ui/progress"
import {
  Mic,
  MicOff,
  Pause,
  CheckCircle,
  Volume2,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Target,
  MessageCircle,
} from "lucide-react"
import Link from "next/link"
import { playWordPronunciation, playSentencePronunciation } from "@/es/lib/audio-utils"

const stageData = {
  foundation: {
    title: "শব্দভিত্তিক লার্নিং",
    titleEn: "Word-Based Learning",
    description: "মূল শব্দ শিখুন এবং বিভিন্ন প্রসঙ্গে ব্যবহার করুন",
    lessons: [
      {
        id: 1,
        title: "আত্মবিশ্বাস তৈরি করা",
        titleEn: "Building Confidence",
        word: "Confidence",
        banglaWord: "আত্মবিশ্বাস",
        pronunciation: "/ˈkɒnfɪdəns/",
        meanings: ["নিজের উপর বিশ্বাস", "সাহস ও দৃঢ়তা", "আত্মনির্ভরতা"],
        examples: [
          {
            en: "I need confidence to speak English.",
            bn: "ইংরেজি বলার জন্য আমার আত্মবিশ্বাস প্রয়োজন।",
          },
          {
            en: "Building confidence takes time.",
            bn: "আত্মবিশ্বাস তৈরি করতে সময় লাগে।",
          },
          {
            en: "She speaks with great confidence.",
            bn: "সে অনেক আত্মবিশ্বাসের সাথে কথা বলে।",
          },
        ],
      },
    ],
  },
  sentence: {
    title: "বাক্যভিত্তিক উন্নয়ন",
    titleEn: "Sentence Formation",
    description: "সহজ বাক্য গঠন এবং ক্রমান্বয়ে উন্নতি",
    lessons: [
      {
        id: 1,
        title: "সাধারণ বাক্য গঠন",
        titleEn: "Simple Sentence Construction",
        patterns: [
          {
            pattern: "Subject + Verb + Object",
            example: "I speak English.",
            bangla: "আমি ইংরেজি বলি।",
          },
          {
            pattern: "Subject + Verb + Complement",
            example: "I am confident.",
            bangla: "আমি আত্মবিশ্বাসী।",
          },
        ],
      },
    ],
  },
}

export default function StagePage() {
  const params = useParams()
  const stageId = params.stageId as string
  const [language, setLanguage] = useState("bn")
  const [currentLesson, setCurrentLesson] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [recordedText, setRecordedText] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [pronunciationScore, setPronunciationScore] = useState(0)
  const [completedExercises, setCompletedExercises] = useState<number[]>([])
  const [recordings, setRecordings] = useState<{ id: number; blob: Blob; timestamp: Date; score?: number }[]>([])
  const [currentRecording, setCurrentRecording] = useState<Blob | null>(null)
  const [isPlayingRecording, setIsPlayingRecording] = useState(false)
  const [playingRecordingId, setPlayingRecordingId] = useState<number | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const stage = stageData[stageId as keyof typeof stageData]
  if (!stage) return <div>Stage not found</div>

  const currentLessonData = stage.lessons[currentLesson]

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        saveRecording(audioBlob)

        // Simulate speech-to-text and pronunciation scoring
        setTimeout(() => {
          if (stageId === "foundation" && currentLessonData.word) {
            setRecordedText(`"${currentLessonData.word}" - Good pronunciation!`)
            setPronunciationScore(Math.floor(Math.random() * 20) + 80)
          }
        }, 1000)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  const saveRecording = (audioBlob: Blob) => {
    const newRecording = {
      id: Date.now(),
      blob: audioBlob,
      timestamp: new Date(),
      score: Math.floor(Math.random() * 20) + 80, // Simulated score
    }
    setRecordings((prev) => [...prev, newRecording])
    setCurrentRecording(audioBlob)
  }

  const playRecording = (recording: { id: number; blob: Blob }) => {
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
    if (currentRecording && recordings.find((r) => r.id === recordingId)) {
      setCurrentRecording(null)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const playPronunciation = async () => {
    if (isPlaying) return

    setIsPlaying(true)

    try {
      if (stageId === "foundation" && currentLessonData.word) {
        await playWordPronunciation(currentLessonData.word)
      }
    } catch (error) {
      console.error("Error playing pronunciation:", error)
    } finally {
      setIsPlaying(false)
    }
  }

  const playExamplePronunciation = async (sentence: string) => {
    try {
      await playSentencePronunciation(sentence)
    } catch (error) {
      console.error("Error playing example pronunciation:", error)
    }
  }

  const markExerciseComplete = (exerciseId: number) => {
    if (!completedExercises.includes(exerciseId)) {
      setCompletedExercises([...completedExercises, exerciseId])
    }
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
                <h1 className="text-lg font-bold text-gray-900">{language === "bn" ? stage.title : stage.titleEn}</h1>
                <p className="text-sm text-gray-600">
                  {language === "bn" ? `পাঠ ${currentLesson + 1}` : `Lesson ${currentLesson + 1}`}
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
        {/* Progress */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{language === "bn" ? "পাঠের অগ্রগতি" : "Lesson Progress"}</span>
              <span className="text-sm text-gray-600">{Math.round((completedExercises.length / 3) * 100)}%</span>
            </div>
            <Progress value={(completedExercises.length / 3) * 100} className="h-2" />
          </CardContent>
        </Card>

        {stageId === "foundation" && (
          <div className="space-y-6">
            {/* Word Learning Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>{language === "bn" ? "আজকের শব্দ" : "Today's Word"}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-4xl font-bold text-blue-600">{currentLessonData.word}</h2>
                    <p className="text-xl text-gray-700">{currentLessonData.banglaWord}</p>
                    <p className="text-gray-500">{currentLessonData.pronunciation}</p>
                  </div>

                  <Button onClick={playPronunciation} disabled={isPlaying} className="mx-auto">
                    {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Volume2 className="w-4 h-4 mr-2" />}
                    {language === "bn" ? "উচ্চারণ শুনুন" : "Listen Pronunciation"}
                  </Button>
                </div>

                {/* Meanings */}
                <div>
                  <h3 className="font-semibold mb-3">{language === "bn" ? "অর্থসমূহ:" : "Meanings:"}</h3>
                  <ul className="space-y-2">
                    {currentLessonData.meanings.map((meaning, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span>{meaning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Examples Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>{language === "bn" ? "উদাহরণ বাক্য" : "Example Sentences"}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentLessonData.examples.map((example, index) => (
                    <div
                      key={index}
                      className={`p-4 border rounded-lg transition-all ${
                        completedExercises.includes(index)
                          ? "bg-green-50 border-green-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="space-y-2">
                        <p className="font-medium text-gray-900">{example.en}</p>
                        <p className="text-gray-600">{example.bn}</p>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" onClick={() => playExamplePronunciation(example.en)}>
                            <Volume2 className="w-3 h-3 mr-1" />
                            {language === "bn" ? "শুনুন" : "Listen"}
                          </Button>
                          {completedExercises.includes(index) && (
                            <Badge variant="default" className="bg-green-500">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {language === "bn" ? "সম্পন্ন" : "Complete"}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Practice Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>{language === "bn" ? "উচ্চারণ অনুশীলন" : "Pronunciation Practice"}</span>
                </CardTitle>
                <CardDescription>
                  {language === "bn" ? "শব্দটি উচ্চারণ করুন এবং AI ফিডব্যাক পান" : "Pronounce the word and get AI feedback"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-4">
                  <div className="text-2xl font-bold text-center p-6 bg-blue-50 rounded-lg">
                    {currentLessonData.word}
                  </div>

                  <Button
                    onClick={isRecording ? stopRecording : startRecording}
                    size="lg"
                    className={`w-32 h-32 rounded-full ${
                      isRecording ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                  </Button>

                  <p className="text-sm text-gray-600">
                    {isRecording
                      ? language === "bn"
                        ? "রেকর্ডিং চলছে..."
                        : "Recording..."
                      : language === "bn"
                        ? "রেকর্ড করতে ক্লিক করুন"
                        : "Click to record"}
                  </p>
                </div>

                {recordedText && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">{language === "bn" ? "ফলাফল:" : "Result:"}</h4>
                    <p className="text-green-700">{recordedText}</p>
                    {pronunciationScore > 0 && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm">
                          <span>{language === "bn" ? "উচ্চারণ স্কোর:" : "Pronunciation Score:"}</span>
                          <span className="font-bold">{pronunciationScore}%</span>
                        </div>
                        <Progress value={pronunciationScore} className="h-2 mt-1" />
                      </div>
                    )}
                    <Button size="sm" className="mt-3" onClick={() => markExerciseComplete(10)}>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {language === "bn" ? "অনুশীলন সম্পন্ন" : "Mark Complete"}
                    </Button>
                  </div>
                )}
                {/* Recording History */}
                {recordings.length > 0 && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-3">
                      {language === "bn" ? "আপনার রেকর্ডিংসমূহ:" : "Your Recordings:"}
                    </h4>
                    <div className="space-y-3">
                      {recordings.map((recording, index) => (
                        <div
                          key={recording.id}
                          className="flex items-center justify-between p-3 bg-white rounded border"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium">
                              {language === "bn" ? `রেকর্ডিং ${index + 1}` : `Recording ${index + 1}`}
                            </span>
                            <span className="text-xs text-gray-500">{recording.timestamp.toLocaleTimeString()}</span>
                            {recording.score && <Badge variant="secondary">{recording.score}%</Badge>}
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
                                <Volume2 className="w-3 h-3 mr-1" />
                              )}
                              {language === "bn" ? "শুনুন" : "Play"}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteRecording(recording.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              ✕
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {recordings.length >= 2 && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                        <p className="text-sm text-green-700">
                          {language === "bn"
                            ? "চমৎকার! আপনি একাধিক রেকর্ডিং করেছেন। তুলনা করে দেখুন কোনটি ভালো শোনাচ্ছে।"
                            : "Great! You've made multiple recordings. Compare them to see which sounds better."}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            disabled={currentLesson === 0}
            onClick={() => setCurrentLesson((prev) => Math.max(0, prev - 1))}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {language === "bn" ? "পূর্ববর্তী" : "Previous"}
          </Button>

          <Button
            disabled={currentLesson >= stage.lessons.length - 1}
            onClick={() => setCurrentLesson((prev) => Math.min(stage.lessons.length - 1, prev + 1))}
          >
            {language === "bn" ? "পরবর্তী" : "Next"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
