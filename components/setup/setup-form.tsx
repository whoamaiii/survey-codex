"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { setupAdminUser } from "@/app/setup/actions"
import { CheckCircleIcon, UserPlusIcon } from "lucide-react"

export function SetupForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSetup = async () => {
    setIsLoading(true)
    setError("")

    try {
      const result = await setupAdminUser()

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push("/admin/login")
        }, 2000)
      }
    } catch (err) {
      setError("An unexpected error occurred during setup")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
        <div>
          <h3 className="text-lg font-medium text-gray-900">Setup Complete!</h3>
          <p className="text-sm text-gray-600">Admin account created successfully. Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <UserPlusIcon className="h-5 w-5 text-blue-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Admin Account Details</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                <strong>Email:</strong> {process.env.NEXT_PUBLIC_ADMIN_EMAIL || "Configured via environment"}
              </p>
              <p>
                <strong>Password:</strong> Set via ADMIN_PASSWORD environment variable
              </p>
            </div>
          </div>
        </div>
      </div>

      <Button onClick={handleSetup} className="w-full" disabled={isLoading}>
        {isLoading ? "Creating Admin Account..." : "Create Admin Account"}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        This will create an admin user with the email and password configured in your environment variables.
      </p>
    </div>
  )
}
