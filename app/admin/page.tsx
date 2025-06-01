import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardStats } from "@/components/admin/dashboard-stats"
import { RecentResponses } from "@/components/admin/recent-responses"
import { CategoryDistribution } from "@/components/admin/category-distribution"

export default async function AdminDashboard() {
  const supabase = createServerComponentClient({ cookies })

  // Get total response count
  const { count: totalResponses } = await supabase.from("survey_responses").select("*", { count: "exact", head: true })

  // Get category distribution
  const { data: categoryData } = await supabase
    .from("survey_responses")
    .select(`
      category_id,
      survey_categories (
        name,
        slug
      )
    `)
    .order("created_at", { ascending: false })

  // Get recent responses
  const { data: recentResponses } = await supabase
    .from("survey_responses")
    .select(`
      id,
      created_at,
      response_data,
      survey_categories (
        name,
        slug
      )
    `)
    .order("created_at", { ascending: false })
    .limit(5)

  // Process category distribution
  const categoryDistribution =
    categoryData?.reduce(
      (acc, item) => {
        const categoryName = item.survey_categories?.name || "Unknown"
        acc[categoryName] = (acc[categoryName] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    ) || {}

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <DashboardStats totalResponses={totalResponses || 0} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryDistribution data={categoryDistribution} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentResponses responses={recentResponses || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
