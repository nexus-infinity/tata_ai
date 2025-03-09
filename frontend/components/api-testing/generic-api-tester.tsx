"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Copy, RefreshCw, Plus, Trash } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function GenericApiTester() {
  const [savedApis, setSavedApis] = useState<Array<{ name: string; url: string; method: string }>>([
    { name: "Backend Health Check", url: "/api/health", method: "GET" },
    { name: "Database Status", url: "/api/test/database", method: "GET" },
  ])

  const [activeTab, setActiveTab] = useState("new-request")
  const [url, setUrl] = useState("")
  const [method, setMethod] = useState("GET")
  const [headers, setHeaders] = useState("")
  const [body, setBody] = useState("")
  const [apiName, setApiName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const sendRequest = async () => {
    setIsLoading(true)
    setError(null)
    setResponse(null)

    try {
      const options: RequestInit = {
        method,
        headers: headers ? JSON.parse(headers) : {},
      }

      if (method !== "GET" && method !== "HEAD" && body) {
        options.body = body
      }

      const res = await fetch(url, options)
      let responseData

      const contentType = res.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        responseData = await res.json()
      } else {
        responseData = await res.text()
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        data: responseData,
      })
    } catch (err: any) {
      setError(err.message || "An error occurred while sending the request")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const saveApi = () => {
    if (apiName && url) {
      setSavedApis([...savedApis, { name: apiName, url, method }])
      setApiName("")
    }
  }

  const loadSavedApi = (api: { name: string; url: string; method: string }) => {
    setUrl(api.url)
    setMethod(api.method)
    setActiveTab("new-request")
  }

  const deleteSavedApi = (index: number) => {
    const newApis = [...savedApis]
    newApis.splice(index, 1)
    setSavedApis(newApis)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>API Request Tester</CardTitle>
        <CardDescription>Test any API endpoint with custom requests</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new-request">New Request</TabsTrigger>
            <TabsTrigger value="saved-apis">Saved APIs ({savedApis.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="new-request" className="space-y-4 mt-4">
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
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="request-headers">Headers (JSON)</Label>
              <Textarea
                id="request-headers"
                placeholder='{"Content-Type": "application/json"}'
                value={headers}
                onChange={(e) => setHeaders(e.target.value)}
                rows={3}
              />
            </div>

            {(method === "POST" || method === "PUT" || method === "PATCH") && (
              <div>
                <Label htmlFor="request-body">Body</Label>
                <Textarea
                  id="request-body"
                  placeholder='{"key": "value"}'
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={5}
                />
              </div>
            )}

            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="api-name">Save as</Label>
                <Input
                  id="api-name"
                  placeholder="API Name"
                  value={apiName}
                  onChange={(e) => setApiName(e.target.value)}
                />
              </div>
              <Button variant="outline" className="mt-auto" onClick={saveApi} disabled={!apiName || !url}>
                <Plus className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {response && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Response</Label>
                  <div className="flex items-center gap-2">
                    <div
                      className={`px-2 py-1 text-xs rounded ${
                        response.status >= 200 && response.status < 300
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {response.status} {response.statusText}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigator.clipboard.writeText(JSON.stringify(response.data, null, 2))}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Textarea
                  value={JSON.stringify(response.data, null, 2)}
                  readOnly
                  rows={10}
                  className="font-mono text-sm"
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved-apis" className="mt-4">
            {savedApis.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No saved APIs yet. Create and save a request to see it here.
              </div>
            ) : (
              <div className="space-y-2">
                {savedApis.map((api, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <div className="font-medium">{api.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.5 text-xs rounded ${
                            api.method === "GET"
                              ? "bg-blue-100 text-blue-800"
                              : api.method === "POST"
                                ? "bg-green-100 text-green-800"
                                : api.method === "PUT"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : api.method === "DELETE"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {api.method}
                        </span>
                        <span className="truncate max-w-[200px]">{api.url}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => loadSavedApi(api)}>
                        Load
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => deleteSavedApi(index)}>
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
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
            "Send Request"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

