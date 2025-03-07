import { DashboardLayout } from "@/components/dashboard-layout"
import { ModuleStatusOverview } from "@/components/module-status-overview"
import { SystemArchitecture } from "@/components/system-architecture"
import { SystemMetrics } from "@/components/system-metrics"
import { RecentLogs } from "@/components/recent-logs"
import { DatabaseStatus } from "@/components/database-status"
import { SecurityStatus } from "@/components/security-status"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
        <div className="flex gap-2">
          <Link href="/dashboard/security">
            <Button variant="outline">
              Security Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard/models">
            <Button variant="outline">
              Model Registry
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard/api">
            <Button variant="outline">
              API Management
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-6">
        <ModuleStatusOverview />
      </div>

      <div className="mt-6">
        <SystemArchitecture />
      </div>

      <div className="mt-6">
        <SystemMetrics />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <RecentLogs />
        <div className="space-y-6">
          <SecurityStatus />
          <DatabaseStatus />
        </div>
      </div>
    </DashboardLayout>
  )
}

