"use client"

import React, { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RefreshCw } from "lucide-react"

export function SystemArchitecture() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [zoom, setZoom] = React.useState(1)

  // Define the architecture components
  const components = [
    { id: "frontend", name: "Front-End", type: "ui", x: 400, y: 50, width: 200, height: 80, color: "#3b82f6" },
    {
      id: "api-gateway",
      name: "API Gateway",
      type: "service",
      x: 400,
      y: 180,
      width: 200,
      height: 60,
      color: "#10b981",
    },
    { id: "tata-core", name: "Tata-Core", type: "module", x: 150, y: 300, width: 180, height: 70, color: "#f97316" },
    { id: "tata-zkp", name: "Tata-ZKP", type: "module", x: 400, y: 300, width: 180, height: 70, color: "#f97316" },
    { id: "tata-flo", name: "Tata-Flo", type: "module", x: 650, y: 300, width: 180, height: 70, color: "#f97316" },
    { id: "tata-memex", name: "Tata-MEMEX", type: "module", x: 400, y: 420, width: 180, height: 70, color: "#f97316" },
    { id: "tata-moto", name: "Tata-Moto", type: "module", x: 400, y: 540, width: 180, height: 70, color: "#f97316" },
    { id: "mongodb", name: "MongoDB", type: "database", x: 250, y: 650, width: 140, height: 60, color: "#a855f7" },
    {
      id: "postgresql",
      name: "PostgreSQL",
      type: "database",
      x: 550,
      y: 650,
      width: 140,
      height: 60,
      color: "#a855f7",
    },
  ]

  // Define connections between components
  const connections = [
    { from: "frontend", to: "api-gateway" },
    { from: "api-gateway", to: "tata-core" },
    { from: "api-gateway", to: "tata-zkp" },
    { from: "api-gateway", to: "tata-flo" },
    { from: "tata-core", to: "tata-memex" },
    { from: "tata-zkp", to: "tata-memex" },
    { from: "tata-flo", to: "tata-memex" },
    { from: "tata-memex", to: "tata-moto" },
    { from: "tata-moto", to: "mongodb" },
    { from: "tata-moto", to: "postgresql" },
    { from: "tata-memex", to: "mongodb" },
    { from: "tata-memex", to: "postgresql" },
  ]

  const drawArchitecture = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Apply zoom
    ctx.save()
    ctx.scale(zoom, zoom)

    // Draw connections first (so they appear behind the components)
    ctx.strokeStyle = "#64748b"
    ctx.lineWidth = 2

    connections.forEach((conn) => {
      const fromComp = components.find((c) => c.id === conn.from)
      const toComp = components.find((c) => c.id === conn.to)

      if (fromComp && toComp) {
        const fromX = fromComp.x + fromComp.width / 2
        const fromY = fromComp.y + fromComp.height
        const toX = toComp.x + toComp.width / 2
        const toY = toComp.y

        // Draw line
        ctx.beginPath()
        ctx.moveTo(fromX, fromY)

        // If it's a connection to a component below, draw a curved line
        if (fromY < toY) {
          const controlPointY = (fromY + toY) / 2
          ctx.bezierCurveTo(fromX, controlPointY, toX, controlPointY, toX, toY)
        } else {
          // For horizontal connections, draw a straight line
          ctx.lineTo(toX, toY)
        }

        ctx.stroke()

        // Draw arrow at the end
        const arrowSize = 8
        const angle = Math.atan2(toY - fromY, toX - fromX)

        ctx.beginPath()
        ctx.moveTo(toX, toY)
        ctx.lineTo(toX - arrowSize * Math.cos(angle - Math.PI / 6), toY - arrowSize * Math.sin(angle - Math.PI / 6))
        ctx.lineTo(toX - arrowSize * Math.cos(angle + Math.PI / 6), toY - arrowSize * Math.sin(angle + Math.PI / 6))
        ctx.closePath()
        ctx.fillStyle = "#64748b"
        ctx.fill()
      }
    })

    // Draw components
    components.forEach((comp) => {
      // Draw component background
      ctx.fillStyle = comp.color
      ctx.beginPath()
      ctx.roundRect(comp.x, comp.y, comp.width, comp.height, 10)
      ctx.fill()

      // Draw component border
      ctx.strokeStyle = "rgba(0,0,0,0.2)"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw component name
      ctx.fillStyle = "white"
      ctx.font = "14px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(comp.name, comp.x + comp.width / 2, comp.y + comp.height / 2)

      // Draw component type indicator
      let icon = ""
      switch (comp.type) {
        case "ui":
          icon = "🖥️"
          break
        case "service":
          icon = "⚙️"
          break
        case "module":
          icon = "🧠"
          break
        case "database":
          icon = "💾"
          break
      }

      ctx.font = "12px sans-serif"
      ctx.fillText(icon, comp.x + 15, comp.y + 15)
    })

    ctx.restore()
  }

  useEffect(() => {
    drawArchitecture()

    // Handle window resize
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = canvasRef.current.offsetWidth
        canvasRef.current.height = canvasRef.current.offsetHeight
        drawArchitecture()
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize() // Initial sizing

    return () => window.removeEventListener("resize", handleResize)
  }, [zoom])

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 2))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.5))
  const handleReset = () => setZoom(1)

  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>System Architecture</CardTitle>
          <CardDescription>Visual representation of the Tata AI system architecture</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleReset}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-[600px] border rounded-md overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{
              transformOrigin: "center center",
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}

