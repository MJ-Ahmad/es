"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/es/components/ui/card"
import { Button } from "@/es/components/ui/button"
import { Badge } from "@/es/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/es/components/ui/avatar"
import { Users, Mic, MicOff, Video, VideoOff, ArrowLeft, Clock, MessageCircle, Calendar, Globe } from "lucide-react"
import Link from "next/link"

const liveSessions = [
  {
    id: 1,
    title: "বেসিক কথোপকথন",
    titleEn: "Basic Conversations",
    time: "10:00 AM - 11:00 AM",
    participants: 12,
    maxParticipants: 15,
    level: "Beginner",
    instructor: "রহিম স্যার",
    instructorEn: "Mr. Rahim",
    status: "live",
    duration: "60 min",
  },
  {
    id: 2,
    title: "উচ্চারণ ওয়ার্কশপ",
    titleEn: "Pronunciation Workshop",
    time: "2:00 PM - 3:00 PM",
    participants: 8,
    maxParticipants: 12,
    level: "Intermediate",
    instructor: "ফাতিমা ম্যাম",
    instructorEn: "Ms. Fatima",
    status: "upcoming",
    duration: "60 min",
  },
  {
    id: 3,
    title: "পাবলিক স্পিকিং",
    titleEn: "Public Speaking",
    time: "7:00 PM - 8:30 PM",
    participants: 5,
    maxParticipants: 10,
    level: "Advanced",
    instructor: "করিম স্যার",
    instructorEn: "Mr. Karim",
    status: "upcoming",
    duration: "90 min",
  },
]

const mockParticipants = [
  { id: 1, name: "রহিম", nameEn: "Rahim", avatar: "/placeholder.svg?height=32&width=32", speaking: false },
  { id: 2, name: "ফাতিমা", nameEn: "Fatima", avatar: "/placeholder.svg?height=32&width=32", speaking: true },
  { id: 3, name: "করিম", nameEn: "Karim", avatar: "/placeholder.svg?height=32&width=32", speaking: false },
  { id: 4, name: "আয়েশা", nameEn: "Ayesha", avatar: "/placeholder.svg?height=32&width=32", speaking: false },
  { id: 5, name: "হাসান", nameEn: "Hasan", avatar: "/placeholder.svg?height=32&width=32", speaking: false },
]

export default function LiveSessionPage() {
  const [language, setLanguage] = useState("bn")
  const [selectedSession, setSelectedSession] = useState<number | null>(null)
  const [isJoined, setIsJoined] = useState(false)
  const [micEnabled, setMicEnabled] = useState(false)
  const [videoEnabled, setVideoEnabled] = useState(false)
  const [sessionTime, setSessionTime] = useState(0)

  useEffect(() => {
    if (isJoined) {
      const timer = setInterval(() => {
        setSessionTime((prev) => prev + 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isJoined])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const joinSession = (sessionId: number) => {
    setSelectedSession(sessionId)
    setIsJoined(true)
  }

  const leaveSession = () => {
    setIsJoined(false)
    setSelectedSession(null)
    setSessionTime(0)
    setMicEnabled(false)
    setVideoEnabled(false)
  }

  if (isJoined && selectedSession) {
    const session = liveSessions.find((s) => s.id === selectedSession)!

    return (
      <div className="min-h-screen bg-gray-900">
        {/* Session Header */}
        <header className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <h1 className="text-lg font-bold text-white">
                    {language === "bn" ? session.title : session.titleEn}
                  </h1>
                  <p className="text-sm text-gray-300">
                    {language === "bn" ? session.instructor : session.instructorEn} • {formatTime(sessionTime)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="secondary" className="bg-red-500 text-white">
                  <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                  LIVE
                </Badge>
                <Button variant="destructive" onClick={leaveSession}>
                  {language === "bn" ? "সেশন ছেড়ে দিন" : "Leave Session"}
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex h-[calc(100vh-80px)]">
          {/* Main Video Area */}
          <div className="flex-1 p-6">
            <div className="bg-gray-800 rounded-lg h-full flex items-center justify-center relative">
              <div className="text-center">
                <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300">{language === "bn" ? "ভিডিও এলাকা" : "Video Area"}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {language === "bn"
                    ? "শিক্ষক এবং অংশগ্রহণকারীদের ভিডিও এখানে দেখা যাবে"
                    : "Instructor and participant videos will appear here"}
                </p>
              </div>

              {/* Controls */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                <div className="flex items-center space-x-4 bg-gray-700 px-6 py-3 rounded-full">
                  <Button
                    variant={micEnabled ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setMicEnabled(!micEnabled)}
                    className="rounded-full w-12 h-12"
                  >
                    {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </Button>
                  <Button
                    variant={videoEnabled ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setVideoEnabled(!videoEnabled)}
                    className="rounded-full w-12 h-12"
                  >
                    {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 bg-gray-800 border-l border-gray-700">
            <div className="p-4 border-b border-gray-700">
              <h3 className="font-semibold text-white mb-2">
                {language === "bn" ? "অংশগ্রহণকারীরা" : "Participants"} ({mockParticipants.length})
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {mockParticipants.map((participant) => (
                <div key={participant.id} className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={participant.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{participant.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">
                      {language === "bn" ? participant.name : participant.nameEn}
                    </p>
                  </div>
                  {participant.speaking && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {language === "bn" ? "ফিরে যান" : "Back"}
                </Button>
              </Link>
              <div>
                <h1 className="text-lg font-bold text-gray-900">{language === "bn" ? "লাইভ সেশন" : "Live Sessions"}</h1>
                <p className="text-sm text-gray-600">
                  {language === "bn" ? "শিক্ষকদের সাথে সরাসরি অনুশীলন করুন" : "Practice directly with instructors"}
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

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Today's Schedule */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>{language === "bn" ? "আজকের সময়সূচী" : "Today's Schedule"}</span>
            </CardTitle>
            <CardDescription>
              {language === "bn"
                ? "আজকের লাইভ সেশনগুলিতে যোগ দিন এবং অন্যদের সাথে অনুশীলন করুন"
                : "Join today's live sessions and practice with others"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {liveSessions.map((session) => (
                <div
                  key={session.id}
                  className={`p-4 border rounded-lg transition-all ${
                    session.status === "live"
                      ? "bg-red-50 border-red-200"
                      : "bg-gray-50 border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-lg">{language === "bn" ? session.title : session.titleEn}</h3>
                        <Badge variant={session.status === "live" ? "destructive" : "secondary"}>
                          {session.status === "live"
                            ? language === "bn"
                              ? "লাইভ"
                              : "LIVE"
                            : language === "bn"
                              ? "আসছে"
                              : "Upcoming"}
                        </Badge>
                        <Badge variant="outline">
                          {session.level === "Beginner"
                            ? language === "bn"
                              ? "নতুন"
                              : "Beginner"
                            : session.level === "Intermediate"
                              ? language === "bn"
                                ? "মাঝারি"
                                : "Intermediate"
                              : language === "bn"
                                ? "উন্নত"
                                : "Advanced"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{session.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>
                            {session.participants}/{session.maxParticipants} {language === "bn" ? "জন" : "people"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4" />
                          <span>{language === "bn" ? session.instructor : session.instructorEn}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MessageCircle className="w-4 h-4" />
                          <span>{session.duration}</span>
                        </div>
                      </div>
                    </div>

                    <div className="ml-4">
                      {session.status === "live" ? (
                        <Button onClick={() => joinSession(session.id)} className="bg-red-500 hover:bg-red-600">
                          {language === "bn" ? "এখনই যোগ দিন" : "Join Now"}
                        </Button>
                      ) : (
                        <Button variant="outline" disabled={session.participants >= session.maxParticipants}>
                          {session.participants >= session.maxParticipants
                            ? language === "bn"
                              ? "পূর্ণ"
                              : "Full"
                            : language === "bn"
                              ? "রিমাইন্ডার সেট করুন"
                              : "Set Reminder"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* How to Join */}
        <Card>
          <CardHeader>
            <CardTitle>{language === "bn" ? "কীভাবে যোগ দিবেন?" : "How to Join?"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-semibold">{language === "bn" ? "সেশন নির্বাচন" : "Choose Session"}</h3>
                <p className="text-sm text-gray-600">
                  {language === "bn"
                    ? "আপনার স্তর অনুযায়ী উপযুক্ত সেশন বেছে নিন"
                    : "Select the appropriate session for your level"}
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-green-600">2</span>
                </div>
                <h3 className="font-semibold">{language === "bn" ? "মাইক্রোফোন পরীক্ষা" : "Test Microphone"}</h3>
                <p className="text-sm text-gray-600">
                  {language === "bn" ? "যোগ দেওয়ার আগে আপনার মাইক্রোফোন পরীক্ষা করুন" : "Test your microphone before joining"}
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="font-semibold">{language === "bn" ? "অনুশীলন শুরু" : "Start Practicing"}</h3>
                <p className="text-sm text-gray-600">
                  {language === "bn"
                    ? "শিক্ষক এবং অন্যান্য শিক্ষার্থীদের সাথে অনুশীলন করুন"
                    : "Practice with instructor and other students"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
