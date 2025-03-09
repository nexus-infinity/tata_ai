import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

// Sample log data
const logs = [
  {
    id: 1,
    timestamp: "2025-03-07T23:15:42Z",
    module: "tata-core",
    level: "info",
    message: "Decision engine processed request #45982 successfully",
  },
  {
    id: 2,
    timestamp: "2025-03-07T23:14:18Z",
    module: "tata-zkp",
    level: "warning",
    message: "Verification delay detected in proof generation",
  },
  {
    id: 3,
    timestamp: "2025-03-07T23:12:55Z",
    module: "tata-memex",
    level: "info",
    message: "Knowledge base updated with 128 new entries",
  },
  {
    id: 4,
    timestamp: "2025-03-07T23:10:22Z",
    module: "tata-flow",
    level: "info",
    message: "Resource allocation optimized for batch processing",
  },
  {
    id: 5,
    timestamp: "2025-03-07T23:08:47Z",
    module: "tata-moto",
    level: "info",
    message: "Self-optimization cycle completed, 3 parameters adjusted",
  },
  {
    id: 6,
    timestamp: "2025-03-07T23:05:31Z",
    module: "tata-core",
    level: "error",
    message: "Failed to connect to external API endpoint",
  },
  {
    id: 7,
    timestamp: "2025-03-07T23:03:19Z",
    module: "tata-memex",
    level: "info",
    message: "Database backup completed successfully",
  },
  {
    id: 8,
    timestamp: "2025-03-07T23:01:05Z",
    module: "tata-flow",
    level: "info",
    message: "New processing job scheduled for execution",
  },
]

export function RecentLogs() {
  // Function to format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString()
  }

  // Function to get badge color based on log level
  const getBadgeVariant = (level: string) => {
    switch (level) {
      case "error":
        return "destructive"
      case "warning":
        return "warning"
      case "info":
        return "default"
      default:
        return "secondary"
    }
  }

  // Function to get module color
  const getModuleColor = (module: string) => {
    switch (module) {
      case "tata-core":
        return "text-orange-500"
      case "tata-memex":
        return "text-blue-500"
      case "tata-zkp":
        return "text-green-500"
      case "tata-flow":
        return "text-purple-500"
      case "tata-moto":
        return "text-pink-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Logs</CardTitle>
        <CardDescription>Latest system events and logs from all modules</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="flex flex-col space-y-1 border-b pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{formatTime(log.timestamp)}</span>
                    <span className={`text-xs font-medium ${getModuleColor(log.module)}`}>{log.module}</span>
                  </div>
                  <Badge variant={getBadgeVariant(log.level)}>{log.level}</Badge>
                </div>
                <p className="text-sm">{log.message}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

