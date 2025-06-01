"use client"

import { useState, useEffect } from "react"
import { surveyCategories, type SurveyCategory } from "@/lib/survey-questions"

interface CategoryStatus {
  isComplete: boolean
  answeredCount: number
  totalQuestions: number
}

interface UseSurveyResult {
  surveyCategories: SurveyCategory[]
  getCategoryStatus: (category: SurveyCategory) => CategoryStatus
  isSurveyComplete: boolean
  firstUnansweredCategory: SurveyCategory | undefined
  submitSurvey: (categorySlug: string, answers: Record<string, any>) => Promise<void>
  isSubmitting: boolean
}

export const useSurvey = (): UseSurveyResult => {
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const storedAnswers = localStorage.getItem("surveyAnswers")
    if (storedAnswers) {
      setAnswers(JSON.parse(storedAnswers))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("surveyAnswers", JSON.stringify(answers))
  }, [answers])

  const getCategoryStatus = (category: SurveyCategory): CategoryStatus => {
    const categoryQuestions = category.questions.map((q) => q.id)
    const answeredCount = categoryQuestions.filter((qId) => answers[qId] !== undefined).length
    const isComplete = answeredCount === category.questions.length

    return {
      isComplete,
      answeredCount,
      totalQuestions: category.questions.length,
    }
  }

  const submitSurvey = async (categorySlug: string, categoryAnswers: Record<string, any>) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers: categoryAnswers,
          categorySlug,
          userId: null, // You can add user authentication later
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit survey")
      }

      // Update local storage with submitted answers
      setAnswers((prev) => ({ ...prev, ...categoryAnswers }))
    } catch (error) {
      console.error("Error submitting survey:", error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  const isSurveyComplete = surveyCategories.every((category) => getCategoryStatus(category).isComplete)

  const firstUnansweredCategory = surveyCategories.find((category) => !getCategoryStatus(category).isComplete)

  return {
    surveyCategories,
    getCategoryStatus,
    isSurveyComplete,
    firstUnansweredCategory,
    submitSurvey,
    isSubmitting,
  }
}
