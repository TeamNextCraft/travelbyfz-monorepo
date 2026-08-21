import { getDb } from "@repo/db/client";
import { env } from "cloudflare:workers";

console.log({ "DB Config":  env.DB });

export const db = getDb(env.DB);
