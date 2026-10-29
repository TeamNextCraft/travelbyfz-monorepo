import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
	AlertCircle,
	ArrowDownWideNarrow,
	BriefcaseBusiness,
	CalendarClock,
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	CircleDot,
	ClipboardList,
	FilterX,
	Mail,
	MapPin,
	MessageSquareText,
	MoreHorizontal,
	Phone,
	RefreshCw,
	Search,
	Send,
	UserRound,
	Users,
} from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "#/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { Input } from "#/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import { Skeleton } from "#/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";
import { Textarea } from "#/components/ui/textarea";
import {
	type EnquiryStatus,
	getDashboardEnquiries,
	getEnquiryAssignees,
	getEnquiryStats,
	updateEnquiryAssignment,
	updateEnquiryNotes,
	updateEnquiryStatus,
} from "#/server/actions/enquiries";

export const Route = createFileRoute("/_authenticated/enquiries/")({
	component: EnquiriesIndexPage,
});

const PAGE_SIZE = 20;
type StatusFilter = "all" | EnquiryStatus;
type AssignmentFilter = "all" | "assigned" | "unassigned";
type GroupSizeFilter = "all" | "1-2" | "3-5" | "6+";
type SortFilter = "newest" | "oldest" | "budget-high" | "budget-low";

type EnquiryRow = {
	id: string;
	userId: string | null;
	tourId: string | null;
	departureId: string | null;
	name: string;
	email: string;
	phone: string | null;
	city: string | null;
	subject: string | null;
	message: string;
	travelMonth: string | null;
	groupSize: number | null;
	budgetMin: number | null;
	budgetMax: number | null;
	status: EnquiryStatus;
	assignedTo: string | null;
	source: string;
	notes: string | null;
	createdAt: Date;
	updatedAt: Date;
	tourTitle: string | null;
	tourSlug: string | null;
	accountName: string | null;
	accountEmail: string | null;
	assignedName: string | null;
	assignedEmail: string | null;
};

type Assignee = { id: string; name: string; email: string; role: string };

const statuses: EnquiryStatus[] = [
	"new",
	"contacted",
	"qualified",
	"converted",
	"closed",
	"spam",
];

function formatDate(value: Date | string | null | undefined) {
	if (!value) return "—";
	const date = value instanceof Date ? value : new Date(value);
	if (Number.isNaN(date.getTime())) return "—";
	return new Intl.DateTimeFormat("en-IN", {
		day: "2-digit",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(date);
}

function formatMoney(value: number | null | undefined) {
	if (value == null || !Number.isFinite(value)) return null;
	return new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		maximumFractionDigits: 0,
	}).format(value);
}

function formatLabel(value: string | null | undefined) {
	if (!value) return "—";
	return value
		.replace(/[_-]+/g, " ")
		.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function StatusBadge({ status }: { status: EnquiryStatus }) {
	switch (status) {
		case "new":
			return (
				<Badge
					variant="outline"
					className="gap-1 border-sky-500/30 bg-sky-500/5 text-sky-700 dark:text-sky-300"
				>
					<CircleDot className="size-3" /> New
				</Badge>
			);
		case "contacted":
			return (
				<Badge
					variant="outline"
					className="gap-1 border-blue-500/30 bg-blue-500/5 text-blue-700 dark:text-blue-300"
				>
					<Send className="size-3" /> Contacted
				</Badge>
			);
		case "qualified":
			return (
				<Badge
					variant="outline"
					className="gap-1 border-violet-500/30 bg-violet-500/5 text-violet-700 dark:text-violet-300"
				>
					<CheckCircle2 className="size-3" /> Qualified
				</Badge>
			);
		case "converted":
			return (
				<Badge className="gap-1 border-emerald-500/20 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-300">
					<CheckCircle2 className="size-3" /> Converted
				</Badge>
			);
		case "closed":
			return <Badge variant="secondary">Closed</Badge>;
		case "spam":
			return <Badge variant="destructive">Spam</Badge>;
	}
}

function BudgetRange({ min, max }: { min: number | null; max: number | null }) {
	if (min == null && max == null) {
		return <span className="text-muted-foreground">Not provided</span>;
	}
	if (min != null && max != null) {
		return (
			<span>
				{formatMoney(min)} – {formatMoney(max)}
			</span>
		);
	}
	if (min != null) return <span>From {formatMoney(min)}</span>;
	return <span>Up to {formatMoney(max)}</span>;
}

export function EnquiriesIndexPage() {
	const queryClient = useQueryClient();
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
	const [sourceFilter, setSourceFilter] = useState("all");
	const [assignmentFilter, setAssignmentFilter] =
		useState<AssignmentFilter>("all");
	const [groupSizeFilter, setGroupSizeFilter] =
		useState<GroupSizeFilter>("all");
	const [sortBy, setSortBy] = useState<SortFilter>("newest");
	const [page, setPage] = useState(1);
	const [busyEnquiryId, setBusyEnquiryId] = useState<string | null>(null);
	const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryRow | null>(
		null,
	);
	const [notesDraft, setNotesDraft] = useState("");
	const [savingNotes, setSavingNotes] = useState(false);

	const fetchEnquiries = useServerFn(getDashboardEnquiries);
	const fetchStats = useServerFn(getEnquiryStats);
	const fetchAssignees = useServerFn(getEnquiryAssignees);
	const changeStatus = useServerFn(updateEnquiryStatus);
	const changeAssignment = useServerFn(updateEnquiryAssignment);
	const changeNotes = useServerFn(updateEnquiryNotes);

	const queryData = useMemo(
		() => ({
			page,
			pageSize: PAGE_SIZE,
			q: search.trim() || undefined,
			status: statusFilter === "all" ? undefined : statusFilter,
			source: sourceFilter === "all" ? undefined : sourceFilter,
			assignment: assignmentFilter,
			groupSize: groupSizeFilter,
			sortBy,
		}),
		[
			page,
			search,
			statusFilter,
			sourceFilter,
			assignmentFilter,
			groupSizeFilter,
			sortBy,
		],
	);

	const { data, isPending, isError, error, isFetching, refetch } = useQuery({
		queryKey: ["dashboard-enquiries", queryData],
		queryFn: () => fetchEnquiries({ data: queryData }),
		placeholderData: (previousData) => previousData,
	});

	const statsQuery = useQuery({
		queryKey: ["dashboard-enquiry-stats"],
		queryFn: () => fetchStats(),
	});

	const assigneesQuery = useQuery({
		queryKey: ["dashboard-enquiry-assignees"],
		queryFn: () => fetchAssignees(),
		staleTime: 60_000,
	});

	const rows = (data?.rows ?? []) as EnquiryRow[];
	const total = data?.total ?? 0;
	const stats = statsQuery.data;
	const assignees = (assigneesQuery.data ?? []) as Assignee[];
	const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
	const showInitialLoading = isPending && !data;
	const showInitialError = isError && !data;
	const hasFilters = Boolean(
		search.trim() ||
			statusFilter !== "all" ||
			sourceFilter !== "all" ||
			assignmentFilter !== "all" ||
			groupSizeFilter !== "all" ||
			sortBy !== "newest",
	);

	const clearFilters = () => {
		setSearch("");
		setStatusFilter("all");
		setSourceFilter("all");
		setAssignmentFilter("all");
		setGroupSizeFilter("all");
		setSortBy("newest");
		setPage(1);
	};

	const invalidateEnquiries = async () => {
		await Promise.all([
			queryClient.invalidateQueries({ queryKey: ["dashboard-enquiries"] }),
			queryClient.invalidateQueries({ queryKey: ["dashboard-enquiry-stats"] }),
		]);
	};

	const handleStatusChange = async (
		enquiryId: string,
		status: EnquiryStatus,
	) => {
		setBusyEnquiryId(enquiryId);
		try {
			await changeStatus({ data: { enquiryId, status } });
			toast.success(`Enquiry marked ${formatLabel(status).toLowerCase()}.`);
			await invalidateEnquiries();
			setSelectedEnquiry((current) =>
				current?.id === enquiryId ? { ...current, status } : current,
			);
		} catch (cause) {
			console.error("Unable to update enquiry status", cause);
			toast.error(
				cause instanceof Error
					? cause.message
					: "Unable to update enquiry status.",
			);
		} finally {
			setBusyEnquiryId(null);
		}
	};

	const handleAssignmentChange = async (
		enquiryId: string,
		assignedTo: string | null,
	) => {
		setBusyEnquiryId(enquiryId);
		try {
			await changeAssignment({ data: { enquiryId, assignedTo } });
			const assignee = assignees.find((item) => item.id === assignedTo);
			toast.success(
				assignedTo
					? `Assigned to ${assignee?.name ?? "team member"}.`
					: "Enquiry unassigned.",
			);
			await invalidateEnquiries();
		} catch (cause) {
			console.error("Unable to assign enquiry", cause);
			toast.error(
				cause instanceof Error ? cause.message : "Unable to update assignment.",
			);
		} finally {
			setBusyEnquiryId(null);
		}
	};

	const openDetails = (enquiry: EnquiryRow) => {
		setSelectedEnquiry(enquiry);
		setNotesDraft(enquiry.notes ?? "");
	};

	const handleSaveNotes = async () => {
		if (!selectedEnquiry) return;
		setSavingNotes(true);
		try {
			const notes = notesDraft.trim() || null;
			await changeNotes({ data: { enquiryId: selectedEnquiry.id, notes } });
			toast.success("Internal notes saved.");
			setSelectedEnquiry({ ...selectedEnquiry, notes });
			await invalidateEnquiries();
		} catch (cause) {
			console.error("Unable to save enquiry notes", cause);
			toast.error(
				cause instanceof Error ? cause.message : "Unable to save notes.",
			);
		} finally {
			setSavingNotes(false);
		}
	};

	const setFilter = <T,>(setter: (value: T) => void, value: T) => {
		setter(value);
		setPage(1);
	};

	return (
		<main className="min-w-0 space-y-6 p-4 md:p-6 lg:p-8">
			<section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<div className="space-y-1">
					<div className="flex flex-wrap items-center gap-2">
						<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
							Enquiries
						</h1>
						<Badge variant="secondary" className="font-normal">
							Sales inbox
						</Badge>
					</div>
					<p className="text-sm text-muted-foreground">
						Track customer interest, manage follow-ups, and move enquiries
						through your sales pipeline.
					</p>
				</div>
				<Button
					variant="outline"
					onClick={() => refetch()}
					disabled={isFetching}
					className="w-full sm:w-auto"
				>
					<RefreshCw
						className={`mr-2 size-4 ${isFetching ? "animate-spin" : ""}`}
					/>
					Refresh enquiries
				</Button>
			</section>

			{isError && data && (
				<div
					role="alert"
					className="flex flex-col gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between"
				>
					<div className="flex items-start gap-3">
						<AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
						<div>
							<p className="font-medium">Unable to refresh enquiries</p>
							<p className="text-sm text-muted-foreground">
								Previously loaded results remain visible.
							</p>
						</div>
					</div>
					<Button
						variant="outline"
						size="sm"
						onClick={() => refetch()}
						disabled={isFetching}
					>
						<RefreshCw
							className={`mr-2 size-4 ${isFetching ? "animate-spin" : ""}`}
						/>{" "}
						Retry
					</Button>
				</div>
			)}

			<section
				aria-label="Enquiry statistics"
				className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"
			>
				<StatCard
					title="Total enquiries"
					value={stats?.total}
					description="All received enquiries"
					icon={<ClipboardList className="size-5 text-primary" />}
					loading={statsQuery.isPending}
				/>
				<StatCard
					title="New"
					value={stats?.new}
					description="Awaiting first contact"
					icon={<CircleDot className="size-5 text-sky-600" />}
					loading={statsQuery.isPending}
				/>
				<StatCard
					title="Contacted"
					value={stats?.contacted}
					description="Follow-up started"
					icon={<Send className="size-5 text-blue-600" />}
					loading={statsQuery.isPending}
				/>
				<StatCard
					title="Qualified"
					value={stats?.qualified}
					description="Potential customers"
					icon={<BriefcaseBusiness className="size-5 text-violet-600" />}
					loading={statsQuery.isPending}
				/>
				<StatCard
					title="Unassigned"
					value={stats?.unassigned}
					description="Need an owner"
					icon={<Users className="size-5 text-amber-600" />}
					loading={statsQuery.isPending}
				/>
			</section>

			<Card>
				<CardHeader className="gap-4">
					<div>
						<CardTitle>Enquiry inbox</CardTitle>
						<CardDescription className="mt-1">
							Search leads, review trip requirements, and manage ownership and
							status.
						</CardDescription>
					</div>

					<div className="relative sm:col-span-2 xl:col-span-2">
						<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search name, email, phone, tour..."
							value={search}
							onChange={(event) => {
								setSearch(event.target.value);
								setPage(1);
							}}
							className="pl-9"
							aria-label="Search enquiries"
						/>
					</div>
					<div className="flex gap-3 w-full">
						<Select
							value={statusFilter}
							onValueChange={(value) =>
								setFilter(setStatusFilter, value as StatusFilter)
							}
						>
							<SelectTrigger aria-label="Filter by enquiry status">
								<SelectValue placeholder="All statuses" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All statuses</SelectItem>
								{statuses.map((status) => (
									<SelectItem key={status} value={status}>
										{formatLabel(status)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Select
							value={sourceFilter}
							onValueChange={(value) => setFilter(setSourceFilter, value)}
						>
							<SelectTrigger aria-label="Filter by source">
								<SelectValue placeholder="All sources" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All sources</SelectItem>
								{(stats?.sources ?? []).map((source) => (
									<SelectItem key={source} value={source}>
										{formatLabel(source)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Select
							value={assignmentFilter}
							onValueChange={(value) =>
								setFilter(setAssignmentFilter, value as AssignmentFilter)
							}
						>
							<SelectTrigger aria-label="Filter by assignment">
								<SelectValue placeholder="Assignment" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All assignments</SelectItem>
								<SelectItem value="assigned">Assigned</SelectItem>
								<SelectItem value="unassigned">Unassigned</SelectItem>
							</SelectContent>
						</Select>

						<Select
							value={groupSizeFilter}
							onValueChange={(value) =>
								setFilter(setGroupSizeFilter, value as GroupSizeFilter)
							}
						>
							<SelectTrigger aria-label="Filter by group size">
								<SelectValue placeholder="Group size" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Any group size</SelectItem>
								<SelectItem value="1-2">1–2 travellers</SelectItem>
								<SelectItem value="3-5">3–5 travellers</SelectItem>
								<SelectItem value="6+">6+ travellers</SelectItem>
							</SelectContent>
						</Select>

						<Select
							value={sortBy}
							onValueChange={(value) =>
								setFilter(setSortBy, value as SortFilter)
							}
						>
							<SelectTrigger aria-label="Sort enquiries">
								<SelectValue placeholder="Sort by" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="newest">
									<ArrowDownWideNarrow className="mr-2 inline size-4" />
									Newest first
								</SelectItem>
								<SelectItem value="oldest">
									<CalendarClock className="mr-2 inline size-4" />
									Oldest first
								</SelectItem>
								<SelectItem value="budget-high">Highest budget</SelectItem>
								<SelectItem value="budget-low">Lowest budget</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<p className="text-sm text-muted-foreground" aria-live="polite">
							{showInitialLoading
								? "Loading enquiries…"
								: showInitialError
									? "Unable to load enquiries"
									: `${total.toLocaleString("en-IN")} ${total === 1 ? "enquiry" : "enquiries"} found`}
							{isFetching && data ? " · Updating…" : ""}
						</p>
						{hasFilters && (
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={clearFilters}
							>
								<FilterX className="mr-2 size-4" /> Clear filters
							</Button>
						)}
					</div>
				</CardHeader>

				<CardContent>
					{showInitialError ? (
						<div
							role="alert"
							className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed px-4 py-12 text-center"
						>
							<div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
								<AlertCircle className="size-6 text-destructive" />
							</div>
							<div className="space-y-1">
								<h3 className="font-semibold">Unable to load enquiries</h3>
								<p className="max-w-md text-sm text-muted-foreground">
									{error instanceof Error
										? error.message
										: "Something went wrong while fetching enquiries."}
								</p>
							</div>
							<Button
								variant="outline"
								onClick={() => refetch()}
								disabled={isFetching}
							>
								<RefreshCw
									className={`mr-2 size-4 ${isFetching ? "animate-spin" : ""}`}
								/>{" "}
								Try again
							</Button>
						</div>
					) : (
						<div className="overflow-x-auto border">
							<Table className="min-w-[1080px]">
								<TableHeader>
									<TableRow>
										<TableHead className="w-[250px]">Contact</TableHead>
										<TableHead className="w-[200px]">
											Tour & requirements
										</TableHead>
										<TableHead>Status</TableHead>
										<TableHead className="w-[190px]">Assigned to</TableHead>
										<TableHead>Source / received</TableHead>
										<TableHead className="w-[70px]">
											<span className="sr-only">Actions</span>
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{showInitialLoading ? (
										Array.from({ length: 6 }).map((_, index) => (
											<TableRow key={`enquiry-skeleton-${index}`}>
												<TableCell>
													<div className="space-y-2">
														<Skeleton className="h-4 w-32" />
														<Skeleton className="h-3 w-40" />
														<Skeleton className="h-3 w-24" />
													</div>
												</TableCell>
												<TableCell>
													<div className="space-y-2">
														<Skeleton className="h-4 w-36" />
														<Skeleton className="h-3 w-28" />
													</div>
												</TableCell>
												<TableCell>
													<Skeleton className="h-6 w-20 rounded-full" />
												</TableCell>
												<TableCell>
													<Skeleton className="h-8 w-36" />
												</TableCell>
												<TableCell>
													<div className="space-y-2">
														<Skeleton className="h-4 w-20" />
														<Skeleton className="h-3 w-28" />
													</div>
												</TableCell>
												<TableCell>
													<Skeleton className="size-8" />
												</TableCell>
											</TableRow>
										))
									) : rows.length === 0 ? (
										<TableRow>
											<TableCell colSpan={6} className="h-64">
												<div className="flex flex-col items-center justify-center gap-3 text-center">
													<div className="flex size-12 items-center justify-center rounded-full bg-muted">
														<MessageSquareText className="size-5 text-muted-foreground" />
													</div>
													<div className="space-y-1">
														<h3 className="font-medium">
															{hasFilters
																? "No matching enquiries"
																: "No enquiries yet"}
														</h3>
														<p className="max-w-md text-sm text-muted-foreground">
															{hasFilters
																? "Try adjusting your search or filters."
																: "Customer enquiries will appear here when someone asks about a tour."}
														</p>
													</div>
													{hasFilters && (
														<Button
															variant="outline"
															size="sm"
															onClick={clearFilters}
														>
															Clear filters
														</Button>
													)}
												</div>
											</TableCell>
										</TableRow>
									) : (
										rows.map((enquiry) => (
											<TableRow key={enquiry.id}>
												<TableCell>
													<button
														type="button"
														onClick={() => openDetails(enquiry)}
														className="block max-w-full text-left"
													>
														<span className="block truncate font-medium hover:underline">
															{enquiry.name}
														</span>
														{enquiry.subject && (
															<span className="block max-w-[220px] truncate text-xs text-muted-foreground">
																{enquiry.subject}
															</span>
														)}
													</button>
													<div className="mt-1 space-y-1 text-xs text-muted-foreground">
														<a
															href={`mailto:${enquiry.email}`}
															className="flex max-w-[230px] items-center gap-1.5 truncate hover:text-foreground"
														>
															<Mail className="size-3 shrink-0" />
															{enquiry.email}
														</a>
														{enquiry.phone && (
															<a
																href={`tel:${enquiry.phone}`}
																className="flex items-center gap-1.5 hover:text-foreground"
															>
																<Phone className="size-3 shrink-0" />
																{enquiry.phone}
															</a>
														)}
														{enquiry.city && (
															<span className="flex items-center gap-1.5">
																<MapPin className="size-3 shrink-0" />
																{enquiry.city}
															</span>
														)}
													</div>
												</TableCell>
												<TableCell>
													<p className="max-w-[200px] truncate font-medium">
														{enquiry.tourTitle ?? "General enquiry"}
													</p>
													<div className="mt-1 space-y-1 text-xs text-muted-foreground">
														<p>
															{enquiry.groupSize != null
																? `${enquiry.groupSize} traveller${enquiry.groupSize === 1 ? "" : "s"}`
																: "Group size not set"}
														</p>
														{enquiry.travelMonth && (
															<p>Travel: {enquiry.travelMonth}</p>
														)}
														{(enquiry.budgetMin != null ||
															enquiry.budgetMax != null) && (
															<p>
																<BudgetRange
																	min={enquiry.budgetMin}
																	max={enquiry.budgetMax}
																/>
															</p>
														)}
													</div>
												</TableCell>
												<TableCell>
													<StatusBadge status={enquiry.status} />
												</TableCell>
												<TableCell>
													<Select
														value={enquiry.assignedTo ?? "unassigned"}
														onValueChange={(value) =>
															void handleAssignmentChange(
																enquiry.id,
																value === "unassigned" ? null : value,
															)
														}
														disabled={
															busyEnquiryId === enquiry.id ||
															assigneesQuery.isPending
														}
													>
														<SelectTrigger
															className="h-8 w-[175px] text-xs"
															aria-label={`Assign ${enquiry.name}`}
														>
															<SelectValue placeholder="Assign owner" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="unassigned">
																Unassigned
															</SelectItem>
															{enquiry.assignedTo &&
																!assignees.some(
																	(assignee) =>
																		assignee.id === enquiry.assignedTo,
																) && (
																	<SelectItem
																		value={enquiry.assignedTo}
																		disabled
																	>
																		{enquiry.assignedName ??
																			"Unavailable assignee"}
																	</SelectItem>
																)}
															{assignees.map((assignee) => (
																<SelectItem
																	key={assignee.id}
																	value={assignee.id}
																>
																	{assignee.name}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
													{enquiry.assignedEmail && (
														<p className="mt-1 max-w-[175px] truncate text-xs text-muted-foreground">
															{enquiry.assignedEmail}
														</p>
													)}
												</TableCell>
												<TableCell>
													<Badge variant="secondary" className="font-normal">
														{formatLabel(enquiry.source)}
													</Badge>
													<p className="mt-1.5 text-xs text-muted-foreground">
														{formatDate(enquiry.createdAt)}
													</p>
												</TableCell>
												<TableCell>
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																variant="ghost"
																size="icon"
																className="size-8"
																aria-label={`Actions for enquiry from ${enquiry.name}`}
															>
																<MoreHorizontal className="size-4" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end" className="w-48">
															<DropdownMenuLabel>
																Enquiry actions
															</DropdownMenuLabel>
															<DropdownMenuSeparator />
															<DropdownMenuItem
																onSelect={() => openDetails(enquiry)}
															>
																<MessageSquareText className="mr-2 size-4" />{" "}
																View details
															</DropdownMenuItem>
															<DropdownMenuSeparator />
															<DropdownMenuLabel>
																Change status
															</DropdownMenuLabel>
															{statuses.map((status) => (
																<DropdownMenuItem
																	key={status}
																	disabled={
																		busyEnquiryId === enquiry.id ||
																		enquiry.status === status
																	}
																	onSelect={() =>
																		void handleStatusChange(enquiry.id, status)
																	}
																>
																	{enquiry.status === status ? (
																		<CheckCircle2 className="mr-2 size-4" />
																	) : (
																		<CircleDot className="mr-2 size-4" />
																	)}
																	{formatLabel(status)}
																</DropdownMenuItem>
															))}
														</DropdownMenuContent>
													</DropdownMenu>
												</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</div>
					)}

					{!showInitialError && (
						<div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<p className="text-sm text-muted-foreground">
								Page {page} of {totalPages}
							</p>
							<div className="flex items-center gap-2 self-end sm:self-auto">
								<Button
									variant="outline"
									size="sm"
									onClick={() => setPage((current) => Math.max(1, current - 1))}
									disabled={page <= 1 || isFetching}
								>
									<ChevronLeft className="mr-1 size-4" /> Previous
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										setPage((current) => Math.min(totalPages, current + 1))
									}
									disabled={page >= totalPages || isFetching}
								>
									Next <ChevronRight className="ml-1 size-4" />
								</Button>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			<Dialog
				open={Boolean(selectedEnquiry)}
				onOpenChange={(open) => {
					if (!open) setSelectedEnquiry(null);
				}}
			>
				<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
					{selectedEnquiry && (
						<>
							<DialogHeader>
								<div className="flex flex-wrap items-center gap-2">
									<DialogTitle>{selectedEnquiry.name}</DialogTitle>
									<StatusBadge status={selectedEnquiry.status} />
								</div>
								<DialogDescription>
									Received {formatDate(selectedEnquiry.createdAt)} · Source:{" "}
									{formatLabel(selectedEnquiry.source)}
								</DialogDescription>
							</DialogHeader>

							<div className="grid gap-5 sm:grid-cols-2">
								<div className="space-y-3 rounded-lg border p-4">
									<h3 className="text-sm font-semibold">Contact details</h3>
									<DetailLine
										icon={<Mail className="size-4" />}
										label="Email"
										value={selectedEnquiry.email}
										href={`mailto:${selectedEnquiry.email}`}
									/>
									<DetailLine
										icon={<Phone className="size-4" />}
										label="Phone"
										value={selectedEnquiry.phone ?? "Not provided"}
										href={
											selectedEnquiry.phone
												? `tel:${selectedEnquiry.phone}`
												: undefined
										}
									/>
									<DetailLine
										icon={<MapPin className="size-4" />}
										label="City"
										value={selectedEnquiry.city ?? "Not provided"}
									/>
									{selectedEnquiry.accountName && (
										<DetailLine
											icon={<UserRound className="size-4" />}
											label="Account"
											value={`${selectedEnquiry.accountName}${selectedEnquiry.accountEmail ? ` · ${selectedEnquiry.accountEmail}` : ""}`}
										/>
									)}
								</div>

								<div className="space-y-3 rounded-lg border p-4">
									<h3 className="text-sm font-semibold">Trip requirements</h3>
									<DetailLine
										icon={<BriefcaseBusiness className="size-4" />}
										label="Tour"
										value={selectedEnquiry.tourTitle ?? "General enquiry"}
									/>
									<DetailLine
										icon={<Users className="size-4" />}
										label="Group size"
										value={
											selectedEnquiry.groupSize != null
												? `${selectedEnquiry.groupSize} traveller(s)`
												: "Not provided"
										}
									/>
									<DetailLine
										icon={<CalendarClock className="size-4" />}
										label="Travel month"
										value={selectedEnquiry.travelMonth ?? "Not provided"}
									/>
									<div className="space-y-1">
										<p className="text-xs text-muted-foreground">
											Budget range
										</p>
										<p className="text-sm font-medium">
											<BudgetRange
												min={selectedEnquiry.budgetMin}
												max={selectedEnquiry.budgetMax}
											/>
										</p>
									</div>
								</div>
							</div>

							<div className="space-y-2">
								<h3 className="text-sm font-semibold">
									{selectedEnquiry.subject || "Message"}
								</h3>
								<div className="whitespace-pre-wrap rounded-lg border bg-muted/20 p-4 text-sm leading-6">
									{selectedEnquiry.message}
								</div>
							</div>

							<div className="space-y-2">
								<label
									htmlFor="enquiry-internal-notes"
									className="text-sm font-semibold"
								>
									Internal notes
								</label>
								<Textarea
									id="enquiry-internal-notes"
									value={notesDraft}
									onChange={(event) => setNotesDraft(event.target.value)}
									maxLength={5000}
									placeholder="Add follow-up notes for your team. These notes are not sent to the customer."
									rows={4}
								/>
								<p className="text-right text-xs text-muted-foreground">
									{notesDraft.length}/5000
								</p>
							</div>

							<DialogFooter className="gap-2 sm:justify-between">
								<div className="flex flex-wrap gap-2">
									<Select
										value={selectedEnquiry.status}
										onValueChange={(value) =>
											void handleStatusChange(
												selectedEnquiry.id,
												value as EnquiryStatus,
											)
										}
									>
										<SelectTrigger
											className="w-[155px]"
											aria-label="Update enquiry status"
										>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{statuses.map((status) => (
												<SelectItem key={status} value={status}>
													{formatLabel(status)}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<Button
										variant="outline"
										onClick={() => setSelectedEnquiry(null)}
									>
										Close
									</Button>
								</div>
								<Button
									onClick={() => void handleSaveNotes()}
									disabled={savingNotes || busyEnquiryId === selectedEnquiry.id}
								>
									{savingNotes ? (
										<RefreshCw className="mr-2 size-4 animate-spin" />
									) : null}
									Save notes
								</Button>
							</DialogFooter>
						</>
					)}
				</DialogContent>
			</Dialog>
		</main>
	);
}

function StatCard({
	title,
	value,
	description,
	icon,
	loading,
}: {
	title: string;
	value: number | undefined;
	description: string;
	icon: ReactNode;
	loading: boolean;
}) {
	return (
		<Card>
			<CardContent className="flex items-center justify-between gap-3 p-5">
				<div className="min-w-0 space-y-1">
					<p className="text-sm text-muted-foreground">{title}</p>
					{loading ? (
						<Skeleton className="h-8 w-16" />
					) : (
						<p className="text-2xl font-semibold tracking-tight tabular-nums">
							{value ?? 0}
						</p>
					)}
					<p className="text-xs text-muted-foreground">{description}</p>
				</div>
				<div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted">
					{icon}
				</div>
			</CardContent>
		</Card>
	);
}

function DetailLine({
	icon,
	label,
	value,
	href,
}: {
	icon: ReactNode;
	label: string;
	value: string;
	href?: string;
}) {
	return (
		<div className="flex items-start gap-2.5">
			<span className="mt-0.5 text-muted-foreground">{icon}</span>
			<div className="min-w-0 flex-1">
				<p className="text-xs text-muted-foreground">{label}</p>
				{href ? (
					<a
						href={href}
						className="break-words text-sm font-medium hover:underline"
					>
						{value}
					</a>
				) : (
					<p className="break-words text-sm font-medium">{value}</p>
				)}
			</div>
		</div>
	);
}
