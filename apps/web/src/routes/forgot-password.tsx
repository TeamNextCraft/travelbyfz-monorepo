import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Globe,
  Landmark,
  Mail,
  MapPinned,
  Phone,
  ShieldCheck,
  KeyRound,
} from "lucide-react";

import { cn } from "#/lib/utils";
import { Badge } from "#/components/ui/badge";
import { Button, buttonVariants } from "#/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Separator } from "#/components/ui/separator";

type ModuleKey = "domestic" | "hajj-umrah" | "international";

export const Route = createFileRoute("/forgot-password")({
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
  component: ForgotPasswordPage,
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
    helperLabel: string;
  }
> = {
  domestic: {
    title: "Domestic Tours",
    shortTitle: "Domestic",
    description:
      "Recover access to your domestic travel account and continue managing bookings, travellers, and payments.",
    image:
      "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1400&q=80",
    icon: MapPinned,
    tint: "from-[#0f2f35]/92 via-[#0f2f35]/62 to-[#0f2f35]/28",
    accent: "text-teal-100",
    buttonClass: "bg-[#123f45] text-white hover:bg-[#0f343a] shadow-sm",
    features: [
      "Recover booking access securely",
      "Reset password with email verification",
      "Return to your domestic dashboard faster",
    ],
    helperLabel: "Domestic recovery flow",
  },
  "hajj-umrah": {
    title: "Hajj & Umrah",
    shortTitle: "Hajj & Umrah",
    description:
      "Recover access to your pilgrimage account to continue tracking package progress, travel updates, and documents.",
    image:
      "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1400&q=80",
    icon: Landmark,
    tint: "from-[#3e2f10]/92 via-[#66501b]/62 to-[#8b6b21]/28",
    accent: "text-amber-50",
    buttonClass: "bg-[#6f5516] text-white hover:bg-[#5d4712] shadow-sm",
    features: [
      "Recover pilgrimage account access",
      "Reset password with a secure link",
      "Continue your sacred travel preparation",
    ],
    helperLabel: "Pilgrimage recovery flow",
  },
  international: {
    title: "International Tours",
    shortTitle: "International",
    description:
      "Recover access to your international travel account and resume managing overseas departures and trip documents.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
    icon: Globe,
    tint: "from-[#10263f]/92 via-[#16395e]/62 to-[#215281]/28",
    accent: "text-sky-50",
    buttonClass: "bg-[#183f66] text-white hover:bg-[#123554] shadow-sm",
    features: [
      "Reset access to overseas bookings",
      "Receive a secure password reset email",
      "Return to your international travel area",
    ],
    helperLabel: "International recovery flow",
  },
};

function ForgotPasswordPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();

  const [activeModule, setActiveModule] = useState<ModuleKey>(search.module);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const active = useMemo(() => moduleConfig[activeModule], [activeModule]);
  const ActiveIcon = active.icon;

  const handleModuleChange = (value: ModuleKey) => {
    setActiveModule(value);
    navigate({
      to: "/forgot-password",
      search: { module: value },
      replace: true,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: wire with Better Auth forgot password action / server fn
    setSubmitted(true);
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
          <div className="relative min-h-[540px] overflow-hidden rounded-xl border border-white/50 shadow-[0_24px_70px_rgba(23,58,64,0.18)]">
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

            <div className={cn("absolute inset-0 bg-gradient-to-t", active.tint)} />

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
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/85">
                  {active.title}
                </span>
              </div>

              <h1 className="max-w-xl text-4xl font-bold leading-tight sm:text-5xl">
                Reset your {active.shortTitle} password.
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
                    Password recovery
                  </p>
                  <CardTitle className="text-3xl font-bold text-slate-900">
                    Forgot your password?
                  </CardTitle>
                  <CardDescription className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">
                    Enter the email address linked to your account. We&apos;ll send
                    you a secure password reset link for the selected travel
                    module.
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
                              Recovery area
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {!submitted ? (
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11 border-white/60 bg-white/85 pl-10 shadow-none placeholder:text-slate-400 focus-visible:ring-slate-400"
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-border/60 bg-white/70 p-3.5">
                    <div className="flex items-start gap-3">
                      <KeyRound className="mt-0.5 size-4 shrink-0 text-slate-700" />
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        We&apos;ll send a reset link only if an account exists for this
                        email under the{" "}
                        <span className="font-semibold text-slate-900">
                          {active.title}
                        </span>{" "}
                        module.
                      </p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className={cn("h-11 w-full font-semibold", active.buttonClass)}
                  >
                    Send reset link
                  </Button>
                </form>
              ) : (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 text-left">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <CheckCircle2 className="size-5" />
                    </div>

                    <div>
                      <h3 className="text-base font-semibold text-slate-900">
                        Reset link sent
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">
                        If an account exists for{" "}
                        <span className="font-semibold text-slate-900">
                          {email || "this email"}
                        </span>
                        , we&apos;ve sent password reset instructions for the{" "}
                        <span className="font-semibold text-slate-900">
                          {active.title}
                        </span>{" "}
                        area.
                      </p>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <Button
                          type="button"
                          onClick={() => setSubmitted(false)}
                          variant="outline"
                          className="border-white bg-white/80"
                        >
                          Try another email
                        </Button>

                        <Link
                          to="/sign-in"
                          search={{ module: activeModule }}
                          className={buttonVariants({
                            className: active.buttonClass,
                          })}
                        >
                          Back to sign in
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <Separator />

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-700">
                    Remembered your password?{" "}
                    <Link
                      to="/sign-in"
                      search={{ module: activeModule }}
                      className="font-semibold text-slate-950 underline underline-offset-4"
                    >
                      Sign in
                    </Link>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Current module:{" "}
                    <span className="font-semibold text-slate-800">
                      {active.helperLabel}
                    </span>
                  </p>
                </div>

                <a
                  href="tel:+919000000000"
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-950"
                >
                  <Phone className="size-4" />
                  Need account help?
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}