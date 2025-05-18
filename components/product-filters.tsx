"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Slider } from "@/components/ui/slider"
import type { Database } from "@/lib/supabase/types"

type Category = Database["public"]["Tables"]["categories"]["Row"]

interface ProductFiltersProps {
  categories: Category[]
  minPrice: number
  maxPrice: number
}

export function ProductFilters({ categories, minPrice, maxPrice }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get("category") || null)
  const [sort, setSort] = useState<string>(searchParams.get("sort") || "newest")

  // Group categories by parent
  const parentCategories = categories.filter((c) => !c.parent_id)
  const childCategories = categories.filter((c) => c.parent_id)

  const getCategoryChildren = (parentId: string) => {
    return childCategories.filter((c) => c.parent_id === parentId)
  }

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return "All Categories"
    const category = categories.find((c) => c.id === categoryId)
    return category ? category.name : "All Categories"
  }

  const getSortLabel = (sortValue: string) => {
    switch (sortValue) {
      case "newest":
        return "Newest"
      case "price-asc":
        return "Price: Low to High"
      case "price-desc":
        return "Price: High to Low"
      case "popular":
        return "Most Popular"
      default:
        return "Newest"
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())

    if (selectedCategory) {
      params.set("category", selectedCategory)
    } else {
      params.delete("category")
    }

    params.set("min_price", priceRange[0].toString())
    params.set("max_price", priceRange[1].toString())
    params.set("sort", sort)

    router.push(`/shop?${params.toString()}`)
  }, [selectedCategory, priceRange, sort, router, searchParams])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex justify-between w-40">
              <span className="truncate">{getCategoryName(selectedCategory)}</span>
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setSelectedCategory(null)}>
                <span className="flex-1">All Categories</span>
                {!selectedCategory && <Check className="h-4 w-4 ml-2" />}
              </DropdownMenuItem>

              {parentCategories.map((category) => (
                <DropdownMenuGroup key={category.id}>
                  <DropdownMenuItem onClick={() => setSelectedCategory(category.id)}>
                    <span className="flex-1">{category.name}</span>
                    {selectedCategory === category.id && <Check className="h-4 w-4 ml-2" />}
                  </DropdownMenuItem>

                  {getCategoryChildren(category.id).map((child) => (
                    <DropdownMenuItem key={child.id} onClick={() => setSelectedCategory(child.id)} className="pl-6">
                      <span className="flex-1">{child.name}</span>
                      {selectedCategory === child.id && <Check className="h-4 w-4 ml-2" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex justify-between w-40">
              <span>Sort: {getSortLabel(sort)}</span>
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSort("newest")}>
              <span className="flex-1">Newest</span>
              {sort === "newest" && <Check className="h-4 w-4 ml-2" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSort("price-asc")}>
              <span className="flex-1">Price: Low to High</span>
              {sort === "price-asc" && <Check className="h-4 w-4 ml-2" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSort("price-desc")}>
              <span className="flex-1">Price: High to Low</span>
              {sort === "price-desc" && <Check className="h-4 w-4 ml-2" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSort("popular")}>
              <span className="flex-1">Most Popular</span>
              {sort === "popular" && <Check className="h-4 w-4 ml-2" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm">Price Range</span>
          <span className="text-sm font-medium">
            ${priceRange[0]} - ${priceRange[1]}
          </span>
        </div>
        <Slider
          defaultValue={[minPrice, maxPrice]}
          min={minPrice}
          max={maxPrice}
          step={1}
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          className="py-4"
        />
      </div>
    </div>
  )
}
