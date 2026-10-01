import { Link } from "@tanstack/react-router";
import { AlertTriangle, RefreshCw, ArrowLeft, Phone, WifiOff } from "lucide-react";
import { Button, buttonVariants } from "#/components/ui/button";
import { cn } from "#/lib/utils";

type TourDetailErrorProps = {
  error?: unknown;
  onRetry?: () => void;
  isRetrying?: boolean;
};

function getErrorInfo(error: unknown) {
  const message =
    error instanceof Error ? error.message : typeof error === "string" ? error : "";
  const isNetwork = /network|fetch|failed to fetch|timeout|offline/i.test(message);

  return {
    isNetwork,
    title: isNetwork ? "Connection problem" : "Couldn't load this tour",
    description: isNetwork
      ? "Please check your internet connection and try again."
      : "Something went wrong on our side while loading this tour. Please try again in a moment.",
    message,
  };
}

export function TourDetailError({ error, onRetry, isRetrying }: TourDetailErrorProps) {
  const { isNetwork, title, description, message } = getErrorInfo(error);
  const Icon = isNetwork ? WifiOff : AlertTriangle;

  return (
    <main
      role="alert"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-5 px-4 py-16 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400">
        <Icon size={28} aria-hidden="true" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="mx-auto max-w-sm text-muted-foreground">{description}</p>
      </div>

      {/* Technical detail: dev only */}
      {import.meta.env.DEV && message && (
        <pre className="max-w-md overflow-x-auto rounded-lg border bg-muted/50 px-3 py-2 text-left text-xs text-muted-foreground">
          {message}
        </pre>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <Button onClick={onRetry} disabled={isRetrying} className="gap-2">
            <RefreshCw
              size={15}
              className={cn(isRetrying && "animate-spin")}
              aria-hidden="true"
            />
            {isRetrying ? "Retrying…" : "Try again"}
          </Button>
        )}
        <Link
          to="/domestic/tours"
          className={buttonVariants({ variant: "outline", className: "gap-2" })}
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Browse all tours
        </Link>
      </div>

      <a
        href="tel:+919876543210"
        className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <Phone size={13} aria-hidden="true" />
        Still stuck? Call us at +91 98765 43210
      </a>
    </main>
  );
}
