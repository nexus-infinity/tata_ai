"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from "recharts"

// Sample data for the charts
const cpuData = [
  { time: "00:00", core: 45, memex: 30, zkp: 25, flow: 35, moto: 20 },
  { time: "01:00", core: 50, memex: 35, zkp: 30, flow: 40, moto: 25 },
  { time: "02:00", core: 55, memex: 40, zkp: 35, flow: 45, moto: 30 },
  { time: "03:00", core: 60, memex: 45, zkp: 40, flow: 50, moto: 35 },
  { time: "04:00", core: 65, memex: 50, zkp: 45, flow: 55, moto: 40 },
  { time: "05:00", core: 70, memex: 55, zkp: 50, flow: 60, moto: 45 },
  { time: "06:00", core: 75, memex: 60, zkp: 55, flow: 65, moto: 50 },
  { time: "07:00", core: 80, memex: 65, zkp: 60, flow: 70, moto: 55 },
  { time: "08:00", core: 75, memex: 60, zkp: 55, flow: 65, moto: 50 },
  { time: "09:00", core: 70, memex: 55, zkp: 50, flow: 60, moto: 45 },
  { time: "10:00", core: 65, memex: 50, zkp: 45, flow: 55, moto: 40 },
  { time: "11:00", core: 60, memex: 45, zkp: 40, flow: 50, moto: 35 },
]

const memoryData = [
  { time: "00:00", core: 1.2, memex: 2.5, zkp: 0.8, flow: 1.5, moto: 0.7 },
  { time: "01:00", core: 1.3, memex: 2.6, zkp: 0.9, flow: 1.6, moto: 0.8 },
  { time: "02:00", core: 1.4, memex: 2.7, zkp: 1.0, flow: 1.7, moto: 0.9 },
  { time: "03:00", core: 1.5, memex: 2.8, zkp: 1.1, flow: 1.8, moto: 1.0 },
  { time: "04:00", core: 1.6, memex: 2.9, zkp: 1.2, flow: 1.9, moto: 1.1 },
  { time: "05:00", core: 1.7, memex: 3.0, zkp: 1.3, flow: 2.0, moto: 1.2 },
  { time: "06:00", core: 1.8, memex: 3.1, zkp: 1.4, flow: 2.1, moto: 1.3 },
  { time: "07:00", core: 1.9, memex: 3.2, zkp: 1.5, flow: 2.2, moto: 1.4 },
  { time: "08:00", core: 1.8, memex: 3.1, zkp: 1.4, flow: 2.1, moto: 1.3 },
  { time: "09:00", core: 1.7, memex: 3.0, zkp: 1.3, flow: 2.0, moto: 1.2 },
  { time: "10:00", core: 1.6, memex: 2.9, zkp: 1.2, flow: 1.9, moto: 1.1 },
  { time: "11:00", core: 1.5, memex: 2.8, zkp: 1.1, flow: 1.8, moto: 1.0 },
]

const networkData = [
  { time: "00:00", core: 50, memex: 120, zkp: 30, flow: 80, moto: 25 },
  { time: "01:00", core: 55, memex: 125, zkp: 35, flow: 85, moto: 30 },
  { time: "02:00", core: 60, memex: 130, zkp: 40, flow: 90, moto: 35 },
  { time: "03:00", core: 65, memex: 135, zkp: 45, flow: 95, moto: 40 },
  { time: "04:00", core: 70, memex: 140, zkp: 50, flow: 100, moto: 45 },
  { time: "05:00", core: 75, memex: 145, zkp: 55, flow: 105, moto: 50 },
  { time: "06:00", core: 80, memex: 150, zkp: 60, flow: 110, moto: 55 },
  { time: "07:00", core: 85, memex: 155, zkp: 65, flow: 115, moto: 60 },
  { time: "08:00", core: 80, memex: 150, zkp: 60, flow: 110, moto: 55 },
  { time: "09:00", core: 75, memex: 145, zkp: 55, flow: 105, moto: 50 },
  { time: "10:00", core: 70, memex: 140, zkp: 50, flow: 100, moto: 45 },
  { time: "11:00", core: 65, memex: 135, zkp: 45, flow: 95, moto: 40 },
]

const requestsData = [
  { name: "Core", value: 4500 },
  { name: "Memex", value: 8200 },
  { name: "ZKP", value: 2100 },
  { name: "Flow", value: 5800 },
  { name: "Moto", value: 3200 },
]

export function SystemMetrics() {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>System Metrics</CardTitle>
        <CardDescription>Performance metrics for all Tata AI modules</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="cpu">
          <TabsList className="mb-4">
            <TabsTrigger value="cpu">CPU Usage</TabsTrigger>
            <TabsTrigger value="memory">Memory Usage</TabsTrigger>
            <TabsTrigger value="network">Network Traffic</TabsTrigger>
            <TabsTrigger value="requests">API Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="cpu" className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cpuData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis label={{ value: "CPU Usage (%)", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="core" stroke="#f97316" name="Tata Core" />
                <Line type="monotone" dataKey="memex" stroke="#3b82f6" name="Tata Memex" />
                <Line type="monotone" dataKey="zkp" stroke="#10b981" name="Tata ZKP" />
                <Line type="monotone" dataKey="flow" stroke="#a855f7" name="Tata Flow" />
                <Line type="monotone" dataKey="moto" stroke="#f43f5e" name="Tata Moto" />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="memory" className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={memoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis label={{ value: "Memory Usage (GB)", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="core" stroke="#f97316" name="Tata Core" />
                <Line type="monotone" dataKey="memex" stroke="#3b82f6" name="Tata Memex" />
                <Line type="monotone" dataKey="zkp" stroke="#10b981" name="Tata ZKP" />
                <Line type="monotone" dataKey="flow" stroke="#a855f7" name="Tata Flow" />
                <Line type="monotone" dataKey="moto" stroke="#f43f5e" name="Tata Moto" />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="network" className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={networkData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis label={{ value: "Network Traffic (MB/s)", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="core" stroke="#f97316" name="Tata Core" />
                <Line type="monotone" dataKey="memex" stroke="#3b82f6" name="Tata Memex" />
                <Line type="monotone" dataKey="zkp" stroke="#10b981" name="Tata ZKP" />
                <Line type="monotone" dataKey="flow" stroke="#a855f7" name="Tata Flow" />
                <Line type="monotone" dataKey="moto" stroke="#f43f5e" name="Tata Moto" />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="requests" className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={requestsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: "API Requests (last 24h)", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3b82f6" name="API Requests" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

