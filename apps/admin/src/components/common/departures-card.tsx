import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
	CalendarDays,
	LoaderCircle,
	Pencil,
	Plus,
	RefreshCw,
	ShieldCheck,
	Trash2,
} from "lucide-react";
import { useState } from "react";
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
import { getTourDepartures, removeDepature } from "#/server/actions/departures";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Progress } from "../ui/progress";

type Filter = "upcoming" | "past" | "all";

const FILTERS: { value: Filter; label: string }[] = [
	{ value: "upcoming", label: "Upcoming" },
	{ value: "past", label: "Past" },
	{ value: "all", label: "All" },
];

const formatDate = (value: Date | string) =>
	new Date(value).toLocaleDateString("en-IN", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});

const formatPrice = (value: number) =>
	new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		maximumFractionDigits: 0,
	}).format(value);

const formatLabel = (value: string) =>
	value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

function statusClass(status: string) {
	switch (status) {
		case "open":
		case "scheduled":
			return "border-emerald-200 bg-emerald-50 text-emerald-700";
		case "sold_out":
			return "border-amber-200 bg-amber-50 text-amber-700";
		case "cancelled":
			return "border-red-200 bg-red-50 text-red-700";
		default:
			return "border-slate-200 bg-slate-100 text-slate-600";
	}
}

function SeatsBar({ total, available }: { total: number; available: number }) {
	const booked = Math.max(0, total - available);
	const percent = total > 0 ? Math.min(100, (booked / total) * 100) : 0;

	return (
		<div className="min-w-[110px] space-y-1">
			<Progress
				value={percent}
				aria-label={`${booked} of ${total} seats booked`}
				className={`h-1.5 ${available === 0 ? "[&>div]:bg-amber-500" : ""}`}
			/>

			<p className="text-xs text-muted-foreground">
				{available} of {total} left
			</p>
		</div>
	);
}

export function DeparturesCard({ tourId }: { tourId: string }) {
	const fetchDepartures = useServerFn(getTourDepartures);
	const [filter, setFilter] = useState<Filter>("upcoming");
	const [deleting, setDeleting] = useState<boolean>(false);
	const [deleteAlertDialogOpen, setDeleteAlertDialogOpen] =
		useState<boolean>(false);

	const { data, isPending, isError, refetch } = useQuery({
		queryKey: ["tour-departures", tourId],
		queryFn: () => fetchDepartures({ data: { tourId } }),
	});

	const deleteDepature = useServerFn(removeDepature);
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const all = data ?? [];
	const visible = all.filter((d) => {
		const ended = new Date(d.endDate) < today;
		if (filter === "upcoming") return !ended;
		if (filter === "past") return ended;
		return true;
	});

	const addButton = (
		<Button size="sm" asChild>
			<Link to="/tours/$tourId/departures/new" params={{ tourId }}>
				<Plus className="mr-2 size-4" />
				Add departure
			</Link>
		</Button>
	);

	const handleDeleteDeparture = async (id: string) => {
		try {
			setDeleting(true);
			setDeleteAlertDialogOpen(true);
			const result = await deleteDepature({ data: { departureId: id } });
			if (!result) {
				toast.error(`Error removing departure: ${id}`);
			}
			toast.success(`successfully removed departure: ${id}`);
			refetch();
		} catch (err) {
			console.error(`Error removing departure: ${id}`, err);
		} finally {
			setDeleting(false);
			setDeleteAlertDialogOpen(false);
		}
	};

	return (
		<Card>
			<CardHeader className="flex-row items-start justify-between gap-3">
				<div className="space-y-1.5">
					<CardTitle>Departures</CardTitle>
					<CardDescription>
						Scheduled dates, seats and pricing for this tour.
					</CardDescription>
				</div>
				{addButton}
			</CardHeader>

			<CardContent className="space-y-4">
				{/* Filter */}
				<div className="inline-flex border p-0.5">
					{FILTERS.map((f) => (
						<Button
							key={f.value}
							type="button"
							variant={filter === f.value ? "default" : "ghost"}
							onClick={() => setFilter(f.value)}
						>
							{f.label}
						</Button>
					))}
				</div>

				{isPending ? (
					<div className="space-y-2" aria-busy="true">
						{[0, 1, 2].map((i) => (
							<div key={i} className="h-14 animate-pulse rounded-md bg-muted" />
						))}
					</div>
				) : isError ? (
					<div className="flex flex-col items-center gap-3 rounded-lg border border-dashed px-5 py-8 text-center">
						<p className="text-sm text-muted-foreground">
							Couldn't load departures.
						</p>
						<Button variant="outline" size="sm" onClick={() => refetch()}>
							<RefreshCw className="mr-2 size-4" />
							Try again
						</Button>
					</div>
				) : visible.length === 0 ? (
					<div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-5 py-10 text-center">
						<CalendarDays className="size-8 text-muted-foreground" />
						<h3 className="mt-3 text-sm font-semibold">
							{all.length === 0
								? "No departures yet"
								: `No ${filter} departures`}
						</h3>
						<p className="mt-1 max-w-sm text-sm text-muted-foreground">
							{all.length === 0
								? "Customers can't book this tour until you schedule at least one departure."
								: "Try a different filter to see the others."}
						</p>
						{all.length === 0 && <div className="mt-4">{addButton}</div>}
					</div>
				) : (
					<div className="overflow-x-auto rounded-lg border">
						<table className="w-full min-w-[720px] text-left text-sm">
							<thead className="bg-muted/50 text-xs text-muted-foreground">
								<tr>
									<th className="px-4 py-2.5 font-medium">Departure</th>
									<th className="px-4 py-2.5 font-medium">Dates</th>
									<th className="px-4 py-2.5 font-medium">Seats</th>
									<th className="px-4 py-2.5 font-medium">From</th>
									<th className="px-4 py-2.5 font-medium">Status</th>
									<th className="px-4 py-2.5" />
								</tr>
							</thead>
							<tbody className="divide-y">
								{visible.map((d) => (
									<tr key={d.id} className={d.isActive ? "" : "opacity-60"}>
										<td className="px-4 py-3">
											<div className="flex items-center gap-1.5">
												<span className="font-mono text-xs font-medium">
													{d.code}
												</span>
												{d.isGuaranteed && (
													<ShieldCheck
														className="size-3.5 text-emerald-600"
														aria-label="Guaranteed departure"
													/>
												)}
											</div>
											{!d.isActive && (
												<span className="text-xs text-muted-foreground">
													Inactive
												</span>
											)}
										</td>
										<td className="whitespace-nowrap px-4 py-3">
											<p className="font-medium">{formatDate(d.startDate)}</p>
											<p className="text-xs text-muted-foreground">
												to {formatDate(d.endDate)}
											</p>
										</td>
										<td className="px-4 py-3">
											<SeatsBar
												total={d.totalSeats}
												available={d.availableSeats}
											/>
										</td>
										<td className="whitespace-nowrap px-4 py-3">
											{d.fromPrice !== null ? (
												<span className="font-medium">
													{formatPrice(d.fromPrice)}
												</span>
											) : (
												<span className="text-muted-foreground">—</span>
											)}
										</td>
										<td className="px-4 py-3">
											<Badge
												variant="outline"
												className={statusClass(d.status)}
											>
												{formatLabel(d.status)}
											</Badge>
										</td>
										<td className="px-4 py-3 text-right inline-flex gap-2 items-center w-fit">
											<Button variant="ghost" size="sm" asChild>
												<Link
													to="/tours/$tourId/departures/$departureId/edit"
													params={{ tourId, departureId: d.id }}
												>
													<Pencil className="mr-1.5 size-3.5" />
													Edit
												</Link>
											</Button>

											<AlertDialog open={deleteAlertDialogOpen}>
												<AlertDialogTrigger
													onClick={() => setDeleteAlertDialogOpen(true)}
												>
													<Button size={"icon"}>
														<Trash2 />
													</Button>
												</AlertDialogTrigger>
												<AlertDialogContent>
													<AlertDialogHeader>
														<AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
															<Trash2 />
														</AlertDialogMedia>
														<AlertDialogTitle>
															Are you absolutely sure?
														</AlertDialogTitle>
														<AlertDialogDescription>
															This action cannot be undone. This will
															permanently delete{" "}
															<span className="text-destructive font-bold">
																{d.code}
															</span>{" "}
															from data-base.
														</AlertDialogDescription>
													</AlertDialogHeader>
													<AlertDialogFooter>
														<AlertDialogCancel
															variant={"outline"}
															onClick={() => setDeleteAlertDialogOpen(false)}
														>
															Cancel
														</AlertDialogCancel>
														<AlertDialogAction
															variant={"destructive"}
															onClick={() => handleDeleteDeparture(d.id)}
														>
															{deleting ? (
																<LoaderCircle className="animate-spin" />
															) : (
																"Continue"
															)}
														</AlertDialogAction>
													</AlertDialogFooter>
												</AlertDialogContent>
											</AlertDialog>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
