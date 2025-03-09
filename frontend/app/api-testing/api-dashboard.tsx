"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react"
import { HuggingFaceTester } from "./huggingface-tester"
import { GenericApiTester } from "./generic-api-tester"

export default function ApiTestingDashboard() {
  const [activeTab, setActiveTab] = useState("huggingface")

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">API Testing Dashboard</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="huggingface">Hugging Face API</TabsTrigger>
          <TabsTrigger value="custom">Custom APIs</TabsTrigger>
          <TabsTrigger value="status">API Status</TabsTrigger>
        </TabsList>

        <TabsContent value="huggingface" className="mt-6">
          <HuggingFaceTester />
        </TabsContent>

        <TabsContent value="custom" className="mt-6">
          <GenericApiTester />
        </TabsContent>

        <TabsContent value="status" className="mt-6">
          <ApiStatusDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ApiStatusDashboard() {
  const [apiStatus, setApiStatus] = useState({
    huggingface: "unknown",
    backend: "unknown",
    database: "unknown",
  })

  const [isLoading, setIsLoading] = useState(false)

  const checkAllStatus = async () => {
    setIsLoading(true)
    try {
      // Check Hugging Face API
      const hfStatus = await fetch("/api/test/huggingface").then((res) => (res.ok ? "online" : "offline"))

      // Check Backend API
      const backendStatus = await fetch("/api/health").then((res) => (res.ok ? "online" : "offline"))

      // Check Database connection
      const dbStatus = await fetch("/api/test/database").then((res) => (res.ok ? "online" : "offline"))

      setApiStatus({
        huggingface: hfStatus,
        backend: backendStatus,
        database: dbStatus,
      })
    } catch (error) {
      console.error("Error checking API status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Status Overview</CardTitle>
        <CardDescription>Check the status of all APIs used in this project</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatusCard title="Hugging Face API" status={apiStatus.huggingface} />
          <StatusCard title="Backend API" status={apiStatus.backend} />
          <StatusCard title="Database Connection" status={apiStatus.database} />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={checkAllStatus} disabled={isLoading} className="flex items-center gap-2">
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Check All Status
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

function StatusCard({ title, status }: { title: string; status: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {status === "online" && (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Online
          </Badge>
        )}
        {status === "offline" && (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            Offline
          </Badge>
        )}
        {status === "unknown" && <Badge variant="outline">Unknown</Badge>}
      </CardContent>
    </Card>
  )
}

