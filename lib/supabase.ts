import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email?: string
  created_at: string
  updated_at: string
}

export interface SurveyCategory {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  created_at: string
  updated_at: string
}

export interface SurveyResponse {
  id: string
  user_id?: string
  category_id: string
  response_data: Record<string, any>
  completed: boolean
  created_at: string
  updated_at: string
}
