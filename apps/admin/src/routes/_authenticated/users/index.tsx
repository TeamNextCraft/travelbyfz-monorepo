import { accountStatuses, userRoles } from "@repo/db/schema/auth.ts";
import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
	BadgeCheck,
	Briefcase,
	ChevronLeft,
	ChevronRight,
	Clock,
	Loader2,
	Mail,
	Phone,
	Search,
	ShieldOff,
	Users,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { formatDate } from "#/components/bookings/booking-ui";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select.tsx";
import {
	AccountStatusBadge,
	fullName,
	RoleBadge,
	UserAvatar,
} from "#/components/users/user-ui";
import {
	getUserStats,
	getUsers,
	updateUserStatus,
} from "#/server/actions/users";

const searchSchema = z.object({
	page: z.number().int().min(1).catch(1),
	q: z.string().optional().catch(undefined),
	role: z.string().optional().catch(undefined),
	status: z.string().optional().catch(undefined),
	access: z.enum(["active", "inactive"]).optional().catch(undefined),
});

export const Route = createFileRoute("/_authenticated/users/")({
	validateSearch: searchSchema,
	component: UsersPage,
});

function MetricCard({
	title,
	value,
	icon: Icon,
	loading,
}: {
	title: string;
	value: number;
	icon: typeof Users;
	loading: boolean;
}) {
	return (
		<Card className="gap-3 py-5">
			<CardContent className="space-y-2">
				<div className="flex items-center justify-between">
					<p className="text-sm font-medium text-muted-foreground">{title}</p>
					<div className="flex size-9 items-center justify-center rounded-lg bg-muted">
						<Icon className="size-4 text-muted-foreground" />
					</div>
				</div>
				{loading ? (
					<div className="h-8 w-16 animate-pulse rounded bg-muted" />
				) : (
					<p className="text-2xl font-semibold tracking-tight">
						{value.toLocaleString("en-IN")}
					</p>
				)}
			</CardContent>
		</Card>
	);
}

function FilterSelect({
	label,
	value,
	options,
	onChange,
}: {
	label: string;
	value?: string;
	options: readonly string[];
	onChange: (value: string | undefined) => void;
}) {
	return (
		<Select
			value={value ?? "all"}
			onValueChange={(v) => onChange(v === "all" ? undefined : v)}
		>
			<SelectTrigger className="w-full sm:w-[150px]" aria-label={label}>
				<SelectValue placeholder={label} />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="all">All {label.toLowerCase()}</SelectItem>
				{options.map((o) => (
					<SelectItem key={o} value={o}>
						{o.charAt(0).toUpperCase() + o.slice(1)}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

function UsersPage() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();
	const queryClient = useQueryClient();

	const fetchUsers = useServerFn(getUsers);
	const fetchStats = useServerFn(getUserStats);
	const changeStatus = useServerFn(updateUserStatus);

	const update = (patch: Partial<z.infer<typeof searchSchema>>) =>
		navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true });

	const [searchText, setSearchText] = useState(search.q ?? "");
	useEffect(() => {
		const timer = setTimeout(() => {
			const next = searchText.trim() || undefined;
			if (next !== search.q) update({ q: next, page: 1 });
		}, 300);
		return () => clearTimeout(timer);
		// biome-ignore lint/correctness/useExhaustiveDependencies: only react to typing
	}, [searchText]);

	const { data, isPending, isError, isFetching, refetch } = useQuery({
		queryKey: ["users", search],
		queryFn: () => fetchUsers({ data: search }),
		placeholderData: keepPreviousData,
	});

	const stats = useQuery({
		queryKey: ["users-stats"],
		queryFn: () => fetchStats(),
	});

	const approve = useMutation({
		mutationFn: (id: string) =>
			changeStatus({ data: { id, status: "approved" } }),
		onSuccess: () => {
			toast.success("Account approved");
			queryClient.invalidateQueries({ queryKey: ["users"] });
			queryClient.invalidateQueries({ queryKey: ["users-stats"] });
			queryClient.invalidateQueries({ queryKey: ["user"] });
		},
		onError: () => toast.error("Couldn't approve this account"),
	});

	const hasFilters = Boolean(
		search.q || search.role || search.status || search.access,
	);

	const rows = data?.rows ?? [];
	const total = data?.total ?? 0;
	const pageSize = data?.pageSize ?? 20;
	const totalPages = Math.max(1, Math.ceil(total / pageSize));
	const from = total === 0 ? 0 : (search.page - 1) * pageSize + 1;
	const to = Math.min(total, search.page * pageSize);

	return (
		<main className="min-w-0 space-y-6 p-4 md:p-6 lg:p-8">
			<section>
				<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
					Users
				</h1>
				<p className="mt-1 text-sm text-muted-foreground">
					Manage customers, agents and admins, and approve new accounts.
				</p>
			</section>

			<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<MetricCard
					title="Total users"
					value={stats.data?.total ?? 0}
					icon={Users}
					loading={stats.isPending}
				/>
				<MetricCard
					title="Pending approval"
					value={stats.data?.pending ?? 0}
					icon={Clock}
					loading={stats.isPending}
				/>
				<MetricCard
					title="Agents"
					value={stats.data?.agents ?? 0}
					icon={Briefcase}
					loading={stats.isPending}
				/>
				<MetricCard
					title="Suspended"
					value={stats.data?.suspended ?? 0}
					icon={ShieldOff}
					loading={stats.isPending}
				/>
			</section>

			{/* Filters */}
			<section className="flex flex-col gap-3 lg:flex-row lg:items-center">
				<div className="relative flex-1">
					<Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						placeholder="Search by name, email or phone"
						className="pl-9"
					/>
				</div>
				<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
					<FilterSelect
						label="Roles"
						value={search.role}
						options={userRoles}
						onChange={(role) => update({ role, page: 1 })}
					/>
					<FilterSelect
						label="Status"
						value={search.status}
						options={accountStatuses}
						onChange={(status) => update({ status, page: 1 })}
					/>
					<FilterSelect
						label="Access"
						value={search.access}
						options={["active", "inactive"]}
						onChange={(access) =>
							update({
								access: access as "active" | "inactive" | undefined,
								page: 1,
							})
						}
					/>
					{hasFilters && (
						<Button
							variant="ghost"
							onClick={() => {
								setSearchText("");
								navigate({ search: { page: 1 }, replace: true });
							}}
						>
							<X className="mr-2 size-4" />
							Clear
						</Button>
					)}
				</div>
			</section>

			<Card className="py-0">
				<CardContent className="p-0">
					{isPending ? (
						<div className="space-y-2 p-4" aria-busy="true">
							{[0, 1, 2, 3, 4].map((i) => (
								<div
									key={i}
									className="h-14 animate-pulse rounded-md bg-muted"
								/>
							))}
						</div>
					) : isError ? (
						<div className="flex flex-col items-center gap-3 px-5 py-14 text-center">
							<p className="text-sm text-muted-foreground">
								Couldn't load users.
							</p>
							<Button variant="outline" size="sm" onClick={() => refetch()}>
								Try again
							</Button>
						</div>
					) : rows.length === 0 ? (
						<div className="flex flex-col items-center px-5 py-14 text-center">
							<Users className="size-8 text-muted-foreground" />
							<h3 className="mt-3 text-sm font-semibold">
								{hasFilters ? "No users match these filters" : "No users yet"}
							</h3>
							<p className="mt-1 text-sm text-muted-foreground">
								{hasFilters
									? "Try removing a filter or searching for something else."
									: "Accounts will appear here as people sign up."}
							</p>
						</div>
					) : (
						<div
							className={`overflow-x-auto transition-opacity ${isFetching ? "opacity-60" : ""}`}
						>
							<table className="w-full min-w-[920px] text-left text-sm">
								<thead className="border-b bg-muted/50 text-xs text-muted-foreground">
									<tr>
										<th className="px-4 py-3 font-medium">User</th>
										<th className="px-4 py-3 font-medium">Phone</th>
										<th className="px-4 py-3 font-medium">Role</th>
										<th className="px-4 py-3 font-medium">Status</th>
										<th className="px-4 py-3 font-medium">Verified</th>
										<th className="px-4 py-3 font-medium">Last login</th>
										<th className="px-4 py-3 font-medium">Joined</th>
										<th className="px-4 py-3" />
									</tr>
								</thead>
								<tbody className="divide-y">
									{rows.map((u) => (
										<tr
											key={u.id}
											className={`hover:bg-muted/30 ${u.isActive ? "" : "opacity-60"}`}
										>
											<td className="px-4 py-3">
												<div className="flex items-center gap-3">
													<UserAvatar
														name={fullName(u)}
														image={u.image}
														size="sm"
													/>
													<div className="min-w-0">
														<Link
															to="/users/$userId"
															params={{ userId: u.id }}
															className="block truncate font-medium underline-offset-4 hover:underline"
														>
															{fullName(u)}
														</Link>
														<p className="truncate text-xs text-muted-foreground">
															{u.email}
														</p>
													</div>
												</div>
											</td>
											<td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
												{u.phone ?? "—"}
											</td>
											<td className="px-4 py-3">
												<RoleBadge role={u.role} />
											</td>
											<td className="px-4 py-3">
												<div className="flex flex-col items-start gap-1">
													<AccountStatusBadge status={u.status} />
													{!u.isActive && (
														<span className="text-xs text-muted-foreground">
															Deactivated
														</span>
													)}
												</div>
											</td>
											<td className="px-4 py-3">
												<div className="flex items-center gap-2">
													<Mail
														className={`size-4 ${u.emailVerified ? "text-emerald-600" : "text-muted-foreground/40"}`}
														aria-label={
															u.emailVerified
																? "Email verified"
																: "Email not verified"
														}
													/>
													<Phone
														className={`size-4 ${u.phoneVerified ? "text-emerald-600" : "text-muted-foreground/40"}`}
														aria-label={
															u.phoneVerified
																? "Phone verified"
																: "Phone not verified"
														}
													/>
												</div>
											</td>
											<td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
												{u.lastLoginAt ? formatDate(u.lastLoginAt) : "Never"}
											</td>
											<td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
												{formatDate(u.createdAt)}
											</td>
											<td className="px-4 py-3 text-right">
												{u.status === "pending" && (
													<Button
														size="sm"
														variant="outline"
														disabled={approve.isPending}
														onClick={() => approve.mutate(u.id)}
													>
														{approve.isPending && approve.variables === u.id ? (
															<Loader2 className="mr-1.5 size-3.5 animate-spin" />
														) : (
															<BadgeCheck className="mr-1.5 size-3.5" />
														)}
														Approve
													</Button>
												)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</CardContent>
			</Card>

			{total > 0 && (
				<section className="flex items-center justify-between gap-3">
					<p className="text-sm text-muted-foreground">
						Showing {from}–{to} of {total.toLocaleString("en-IN")}
					</p>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							disabled={search.page <= 1}
							onClick={() => update({ page: search.page - 1 })}
						>
							<ChevronLeft className="mr-1 size-4" />
							Previous
						</Button>
						<span className="text-sm text-muted-foreground">
							Page {search.page} of {totalPages}
						</span>
						<Button
							variant="outline"
							size="sm"
							disabled={search.page >= totalPages}
							onClick={() => update({ page: search.page + 1 })}
						>
							Next
							<ChevronRight className="ml-1 size-4" />
						</Button>
					</div>
				</section>
			)}
		</main>
	);
}
