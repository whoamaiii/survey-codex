"use client"

import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { LogOut, BarChart3, Home } from "lucide-react"
import Link from "next/link"

export function AdminHeader() {
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/admin/login")
  }

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center">
            <Home className="h-5 w-5 mr-2" />
            <span className="text-sm">Back to Site</span>
          </Link>
          <div className="text-xl font-bold flex items-center">
            <BarChart3 className="h-6 w-6 mr-2" />
            <span>Survey Admin</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/admin" className="text-gray-600 hover:text-gray-900">
            Dashboard
          </Link>
          <Link href="/admin/responses" className="text-gray-600 hover:text-gray-900">
            Responses
          </Link>
          <Link href="/admin/analytics" className="text-gray-600 hover:text-gray-900">
            Analytics
          </Link>
        </nav>

        <Button variant="outline" size="sm" onClick={handleSignOut} className="flex items-center">
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </header>
  )
}
