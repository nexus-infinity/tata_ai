"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Code,
  Database,
  Filter,
  Play,
  Search,
  Server,
  Settings,
} from "lucide-react"

// Sample API endpoints data
const apiEndpoints = [
  {
    id: "api-001",
    name: "Get Core Status",
    path: "/tata-core/status",
    method: "GET",
    module: "tata-core",
    status: "active",
    responseTime: "45ms",
    lastCalled: "2025-03-07T23:10:22Z",
    callsLast24h: 1245,
    validationStatus: "valid",
    description: "Retrieves the current status of Tata Core",
  },
  {
    id: "api-002",
    name: "Evaluate Data",
    path: "/tata-core/evaluate",
    method: "POST",
    module: "tata-core",
    status: "active",
    responseTime: "120ms",
    lastCalled: "2025-03-07T23:15:42Z",
    callsLast24h: 856,
    validationStatus: "valid",
    description: "Submits data for evaluation by the Tata Core reasoning engine",
  },
  {
    id: "api-003",
    name: "Get Knowledge",
    path: "/tata-memex/knowledge",
    method: "GET",
    module: "tata-memex",
    status: "active",
    responseTime: "78ms",
    lastCalled: "2025-03-07T23:12:55Z",
    callsLast24h: 2145,
    validationStatus: "valid",
    description: "Retrieves knowledge from the Tata Memex database",
  },
  {
    id: "api-004",
    name: "Store Knowledge",
    path: "/tata-memex/knowledge",
    method: "POST",
    module: "tata-memex",
    status: "active",
    responseTime: "95ms",
    lastCalled: "2025-03-07T23:08:47Z",
    callsLast24h: 567,
    validationStatus: "valid",
    description: "Stores new knowledge in the Tata Memex database",
  },
  {
    id: "api-005",
    name: "Verify Proof",
    path: "/tata-zkp/verify",
    method: "POST",
    module: "tata-zkp",
    status: "warning",
    responseTime: "210ms",
    lastCalled: "2025-03-07T23:14:18Z",
    callsLast24h: 432,
    validationStatus: "warning",
    description: "Verifies a zero-knowledge proof",
  },
  {
    id: "api-006",
    name: "Get Resources",
    path: "/tata-flow/resources",
    method: "GET",
    module: "tata-flow",
    status: "active",
    responseTime: "35ms",
    lastCalled: "2025-03-07T23:10:22Z",
    callsLast24h: 1876,
    validationStatus: "valid",
    description: "Retrieves the current resource allocation and performance",
  },
  {
    id: "api-007",
    name: "Optimize System",
    path: "/tata-moto/optimize",
    method: "POST",
    module: "tata-moto",
    status: "active",
    responseTime: "150ms",
    lastCalled: "2025-03-07T23:08:47Z",
    callsLast24h: 24,
    validationStatus: "valid",
    description: "Triggers a system optimization cycle",
  },
]

// Sample GraphQL queries
const graphqlQueries = [
  {
    id: "gql-001",
    name: "Get System Status",
    query: `{
  getTataCoreStatus {
    status
    cpuUsage
    memoryUsage
  }
}`,
    module: "all",
    lastCalled: "2025-03-07T23:15:00Z",
    callsLast24h: 156,
    description: "Retrieves status information for the Tata Core module",
  },
  {
    id: "gql-002",
    name: "Get Module Metrics",
    query: `{
  getModuleMetrics(module: "tata-memex") {
    cpuUsage
    memoryUsage
    networkTraffic
    activeConnections
  }
}`,
    module: "tata-memex",
    lastCalled: "2025-03-07T23:12:30Z",
    callsLast24h: 89,
    description: "Retrieves detailed metrics for the Tata Memex module",
  },
  {
    id: "gql-003",
    name: "Get Model Information",
    query: `{
  getModelInfo(name: "llama-3.1-8B") {
    version
    accuracy
    trainingDate
    lastUpdated
    trainingParameters {
      batchSize
      learningRate
      epochs
    }
  }
}`,
    module: "tata-core",
    lastCalled: "2025-03-07T22:45:12Z",
    callsLast24h: 42,
    description: "Retrieves detailed information about a specific model",
  },
]

export function ApiManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("rest")

  const filteredEndpoints = apiEndpoints.filter(
    (endpoint) =>
      endpoint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredQueries = graphqlQueries.filter(
    (query) =>
      query.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.description.toLowerCase().includes(searchTerm.toLowerCase()),
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
      case "all":
        return "text-gray-500"
      default:
        return "text-gray-500"
    }
  }

  const getMethodBadge = (method: string) => {
    switch (method) {
      case "GET":
        return <Badge className="bg-blue-500">GET</Badge>
      case "POST":
        return <Badge className="bg-green-500">POST</Badge>
      case "PUT":
        return <Badge className="bg-yellow-500">PUT</Badge>
      case "DELETE":
        return <Badge className="bg-red-500">DELETE</Badge>
      default:
        return <Badge>{method}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>API Management</CardTitle>
            <CardDescription>Monitor and manage API endpoints and GraphQL queries</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search APIs..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button>
              <Settings className="mr-2 h-4 w-4" />
              Configure
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="rest" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="rest">
              <Server className="mr-2 h-4 w-4" />
              REST APIs
            </TabsTrigger>
            <TabsTrigger value="graphql">
              <Code className="mr-2 h-4 w-4" />
              GraphQL
            </TabsTrigger>
            <TabsTrigger value="metrics">
              <Activity className="mr-2 h-4 w-4" />
              API Metrics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rest">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Path</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Response Time</TableHead>
                  <TableHead>Validation</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEndpoints.map((endpoint) => (
                  <TableRow key={endpoint.id}>
                    <TableCell>{getStatusIcon(endpoint.status)}</TableCell>
                    <TableCell className="font-medium">{endpoint.name}</TableCell>
                    <TableCell>
                      <code className="rounded bg-muted px-1 py-0.5 text-xs">{endpoint.path}</code>
                    </TableCell>
                    <TableCell>{getMethodBadge(endpoint.method)}</TableCell>
                    <TableCell className={getModuleColor(endpoint.module)}>{endpoint.module}</TableCell>
                    <TableCell>{endpoint.responseTime}</TableCell>
                    <TableCell>
                      <Badge variant={endpoint.validationStatus === "valid" ? "default" : "warning"}>
                        {endpoint.validationStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Play className="mr-1 h-3.5 w-3.5" />
                          Test
                        </Button>
                        <Button variant="outline" size="sm">
                          <Database className="mr-1 h-3.5 w-3.5" />
                          Logs
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="graphql">
            <div className="space-y-6">
              {filteredQueries.map((query) => (
                <div key={query.id} className="rounded-md border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{query.name}</h3>
                      <span className={getModuleColor(query.module)}>{query.module}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Last called: {new Date(query.lastCalled).toLocaleTimeString()}</span>
                      <span>|</span>
                      <span>Calls (24h): {query.callsLast24h}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{query.description}</p>
                  <pre className="bg-muted p-2 rounded-md text-xs overflow-auto">{query.query}</pre>
                  <div className="flex justify-end mt-2">
                    <Button variant="outline" size="sm">
                      <Play className="mr-1 h-3.5 w-3.5" />
                      Execute Query
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="metrics">
            <div className="h-[400px] w-full rounded-md border border-dashed flex items-center justify-center text-muted-foreground">
              API metrics visualization (calls per endpoint, response times, error rates)
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

