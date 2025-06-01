import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SetupForm } from "@/components/admin/setup-form"

export default async function SetupPage() {
  const supabase = createServerComponentClient({ cookies })

  // Check if admin user already exists
  const {
    data: { users },
  } = await supabase.auth.admin.listUsers()
  const adminEmail = process.env.ADMIN_EMAIL

  const adminExists = users?.some((user) => user.email === adminEmail)

  if (adminExists) {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Admin Setup</h2>
          <p className="mt-2 text-sm text-gray-600">Create your admin account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Admin Account</CardTitle>
            <CardDescription>This will create an admin user with the configured email and password</CardDescription>
          </CardHeader>
          <CardContent>
            <SetupForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
