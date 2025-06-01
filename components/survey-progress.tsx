"use client"

import { Progress } from "@/components/ui/progress"
import { CheckCircle, Circle } from "lucide-react"
import { surveyCategories } from "@/lib/survey-questions"

interface SurveyProgressProps {
  currentAnswers: Record<string, any>
  currentCategory?: string
}

export function SurveyProgress({ currentAnswers, currentCategory }: SurveyProgressProps) {
  const totalQuestions = surveyCategories.reduce((acc, cat) => acc + cat.questions.length, 0)
  const answeredQuestions = Object.keys(currentAnswers).length
  const overallProgress = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white shadow">
      <h3 className="text-lg font-semibold text-center mb-3">Din Progresjon</h3>
      <Progress value={overallProgress} className="w-full h-3 mb-4" />
      <p className="text-sm text-gray-600 text-center mb-4">
        {answeredQuestions} av {totalQuestions} spørsmål besvart ({Math.round(overallProgress)}%)
      </p>
      <ul className="space-y-2">
        {surveyCategories.map((category) => {
          const categoryQuestions = category.questions.map((q) => q.id)
          const answeredInCategory = categoryQuestions.filter((qId) => currentAnswers[qId] !== undefined).length
          const isCategoryComplete = answeredInCategory === category.questions.length
          const isCurrent = category.id === currentCategory

          return (
            <li key={category.id} className={`flex items-center p-2 rounded ${isCurrent ? "bg-purple-100" : ""}`}>
              {isCategoryComplete ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-gray-300 mr-2 flex-shrink-0" />
              )}
              <span className={`flex-grow ${isCategoryComplete ? "line-through text-gray-500" : "text-gray-700"}`}>
                {category.name}
              </span>
              <span className="text-xs text-gray-500">
                {answeredInCategory}/{category.questions.length}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
