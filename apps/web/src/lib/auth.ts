import { createAuth } from "@repo/auth/server";
import { env } from "cloudflare:workers";

export const auth = createAuth({
  DB: env.DB,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET!,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL === "development" ? "http://localhost:3000" : process.env.BETTER_AUTH_URL!,
})