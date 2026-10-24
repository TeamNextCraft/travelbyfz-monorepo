import * as React from "react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "#/components/ui/sidebar"
import { authClient } from "#/lib/auth-client"
import { sidebarModules, sidebarNavMain } from "#/config/sidebar-navigation"
import { ModuleSwitcher } from "./module-switcher"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { NavUserSkeleton } from "../nav-user-skeleton"

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { data: session, isPending, error } = authClient.useSession()

  const user = session?.user

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <ModuleSwitcher modules={sidebarModules} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={sidebarNavMain} />
      </SidebarContent>

      <SidebarFooter>
        {isPending ? (
          <NavUserSkeleton />
        ) : user ? (
          <NavUser user={user} />
        ) : error ? (
          <div className="px-2 py-2 text-xs text-muted-foreground">
            Unable to load account
          </div>
        ) : null}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
