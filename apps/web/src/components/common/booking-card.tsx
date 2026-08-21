import { bookingOptions } from "#/lib/constants.ts";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

interface BookingCardProps {
  option: typeof bookingOptions[number];
  onPreview: () => void;
  onPreviewEnd: () => void;
}

export function BookingCard({ option, onPreview, onPreviewEnd }: BookingCardProps) {
  const Icon = option.icon;

  return (
    <Link
      to={option.to}
      onMouseEnter={onPreview}
      onMouseLeave={onPreviewEnd}
      onFocus={onPreview}
      onBlur={onPreviewEnd}
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-white/60 bg-white/70 p-5 text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/30 hover:bg-white outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="h-5 w-5" />
        </div>
        <ArrowRight className="size-5 text-muted-foreground transition-transform duration-300 group-hover:size-6 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary self-start -rotate-45" />
      </div>
      
      <div className="mt-auto">
        <h3 className="mb-1.5 font-semibold tracking-tight text-slate-900">
          {option.title}
        </h3>
        <p className="text-sm text-muted-foreground  leading-relaxed">
          {option.description}
        </p>
      </div>
    </Link>
  );
}