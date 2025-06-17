"use client"

import * as React from "react"
import {
  IconCategory,
  IconDashboard,
  IconPackage,
} from "@tabler/icons-react"

import { NavMain } from "@/components/dashboard/sidebar/nav-main"
import { NavUser } from "@/components/dashboard/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { useSupabaseUser } from "@/hooks/use-supabase-user"
import { Heart} from "lucide-react"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Kategori",
      url: "/dashboard/category",
      icon: IconCategory,
    },
    {
      title: "Artikel",
      url: "/dashboard/article",
      icon: IconPackage,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useSupabaseUser()
  const sidebarUser = {
    name: user?.user_metadata?.full_name || "User",
    email: user?.email || "no-email@example.com",
    avatar: user?.user_metadata?.avatar_url || "/avatar/avatar-default.png",
  }
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <div className="flex items-center">
                <Link href="/dashboard" className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-blue-900">MindEase</span>
                  </div>
                </Link>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarUser} />
      </SidebarFooter>
    </Sidebar>
  )
}
