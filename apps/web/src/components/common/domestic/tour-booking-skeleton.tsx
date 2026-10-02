import { Skeleton } from "#/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "#/components/ui/card";
import { Separator } from "#/components/ui/separator";

export function BookingSkeleton() {
  return (
    <main className="min-h-screen bg-muted/20" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading booking details…</span>

      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b bg-background">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <Skeleton className="h-8 w-16 rounded-md" />
          <Separator orientation="vertical" className="h-5" />
          <Skeleton className="h-4 w-56 flex-1 max-w-xs" />
          <Skeleton className="hidden h-4 w-28 sm:block" />
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Step indicator */}
        <div className="flex items-center justify-between gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-1 items-center gap-2 last:flex-none">
              <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
              <Skeleton className="hidden h-3 w-16 sm:block" />
              {i < 3 && <Skeleton className="h-0.5 flex-1" />}
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 items-start gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Form card */}
          <div className="space-y-4 lg:col-span-2">
            <Card>
              <CardHeader className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-72 max-w-full" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <div className="grid gap-3 sm:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-20 rounded-xl" />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-10 w-40 rounded-md" />
                </div>

                <div className="flex justify-end pt-2">
                  <Skeleton className="h-10 w-32 rounded-md" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order summary */}
          <aside className="lg:col-span-1">
            <Card>
              <CardContent className="space-y-4 p-4">
                <div className="flex gap-3">
                  <Skeleton className="h-16 w-20 shrink-0 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="flex justify-between">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}
