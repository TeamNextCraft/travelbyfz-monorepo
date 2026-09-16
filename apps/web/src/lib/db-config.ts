import { getDb } from "@repo/db/client";
import { env } from "cloudflare:workers";

export const db = getDb(env.DB);
