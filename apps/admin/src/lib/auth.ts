import { env } from "cloudflare:workers";
import { createAuth } from "@repo/auth/server";

export const auth = createAuth({
	DB: env.DB,
	BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET!,
	BETTER_AUTH_URL: process.env.BETTER_AUTH_URL!,
});
