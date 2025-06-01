import { Button } from "@/components/ui/button"
import { ShieldAlert } from "lucide-react"
import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8">
        <ShieldAlert className="mx-auto h-16 w-16 text-red-500" />
        <h2 className="text-3xl font-extrabold text-gray-900">Unauthorized Access</h2>
        <p className="text-gray-600">You don't have permission to access this area.</p>
        <div className="pt-4">
          <Link href="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
