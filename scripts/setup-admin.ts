// Run this script to create the admin user
// Usage: npx tsx scripts/setup-admin.ts

import { createAdminUser } from "../lib/auth"
import { AUTH_CONFIG } from "../lib/auth-config"

async function setupAdmin() {
  const email = AUTH_CONFIG.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!password) {
    console.error("Please set ADMIN_PASSWORD environment variable")
    process.exit(1)
  }

  if (password.length < 8) {
    console.error("Password must be at least 8 characters long")
    process.exit(1)
  }

  console.log(`Creating admin user: ${email}`)

  const { data, error } = await createAdminUser(email, password)

  if (error) {
    console.error("Error creating admin user:", error.message)
    process.exit(1)
  }

  console.log("Admin user created successfully!")
  console.log("You can now sign in at /admin/login")
}

setupAdmin()
