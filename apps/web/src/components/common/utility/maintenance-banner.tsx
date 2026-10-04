import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MaintenanceBanner({
  message = "Sorry, our website is under maintenance. Some features may be unavailable.",
}: {
  message?: string;
}) {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="relative w-full bg-orange-300 text-orange-950 border-b border-orange-400"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-10 py-2 text-center text-sm font-medium">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <p>{message}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(false)}
        aria-label="Dismiss"
        className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 hover:bg-orange-400/60"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
