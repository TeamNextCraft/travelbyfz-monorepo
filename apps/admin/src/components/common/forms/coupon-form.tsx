// src/components/coupons/coupon-form.tsx
import { couponScopes, couponTypes } from "@repo/db/schema/domestic.ts";
import { useForm } from "@tanstack/react-form-start";
import {
	ArrowLeft,
	CalendarDays,
	Check,
	Info,
	Loader2,
	Percent,
	Shuffle,
	Ticket,
} from "lucide-react";
import type { ReactNode } from "react";
import { formatLabel } from "#/components/bookings/booking-ui";
import {
	CouponStatusBadge,
	formatInr,
	getCouponStatus,
	previewDiscount,
} from "#/components/coupons/coupon-ui";
import { CheckboxField } from "#/components/form/checkbox-input";
import { DateField } from "#/components/form/date-input";
import { SelectField } from "#/components/form/select-input";
import { TextAreaField } from "#/components/form/text-area-input";
import { TextField } from "#/components/form/text-input";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import {
	type CouponInputSchema,
	couponInsertSchema,
	emptyCoupon,
} from "#/lib/schema/coupon";

const toOptions = (values: readonly string[]) =>
	values.map((value) => ({ value, label: formatLabel(value) }));

const TYPE_OPTIONS = [
	{ value: "percentage", label: "Percentage off" },
	{ value: "flat", label: "Flat amount off" },
];
// Fall back to a friendlier label than "Percentage" / "Flat" if you add more types
void couponTypes;
const SCOPE_OPTIONS = toOptions(couponScopes);

/** Example booking used by the live preview in the sidebar. */
const PREVIEW_AMOUNT = 30000;

function generateCode() {
	const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I
	const suffix = Array.from(
		{ length: 5 },
		() => alphabet[Math.floor(Math.random() * alphabet.length)],
	).join("");
	return `SAVE${suffix}`;
}

function SectionHeading({
	icon: Icon,
	title,
	description,
}: {
	icon: typeof Info;
	title: string;
	description: string;
}) {
	return (
		<div className="flex items-start gap-3">
			<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/5">
				<Icon className="size-4 text-primary" />
			</div>
			<div className="space-y-1">
				<h2 className="font-semibold tracking-tight">{title}</h2>
				<p className="text-sm leading-relaxed text-muted-foreground">
					{description}
				</p>
			</div>
		</div>
	);
}

function FormSection({
	icon,
	title,
	description,
	children,
}: {
	icon: typeof Info;
	title: string;
	description: string;
	children: ReactNode;
}) {
	return (
		<Card>
			<CardHeader>
				<SectionHeading icon={icon} title={title} description={description} />
			</CardHeader>
			<CardContent className="space-y-5">{children}</CardContent>
		</Card>
	);
}

type CouponFormProps = {
	mode: "create" | "edit";
	defaultValues?: CouponInputSchema;
	/** Edit mode only: how many times the coupon has been redeemed */
	usedCount?: number;
	onSubmit: (value: CouponInputSchema) => Promise<void>;
	onCancel: () => void;
};

export function CouponForm({
	mode,
	defaultValues = emptyCoupon,
	usedCount = 0,
	onSubmit,
	onCancel,
}: CouponFormProps) {
	const isEdit = mode === "edit";

	const form = useForm({
		defaultValues,
		validators: {
			onSubmit: couponInsertSchema,
			onBlur: couponInsertSchema,
		},
		onSubmit: async ({ value }) => {
			await onSubmit({
				...value,
				// Flat coupons have no cap
				maxDiscountAmount:
					value.type === "flat" ? null : value.maxDiscountAmount,
			});
		},
	});

	return (
		<main className="min-w-0 space-y-6 p-4 md:p-6 lg:p-8">
			<section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<div className="space-y-2">
					<Button
						type="button"
						variant="ghost"
						size="sm"
						className="-ml-3 w-fit text-muted-foreground"
						onClick={onCancel}
					>
						<ArrowLeft className="mr-2 size-4" />
						Back to coupons
					</Button>
					<div>
						<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
							{isEdit ? "Edit coupon" : "Create coupon"}
						</h1>
						<p className="mt-1 text-sm text-muted-foreground">
							{isEdit
								? "Update the discount and its rules."
								: "Create a discount code customers can apply at checkout."}
						</p>
					</div>
				</div>

				<Badge variant="outline" className="gap-1.5">
					<span
						className={`size-1.5 rounded-full ${isEdit ? "bg-blue-500" : "bg-amber-500"}`}
					/>
					{isEdit ? "Editing" : "New coupon"}
				</Badge>
			</section>

			<form
				id="coupon-form"
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
			>
				<div className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
					<div className="min-w-0 space-y-6">
						<FormSection
							icon={Ticket}
							title="Coupon details"
							description="The code customers type, and a label for your team."
						>
							<div className="space-y-2">
								<form.Field
									name="code"
									listeners={{
										// Codes are always upper-case with no spaces
										onChange: ({ value }) => {
											const clean = value.toUpperCase().replace(/\s/g, "");
											if (clean !== value) form.setFieldValue("code", clean);
										},
									}}
								>
									{(field) => (
										<TextField
											field={field}
											label="Coupon code"
											placeholder="MONSOON20"
											description={
												usedCount > 0
													? "Can't be changed once the coupon has been used."
													: "What customers enter at checkout. Must be unique."
											}
										/>
									)}
								</form.Field>
								{!isEdit && (
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="-ml-2 text-muted-foreground"
										onClick={() => form.setFieldValue("code", generateCode())}
									>
										<Shuffle className="mr-2 size-3.5" />
										Generate a random code
									</Button>
								)}
							</div>

							<form.Field name="title">
								{(field) => (
									<TextField
										field={field}
										nullable
										label="Title"
										placeholder="Monsoon sale"
										description="Internal name, also shown to customers when applied."
									/>
								)}
							</form.Field>

							<form.Field name="description">
								{(field) => (
									<TextAreaField
										field={field}
										nullable
										label="Description"
										placeholder="e.g. 20% off all domestic tours booked before 30 September."
									/>
								)}
							</form.Field>
						</FormSection>

						<FormSection
							icon={Percent}
							title="Discount"
							description="How much customers save."
						>
							<div className="grid gap-5 sm:grid-cols-2">
								<form.Field
									name="type"
									listeners={{
										onChange: ({ value }) => {
											// A cap only makes sense for percentage coupons
											if (value === "flat") {
												form.setFieldValue("maxDiscountAmount", null);
											}
										},
									}}
								>
									{(field) => (
										<SelectField
											field={field}
											label="Discount type"
											placeholder="Select type"
											options={TYPE_OPTIONS}
										/>
									)}
								</form.Field>

								<form.Subscribe selector={(s) => s.values.type}>
									{(type) => (
										<form.Field name="value">
											{(field) => (
												<TextField
													field={field}
													type="number"
													label={
														type === "percentage"
															? "Percentage (%)"
															: "Amount (₹)"
													}
													placeholder={
														type === "percentage" ? "e.g. 20" : "e.g. 1500"
													}
												/>
											)}
										</form.Field>
									)}
								</form.Subscribe>
							</div>

							<div className="grid gap-5 sm:grid-cols-2">
								<form.Field name="minBookingAmount">
									{(field) => (
										<TextField
											field={field}
											type="number"
											nullable
											label="Minimum booking (₹)"
											placeholder="No minimum"
											description="Booking total needed to use this coupon."
										/>
									)}
								</form.Field>

								<form.Subscribe selector={(s) => s.values.type}>
									{(type) =>
										type === "percentage" ? (
											<form.Field name="maxDiscountAmount">
												{(field) => (
													<TextField
														field={field}
														type="number"
														nullable
														label="Maximum discount (₹)"
														placeholder="No cap"
														description="Caps the saving on large bookings."
													/>
												)}
											</form.Field>
										) : (
											<div className="flex items-end pb-2 text-sm text-muted-foreground">
												Flat coupons always take off the same amount.
											</div>
										)
									}
								</form.Subscribe>
							</div>
						</FormSection>

						<FormSection
							icon={CalendarDays}
							title="Rules and validity"
							description="Who can use it, how often and for how long."
						>
							<div className="grid gap-5 sm:grid-cols-2">
								<form.Field name="scope">
									{(field) => (
										<SelectField
											field={field}
											label="Applies to"
											placeholder="Select scope"
											options={SCOPE_OPTIONS}
										/>
									)}
								</form.Field>

								<form.Field name="usageLimit">
									{(field) => (
										<TextField
											field={field}
											type="number"
											nullable
											label="Total usage limit"
											placeholder="Unlimited"
											description={
												isEdit
													? `Used ${usedCount} time${usedCount === 1 ? "" : "s"} so far.`
													: "How many bookings can use this coupon."
											}
										/>
									)}
								</form.Field>
							</div>

							<div className="grid gap-5 sm:grid-cols-2">
								<form.Field name="startsAt">
									{(field) => (
										<DateField
											field={field}
											label="Starts on"
											description="Leave empty to start immediately."
										/>
									)}
								</form.Field>
								<form.Field name="expiresAt">
									{(field) => (
										<DateField
											field={field}
											endOfDay
											label="Expires on"
											description="Valid through the end of this day. Empty means no expiry."
										/>
									)}
								</form.Field>
							</div>
						</FormSection>
					</div>

					{/* Sidebar */}
					<aside className="min-w-0 space-y-6 xl:sticky xl:top-6">
						<Card>
							<CardHeader>
								<CardTitle>Coupon settings</CardTitle>
								<CardDescription>
									Control whether customers can use it.
								</CardDescription>
							</CardHeader>

							<CardContent className="space-y-4">
								<form.Field name="isActive">
									{(field) => (
										<CheckboxField
											field={field}
											label="Active"
											description="Turn off to pause the coupon without deleting it."
										/>
									)}
								</form.Field>

								{/* Live preview */}
								<form.Subscribe selector={(s) => s.values}>
									{(values) => {
										const preview = previewDiscount(values, PREVIEW_AMOUNT);
										const status = getCouponStatus({
											isActive: values.isActive,
											startsAt: values.startsAt,
											expiresAt: values.expiresAt,
											usageLimit: values.usageLimit,
											usedCount,
										});
										return (
											<div className="space-y-2 rounded-lg bg-muted/50 p-3">
												<div className="flex items-center justify-between">
													<p className="text-xs font-medium">Preview</p>
													<CouponStatusBadge status={status} />
												</div>
												<p className="text-xs leading-relaxed text-muted-foreground">
													{preview.eligible ? (
														<>
															On a {formatInr(PREVIEW_AMOUNT)} booking, the
															customer saves{" "}
															<span className="font-semibold text-foreground">
																{formatInr(preview.discount)}
															</span>
															.
														</>
													) : (
														<>
															A {formatInr(PREVIEW_AMOUNT)} booking is below the
															minimum, so this coupon wouldn't apply.
														</>
													)}
												</p>
											</div>
										);
									}}
								</form.Subscribe>

								<form.Subscribe selector={(state) => state.isSubmitting}>
									{(isSubmitting) => (
										<Button
											type="submit"
											className="w-full"
											disabled={isSubmitting}
										>
											{isSubmitting ? (
												<Loader2 className="animate-spin" />
											) : isEdit ? (
												"Save changes"
											) : (
												"Create coupon"
											)}
										</Button>
									)}
								</form.Subscribe>

								<Button
									type="button"
									variant="ghost"
									className="w-full"
									onClick={onCancel}
								>
									Cancel
								</Button>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-base">Before saving</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								{[
									"Check the code for typos. Customers have to type it exactly.",
									"Set a maximum discount on percentage coupons to protect your margin.",
									"Add an expiry date so offers don't run forever.",
									"Codes can't be deleted once used. Deactivate them instead.",
								].map((item) => (
									<div key={item} className="flex items-start gap-2">
										<div className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border">
											<Check className="size-2.5 text-muted-foreground" />
										</div>
										<p className="text-xs leading-relaxed text-muted-foreground">
											{item}
										</p>
									</div>
								))}
							</CardContent>
						</Card>
					</aside>
				</div>
			</form>
		</main>
	);
}
