import { z } from "zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeCheck, ShieldCheck, Wallet } from "lucide-react";
import {
  createWebinarOrder,
  verifyWebinarPayment,
} from "#/server/actions/webinar";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { Button } from "#/components/ui/button";
import { WEBINAR_AMOUNT } from "#/routes/invitation/webinar";

export const webinarRegistrationSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name is too long"),
  email: z.email("Enter a valid email address"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  city: z.string().max(60).optional(),
});

export type WebinarRegistrationInput = z.infer<
  typeof webinarRegistrationSchema
>;

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function WebinarRegistrationForm() {
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WebinarRegistrationInput>({
    resolver: zodResolver(webinarRegistrationSchema),
    defaultValues: { name: "", email: "", phone: "", city: "" },
  });

  React.useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  async function onSubmit(data: WebinarRegistrationInput) {
    setServerError(null);
    setLoading(true);

    try {
      const order = await createWebinarOrder({ data });

      const rzp = new window.Razorpay({
        key: order.key,
        amount: order.amount,
        currency: "INR",
        name: "FZ Tours & Travels",
        description: "Live Webinar Registration",
        order_id: order.orderId,
        prefill: { name: data.name, email: data.email, contact: data.phone },
        theme: { color: "#0f172a" },
        handler: async (response: any) => {
          await verifyWebinarPayment({ data: response });
          setSuccess(true);
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });

      rzp.open();
    } catch (err) {
      setServerError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <BadgeCheck className="size-12 text-emerald-600" />
        <h3 className="mt-4 text-xl font-semibold text-slate-900">
          You're Registered!
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-7 text-slate-600">
          Confirmation sent to your email and WhatsApp. Zoom link will be shared
          one day before the webinar.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup>
        <Field data-invalid={!!errors.name}>
          <FieldContent>
            <FieldLabel htmlFor="name">Full name</FieldLabel>
            <Input
              id="name"
              placeholder="Your full name"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
          </FieldContent>
          {errors.name && <FieldError>{errors.name.message}</FieldError>}
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={!!errors.email}>
            <FieldContent>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
            </FieldContent>
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
          </Field>

          <Field data-invalid={!!errors.phone}>
            <FieldContent>
              <FieldLabel htmlFor="phone">WhatsApp number</FieldLabel>
              <Input
                id="phone"
                type="tel"
                placeholder="9xxxxxxxxx"
                aria-invalid={!!errors.phone}
                {...register("phone")}
              />
            </FieldContent>
            {errors.phone && <FieldError>{errors.phone.message}</FieldError>}
          </Field>
        </div>

        <Field data-invalid={!!errors.city}>
          <FieldContent>
            <FieldLabel htmlFor="city">City (optional)</FieldLabel>
            <Input
              id="city"
              placeholder="e.g. Bhuj"
              aria-invalid={!!errors.city}
              {...register("city")}
            />
          </FieldContent>
          {errors.city && <FieldError>{errors.city.message}</FieldError>}
        </Field>
      </FieldGroup>

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <Button
        type="submit"
        variant={"default"}
        disabled={loading}
        // className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-60"
        className="w-full"
      >
        <Wallet className="size-4" />
        {loading ? "Processing..." : `Pay ₹${WEBINAR_AMOUNT / 100} & Reserve Seat`}
      </Button>

      <p className="flex items-center justify-center gap-2 text-xs text-slate-500">
        <ShieldCheck className="size-3.5" />
        Secured by Razorpay
      </p>
    </form>
  );
}
