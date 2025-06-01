import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function getServerSession() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}

export async function requireAuth() {
  const session = await getServerSession()

  if (!session) {
    redirect("/admin/login")
  }

  // Check if user is admin
  if (session.user.email !== process.env.ADMIN_EMAIL) {
    redirect("/admin/unauthorized")
  }

  return session
}

export async function signInWithPassword(email: string, password: string) {
  const supabase = createClientComponentClient()

  // Check if this is the admin email
  if (email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return { error: { message: "Unauthorized access" } }
  }

  return await supabase.auth.signInWithPassword({
    email,
    password,
  })
}

export async function signOut() {
  const supabase = createClientComponentClient()
  return await supabase.auth.signOut()
}
