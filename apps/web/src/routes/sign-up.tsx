import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Mail,
  Phone,
  User,
  Lock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { z } from "zod";
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
import { accountConfig, type AccountType } from "./sign-in";
import { authClient } from "#/lib/auth-client";

const signUpSchema = z.object({
  firstName: z.string().trim()
    .min(1, "First name is required.")
    .max(50, "First name must be 50 characters or fewer."),
  lastName: z.string().trim()
    .min(1, "Last name is required.")
    .max(50, "Last name must be 50 characters or fewer."),
  email: z.email("Enter a valid email address."),
  phone: z.string().trim()
    .regex(
      /^\+?[0-9\s-]{7,20}$/,
      "Enter a valid mobile number.",
    )
    .optional()
    .or(z.literal("")),
  password: z.string()
    .min(8, "Password must be at least 8 characters.")
    .max(128, "Password must be 128 characters or fewer.")
    .regex(/[a-z]/, "Include at least one lowercase letter.")
    .regex(/[A-Z]/, "Include at least one uppercase letter.")
    .regex(/[0-9]/, "Include at least one number."),
  confirmPassword: z.string().min(1, "Confirm your password."),
})
  .refine((data) => data.password === data.confirmPassword, {
    message: "The passwords don't match.",
    path: ["confirmPassword"],
  });

type SignUpValues = z.infer<typeof signUpSchema>;
type SignUpField = keyof SignUpValues;

const signUpSearchSchema = z.object({
  module: z.enum(["agent", "customer"]).default("customer"),
  redirect: z.string().min(2).optional(),
})

export const Route = createFileRoute("/sign-up")({
  validateSearch: signUpSearchSchema,
  component: SignUpPage,
});

function SignUpPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<SignUpField, string>>
  >({});
  const [formError, setFormError] = useState<string | null>(null);
  const [registeredWithoutSession, setRegisteredWithoutSession] =
    useState(false);

  const submitting = useRef(false);

  const activeModule = search.module;
  const active = accountConfig[activeModule];
  const ActiveIcon = active.icon;

  const handleModuleChange = (value: AccountType) => {
    void navigate({
      to: "/sign-up",
      search: {
        module: value
      },
      replace: true,
    });
  };

  const clearFieldError = (field: SignUpField) => {
    setFieldErrors((previous) => {
      if (!previous[field]) return previous;

      const next = { ...previous };
      delete next[field];
      return next;
    });
  };

  const setFieldErrorFromZod = (
    field: SignUpField,
    message: string | undefined,
  ) => {
    if (!message) return;
    setFieldErrors((previous) => ({
      ...previous,
      [field]: message,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submitting.current) return;

    const form = event.currentTarget;
    const formData = new FormData(form);

    const rawValues = {
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      password: String(formData.get("password") ?? ""),
      confirmPassword: String(formData.get("confirmPassword") ?? ""),
    };

    setFormError(null);
    setFieldErrors({});

    const parsed = signUpSchema.safeParse(rawValues);

    if (!parsed.success) {
      const errors: Partial<Record<SignUpField, string>> = {};

      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as SignUpField | undefined;

        if (field && !errors[field]) {
          errors[field] = issue.message;
        }
      }

      setFieldErrors(errors);
      return;
    }

    const values = parsed.data;

    submitting.current = true;
    setPending(true);

    try {
      const params = new URLSearchParams({
        module: "customer",
      });

      if (search.redirect) {
        params.set("redirect", search.redirect);
      }

      const callbackURL = `/auth/continue?${params.toString()}`;

      const result = await authClient.signUp.email({
        name: `${values.firstName} ${values.lastName}`,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        role: activeModule,
        password: values.password,
        phone: values.phone,
        callbackURL,
      });

      if (result.error) {
        const code = result.error.code;

        if (
          code === "USER_ALREADY_EXISTS" ||
          code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"
        ) {
          setFieldErrorFromZod(
            "email",
            "An account with this email already exists. Please sign in.",
          );
        } else {
          setFormError(
            "We couldn't create your account. Check your details and try again.",
          );
        }

        return;
      }

      const sessionResult = await authClient.getSession();

      if (sessionResult.error) {
        setFormError(
          "Your registration was submitted, but we couldn't check your sign-in status. Please try signing in.",
        );
        return;
      }

      if (!sessionResult.data?.session) {
        setRegisteredWithoutSession(true);
        return;
      }

      await navigate({
        to: "/auth/continue",
        search: {
          module: "customer",
          redirect: search.redirect,
        },
      });
    } catch {
      setFormError(
        "The request couldn't be completed. Please check your connection. If registration succeeded, you can sign in.",
      );
    } finally {
      submitting.current = false;
      setPending(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 -z-20">
        {(Object.keys(accountConfig) as AccountType[]).map((key) => (
          <img
            key={key}
            src={accountConfig[key].image}
            alt=""
            aria-hidden="true"
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out",
              activeModule === key ? "opacity-100" : "opacity-0",
            )}
          />
        ))}
      </div>

      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/78 via-white/46 to-[rgba(15,47,53,0.32)]" />

      <section className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full gap-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          <div className="relative min-h-[560px] overflow-hidden rounded-xl border border-white/50 shadow-[0_24px_70px_rgba(23,58,64,0.18)]">
            {(Object.keys(accountConfig) as AccountType[]).map((key) => (
              <img
                key={`feature-${key}`}
                src={accountConfig[key].image}
                alt=""
                aria-hidden="true"
                className={cn(
                  "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out",
                  activeModule === key ? "opacity-100" : "opacity-0",
                )}
              />
            ))}

            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-t",
                active.tint,
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
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/85">
                  {active.title}
                </span>
              </div>

              <h1 className="max-w-xl text-4xl font-bold leading-tight sm:text-5xl">
                Create your {active.shortTitle} account.
              </h1>

              <p
                className={cn(
                  "mt-4 max-w-md text-sm leading-relaxed sm:text-base",
                  active.accent,
                )}
              >
                {active.description}
              </p>

              <div className="mt-6 grid gap-2.5 sm:max-w-md">
                {active.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-2.5 rounded-lg border border-white/12 bg-white/8 px-3 py-2.5 backdrop-blur-sm"
                  >
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-white" />
                    <p className="text-sm text-white/90">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Card className="gap-0 rounded-xl border-white/60 bg-white/48 p-4 shadow-sm backdrop-blur-md sm:p-6">
            <CardHeader className="mb-6 border-b border-border/50 px-0 pb-5">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    New account
                  </p>
                  <CardTitle className="text-3xl font-bold text-slate-900">
                    Get started
                  </CardTitle>
                  <CardDescription className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">
                    Pick the travel category you want to begin with, then create
                    your account to continue booking and managing your trips.
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
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-slate-900">
                  Select travel category
                </Label>

                <div className="grid gap-2 md:grid-cols-2">
                  {(Object.keys(accountConfig) as AccountType[]).map((key) => {
                    const item = accountConfig[key];
                    const Icon = item.icon;
                    const isActive = activeModule === key;

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleModuleChange(key)}
                        aria-pressed={isActive}
                        className={cn(
                          "rounded-xl border px-4 py-4 text-left transition-all",
                          isActive
                            ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                            : "border-border/60 bg-white/75 text-slate-800 hover:border-slate-300 hover:bg-white",
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={cn(
                              "flex size-9 items-center justify-center rounded-lg",
                              isActive
                                ? "bg-white/14 text-white"
                                : "bg-slate-100 text-slate-700",
                            )}
                          >
                            <Icon className="size-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold">
                              {item.shortTitle}
                            </p>
                            <p
                              className={cn(
                                "mt-0.5 text-xs",
                                isActive
                                  ? "text-white/75"
                                  : "text-muted-foreground",
                              )}
                            >
                              Separate booking space
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Separator />

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {formError ? (
                  <div
                    role="alert"
                    className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                  >
                    <AlertCircle className="mt-0.5 size-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                ) : null}

                {registeredWithoutSession ? (
                  <div
                    role="status"
                    className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800"
                  >
                    Your account was created, but no active session was found.
                    Please{" "}
                    <Link
                      to="/sign-in"
                      search={{ module: activeModule }}
                      className="font-semibold underline underline-offset-4"
                    >
                      sign in
                    </Link>
                    .
                  </div>
                ) : null}

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    id="firstName"
                    label="First name"
                    error={fieldErrors.firstName}
                  >
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="firstName"
                        name="firstName"
                        autoComplete="given-name"
                        placeholder="Jhon"
                        aria-invalid={Boolean(fieldErrors.firstName)}
                        aria-describedby={
                          fieldErrors.firstName
                            ? "firstName-error"
                            : undefined
                        }
                        className={cn(
                          "h-11 border-white/60 bg-white/85 pl-10 shadow-none placeholder:text-slate-400 focus-visible:ring-slate-400",
                          fieldErrors.firstName &&
                          "border-red-400 focus-visible:ring-red-400",
                        )}
                        onChange={() => clearFieldError("firstName")}
                      />
                    </div>
                  </Field>

                  <Field
                    id="lastName"
                    label="Last name"
                    error={fieldErrors.lastName}
                  >
                    <Input
                      id="lastName"
                      name="lastName"
                      autoComplete="family-name"
                      placeholder="Doe"
                      aria-invalid={Boolean(fieldErrors.lastName)}
                      aria-describedby={
                        fieldErrors.lastName ? "lastName-error" : undefined
                      }
                      className={cn(
                        "h-11 border-white/60 bg-white/85 shadow-none placeholder:text-slate-400 focus-visible:ring-slate-400",
                        fieldErrors.lastName &&
                        "border-red-400 focus-visible:ring-red-400",
                      )}
                      onChange={() => clearFieldError("lastName")}
                    />
                  </Field>
                </div>

                <Field
                  id="email"
                  label="Email address"
                  error={fieldErrors.email}
                >
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      aria-invalid={Boolean(fieldErrors.email)}
                      aria-describedby={
                        fieldErrors.email ? "email-error" : undefined
                      }
                      className={cn(
                        "h-11 border-white/60 bg-white/85 pl-10 shadow-none placeholder:text-slate-400 focus-visible:ring-slate-400",
                        fieldErrors.email &&
                        "border-red-400 focus-visible:ring-red-400",
                      )}
                      onChange={() => clearFieldError("email")}
                    />
                  </div>
                </Field>

                <Field
                  id="phone"
                  label="Mobile number"
                  hint="Optional"
                  error={fieldErrors.phone}
                >
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="+91 90000 00000"
                      aria-invalid={Boolean(fieldErrors.phone)}
                      aria-describedby={
                        fieldErrors.phone ? "phone-error" : undefined
                      }
                      className={cn(
                        "h-11 border-white/60 bg-white/85 pl-10 shadow-none placeholder:text-slate-400 focus-visible:ring-slate-400",
                        fieldErrors.phone &&
                        "border-red-400 focus-visible:ring-red-400",
                      )}
                      onChange={() => clearFieldError("phone")}
                    />
                  </div>
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    id="password"
                    label="Password"
                    error={fieldErrors.password}
                    hint="At least 8 characters, with uppercase, lowercase, and a number."
                  >
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Create a password"
                        aria-invalid={Boolean(fieldErrors.password)}
                        aria-describedby={
                          fieldErrors.password
                            ? "password-error password-hint"
                            : "password-hint"
                        }
                        className={cn(
                          "h-11 border-white/60 bg-white/85 pl-10 pr-11 shadow-none placeholder:text-slate-400 focus-visible:ring-slate-400",
                          fieldErrors.password &&
                          "border-red-400 focus-visible:ring-red-400",
                        )}
                        onChange={() => clearFieldError("password")}
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
                  </Field>

                  <Field
                    id="confirmPassword"
                    label="Confirm password"
                    error={fieldErrors.confirmPassword}
                  >
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Repeat password"
                        aria-invalid={Boolean(fieldErrors.confirmPassword)}
                        aria-describedby={
                          fieldErrors.confirmPassword
                            ? "confirmPassword-error"
                            : undefined
                        }
                        className={cn(
                          "h-11 border-white/60 bg-white/85 pl-10 pr-11 shadow-none placeholder:text-slate-400 focus-visible:ring-slate-400",
                          fieldErrors.confirmPassword &&
                          "border-red-400 focus-visible:ring-red-400",
                        )}
                        onChange={() => clearFieldError("confirmPassword")}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword((prev) => !prev)
                        }
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
                  </Field>
                </div>

                <div className="rounded-xl border border-border/60 bg-white/70 p-3.5">
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    By creating an account, you agree to our{" "}
                    <Link
                      to="/terms"
                      className="font-medium text-slate-900 underline underline-offset-4"
                    >
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="font-medium text-slate-900 underline underline-offset-4"
                    >
                      Privacy Policy
                    </Link>
                    . Your account will be created under the{" "}
                    <span className="font-semibold text-slate-900">
                      {active.title}
                    </span>{" "}
                    module.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={pending}
                  className={cn(
                    "h-11 w-full font-semibold",
                    active.buttonClass,
                  )}
                >
                  {pending ? "Creating account..." : `Create ${active.shortTitle} account`}
                </Button>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={pending}
                    className="h-11 border-white/60 bg-white/75 text-slate-800 hover:bg-white"
                  >
                    Continue with OTP
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    disabled={pending}
                    className="h-11 border-white/60 bg-white/75 text-slate-800 hover:bg-white"
                  >
                    Continue with Google
                  </Button>
                </div>
              </form>

              <Separator />

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-700">
                    Already have an account?{" "}
                    <Link
                      to="/sign-in"
                      search={{ module: activeModule }}
                      className="font-semibold text-slate-950 underline underline-offset-4"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>

                <a
                  href="tel:+919000000000"
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-950"
                >
                  <Phone className="size-4" />
                  Need help choosing?
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-slate-900">
        {label}
      </Label>

      {children}

      {hint && !error ? (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="flex items-center gap-1.5 text-xs font-medium text-red-600"
        >
          <AlertCircle className="size-3.5" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
