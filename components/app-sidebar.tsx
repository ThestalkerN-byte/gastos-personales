"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Settings,
  CreditCard,
  PiggyBank,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Inicio",
    url: "/home",
    icon: Home,
  },
  {
    title: "Tarjetas",
    url: "/home/tarjetas",
    icon: CreditCard,
  },
  {
    title: "Ahorros",
    url: "/home/ahorros",
    icon: PiggyBank,
  },
]

const settingsItems = [
  {
    title: "Configuracion",
    url: "/home/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { open, toggleSidebar } = useSidebar()

  return (
    <Sidebar collapsible="icon" className="relative">
      {/* Toggle button - positioned at the middle of sidebar edge */}
      <button
        onClick={toggleSidebar}
        className="absolute top-1/2 -translate-y-1/2 -right-3 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-md transition-colors hover:bg-accent"
        aria-label={open ? "Cerrar sidebar" : "Abrir sidebar"}
      >
        {open ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>

      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-semibold text-sm">
            A
          </div>
          <span className="font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            App
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          {settingsItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.url}
                tooltip={item.title}
              >
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
