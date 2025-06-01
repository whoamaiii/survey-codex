import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

interface RecentResponsesProps {
  responses: any[]
}

export function RecentResponses({ responses }: RecentResponsesProps) {
  if (responses.length === 0) {
    return <div className="text-center py-8 text-gray-500">No responses yet</div>
  }

  return (
    <div className="space-y-4">
      {responses.map((response) => (
        <div key={response.id} className="border rounded-md p-4">
          <div className="flex justify-between items-start">
            <div>
              <Badge variant="outline">{response.survey_categories?.name || "Unknown Category"}</Badge>
              <div className="mt-2 text-sm text-gray-500">
                {formatDistanceToNow(new Date(response.created_at), { addSuffix: true })}
              </div>
            </div>
            <Link href={`/admin/responses/${response.id}`}>
              <Button variant="ghost" size="sm">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="mt-2 text-sm">{Object.keys(response.response_data).length} answers</div>
        </div>
      ))}

      <div className="text-center pt-2">
        <Link href="/admin/responses">
          <Button variant="outline" size="sm">
            View All Responses
          </Button>
        </Link>
      </div>
    </div>
  )
}
