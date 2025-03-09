import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function DatabaseStatus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Database Status</CardTitle>
        <CardDescription>Current status of MongoDB and PostgreSQL databases</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="font-medium">MongoDB</span>
              </div>
              <span className="text-sm text-muted-foreground">3.2 GB / 10 GB</span>
            </div>
            <Progress value={32} className="h-2" />
            <div className="grid grid-cols-3 text-xs text-muted-foreground">
              <div>
                <span className="font-medium">Connections:</span> 24/100
              </div>
              <div>
                <span className="font-medium">Queries/sec:</span> 156
              </div>
              <div>
                <span className="font-medium">Latency:</span> 12ms
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="font-medium">PostgreSQL</span>
              </div>
              <span className="text-sm text-muted-foreground">1.8 GB / 5 GB</span>
            </div>
            <Progress value={36} className="h-2" />
            <div className="grid grid-cols-3 text-xs text-muted-foreground">
              <div>
                <span className="font-medium">Connections:</span> 18/50
              </div>
              <div>
                <span className="font-medium">Queries/sec:</span> 89
              </div>
              <div>
                <span className="font-medium">Latency:</span> 8ms
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

