import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Admin Setup</h3>
        <p className="text-blue-700 mb-3">First time setting up? Create your admin account to access the dashboard.</p>
        <div className="space-x-4">
          <Link href="/setup">
            <Button variant="outline" size="sm">
              Initial Setup
            </Button>
          </Link>
          <Link href="/admin">
            <Button variant="outline" size="sm">
              Admin Dashboard
            </Button>
          </Link>
        </div>
      </div>
      <div>
        {/* rest of code here */}
        <p>This is the main page content.</p>
      </div>
    </main>
  )
}
