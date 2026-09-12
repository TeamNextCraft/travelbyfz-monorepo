import { tours } from "@repo/db/schema/domestic.ts";
import { createSelectSchema } from "drizzle-orm/zod";

export const tourSelectSchema = createSelectSchema(tours);
