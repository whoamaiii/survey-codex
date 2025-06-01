"use server"

import { createServerSupabaseClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"

export async function setupAdminUser() {
  const supabase = createServerSupabaseClient()

  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    return { error: "Admin email and password must be configured in environment variables" }
  }

  if (adminPassword.length < 8) {
    return { error: "Admin password must be at least 8 characters long" }
  }

  try {
    // Check if admin already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const adminExists = existingUsers.users.some((user) => user.email === adminEmail)

    if (adminExists) {
      redirect("/admin/login")
    }

    // Create the admin user
    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
    })

    if (error) {
      return { error: error.message }
    }

    return { success: true, user: data.user }
  } catch (error) {
    return { error: "Failed to create admin user" }
  }
}
