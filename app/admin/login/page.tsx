import { getServerSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { LoginForm } from "@/components/admin/login-form"

export default async function LoginPage() {
  const session = await getServerSession()

  // If already logged in, redirect to admin dashboard
  if (session) {
    redirect("/admin")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Admin Login</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to access the survey dashboard</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
