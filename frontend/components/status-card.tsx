import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatusCardProps {
  title: string
  description: string
  icon: LucideIcon
  value: string
  status: "healthy" | "warning" | "error" | "inactive"
  className?: string
}

export function StatusCard({ title, description, icon: Icon, value, status, className }: StatusCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div
          className={cn(
            "rounded-full p-2",
            status === "healthy" && "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
            status === "warning" && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
            status === "error" && "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
            status === "inactive" && "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400",
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div
          className={cn(
            "mt-2 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
            status === "healthy" && "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
            status === "warning" && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
            status === "error" && "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
            status === "inactive" && "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400",
          )}
        >
          {status === "healthy" && "Healthy"}
          {status === "warning" && "Warning"}
          {status === "error" && "Error"}
          {status === "inactive" && "Inactive"}
        </div>
      </CardContent>
    </Card>
  )
}

