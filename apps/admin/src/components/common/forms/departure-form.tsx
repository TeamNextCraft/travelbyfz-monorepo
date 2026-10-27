import { departureStatuses, roomTypes } from "@repo/db/schema/domestic.ts";
import { useForm } from "@tanstack/react-form-start";
import {
	ArrowLeft,
	Banknote,
	CalendarDays,
	Check,
	FileText,
	Info,
	Loader2,
	Plus,
	Trash2,
	Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { CheckboxField } from "#/components/form/checkbox-input";
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
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import {
	type DepartureInsertFormValues,
	departureInsertSchema,
} from "#/lib/schema/departures";

export const emptyDeparture = (tourId: string): DepartureInsertFormValues => ({
	tourId,
	code: "",
	// Left empty on purpose so the user must pick the dates.
	startDate: undefined as unknown as Date,
	endDate: undefined as unknown as Date,
	totalSeats: 20,
	availableSeats: 20, // overwritten with totalSeats on create
	status: "scheduled",
	bookingDeadline: null,
	cancellationDeadline: null,
	notes: null,
	isGuaranteed: false,
	isActive: true,
	pricing: [{ roomType: roomTypes[0], price: 0, compareAtPrice: null }],
});

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const formatLabel = (value: string) =>
	value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

const toOptions = (values: readonly string[]) =>
	values.map((value) => ({ value, label: formatLabel(value) }));

const STATUS_OPTIONS = toOptions(departureStatuses);

/** Date | string | null → "yyyy-mm-dd" in LOCAL time (what <input type="date"> expects) */
function toDateInputValue(value: unknown) {
	if (!value) return "";
	const date = value instanceof Date ? value : new Date(value as string);
	if (Number.isNaN(date.getTime())) return "";
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** "yyyy-mm-dd" → Date at local midnight (avoids the UTC off-by-one of new Date("yyyy-mm-dd")) */
function fromDateInputValue(raw: string) {
	if (!raw) return null;
	const [y, m, d] = raw.split("-").map(Number);
	return new Date(y, m - 1, d);
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

/**
 * Date input. Consider moving this to #/components/form/date-input.tsx
 * so other forms (e.g. destinations) can reuse it.
 */
function DateField({
	field,
	label,
	description,
}: {
	field: {
		name: string;
		state: {
			value: unknown;
			meta: { isTouched: boolean; isValid: boolean; errors: unknown[] };
		};
		handleBlur: () => void;
		handleChange: (value: never) => void;
	};
	label: string;
	description?: string;
}) {
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
	return (
		<Field data-invalid={isInvalid}>
			<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
			<Input
				id={field.name}
				name={field.name}
				type="date"
				value={toDateInputValue(field.state.value)}
				onBlur={field.handleBlur}
				onChange={(e) =>
					field.handleChange(fromDateInputValue(e.target.value) as never)
				}
				aria-invalid={isInvalid}
			/>
			{description && <FieldDescription>{description}</FieldDescription>}
			{isInvalid && (
				<FieldError
					errors={field.state.meta.errors as { message?: string }[]}
				/>
			)}
		</Field>
	);
}

/* ------------------------------------------------------------------ */
/* Form                                                                */
/* ------------------------------------------------------------------ */

type DepartureFormProps = {
	mode: "create" | "edit";
	tourId: string;
	/** Shown in the header so it's clear which tour this belongs to */
	tourTitle?: string;
	defaultValues?: DepartureInsertFormValues;
	onSubmit: (value: DepartureInsertFormValues) => Promise<void>;
	onCancel: () => void;
};

export function DepartureForm({
	mode,
	tourId,
	tourTitle,
	defaultValues,
	onSubmit,
	onCancel,
}: DepartureFormProps) {
	const isEdit = mode === "edit";

	const form = useForm({
		defaultValues: defaultValues ?? emptyDeparture(tourId),
		validators: {
			onSubmit: departureInsertSchema,
			onBlur: departureInsertSchema,
		},
		onSubmit: async ({ value }) => {
			// A brand-new departure starts with every seat available.
			await onSubmit(
				isEdit ? value : { ...value, availableSeats: value.totalSeats },
			);
		},
	});

	return (
		<main className="min-w-0 space-y-6 p-4 md:p-6 lg:p-8">
			{/* Page header */}
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
						Back to tour
					</Button>

					<div>
						<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
							{isEdit ? "Edit departure" : "Create departure"}
						</h1>
						<p className="mt-1 text-sm text-muted-foreground">
							{tourTitle
								? `Scheduled departure for ${tourTitle}.`
								: "Schedule a departure with seats and pricing."}
						</p>
					</div>
				</div>

				<Badge variant="outline" className="gap-1.5">
					<span
						className={`size-1.5 rounded-full ${isEdit ? "bg-blue-500" : "bg-amber-500"}`}
					/>
					{isEdit ? "Editing" : "New departure"}
				</Badge>
			</section>

			<form
				id="departure-form"
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
			>
				<div className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
					<div className="min-w-0 space-y-6">
						{/* Basic */}
						<FormSection
							icon={FileText}
							title="Departure details"
							description="Identify this departure and set its current status."
						>
							<div className="grid gap-5 sm:grid-cols-2">
								<form.Field name="code">
									{(field) => (
										<TextField
											field={field}
											label="Departure code"
											placeholder="KAS-2026-12-05"
											description="A unique reference, e.g. tour code + start date."
										/>
									)}
								</form.Field>
								<form.Field name="status">
									{(field) => (
										<SelectField
											field={field}
											label="Status"
											placeholder="Select status"
											options={STATUS_OPTIONS}
										/>
									)}
								</form.Field>
							</div>
						</FormSection>

						{/* Schedule */}
						<FormSection
							icon={CalendarDays}
							title="Schedule"
							description="Travel dates and the cut-off dates for bookings."
						>
							<div className="grid gap-5 sm:grid-cols-2">
								<form.Field name="startDate">
									{(field) => <DateField field={field} label="Start date" />}
								</form.Field>
								<form.Field name="endDate">
									{(field) => <DateField field={field} label="End date" />}
								</form.Field>
								<form.Field name="bookingDeadline">
									{(field) => (
										<DateField
											field={field}
											label="Booking deadline"
											description="Optional. Last day customers can book."
										/>
									)}
								</form.Field>
								<form.Field name="cancellationDeadline">
									{(field) => (
										<DateField
											field={field}
											label="Cancellation deadline"
											description="Optional. Last day for cancellation."
										/>
									)}
								</form.Field>
							</div>
						</FormSection>

						{/* Seats */}
						<FormSection
							icon={Users}
							title="Seats"
							description={
								isEdit
									? "Adjust capacity. Available seats should reflect existing bookings."
									: "Set how many seats this departure can sell."
							}
						>
							<div className="grid gap-5 sm:grid-cols-2">
								<form.Field name="totalSeats">
									{(field) => (
										<TextField
											field={field}
											type="number"
											label="Total seats"
											placeholder="e.g. 20"
										/>
									)}
								</form.Field>

								{isEdit ? (
									<form.Field name="availableSeats">
										{(field) => (
											<TextField
												field={field}
												type="number"
												label="Available seats"
												placeholder="e.g. 12"
											/>
										)}
									</form.Field>
								) : (
									<div className="flex items-end text-sm text-muted-foreground">
										All seats are available when a departure is created.
									</div>
								)}
							</div>

							{isEdit && (
								<form.Subscribe
									selector={(s) => [
										s.values.totalSeats,
										s.values.availableSeats,
									]}
								>
									{([total, available]) => (
										<p className="text-xs text-muted-foreground">
											{Math.max(0, (total ?? 0) - (available ?? 0))} of{" "}
											{total ?? 0} seats booked.
										</p>
									)}
								</form.Subscribe>
							)}
						</FormSection>

						{/* Pricing */}
						<FormSection
							icon={Banknote}
							title="Pricing"
							description="Per-person price in INR, excluding GST, for each room type."
						>
							<form.Field name="pricing" mode="array">
								{(pricingField) => {
									const rows = pricingField.state.value;
									const usedTypes = rows.map((r) => r.roomType);
									const nextFree = roomTypes.find(
										(t) => !usedTypes.includes(t),
									);
									const arrayErrors = pricingField.state.meta.errors;
									const showArrayError =
										pricingField.state.meta.isTouched && arrayErrors.length > 0;

									return (
										<div className="space-y-4">
											{rows.map((row, index) => (
												<div
													// biome-ignore lint/suspicious/noArrayIndexKey: rows have no stable id
													key={index}
													className="grid gap-4 rounded-lg border p-4 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-start"
												>
													<form.Field name={`pricing[${index}].roomType`}>
														{(field) => (
															<SelectField
																field={field}
																label="Room type"
																placeholder="Room type"
																// Hide types already used by other rows
																options={toOptions(
																	roomTypes.filter(
																		(t) =>
																			t === row.roomType ||
																			!usedTypes.includes(t),
																	),
																)}
															/>
														)}
													</form.Field>

													<form.Field name={`pricing[${index}].price`}>
														{(field) => (
															<TextField
																field={field}
																type="number"
																label="Price (₹)"
																placeholder="e.g. 29500"
															/>
														)}
													</form.Field>

													<form.Field name={`pricing[${index}].compareAtPrice`}>
														{(field) => (
															<TextField
																field={field}
																type="number"
																nullable
																label="Compare-at (₹)"
																placeholder="Optional"
															/>
														)}
													</form.Field>

													<Button
														type="button"
														variant="ghost"
														size="icon"
														className="mt-0 text-muted-foreground hover:text-destructive sm:mt-[26px]"
														onClick={() => pricingField.removeValue(index)}
														disabled={rows.length === 1}
														aria-label="Remove price"
													>
														<Trash2 className="size-4" />
													</Button>
												</div>
											))}

											{showArrayError && (
												<FieldError
													errors={arrayErrors as { message?: string }[]}
												/>
											)}

											<Button
												type="button"
												variant="outline"
												size="sm"
												disabled={!nextFree}
												onClick={() =>
													nextFree &&
													pricingField.pushValue({
														roomType: nextFree,
														price: 0,
														compareAtPrice: null,
													})
												}
											>
												<Plus className="mr-2 size-4" />
												{nextFree ? "Add room type" : "All room types added"}
											</Button>
										</div>
									);
								}}
							</form.Field>
						</FormSection>

						{/* Notes */}
						<FormSection
							icon={FileText}
							title="Internal notes"
							description="Only visible to your team."
						>
							<form.Field name="notes">
								{(field) => (
									<TextAreaField
										field={field}
										nullable
										label="Notes"
										placeholder="e.g. Flights blocked with the airline until 15 Nov..."
									/>
								)}
							</form.Field>
						</FormSection>
					</div>

					{/* Sidebar */}
					<aside className="min-w-0 space-y-6 xl:sticky xl:top-6">
						<Card>
							<CardHeader>
								<CardTitle>Departure settings</CardTitle>
								<CardDescription>
									Control availability for customers.
								</CardDescription>
							</CardHeader>

							<CardContent className="space-y-4">
								<form.Field name="isActive">
									{(field) => (
										<CheckboxField
											field={field}
											label="Active"
											description="Customers can see and book this departure."
										/>
									)}
								</form.Field>

								<form.Field name="isGuaranteed">
									{(field) => (
										<CheckboxField
											field={field}
											label="Guaranteed departure"
											description="This departure will run regardless of group size."
										/>
									)}
								</form.Field>

								<div className="rounded-lg bg-muted/50 p-3">
									<div className="flex items-start gap-2">
										<Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
										<p className="text-xs leading-relaxed text-muted-foreground">
											Status describes the departure's lifecycle (for example
											sold out or cancelled). Active controls whether it is
											shown at all.
										</p>
									</div>
								</div>

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
												"Create departure"
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
								<CardTitle className="text-base">
									{isEdit ? "Before saving" : "Before creating"}
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								{[
									"Double-check the start and end dates.",
									"Make sure the departure code is unique.",
									"Set a price for every room type you sell.",
									"Confirm the seat count matches what you've blocked.",
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
