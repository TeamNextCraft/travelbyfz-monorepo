import { Link } from "@tanstack/react-router";
import { Compass, ArrowLeft } from "lucide-react";
import { buttonVariants } from "#/components/ui/button";

export function TourDetailNotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-5 px-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Compass size={28} aria-hidden="true" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Tour not found</h1>
        <p className="mx-auto max-w-sm text-muted-foreground">
          This tour doesn't exist, has been unpublished, or the link may be
          incorrect.
        </p>
      </div>

      <Link
        to="/domestic/tours"
        className={buttonVariants({ className: "gap-2" })}
      >
        <ArrowLeft size={15} aria-hidden="true" />
        Browse all tours
      </Link>
    </main>
  );
}
