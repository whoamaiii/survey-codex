"use client"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download } from "lucide-react"

export default async function ResponseDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerComponentClient({ cookies })

  const { data: response } = await supabase
    .from("survey_responses")
    .select(`
      id,
      created_at,
      response_data,
      survey_categories (
        id,
        name,
        slug
      )
    `)
    .eq("id", params.id)
    .single()

  if (!response) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/responses">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Responses
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Response Details</h1>
        </div>

        <Button variant="outline" size="sm" onClick={() => {}} className="hidden md:flex">
          <Download className="h-4 w-4 mr-2" />
          Export JSON
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Response Information</CardTitle>
            <Badge variant="outline">{response.survey_categories?.name || "Unknown Category"}</Badge>
          </div>
          <div className="text-sm text-gray-500">
            Submitted {formatDistanceToNow(new Date(response.created_at), { addSuffix: true })}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(response.response_data).map(([key, value]) => (
              <div key={key} className="border-b pb-2">
                <div className="font-medium">{key}</div>
                <div className="mt-1">{typeof value === "object" ? JSON.stringify(value) : String(value)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
