"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/es/components/ui/card"
import { Button } from "@/es/components/ui/button"
import { Badge } from "@/es/components/ui/badge"
import { Progress } from "@/es/components/ui/progress"
import { Mic, MicOff, Volume2, CheckCircle, ArrowLeft, Timer, Target, Trophy, Pause } from "lucide-react"
import Link from "next/link"
import { playWordPronunciation, playSentencePronunciation } from "@/es/lib/audio-utils"

const dailyPracticeExercises = [
  {
    id: 1,
    type: "pronunciation",
    title: "উচ্চারণ অনুশীলন",
    titleEn: "Pronunciation Practice",
    word: "Communication",
    bangla: "যোগাযোগ",
    difficulty: "medium",
  },
  {
    id: 2,
    type: "sentence",
    title: "বাক্য অনুশীলন",
    titleEn: "Sentence Practice",
    sentence: "I am practicing English every day.",
    bangla: "আমি প্রতিদিন ইংরেজি অনুশীলন করছি।",
    difficulty: "easy",
  },
  {
    id: 3,
    type: "conversation",
    title: "কথোপকথন অনুশীলন",
    titleEn: "Conversation Practice",
    prompt: "Introduce yourself to a new friend",
    bangla: "নতুন বন্ধুর সাথে নিজের পরিচয় দিন",
    difficulty: "hard",
  },
]

export default function PracticePage() {
  const [language, setLanguage] = useState("bn")
  const [currentExercise, setCurrentExercise] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [recordedText, setRecordedText] = useState("")
  const [score, setScore] = useState(0)
  const [completedExercises, setCompletedExercises] = useState<number[]>([])
  const [practiceTime, setPracticeTime] = useState(0)
  const [recordings, setRecordings] = useState<{ id: number; blob: Blob; timestamp: Date; score?: number }[]>([])
  const [currentRecording, setCurrentRecording] = useState<Blob | null>(null)
  const [isPlayingRecording, setIsPlayingRecording] = useState(false)
  const [playingRecordingId, setPlayingRecordingId] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const exercise = dailyPracticeExercises[currentExercise]

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

        // Simulate AI feedback
        setTimeout(() => {
          setRecordedText("Great pronunciation! Keep practicing.")
          setScore(Math.floor(Math.random() * 20) + 80)
        }, 1000)
      }

      mediaRecorder.start()
      setIsRecording(true)

      // Start practice timer
      timerRef.current = setInterval(() => {
        setPracticeTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  const saveRecording = (audioBlob: Blob) => {
    const newRecording = {
      id: Date.now(),
      blob: audioBlob,
      timestamp: new Date(),
      score: Math.floor(Math.random() * 20) + 80,
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
  }

  const completeExercise = () => {
    if (!completedExercises.includes(exercise.id)) {
      setCompletedExercises([...completedExercises, exercise.id])
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const playPronunciation = async () => {
    if (isPlaying) return

    setIsPlaying(true)

    try {
      if (exercise.type === "pronunciation" && exercise.word) {
        await playWordPronunciation(exercise.word)
      } else if (exercise.type === "sentence" && exercise.sentence) {
        await playSentencePronunciation(exercise.sentence)
      }
    } catch (error) {
      console.error("Error playing pronunciation:", error)
    } finally {
      setIsPlaying(false)
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
                <h1 className="text-lg font-bold text-gray-900">
                  {language === "bn" ? "দৈনিক অনুশীলন" : "Daily Practice"}
                </h1>
                <p className="text-sm text-gray-600">
                  {language === "bn" ? "আজকের অনুশীলন সেশন" : "Today's Practice Session"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Timer className="w-4 h-4" />
                <span>{formatTime(practiceTime)}</span>
              </div>
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
        {/* Daily Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">{completedExercises.length}/3</div>
                  <div className="text-sm text-gray-600">
                    {language === "bn" ? "সম্পন্ন অনুশীলন" : "Completed Exercises"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Timer className="w-5 h-5 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">{formatTime(practiceTime)}</div>
                  <div className="text-sm text-gray-600">{language === "bn" ? "অনুশীলনের সময়" : "Practice Time"}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold">{score || "--"}</div>
                  <div className="text-sm text-gray-600">{language === "bn" ? "গড় স্কোর" : "Average Score"}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Exercise Progress */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{language === "bn" ? "আজকের অগ্রগতি" : "Today's Progress"}</span>
              <span className="text-sm text-gray-600">{Math.round((completedExercises.length / 3) * 100)}%</span>
            </div>
            <Progress value={(completedExercises.length / 3) * 100} className="h-2" />
          </CardContent>
        </Card>

        {/* Current Exercise */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <span>{language === "bn" ? exercise.title : exercise.titleEn}</span>
                  <Badge
                    variant={
                      exercise.difficulty === "easy"
                        ? "default"
                        : exercise.difficulty === "medium"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {exercise.difficulty === "easy"
                      ? language === "bn"
                        ? "সহজ"
                        : "Easy"
                      : exercise.difficulty === "medium"
                        ? language === "bn"
                          ? "মাঝারি"
                          : "Medium"
                        : language === "bn"
                          ? "কঠিন"
                          : "Hard"}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {language === "bn"
                    ? `অনুশীলন ${currentExercise + 1} / ${dailyPracticeExercises.length}`
                    : `Exercise ${currentExercise + 1} of ${dailyPracticeExercises.length}`}
                </CardDescription>
              </div>
              {completedExercises.includes(exercise.id) && (
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {language === "bn" ? "সম্পন্ন" : "Complete"}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {exercise.type === "pronunciation" && (
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <h3 className="text-3xl font-bold text-blue-600">{exercise.word}</h3>
                  <p className="text-xl text-gray-700">{exercise.bangla}</p>
                  <Button variant="outline" onClick={playPronunciation} disabled={isPlaying}>
                    {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Volume2 className="w-4 h-4 mr-2" />}
                    {language === "bn" ? "উচ্চারণ শুনুন" : "Listen"}
                  </Button>
                </div>
              </div>
            )}

            {exercise.type === "sentence" && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="font-medium text-gray-900 mb-2">{exercise.sentence}</p>
                  <p className="text-gray-600">{exercise.bangla}</p>
                  <Button variant="outline" onClick={playPronunciation} disabled={isPlaying} className="mt-3">
                    {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Volume2 className="w-4 h-4 mr-2" />}
                    {language === "bn" ? "উচ্চারণ শুনুন" : "Listen"}
                  </Button>
                </div>
              </div>
            )}

            {exercise.type === "conversation" && (
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold mb-2">{language === "bn" ? "পরিস্থিতি:" : "Scenario:"}</h4>
                  <p className="font-medium text-gray-900 mb-2">{exercise.prompt}</p>
                  <p className="text-gray-600">{exercise.bangla}</p>
                </div>
              </div>
            )}

            {/* Recording Section */}
            <div className="text-center space-y-4">
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
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">
                  {language === "bn" ? "AI ফিডব্যাক:" : "AI Feedback:"}
                </h4>
                <p className="text-green-700 mb-3">{recordedText}</p>
                {score > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{language === "bn" ? "স্কোর:" : "Score:"}</span>
                      <span className="font-bold">{score}%</span>
                    </div>
                    <Progress value={score} className="h-2" />
                  </div>
                )}
                <Button size="sm" className="mt-3" onClick={completeExercise}>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {language === "bn" ? "অনুশীলন সম্পন্ন" : "Complete Exercise"}
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
                    <div key={recording.id} className="flex items-center justify-between p-3 bg-white rounded border">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium">
                          {language === "bn" ? `চেষ্টা ${index + 1}` : `Attempt ${index + 1}`}
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

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recordings.length >= 2 && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded">
                      <p className="text-sm text-green-700">
                        {language === "bn"
                          ? "চমৎকার! একাধিক চেষ্টা করেছেন। তুলনা করে দেখুন।"
                          : "Great! Multiple attempts made. Compare your progress."}
                      </p>
                    </div>
                  )}

                  {recordings.length >= 3 && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-sm text-yellow-700">
                        {language === "bn"
                          ? "অভিনন্দন! আপনি অনুশীলনে অধ্যবসায়ী।"
                          : "Congratulations! You're persistent in practice."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Practice Tips */}
        <Card className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-3 text-blue-800">
              {language === "bn" ? "অনুশীলনের টিপস:" : "Practice Tips:"}
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start space-x-2">
                <span className="text-blue-500">•</span>
                <span>
                  {language === "bn"
                    ? "প্রথমে মূল উচ্চারণ শুনুন, তারপর রেকর্ড করুন"
                    : "First listen to the original pronunciation, then record"}
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-500">•</span>
                <span>
                  {language === "bn"
                    ? "নিজের রেকর্ডিং শুনে মূল উচ্চারণের সাথে তুলনা করুন"
                    : "Listen to your recording and compare with the original"}
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-500">•</span>
                <span>
                  {language === "bn"
                    ? "বার বার অনুশীলন করুন যতক্ষণ না সন্তুষ্ট হন"
                    : "Practice repeatedly until you're satisfied"}
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            disabled={currentExercise === 0}
            onClick={() => {
              setCurrentExercise((prev) => Math.max(0, prev - 1))
              setRecordedText("")
              setScore(0)
            }}
          >
            {language === "bn" ? "পূর্ববর্তী অনুশীলন" : "Previous Exercise"}
          </Button>

          <Button
            disabled={currentExercise >= dailyPracticeExercises.length - 1}
            onClick={() => {
              setCurrentExercise((prev) => Math.min(dailyPracticeExercises.length - 1, prev + 1))
              setRecordedText("")
              setScore(0)
            }}
          >
            {language === "bn" ? "পরবর্তী অনুশীলন" : "Next Exercise"}
          </Button>
        </div>

        {/* Completion Message */}
        {completedExercises.length === dailyPracticeExercises.length && (
          <Card className="mt-8 bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto" />
                <h3 className="text-xl font-bold text-green-800">
                  {language === "bn" ? "অভিনন্দন!" : "Congratulations!"}
                </h3>
                <p className="text-green-700">
                  {language === "bn"
                    ? "আজকের সব অনুশীলন সম্পন্ন হয়েছে। চমৎকার কাজ!"
                    : "You've completed all today's exercises. Excellent work!"}
                </p>
                <Link href="/">
                  <Button>{language === "bn" ? "হোম পেজে ফিরুন" : "Return to Home"}</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
