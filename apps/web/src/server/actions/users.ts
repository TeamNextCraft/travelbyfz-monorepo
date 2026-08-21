import { getDb } from "#/db/client";
import { createServerFn} from "@tanstack/react-start";

export const getUsers = createServerFn({ method: 'GET'}).handler({ async () => {
  const db = getDb();
  return db.select().from()
}})
