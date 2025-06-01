"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Skeleton } from "@/components/ui/skeleton"

interface ResponsesChartProps {
  categories: {
    id: string
    name: string
    slug: string
  }[]
}

interface CategoryCount {
  category: string
  count: number
}

export function ResponsesChart({ categories }: ResponsesChartProps) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<CategoryCount[]>([])

  useEffect(() => {
    async function fetchCategoryCounts() {
      setLoading(true)
      try {
        const { data, error } = await supabase.from("survey_responses").select(`
            category_id,
            category:category_id(name)
          `)

        if (error) throw error

        // Count responses by category
        const counts: Record<string, number> = {}
        data?.forEach((item) => {
          const categoryName = item.category?.name || "Unknown"
          counts[categoryName] = (counts[categoryName] || 0) + 1
        })

        // Format for chart
        const chartData = Object.entries(counts).map(([category, count]) => ({
          category,
          count,
        }))

        setData(chartData)
      } catch (error) {
        console.error("Error fetching category counts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryCounts()
  }, [])

  if (loading) {
    return <Skeleton className="h-full w-full" />
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No response data available</p>
      </div>
    )
  }

  // Calculate max value for scaling
  const maxCount = Math.max(...data.map((d) => d.count))

  return (
    <div className="h-full flex items-end gap-2">
      {data.map((item) => (
        <div key={item.category} className="flex flex-col items-center">
          <div
            className="bg-primary w-12 rounded-t-md"
            style={{
              height: `${(item.count / maxCount) * 100}%`,
              minHeight: "20px",
            }}
          />
          <p className="text-xs mt-2 max-w-[80px] truncate" title={item.category}>
            {item.category}
          </p>
          <p className="text-xs font-medium">{item.count}</p>
        </div>
      ))}
    </div>
  )
}
