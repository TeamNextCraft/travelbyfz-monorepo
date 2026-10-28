import { getDb } from "@repo/db/client";
import {
	account,
	accountStatuses,
	rateLimit,
	session,
	user,
	verification,
} from "@repo/db/schema/auth.ts";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";

export function createAuth(env: {
	DB: Parameters<typeof getDb>[0];
	BETTER_AUTH_SECRET: string;
	BETTER_AUTH_URL: string;
}) {
	const db = getDb(env.DB);
	return betterAuth({
		secret: env.BETTER_AUTH_SECRET,
		baseURL: env.BETTER_AUTH_URL,

		database: drizzleAdapter(db, {
			provider: "sqlite",
			schema: {
				user: user,
				account: account,
				verification: verification,
				session: session,
				rateLimit: rateLimit,
			},
		}),

		user: {
			additionalFields: {
				firstName: {
					type: "string",
					required: false,
				},
				lastName: {
					type: "string",
					required: false,
				},
				phone: {
					type: "string",
					required: false,
				},
				role: {
					type: ["customer", "agent"] as const,
					required: false,
					defaultValue: "customer",
					input: true,
				},
				phoneVerified: {
					type: "boolean",
					required: false,
					defaultValue: false,
					input: false,
				},
				status: {
					type: [...accountStatuses],
					required: false,
					defaultValue: "pending",
					input: false,
				},
				isActive: {
					type: "boolean",
					required: false,
					defaultValue: true,
					input: false,
				},
			},
		},

		emailAndPassword: {
			enabled: true,
			minPasswordLength: 8,
			maxPasswordLength: 128,
		},

		advanced: {
			cookiePrefix: "travelbyfz",
		},

		rateLimit: {
			storage: "database",
			modelName: "rateLimit",
			window: 10,
			max: 100,
		},

		plugins: [tanstackStartCookies()],
	});
}
