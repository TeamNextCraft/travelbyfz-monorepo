import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
	AlertCircle,
	Banknote,
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	Clock3,
	Loader2,
	MoreHorizontal,
	RefreshCw,
	Search,
	XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "#/components/ui/alert";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "#/components/ui/alert-dialog";
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
import {
	getRefundStats,
	getRefunds,
	type RefundStatus,
	updateRefundStatus,
} from "#/server/actions/refunds";

const PAGE_SIZE = 20;
type StatusFilter = "all" | RefundStatus;
type PendingAction = {
	id: string;
	bookingRef: string;
	amount: number;
	status: Exclude<RefundStatus, "pending">;
};

export const Route = createFileRoute("/_authenticated/refunds/")({
	component: RefundsIndexPage,
});

function formatAmount(amount: number, currency = "INR") {
	return new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency,
		maximumFractionDigits: 2,
	}).format(amount);
}

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

function RefundStatusBadge({ status }: { status: string }) {
	if (status === "processed") {
		return (
			<Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-300">
				<CheckCircle2 className="mr-1 size-3" /> Processed
			</Badge>
		);
	}

	if (status === "failed") {
		return (
			<Badge variant="destructive">
				<XCircle className="mr-1 size-3" /> Failed
			</Badge>
		);
	}

	if (status === "pending") {
		return (
			<Badge
				variant="outline"
				className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300"
			>
				<Clock3 className="mr-1 size-3" /> Pending
			</Badge>
		);
	}

	return <Badge variant="secondary">{status}</Badge>;
}

export function RefundsIndexPage() {
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
	const [page, setPage] = useState(1);
	const [pendingAction, setPendingAction] = useState<PendingAction | null>(
		null,
	);

	const queryClient = useQueryClient();
	const fetchRefunds = useServerFn(getRefunds);
	const fetchRefundStats = useServerFn(getRefundStats);
	const changeRefundStatus = useServerFn(updateRefundStatus);

	const refundsQuery = useQuery({
		queryKey: [
			"refunds",
			{ page, search: search.trim(), status: statusFilter },
		],
		queryFn: () =>
			fetchRefunds({
				data: {
					page,
					q: search.trim() || undefined,
					status: statusFilter === "all" ? undefined : statusFilter,
				},
			}),
	});

	const statsQuery = useQuery({
		queryKey: ["refund-stats"],
		queryFn: () => fetchRefundStats(),
	});

	const statusMutation = useMutation({
		mutationFn: (input: {
			id: string;
			status: Exclude<RefundStatus, "pending">;
		}) => changeRefundStatus({ data: input }),
		onSuccess: async (_, variables) => {
			toast.success(
				variables.status === "processed"
					? "Refund status marked as processed"
					: "Refund marked as failed",
			);
			setPendingAction(null);
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ["refunds"] }),
				queryClient.invalidateQueries({ queryKey: ["refund-stats"] }),
			]);
		},
		onError: (error) => {
			toast.error(
				error instanceof Error
					? error.message
					: "Unable to update refund status",
			);
		},
	});

	const rows = refundsQuery.data?.rows ?? [];
	const total = refundsQuery.data?.total ?? 0;
	const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
	const stats = statsQuery.data;
	const initialLoading = refundsQuery.isPending && !refundsQuery.data;
	const initialError = refundsQuery.isError && !refundsQuery.data;
	const hasActiveFilters = search.trim().length > 0 || statusFilter !== "all";

	const paginationLabel = useMemo(() => {
		if (initialLoading) return "Loading refunds…";
		if (initialError) return "Unable to load refunds";
		if (total === 0) return "0 refunds";
		const from = (page - 1) * PAGE_SIZE + 1;
		const to = Math.min(page * PAGE_SIZE, total);
		return `Showing ${from}–${to} of ${total} refunds`;
	}, [initialError, initialLoading, page, total]);

	const clearFilters = () => {
		setSearch("");
		setStatusFilter("all");
		setPage(1);
	};

	return (
		<main className="min-w-0 space-y-6 p-4 md:p-6 lg:p-8">
			<section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<div className="space-y-1">
					<div className="flex flex-wrap items-center gap-2">
						<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
							Refunds
						</h1>
						<Badge variant="secondary" className="font-normal">
							Payments management
						</Badge>
					</div>
					<p className="text-sm text-muted-foreground">
						Review refund requests and keep their processing status up to date.
					</p>
				</div>
				<Button
					variant="outline"
					onClick={() => {
						void refundsQuery.refetch();
						void statsQuery.refetch();
					}}
					disabled={refundsQuery.isFetching || statsQuery.isFetching}
				>
					<RefreshCw
						className={`mr-2 size-4 ${refundsQuery.isFetching || statsQuery.isFetching ? "animate-spin" : ""}`}
					/>
					Refresh
				</Button>
			</section>

			{refundsQuery.isError && refundsQuery.data && (
				<Alert variant="destructive">
					<AlertCircle className="size-4" />
					<AlertTitle>Could not refresh refunds</AlertTitle>
					<AlertDescription>
						The previously loaded results are still displayed.
					</AlertDescription>
				</Alert>
			)}

			<section
				aria-label="Refund statistics"
				className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
			>
				<Card>
					<CardContent className="flex items-center justify-between p-5">
						<div className="space-y-1">
							<p className="text-sm text-muted-foreground">Total refunds</p>
							{statsQuery.isPending ? (
								<Skeleton className="h-8 w-16" />
							) : (
								<p className="text-2xl font-semibold tabular-nums">
									{stats?.total ?? 0}
								</p>
							)}
							<p className="text-xs text-muted-foreground">
								All recorded refund requests
							</p>
						</div>
						<div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
							<Banknote className="size-5 text-primary" />
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="flex items-center justify-between p-5">
						<div className="space-y-1">
							<p className="text-sm text-muted-foreground">Pending</p>
							{statsQuery.isPending ? (
								<Skeleton className="h-8 w-16" />
							) : (
								<p className="text-2xl font-semibold tabular-nums">
									{stats?.pendingCount ?? 0}
								</p>
							)}
							<p className="text-xs text-muted-foreground">
								{formatAmount(stats?.pendingAmount ?? 0)} awaiting resolution
							</p>
						</div>
						<div className="flex size-11 items-center justify-center rounded-xl bg-amber-500/10">
							<Clock3 className="size-5 text-amber-600" />
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="flex items-center justify-between p-5">
						<div className="space-y-1">
							<p className="text-sm text-muted-foreground">Processed</p>
							{statsQuery.isPending ? (
								<Skeleton className="h-8 w-16" />
							) : (
								<p className="text-2xl font-semibold tabular-nums">
									{stats?.processedCount ?? 0}
								</p>
							)}
							<p className="text-xs text-muted-foreground">
								{formatAmount(stats?.processedAmount ?? 0)} recorded as
								processed
							</p>
						</div>
						<div className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/10">
							<CheckCircle2 className="size-5 text-emerald-600" />
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="flex items-center justify-between p-5">
						<div className="space-y-1">
							<p className="text-sm text-muted-foreground">Failed</p>
							{statsQuery.isPending ? (
								<Skeleton className="h-8 w-16" />
							) : (
								<p className="text-2xl font-semibold tabular-nums">
									{stats?.failedCount ?? 0}
								</p>
							)}
							<p className="text-xs text-muted-foreground">
								Refunds requiring follow-up
							</p>
						</div>
						<div className="flex size-11 items-center justify-center rounded-xl bg-destructive/10">
							<XCircle className="size-5 text-destructive" />
						</div>
					</CardContent>
				</Card>
			</section>

			<Card>
				<CardHeader className="gap-4">
					<div>
						<CardTitle>Refund records</CardTitle>
						<CardDescription className="mt-1">
							Search by booking, customer, refund reference, or reason.
						</CardDescription>
					</div>
					<div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
						<div className="relative w-full lg:max-w-sm">
							<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								value={search}
								onChange={(event) => {
									setSearch(event.target.value);
									setPage(1);
								}}
								placeholder="Search refunds…"
								aria-label="Search refunds"
								className="pl-9"
							/>
						</div>
						<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
							<Select
								value={statusFilter}
								onValueChange={(value) => {
									setStatusFilter(value as StatusFilter);
									setPage(1);
								}}
							>
								<SelectTrigger
									className="w-full sm:w-[180px]"
									aria-label="Filter refunds by status"
								>
									<SelectValue placeholder="Filter by status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All statuses</SelectItem>
									<SelectItem value="pending">Pending</SelectItem>
									<SelectItem value="processed">Processed</SelectItem>
									<SelectItem value="failed">Failed</SelectItem>
								</SelectContent>
							</Select>
							{hasActiveFilters && (
								<Button
									variant="ghost"
									onClick={clearFilters}
									className="w-full sm:w-auto"
								>
									Clear filters
								</Button>
							)}
						</div>
					</div>
				</CardHeader>

				<CardContent className="space-y-4">
					{initialError ? (
						<div
							role="alert"
							className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-4 py-12 text-center"
						>
							<AlertCircle className="size-8 text-destructive" />
							<div className="space-y-1">
								<h3 className="font-semibold">Unable to load refunds</h3>
								<p className="max-w-lg text-sm text-muted-foreground">
									{refundsQuery.error instanceof Error
										? refundsQuery.error.message
										: "Something went wrong while fetching refund records."}
								</p>
							</div>
							<Button
								variant="outline"
								onClick={() => void refundsQuery.refetch()}
								disabled={refundsQuery.isFetching}
							>
								<RefreshCw
									className={`mr-2 size-4 ${refundsQuery.isFetching ? "animate-spin" : ""}`}
								/>{" "}
								Try again
							</Button>
						</div>
					) : (
						<>
							<div className="overflow-x-auto border">
								<Table className="min-w-[1050px]">
									<TableHeader>
										<TableRow>
											<TableHead>Refund</TableHead>
											<TableHead>Booking / customer</TableHead>
											<TableHead>Payment</TableHead>
											<TableHead>Amount</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>Created</TableHead>
											<TableHead>Processed</TableHead>
											<TableHead className="w-[60px]">
												<span className="sr-only">Actions</span>
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{initialLoading ? (
											Array.from({ length: 5 }).map((_, index) => (
												<TableRow key={`refund-skeleton-${index}`}>
													{Array.from({ length: 8 }).map((__, cellIndex) => (
														<TableCell key={cellIndex}>
															<Skeleton className="h-4 w-24" />
														</TableCell>
													))}
												</TableRow>
											))
										) : rows.length === 0 ? (
											<TableRow>
												<TableCell colSpan={8} className="h-64">
													<div className="flex flex-col items-center justify-center gap-3 text-center">
														<div className="flex size-12 items-center justify-center rounded-full bg-muted">
															<Banknote className="size-5 text-muted-foreground" />
														</div>
														<div className="space-y-1">
															<h3 className="font-medium">
																{hasActiveFilters
																	? "No matching refunds"
																	: "No refunds yet"}
															</h3>
															<p className="text-sm text-muted-foreground">
																{hasActiveFilters
																	? "Try another search term or clear the selected filters."
																	: "Refund records will appear here when they are created."}
															</p>
														</div>
														{hasActiveFilters && (
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
											rows.map((refund) => (
												<TableRow key={refund.id}>
													<TableCell>
														<div className="max-w-[210px] space-y-1">
															<p className="font-medium" title={refund.id}>
																{refund.id.slice(0, 8)}…
															</p>
															<p
																className="truncate text-xs text-muted-foreground"
																title={refund.reason ?? undefined}
															>
																{refund.reason || "No reason provided"}
															</p>
															{refund.providerRefundId && (
																<p
																	className="truncate text-xs text-muted-foreground"
																	title={refund.providerRefundId}
																>
																	Provider: {refund.providerRefundId}
																</p>
															)}
														</div>
													</TableCell>
													<TableCell>
														<div className="space-y-1">
															<p className="font-medium">{refund.bookingRef}</p>
															<p className="text-sm text-muted-foreground">
																{refund.contactName}
															</p>
															<p className="max-w-[200px] truncate text-xs text-muted-foreground">
																{refund.contactEmail}
															</p>
															<p className="max-w-[220px] truncate text-xs">
																{refund.tourTitle}
															</p>
														</div>
													</TableCell>
													<TableCell>
														<div className="space-y-1">
															<p className="text-sm font-medium">
																{refund.paymentMethod ?? "Not specified"}
															</p>
															<p
																className="max-w-[160px] truncate text-xs text-muted-foreground"
																title={refund.paymentId ?? undefined}
															>
																{refund.paymentId
																	? `${refund.paymentId.slice(0, 8)}…`
																	: "No linked payment"}
															</p>
															{refund.provider && (
																<p className="text-xs text-muted-foreground">
																	{refund.provider}
																</p>
															)}
														</div>
													</TableCell>
													<TableCell className="font-semibold tabular-nums">
														{formatAmount(
															refund.amount,
															refund.currency ?? "INR",
														)}
													</TableCell>
													<TableCell>
														<RefundStatusBadge status={refund.status} />
													</TableCell>
													<TableCell className="whitespace-nowrap text-sm text-muted-foreground">
														{formatDate(refund.createdAt)}
													</TableCell>
													<TableCell className="whitespace-nowrap text-sm text-muted-foreground">
														{formatDate(refund.processedAt)}
													</TableCell>
													<TableCell>
														<DropdownMenu>
															<DropdownMenuTrigger asChild>
																<Button
																	variant="ghost"
																	size="icon"
																	className="size-8"
																	aria-label={`Actions for refund ${refund.id}`}
																>
																	<MoreHorizontal className="size-4" />
																</Button>
															</DropdownMenuTrigger>
															<DropdownMenuContent align="end" className="w-52">
																<DropdownMenuLabel>
																	Refund actions
																</DropdownMenuLabel>
																<DropdownMenuSeparator />
																{refund.status === "pending" ? (
																	<>
																		<DropdownMenuItem
																			onSelect={() =>
																				setPendingAction({
																					id: refund.id,
																					bookingRef: refund.bookingRef,
																					amount: refund.amount,
																					status: "processed",
																				})
																			}
																		>
																			<CheckCircle2 className="mr-2 size-4 text-emerald-600" />{" "}
																			Mark processed
																		</DropdownMenuItem>
																		<DropdownMenuItem
																			onSelect={() =>
																				setPendingAction({
																					id: refund.id,
																					bookingRef: refund.bookingRef,
																					amount: refund.amount,
																					status: "failed",
																				})
																			}
																		>
																			<XCircle className="mr-2 size-4 text-destructive" />{" "}
																			Mark failed
																		</DropdownMenuItem>
																	</>
																) : (
																	<DropdownMenuItem disabled>
																		This refund is already {refund.status}
																	</DropdownMenuItem>
																)}
															</DropdownMenuContent>
														</DropdownMenu>
													</TableCell>
												</TableRow>
											))
										)}
									</TableBody>
								</Table>
							</div>

							<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
								<p className="text-sm text-muted-foreground" aria-live="polite">
									{paginationLabel}
								</p>
								<div className="flex items-center gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() =>
											setPage((current) => Math.max(1, current - 1))
										}
										disabled={page <= 1 || refundsQuery.isFetching}
									>
										<ChevronLeft className="mr-1 size-4" /> Previous
									</Button>
									<span className="min-w-20 text-center text-sm text-muted-foreground">
										Page {page} of {totalPages}
									</span>
									<Button
										variant="outline"
										size="sm"
										onClick={() =>
											setPage((current) => Math.min(totalPages, current + 1))
										}
										disabled={page >= totalPages || refundsQuery.isFetching}
									>
										Next <ChevronRight className="ml-1 size-4" />
									</Button>
								</div>
							</div>
						</>
					)}
				</CardContent>
			</Card>

			<AlertDialog
				open={pendingAction !== null}
				onOpenChange={(open) => {
					if (!open && !statusMutation.isPending) setPendingAction(null);
				}}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{pendingAction?.status === "processed"
								? "Mark refund as processed?"
								: "Mark refund as failed?"}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{pendingAction ? (
								<>
									This updates the recorded status for booking{" "}
									<span className="font-medium text-foreground">
										{pendingAction.bookingRef}
									</span>{" "}
									({formatAmount(pendingAction.amount)}). It does not initiate
									or send a refund through the payment provider. Confirm only
									after the refund outcome has been verified.
								</>
							) : null}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={statusMutation.isPending}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							disabled={!pendingAction || statusMutation.isPending}
							variant={
								pendingAction?.status === "failed" ? "destructive" : "default"
							}
							onClick={(event) => {
								event.preventDefault();
								if (pendingAction)
									statusMutation.mutate({
										id: pendingAction.id,
										status: pendingAction.status,
									});
							}}
						>
							{statusMutation.isPending && (
								<Loader2 className="mr-2 size-4 animate-spin" />
							)}
							Confirm status
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</main>
	);
}
