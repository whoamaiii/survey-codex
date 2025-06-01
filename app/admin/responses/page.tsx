import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Card } from "@/components/ui/card"
import { ResponsesTable } from "@/components/admin/responses-table"
import { ResponsesFilter } from "@/components/admin/responses-filter"

export default async function ResponsesPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const supabase = createServerComponentClient({ cookies })

  // Get categories for filter
  const { data: categories } = await supabase.from("survey_categories").select("id, name, slug").order("name")

  // Build query for responses
  let query = supabase
    .from("survey_responses")
    .select(`
      id,
      created_at,
      response_data,
      survey_categories (
        id,
        name,
        slug
      )
    `)
    .order("created_at", { ascending: false })

  // Apply category filter if provided
  if (searchParams.category) {
    const category = categories?.find((c) => c.slug === searchParams.category)
    if (category) {
      query = query.eq("category_id", category.id)
    }
  }

  const { data: responses } = await query

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Survey Responses</h1>
      </div>

      <ResponsesFilter categories={categories || []} selectedCategory={searchParams.category} />

      <Card>
        <ResponsesTable responses={responses || []} />
      </Card>
    </div>
  )
}
