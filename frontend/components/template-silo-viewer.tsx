"use client"

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
                          className={`h-16 rounded-md ${band.color} bg-opacity-20 border border-${band.color.split("-")[1]}-600 p-3 transition-all hover:bg-opacity-30`}
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
}