import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { answers, categorySlug, userId } = await request.json()

    // Get category ID from slug
    const { data: category, error: categoryError } = await supabase
      .from("survey_categories")
      .select("id")
      .eq("slug", categorySlug)
      .single()

    if (categoryError || !category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    // Save survey response
    const { data, error } = await supabase
      .from("survey_responses")
      .insert({
        user_id: userId || null,
        category_id: category.id,
        response_data: answers,
        completed: true,
      })
      .select()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to save survey response" }, { status: 500 })
    }

    console.log("Survey response saved:", data)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Failed to submit survey" }, { status: 500 })
  }
}
