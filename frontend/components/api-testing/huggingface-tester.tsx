"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle, Copy, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function HuggingFaceTester() {
  const [token, setToken] = useState("")
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedTest, setSelectedTest] = useState("token-validation")
  const [modelId, setModelId] = useState("gpt2")
  const [prompt, setPrompt] = useState("Hello, world!")

  const validateToken = async () => {
    setIsLoading(true)
    setError(null)
    setTestResult(null)

    try {
      const response = await fetch("/api/test/huggingface/validate-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsTokenValid(true)
        setTestResult(data)
      } else {
        setIsTokenValid(false)
        setError(data.error || "Failed to validate token")
      }
    } catch (err) {
      setIsTokenValid(false)
      setError("An error occurred while validating the token")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const testModelInference = async () => {
    setIsLoading(true)
    setError(null)
    setTestResult(null)

    try {
      const response = await fetch("/api/test/huggingface/inference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          modelId,
          prompt,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setTestResult(data)
      } else {
        setError(data.error || "Failed to run inference")
      }
    } catch (err) {
      setError("An error occurred during inference")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const testModelList = async () => {
    setIsLoading(true)
    setError(null)
    setTestResult(null)

    try {
      const response = await fetch("/api/test/huggingface/list-models", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (response.ok) {
        setTestResult(data)
      } else {
        setError(data.error || "Failed to list models")
      }
    } catch (err) {
      setError("An error occurred while listing models")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const runSelectedTest = () => {
    switch (selectedTest) {
      case "token-validation":
        validateToken()
        break
      case "model-inference":
        testModelInference()
        break
      case "list-models":
        testModelList()
        break
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Hugging Face API Tester</CardTitle>
        <CardDescription>Test your Hugging Face API token and run inference</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="hf-token">API Token</Label>
          <Input
            id="hf-token"
            type="password"
            placeholder="Enter your Hugging Face API token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          {isTokenValid === true && (
            <div className="flex items-center text-green-500 text-sm mt-1">
              <CheckCircle className="h-4 w-4 mr-1" />
              Token is valid
            </div>
          )}
          {isTokenValid === false && (
            <div className="flex items-center text-red-500 text-sm mt-1">
              <AlertCircle className="h-4 w-4 mr-1" />
              Token is invalid
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="test-type">Test Type</Label>
          <Select value={selectedTest} onValueChange={setSelectedTest}>
            <SelectTrigger>
              <SelectValue placeholder="Select a test" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="token-validation">Token Validation</SelectItem>
              <SelectItem value="model-inference">Model Inference</SelectItem>
              <SelectItem value="list-models">List Models</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selectedTest === "model-inference" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="model-id">Model ID</Label>
              <Input
                id="model-id"
                placeholder="e.g., gpt2, t5-base"
                value={modelId}
                onChange={(e) => setModelId(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prompt">Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="Enter your prompt here"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
              />
            </div>
          </>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {testResult && (
          <div className="mt-4">
            <Label>Result</Label>
            <div className="relative mt-2">
              <Textarea value={JSON.stringify(testResult, null, 2)} readOnly rows={8} className="font-mono text-sm" />
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => navigator.clipboard.writeText(JSON.stringify(testResult, null, 2))}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={runSelectedTest} disabled={isLoading || !token} className="flex items-center gap-2">
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            "Run Test"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

