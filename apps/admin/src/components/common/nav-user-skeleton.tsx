import { ChevronsUpDown } from "lucide-react"

import { Skeleton } from "#/components/ui/skeleton"
import { SidebarMenuButton } from "#/components/ui/sidebar"

export function NavUserSkeleton() {
  return (
    <SidebarMenuButton
      size="lg"
      disabled
      aria-label="Loading user account"
      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
    >
      <Skeleton className="size-8 shrink-0 rounded-lg" />

      <div className="grid min-w-0 flex-1 gap-2 text-left">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>

      <ChevronsUpDown className="ml-auto size-4 shrink-0 text-muted-foreground opacity-50" />
    </SidebarMenuButton>
  )
}
