import { userRoles } from "@repo/db/schema/auth.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
	AlertTriangle,
	ArrowLeft,
	BadgeCheck,
	Check,
	CircleSlash,
	Laptop,
	Loader2,
	LogOut,
	Mail,
	Phone,
	RefreshCw,
	ShieldOff,
	X,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { toast } from "sonner";
import {
	BookingStatusBadge,
	formatCurrency,
	formatDate,
	formatDateTime,
	formatLabel,
} from "#/components/bookings/booking-ui";
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select.tsx";
import { Separator } from "#/components/ui/separator";
import {
	AccountStatusBadge,
	describeUserAgent,
	fullName,
	RoleBadge,
	UserAvatar,
} from "#/components/users/user-ui";
import {
	getUserDetails,
	revokeUserSessions,
	setUserActive,
	updateUserRole,
	updateUserStatus,
} from "#/server/actions/users";

export const Route = createFileRoute("/_authenticated/users/$userId/")({
	component: UserDetailsPage,
});

/* ------------------------------------------------------------------ */
/* Small components                                                    */
/* ------------------------------------------------------------------ */

function DetailItem({ label, value }: { label: string; value?: ReactNode }) {
	return (
		<div className="min-w-0 space-y-1">
			<p className="text-xs text-muted-foreground">{label}</p>
			<div className="break-words text-sm font-medium">
				{value === null || value === undefined || value === "" ? "—" : value}
			</div>
		</div>
	);
}

function Verified({ ok, label }: { ok: boolean; label: string }) {
	return (
		<span
			className={`inline-flex items-center gap-1 text-sm font-medium ${ok ? "text-emerald-700" : "text-muted-foreground"}`}
		>
			{ok ? <Check className="size-3.5" /> : <X className="size-3.5" />}
			{label}
		</span>
	);
}

type PendingAction = "suspend" | "deactivate" | "revoke" | null;

const CONFIRM_COPY: Record<
	Exclude<PendingAction, null>,
	{ title: string; description: string; button: string }
> = {
	suspend: {
		title: "Suspend this account?",
		description:
			"The user is signed out of every device immediately and can't sign in until you reinstate the account.",
		button: "Suspend account",
	},
	deactivate: {
		title: "Deactivate this account?",
		description:
			"The account is disabled and the user is signed out everywhere. Their bookings and data are kept.",
		button: "Deactivate account",
	},
	revoke: {
		title: "Sign out of all devices?",
		description:
			"Every active session is ended. The user can sign in again with their usual method.",
		button: "Sign out everywhere",
	},
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

function UserDetailsPage() {
	const { userId } = Route.useParams();
	const queryClient = useQueryClient();

	const fetchUser = useServerFn(getUserDetails);
	const changeStatus = useServerFn(updateUserStatus);
	const changeActive = useServerFn(setUserActive);
	const changeRole = useServerFn(updateUserRole);
	const revokeSessions = useServerFn(revokeUserSessions);

	const [pending, setPending] = useState<PendingAction>(null);
	const [role, setRole] = useState<string | null>(null);

	const { data, isPending, isError, refetch } = useQuery({
		queryKey: ["user", userId],
		queryFn: () => fetchUser({ data: { id: userId } }),
	});

	const refresh = () => {
		queryClient.invalidateQueries({ queryKey: ["user", userId] });
		queryClient.invalidateQueries({ queryKey: ["users"] });
		queryClient.invalidateQueries({ queryKey: ["users-stats"] });
	};

	const onError = (error: unknown) =>
		toast.error(
			error instanceof Error ? error.message : "Something went wrong",
		);

	const statusMutation = useMutation({
		mutationFn: (status: "approved" | "suspended") =>
			changeStatus({ data: { id: userId, status } }),
		onSuccess: () => {
			toast.success("Account updated");
			setPending(null);
			refresh();
		},
		onError,
	});

	const activeMutation = useMutation({
		mutationFn: (isActive: boolean) =>
			changeActive({ data: { id: userId, isActive } }),
		onSuccess: () => {
			toast.success("Account updated");
			setPending(null);
			refresh();
		},
		onError,
	});

	const roleMutation = useMutation({
		mutationFn: (next: string) =>
			changeRole({ data: { id: userId, role: next as never } }),
		onSuccess: () => {
			toast.success("Role updated");
			setRole(null);
			refresh();
		},
		onError,
	});

	const revokeMutation = useMutation({
		mutationFn: () => revokeSessions({ data: { id: userId } }),
		onSuccess: () => {
			toast.success("Signed out of all devices");
			setPending(null);
			refresh();
		},
		onError,
	});

	if (isPending) {
		return (
			<main className="space-y-6 p-4 md:p-6 lg:p-8" aria-busy="true">
				<div className="h-16 w-80 animate-pulse rounded bg-muted" />
				<div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
					<div className="h-96 animate-pulse rounded-lg bg-muted" />
					<div className="h-72 animate-pulse rounded-lg bg-muted" />
				</div>
			</main>
		);
	}

	if (isError || !data) {
		return (
			<main className="p-4 md:p-6 lg:p-8">
				<Card className="mx-auto max-w-lg">
					<CardContent className="flex flex-col items-center gap-3 py-10 text-center">
						<AlertTriangle className="size-6 text-red-600" />
						<h1 className="text-lg font-semibold">Couldn't load this user</h1>
						<div className="flex gap-2">
							<Button variant="outline" onClick={() => refetch()}>
								<RefreshCw className="mr-2 size-4" />
								Try again
							</Button>
							<Button variant="ghost" asChild>
								<Link to="/users" search={{ page: 1 }}>
									Back to users
								</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			</main>
		);
	}

	const { user: u, sessions, accounts, bookings, bookingStats, isSelf } = data;
	const name = fullName(u);
	const selectedRole = role ?? u.role;
	const busy =
		statusMutation.isPending ||
		activeMutation.isPending ||
		revokeMutation.isPending;

	const runPending = () => {
		if (pending === "suspend") statusMutation.mutate("suspended");
		if (pending === "deactivate") activeMutation.mutate(false);
		if (pending === "revoke") revokeMutation.mutate();
	};

	return (
		<main className="min-w-0 space-y-6 p-4 md:p-6 lg:p-8">
			{/* Header */}
			<section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
				<div className="space-y-3">
					<Button
						variant="ghost"
						size="sm"
						className="-ml-3 w-fit text-muted-foreground"
						asChild
					>
						<Link to="/users" search={{ page: 1 }}>
							<ArrowLeft className="mr-2 size-4" />
							Back to users
						</Link>
					</Button>

					<div className="flex items-start gap-4">
						<UserAvatar name={name} image={u.image} size="lg" />
						<div className="min-w-0 space-y-2">
							<h1 className="truncate text-2xl font-semibold tracking-tight sm:text-3xl">
								{name}
								{isSelf && (
									<span className="ml-2 text-base font-normal text-muted-foreground">
										(you)
									</span>
								)}
							</h1>
							<p className="text-sm text-muted-foreground">{u.email}</p>
							<div className="flex flex-wrap items-center gap-2">
								<RoleBadge role={u.role} />
								<AccountStatusBadge status={u.status} />
								{!u.isActive && <Badge variant="outline">Deactivated</Badge>}
								<span className="text-xs text-muted-foreground">
									Joined {formatDate(u.createdAt)}
								</span>
							</div>
						</div>
					</div>
				</div>

				<div className="flex flex-wrap gap-2">
					{u.status === "pending" && (
						<Button
							disabled={busy}
							onClick={() => statusMutation.mutate("approved")}
						>
							<BadgeCheck className="mr-2 size-4" />
							Approve account
						</Button>
					)}
					{u.status === "suspended" && (
						<Button
							disabled={busy}
							onClick={() => statusMutation.mutate("approved")}
						>
							<BadgeCheck className="mr-2 size-4" />
							Reinstate account
						</Button>
					)}
					{u.status !== "suspended" && !isSelf && (
						<Button
							variant="outline"
							className="text-destructive hover:text-destructive"
							onClick={() => setPending("suspend")}
						>
							<ShieldOff className="mr-2 size-4" />
							Suspend
						</Button>
					)}
					{!isSelf &&
						(u.isActive ? (
							<Button
								variant="outline"
								onClick={() => setPending("deactivate")}
							>
								<CircleSlash className="mr-2 size-4" />
								Deactivate
							</Button>
						) : (
							<Button
								variant="outline"
								disabled={busy}
								onClick={() => activeMutation.mutate(true)}
							>
								Activate
							</Button>
						))}
				</div>
			</section>

			{/* Confirmation panel */}
			{pending && (
				<Card className="border-red-200">
					<CardHeader>
						<CardTitle className="text-base">
							{CONFIRM_COPY[pending].title}
						</CardTitle>
						<CardDescription>
							{CONFIRM_COPY[pending].description}
						</CardDescription>
					</CardHeader>
					<CardContent className="flex gap-2">
						<Button variant="destructive" disabled={busy} onClick={runPending}>
							{busy && <Loader2 className="mr-2 size-4 animate-spin" />}
							{CONFIRM_COPY[pending].button}
						</Button>
						<Button variant="ghost" onClick={() => setPending(null)}>
							Cancel
						</Button>
					</CardContent>
				</Card>
			)}

			<section className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
				{/* Main column */}
				<div className="min-w-0 space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Profile</CardTitle>
							<CardDescription>Personal and contact details.</CardDescription>
						</CardHeader>
						<CardContent className="space-y-5">
							<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
								<DetailItem label="Display name" value={u.name} />
								<DetailItem label="First name" value={u.firstName} />
								<DetailItem label="Last name" value={u.lastName} />
								<DetailItem
									label="Email"
									value={
										<a
											href={`mailto:${u.email}`}
											className="text-primary underline-offset-4 hover:underline"
										>
											{u.email}
										</a>
									}
								/>
								<DetailItem
									label="Phone"
									value={
										u.phone ? (
											<a
												href={`tel:${u.phone}`}
												className="text-primary underline-offset-4 hover:underline"
											>
												{u.phone}
											</a>
										) : null
									}
								/>
								<DetailItem label="Gender" value={formatLabel(u.gender)} />
								<DetailItem
									label="Date of birth"
									value={u.dateOfBirth ? formatDate(u.dateOfBirth) : null}
								/>
							</div>
							<Separator />
							<div className="flex flex-wrap gap-x-6 gap-y-2">
								<Verified ok={u.emailVerified} label="Email verified" />
								<Verified ok={u.phoneVerified} label="Phone verified" />
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Bookings</CardTitle>
							<CardDescription>
								{bookingStats.count === 0
									? "This user hasn't made any bookings."
									: `${bookingStats.count} booking${bookingStats.count === 1 ? "" : "s"} · ${formatCurrency(bookingStats.spent)} spent (excluding cancelled)`}
							</CardDescription>
						</CardHeader>
						<CardContent>
							{bookings.length > 0 ? (
								<div className="divide-y rounded-lg border">
									{bookings.map((b) => (
										<Link
											key={b.id}
											to="/bookings/$bookingId"
											params={{ bookingId: b.id }}
											className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 hover:bg-muted/40"
										>
											<div className="min-w-0">
												<p className="font-mono text-xs font-semibold">
													{b.bookingRef}
												</p>
												<p className="truncate text-sm">{b.tourTitle}</p>
												<p className="text-xs text-muted-foreground">
													Booked {formatDate(b.bookedAt)}
												</p>
											</div>
											<div className="flex items-center gap-3">
												<span className="text-sm font-medium">
													{formatCurrency(b.totalAmount)}
												</span>
												<BookingStatusBadge status={b.status} />
											</div>
										</Link>
									))}
								</div>
							) : (
								<p className="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
									No bookings yet.
								</p>
							)}
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex-row items-start justify-between gap-3">
							<div className="space-y-1.5">
								<CardTitle>Active sessions</CardTitle>
								<CardDescription>
									Devices currently signed in to this account.
								</CardDescription>
							</div>
							{sessions.length > 0 && (
								<Button
									variant="outline"
									size="sm"
									onClick={() => setPending("revoke")}
								>
									<LogOut className="mr-2 size-4" />
									Sign out all
								</Button>
							)}
						</CardHeader>
						<CardContent>
							{sessions.length > 0 ? (
								<ul className="divide-y rounded-lg border">
									{sessions.map((s) => (
										<li key={s.id} className="flex items-start gap-3 px-4 py-3">
											<Laptop className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
											<div className="min-w-0">
												<p className="text-sm font-medium">
													{describeUserAgent(s.userAgent)}
												</p>
												<p className="text-xs text-muted-foreground">
													{s.ipAddress ?? "Unknown IP"} · Started{" "}
													{formatDateTime(s.createdAt)}
												</p>
												<p className="text-xs text-muted-foreground">
													Expires {formatDateTime(s.expiresAt)}
												</p>
											</div>
										</li>
									))}
								</ul>
							) : (
								<p className="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
									No active sessions.
								</p>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Sidebar */}
				<aside className="min-w-0 space-y-6 xl:sticky xl:top-6">
					<Card>
						<CardHeader>
							<CardTitle>Role</CardTitle>
							<CardDescription>What this user can do.</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							<Select
								value={selectedRole}
								onValueChange={setRole}
								disabled={isSelf}
							>
								<SelectTrigger aria-label="Role">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{userRoles.map((r) => (
										<SelectItem key={r} value={r}>
											{r.charAt(0).toUpperCase() + r.slice(1)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							{selectedRole === "admin" && selectedRole !== u.role && (
								<p className="rounded-md bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
									Admins can manage tours, bookings and other users.
								</p>
							)}

							{isSelf ? (
								<p className="text-xs text-muted-foreground">
									You can't change your own role.
								</p>
							) : (
								<Button
									size="sm"
									disabled={selectedRole === u.role || roleMutation.isPending}
									onClick={() => roleMutation.mutate(selectedRole)}
								>
									{roleMutation.isPending && (
										<Loader2 className="mr-2 size-4 animate-spin" />
									)}
									Update role
								</Button>
							)}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Access</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between gap-3">
								<span className="text-sm text-muted-foreground">Status</span>
								<AccountStatusBadge status={u.status} />
							</div>
							<div className="flex items-center justify-between gap-3">
								<span className="text-sm text-muted-foreground">Account</span>
								<span className="text-sm font-medium">
									{u.isActive ? "Active" : "Deactivated"}
								</span>
							</div>
							<Separator />
							<DetailItem
								label="Approved"
								value={u.approvedAt ? formatDateTime(u.approvedAt) : null}
							/>
							<DetailItem
								label="Last login"
								value={u.lastLoginAt ? formatDateTime(u.lastLoginAt) : "Never"}
							/>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Sign-in methods</CardTitle>
						</CardHeader>
						<CardContent>
							{accounts.length > 0 ? (
								<ul className="space-y-2">
									{accounts.map((a) => (
										<li
											key={a.id}
											className="flex items-center justify-between gap-3 text-sm"
										>
											<span className="inline-flex items-center gap-2">
												{a.providerId === "credential" ? (
													<Mail className="size-4 text-muted-foreground" />
												) : (
													<Phone className="size-4 text-muted-foreground" />
												)}
												{a.providerId === "credential"
													? "Email & password"
													: formatLabel(a.providerId)}
											</span>
											<span className="text-xs text-muted-foreground">
												{formatDate(a.createdAt)}
											</span>
										</li>
									))}
								</ul>
							) : (
								<p className="text-sm text-muted-foreground">
									No linked sign-in methods.
								</p>
							)}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Record</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<DetailItem
								label="User ID"
								value={
									<code className="break-all font-mono text-xs">{u.id}</code>
								}
							/>
							<DetailItem label="Created" value={formatDateTime(u.createdAt)} />
							<DetailItem label="Updated" value={formatDateTime(u.updatedAt)} />
						</CardContent>
					</Card>
				</aside>
			</section>
		</main>
	);
}
