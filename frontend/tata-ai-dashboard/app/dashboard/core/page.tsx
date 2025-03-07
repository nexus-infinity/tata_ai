import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CorePage() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tata Core</h1>
      </div>
      <div className="mt-6">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Decision Engine Status</CardTitle>
                <CardDescription>Current status of the Tata Core decision-making engine</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">Active</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Uptime</p>
                    <p className="text-2xl font-bold">3d 12h 4m</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Decisions Made</p>
                    <p className="text-2xl font-bold">12,453</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Avg. Response Time</p>
                    <p className="text-2xl font-bold">124ms</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Decision Metrics</CardTitle>
                  <CardDescription>Performance metrics for the decision engine</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] w-full rounded-md border border-dashed flex items-center justify-center text-muted-foreground">
                    Decision metrics chart
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Resource Usage</CardTitle>
                  <CardDescription>CPU, memory, and network usage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] w-full rounded-md border border-dashed flex items-center justify-center text-muted-foreground">
                    Resource usage chart
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="configuration" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Core Configuration</CardTitle>
                <CardDescription>Configure the Tata Core decision-making engine</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full rounded-md border border-dashed flex items-center justify-center text-muted-foreground">
                  Configuration form
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="logs" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Core Logs</CardTitle>
                <CardDescription>Recent logs from the Tata Core module</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full rounded-md border border-dashed flex items-center justify-center text-muted-foreground">
                  Log viewer
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

