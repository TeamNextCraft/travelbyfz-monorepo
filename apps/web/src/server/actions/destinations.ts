import { db } from "#/lib/db-config.ts";
import type { PublicDestination } from "#/lib/types/destinations.ts";
import { createDestinationRepository } from "@repo/db/repository/destinations";
import { createServerFn } from "@tanstack/react-start";

export const getPublicDestinations = createServerFn().handler<
  Promise<PublicDestination[] | undefined>
>(async () => {
  const data =
    await createDestinationRepository(db).getPublicDestinationsList();

  return data.map((destination) => ({
    ...destination,
    bestTime: destination.bestTimeToVisit || "All Year Round",
    image: destination.coverImage || "/images/destinations/default.jpg",
    heighlights: destination.highlights || [],
    region: destination.region ?? "North",
  }));
});
