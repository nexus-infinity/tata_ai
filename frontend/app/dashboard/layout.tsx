"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AISidebar } from "@/components/ai-sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
} from "lucide-react"

const navItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Tata Core",
    icon: Layers,
    href: "/dashboard/core",
  },
  {
    title: "Tata Memex",
    icon: Database,
    href: "/dashboard/memex",
  },
  {
    title: "Tata ZKP",
    icon: Lock,
    href: "/dashboard/zkp",
  },
  {
    title: "Tata Flow",
    icon: GitBranch,
    href: "/dashboard/flow",
  },
  {
    title: "Tata Moto",
    icon: FileCode,
    href: "/dashboard/moto",
  },
  {
    title: "Models",
    icon: Cpu,
    href: "/dashboard/models",
  },
  {
    title: "API Management",
    icon: FileJson,
    href: "/dashboard/api",
  },
  {
    title: "Security",
    icon: Shield,
    href: "/dashboard/security",
  },
  {
    title: "Logs",
    icon: ScrollText,
    href: "/dashboard/logs",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    href: "/dashboard/analytics",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex h-screen bg-background">
      <AISidebar />
      <div className="flex flex-1 flex-col ml-64">
        {/* Top Navigation */}
        <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-6">
          <ScrollArea className="max-w-full" orientation="horizontal">
            <nav className="flex items-center space-x-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Button
                    key={item.href}
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "h-9 gap-2",
                      isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                    )}
                    asChild
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span className="hidden sm:inline-block">{item.title}</span>
                    </Link>
                  </Button>
                )
              })}
            </nav>
          </ScrollArea>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}

