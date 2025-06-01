"use client"

import Link from "next/link"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { surveyCategories, type Question } from "@/lib/survey-questions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { SurveyProgress } from "@/components/survey-progress"
import { ArrowLeft, ArrowRight, Shuffle } from "lucide-react"
import { CategoryIcon } from "@/components/category-icon"

// Helper for rank questions - Draggable list
function RankQuestion({
  question,
  value,
  onChange,
}: { question: Question; value: string[]; onChange: (items: string[]) => void }) {
  const [items, setItems] = useState<string[]>(value || question.rankOptions || [])
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  useEffect(() => {
    setItems(value || question.rankOptions || [])
  }, [value, question.rankOptions])

  const handleDragStart = (item: string) => {
    setDraggedItem(item)
  }

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>, targetItem: string) => {
    e.preventDefault()
    if (!draggedItem || draggedItem === targetItem) return

    const currentIndex = items.indexOf(draggedItem)
    const targetIndex = items.indexOf(targetItem)

    const newItems = [...items]
    newItems.splice(currentIndex, 1)
    newItems.splice(targetIndex, 0, draggedItem)
    setItems(newItems)
    onChange(newItems)
  }

  const handleDrop = () => {
    setDraggedItem(null)
  }

  return (
    // Added id to the ul for the main question label to point to
    <ul id={question.id} className="space-y-2">
      {items.map((item, index) => (
        <li
          key={item}
          draggable
          onDragStart={() => handleDragStart(item)}
          onDragOver={(e) => handleDragOver(e, item)}
          onDrop={handleDrop}
          className="p-3 border rounded-md bg-gray-50 cursor-grab flex items-center"
          // Individual list items are not form fields in the traditional sense for name/id
        >
          <Shuffle className="h-4 w-4 mr-2 text-gray-400" />
          {item}
        </li>
      ))}
    </ul>
  )
}

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const categoryId = params.category as string

  const [currentAnswers, setCurrentAnswers] = useState<Record<string, any>>({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  const category = surveyCategories.find((cat) => cat.id === categoryId)

  useEffect(() => {
    const storedAnswers = localStorage.getItem("surveyAnswers")
    if (storedAnswers) {
      setCurrentAnswers(JSON.parse(storedAnswers))
    }
  }, [])

  useEffect(() => {
    if (Object.keys(currentAnswers).length > 0) {
      localStorage.setItem("surveyAnswers", JSON.stringify(currentAnswers))
    }
  }, [currentAnswers])

  if (!category) {
    return (
      <div>
        Kategori ikke funnet. <Link href="/survey/start">Gå til startsiden.</Link>
      </div>
    )
  }

  const questions = category.questions
  const currentQuestion = questions[currentQuestionIndex]

  const handleAnswerChange = (questionId: string, value: any) => {
    setCurrentAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleCheckboxChange = (questionId: string, optionValue: string, checked: boolean) => {
    setCurrentAnswers((prev) => {
      const currentSelection = prev[questionId] || []
      if (checked) {
        return { ...prev, [questionId]: [...currentSelection, optionValue] }
      } else {
        return { ...prev, [questionId]: currentSelection.filter((val: string) => val !== optionValue) }
      }
    })
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // Go to next category or thank you page
      const currentCategoryIndex = surveyCategories.findIndex((cat) => cat.id === categoryId)
      if (currentCategoryIndex < surveyCategories.length - 1) {
        router.push(`/survey/${surveyCategories[currentCategoryIndex + 1].id}`)
      } else {
        router.push("/survey/thank-you")
      }
    }
  }

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    } else {
      const currentCategoryIndex = surveyCategories.findIndex((cat) => cat.id === categoryId)
      if (currentCategoryIndex > 0) {
        router.push(`/survey/${surveyCategories[currentCategoryIndex - 1].id}`)
      } else {
        router.push("/survey/start")
      }
    }
  }

  const questionProgress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50 p-4 flex flex-col md:flex-row gap-6 justify-center items-start">
      <div className="w-full md:w-1/3 md:sticky top-6">
        <SurveyProgress currentAnswers={currentAnswers} currentCategory={categoryId} />
        <Button variant="outline" onClick={() => router.push("/survey/start")} className="w-full mt-4">
          Tilbake til kategorioversikt
        </Button>
      </div>

      <Card className="w-full md:w-2/3 shadow-xl">
        <CardHeader>
          <div className="flex items-center mb-2">
            <CategoryIcon name={category.icon} className="h-8 w-8 text-purple-600 mr-3" />
            <CardTitle className="text-2xl font-bold text-gray-800">{category.name}</CardTitle>
          </div>
          <CardDescription className="text-gray-600">{category.description}</CardDescription>
          <div className="mt-4">
            <div className="h-2 w-full bg-gray-200 rounded-full">
              <div
                style={{ width: `${questionProgress}%` }}
                className="h-2 bg-purple-500 rounded-full transition-all duration-300 ease-in-out"
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-1 text-right">
              Spørsmål {currentQuestionIndex + 1} av {questions.length}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {currentQuestion && (
            <div className="space-y-6">
              <div>
                <Label htmlFor={currentQuestion.id} className="text-lg font-semibold text-gray-700 block mb-1">
                  {currentQuestion.text}
                </Label>
                {currentQuestion.subText && <p className="text-sm text-gray-500 mb-3">{currentQuestion.subText}</p>}

                {currentQuestion.type === "radio" && currentQuestion.options && (
                  <RadioGroup
                    // Added name attribute for grouping radio buttons
                    name={currentQuestion.id}
                    value={currentAnswers[currentQuestion.id]}
                    onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                    className="space-y-2 mt-2"
                    // The id for the RadioGroup itself can be currentQuestion.id if the Label points to it,
                    // but the Label currently points to the first option or the group as a whole.
                    // For accessibility, the RadioGroup can have an aria-labelledby pointing to the question Label's id.
                    // Let's assume the Label's htmlFor={currentQuestion.id} is for the group.
                    id={currentQuestion.id}
                  >
                    {currentQuestion.options.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2 p-2 border rounded-md hover:bg-gray-50"
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={`${currentQuestion.id}-${option.value}`}
                          // name is handled by RadioGroup
                        />
                        <Label htmlFor={`${currentQuestion.id}-${option.value}`} className="flex-1 cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {currentQuestion.type === "checkbox" && currentQuestion.options && (
                  // The main Label's htmlFor={currentQuestion.id} can point to this div if it has the id.
                  // Or, this div can have role="group" and aria-labelledby={currentQuestion.id}.
                  // For simplicity, we assume the Label is for the group of checkboxes.
                  <div
                    id={currentQuestion.id}
                    role="group"
                    aria-labelledby={`label-${currentQuestion.id}`}
                    className="space-y-2 mt-2"
                  >
                    {/* Re-associating main label for group */}
                    <Label id={`label-${currentQuestion.id}`} className="sr-only">
                      {currentQuestion.text}
                    </Label>
                    {currentQuestion.options.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2 p-2 border rounded-md hover:bg-gray-50"
                      >
                        <Checkbox
                          id={`${currentQuestion.id}-${option.value}`}
                          // Added name attribute for checkboxes, can be an array for submission
                          name={`${currentQuestion.id}[]`}
                          // Or unique name if only one can be selected (but it's checkbox)
                          // name={`${currentQuestion.id}-${option.value}`} // if each checkbox is distinct for server
                          checked={(currentAnswers[currentQuestion.id] || []).includes(option.value)}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(currentQuestion.id, option.value, !!checked)
                          }
                        />
                        <Label htmlFor={`${currentQuestion.id}-${option.value}`} className="flex-1 cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}

                {currentQuestion.type === "textarea" && (
                  <Textarea
                    id={currentQuestion.id} // Label's htmlFor points here
                    name={currentQuestion.id} // Added name attribute
                    value={currentAnswers[currentQuestion.id] || ""}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    placeholder="Ditt svar her..."
                    className="mt-2 min-h-[100px]"
                  />
                )}

                {currentQuestion.type === "yesno" && (
                  <RadioGroup
                    name={currentQuestion.id} // Added name attribute
                    value={currentAnswers[currentQuestion.id]}
                    onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                    className="space-y-2 mt-2 grid grid-cols-2 gap-2"
                    id={currentQuestion.id} // Label's htmlFor points here
                  >
                    <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-gray-50 justify-center">
                      <RadioGroupItem value="yes" id={`${currentQuestion.id}-yes`} />
                      <Label htmlFor={`${currentQuestion.id}-yes`} className="cursor-pointer">
                        Ja
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-gray-50 justify-center">
                      <RadioGroupItem value="no" id={`${currentQuestion.id}-no`} />
                      <Label htmlFor={`${currentQuestion.id}-no`} className="cursor-pointer">
                        Nei
                      </Label>
                    </div>
                  </RadioGroup>
                )}

                {currentQuestion.type === "rank" && currentQuestion.rankOptions && (
                  // RankQuestion component now has id={question.id} on its ul for the Label
                  <RankQuestion
                    question={currentQuestion}
                    value={currentAnswers[currentQuestion.id]}
                    onChange={(items) => handleAnswerChange(currentQuestion.id, items)}
                  />
                )}
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <Button variant="outline" onClick={prevQuestion}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Forrige
                </Button>
                <Button onClick={nextQuestion} className="bg-purple-600 hover:bg-purple-700">
                  {currentQuestionIndex === questions.length - 1 ? "Fullfør Kategori" : "Neste"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
