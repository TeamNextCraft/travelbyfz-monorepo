import { drizzle } from "drizzle-orm/d1";

export function getDb(db: Parameters<typeof drizzle>[0]) {
  return drizzle(db);
}

// import { env } from "cloudflare:workers";

// export function getDb() {
//   return drizzle(env.DB);
// }