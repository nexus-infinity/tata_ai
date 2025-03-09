"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Edit, Eye, Maximize, Minimize } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Define the bands that are universal across all nodes
const TEMPLATE_BANDS = [
  {
    id: "database",
    name: "Database",
    color: "from-blue-500 to-blue-600",
    lightColor: "from-blue-400/20 to-blue-500/20",
    borderColor: "border-blue-600",
    icon: "🗄️",
    description: "Database connection and schema management parameters",
  },
  {
    id: "authentication",
    name: "Authentication",
    color: "from-green-500 to-green-600",
    lightColor: "from-green-400/20 to-green-500/20",
    borderColor: "border-green-600",
    icon: "🔐",
    description: "Authentication and security parameters",
  },
  {
    id: "communication",
    name: "Communication",
    color: "from-purple-500 to-purple-600",
    lightColor: "from-purple-400/20 to-purple-500/20",
    borderColor: "border-purple-600",
    icon: "📡",
    description: "Inter-node communication parameters",
  },
  {
    id: "schema_management",
    name: "Schema Management",
    color: "from-amber-500 to-amber-600",
    lightColor: "from-amber-400/20 to-amber-500/20",
    borderColor: "border-amber-600",
    icon: "📊",
    description: "Schema adaptation and versioning parameters",
  },
  {
    id: "resources",
    name: "Resources",
    color: "from-red-500 to-red-600",
    lightColor: "from-red-400/20 to-red-500/20",
    borderColor: "border-red-600",
    icon: "💻",
    description: "CPU, memory, and storage resource parameters",
  },
  {
    id: "security",
    name: "Security",
    color: "from-indigo-500 to-indigo-600",
    lightColor: "from-indigo-400/20 to-indigo-500/20",
    borderColor: "border-indigo-600",
    icon: "🔒",
    description: "Security and credential management parameters",
  },
]

interface VisualTemplateSiloProps {
  nodeType: string
  template?: Record<string, any>
  onBandClick: (bandId: string) => void
  isExpanded?: boolean
  onToggleExpand?: () => void
}

export function VisualTemplateSilo({ 
  nodeType, 
  template = {}, 
  onBandClick,
  isExpanded = false,
  onToggleExpand
}: VisualTemplateSiloProps) {
  const [hoveredBand, setHoveredBand] = useState<string | null>(null)
  const siloRef = useRef<HTMLDivElement>(null)
  
  // Calculate how many bands are configured
  const configuredBands = TEMPLATE_BANDS.filter(band => 
    template && template[band.id] && Object.keys(template[band.id] || {}).length > 0
  ).length
  
  // Calculate completion percentage
  const completionPercentage = Math.round((configuredBands / TEMPLATE_BANDS.length) * 100)
  
  // Determine node icon based on type
  const getNodeIcon = () => {
    switch(nodeType) {
      case "Core": return "🧠";
      case "Flow": return "🔄";
      case "Memex": return "🧩";
      case "Moto": return "⚙️";
      case "ZKP": return "🛡️";
      default: return "📦";
    }
  }

  return (
    <div 
      className={cn(
        "relative transition-all duration-500 ease-in-out",
        isExpanded ? "col-span-3" : "col-span-1"
      )}
      ref={siloRef}
    >
      <Card className="h-full overflow-hidden">
        <div className="relative h-full">
          {/* Silo Header */}
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-xl">
                {getNodeIcon()}
              </div>
              <div>
                <h3 className="font-semibold">{nodeType}</h3>
                <div className="text-xs text-muted-foreground">
                  {configuredBands}/{TEMPLATE_BANDS.length} bands configured
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={completionPercentage === 100 ? "default" : "outline"}>
                {completionPercentage}%
              </Badge>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onToggleExpand}
                className="h-8 w-8"
              >
                {isExpanded ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          {/* Silo Body - 3D Stack */}
          <div className="relative p-4">
            <div className="relative mx-auto h-[500px] w-[200px]">
              {/* Silo Container with 3D effect */}
              <div className="absolute inset-0 rounded-lg border border-muted bg-background/50 shadow-inner"></div>
              
              {/* Bands Stack */}
              <div className="absolute inset-x-0 bottom-0 flex flex-col-reverse items-center justify-end">
                {TEMPLATE_BANDS.map((band, index) => {
                  const isConfigured = !!(template && template[band.id] && 
                                      Object.keys(template[band.id] || {}).length > 0);
                  const height = isExpanded ? 70 : 50;
                  const isHovered = hoveredBand === band.id;
                  
                  return (
                    <motion.div
                      key={band.id}
                      className={cn(
                        "relative w-full cursor-pointer transition-all duration-300",
                        isHovered ? "z-10" : "z-0"
                      )}
                      style={{ height }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        height,
                        transition: { 
                          delay: index * 0.1,
                          duration: 0.5
                        }
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        transition: { duration: 0.2 }
                      }}
                      onClick={() => onBandClick(band.id)}
                      onMouseEnter={() => setHoveredBand(band.id)}
                      onMouseLeave={() => setHoveredBand(null)}
                    >
                      {/* Band with 3D effect */}
                      <div 
                        className={cn(
                          "absolute inset-0 mx-2 rounded-md border shadow-lg transition-all duration-300",
                          isConfigured ? band.borderColor : "border-gray-300",
                          isHovered ? "translate-y-[-5px]" : ""
                        )}
                      >
                        {/* Top face with gradient */}
                        <div 
                          className={cn(
                            "absolute inset-0 rounded-md bg-gradient-to-br",
                            isConfigured ? band.color : band.lightColor
                          )}
                        >
                          {/* Content */}
                          <div className="flex h-full flex-col items-center justify-center p-2 text-white">
                            <div className="text-xl">{band.icon}</div>
                            <div className="text-center text-xs font-medium">{band.name}</div>
                          </div>
                        </div>
                        
                        {/* Side face for 3D effect */}
                        <div 
                          className={cn(
                            "absolute bottom-[-5px] left-0 right-0 h-[5px] rounded-b-md opacity-50",
                            isConfigured ? band.color : band.lightColor
                          )}
                          style={{ 
                            transform: "skewX(45deg) translateX(5px)",
                            transformOrigin: "bottom left"
                          }}
                        ></div>
                      </div>
                      
                      {/* Hover tooltip */}
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            className="absolute left-full ml-4 top-1/2 w-48 -translate-y-1/2 rounded-md border bg-popover p-2 text-sm shadow-md"
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -5 }}
                          >
                            <div className="font-medium">{band.name}</div>
                            <div className="text-xs text-muted-foreground">{band.description}</div>
                            <div className="mt-1 flex items-center gap-1 text-xs">
                              <Badge variant={isConfigured ? "default" : "outline"} className="text-[10px]">
                                {isConfigured ? "Configured" : "Not Configured"}
                              </Badge>
                              {isConfigured && (
                                <Badge variant="outline" className="text-[10px]">
                                  {Object.keys(template[band.id] || {}).length} parameters
                                </Badge>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </div>
              
              {/* Node Type Label */}
              <div className="absolute bottom-[-30px] left-0 right-0 text-center text-sm font-medium">
                {nodeType}
              </div>
            </div>
          </div>
          
          {/* Expanded View Details */}
          {isExpanded && (
            <div className="border-t p-4">
              <h4 className="mb-2 font-medium">Template Details</h4>
              <div className="space-y-2">
                {TEMPLATE_BANDS.map((band) => {
                  const isConfigured = !!(template && template[band.id] && 
                                      Object.keys(template[band.id] || {}).length > 0);
                  return (
                    <div 
                      key={band.id}
                      className={cn(
                        "flex items-center justify-between rounded-md border p-2",
                        isConfigured ? band.borderColor : "border-gray-200"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full",
                          isConfigured ? `bg-${band.color.split('-')[1]}-500` : "bg-gray-200"
                        )}>
                          <span className="text-sm">{band.icon}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium">{band.name}</div>
                          {isConfigured && (
                            <div className="text-xs text-muted-foreground">
                              {Object.keys(template[band.id] || {}).length} parameters
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => onBandClick(band.id)}
                        >
                          {isConfigured ? <Edit className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}