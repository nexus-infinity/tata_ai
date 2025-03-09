"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertCircle,
  Copy,
  RefreshCw,
  Plus,
  Trash,
  Save,
  Play,
  FolderPlus,
  Folder,
  Clock,
  Star,
  StarOff,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

// Types
type ApiEndpoint = {
  id: string
  name: string
  url: string
  method: string
  headers: string
  body: string
  category: string
  isFavorite: boolean
  lastUsed?: string
}

type ApiResponse = {
  status: number
  statusText: string
  headers: Record<string, string>
  data: any
  time: number
}

type ApiCategory = {
  id: string
  name: string
  description: string
  color: string
}

export default function ApiTester() {
  // State for the current request
  const [url, setUrl] = useState("")
  const [method, setMethod] = useState("GET")
  const [headers, setHeaders] = useState('{\n  "Content-Type": "application/json"\n}')
  const [body, setBody] = useState("{\n\n}")
  const [activeTab, setActiveTab] = useState("request")
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<ApiResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [currentEndpointId, setCurrentEndpointId] = useState<string | null>(null)

  // State for saved endpoints
  const [savedEndpoints, setSavedEndpoints] = useState<ApiEndpoint[]>([])
  const [categories, setCategories] = useState<ApiCategory[]>([
    { id: "internal", name: "Internal APIs", description: "APIs for internal development", color: "blue" },
    { id: "public", name: "Public Data Sources", description: "External public APIs", color: "green" },
    {
      id: "private",
      name: "Private Services",
      description: "External private APIs requiring authentication",
      color: "purple",
    },
  ])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState("all")

  // State for new endpoint dialog
  const [isNewEndpointDialogOpen, setIsNewEndpointDialogOpen] = useState(false)
  const [newEndpointName, setNewEndpointName] = useState("")
  const [newEndpointCategory, setNewEndpointCategory] = useState("internal")

  // State for new category dialog
  const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryDescription, setNewCategoryDescription] = useState("")
  const [newCategoryColor, setNewCategoryColor] = useState("blue")

  // Load saved endpoints from localStorage on component mount
  useEffect(() => {
    const storedEndpoints = localStorage.getItem("apiTesterEndpoints")
    if (storedEndpoints) {
      setSavedEndpoints(JSON.parse(storedEndpoints))
    }

    const storedCategories = localStorage.getItem("apiTesterCategories")
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories))
    }
  }, [])

  // Save endpoints to localStorage when they change
  useEffect(() => {
    localStorage.setItem("apiTesterEndpoints", JSON.stringify(savedEndpoints))
  }, [savedEndpoints])

  // Save categories to localStorage when they change
  useEffect(() => {
    localStorage.setItem("apiTesterCategories", JSON.stringify(categories))
  }, [categories])

  // Send API request
  const sendRequest = async () => {
    setIsLoading(true)
    setError(null)
    setResponse(null)
    setActiveTab("response")

    const startTime = performance.now()

    try {
      let parsedHeaders = {}
      try {
        parsedHeaders = JSON.parse(headers)
      } catch (err) {
        setError("Invalid JSON in headers")
        setIsLoading(false)
        return
      }

      const options: RequestInit = {
        method,
        headers: parsedHeaders,
      }

      if (method !== "GET" && method !== "HEAD" && body) {
        try {
          // Try to parse as JSON first
          const parsedBody = JSON.parse(body)
          options.body = JSON.stringify(parsedBody)
        } catch (err) {
          // If not valid JSON, use as-is
          options.body = body
        }
      }

      const res = await fetch(url, options)
      let responseData

      const contentType = res.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        responseData = await res.json()
      } else {
        responseData = await res.text()
      }

      const endTime = performance.now()

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        data: responseData,
        time: Math.round(endTime - startTime),
      })

      // Update last used timestamp if this is a saved endpoint
      if (currentEndpointId) {
        updateEndpointLastUsed(currentEndpointId)
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while sending the request")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Save current request as a new endpoint
  const saveNewEndpoint = () => {
    if (!newEndpointName || !url) return

    const newEndpoint: ApiEndpoint = {
      id: Date.now().toString(),
      name: newEndpointName,
      url,
      method,
      headers,
      body,
      category: newEndpointCategory,
      isFavorite: false,
      lastUsed: new Date().toISOString(),
    }

    setSavedEndpoints([...savedEndpoints, newEndpoint])
    setCurrentEndpointId(newEndpoint.id)
    setIsNewEndpointDialogOpen(false)
    setNewEndpointName("")
  }

  // Save changes to an existing endpoint
  const updateEndpoint = () => {
    if (!currentEndpointId) return

    const updatedEndpoints = savedEndpoints.map((endpoint) =>
      endpoint.id === currentEndpointId ? { ...endpoint, url, method, headers, body } : endpoint,
    )

    setSavedEndpoints(updatedEndpoints)
  }

  // Update the last used timestamp for an endpoint
  const updateEndpointLastUsed = (id: string) => {
    const updatedEndpoints = savedEndpoints.map((endpoint) =>
      endpoint.id === id ? { ...endpoint, lastUsed: new Date().toISOString() } : endpoint,
    )

    setSavedEndpoints(updatedEndpoints)
  }

  // Load a saved endpoint
  const loadEndpoint = (endpoint: ApiEndpoint) => {
    setUrl(endpoint.url)
    setMethod(endpoint.method)
    setHeaders(endpoint.headers)
    setBody(endpoint.body)
    setCurrentEndpointId(endpoint.id)
    setActiveTab("request")
  }

  // Delete a saved endpoint
  const deleteEndpoint = (id: string) => {
    setSavedEndpoints(savedEndpoints.filter((endpoint) => endpoint.id !== id))
    if (currentEndpointId === id) {
      setCurrentEndpointId(null)
    }
  }

  // Toggle favorite status of an endpoint
  const toggleFavorite = (id: string) => {
    const updatedEndpoints = savedEndpoints.map((endpoint) =>
      endpoint.id === id ? { ...endpoint, isFavorite: !endpoint.isFavorite } : endpoint,
    )

    setSavedEndpoints(updatedEndpoints)
  }

  // Create a new category
  const saveNewCategory = () => {
    if (!newCategoryName) return

    const newCategory: ApiCategory = {
      id: Date.now().toString(),
      name: newCategoryName,
      description: newCategoryDescription,
      color: newCategoryColor,
    }

    setCategories([...categories, newCategory])
    setIsNewCategoryDialogOpen(false)
    setNewCategoryName("")
    setNewCategoryDescription("")
  }

  // Filter endpoints based on selected category and view mode
  const filteredEndpoints = savedEndpoints.filter((endpoint) => {
    if (selectedCategory && endpoint.category !== selectedCategory) {
      return false
    }

    if (viewMode === "favorites" && !endpoint.isFavorite) {
      return false
    }

    if (viewMode === "recent") {
      // Show only endpoints used in the last 7 days
      if (!endpoint.lastUsed) return false
      const lastUsed = new Date(endpoint.lastUsed)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      return lastUsed >= sevenDaysAgo
    }

    return true
  })

  // Get category color
  const getCategoryColor = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category?.color || "gray"
  }

  // Format response headers for display
  const formatHeaders = (headers: Record<string, string>) => {
    return Object.entries(headers)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n")
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Sidebar */}
        <div className="w-full lg:w-64 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>API Endpoints</CardTitle>
              <CardDescription>Saved API configurations</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex justify-between mb-4">
                <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value)}>
                  <ToggleGroupItem value="all" aria-label="All endpoints">
                    All
                  </ToggleGroupItem>
                  <ToggleGroupItem value="favorites" aria-label="Favorite endpoints">
                    <Star className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="recent" aria-label="Recent endpoints">
                    <Clock className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>

                <Dialog open={isNewEndpointDialogOpen} onOpenChange={setIsNewEndpointDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      New
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Save API Endpoint</DialogTitle>
                      <DialogDescription>Save the current API configuration for future use.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="endpoint-name">Name</Label>
                        <Input
                          id="endpoint-name"
                          placeholder="My API Endpoint"
                          value={newEndpointName}
                          onChange={(e) => setNewEndpointName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endpoint-category">Category</Label>
                        <Select value={newEndpointCategory} onValueChange={setNewEndpointCategory}>
                          <SelectTrigger id="endpoint-category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsNewEndpointDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={saveNewEndpoint} disabled={!newEndpointName || !url}>
                        Save
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <Label>Categories</Label>
                  <Dialog open={isNewCategoryDialogOpen} onOpenChange={setIsNewCategoryDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <FolderPlus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Category</DialogTitle>
                        <DialogDescription>Create a new category to organize your API endpoints.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="category-name">Name</Label>
                          <Input
                            id="category-name"
                            placeholder="Category Name"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category-description">Description</Label>
                          <Input
                            id="category-description"
                            placeholder="Category Description"
                            value={newCategoryDescription}
                            onChange={(e) => setNewCategoryDescription(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category-color">Color</Label>
                          <Select value={newCategoryColor} onValueChange={setNewCategoryColor}>
                            <SelectTrigger id="category-color">
                              <SelectValue placeholder="Select color" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="blue">Blue</SelectItem>
                              <SelectItem value="green">Green</SelectItem>
                              <SelectItem value="red">Red</SelectItem>
                              <SelectItem value="yellow">Yellow</SelectItem>
                              <SelectItem value="purple">Purple</SelectItem>
                              <SelectItem value="pink">Pink</SelectItem>
                              <SelectItem value="orange">Orange</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsNewCategoryDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={saveNewCategory} disabled={!newCategoryName}>
                          Create
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-1">
                  <Button
                    variant={selectedCategory === null ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(null)}
                  >
                    <Folder className="h-4 w-4 mr-2" />
                    All Categories
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <div
                        className="h-3 w-3 rounded-full mr-2"
                        style={{ backgroundColor: `var(--${category.color}-500)` }}
                      />
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>

              <ScrollArea className="h-[300px]">
                {filteredEndpoints.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No saved endpoints found.</div>
                ) : (
                  <div className="space-y-2">
                    {filteredEndpoints.map((endpoint) => (
                      <div
                        key={endpoint.id}
                        className={`p-2 border rounded-md cursor-pointer transition-colors ${
                          currentEndpointId === endpoint.id ? "bg-accent" : "hover:bg-accent/50"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-1" onClick={() => loadEndpoint(endpoint)}>
                            <div className="font-medium">{endpoint.name}</div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={`bg-${getCategoryColor(endpoint.category)}-100 text-${getCategoryColor(endpoint.category)}-800 border-${getCategoryColor(endpoint.category)}-200`}
                              >
                                {categories.find((c) => c.id === endpoint.category)?.name || endpoint.category}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={`
                                  ${
                                    endpoint.method === "GET"
                                      ? "bg-blue-100 text-blue-800 border-blue-200"
                                      : endpoint.method === "POST"
                                        ? "bg-green-100 text-green-800 border-green-200"
                                        : endpoint.method === "PUT"
                                          ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                          : endpoint.method === "DELETE"
                                            ? "bg-red-100 text-red-800 border-red-200"
                                            : "bg-gray-100 text-gray-800 border-gray-200"
                                  }
                                `}
                              >
                                {endpoint.method}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground truncate max-w-[180px]">{endpoint.url}</div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => toggleFavorite(endpoint.id)}
                            >
                              {endpoint.isFavorite ? (
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              ) : (
                                <StarOff className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-red-500"
                              onClick={() => deleteEndpoint(endpoint.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <Card className="w-full">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>API Tester</CardTitle>
                  <CardDescription>Test any API endpoint</CardDescription>
                </div>
                <div className="flex gap-2">
                  {currentEndpointId && (
                    <Button variant="outline" size="sm" onClick={updateEndpoint} className="flex items-center gap-1">
                      <Save className="h-4 w-4" />
                      Update
                    </Button>
                  )}
                  <Dialog open={isNewEndpointDialogOpen} onOpenChange={setIsNewEndpointDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Save className="h-4 w-4" />
                        Save As
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="request">Request</TabsTrigger>
                  <TabsTrigger value="response">Response</TabsTrigger>
                </TabsList>

                <TabsContent value="request" className="space-y-4 mt-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <Label htmlFor="request-url">URL</Label>
                      <Input
                        id="request-url"
                        placeholder="https://api.example.com/endpoint"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                      />
                    </div>
                    <div className="w-32">
                      <Label htmlFor="request-method">Method</Label>
                      <Select value={method} onValueChange={setMethod}>
                        <SelectTrigger id="request-method">
                          <SelectValue placeholder="Method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GET">GET</SelectItem>
                          <SelectItem value="POST">POST</SelectItem>
                          <SelectItem value="PUT">PUT</SelectItem>
                          <SelectItem value="DELETE">DELETE</SelectItem>
                          <SelectItem value="PATCH">PATCH</SelectItem>
                          <SelectItem value="HEAD">HEAD</SelectItem>
                          <SelectItem value="OPTIONS">OPTIONS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="request-headers">Headers (JSON)</Label>
                    <Textarea
                      id="request-headers"
                      value={headers}
                      onChange={(e) => setHeaders(e.target.value)}
                      rows={5}
                      className="font-mono text-sm"
                    />
                  </div>

                  {(method === "POST" || method === "PUT" || method === "PATCH") && (
                    <div>
                      <Label htmlFor="request-body">Body</Label>
                      <Textarea
                        id="request-body"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        rows={8}
                        className="font-mono text-sm"
                      />
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="response" className="mt-4">
                  {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                      <span className="ml-2">Sending request...</span>
                    </div>
                  ) : error ? (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  ) : response ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div
                            className={`px-3 py-1 rounded-md text-sm font-medium ${
                              response.status >= 200 && response.status < 300
                                ? "bg-green-100 text-green-800"
                                : response.status >= 400
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {response.status} {response.statusText}
                          </div>
                          <div className="text-sm text-muted-foreground">{response.time}ms</div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            navigator.clipboard.writeText(
                              typeof response.data === "object"
                                ? JSON.stringify(response.data, null, 2)
                                : response.data,
                            )
                          }
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                      </div>

                      <Accordion type="single" collapsible>
                        <AccordionItem value="headers">
                          <AccordionTrigger>Response Headers</AccordionTrigger>
                          <AccordionContent>
                            <Textarea
                              value={formatHeaders(response.headers)}
                              readOnly
                              rows={5}
                              className="font-mono text-sm"
                            />
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="body">
                          <AccordionTrigger>Response Body</AccordionTrigger>
                          <AccordionContent>
                            <Textarea
                              value={
                                typeof response.data === "object"
                                  ? JSON.stringify(response.data, null, 2)
                                  : response.data
                              }
                              readOnly
                              rows={12}
                              className="font-mono text-sm"
                            />
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      Send a request to see the response here.
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button onClick={sendRequest} disabled={isLoading || !url} className="flex items-center gap-2">
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Send Request
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

