"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResponsesTable } from "@/components/admin/responses-table"
import { ResponsesChart } from "@/components/admin/responses-chart"
import { useState } from "react"

interface DashboardTabsProps {
  categories: {
    id: string
    name: string
    slug: string
  }[]
}

export function DashboardTabs({ categories }: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="responses">All Responses</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <h2 className="text-xl font-semibold">Survey Overview</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Response Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsesChart categories={categories} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between">
                    <span>{category.name}</span>
                    <span className="text-muted-foreground text-sm">0 responses</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="responses">
        <ResponsesTable />
      </TabsContent>

      <TabsContent value="analytics">
        <h2 className="text-xl font-semibold mb-4">Response Analytics</h2>
        <p>Coming soon: Advanced analytics and insights from survey responses.</p>
      </TabsContent>
    </Tabs>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
