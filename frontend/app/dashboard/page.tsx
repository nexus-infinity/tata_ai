"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* System Status Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">System Status</h2>
        <Card className="p-4 mb-4">
          <div className="flex items-center mb-2">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="font-medium">Active</span>
          </div>
          <p className="text-sm text-muted-foreground">Operational+Healthy</p>
        </Card>
      </div>

      {/* ZKP Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">ZKP</h2>
        <Card className="p-4 mb-4">
          <div className="flex items-center mb-2">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="font-medium">Active</span>
          </div>
          <p className="text-sm text-muted-foreground">Operational+Healthy</p>
        </Card>
      </div>

      {/* System Status Details */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">System Status</h2>
        <p className="text-sm text-muted-foreground mb-4">Real-time status of all system components</p>

        <Tabs defaultValue="overview" className="mb-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Card className="p-4 mb-4">
              <h3 className="font-medium mb-2">Core Status</h3>
              <p className="mb-1">Operational</p>
              <p className="font-medium">100%</p>
            </Card>

            <Card className="p-4 mb-4">
              <h3 className="font-medium mb-2">API Status</h3>
              <p className="mb-1">Operational</p>
              <p className="font-medium">100%</p>
            </Card>

            <Card className="p-4 mb-4">
              <h3 className="font-medium mb-2">Database Status</h3>
              <p className="mb-1">Operational</p>
              <p className="font-medium">100%</p>
            </Card>

            <Card className="p-4 mb-4">
              <h3 className="font-medium mb-2">Model Status</h3>
              <p className="mb-1">Operational</p>
              <p className="font-medium">100%</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <p className="text-sm text-muted-foreground mb-4">Common tasks and shortcuts</p>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            View Template Silos
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="flex items-center gap-1">
            Project Structure
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="flex items-center gap-1">
            Manage Models
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="flex items-center gap-1">
            API Documentation
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="flex items-center gap-1">
            View System Logs
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

