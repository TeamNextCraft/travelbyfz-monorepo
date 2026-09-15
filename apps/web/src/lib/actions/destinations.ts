import { createDestinationRepository } from "@repo/db/repository/destinations";
import { createServerFn } from "@tanstack/react-start";
import { db } from "../db-config";

export const listDestinations = createServerFn({ method: "GET"})
  .handler(() => {
  return createDestinationRepository(db)
    .getPublicDestinationsList()
    .then((destinations) => {
      return destinations.map((destination) => ({
        id: destination.id,
        name: destination.name,
        state: destination.state,
        region: destination.region,
        category: destination.category,
        tagline: destination.tagline,
        tourCount: destination.tourCount,
        rating: destination.rating,
        bestTimeToVisit: destination.bestTimeToVisit,
        coverImage: destination.coverImage,
        highlights: destination.highlights ?? [],
        isTrending: destination.isTrending,
      }))
  });
});
