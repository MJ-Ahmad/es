"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/es/components/ui/card"
import { Button } from "@/es/components/ui/button"
import { Badge } from "@/es/components/ui/badge"
import { Progress } from "@/es/components/ui/progress"
import { BookOpen, Mic, Users, Trophy, Play, Lock, CheckCircle } from "lucide-react"
import Link from "next/link"

const stages = [
  {
    id: "foundation",
    title: "শব্দভিত্তিক লার্নিং",
    titleEn: "Word-Based Learning",
    description: "মূল শব্দ শিখুন এবং বিভিন্ন বাক্যে প্রয়োগ করুন",
    descriptionEn: "Learn essential words and practice using them in various sentences",
    progress: 85,
    completed: true,
    lessons: 12,
    icon: BookOpen,
    color: "bg-green-500",
  },
  {
    id: "sentence",
    title: "বাক্যভিত্তিক উন্নয়ন",
    titleEn: "Sentence Formation",
    description: "সহজ বাক্য গঠন এবং বাংলা-ইংরেজি মিশ্রণ",
    descriptionEn: "Simple sentence formation and Bengali-English mixing",
    progress: 60,
    completed: false,
    lessons: 15,
    icon: Mic,
    color: "bg-blue-500",
  },
  {
    id: "speaking",
    title: "প্যারাগ্রাফ ও বক্তৃতা",
    titleEn: "Structured Speaking",
    description: "সংক্ষিপ্ত থেকে দীর্ঘ বক্তৃতার দিকে অগ্রসর হওয়া",
    descriptionEn: "Progress from short to longer structured speeches",
    progress: 25,
    completed: false,
    lessons: 18,
    icon: Users,
    color: "bg-orange-500",
  },
  {
    id: "review",
    title: "রিভিউ ও সংশোধন",
    titleEn: "Review & Refinement",
    description: "AI ফিডব্যাক এবং উচ্চারণ বিশ্লেষণ",
    descriptionEn: "AI feedback and pronunciation analysis",
    progress: 0,
    completed: false,
    lessons: 10,
    icon: Trophy,
    color: "bg-purple-500",
  },
  {
    id: "presentation",
    title: "পূর্ণাঙ্গ প্রেজেন্টেশন",
    titleEn: "Final Presentation",
    description: "লাইভ স্পিকিং এবং পাবলিক প্রেজেন্টেশন",
    descriptionEn: "Live speaking and public presentation skills",
    progress: 0,
    completed: false,
    lessons: 8,
    icon: Play,
    color: "bg-red-500",
  },
]

export default function HomePage() {
  const [language, setLanguage] = useState("bn")
  const totalLessons = stages.reduce((acc, stage) => acc + stage.lessons, 0)
  const completedLessons = stages.reduce((acc, stage) => acc + Math.floor((stage.lessons * stage.progress) / 100), 0)
  const overallProgress = Math.round((completedLessons / totalLessons) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {language === "bn" ? "ইংরেজি শিক্ষা প্ল্যাটফর্ম" : "English Learning Platform"}
                </h1>
                <p className="text-sm text-gray-600">
                  {language === "bn" ? "শূন্য থেকে পূর্ণাঙ্গ ইংরেজি স্পিকিং" : "From Zero to Fluent English Speaking"}
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
        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span>{language === "bn" ? "আপনার অগ্রগতি" : "Your Progress"}</span>
            </CardTitle>
            <CardDescription>
              {language === "bn"
                ? `মোট ${totalLessons}টি পাঠের মধ্যে ${completedLessons}টি সম্পন্ন হয়েছে`
                : `${completedLessons} out of ${totalLessons} lessons completed`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{language === "bn" ? "সামগ্রিক অগ্রগতি" : "Overall Progress"}</span>
                <span className="text-sm text-gray-600">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stages.filter((s) => s.completed).length}</div>
                  <div className="text-sm text-gray-600">{language === "bn" ? "সম্পন্ন স্তর" : "Completed Stages"}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{completedLessons}</div>
                  <div className="text-sm text-gray-600">{language === "bn" ? "সম্পন্ন পাঠ" : "Lessons Done"}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">47</div>
                  <div className="text-sm text-gray-600">{language === "bn" ? "অনুশীলন ঘন্টা" : "Practice Hours"}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">92%</div>
                  <div className="text-sm text-gray-600">
                    {language === "bn" ? "উচ্চারণ স্কোর" : "Pronunciation Score"}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Learning Stages */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {language === "bn" ? "শিক্ষার পর্যায়সমূহ" : "Learning Stages"}
          </h2>

          {stages.map((stage, index) => {
            const IconComponent = stage.icon
            const isLocked = index > 0 && !stages[index - 1].completed && stages[index - 1].progress < 80

            return (
              <Card key={stage.id} className={`transition-all hover:shadow-lg ${isLocked ? "opacity-60" : ""}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 ${stage.color} rounded-lg flex items-center justify-center relative`}>
                        {isLocked ? (
                          <Lock className="w-6 h-6 text-white" />
                        ) : stage.completed ? (
                          <CheckCircle className="w-6 h-6 text-white" />
                        ) : (
                          <IconComponent className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{language === "bn" ? stage.title : stage.titleEn}</CardTitle>
                        <CardDescription className="mt-1">
                          {language === "bn" ? stage.description : stage.descriptionEn}
                        </CardDescription>
                        <div className="flex items-center space-x-4 mt-3">
                          <Badge variant="secondary">
                            {stage.lessons} {language === "bn" ? "পাঠ" : "lessons"}
                          </Badge>
                          <Badge variant={stage.completed ? "default" : "outline"}>
                            {stage.progress}% {language === "bn" ? "সম্পন্ন" : "complete"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Link href={`/stage/${stage.id}`}>
                      <Button disabled={isLocked} className="ml-4">
                        {isLocked
                          ? language === "bn"
                            ? "লক করা"
                            : "Locked"
                          : stage.completed
                            ? language === "bn"
                              ? "পুনরায় শুরু"
                              : "Review"
                            : language === "bn"
                              ? "শুরু করুন"
                              : "Start"}
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                {!isLocked && (
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>{language === "bn" ? "অগ্রগতি" : "Progress"}</span>
                        <span>{stage.progress}%</span>
                      </div>
                      <Progress value={stage.progress} className="h-2" />
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>{language === "bn" ? "দ্রুত অ্যাকশন" : "Quick Actions"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/practice">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center space-y-2">
                  <Mic className="w-6 h-6" />
                  <span>{language === "bn" ? "দৈনিক অনুশীলন" : "Daily Practice"}</span>
                </Button>
              </Link>
              <Link href="/live-session">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center space-y-2">
                  <Users className="w-6 h-6" />
                  <span>{language === "bn" ? "লাইভ সেশন" : "Live Session"}</span>
                </Button>
              </Link>
              <Link href="/progress">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center space-y-2">
                  <Trophy className="w-6 h-6" />
                  <span>{language === "bn" ? "অগ্রগতি দেখুন" : "View Progress"}</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
