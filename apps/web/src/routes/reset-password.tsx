import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Globe,
  KeyRound,
  Landmark,
  Lock,
  MapPinned,
  Phone,
  ShieldCheck,
  CircleAlert,
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

export const Route = createFileRoute("/reset-password")({
  validateSearch: (search: Record<string, unknown>) => {
    const module = String(search.module ?? "domestic");
    const token = typeof search.token === "string" ? search.token : "";
    const redirect =
      typeof search.redirect === "string" ? search.redirect : undefined;

    return {
      module:
        module === "domestic" ||
        module === "hajj-umrah" ||
        module === "international"
          ? (module as ModuleKey)
          : ("domestic" as ModuleKey),
      token,
      redirect,
    };
  },
  component: ResetPasswordPage,
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
      "Set a new password to regain access to your domestic bookings, travellers, and payments.",
    image:
      "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1400&q=80",
    icon: MapPinned,
    tint: "from-[#0f2f35]/92 via-[#0f2f35]/62 to-[#0f2f35]/28",
    accent: "text-teal-100",
    buttonClass: "bg-[#123f45] text-white hover:bg-[#0f343a] shadow-sm",
    features: [
      "Set a fresh password securely",
      "Return to your domestic account quickly",
      "Protect your future bookings and traveller details",
    ],
    helperLabel: "Domestic reset flow",
  },
  "hajj-umrah": {
    title: "Hajj & Umrah",
    shortTitle: "Hajj & Umrah",
    description:
      "Create a new password to continue managing your pilgrimage package, documents, and updates.",
    image:
      "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1400&q=80",
    icon: Landmark,
    tint: "from-[#3e2f10]/92 via-[#66501b]/62 to-[#8b6b21]/28",
    accent: "text-amber-50",
    buttonClass: "bg-[#6f5516] text-white hover:bg-[#5d4712] shadow-sm",
    features: [
      "Reset access to your pilgrimage account",
      "Keep your sacred journey information secure",
      "Continue package and document tracking",
    ],
    helperLabel: "Pilgrimage reset flow",
  },
  international: {
    title: "International Tours",
    shortTitle: "International",
    description:
      "Set a new password to get back into your international travel account and overseas trip management.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
    icon: Globe,
    tint: "from-[#10263f]/92 via-[#16395e]/62 to-[#215281]/28",
    accent: "text-sky-50",
    buttonClass: "bg-[#183f66] text-white hover:bg-[#123554] shadow-sm",
    features: [
      "Secure your overseas booking access",
      "Create a new password safely",
      "Return to international trip planning",
    ],
    helperLabel: "International reset flow",
  },
};

function SignInLink({
  module,
  redirect,
  className,
}: {
  module: ModuleKey;
  redirect?: string;
  className?: string;
}) {
  return (
    <Link
      to="/sign-in"
      search={{
        module,
        ...(redirect ? { redirect } : {}),
      }}
      className={className}
    >
      Back to sign in
    </Link>
  );
}

function ResetPasswordPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();

  const [activeModule, setActiveModule] = useState<ModuleKey>(search.module);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const active = useMemo(() => moduleConfig[activeModule], [activeModule]);
  const ActiveIcon = active.icon;

  const token = search.token;
  const redirect = search.redirect;
  const hasToken = Boolean(token);

  const handleModuleChange = (value: ModuleKey) => {
    setActiveModule(value);
    navigate({
      to: "/reset-password",
      search: {
        module: value,
        token,
        ...(redirect ? { redirect } : {}),
      },
      replace: true,
    });
  };

  const passwordChecks = [
    {
      label: "At least 8 characters",
      passed: password.length >= 8,
    },
    {
      label: "Contains an uppercase letter",
      passed: /[A-Z]/.test(password),
    },
    {
      label: "Contains a number",
      passed: /\d/.test(password),
    },
    {
      label: "Passwords match",
      passed: password.length > 0 && password === confirmPassword,
    },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!hasToken) return;
    if (password !== confirmPassword) return;

    // TODO: wire with Better Auth / server action using token + password
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
          <div className="relative min-h-[560px] overflow-hidden rounded-xl border border-white/50 shadow-[0_24px_70px_rgba(23,58,64,0.18)]">
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
                Create a new {active.shortTitle} password.
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
                    Password reset
                  </p>
                  <CardTitle className="text-3xl font-bold text-slate-900">
                    Set a new password
                  </CardTitle>
                  <CardDescription className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">
                    Choose a strong password for the selected travel module and
                    use it the next time you sign in.
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
                              Reset area
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {!hasToken ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                      <CircleAlert className="size-5" />
                    </div>

                    <div>
                      <h3 className="text-base font-semibold text-slate-900">
                        Reset link is incomplete
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">
                        This page needs a valid reset token. Please request a new
                        password reset email for the{" "}
                        <span className="font-semibold text-slate-900">
                          {active.title}
                        </span>{" "}
                        module.
                      </p>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <Link
                          to="/forgot-password"
                          search={{ module: activeModule }}
                          className={buttonVariants({
                            className: active.buttonClass,
                          })}
                        >
                          Request new reset link
                        </Link>

                        <SignInLink
                          module={activeModule}
                          redirect={redirect}
                          className={buttonVariants({
                            variant: "outline",
                            className: "border-white bg-white/80",
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : submitted ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 text-left">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <CheckCircle2 className="size-5" />
                    </div>

                    <div>
                      <h3 className="text-base font-semibold text-slate-900">
                        Password updated
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">
                        Your new password has been set for the{" "}
                        <span className="font-semibold text-slate-900">
                          {active.title}
                        </span>{" "}
                        account area. You can now sign in with your new
                        credentials.
                      </p>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <SignInLink
                          module={activeModule}
                          redirect={redirect}
                          className={buttonVariants({
                            className: active.buttonClass,
                          })}
                        />

                        <Link
                          to="/"
                          className={buttonVariants({
                            variant: "outline",
                            className: "border-white bg-white/80",
                          })}
                        >
                          Back to home
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input type="hidden" value={token} name="token" readOnly />

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-900">
                      New password
                    </Label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-11 border-white/60 bg-white/85 pl-10 pr-11 shadow-none placeholder:text-slate-400 focus-visible:ring-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-900"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-slate-900">
                      Confirm new password
                    </Label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Repeat your new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="h-11 border-white/60 bg-white/85 pl-10 pr-11 shadow-none placeholder:text-slate-400 focus-visible:ring-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-900"
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border/60 bg-white/70 p-3.5">
                    <div className="flex items-start gap-3">
                      <KeyRound className="mt-0.5 size-4 shrink-0 text-slate-700" />
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-slate-900">
                          Password requirements
                        </p>
                        <div className="grid gap-1.5">
                          {passwordChecks.map((item) => (
                            <div
                              key={item.label}
                              className="flex items-center gap-2 text-xs"
                            >
                              <span
                                className={cn(
                                  "size-2 rounded-full",
                                  item.passed ? "bg-emerald-500" : "bg-slate-300"
                                )}
                              />
                              <span
                                className={cn(
                                  item.passed
                                    ? "text-emerald-700"
                                    : "text-muted-foreground"
                                )}
                              >
                                {item.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={
                      !hasToken ||
                      !password ||
                      !confirmPassword ||
                      password !== confirmPassword
                    }
                    className={cn("h-11 w-full font-semibold", active.buttonClass)}
                  >
                    Update password
                  </Button>
                </form>
              )}

              <Separator />

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-700">
                    Need another reset email?{" "}
                    <Link
                      to="/forgot-password"
                      search={{ module: activeModule }}
                      className="font-semibold text-slate-950 underline underline-offset-4"
                    >
                      Request one
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