import { createDestinationRepository } from "@repo/db/repository/destinations";
import { createServerFn } from "@tanstack/react-start";
import { db } from "../db-config";

export const listDestinations = createServerFn({ method: "GET"})
.handler(({ data }) => {
  return createDestinationRepository(db).list();
})