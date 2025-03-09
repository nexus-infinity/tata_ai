import { DashboardLayout } from "@/components/dashboard-layout"
import { SecurityDashboard } from "@/components/security-dashboard"

export default function SecurityPage() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Security</h1>
      </div>
      <div className="mt-6">
        <SecurityDashboard />
      </div>
    </DashboardLayout>
  )
}

