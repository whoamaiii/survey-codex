"use client"

import { useEffect, useState } from "react"
import { ArrowRight, CheckCircle } from "react-feather"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { CategoryIcon } from "@/components/category-icon"
import { useSurvey } from "@/lib/hooks/use-survey"
import { useToast } from "@/components/ui/use-toast"

export default function SurveyStartPage() {
  const { surveyCategories, getCategoryStatus, isSurveyComplete, firstUnansweredCategory } = useSurvey()
  const [startLink, setStartLink] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    if (firstUnansweredCategory) {
      setStartLink(`/survey/${firstUnansweredCategory.id}`)
    } else {
      setStartLink("/survey/thank-you")
    }
  }, [firstUnansweredCategory])

  useEffect(() => {
    if (isSurveyComplete) {
      toast({
        title: "Fullført!",
        description: "Du har fullført hele undersøkelsen.",
      })
    }
  }, [isSurveyComplete, toast])

  if (!surveyCategories) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-6">Start Undersøkelsen</h1>
      <p className="text-gray-600 mb-8">
        Velkommen! Her kan du starte eller fortsette undersøkelsen. Hver kategori inneholder flere spørsmål.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {surveyCategories.map((category) => {
          const status = getCategoryStatus(category)
          return (
            <Link
              href={`/survey/${category.id}`}
              key={category.id}
              className={`block p-4 border rounded-lg hover:bg-gray-50 transition-colors ${status.isComplete ? "border-green-300 bg-green-50" : "border-gray-300"}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CategoryIcon
                    name={category.icon}
                    className={`h-6 w-6 mr-3 ${status.isComplete ? "text-green-500" : "text-purple-500"}`}
                  />
                  <span
                    className={`font-medium ${status.isComplete ? "text-green-700 line-through" : "text-gray-800"}`}
                  >
                    {category.name}
                  </span>
                </div>
                <div className="flex items-center">
                  {status.isComplete && <CheckCircle className="h-5 w-5 text-green-500 mr-2" />}
                  <span className="text-sm text-gray-500">
                    {status.answeredCount}/{status.totalQuestions}
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {isSurveyComplete ? (
          <Button size="lg" className="w-full bg-green-500 hover:bg-green-600" asChild>
            <Link href="/survey/thank-you">
              Se Takkemelding! <CheckCircle className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        ) : (
          <Button size="lg" className="w-full bg-purple-600 hover:bg-purple-700" asChild>
            <Link href={startLink}>
              {firstUnansweredCategory ? `Start med ${firstUnansweredCategory.name}` : "Fullfør undersøkelsen"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}
