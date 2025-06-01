"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PartyPopper, Heart } from "lucide-react"
import Confetti from "react-confetti"
import { useState, useEffect } from "react"

export default function ThankYouPage() {
  const [showConfetti, setShowConfetti] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    setShowConfetti(true)
    setWindowSize({ width: window.innerWidth, height: window.innerHeight })

    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }
    window.addEventListener("resize", handleResize)

    // Optional: Clear answers from localStorage
    // localStorage.removeItem("surveyAnswers");

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      {showConfetti && (
        <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={300} />
      )}
      <Card className="w-full max-w-md text-center shadow-xl">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <PartyPopper className="h-16 w-16 text-yellow-500" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-800">Tusen Takk!</CardTitle>
          <CardDescription className="text-lg text-gray-600 mt-2">Du er helt fantastisk! ❤️</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-700">
            Svarene dine er gull verdt og hjelper meg masse med å lage den perfekte 6-måneders gaven til deg. Gleder meg
            til å vise deg!
          </p>
          <Heart className="h-12 w-12 text-pink-500 mx-auto animate-pulse" />
          <Link href="/survey/start" passHref legacyBehavior>
            <Button variant="outline" className="w-full">
              Se svarene mine (eller start på nytt)
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
