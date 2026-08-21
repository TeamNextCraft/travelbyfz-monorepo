import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { buttonVariants } from "#/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "#/components/ui/card";
import { bookingOptions } from "#/lib/constants.ts";
import { BookingCard } from "#/components/common/booking-card.tsx";

export const Route = createFileRoute("/")({ component: Home });

const defaultImage =
  "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1300&q=80";

function Home() {
  const [activeImage, setActiveImage] = useState(defaultImage);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background Images Layer */}
      <div className="absolute inset-0 -z-20">
        {[defaultImage, ...bookingOptions.map((option) => option.image)].map(
          (image) => (
            <img
              key={image}
              src={image}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
                activeImage === image ? "opacity-100" : "opacity-0"
              }`}
            />
          ),
        )}
      </div>
      
      {/* Overlays */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/75 via-white/40 to-[rgba(15,47,53,0.28)]" />

      {/* Main Content */}
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-7xl items-center ">
        <div className="grid w-full gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          
          {/* Hero Feature Box */}
          <div className="relative min-h-[420px] overflow-hidden rounded-xl border border-white/50 shadow-[0_24px_70px_rgba(23,58,64,0.18)]">
            {[
              defaultImage,
              ...bookingOptions.map((option) => option.image),
            ].map((image) => (
              <img
                key={`feature-${image}`}
                src={image}
                alt=""
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
                  activeImage === image ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f2f35]/95 via-[#0f2f35]/50 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
              <p className="island-kicker text-white/80 font-medium uppercase tracking-wider text-xs mb-3">
                Travel by FZ
              </p>
              <h1 className="display-title max-w-xl text-4xl font-bold leading-tight sm:text-5xl text-white">
                Choose the travel service you need today.
              </h1>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/80 sm:text-base">
                A clearer starting point for pilgrims, local tourists, and
                holiday travellers without mixing every offer into one page.
              </p>
            </div>
          </div>

          {/* Interactive Selection Card */}
          <Card className="island-shell gap-0 rounded-xl bg-white/40 backdrop-blur-md shadow-sm border-white/60 p-4 sm:p-6">
            <CardHeader className="mb-6 flex flex-col justify-between gap-4 border-b border-border/50 px-0 pb-5 sm:flex-row sm:items-end">
              <div>
                <p className="island-kicker text-muted-foreground font-medium uppercase tracking-wider text-xs mb-2">
                  Start booking
                </p>
                <CardTitle className="display-title text-3xl font-bold text-slate-900">
                  What are you looking for?
                </CardTitle>
              </div>
              <a
                href="tel:+919000000000"
                className={buttonVariants({
                  variant: "outline",
                  className:
                    "w-fit bg-white/80 font-bold text-slate-900 hover:bg-white hover:text-slate-950 border-white/60 shadow-sm transition-all",
                })}
              >
                Call now
              </a>
            </CardHeader>

            <CardContent className="grid gap-4 px-0 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {bookingOptions.map((option) => (
                <BookingCard
                  key={option.to}
                  option={option}
                  onPreview={() => setActiveImage(option.image)}
                  onPreviewEnd={() => setActiveImage(defaultImage)}
                />
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}