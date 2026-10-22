import { Skeleton } from "#/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "#/components/ui/card";
import { Separator } from "#/components/ui/separator";

export function TourDetailSkeleton() {
  return (
    <main aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading tour details…</span>

      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {/* ── Main column ── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <div className="space-y-2">
              <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
              <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-16 shrink-0 rounded-lg" />
                ))}
              </div>
            </div>

            {/* Title block */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="flex gap-1.5">
                  <Skeleton className="h-9 w-9 rounded-md" />
                  <Skeleton className="h-9 w-9 rounded-md" />
                </div>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>

            <Separator />

            {/* Tabs */}
            <div className="space-y-6">
              <div className="flex gap-2">
                {[88, 110, 96, 100].map((w, i) => (
                  <Skeleton key={i} className="h-9 rounded-md" style={{ width: w }} />
                ))}
              </div>

              {/* Overview paragraph */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>

              {/* Highlights */}
              <div className="space-y-3">
                <Skeleton className="h-6 w-40" />
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <Skeleton className="h-4 w-4 rounded-full shrink-0" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick info grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-muted/50 border border-border/60"
                  >
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <aside className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              <Card className="border-border/60 shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-9 w-36" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-36" />
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-[70px] w-full rounded-xl" />
                    ))}
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-14 rounded-lg" />
                    ))}
                  </div>
                  <Skeleton className="h-11 w-full rounded-md" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </CardContent>
              </Card>

              <Card className="border-border/60 bg-muted/30">
                <CardContent className="pt-4 pb-4 space-y-2">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-8 w-full rounded-md" />
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
