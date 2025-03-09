"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Layers,
  Database,
  Lock,
  GitBranch,
  FileCode,
  Settings,
  BarChart3,
  FileJson,
  Shield,
  ScrollText,
  Cpu,
  Search,
  ChevronDown,
  LayoutTemplate,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Map of AI core modules with their icons
const aiCores = [
  { name: "Core", icon: Layers, path: "/dashboard/core" },
  { name: "Flow", icon: GitBranch, path: "/dashboard/flow" },
  { name: "Memex", icon: Database, path: "/dashboard/memex" },
  { name: "Moto", icon: FileCode, path: "/dashboard/moto" },
  { name: "ZKP", icon: Lock, path: "/dashboard/zkp" },
]

export function AISidebar() {
  const pathname = usePathname()
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(true)

  return (
    <div className="fixed inset-y-0 left-0 z-20 flex h-full w-64 flex-col border-r bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Layers size={18} />
          </div>
          <div className="font-semibold">Tata AI Dashboard</div>
        </div>
        <div className="px-4 py-2">
          <div className="relative">
            <Input
              placeholder="Search..."
              className="w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="px-3 py-2">
          <h3 className="mb-2 px-4 text-xs font-semibold uppercase text-muted-foreground">AI Core Modules</h3>
          <nav className="space-y-1">
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted",
                pathname === "/dashboard" ? "bg-muted" : "",
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            {aiCores.map((core) => (
              <Link
                key={core.name}
                href={core.path}
                className={cn(
                  "flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted",
                  pathname === core.path ? "bg-muted" : "",
                )}
              >
                <core.icon className="h-4 w-4" />
                <span>{core.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="px-3 py-2">
          <h3 className="mb-2 px-4 text-xs font-semibold uppercase text-muted-foreground">Schema Management</h3>
          <nav className="space-y-1">
            <Link
              href="/dashboard/schema-selection"
              className={cn(
                "flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted",
                pathname === "/dashboard/schema-selection" ? "bg-muted" : "",
              )}
            >
              <Database className="h-4 w-4" />
              <span>Knowledge Base</span>
            </Link>
            <Link
              href="/dashboard/dynamic-schemas"
              className={cn(
                "flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted",
                pathname === "/dashboard/dynamic-schemas" ? "bg-muted" : "",
              )}
            >
              <GitBranch className="h-4 w-4" />
              <span>Dynamic Schemas</span>
            </Link>
          </nav>
        </div>

        <div className="px-3 py-2">
          <Collapsible open={isTemplatesOpen} onOpenChange={setIsTemplatesOpen} className="w-full">
            <div className="flex items-center justify-between px-4">
              <h3 className="text-xs font-semibold uppercase text-muted-foreground">Templates</h3>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                  <ChevronDown className={cn("h-4 w-4 transition-transform", isTemplatesOpen ? "rotate-180" : "")} />
                  <span className="sr-only">Toggle templates</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <nav className="mt-1 space-y-1">
                <Link
                  href="/dashboard/templates"
                  className={cn(
                    "flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted",
                    pathname === "/dashboard/templates" ? "bg-muted" : "",
                  )}
                >
                  <FileJson className="h-4 w-4" />
                  <span>Templates</span>
                </Link>
                <Link
                  href="/dashboard/template-silos"
                  className={cn(
                    "flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted",
                    pathname === "/dashboard/template-silos" ? "bg-muted" : "",
                  )}
                >
                  <LayoutTemplate className="h-4 w-4" />
                  <span>Template Silos</span>
                </Link>
              </nav>
            </CollapsibleContent>
          </Collapsible>
        </div>

        <div className="px-3 py-2">
          <h3 className="mb-2 px-4 text-xs font-semibold uppercase text-muted-foreground">System</h3>
          <nav className="space-y-1">
            <Link
              href="/dashboard/models"
              className={cn(
                "flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted",
                pathname === "/dashboard/models" ? "bg-muted" : "",
              )}
            >
              <Cpu className="h-4 w-4" />
              <span>Models</span>
            </Link>
            <Link
              href="/dashboard/api"
              className={cn(
                "flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted",
                pathname === "/dashboard/api" ? "bg-muted" : "",
              )}
            >
              <FileJson className="h-4 w-4" />
              <span>API Management</span>
            </Link>
            <Link
              href="/dashboard/security"
              className={cn(
                "flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted",
                pathname === "/dashboard/security" ? "bg-muted" : "",
              )}
            >
              <Shield className="h-4 w-4" />
              <span>Security</span>
            </Link>
            <Link
              href="/dashboard/logs"
              className={cn(
                "flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted",
                pathname === "/dashboard/logs" ? "bg-muted" : "",
              )}
            >
              <ScrollText className="h-4 w-4" />
              <span>Logs</span>
            </Link>
            <Link
              href="/dashboard/analytics"
              className={cn(
                "flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted",
                pathname === "/dashboard/analytics" ? "bg-muted" : "",
              )}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </Link>
          </nav>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-3">
        <nav>
          <Link
            href="/dashboard/settings"
            className={cn(
              "flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted",
              pathname === "/dashboard/settings" ? "bg-muted" : "",
            )}
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </nav>
      </div>
    </div>
  )
}

