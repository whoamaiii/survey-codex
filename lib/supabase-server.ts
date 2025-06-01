import { createClient } from "@supabase/supabase-js"
import type { Database } from "./supabase"

// Create a Supabase client for server components
export function createServerSupabaseClient() {
  return createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}
