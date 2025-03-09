"use client"

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
                            className={`h-12 rounded-md ${band.color} ${hasBand ? "bg-opacity-70" : "bg-opacity-20"} border ${hasBand ? `border-${band.color.split("-")[1]}-600` : "border-gray-300"} transition-all hover:bg-opacity-80 cursor-pointer`}
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
                        className={`${selectedBand === band.id ? band.color : ""} ${selectedBand === band.id ? "text-white" : ""}`}
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
}