import { Card, CardContent } from "#/components/ui/card";
import { Skeleton } from "#/components/ui/skeleton";

export function BookingsSkeleton() {
  return (
    <main className="min-h-screen bg-muted/20">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <Skeleton className="mb-2 h-4 w-40" />
          <Skeleton className="h-9 w-52" />

          {/* Statistics */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="space-y-2 rounded-xl border border-border/60 bg-background p-4"
              >
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-7 w-16" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters and booking cards */}
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
        {/* Status tabs */}
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-9 w-28 shrink-0 rounded-lg"
            />
          ))}
        </div>

        {/* Search and sort */}
        <div className="flex gap-2">
          <Skeleton className="h-9 w-full max-w-sm" />
          <Skeleton className="h-9 w-44 shrink-0" />
        </div>

        {/* Booking cards */}
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              <Skeleton className="aspect-video w-full rounded-none sm:aspect-auto sm:w-44" />

              <CardContent className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>

                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>

                <div className="flex flex-wrap gap-3">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>

                <div className="border-t" />

                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-5 w-24" />
                  </div>

                  <Skeleton className="h-8 w-24" />
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
