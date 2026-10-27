import { type FormEvent, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowLeft,
	CalendarDays,
	Check,
	ChevronDown,
	Clock3,
	Info,
	MapPin,
	Save,
	Users,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import { Separator } from "#/components/ui/separator";

export const Route = createFileRoute("/_authenticated/departures/new")({
	component: CreateDeparturePage,
});

type DepartureStatus =
	| "scheduled"
	| "full"
	| "closed"
	| "cancelled"
	| "completed";

type RoomType = "single" | "double" | "triple" | "quad" | "child";

type DeparturePricingInput = {
	roomType: RoomType;
	price: number;
	compareAtPrice: number | null;
};

type CreateDeparturePayload = {
	tourId: string;
	code: string;
	startDate: Date;
	endDate: Date;
	totalSeats: number;
	availableSeats: number;
	status: DepartureStatus;
	bookingDeadline: Date | null;
	cancellationDeadline: Date | null;
	notes: string | null;
	isGuaranteed: boolean;
	isActive: boolean;
	pricing: DeparturePricingInput[];
};

// Temporary options for UI development.
// Replace these IDs with actual tour records loaded from your database.
const sampleTours = [
	{
		id: "tour-001",
		title: "Kashmir Paradise",
		code: "DOM-KAS-001",
	},
	{
		id: "tour-002",
		title: "Rajasthan Heritage Trail",
		code: "DOM-RAJ-002",
	},
	{
		id: "tour-003",
		title: "Kerala Backwaters Escape",
		code: "DOM-KER-003",
	},
	{
		id: "tour-004",
		title: "Goa Beach Holiday",
		code: "DOM-GOA-004",
	},
	{
		id: "tour-005",
		title: "Manali Mountain Adventure",
		code: "DOM-MAN-005",
	},
];

const roomTypes: {
	value: RoomType;
	label: string;
	description: string;
}[] = [
	{
		value: "single",
		label: "Single",
		description: "Single occupancy",
	},
	{
		value: "double",
		label: "Double",
		description: "Double occupancy",
	},
	{
		value: "triple",
		label: "Triple",
		description: "Triple occupancy",
	},
	{
		value: "quad",
		label: "Quad",
		description: "Four-person occupancy",
	},
	{
		value: "child",
		label: "Child",
		description: "Child pricing",
	},
];

const inputClass =
	"h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring";

const textareaClass =
	"min-h-24 w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring";

const selectClass =
	"h-10 w-full appearance-none rounded-md border border-input bg-background px-3 pr-9 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

function Field({
	label,
	htmlFor,
	required,
	hint,
	children,
}: {
	label: string;
	htmlFor: string;
	required?: boolean;
	hint?: string;
	children: ReactNode;
}) {
	return (
		<div className="min-w-0 space-y-2">
			<label htmlFor={htmlFor} className="text-sm font-medium leading-none">
				{label}
				{required && <span className="ml-1 text-destructive">*</span>}
			</label>

			{children}

			{hint && (
				<p className="text-xs leading-relaxed text-muted-foreground">{hint}</p>
			)}
		</div>
	);
}

function SectionHeading({
	icon: Icon,
	title,
	description,
}: {
	icon: typeof CalendarDays;
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

function SelectField({
	id,
	name,
	defaultValue,
	required,
	children,
}: {
	id: string;
	name: string;
	defaultValue?: string;
	required?: boolean;
	children: ReactNode;
}) {
	return (
		<div className="relative">
			<select
				id={id}
				name={name}
				defaultValue={defaultValue}
				required={required}
				className={selectClass}
			>
				{children}
			</select>

			<ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
		</div>
	);
}

function CheckboxField({
	name,
	label,
	description,
	defaultChecked,
}: {
	name: string;
	label: string;
	description: string;
	defaultChecked?: boolean;
}) {
	return (
		<label className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/30">
			<input
				type="checkbox"
				name={name}
				defaultChecked={defaultChecked}
				className="mt-1 size-4 shrink-0 accent-primary"
			/>

			<span className="min-w-0 space-y-1">
				<span className="block text-sm font-medium">{label}</span>
				<span className="block text-xs leading-relaxed text-muted-foreground">
					{description}
				</span>
			</span>
		</label>
	);
}

function readText(formData: FormData, name: string): string {
	const value = formData.get(name);
	return typeof value === "string" ? value.trim() : "";
}

function readOptionalText(formData: FormData, name: string): string | null {
	return readText(formData, name) || null;
}

function readInteger(formData: FormData, name: string): number | null {
	const value = readText(formData, name);

	if (!value) return null;

	const number = Number(value);

	return Number.isSafeInteger(number) ? number : null;
}

/**
 * datetime-local values represent local wall-clock time.
 * JavaScript Date interprets this format in the browser's local timezone.
 *
 * The server should validate the value again and apply your application's
 * intended timezone policy before persisting timestamps.
 */
function readDate(formData: FormData, name: string): Date | null {
	const value = readText(formData, name);

	if (!value) return null;

	const date = new Date(value);

	return Number.isNaN(date.getTime()) ? null : date;
}

function formatINR(amount: number) {
	return new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		maximumFractionDigits: 0,
	}).format(amount);
}

function CreateDeparturePage() {
	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const form = event.currentTarget;
		const formData = new FormData(form);

		const submitter = (event.nativeEvent as SubmitEvent)
			.submitter as HTMLButtonElement | null;

		const intent = submitter?.value === "schedule" ? "schedule" : "draft";

		const tourId = readText(formData, "tourId");
		const code = readText(formData, "code");
		const startDate = readDate(formData, "startDate");
		const endDate = readDate(formData, "endDate");

		const totalSeats = readInteger(formData, "totalSeats");
		const availableSeats = readInteger(formData, "availableSeats");

		const status = readText(formData, "status") as DepartureStatus;

		if (!tourId || !code || !startDate || !endDate) {
			toast.error("Complete all required departure details.");
			return;
		}

		if (startDate.getTime() >= endDate.getTime()) {
			toast.error("The return date and time must be after departure.");
			return;
		}

		if (
			totalSeats === null ||
			availableSeats === null ||
			totalSeats < 1 ||
			availableSeats < 0 ||
			availableSeats > totalSeats
		) {
			toast.error(
				"Check the seat capacity. Available seats must be between zero and total seats.",
			);
			return;
		}

		const validStatuses: DepartureStatus[] = [
			"scheduled",
			"full",
			"closed",
			"cancelled",
			"completed",
		];

		if (!validStatuses.includes(status)) {
			toast.error("Select a valid departure status.");
			return;
		}

		const bookingDeadline = readDate(formData, "bookingDeadline");
		const cancellationDeadline = readDate(formData, "cancellationDeadline");

		if (bookingDeadline && bookingDeadline.getTime() > startDate.getTime()) {
			toast.error("The booking deadline cannot be after departure.");
			return;
		}

		if (
			cancellationDeadline &&
			cancellationDeadline.getTime() > startDate.getTime()
		) {
			toast.error("The cancellation deadline cannot be after departure.");
			return;
		}

		const pricing: DeparturePricingInput[] = [];

		for (const room of roomTypes) {
			const priceText = readText(formData, `price_${room.value}`);
			const compareText = readText(formData, `compareAtPrice_${room.value}`);

			// A room type is optional. Only create a pricing row when its
			// selling price has been supplied.
			if (!priceText && !compareText) continue;

			const price = Number(priceText);
			const compareAtPrice = compareText ? Number(compareText) : null;

			if (!priceText || !Number.isSafeInteger(price) || price <= 0) {
				toast.error(
					`Enter a valid selling price for ${room.label.toLowerCase()} pricing.`,
				);
				return;
			}

			if (
				compareAtPrice !== null &&
				(!Number.isSafeInteger(compareAtPrice) || compareAtPrice <= price)
			) {
				toast.error(
					`The original ${room.label.toLowerCase()} price must be greater than its selling price.`,
				);
				return;
			}

			pricing.push({
				roomType: room.value,
				price,
				compareAtPrice,
			});
		}

		const payload: CreateDeparturePayload = {
			tourId,
			code,
			startDate,
			endDate,
			totalSeats,
			availableSeats,
			status,
			bookingDeadline,
			cancellationDeadline,
			notes: readOptionalText(formData, "notes"),
			isGuaranteed: formData.has("isGuaranteed"),
			isActive: formData.has("isActive"),
			pricing,
		};

		/*
		 * TODO: Call a createDeparture TanStack Start server function.
		 *
		 * The server should:
		 * 1. Validate this payload on the server.
		 * 2. Verify admin permissions.
		 * 3. Verify that the selected tour exists.
		 * 4. Check departure code uniqueness.
		 * 5. Insert the departure.
		 * 6. Insert each supplied pricing row into departure_pricing.
		 *
		 * Insert the departure and pricing rows inside a database transaction.
		 */

		console.info("Create departure payload:", {
			...payload,
			intent,
		});

		toast.info(
			intent === "schedule"
				? "Form validated. Connect the server function to schedule this departure."
				: "Form validated. Connect the server function to save this departure.",
		);
	}

	return (
		<main className="min-w-0 space-y-6 p-4 md:p-6 lg:p-8">
			{/* Page header */}
			<section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<div className="space-y-2">
					<Button
						variant="ghost"
						size="sm"
						className="-ml-3 w-fit text-muted-foreground"
						asChild
					>
						<Link to="/departures">
							<ArrowLeft className="mr-2 size-4" />
							Back to departures
						</Link>
					</Button>

					<div>
						<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
							Create departure
						</h1>

						<p className="mt-1 text-sm text-muted-foreground">
							Schedule a tour batch, configure capacity, and set ticket pricing.
						</p>
					</div>
				</div>

				<Badge variant="outline" className="w-fit gap-1.5">
					<span className="size-1.5 rounded-full bg-amber-500" />
					New departure
				</Badge>
			</section>

			<form onSubmit={handleSubmit}>
				<div className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
					{/* Main form */}
					<div className="min-w-0 space-y-6">
						{/* Tour association */}
						<Card>
							<CardHeader>
								<SectionHeading
									icon={MapPin}
									title="Tour information"
									description="Select the existing tour for this departure batch."
								/>
							</CardHeader>

							<CardContent className="space-y-5">
								<Field
									label="Tour"
									htmlFor="tourId"
									required
									hint="These are development options. Replace them with actual published or active tour records from your database."
								>
									<SelectField
										id="tourId"
										name="tourId"
										required
										defaultValue=""
									>
										<option value="" disabled>
											Select a tour
										</option>

										{sampleTours.map((tour) => (
											<option key={tour.id} value={tour.id}>
												{tour.title} ({tour.code})
											</option>
										))}
									</SelectField>
								</Field>

								<Field
									label="Departure code"
									htmlFor="code"
									required
									hint="A unique identifier for this scheduled batch."
								>
									<Input
										id="code"
										name="code"
										placeholder="e.g. KAS-NOV-001"
										required
										maxLength={100}
										className={inputClass}
									/>
								</Field>
							</CardContent>
						</Card>

						{/* Travel dates */}
						<Card>
							<CardHeader>
								<SectionHeading
									icon={CalendarDays}
									title="Travel schedule"
									description="Set the departure and return dates and times."
								/>
							</CardHeader>

							<CardContent className="space-y-5">
								<div className="grid gap-5 sm:grid-cols-2">
									<Field
										label="Departure date and time"
										htmlFor="startDate"
										required
									>
										<Input
											id="startDate"
											name="startDate"
											type="datetime-local"
											required
											className={inputClass}
										/>
									</Field>

									<Field
										label="Return date and time"
										htmlFor="endDate"
										required
									>
										<Input
											id="endDate"
											name="endDate"
											type="datetime-local"
											required
											className={inputClass}
										/>
									</Field>
								</div>

								<div className="rounded-lg border border-dashed p-4">
									<div className="flex items-start gap-3">
										<Clock3 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

										<p className="text-xs leading-relaxed text-muted-foreground">
											Both fields are converted to JavaScript Date values using
											the browser's local timezone. Make sure your server
											follows a consistent timezone policy when storing and
											displaying departure times.
										</p>
									</div>
								</div>

								<Separator />

								<div className="grid gap-5 sm:grid-cols-2">
									<Field
										label="Booking deadline"
										htmlFor="bookingDeadline"
										hint="Optional. The last date and time customers may book."
									>
										<Input
											id="bookingDeadline"
											name="bookingDeadline"
											type="datetime-local"
											className={inputClass}
										/>
									</Field>

									<Field
										label="Cancellation deadline"
										htmlFor="cancellationDeadline"
										hint="Optional. The deadline for cancellations under this departure's policy."
									>
										<Input
											id="cancellationDeadline"
											name="cancellationDeadline"
											type="datetime-local"
											className={inputClass}
										/>
									</Field>
								</div>
							</CardContent>
						</Card>

						{/* Capacity */}
						<Card>
							<CardHeader>
								<SectionHeading
									icon={Users}
									title="Seat capacity"
									description="Configure the number of passengers this departure can accommodate."
								/>
							</CardHeader>

							<CardContent className="space-y-5">
								<div className="grid gap-5 sm:grid-cols-2">
									<Field label="Total seats" htmlFor="totalSeats" required>
										<Input
											id="totalSeats"
											name="totalSeats"
											type="number"
											min={1}
											step={1}
											defaultValue={20}
											required
											className={inputClass}
										/>
									</Field>

									<Field
										label="Available seats"
										htmlFor="availableSeats"
										required
										hint="For a new departure, this is normally the same as total seats."
									>
										<Input
											id="availableSeats"
											name="availableSeats"
											type="number"
											min={0}
											step={1}
											defaultValue={20}
											required
											className={inputClass}
										/>
									</Field>
								</div>

								<div className="rounded-lg bg-muted/40 p-4">
									<div className="flex items-start gap-3">
										<Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

										<p className="text-xs leading-relaxed text-muted-foreground">
											The server should ensure available seats never exceed
											total seats. When bookings are created or cancelled,
											update capacity consistently to prevent overbooking.
										</p>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Pricing */}
						<Card>
							<CardHeader>
								<SectionHeading
									icon={Save}
									title="Departure pricing"
									description="Optionally configure selling prices for each room or passenger category."
								/>
							</CardHeader>

							<CardContent className="space-y-5">
								<div className="rounded-lg border border-dashed p-4">
									<p className="text-sm font-medium">Pricing guidelines</p>

									<p className="mt-1 text-xs leading-relaxed text-muted-foreground">
										Prices are per person in INR, excluding GST, as defined by
										your database schema. Every room type is optional. Leave
										both price fields empty for a room type you do not offer.
									</p>
								</div>

								{roomTypes.map((room) => (
									<div
										key={room.value}
										className="space-y-4 rounded-lg border p-4"
									>
										<div>
											<h3 className="text-sm font-semibold">{room.label}</h3>

											<p className="mt-1 text-xs text-muted-foreground">
												{room.description}
											</p>
										</div>

										<div className="grid gap-4 sm:grid-cols-2">
											<Field
												label="Selling price (₹)"
												htmlFor={`price_${room.value}`}
											>
												<Input
													id={`price_${room.value}`}
													name={`price_${room.value}`}
													type="number"
													min={1}
													step={1}
													placeholder="e.g. 25000"
													className={inputClass}
												/>
											</Field>

											<Field
												label="Original price (₹)"
												htmlFor={`compareAtPrice_${room.value}`}
												hint="Optional. Must exceed the selling price."
											>
												<Input
													id={`compareAtPrice_${room.value}`}
													name={`compareAtPrice_${room.value}`}
													type="number"
													min={1}
													step={1}
													placeholder="e.g. 30000"
													className={inputClass}
												/>
											</Field>
										</div>
									</div>
								))}

								<div className="flex items-start gap-3 rounded-lg bg-muted/40 p-4">
									<Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

									<p className="text-xs leading-relaxed text-muted-foreground">
										These values belong in the separate{" "}
										<code>departure_pricing</code> table. The create operation
										should insert the departure and all supplied pricing rows in
										one transaction.
									</p>
								</div>
							</CardContent>
						</Card>

						{/* Status and notes */}
						<Card>
							<CardHeader>
								<SectionHeading
									icon={Clock3}
									title="Status and notes"
									description="Set the initial operational status and add internal information."
								/>
							</CardHeader>

							<CardContent className="space-y-5">
								<Field label="Departure status" htmlFor="status" required>
									<SelectField
										id="status"
										name="status"
										required
										defaultValue="scheduled"
									>
										<option value="scheduled">Scheduled</option>
										<option value="full">Full</option>
										<option value="closed">Closed</option>
										<option value="cancelled">Cancelled</option>
										<option value="completed">Completed</option>
									</SelectField>
								</Field>

								<Field
									label="Internal notes"
									htmlFor="notes"
									hint="Optional. These notes are intended for administrators."
								>
									<Textarea
										id="notes"
										name="notes"
										className={textareaClass}
										placeholder="Add operational notes, supplier details, or special arrangements..."
									/>
								</Field>
							</CardContent>
						</Card>
					</div>

					{/* Sidebar */}
					<aside className="min-w-0 space-y-6 xl:sticky xl:top-6">
						<Card>
							<CardHeader>
								<CardTitle>Departure settings</CardTitle>
								<CardDescription>
									Configure operational availability.
								</CardDescription>
							</CardHeader>

							<CardContent className="space-y-4">
								<CheckboxField
									name="isActive"
									label="Active departure"
									description="Keep this departure enabled for operational management."
									defaultChecked
								/>

								<CheckboxField
									name="isGuaranteed"
									label="Guaranteed departure"
									description="Mark this batch as guaranteed to depart according to your business rules."
								/>

								<Separator />

								<div className="rounded-lg bg-muted/40 p-3">
									<div className="flex items-start gap-2">
										<Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

										<p className="text-xs leading-relaxed text-muted-foreground">
											A guaranteed departure should only be marked as such when
											it satisfies your company's guarantee policy.
										</p>
									</div>
								</div>

								<Button
									type="submit"
									name="intent"
									value="draft"
									variant="outline"
									className="w-full"
								>
									<Save className="mr-2 size-4" />
									Save departure
								</Button>

								<Button
									type="submit"
									name="intent"
									value="schedule"
									className="w-full"
								>
									<Check className="mr-2 size-4" />
									Save & schedule
								</Button>

								<Button
									type="button"
									variant="ghost"
									className="w-full"
									asChild
								>
									<Link to="/departures">Cancel</Link>
								</Button>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-base">Before scheduling</CardTitle>
							</CardHeader>

							<CardContent className="space-y-4">
								{[
									"Select the correct tour.",
									"Verify departure and return dates.",
									"Confirm seat capacity.",
									"Set booking and cancellation deadlines.",
									"Review room pricing if applicable.",
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
