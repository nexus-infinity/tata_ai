import { DashboardLayout } from "@/components/dashboard-layout"
import { ApiManagement } from "@/components/api-management"

export default function ApiPage() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">API Management</h1>
      </div>
      <div className="mt-6">
        <ApiManagement />
      </div>
    </DashboardLayout>
  )
}

