import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";

export function ToursLoading() {
  return (
    <main aria-busy="true" aria-live="polite">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-[16/10] animate-pulse bg-muted" />
              <CardContent className="space-y-3 p-5">
                <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
                <div className="h-10 w-full animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Loading tours...
        </div>
      </div>
    </main>
  );
}

type ToursErrorProps = {
  error: unknown;
  onRetry?: () => void;
};

export function ToursError({ error, onRetry }: ToursErrorProps) {
  const message =
    error instanceof Error
      ? error.message
      : "We could not load the tour packages right now.";

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-4 py-12">
      <Card className="w-full">
        <CardContent className="flex flex-col items-center p-8 text-center sm:p-10">
          <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="size-6" aria-hidden="true" />
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">
            Unable to load tours
          </h1>

          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Please check your connection and try again. Your filters have not
            been changed.
          </p>

          {import.meta.env.DEV && (
            <pre className="mt-5 max-w-full overflow-auto rounded-md bg-muted p-3 text-left text-xs text-muted-foreground">
              {message}
            </pre>
          )}

          {onRetry && (
            <Button type="button" className="mt-6 gap-2" onClick={onRetry}>
              <RefreshCw className="size-4" aria-hidden="true" />
              Try again
            </Button>
          )}
        </CardContent>
      </Card>
    </main>
  );
}