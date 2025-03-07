"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  Boxes,
  Brain,
  Database,
  FileCode,
  Home,
  Lock,
  Server,
  Settings,
  Shield,
  Tag,
  Workflow,
  Zap,
} from "lucide-react"

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Tata Core",
    href: "/dashboard/core",
    icon: Brain,
  },
  {
    name: "Tata Memex",
    href: "/dashboard/memex",
    icon: Database,
  },
  {
    name: "Tata ZKP",
    href: "/dashboard/zkp",
    icon: Lock,
  },
  {
    name: "Tata Flow",
    href: "/dashboard/flow",
    icon: Workflow,
  },
  {
    name: "Tata Moto",
    href: "/dashboard/moto",
    icon: Zap,
  },
  {
    name: "Models",
    href: "/dashboard/models",
    icon: Tag,
  },
  {
    name: "API Management",
    href: "/dashboard/api",
    icon: Server,
  },
  {
    name: "Security",
    href: "/dashboard/security",
    icon: Shield,
  },
  {
    name: "Logs",
    href: "/dashboard/logs",
    icon: FileCode,
  },
  {
    name: "Resources",
    href: "/dashboard/resources",
    icon: Boxes,
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="grid gap-2 px-2">
      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
              pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}

