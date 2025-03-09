#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

// Configuration - use environment variables or defaults
const PROJECT_ROOT = process.env.PROJECT_ROOT || path.resolve(__dirname, '..');
const FRONTEND_DIR = process.env.FRONTEND_DIR || path.join(PROJECT_ROOT, 'frontend');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

// Utility functions
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function ensureDirectoryExists(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
    return true;
  } catch (error) {
    console.error(`${colors.red}Error creating directory ${dirPath}:${colors.reset}`, error.message);
    return false;
  }
}

async function writeFile(filePath, content) {
  try {
    await fs.writeFile(filePath, content);
    return true;
  } catch (error) {
    console.error(`${colors.red}Error writing file ${filePath}:${colors.reset}`, error.message);
    return false;
  }
}

// Template files content
const templateSiloViewerContent = `"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

// Define the bands that are universal across all nodes
const TEMPLATE_BANDS = [
  {
    id: "database",
    name: "Database",
    color: "bg-blue-500",
    description: "Database connection and schema management parameters",
  },
  {
    id: "authentication",
    name: "Authentication",
    color: "bg-green-500",
    description: "Authentication and security parameters",
  },
  {
    id: "communication",
    name: "Communication",
    color: "bg-purple-500",
    description: "Inter-node communication parameters",
  },
  {
    id: "schema_management",
    name: "Schema Management",
    color: "bg-amber-500",
    description: "Schema adaptation and versioning parameters",
  },
  {
    id: "resources",
    name: "Resources",
    color: "bg-red-500",
    description: "CPU, memory, and storage resource parameters",
  },
  {
    id: "security",
    name: "Security",
    color: "bg-indigo-500",
    description: "Security and credential management parameters",
  },
]

// Sample node types
const NODE_TYPES = ["Core", "Flow", "Memex", "Moto", "ZKP"]

interface TemplateSiloViewerProps {
  templates?: Record<string, any>
  onSave?: (nodeType: string, bandId: string, data: any) => void
}

export function TemplateSiloViewer({ templates = {}, onSave }: TemplateSiloViewerProps) {
  const [selectedNode, setSelectedNode] = useState<string>(NODE_TYPES[0])
  const [selectedBand, setSelectedBand] = useState<string | null>(null)
  const [editData, setEditData] = useState<any>(null)

  const handleBandClick = (bandId: string) => {
    const bandData = templates[selectedNode]?.[bandId]
    setSelectedBand(bandId)
    setEditData(bandData ? JSON.stringify(bandData, null, 2) : "{}")
  }

  const handleSave = () => {
    if (selectedBand && editData) {
      try {
        const parsedData = JSON.parse(editData)
        onSave?.(selectedNode, selectedBand, parsedData)
        setSelectedBand(null)
      } catch (error) {
        console.error("Invalid JSON:", error)
        // You could add error handling UI here
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Template Silo Viewer</h2>
          <p className="text-muted-foreground">View and edit template parameters across all AI nodes</p>
        </div>
      </div>

      <Tabs defaultValue={NODE_TYPES[0]} onValueChange={(value) => setSelectedNode(value)}>
        <TabsList className="mb-4">
          {NODE_TYPES.map((nodeType) => (
            <TabsTrigger key={nodeType} value={nodeType}>
              {nodeType}
            </TabsTrigger>
          ))}
        </TabsList>

        {NODE_TYPES.map((nodeType) => (
          <TabsContent key={nodeType} value={nodeType} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {nodeType} AI Node Template
                  <Badge variant="outline">{templates[nodeType]?.version || "v1.0"}</Badge>
                </CardTitle>
                <CardDescription>Universal template bands for {nodeType} AI node</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2">
                  {TEMPLATE_BANDS.map((band) => {
                    const isConfigured = !!(templates[nodeType]?.[band.id] && 
                                         Object.keys(templates[nodeType]?.[band.id] || {}).length > 0);
                    return (
                      <div
                        key={band.id}
                        className="relative cursor-pointer group"
                        onClick={() => handleBandClick(band.id)}
                      >
                        <div
                          className={\`h-16 rounded-md \${band.color} bg-opacity-20 border border-\${band.color.split("-")[1]}-600 p-3 transition-all hover:bg-opacity-30\`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">{band.name}</h3>
                              <p className="text-xs text-muted-foreground">{band.description}</p>
                            </div>
                            <Badge variant="secondary">{isConfigured ? "Configured" : "Default"}</Badge>
                          </div>
                        </div>
                        <div
                          className="absolute inset-y-0 left-0 w-1 rounded-l-md transition-all group-hover:w-2 group-hover:bg-opacity-100"
                          style={{ backgroundColor: band.color.replace("bg-", "") }}
                        ></div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={selectedBand !== null} onOpenChange={(open) => !open && setSelectedBand(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit {TEMPLATE_BANDS.find((b) => b.id === selectedBand)?.name} Parameters</DialogTitle>
            <DialogDescription>
              Modify the {TEMPLATE_BANDS.find((b) => b.id === selectedBand)?.name?.toLowerCase() || ""} parameters for{" "}
              {selectedNode} AI node.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="parameters">Parameters (JSON)</Label>
              <Textarea
                id="parameters"
                className="font-mono h-[300px]"
                value={editData}
                onChange={(e) => setEditData(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedBand(null)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}`;

const templateSiloComparisonContent = `"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Define the bands that are universal across all nodes
const TEMPLATE_BANDS = [
  {
    id: "database",
    name: "Database",
    color: "bg-blue-500",
    description: "Database connection and schema management parameters",
  },
  {
    id: "authentication",
    name: "Authentication",
    color: "bg-green-500",
    description: "Authentication and security parameters",
  },
  {
    id: "communication",
    name: "Communication",
    color: "bg-purple-500",
    description: "Inter-node communication parameters",
  },
  {
    id: "schema_management",
    name: "Schema Management",
    color: "bg-amber-500",
    description: "Schema adaptation and versioning parameters",
  },
  {
    id: "resources",
    name: "Resources",
    color: "bg-red-500",
    description: "CPU, memory, and storage resource parameters",
  },
  {
    id: "security",
    name: "Security",
    color: "bg-indigo-500",
    description: "Security and credential management parameters",
  },
]

// Sample node types
const NODE_TYPES = ["Core", "Flow", "Memex", "Moto", "ZKP"]

interface TemplateSiloComparisonProps {
  templates?: Record<string, any>
}

export function TemplateSiloComparison({ templates = {} }: TemplateSiloComparisonProps) {
  const [selectedBand, setSelectedBand] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Template Silo Comparison</h2>
          <p className="text-muted-foreground">Compare template bands across all AI nodes</p>
        </div>
      </div>

      <Tabs defaultValue="visual" className="space-y-4">
        <TabsList>
          <TabsTrigger value="visual">Visual Comparison</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="visual">
          <Card>
            <CardHeader>
              <CardTitle>Visual Silo Comparison</CardTitle>
              <CardDescription>Compare template bands across all AI nodes visually</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between space-x-4">
                {NODE_TYPES.map((nodeType) => (
                  <div key={nodeType} className="flex flex-col space-y-2 flex-1">
                    <div className="text-center font-medium pb-2">{nodeType}</div>
                    <div className="flex flex-col space-y-1">
                      {TEMPLATE_BANDS.map((band) => {
                        const hasBand = !!(
                          templates[nodeType]?.[band.id] && Object.keys(templates[nodeType]?.[band.id] || {}).length > 0
                        )
                        return (
                          <div
                            key={band.id}
                            className={\`h-12 rounded-md \${band.color} \${hasBand ? "bg-opacity-70" : "bg-opacity-20"} border \${hasBand ? \`border-\${band.color.split("-")[1]}-600\` : "border-gray-300"} transition-all hover:bg-opacity-80 cursor-pointer\`}
                            onClick={() => setSelectedBand(band.id)}
                          >
                            <div className="flex items-center justify-center h-full">
                              <span className="text-xs font-medium text-white drop-shadow-md">{band.name}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Band Comparison</CardTitle>
              <CardDescription>Compare specific parameters across all AI nodes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Select band to compare:</span>
                  <div className="flex space-x-2">
                    {TEMPLATE_BANDS.map((band) => (
                      <Button
                        key={band.id}
                        variant={selectedBand === band.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedBand(band.id)}
                        className={\`\${selectedBand === band.id ? band.color : ""} \${selectedBand === band.id ? "text-white" : ""}\`}
                      >
                        {band.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {selectedBand && (
                  <div className="border rounded-md">
                    <div className="grid grid-cols-6 gap-4 p-4 font-medium border-b">
                      <div className="col-span-2">Parameter</div>
                      {NODE_TYPES.map((nodeType) => (
                        <div key={nodeType} className="col-span-1 text-center">
                          {nodeType}
                        </div>
                      ))}
                    </div>

                    {selectedBand === "database" && (
                      <>
                        <div className="grid grid-cols-6 gap-4 p-4 border-b">
                          <div className="col-span-2">Database Type</div>
                          {NODE_TYPES.map((nodeType) => (
                            <div key={nodeType} className="col-span-1 text-center">
                              {templates[nodeType]?.database?.type || "-"}
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-6 gap-4 p-4 border-b">
                          <div className="col-span-2">Auto Migration</div>
                          {NODE_TYPES.map((nodeType) => (
                            <div key={nodeType} className="col-span-1 text-center">
                              {templates[nodeType]?.database?.auto_migration ? "Enabled" : "Disabled"}
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-6 gap-4 p-4">
                          <div className="col-span-2">Encryption</div>
                          {NODE_TYPES.map((nodeType) => (
                            <div key={nodeType} className="col-span-1 text-center">
                              {templates[nodeType]?.database?.encryption || "-"}
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {selectedBand === "communication" && (
                      <>
                        <div className="grid grid-cols-6 gap-4 p-4 border-b">
                          <div className="col-span-2">Protocol</div>
                          {NODE_TYPES.map((nodeType) => (
                            <div key={nodeType} className="col-span-1 text-center">
                              {templates[nodeType]?.communication?.protocol || "-"}
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-6 gap-4 p-4 border-b">
                          <div className="col-span-2">Fallback</div>
                          {NODE_TYPES.map((nodeType) => (
                            <div key={nodeType} className="col-span-1 text-center">
                              {templates[nodeType]?.communication?.fallback || "-"}
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-6 gap-4 p-4">
                          <div className="col-span-2">Heartbeat Interval</div>
                          {NODE_TYPES.map((nodeType) => (
                            <div key={nodeType} className="col-span-1 text-center">
                              {templates[nodeType]?.communication?.heartbeat_interval || "-"}
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Add similar sections for other bands */}
                    {selectedBand !== "database" && selectedBand !== "communication" && (
                      <div className="p-4 text-center text-muted-foreground">
                        Select a parameter band to see detailed comparison
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}`;

const visualTemplateSiloContent = `"use client"

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
                          isConfigured ? \`bg-\${band.color.split('-')[1]}-500\` : "bg-gray-200"
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
}`;

const templateSilosPageContent = `"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { VisualTemplateSilo } from "@/components/visual-template-silo"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeftRight, Download, LayoutTemplate, Upload } from 'lucide-react'
import { TemplateSiloComparison } from "@/components/template-silo-comparison"

// Sample template data - in a real app, you would fetch this from your API
const sampleTemplates = {
  Core: {
    version: "4.1",
    database: {
      type: "postgresql",
      host: "db.tata.local",
      port: 5432,
      username: "tata_core_user",
      password: "\${TATA_CORE_DB_PASSWORD}",
      database_name: "tata_core_db",
      schema: "dynamic",
      auto_migration: true,
      failover_strategy: "switch_to_local",
      encryption: "AES-256",
    },
    authentication: {
      method: "oauth2",
      api_keys: {
        tata_core: "\${TATA_CORE_API_KEY}",
        tata_memex: "\${TATA_MEMEX_API_KEY}",
        tata_moto: "\${TATA_MOTO_API_KEY}",
        tata_zkp: "\${TATA_ZKP_API_KEY}",
      },
      auto_rotate_keys: true,
      rotation_interval_days: 30,
      encryption: {
        protocol: "TLS 1.3",
        enable_mutual_auth: true,
      },
    },
    communication: {
      protocol: "grpc",
      fallback: "websockets",
      heartbeat_interval: "10s",
      reconnect_on_failure: true,
      load_balancing: "adaptive",
    },
    schema_management: {
      adaptive: true,
      validation_before_update: true,
      safe_mode: {
        enabled: true,
        rollback_on_failure: true,
        admin_approval_required: false,
      },
      versioning: {
        enabled: true,
        retain_versions: 5,
      },
    },
    resources: {
      cpu: "2",
      memory: "4Gi",
      storage: "20Gi",
      scaling: {
        min_replicas: 1,
        max_replicas: 5,
        target_cpu_utilization: 70,
      },
    },
    security: {
      credentialRotation: {
        enabled: true,
        rotationInterval: 30,
        rotationMethod: "auto",
      },
      credentialExpiration: {
        enabled: true,
        expirationDate: "2025-12-31T23:59:59Z",
      },
      auditing: {
        enabled: true,
        auditLogs: {
          endpoint: "/audit/logs",
          logLevel: "INFO",
        },
      },
    },
  },
  Flow: {
    version: "4.1",
    database: {
      type: "postgresql",
      host: "db.tata.local",
      port: 5432,
      username: "tata_flow_user",
      password: "\${TATA_FLOW_DB_PASSWORD}",
      database_name: "tata_flow_db",
      schema: "dynamic",
      auto_migration: true,
      failover_strategy: "switch_to_local",
      encryption: "AES-256",
    },
    communication: {
      protocol: "grpc",
      fallback: "websockets",
      heartbeat_interval: "10s",
      reconnect_on_failure: true,
      load_balancing: "adaptive",
    },
    resources: {
      cpu: "1",
      memory: "2Gi",
      storage: "10Gi",
      scaling: {
        min_replicas: 1,
        max_replicas: 3,
        target_cpu_utilization: 80,
      },
    },
  },
  Memex: {
    version: "4.1",
    database: {
      type: "postgresql",
      host: "db.tata.local",
      port: 5432,
      username: "tata_memex_user",
      password: "\${TATA_MEMEX_DB_PASSWORD}",
      database_name: "tata_memex_db",
      schema: "dynamic",
      auto_migration: true,
      failover_strategy: "switch_to_local",
      encryption: "AES-256",
    },
    resources: {
      cpu: "4",
      memory: "8Gi",
      storage: "100Gi",
      scaling: {
        min_replicas: 2,
        max_replicas: 6,
        target_cpu_utilization: 70,
      },
    },
    schema_management: {
      adaptive: true,
      validation_before_update: true,
      versioning: {
        enabled: true,
        retain_versions: 10,
      },
    },
  },
  Moto: {
    version: "4.1",
    database: {
      type: "mongodb",
      host: "mongo.tata.local",
      port: 27017,
      username: "tata_moto_user",
      password: "\${TATA_MOTO_DB_PASSWORD}",
      database_name: "tata_moto_db",
      auto_migration: true,
      failover_strategy: "switch_to_local",
      encryption: "AES-256",
    },
    communication: {
      protocol: "grpc",
      fallback: "rest",
      heartbeat_interval: "5s",
      reconnect_on_failure: true,
    },
  },
  ZKP: {
    version: "4.1",
    database: {
      type: "postgresql",
      host: "db.tata.local",
      port: 5432,
      username: "tata_zkp_user",
      password: "\${TATA_ZKP_DB_PASSWORD}",
      database_name: "tata_zkp_db",
      schema: "dynamic",
      auto_migration: true,
      failover_strategy: "switch_to_local",
      encryption: "AES-256",
    },
    security: {
      credentialRotation: {
        enabled: true,
        rotationInterval: 15, // More frequent for security node
        rotationMethod: "auto",
      },
      credentialExpiration: {
        enabled: true,
        expirationDate: "2025-12-31T23:59:59Z",
      },
    },
    authentication: {
      method: "oauth2",
      api_keys: {
        tata_zkp: "\${TATA_ZKP_API_KEY}",
      },
      auto_rotate_keys: true,
      rotation_interval_days: 15,
    },
  },
}

// Define the bands that are universal across all nodes
const TEMPLATE_BANDS = [
  {
    id: "database",
    name: "Database",
    color: "from-blue-500 to-blue-600",
    icon: "🗄️",
    description: "Database connection and schema management parameters",
  },
  {
    id: "authentication",
    name: "Authentication",
    color: "from-green-500 to-green-600",
    icon: "🔐",
    description: "Authentication and security parameters",
  },
  {
    id: "communication",
    name: "Communication",
    color: "from-purple-500 to-purple-600",
    icon: "📡",
    description: "Inter-node communication parameters",
  },
  {
    id: "schema_management",
    name: "Schema Management",
    color: "from-amber-500 to-amber-600",
    icon: "📊",
    description: "Schema adaptation and versioning parameters",
  },
  {
    id: "resources",
    name: "Resources",
    color: "from-red-500 to-red-600",
    icon: "💻",
    description: "CPU, memory, and storage resource parameters",
  },
  {
    id: "security",
    name: "Security",
    color: "from-indigo-500 to-indigo-600",
    icon: "🔒",
    description: "Security and credential management parameters",
  },
]

// Sample node types
const NODE_TYPES = ["Core", "Flow", "Memex", "Moto", "ZKP"]

export default function TemplateSilosPage() {
  const [templates, setTemplates] = useState(sampleTemplates)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [selectedBand, setSelectedBand] = useState<string | null>(null)
  const [editData, setEditData] = useState<string>("")
  const [viewMode, setViewMode] = useState<"silos" | "comparison">("silos")
  const [expandedSilo, setExpandedSilo] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState<string>("visual")
  const [comparisonBand, setComparisonBand] = useState<string>("database")

  // In a real app, you would fetch templates from your API
  useEffect(() => {
    // Fetch templates from API
    // const fetchTemplates = async () => {
    //   const response = await fetch('/api/templates');
    //   const data = await response.json();
    //   setTemplates(data);
    // };
    // fetchTemplates();
  }, [])

  const handleBandClick = (nodeType: string, bandId: string) => {
    setSelectedNode(nodeType)
    setSelectedBand(bandId)

    const bandData = templates[nodeType]?.[bandId]
    setEditData(bandData ? JSON.stringify(bandData, null, 2) : "{}")
  }

  const handleSave = () => {
    if (selectedNode && selectedBand) {
      try {
        const parsedData = JSON.parse(editData)

        setTemplates((prev) => ({
          ...prev,
          [selectedNode]: {
            ...prev[selectedNode],
            [selectedBand]: parsedData,
          },
        }))

        setSelectedNode(null)
        setSelectedBand(null)

        // In a real app, you would save to your API
        // const saveToApi = async () => {
        //   await fetch('/api/templates', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //       nodeType: selectedNode,
        //       bandId: selectedBand,
        //       data: parsedData
        //     })
        //   });
        // };
        // saveToApi();
      } catch (error) {
        console.error("Invalid JSON:", error)
        // You could add error handling UI here
      }
    }
  }

  const toggleSiloExpand = (nodeType: string) => {
    setExpandedSilo(expandedSilo === nodeType ? null : nodeType)
  }

  const getBandConfigurationCount = (bandId: string) => {
    return NODE_TYPES.filter(
      (nodeType) => templates[nodeType]?.[bandId] && Object.keys(templates[nodeType][bandId]).length > 0,
    ).length
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Template Silos</h1>
          <p className="text-muted-foreground">View and manage universal parameter bands across all AI nodes</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "silos" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("silos")}
            className="gap-1"
          >
            <LayoutTemplate className="h-4 w-4" />
            <span>Silos View</span>
          </Button>
          <Button
            variant={viewMode === "comparison" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("comparison")}
            className="gap-1"
          >
            <ArrowLeftRight className="h-4 w-4" />
            <span>Comparison View</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Upload className="h-4 w-4" />
            <span>Import</span>
          </Button>
        </div>
      </div>

      {viewMode === "silos" && (
        <motion.div
          className="grid grid-cols-5 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {NODE_TYPES.map((nodeType) => {
            const isExpanded = expandedSilo === nodeType
            const colSpan = isExpanded ? 3 : 1

            return (
              <VisualTemplateSilo
                key={nodeType}
                nodeType={nodeType}
                template={templates[nodeType] || {}}
                onBandClick={(bandId) => handleBandClick(nodeType, bandId)}
                isExpanded={isExpanded}
                onToggleExpand={() => toggleSiloExpand(nodeType)}
              />
            )
          })}
        </motion.div>
      )}

      {viewMode === "comparison" && <TemplateSiloComparison templates={templates} />}

      {/* Edit Dialog */}
      <Dialog
        open={selectedNode !== null && selectedBand !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedNode(null)
            setSelectedBand(null)
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Edit {selectedNode} - {TEMPLATE_BANDS.find((b) => b.id === selectedBand)?.name} Parameters
            </DialogTitle>
            <DialogDescription>
              Modify the {TEMPLATE_BANDS.find((b) => b.id === selectedBand)?.name?.toLowerCase() || ""} parameters for{" "}
              {selectedNode} AI node.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="parameters">Parameters (JSON)</Label>
              <Textarea
                id="parameters"
                className="font-mono h-[300px]"
                value={editData}
                onChange={(e) => setEditData(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedNode(null)
                setSelectedBand(null)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}`;

const apiRouteContent = `import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// GET /api/template-silos
export async function GET() {
  try {
    const templatesDir = path.join(process.cwd(), "templates")

    // Check if directory exists
    if (!fs.existsSync(templatesDir)) {
      return NextResponse.json({ templates: {} })
    }

    // Read all template files
    const files = await fs.promises.readdir(templatesDir)
    const templates: Record<string, any> = {}

    for (const file of files) {
      if (file.endsWith(".json")) {
        const filePath = path.join(templatesDir, file)
        const content = JSON.parse(await fs.promises.readFile(filePath, "utf8"))

        // Determine node type from filename or content
        let nodeType = "Unknown"
        if (file.includes("Core")) nodeType = "Core"
        else if (file.includes("Flow")) nodeType = "Flow"
        else if (file.includes("Memex")) nodeType = "Memex"
        else if (file.includes("Moto")) nodeType = "Moto"
        else if (file.includes("ZKP")) nodeType = "ZKP"
        else if (content.nodeName) {
          // Extract node type from nodeName (e.g., "Universal.TataCoreNode.JB.4.1" -> "Core")
          const parts = content.nodeName.split(".")
          for (const part of parts) {
            if (part.includes("Core")) nodeType = "Core"
            else if (part.includes("Flow")) nodeType = "Flow"
            else if (part.includes("Memex")) nodeType = "Memex"
            else if (part.includes("Moto")) nodeType = "Moto"
            else if (part.includes("ZKP")) nodeType = "ZKP"
          }
        }

        templates[nodeType] = content
      }
    }

    return NextResponse.json({ templates })
  } catch (error) {
    console.error("Error fetching templates:", error)
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 })
  }
}

// POST /api/template-silos
export async function POST(request: Request) {
  try {
    const { nodeType, bandId, data } = await request.json()

    if (!nodeType || !bandId || !data) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const templatesDir = path.join(process.cwd(), "templates")

    // Ensure directory exists
    if (!fs.existsSync(templatesDir)) {
      await fs.promises.mkdir(templatesDir, { recursive: true })
    }

    // Find the template file for this node type
    const files = await fs.promises.readdir(templatesDir)
    let templateFile = ""

    for (const file of files) {
      if (file.endsWith(".json") && (file.includes(nodeType) || file.toLowerCase().includes(nodeType.toLowerCase()))) {
        templateFile = file
        break
      }
    }

    // If no existing file, create a new one
    if (!templateFile) {
      templateFile = \`enhanced-\${nodeType.toLowerCase()}-template.json\`
    }

    const filePath = path.join(templatesDir, templateFile)

    // Read existing content or create new
    let content: Record<string, any> = {}
    if (fs.existsSync(filePath)) {
      content = JSON.parse(await fs.promises.readFile(filePath, "utf8"))
    }

    // Update the specific band
    content[bandId] = data

    // Write back to file
    await fs.promises.writeFile(filePath, JSON.stringify(content, null, 2))

    return NextResponse.json({ success: true, nodeType, bandId })
  } catch (error) {
    console.error("Error updating template:", error)
    return NextResponse.json({ error: "Failed to update template" }, { status: 500 })
  }
}`;

// Main update function
async function updateProject() {
  console.log(`${colors.magenta}=== Tata AI Project Update Script ===${colors.reset}`);
  console.log(`${colors.blue}Updating project at: ${FRONTEND_DIR}${colors.reset}`);
  
  // Check if frontend directory exists
  if (!await fileExists(FRONTEND_DIR)) {
    console.error(`${colors.red}✘ Frontend directory not found at ${FRONTEND_DIR}${colors.reset}`);
    console.log(`${colors.yellow}Creating frontend directory...${colors.reset}`);
    if (!await ensureDirectoryExists(FRONTEND_DIR)) {
      console.error(`${colors.red}✘ Failed to create frontend directory${colors.reset}`);
      process.exit(1);
    }
  }
  
  // Create components directory if it doesn't exist
  const componentsDir = path.join(FRONTEND_DIR, 'components');
  if (!await fileExists(componentsDir)) {
    console.log(`${colors.yellow}Creating components directory...${colors.reset}`);
    if (!await ensureDirectoryExists(componentsDir)) {
      console.error(`${colors.red}✘ Failed to create components directory${colors.reset}`);
      process.exit(1);
    }
  }
  
  // Create app directory if it doesn't exist
  const appDir = path.join(FRONTEND_DIR, 'app');
  if (!await fileExists(appDir)) {
    console.log(`${colors.yellow}Creating app directory...${colors.reset}`);
    if (!await ensureDirectoryExists(appDir)) {
      console.error(`${colors.red}✘ Failed to create app directory${colors.reset}`);
      process.exit(1);
    }
  }
  
  // Create dashboard directory if it doesn't exist
  const dashboardDir = path.join(appDir, 'dashboard');
  if (!await fileExists(dashboardDir)) {
    console.log(`${colors.yellow}Creating dashboard directory...${colors.reset}`);
    if (!await ensureDirectoryExists(dashboardDir)) {
      console.error(`${colors.red}✘ Failed to create dashboard directory${colors.reset}`);
      process.exit(1);
    }
  }
  
  // Create template-silos directory if it doesn't exist
  const templateSilosDir = path.join(dashboardDir, 'template-silos');
  if (!await fileExists(templateSilosDir)) {
    console.log(`${colors.yellow}Creating template-silos directory...${colors.reset}`);
    if (!await ensureDirectoryExists(templateSilosDir)) {
      console.error(`${colors.red}✘ Failed to create template-silos directory${colors.reset}`);
      process.exit(1);
    }
  }
  
  // Create api directory if it doesn't exist
  const apiDir = path.join(appDir, 'api');
  if (!await fileExists(apiDir)) {
    console.log(`${colors.yellow}Creating api directory...${colors.reset}`);
    if (!await ensureDirectoryExists(apiDir)) {
      console.error(`${colors.red}✘ Failed to create api directory${colors.reset}`);
      process.exit(1);
    }
  }
  
  // Create template-silos api directory if it doesn't exist
  const templateSilosApiDir = path.join(apiDir, 'template-silos');
  if (!await fileExists(templateSilosApiDir)) {
    console.log(`${colors.yellow}Creating template-silos api directory...${colors.reset}`);
    if (!await ensureDirectoryExists(templateSilosApiDir)) {
      console.error(`${colors.red}✘ Failed to create template-silos api directory${colors.reset}`);
      process.exit(1);
    }
  }
  
  // Create templates directory if it doesn't exist
  const templatesDir = path.join(FRONTEND_DIR, 'templates');
  if (!await fileExists(templatesDir)) {
    console.log(`${colors.yellow}Creating templates directory...${colors.reset}`);
    if (!await ensureDirectoryExists(templatesDir)) {
      console.error(`${colors.red}✘ Failed to create templates directory${colors.reset}`);
      process.exit(1);
    }
  }
  
  // Write component files
  console.log(`${colors.cyan}Writing component files...${colors.reset}`);
  
  const filesToWrite = [
    {
      path: path.join(componentsDir, 'template-silo-viewer.tsx'),
      content: templateSiloViewerContent,
      name: 'Template Silo Viewer'
    },
    {
      path: path.join(componentsDir, 'template-silo-comparison.tsx'),
      content: templateSiloComparisonContent,
      name: 'Template Silo Comparison'
    },
    {
      path: path.join(componentsDir, 'visual-template-silo.tsx'),
      content: visualTemplateSiloContent,
      name: 'Visual Template Silo'
    },
    {
      path: path.join(templateSilosDir, 'page.tsx'),
      content: templateSilosPageContent,
      name: 'Template Silos Page'
    },
    {
      path: path.join(templateSilosApiDir, 'route.ts'),
      content: apiRouteContent,
      name: 'Template Silos API Route'
    }
  ];
  
  for (const file of filesToWrite) {
    console.log(`${colors.yellow}Writing ${file.name}...${colors.reset}`);
    if (!await writeFile(file.path, file.content)) {
      console.error(`${colors.red}✘ Failed to write ${file.name}${colors.reset}`);
      process.exit(1);
    }
    console.log(`${colors.green}✓ ${file.name} written successfully${colors.reset}`);
  }
  
  console.log(`\n${colors.green}✓ Project updated successfully!${colors.reset}`);
  console.log(`\n${colors.magenta}=== Next Steps ===${colors.reset}`);
  console.log(`${colors.cyan}1. Install required dependencies:${colors.reset}`);
  console.log(`   cd ${FRONTEND_DIR} && npm install framer-motion`);
  console.log(`${colors.cyan}2. Run the project:${colors.reset}`);
  console.log(`   cd ${FRONTEND_DIR} && npm run dev`);
  console.log(`${colors.cyan}3. Access the template silos page at:${colors.reset}`);
  console.log(`   http://localhost:3000/dashboard/template-silos`);
}

// Run the update script
updateProject().catch(error => {
  console.error(`${colors.red}Error updating project:${colors.reset}`, error);
  process.exit(1);
});