import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "@repo/db/client";
import * as schema from "@repo/db/schema/auth.ts";
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
        user: schema.user,
        account: schema.account,
        verification: schema.verification,
        session: schema.session,
      },
    }),

    emailAndPassword: {
      enabled: true,
    },

    advanced: {
      cookiePrefix: "travelbyfz",
    },

    plugins: [tanstackStartCookies()],
  });
}

