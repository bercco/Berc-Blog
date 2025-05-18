"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, Download, RefreshCw } from "lucide-react"

export function AdminSalesChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    // Set canvas dimensions
    const width = canvasRef.current.width
    const height = canvasRef.current.height

    // Sample data for the last 12 months
    const data = [
      { month: "May", sales: 5200 },
      { month: "Jun", sales: 5800 },
      { month: "Jul", sales: 6400 },
      { month: "Aug", sales: 7200 },
      { month: "Sep", sales: 6800 },
      { month: "Oct", sales: 7500 },
      { month: "Nov", sales: 8200 },
      { month: "Dec", sales: 9800 },
      { month: "Jan", sales: 8500 },
      { month: "Feb", sales: 9200 },
      { month: "Mar", sales: 10500 },
      { month: "Apr", sales: 12000 },
    ]

    // Find max value for scaling
    const maxSales = Math.max(...data.map((d) => d.sales))

    // Chart settings
    const padding = 40
    const barWidth = (width - padding * 2) / data.length - 10
    const barSpacing = 10

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = "#4B5563" // gray-600
    ctx.lineWidth = 1

    // X-axis
    ctx.moveTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)

    // Y-axis
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.stroke()

    // Draw bars
    data.forEach((item, index) => {
      const x = padding + index * (barWidth + barSpacing)
      const barHeight = ((height - padding * 2) * item.sales) / maxSales
      const y = height - padding - barHeight

      // Create gradient for bar
      const gradient = ctx.createLinearGradient(0, y, 0, height - padding)
      gradient.addColorStop(0, "#8B5CF6") // purple-500
      gradient.addColorStop(1, "#4F46E5") // indigo-600

      // Draw bar
      ctx.fillStyle = gradient
      ctx.fillRect(x, y, barWidth, barHeight)

      // Draw month label
      ctx.fillStyle = "#9CA3AF" // gray-400
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(item.month, x + barWidth / 2, height - padding + 20)

      // Draw sales value above bar
      ctx.fillStyle = "#F9FAFB" // gray-50
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`$${item.sales}`, x + barWidth / 2, y - 5)
    })

    // Draw Y-axis labels
    ctx.fillStyle = "#9CA3AF" // gray-400
    ctx.font = "12px sans-serif"
    ctx.textAlign = "right"

    const yLabels = 5
    for (let i = 0; i <= yLabels; i++) {
      const value = Math.round((maxSales / yLabels) * i)
      const y = height - padding - ((height - padding * 2) * i) / yLabels
      ctx.fillText(`$${value}`, padding - 10, y + 4)

      // Draw horizontal grid line
      ctx.beginPath()
      ctx.strokeStyle = "#374151" // gray-700
      ctx.setLineDash([5, 5])
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
      ctx.setLineDash([])
    }
  }, [])

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-lg font-medium text-white">Sales Trend</h4>
          <p className="text-gray-400">Monthly sales performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative">
        <canvas ref={canvasRef} width={800} height={400} className="w-full h-[400px] bg-dark-700 rounded-lg"></canvas>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-dark-700 p-4 rounded-lg">
          <p className="text-gray-400 text-sm">Total Revenue</p>
          <p className="text-xl font-bold text-white">$97,600</p>
        </div>
        <div className="bg-dark-700 p-4 rounded-lg">
          <p className="text-gray-400 text-sm">Average Order Value</p>
          <p className="text-xl font-bold text-white">$124.32</p>
        </div>
        <div className="bg-dark-700 p-4 rounded-lg">
          <p className="text-gray-400 text-sm">Orders</p>
          <p className="text-xl font-bold text-white">785</p>
        </div>
      </div>
    </div>
  )
}
