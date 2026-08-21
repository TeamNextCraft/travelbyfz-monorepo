import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Globe,
  Landmark,
  MapPinned,
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  ShieldCheck,
} from "lucide-react";

import { cn } from "#/lib/utils";
import { buttonVariants, Button } from "#/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Badge } from "#/components/ui/badge";
import { Separator } from "#/components/ui/separator";

type ModuleKey = "domestic" | "hajj-umrah" | "international";

export const Route = createFileRoute("/sign-in")({
  validateSearch: (search: Record<string, unknown>) => {
    const module = String(search.module ?? "domestic");
    return {
      module:
        module === "domestic" ||
        module === "hajj-umrah" ||
        module === "international"
          ? (module as ModuleKey)
          : ("domestic" as ModuleKey),
    };
  },
  component: SignInPage,
});

const moduleConfig: Record<
  ModuleKey,
  {
    title: string;
    shortTitle: string;
    description: string;
    image: string;
    icon: React.ComponentType<{ className?: string }>;
    tint: string;
    accent: string;
    buttonClass: string;
    features: string[];
    supportLabel: string;
  }
> = {
  domestic: {
    title: "Domestic Tours",
    shortTitle: "Domestic",
    description:
      "Sign in to manage your India tour bookings, traveller details, departures, and payments in one place.",
    image:
      "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1400&q=80",
    icon: MapPinned,
    tint:
      "from-[#0f2f35]/92 via-[#0f2f35]/62 to-[#0f2f35]/28",
    accent: "text-teal-100",
    buttonClass:
      "bg-[#123f45] text-white hover:bg-[#0f343a] shadow-sm",
    features: [
      "View domestic tour bookings",
      "Manage traveller details",
      "Track payment and booking status",
    ],
    supportLabel: "Domestic travel support",
  },
  "hajj-umrah": {
    title: "Hajj & Umrah",
    shortTitle: "Hajj & Umrah",
    description:
      "Sign in to access your pilgrimage application, package details, documents, and travel updates securely.",
    image:
      "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1400&q=80",
    icon: Landmark,
    tint:
      "from-[#3e2f10]/92 via-[#66501b]/62 to-[#8b6b21]/28",
    accent: "text-amber-50",
    buttonClass:
      "bg-[#6f5516] text-white hover:bg-[#5d4712] shadow-sm",
    features: [
      "Check package and visa progress",
      "Upload and review documents",
      "Get pilgrimage travel updates",
    ],
    supportLabel: "Pilgrimage help desk",
  },
  international: {
    title: "International Tours",
    shortTitle: "International",
    description:
      "Sign in to review overseas bookings, passports, travel notes, and destination-specific trip details.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
    icon: Globe,
    tint:
      "from-[#10263f]/92 via-[#16395e]/62 to-[#215281]/28",
    accent: "text-sky-50",
    buttonClass:
      "bg-[#183f66] text-white hover:bg-[#123554] shadow-sm",
    features: [
      "Manage international departures",
      "Save traveller and passport info",
      "Access trip documents and invoices",
    ],
    supportLabel: "International booking desk",
  },
};

function SignInPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState<ModuleKey>(search.module);
  const [showPassword, setShowPassword] = useState(false);

  const active = useMemo(() => moduleConfig[activeModule], [activeModule]);
  const ActiveIcon = active.icon;

  const handleModuleChange = (value: ModuleKey) => {
    setActiveModule(value);
    navigate({
      to: "/sign-in",
      search: { module: value },
      replace: true,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: wire this with Better Auth / your auth action
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Background image layer */}
      <div className="absolute inset-0 -z-20">
        {(Object.keys(moduleConfig) as ModuleKey[]).map((key) => (
          <img
            key={key}
            src={moduleConfig[key].image}
            alt=""
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out",
              activeModule === key ? "opacity-100" : "opacity-0"
            )}
          />
        ))}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/78 via-white/46 to-[rgba(15,47,53,0.32)]" />

      <section className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full gap-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          {/* Visual panel */}
          <div className="relative min-h-[520px] overflow-hidden rounded-xl border border-white/50 shadow-[0_24px_70px_rgba(23,58,64,0.18)]">
            {(Object.keys(moduleConfig) as ModuleKey[]).map((key) => (
              <img
                key={`feature-${key}`}
                src={moduleConfig[key].image}
                alt=""
                className={cn(
                  "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out",
                  activeModule === key ? "opacity-100" : "opacity-0"
                )}
              />
            ))}

            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-t",
                active.tint
              )}
            />

            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 sm:p-6">
              <Link
                to="/"
                className={buttonVariants({
                  variant: "outline",
                  className:
                    "border-white/40 bg-white/12 text-white backdrop-blur-md hover:bg-white/20 hover:text-white",
                })}
              >
                <ArrowLeft className="mr-2 size-4" />
                Back
              </Link>

              <Badge className="border-white/20 bg-white/14 text-white hover:bg-white/14">
                Travel by FZ
              </Badge>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-md">
                <ActiveIcon className="size-4" />
                <span className="text-xs font-semibold tracking-[0.18em] uppercase text-white/85">
                  {active.title}
                </span>
              </div>

              <h1 className="max-w-xl text-4xl font-bold leading-tight sm:text-5xl">
                Sign in to continue with {active.shortTitle}.
              </h1>

              <p className={cn("mt-4 max-w-md text-sm leading-relaxed sm:text-base", active.accent)}>
                {active.description}
              </p>

              <div className="mt-6 grid gap-2.5 sm:max-w-md">
                {active.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-2.5 rounded-lg border border-white/12 bg-white/8 px-3 py-2.5 backdrop-blur-sm"
                  >
                    <ShieldCheck className="mt-0.5 size-4 shrink-0 text-white" />
                    <p className="text-sm text-white/90">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form card */}
          <Card className="gap-0 rounded-xl border-white/60 bg-white/48 p-4 shadow-sm backdrop-blur-md sm:p-6">
            <CardHeader className="mb-6 border-b border-border/50 px-0 pb-5">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Account access
                  </p>
                  <CardTitle className="text-3xl font-bold text-slate-900">
                    Welcome back
                  </CardTitle>
                  <CardDescription className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">
                    Choose the travel module you want to access, then sign in to
                    continue with your bookings, travellers, and trip details.
                  </CardDescription>
                </div>

                <a
                  href="tel:+919000000000"
                  className={buttonVariants({
                    variant: "outline",
                    className:
                      "w-fit border-white/60 bg-white/80 font-bold text-slate-900 shadow-sm transition-all hover:bg-white hover:text-slate-950",
                  })}
                >
                  Call now
                </a>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 px-0">
              {/* Module switcher */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-slate-900">
                  Select travel category
                </Label>

                <div className="grid gap-3 md:grid-cols-3">
                  {(Object.keys(moduleConfig) as ModuleKey[]).map((key) => {
                    const item = moduleConfig[key];
                    const Icon = item.icon;
                    const isActive = activeModule === key;

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleModuleChange(key)}
                        className={cn(
                          "rounded-xl border px-4 py-4 text-left transition-all",
                          isActive
                            ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                            : "border-border/60 bg-white/75 text-slate-800 hover:border-slate-300 hover:bg-white"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={cn(
                              "flex size-9 items-center justify-center rounded-lg",
                              isActive
                                ? "bg-white/14 text-white"
                                : "bg-slate-100 text-slate-700"
                            )}
                          >
                            <Icon className="size-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{item.shortTitle}</p>
                            <p
                              className={cn(
                                "mt-0.5 text-xs",
                                isActive ? "text-white/75" : "text-muted-foreground"
                              )}
                            >
                              Separate access area
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* Sign in form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-900">
                    Email address
                  </Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="h-11 border-white/60 bg-white/85 pl-10 shadow-none placeholder:text-slate-400 focus-visible:ring-slate-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor="password" className="text-slate-900">
                      Password
                    </Label>
                    <Link
                      to="/forgot-password"
                      search={{ module: activeModule }}
                      className="text-xs font-medium text-slate-600 underline-offset-4 hover:text-slate-900 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="h-11 border-white/60 bg-white/85 pl-10 pr-11 shadow-none placeholder:text-slate-400 focus-visible:ring-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-900"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className={cn("h-11 w-full font-semibold", active.buttonClass)}
                >
                  Sign in to {active.shortTitle}
                </Button>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 border-white/60 bg-white/75 text-slate-800 hover:bg-white"
                  >
                    Continue with OTP
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 border-white/60 bg-white/75 text-slate-800 hover:bg-white"
                  >
                    Continue with Google
                  </Button>
                </div>
              </form>

              <Separator />

              {/* Footer info */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-700">
                    Don&apos;t have an account?{" "}
                    <Link
                      to="/sign-up"
                      search={{ module: activeModule }}
                      className="font-semibold text-slate-950 underline underline-offset-4"
                    >
                      Create one
                    </Link>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    You are entering the{" "}
                    <span className="font-semibold text-slate-800">
                      {active.title}
                    </span>{" "}
                    area.
                  </p>
                </div>

                <a
                  href="tel:+919000000000"
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-950"
                >
                  <Phone className="size-4" />
                  {active.supportLabel}
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}