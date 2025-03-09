"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, CheckCircle, FileText, Lock, RefreshCw, Shield, ShieldAlert, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SecurityDashboard() {
  // Sample security data
  const securityData = {
    inputValidation: {
      status: "secure",
      score: 92,
      totalRequests: 15782,
      validatedRequests: 15782,
      failedValidations: 0,
      lastScan: "2025-03-07T22:30:00Z",
    },
    encryption: {
      status: "secure",
      score: 100,
      encryptedData: "100%",
      encryptionAlgorithm: "AES-256",
      lastScan: "2025-03-07T22:30:00Z",
    },
    authentication: {
      status: "secure",
      score: 95,
      totalAttempts: 387,
      successfulAttempts: 385,
      failedAttempts: 2,
      lastScan: "2025-03-07T22:30:00Z",
    },
    zkpVerification: {
      status: "warning",
      score: 85,
      totalVerifications: 1245,
      successfulVerifications: 1243,
      failedVerifications: 2,
      lastScan: "2025-03-07T22:30:00Z",
    },
    securityAudit: {
      lastFullAudit: "2025-03-01T10:00:00Z",
      nextScheduledAudit: "2025-04-01T10:00:00Z",
      criticalIssues: 0,
      highIssues: 0,
      mediumIssues: 1,
      lowIssues: 3,
    },
  }

  // Function to get security status icon
  const getSecurityIcon = (status: string) => {
    switch (status) {
      case "secure":
        return <ShieldCheck className="h-5 w-5 text-green-500" />
      case "warning":
        return <ShieldAlert className="h-5 w-5 text-yellow-500" />
      case "breach":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      default:
        return <Shield className="h-5 w-5 text-gray-500" />
    }
  }

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Security Dashboard</CardTitle>
            <CardDescription>Comprehensive security monitoring and management</CardDescription>
          </div>
          <Button>
            <RefreshCw className="mr-2 h-4 w-4" />
            Run Security Scan
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="input-validation">Input Validation</TabsTrigger>
            <TabsTrigger value="encryption">Encryption</TabsTrigger>
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
            <TabsTrigger value="zkp">ZKP Verification</TabsTrigger>
            <TabsTrigger value="audit">Security Audit</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between p-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <CardTitle className="text-sm">Input Validation</CardTitle>
                  </div>
                  {getSecurityIcon(securityData.inputValidation.status)}
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">{securityData.inputValidation.score}/100</div>
                  <Progress value={securityData.inputValidation.score} className="h-2 mt-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {securityData.inputValidation.totalRequests} requests validated
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between p-4">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-green-500" />
                    <CardTitle className="text-sm">Encryption</CardTitle>
                  </div>
                  {getSecurityIcon(securityData.encryption.status)}
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">{securityData.encryption.score}/100</div>
                  <Progress value={securityData.encryption.score} className="h-2 mt-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {securityData.encryption.encryptedData} data encrypted with{" "}
                    {securityData.encryption.encryptionAlgorithm}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-500" />
                    <CardTitle className="text-sm">Authentication</CardTitle>
                  </div>
                  {getSecurityIcon(securityData.authentication.status)}
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">{securityData.authentication.score}/100</div>
                  <Progress value={securityData.authentication.score} className="h-2 mt-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {securityData.authentication.successfulAttempts}/{securityData.authentication.totalAttempts}{" "}
                    successful authentications
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between p-4">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-orange-500" />
                    <CardTitle className="text-sm">ZKP Verification</CardTitle>
                  </div>
                  {getSecurityIcon(securityData.zkpVerification.status)}
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">{securityData.zkpVerification.score}/100</div>
                  <Progress value={securityData.zkpVerification.score} className="h-2 mt-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {securityData.zkpVerification.successfulVerifications}/
                    {securityData.zkpVerification.totalVerifications} successful verifications
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Security Audit Summary</CardTitle>
                <CardDescription>
                  Last full audit: {formatDate(securityData.securityAudit.lastFullAudit)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="grid grid-cols-4 gap-4 flex-1">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-500">{securityData.securityAudit.criticalIssues}</div>
                      <div className="text-sm text-muted-foreground">Critical</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-500">{securityData.securityAudit.highIssues}</div>
                      <div className="text-sm text-muted-foreground">High</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-500">
                        {securityData.securityAudit.mediumIssues}
                      </div>
                      <div className="text-sm text-muted-foreground">Medium</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-500">{securityData.securityAudit.lowIssues}</div>
                      <div className="text-sm text-muted-foreground">Low</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Next scheduled audit</div>
                    <div className="font-medium">{formatDate(securityData.securityAudit.nextScheduledAudit)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="input-validation">
            <Card>
              <CardHeader>
                <CardTitle>Input Validation Details</CardTitle>
                <CardDescription>Detailed information about input validation across all modules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full rounded-md border border-dashed flex items-center justify-center text-muted-foreground">
                  Input validation details (validation rules, failed validations, request patterns)
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="encryption">
            <Card>
              <CardHeader>
                <CardTitle>Encryption Details</CardTitle>
                <CardDescription>Detailed information about data encryption across all modules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full rounded-md border border-dashed flex items-center justify-center text-muted-foreground">
                  Encryption details (algorithms, key management, encrypted data types)
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="authentication">
            <Card>
              <CardHeader>
                <CardTitle>Authentication Details</CardTitle>
                <CardDescription>Detailed information about authentication and authorization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full rounded-md border border-dashed flex items-center justify-center text-muted-foreground">
                  Authentication details (login attempts, JWT usage, role-based access)
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="zkp">
            <Card>
              <CardHeader>
                <CardTitle>ZKP Verification Details</CardTitle>
                <CardDescription>Detailed information about zero-knowledge proof verifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full rounded-md border border-dashed flex items-center justify-center text-muted-foreground">
                  ZKP verification details (proof types, verification times, failure analysis)
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle>Security Audit Details</CardTitle>
                <CardDescription>Detailed information about security audits and findings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full rounded-md border border-dashed flex items-center justify-center text-muted-foreground">
                  Security audit details (findings, remediation status, audit history)
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

