"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Download } from "lucide-react"

interface ResponsesTableProps {
  responses: any[]
}

export function ResponsesTable({ responses }: ResponsesTableProps) {
  const [sortColumn, setSortColumn] = useState<string>("created_at")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const sortedResponses = [...responses].sort((a, b) => {
    if (sortColumn === "created_at") {
      return sortDirection === "asc"
        ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }

    if (sortColumn === "category") {
      const categoryA = a.survey_categories?.name || ""
      const categoryB = b.survey_categories?.name || ""
      return sortDirection === "asc" ? categoryA.localeCompare(categoryB) : categoryB.localeCompare(categoryA)
    }

    if (sortColumn === "answers") {
      const answersA = Object.keys(a.response_data).length
      const answersB = Object.keys(b.response_data).length
      return sortDirection === "asc" ? answersA - answersB : answersB - answersA
    }

    return 0
  })

  const exportResponse = (response: any) => {
    const dataStr = JSON.stringify(response.response_data, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    const exportFileDefaultName = `survey-response-${response.id}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  if (responses.length === 0) {
    return <div className="text-center py-8 text-gray-500">No responses found</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="cursor-pointer" onClick={() => handleSort("created_at")}>
            Date
            {sortColumn === "created_at" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => handleSort("category")}>
            Category
            {sortColumn === "category" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => handleSort("answers")}>
            Answers
            {sortColumn === "answers" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
          </TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedResponses.map((response) => (
          <TableRow key={response.id}>
            <TableCell className="font-medium">
              {formatDistanceToNow(new Date(response.created_at), { addSuffix: true })}
            </TableCell>
            <TableCell>
              <Badge variant="outline">{response.survey_categories?.name || "Unknown"}</Badge>
            </TableCell>
            <TableCell>{Object.keys(response.response_data).length} answers</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => exportResponse(response)}>
                  <Download className="h-4 w-4" />
                </Button>
                <Link href={`/admin/responses/${response.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
