import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react"

export function SecurityStatus() {
  // Sample security data
  const securityStatus = {
    overallStatus: "secure", // secure, warning, breach
    lastScan: "2025-03-07T22:30:00Z",
    zkpVerifications: 1245,
    failedVerifications: 2,
    activeThreats: 0,
    securityEvents: [
      { type: "authentication", status: "success", count: 387 },
      { type: "authorization", status: "success", count: 952 },
      { type: "dataAccess", status: "warning", count: 12 },
      { type: "apiAccess", status: "success", count: 2145 },
    ],
  }

  // Function to get the security icon based on status
  const getSecurityIcon = (status: string) => {
    switch (status) {
      case "secure":
        return <ShieldCheck className="h-8 w-8 text-green-500" />
      case "warning":
        return <ShieldAlert className="h-8 w-8 text-yellow-500" />
      case "breach":
        return <ShieldX className="h-8 w-8 text-red-500" />
      default:
        return <Shield className="h-8 w-8 text-gray-500" />
    }
  }

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Security Status</CardTitle>
          <CardDescription>Current security status and recent events</CardDescription>
        </div>
        {getSecurityIcon(securityStatus.overallStatus)}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Last Security Scan</p>
              <p className="text-lg font-semibold">{formatDate(securityStatus.lastScan)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">ZKP Verifications</p>
              <p className="text-lg font-semibold">{securityStatus.zkpVerifications}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Failed Verifications</p>
              <p className="text-lg font-semibold">{securityStatus.failedVerifications}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Active Threats</p>
              <p className="text-lg font-semibold">{securityStatus.activeThreats}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Security Events</h4>
            <div className="grid grid-cols-2 gap-2">
              {securityStatus.securityEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between rounded-md border p-2">
                  <span className="text-sm capitalize">{event.type}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{event.count}</span>
                    <div
                      className={`h-2 w-2 rounded-full ${
                        event.status === "success"
                          ? "bg-green-500"
                          : event.status === "warning"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

