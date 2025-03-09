import { StatusCard } from "@/components/status-card"
import { Brain, Database, Lock, Workflow, Zap } from "lucide-react"

export function ModuleStatusOverview() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
      <StatusCard title="Tata Core" description="Decision-making engine" icon={Brain} value="Active" status="healthy" />
      <StatusCard
        title="Tata Memex"
        description="Knowledge management"
        icon={Database}
        value="Active"
        status="healthy"
      />
      <StatusCard title="Tata ZKP" description="Zero-knowledge proofs" icon={Lock} value="Warning" status="warning" />
      <StatusCard title="Tata Flow" description="Resource management" icon={Workflow} value="Active" status="healthy" />
      <StatusCard title="Tata Moto" description="Self-optimization" icon={Zap} value="Active" status="healthy" />
    </div>
  )
}

