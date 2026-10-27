import { account, session, user, userRoles } from "@repo/db/schema/auth.ts";
import { bookings, tours } from "@repo/db/schema/domestic.ts";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { and, count, desc, eq, gt, like, ne, or, sql, sum } from "drizzle-orm";
import { z } from "zod";
import { auth } from "#/lib/auth"; // your Better Auth instance
import { authMiddleware } from "#/lib/auth-middleware";
import { db } from "#/lib/db-config";

const PAGE_SIZE = 20;

/** Every action below must call this first. */
async function requireAdmin() {
	const s = await auth.api.getSession({ headers: getRequestHeaders() });
	if (!s?.user || (s.user as { role?: string }).role !== "admin") {
		throw new Error("Forbidden");
	}
	return s.user;
}

/** Safe columns only. */
const userColumns = {
	id: user.id,
	name: user.name,
	firstName: user.firstName,
	lastName: user.lastName,
	email: user.email,
	emailVerified: user.emailVerified,
	phone: user.phone,
	phoneVerified: user.phoneVerified,
	image: user.image,
	role: user.role,
	status: user.status,
	isActive: user.isActive,
	gender: user.gender,
	dateOfBirth: user.dateOfBirth,
	lastLoginAt: user.lastLoginAt,
	approvedAt: user.approvedAt,
	createdAt: user.createdAt,
	updatedAt: user.updatedAt,
};

/* ---------------------------- list ---------------------------- */

export const getSession = createServerFn({ method: "GET" }).handler(
	async () => {
		return await auth.api.getSession({
			headers: getRequestHeaders(),
		});
	},
);

export const getUsers = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.validator(
		z.object({
			page: z.number().int().min(1).default(1),
			q: z.string().optional(),
			role: z.string().optional(),
			status: z.string().optional(),
			access: z.enum(["active", "inactive"]).optional(),
		}),
	)
	.handler(async ({ data }) => {
		await requireAdmin();

		const term = data.q?.trim();
		const where = and(
			data.role ? eq(user.role, data.role as never) : undefined,
			data.status ? eq(user.status, data.status as never) : undefined,
			data.access ? eq(user.isActive, data.access === "active") : undefined,
			term
				? or(
						like(user.name, `%${term}%`),
						like(user.email, `%${term}%`),
						like(user.phone, `%${term}%`),
					)
				: undefined,
		);

		const rows = await db
			.select(userColumns)
			.from(user)
			.where(where)
			.orderBy(desc(user.createdAt))
			.limit(PAGE_SIZE)
			.offset((data.page - 1) * PAGE_SIZE);

		const [{ total }] = await db
			.select({ total: count() })
			.from(user)
			.where(where);

		return { rows, total, page: data.page, pageSize: PAGE_SIZE };
	});

export const getUserStats = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async () => {
		await requireAdmin();

		const [row] = await db
			.select({
				total: count(),
				pending: sql<number>`sum(case when ${user.status} = 'pending' then 1 else 0 end)`,
				agents: sql<number>`sum(case when ${user.role} = 'agent' then 1 else 0 end)`,
				suspended: sql<number>`sum(case when ${user.status} = 'suspended' then 1 else 0 end)`,
			})
			.from(user);

		return {
			total: row.total,
			pending: Number(row.pending ?? 0),
			agents: Number(row.agents ?? 0),
			suspended: Number(row.suspended ?? 0),
		};
	});

/* ---------------------------- details ---------------------------- */

export const getUserDetails = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.validator(z.object({ id: z.string() }))
	.handler(async ({ data }) => {
		const admin = await requireAdmin();

		const [found] = await db
			.select(userColumns)
			.from(user)
			.where(eq(user.id, data.id));
		if (!found) throw new Error("User not found");

		const sessions = await db
			.select({
				id: session.id,
				ipAddress: session.ipAddress,
				userAgent: session.userAgent,
				createdAt: session.createdAt,
				expiresAt: session.expiresAt,
				// NOTE: `token` is deliberately NOT selected
			})
			.from(session)
			.where(
				and(eq(session.userId, data.id), gt(session.expiresAt, new Date())),
			)
			.orderBy(desc(session.createdAt));

		const accounts = await db
			.select({
				id: account.id,
				providerId: account.providerId,
				createdAt: account.createdAt,
				// NOTE: no tokens, no password hash
			})
			.from(account)
			.where(eq(account.userId, data.id));

		const recentBookings = await db
			.select({
				id: bookings.id,
				bookingRef: bookings.bookingRef,
				status: bookings.status,
				totalAmount: bookings.totalAmount,
				bookedAt: bookings.bookedAt,
				tourTitle: tours.title,
			})
			.from(bookings)
			.innerJoin(tours, eq(tours.id, bookings.tourId))
			.where(eq(bookings.userId, data.id))
			.orderBy(desc(bookings.bookedAt))
			.limit(5);

		const [stats] = await db
			.select({ count: count(), spent: sum(bookings.totalAmount) })
			.from(bookings)
			.where(
				and(eq(bookings.userId, data.id), ne(bookings.status, "cancelled")),
			);

		const [{ all }] = await db
			.select({ all: count() })
			.from(bookings)
			.where(eq(bookings.userId, data.id));

		return {
			user: found,
			sessions,
			accounts,
			bookings: recentBookings,
			bookingStats: { count: all, spent: Number(stats?.spent ?? 0) },
			isSelf: admin.id === found.id,
		};
	});

/* ---------------------------- mutations ---------------------------- */

async function assertNotSelf(adminId: string, targetId: string) {
	if (adminId === targetId)
		throw new Error("You can't change your own account here");
}

const signOutEverywhere = (id: string) =>
	db.delete(session).where(eq(session.userId, id));

export const updateUserStatus = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator(
		z.object({ id: z.string(), status: z.enum(["approved", "suspended"]) }),
	)
	.handler(async ({ data }) => {
		const admin = await requireAdmin();
		if (data.status === "suspended") await assertNotSelf(admin.id, data.id);

		const now = new Date();
		const update = db
			.update(user)
			.set({
				status: data.status,
				...(data.status === "approved" && { approvedAt: now }),
			})
			.where(eq(user.id, data.id));

		// Suspending also kills every session, in the same batch.
		if (data.status === "suspended") {
			await db.batch([update, signOutEverywhere(data.id)]);
		} else {
			await update;
		}
	});

export const setUserActive = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator(z.object({ id: z.string(), isActive: z.boolean() }))
	.handler(async ({ data }) => {
		const admin = await requireAdmin();
		await assertNotSelf(admin.id, data.id);

		const update = db
			.update(user)
			.set({ isActive: data.isActive })
			.where(eq(user.id, data.id));

		if (!data.isActive) {
			await db.batch([update, signOutEverywhere(data.id)]);
		} else {
			await update;
		}
	});

export const updateUserRole = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator(z.object({ id: z.string(), role: z.enum(userRoles) }))
	.handler(async ({ data }) => {
		const admin = await requireAdmin();
		await assertNotSelf(admin.id, data.id);
		await db.update(user).set({ role: data.role }).where(eq(user.id, data.id));
	});

export const revokeUserSessions = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator(z.object({ id: z.string() }))
	.handler(async ({ data }) => {
		await requireAdmin();
		await signOutEverywhere(data.id);
	});
