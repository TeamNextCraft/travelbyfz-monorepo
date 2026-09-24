import { drizzle } from "drizzle-orm/d1";
import {seed} from "drizzle-seed"
import { destinations } from "./schema/domestic";

async function main(db: Parameters<typeof drizzle>[0]) {
  await seed(db, {destinations})
}
