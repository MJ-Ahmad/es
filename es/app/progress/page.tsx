"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/es/components/ui/card"
import { Button } from "@/es/components/ui/button"
import { Badge } from "@/es/components/ui/badge"
import { Progress } from "@/es/components/ui/progress"
import { ArrowLeft, Trophy, Calendar, Clock, Target, TrendingUp, Award, BookOpen } from "lucide-react"
import Link from "next/link"

const progressData = {
  overall: {
    totalLessons: 63,
    completedLessons: 38,
    practiceHours: 47,
    pronunciationScore: 92,
    streak: 12,
    level: "Intermediate",
  },
  stages: [
    {
      name: "শব্দভিত্তিক লার্নিং",
      nameEn: "Word-Based Learning",
      progress: 85,
      completed: true,
      timeSpent: 18,
      exercises: 45,
    },
    {
      name: "বাক্যভিত্তিক উন্নয়ন",
      nameEn: "Sentence Formation",
      progress: 60,
      completed: false,
      timeSpent: 12,
      exercises: 28,
    },
    {
      name: "প্যারাগ্রাফ ও বক্তৃতা",
      nameEn: "Structured Speaking",
      progress: 25,
      completed: false,
      timeSpent: 8,
      exercises: 12,
    },
    {
      name: "রিভিউ ও সংশোধন",
      nameEn: "Review & Refinement",
      progress: 10,
      completed: false,
      timeSpent: 4,
      exercises: 5,
    },
    {
      name: "পূর্ণাঙ্গ প্রেজেন্টেশন",
      nameEn: "Final Presentation",
      progress: 0,
      completed: false,
      timeSpent: 0,
      exercises: 0,
    },
  ],
  weeklyData: [
    { day: "সোম", dayEn: "Mon", hours: 2.5, score: 88 },
    { day: "মঙ্গল", dayEn: "Tue", hours: 1.8, score: 92 },
    { day: "বুধ", dayEn: "Wed", hours: 3.2, score: 95 },
    { day: "বৃহ", dayEn: "Thu", hours: 2.1, score: 89 },
    { day: "শুক্র", dayEn: "Fri", hours: 2.8, score: 94 },
    { day: "শনি", dayEn: "Sat", hours: 4.1, score: 96 },
    { day: "রবি", dayEn: "Sun", hours: 3.5, score: 93 },
  ],
  achievements: [
    {
      id: 1,
      title: "১০ দিন ধারাবাহিক অনুশীলন",
      titleEn: "10 Day Streak",
      description: "টানা ১০ দিন অনুশীলন সম্পন্ন",
      icon: "🔥",
      earned: true,
      date: "২০২৪-০১-১৫",
    },
    {
      id: 2,
      title: "প্রথম স্তর সম্পন্ন",
      titleEn: "First Stage Complete",
      description: "শব্দভিত্তিক লার্নিং সম্পন্ন",
      icon: "🎯",
      earned: true,
      date: "২০২৪-০১-২০",
    },
    {
      id: 3,
      title: "উচ্চারণ মাস্টার",
      titleEn: "Pronunciation Master",
      description: "৯০% এর উপরে উচ্চারণ স্কোর",
      icon: "🎤",
      earned: true,
      date: "২০২৪-০১-২৫",
    },
    {
      id: 4,
      title: "৫০ ঘন্টা অনুশীলন",
      titleEn: "50 Hours Practice",
      description: "মোট ৫০ ঘন্টা অনুশীলন",
      icon: "⏰",
      earned: false,
      date: null,
    },
  ],
}

export default function ProgressPage() {
  const [language, setLanguage] = useState("bn")
  const [selectedPeriod, setSelectedPeriod] = useState("week")

  const { overall, stages, weeklyData, achievements } = progressData
  const overallProgress = Math.round((overall.completedLessons / overall.totalLessons) * 100)

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
                <h1 className="text-lg font-bold text-gray-900">
                  {language === "bn" ? "আপনার অগ্রগতি" : "Your Progress"}
                </h1>
                <p className="text-sm text-gray-600">
                  {language === "bn" ? "আপনার শিক্ষার অগ্রগতি ট্র্যাক করুন" : "Track your learning progress"}
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
        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold">{overallProgress}%</div>
                  <div className="text-sm text-gray-600">
                    {language === "bn" ? "সামগ্রিক অগ্রগতি" : "Overall Progress"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">{overall.practiceHours}</div>
                  <div className="text-sm text-gray-600">{language === "bn" ? "অনুশীলন ঘন্টা" : "Practice Hours"}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">{overall.pronunciationScore}%</div>
                  <div className="text-sm text-gray-600">
                    {language === "bn" ? "উচ্চারণ স্কোর" : "Pronunciation Score"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                <div>
                  <div className="text-2xl font-bold">{overall.streak}</div>
                  <div className="text-sm text-gray-600">{language === "bn" ? "দিন ধারাবাহিক" : "Day Streak"}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stage Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>{language === "bn" ? "স্তরভিত্তিক অগ্রগতি" : "Stage-wise Progress"}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {stages.map((stage, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold">{language === "bn" ? stage.name : stage.nameEn}</h3>
                      {stage.completed && (
                        <Badge variant="default" className="bg-green-500">
                          {language === "bn" ? "সম্পন্ন" : "Complete"}
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm font-medium">{stage.progress}%</span>
                  </div>
                  <Progress value={stage.progress} className="h-2" />
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>
                      {language === "bn" ? `${stage.timeSpent} ঘন্টা অনুশীলন` : `${stage.timeSpent} hours practiced`}
                    </span>
                    <span>
                      {language === "bn" ? `${stage.exercises} অনুশীলন সম্পন্ন` : `${stage.exercises} exercises completed`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Progress Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>{language === "bn" ? "সাপ্তাহিক অগ্রগতি" : "Weekly Progress"}</span>
            </CardTitle>
            <CardDescription>
              {language === "bn" ? "গত সপ্তাহের অনুশীলনের সময় এবং স্কোর" : "Practice time and scores for the past week"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Practice Hours Chart */}
              <div>
                <h4 className="font-medium mb-3">
                  {language === "bn" ? "দৈনিক অনুশীলনের সময় (ঘন্টা)" : "Daily Practice Time (Hours)"}
                </h4>
                <div className="flex items-end space-x-2 h-32">
                  {weeklyData.map((day, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-blue-200 rounded-t" style={{ height: `${(day.hours / 4) * 100}%` }}>
                        <div
                          className="w-full bg-blue-500 rounded-t transition-all"
                          style={{ height: `${Math.min(day.hours / 4, 1) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs mt-2 text-gray-600">{language === "bn" ? day.day : day.dayEn}</span>
                      <span className="text-xs text-gray-500">{day.hours}h</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Score Chart */}
              <div>
                <h4 className="font-medium mb-3">
                  {language === "bn" ? "দৈনিক উচ্চারণ স্কোর (%)" : "Daily Pronunciation Score (%)"}
                </h4>
                <div className="flex items-end space-x-2 h-32">
                  {weeklyData.map((day, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-green-200 rounded-t" style={{ height: "100%" }}>
                        <div
                          className="w-full bg-green-500 rounded-t transition-all"
                          style={{ height: `${day.score}%` }}
                        />
                      </div>
                      <span className="text-xs mt-2 text-gray-600">{language === "bn" ? day.day : day.dayEn}</span>
                      <span className="text-xs text-gray-500">{day.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>{language === "bn" ? "অর্জনসমূহ" : "Achievements"}</span>
            </CardTitle>
            <CardDescription>
              {language === "bn" ? "আপনার অর্জিত ব্যাজ এবং পুরস্কার" : "Your earned badges and rewards"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 border rounded-lg transition-all ${
                    achievement.earned ? "bg-yellow-50 border-yellow-200" : "bg-gray-50 border-gray-200 opacity-60"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{language === "bn" ? achievement.title : achievement.titleEn}</h4>
                      <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                      {achievement.earned && achievement.date && (
                        <p className="text-xs text-yellow-600 mt-2">
                          {language === "bn" ? "অর্জিত:" : "Earned:"} {achievement.date}
                        </p>
                      )}
                      {!achievement.earned && (
                        <Badge variant="outline" className="mt-2">
                          {language === "bn" ? "অর্জনের অপেক্ষায়" : "In Progress"}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
