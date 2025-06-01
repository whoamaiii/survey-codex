"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export function SetupForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSetup = async () => {
    setIsLoading(true)
    setError("")

    try {
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
      const adminPassword = process.env.ADMIN_PASSWORD

      if (!adminEmail || !adminPassword) {
        setError("Admin email and password must be configured in environment variables")
        return
      }

      // Create admin user
      const { error } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
      })

      if (error) {
        setError(error.message)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/admin/login")
      }, 2000)
    } catch (err) {
      setError("Failed to create admin user")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success ? (
        <Alert>
          <AlertDescription>Admin user created successfully! Redirecting to login...</AlertDescription>
        </Alert>
      ) : (
        <>
          <div className="text-sm">
            <p>
              Email: <strong>{process.env.NEXT_PUBLIC_ADMIN_EMAIL}</strong>
            </p>
            <p>
              Password: <em>Set via ADMIN_PASSWORD environment variable</em>
            </p>
          </div>

          <Button onClick={handleSetup} className="w-full" disabled={isLoading}>
            {isLoading ? "Creating Admin User..." : "Create Admin User"}
          </Button>
        </>
      )}
    </div>
  )
}
