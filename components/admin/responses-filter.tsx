"use client"

import { useRouter, usePathname } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { FilterX } from "lucide-react"

interface ResponsesFilterProps {
  categories: { id: string; name: string; slug: string }[]
  selectedCategory?: string
}

export function ResponsesFilter({ categories, selectedCategory }: ResponsesFilterProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleCategoryChange = (value: string) => {
    router.push(`${pathname}?category=${value}`)
  }

  const clearFilters = () => {
    router.push(pathname)
  }

  return (
    <div className="flex items-center gap-4">
      <div className="w-[250px]">
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.slug}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedCategory && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <FilterX className="h-4 w-4 mr-2" />
          Clear filters
        </Button>
      )}
    </div>
  )
}
