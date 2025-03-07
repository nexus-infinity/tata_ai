"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowDownToLine, ArrowUpToLine, CheckCircle2, Clock, FileCode, RotateCcw, Search, Tag } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Sample model data
const models = [
  {
    id: "model-001",
    name: "llama-3.1-8B",
    version: "v1.2.3",
    module: "tata-core",
    accuracy: "98.2%",
    status: "active",
    size: "8B",
    trainingDate: "2025-03-01",
    lastUpdated: "2025-03-05",
    description: "Primary reasoning model for Tata Core",
    trainingParameters: {
      batchSize: 32,
      learningRate: 0.0001,
      epochs: 5,
      optimizer: "Adam",
    },
    versions: [
      { version: "v1.2.3", date: "2025-03-05", accuracy: "98.2%", status: "active" },
      { version: "v1.2.2", date: "2025-02-20", accuracy: "97.8%", status: "archived" },
      { version: "v1.2.1", date: "2025-02-05", accuracy: "97.5%", status: "archived" },
      { version: "v1.2.0", date: "2025-01-15", accuracy: "96.9%", status: "archived" },
    ],
  },
  {
    id: "model-002",
    name: "memex-retriever",
    version: "v2.1.0",
    module: "tata-memex",
    accuracy: "95.7%",
    status: "active",
    size: "2B",
    trainingDate: "2025-02-15",
    lastUpdated: "2025-03-02",
    description: "Knowledge retrieval model for Tata Memex",
    trainingParameters: {
      batchSize: 64,
      learningRate: 0.0005,
      epochs: 3,
      optimizer: "AdamW",
    },
    versions: [
      { version: "v2.1.0", date: "2025-03-02", accuracy: "95.7%", status: "active" },
      { version: "v2.0.1", date: "2025-01-25", accuracy: "94.2%", status: "archived" },
      { version: "v2.0.0", date: "2025-01-10", accuracy: "93.8%", status: "archived" },
    ],
  },
  {
    id: "model-003",
    name: "zkp-validator",
    version: "v1.0.5",
    module: "tata-zkp",
    accuracy: "99.9%",
    status: "active",
    size: "500MB",
    trainingDate: "2025-02-10",
    lastUpdated: "2025-03-01",
    description: "Zero-knowledge proof validation model",
    trainingParameters: {
      batchSize: 16,
      learningRate: 0.0002,
      epochs: 10,
      optimizer: "SGD",
    },
    versions: [
      { version: "v1.0.5", date: "2025-03-01", accuracy: "99.9%", status: "active" },
      { version: "v1.0.4", date: "2025-02-15", accuracy: "99.8%", status: "archived" },
      { version: "v1.0.3", date: "2025-01-30", accuracy: "99.7%", status: "archived" },
    ],
  },
  {
    id: "model-004",
    name: "flow-optimizer",
    version: "v3.2.1",
    module: "tata-flow",
    accuracy: "96.3%",
    status: "active",
    size: "1.5B",
    trainingDate: "2025-02-20",
    lastUpdated: "2025-03-04",
    description: "Resource optimization model for Tata Flow",
    trainingParameters: {
      batchSize: 48,
      learningRate: 0.0003,
      epochs: 7,
      optimizer: "RMSprop",
    },
    versions: [
      { version: "v3.2.1", date: "2025-03-04", accuracy: "96.3%", status: "active" },
      { version: "v3.2.0", date: "2025-02-20", accuracy: "95.9%", status: "archived" },
      { version: "v3.1.0", date: "2025-01-05", accuracy: "94.5%", status: "archived" },
    ],
  },
  {
    id: "model-005",
    name: "moto-self-optimizer",
    version: "v2.3.0",
    module: "tata-moto",
    accuracy: "97.1%",
    status: "active",
    size: "3B",
    trainingDate: "2025-02-25",
    lastUpdated: "2025-03-06",
    description: "Self-optimization model for Tata Moto",
    trainingParameters: {
      batchSize: 32,
      learningRate: 0.0002,
      epochs: 8,
      optimizer: "Adam",
    },
    versions: [
      { version: "v2.3.0", date: "2025-03-06", accuracy: "97.1%", status: "active" },
      { version: "v2.2.1", date: "2025-02-10", accuracy: "96.8%", status: "archived" },
      { version: "v2.2.0", date: "2025-01-20", accuracy: "96.2%", status: "archived" },
    ],
  },
]

export function ModelRegistry() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedModel, setSelectedModel] = useState<any>(null)

  const filteredModels = models.filter(
    (model) =>
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getModuleColor = (module: string) => {
    switch (module) {
      case "tata-core":
        return "text-orange-500"
      case "tata-memex":
        return "text-blue-500"
      case "tata-zkp":
        return "text-green-500"
      case "tata-flow":
        return "text-purple-500"
      case "tata-moto":
        return "text-pink-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Model Registry</CardTitle>
            <CardDescription>Manage and monitor AI models across all Tata modules</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search models..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button>
              <ArrowUpToLine className="mr-2 h-4 w-4" />
              Deploy Model
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Module</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Accuracy</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredModels.map((model) => (
              <TableRow key={model.id}>
                <TableCell className="font-medium">{model.name}</TableCell>
                <TableCell className={getModuleColor(model.module)}>{model.module}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5" />
                    {model.version}
                  </div>
                </TableCell>
                <TableCell>{model.accuracy}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    {model.lastUpdated}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={model.status === "active" ? "default" : "secondary"}>{model.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedModel(model)}>
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Model Details: {selectedModel?.name}</DialogTitle>
                          <DialogDescription>Detailed information about the model and its versions</DialogDescription>
                        </DialogHeader>
                        {selectedModel && (
                          <Tabs defaultValue="overview">
                            <TabsList>
                              <TabsTrigger value="overview">Overview</TabsTrigger>
                              <TabsTrigger value="versions">Version History</TabsTrigger>
                              <TabsTrigger value="parameters">Training Parameters</TabsTrigger>
                            </TabsList>
                            <TabsContent value="overview" className="space-y-4 mt-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <p className="text-sm font-medium text-muted-foreground">Model Name</p>
                                  <p className="text-lg font-semibold">{selectedModel.name}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm font-medium text-muted-foreground">Module</p>
                                  <p className={`text-lg font-semibold ${getModuleColor(selectedModel.module)}`}>
                                    {selectedModel.module}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm font-medium text-muted-foreground">Current Version</p>
                                  <p className="text-lg font-semibold">{selectedModel.version}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm font-medium text-muted-foreground">Accuracy</p>
                                  <p className="text-lg font-semibold">{selectedModel.accuracy}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm font-medium text-muted-foreground">Size</p>
                                  <p className="text-lg font-semibold">{selectedModel.size}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm font-medium text-muted-foreground">Training Date</p>
                                  <p className="text-lg font-semibold">{selectedModel.trainingDate}</p>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Description</p>
                                <p className="text-base">{selectedModel.description}</p>
                              </div>
                            </TabsContent>
                            <TabsContent value="versions" className="mt-4">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Version</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Accuracy</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {selectedModel.versions.map((version: any, index: number) => (
                                    <TableRow key={index}>
                                      <TableCell className="font-medium">{version.version}</TableCell>
                                      <TableCell>{version.date}</TableCell>
                                      <TableCell>{version.accuracy}</TableCell>
                                      <TableCell>
                                        <Badge variant={version.status === "active" ? "default" : "secondary"}>
                                          {version.status}
                                        </Badge>
                                      </TableCell>
                                      <TableCell>
                                        <div className="flex items-center gap-2">
                                          <Button variant="outline" size="sm" disabled={version.status === "active"}>
                                            <RotateCcw className="mr-1 h-3.5 w-3.5" />
                                            Rollback
                                          </Button>
                                          <Button variant="outline" size="sm">
                                            <ArrowDownToLine className="mr-1 h-3.5 w-3.5" />
                                            Download
                                          </Button>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TabsContent>
                            <TabsContent value="parameters" className="mt-4">
                              <div className="rounded-md border p-4">
                                <pre className="text-sm">
                                  {JSON.stringify(selectedModel.trainingParameters, null, 2)}
                                </pre>
                              </div>
                            </TabsContent>
                          </Tabs>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" size="sm">
                      <FileCode className="mr-1 h-3.5 w-3.5" />
                      Logs
                    </Button>
                    <Button variant="outline" size="sm">
                      <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                      Test
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

