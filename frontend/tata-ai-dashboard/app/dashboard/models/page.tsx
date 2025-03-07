import { DashboardLayout } from "@/components/dashboard-layout"
import { ModelRegistry } from "@/components/model-registry"

export default function ModelsPage() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Model Registry</h1>
      </div>
      <div className="mt-6">
        <ModelRegistry />
      </div>
    </DashboardLayout>
  )
}

