"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { VisualTemplateSilo } from "@/components/visual-template-silo"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeftRight, Download, LayoutTemplate, Upload } from 'lucide-react'
import { TemplateSiloComparison } from "@/components/template-silo-comparison"

// Sample template data - in a real app, you would fetch this from your API
const sampleTemplates = {
  Core: {
    version: "4.1",
    database: {
      type: "postgresql",
      host: "db.tata.local",
      port: 5432,
      username: "tata_core_user",
      password: "${TATA_CORE_DB_PASSWORD}",
      database_name: "tata_core_db",
      schema: "dynamic",
      auto_migration: true,
      failover_strategy: "switch_to_local",
      encryption: "AES-256",
    },
    authentication: {
      method: "oauth2",
      api_keys: {
        tata_core: "${TATA_CORE_API_KEY}",
        tata_memex: "${TATA_MEMEX_API_KEY}",
        tata_moto: "${TATA_MOTO_API_KEY}",
        tata_zkp: "${TATA_ZKP_API_KEY}",
      },
      auto_rotate_keys: true,
      rotation_interval_days: 30,
      encryption: {
        protocol: "TLS 1.3",
        enable_mutual_auth: true,
      },
    },
    communication: {
      protocol: "grpc",
      fallback: "websockets",
      heartbeat_interval: "10s",
      reconnect_on_failure: true,
      load_balancing: "adaptive",
    },
    schema_management: {
      adaptive: true,
      validation_before_update: true,
      safe_mode: {
        enabled: true,
        rollback_on_failure: true,
        admin_approval_required: false,
      },
      versioning: {
        enabled: true,
        retain_versions: 5,
      },
    },
    resources: {
      cpu: "2",
      memory: "4Gi",
      storage: "20Gi",
      scaling: {
        min_replicas: 1,
        max_replicas: 5,
        target_cpu_utilization: 70,
      },
    },
    security: {
      credentialRotation: {
        enabled: true,
        rotationInterval: 30,
        rotationMethod: "auto",
      },
      credentialExpiration: {
        enabled: true,
        expirationDate: "2025-12-31T23:59:59Z",
      },
      auditing: {
        enabled: true,
        auditLogs: {
          endpoint: "/audit/logs",
          logLevel: "INFO",
        },
      },
    },
  },
  Flow: {
    version: "4.1",
    database: {
      type: "postgresql",
      host: "db.tata.local",
      port: 5432,
      username: "tata_flow_user",
      password: "${TATA_FLOW_DB_PASSWORD}",
      database_name: "tata_flow_db",
      schema: "dynamic",
      auto_migration: true,
      failover_strategy: "switch_to_local",
      encryption: "AES-256",
    },
    communication: {
      protocol: "grpc",
      fallback: "websockets",
      heartbeat_interval: "10s",
      reconnect_on_failure: true,
      load_balancing: "adaptive",
    },
    resources: {
      cpu: "1",
      memory: "2Gi",
      storage: "10Gi",
      scaling: {
        min_replicas: 1,
        max_replicas: 3,
        target_cpu_utilization: 80,
      },
    },
  },
  Memex: {
    version: "4.1",
    database: {
      type: "postgresql",
      host: "db.tata.local",
      port: 5432,
      username: "tata_memex_user",
      password: "${TATA_MEMEX_DB_PASSWORD}",
      database_name: "tata_memex_db",
      schema: "dynamic",
      auto_migration: true,
      failover_strategy: "switch_to_local",
      encryption: "AES-256",
    },
    resources: {
      cpu: "4",
      memory: "8Gi",
      storage: "100Gi",
      scaling: {
        min_replicas: 2,
        max_replicas: 6,
        target_cpu_utilization: 70,
      },
    },
    schema_management: {
      adaptive: true,
      validation_before_update: true,
      versioning: {
        enabled: true,
        retain_versions: 10,
      },
    },
  },
  Moto: {
    version: "4.1",
    database: {
      type: "mongodb",
      host: "mongo.tata.local",
      port: 27017,
      username: "tata_moto_user",
      password: "${TATA_MOTO_DB_PASSWORD}",
      database_name: "tata_moto_db",
      auto_migration: true,
      failover_strategy: "switch_to_local",
      encryption: "AES-256",
    },
    communication: {
      protocol: "grpc",
      fallback: "rest",
      heartbeat_interval: "5s",
      reconnect_on_failure: true,
    },
  },
  ZKP: {
    version: "4.1",
    database: {
      type: "postgresql",
      host: "db.tata.local",
      port: 5432,
      username: "tata_zkp_user",
      password: "${TATA_ZKP_DB_PASSWORD}",
      database_name: "tata_zkp_db",
      schema: "dynamic",
      auto_migration: true,
      failover_strategy: "switch_to_local",
      encryption: "AES-256",
    },
    security: {
      credentialRotation: {
        enabled: true,
        rotationInterval: 15, // More frequent for security node
        rotationMethod: "auto",
      },
      credentialExpiration: {
        enabled: true,
        expirationDate: "2025-12-31T23:59:59Z",
      },
    },
    authentication: {
      method: "oauth2",
      api_keys: {
        tata_zkp: "${TATA_ZKP_API_KEY}",
      },
      auto_rotate_keys: true,
      rotation_interval_days: 15,
    },
  },
}

// Define the bands that are universal across all nodes
const TEMPLATE_BANDS = [
  {
    id: "database",
    name: "Database",
    color: "from-blue-500 to-blue-600",
    icon: "🗄️",
    description: "Database connection and schema management parameters",
  },
  {
    id: "authentication",
    name: "Authentication",
    color: "from-green-500 to-green-600",
    icon: "🔐",
    description: "Authentication and security parameters",
  },
  {
    id: "communication",
    name: "Communication",
    color: "from-purple-500 to-purple-600",
    icon: "📡",
    description: "Inter-node communication parameters",
  },
  {
    id: "schema_management",
    name: "Schema Management",
    color: "from-amber-500 to-amber-600",
    icon: "📊",
    description: "Schema adaptation and versioning parameters",
  },
  {
    id: "resources",
    name: "Resources",
    color: "from-red-500 to-red-600",
    icon: "💻",
    description: "CPU, memory, and storage resource parameters",
  },
  {
    id: "security",
    name: "Security",
    color: "from-indigo-500 to-indigo-600",
    icon: "🔒",
    description: "Security and credential management parameters",
  },
]

// Sample node types
const NODE_TYPES = ["Core", "Flow", "Memex", "Moto", "ZKP"]

export default function TemplateSilosPage() {
  const [templates, setTemplates] = useState(sampleTemplates)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [selectedBand, setSelectedBand] = useState<string | null>(null)
  const [editData, setEditData] = useState<string>("")
  const [viewMode, setViewMode] = useState<"silos" | "comparison">("silos")
  const [expandedSilo, setExpandedSilo] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState<string>("visual")
  const [comparisonBand, setComparisonBand] = useState<string>("database")

  // In a real app, you would fetch templates from your API
  useEffect(() => {
    // Fetch templates from API
    // const fetchTemplates = async () => {
    //   const response = await fetch('/api/templates');
    //   const data = await response.json();
    //   setTemplates(data);
    // };
    // fetchTemplates();
  }, [])

  const handleBandClick = (nodeType: string, bandId: string) => {
    setSelectedNode(nodeType)
    setSelectedBand(bandId)

    const bandData = templates[nodeType]?.[bandId]
    setEditData(bandData ? JSON.stringify(bandData, null, 2) : "{}")
  }

  const handleSave = () => {
    if (selectedNode && selectedBand) {
      try {
        const parsedData = JSON.parse(editData)

        setTemplates((prev) => ({
          ...prev,
          [selectedNode]: {
            ...prev[selectedNode],
            [selectedBand]: parsedData,
          },
        }))

        setSelectedNode(null)
        setSelectedBand(null)

        // In a real app, you would save to your API
        // const saveToApi = async () => {
        //   await fetch('/api/templates', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //       nodeType: selectedNode,
        //       bandId: selectedBand,
        //       data: parsedData
        //     })
        //   });
        // };
        // saveToApi();
      } catch (error) {
        console.error("Invalid JSON:", error)
        // You could add error handling UI here
      }
    }
  }

  const toggleSiloExpand = (nodeType: string) => {
    setExpandedSilo(expandedSilo === nodeType ? null : nodeType)
  }

  const getBandConfigurationCount = (bandId: string) => {
    return NODE_TYPES.filter(
      (nodeType) => templates[nodeType]?.[bandId] && Object.keys(templates[nodeType][bandId]).length > 0,
    ).length
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Template Silos</h1>
          <p className="text-muted-foreground">View and manage universal parameter bands across all AI nodes</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "silos" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("silos")}
            className="gap-1"
          >
            <LayoutTemplate className="h-4 w-4" />
            <span>Silos View</span>
          </Button>
          <Button
            variant={viewMode === "comparison" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("comparison")}
            className="gap-1"
          >
            <ArrowLeftRight className="h-4 w-4" />
            <span>Comparison View</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Upload className="h-4 w-4" />
            <span>Import</span>
          </Button>
        </div>
      </div>

      {viewMode === "silos" && (
        <motion.div
          className="grid grid-cols-5 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {NODE_TYPES.map((nodeType) => {
            const isExpanded = expandedSilo === nodeType
            const colSpan = isExpanded ? 3 : 1

            return (
              <VisualTemplateSilo
                key={nodeType}
                nodeType={nodeType}
                template={templates[nodeType] || {}}
                onBandClick={(bandId) => handleBandClick(nodeType, bandId)}
                isExpanded={isExpanded}
                onToggleExpand={() => toggleSiloExpand(nodeType)}
              />
            )
          })}
        </motion.div>
      )}

      {viewMode === "comparison" && <TemplateSiloComparison templates={templates} />}

      {/* Edit Dialog */}
      <Dialog
        open={selectedNode !== null && selectedBand !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedNode(null)
            setSelectedBand(null)
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Edit {selectedNode} - {TEMPLATE_BANDS.find((b) => b.id === selectedBand)?.name} Parameters
            </DialogTitle>
            <DialogDescription>
              Modify the {TEMPLATE_BANDS.find((b) => b.id === selectedBand)?.name?.toLowerCase() || ""} parameters for{" "}
              {selectedNode} AI node.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="parameters">Parameters (JSON)</Label>
              <Textarea
                id="parameters"
                className="font-mono h-[300px]"
                value={editData}
                onChange={(e) => setEditData(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedNode(null)
                setSelectedBand(null)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}