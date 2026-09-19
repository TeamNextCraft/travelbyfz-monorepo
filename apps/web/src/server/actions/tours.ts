import { db } from "#/lib/db-config.ts";
import type { PublicTour } from "#/lib/types/tour.ts";
import { createTourRepository } from "@repo/db/repository/tours";
import { createServerFn } from "@tanstack/react-start";

export const getPublicTours = createServerFn().handler<
  Promise<PublicTour[] | undefined>
>(async () => {
  const data = await createTourRepository(db).getPublicToursList();

    return data.map((tour) => ({
    ...tour,
    duration: `${tour.durationDays}D/${tour.durationNights}N`,
    destination: tour.destination ?? "N/A",
    state: tour.state ?? "N/A",
    image: tour.image ?? "/images/placeholder.jpg",
    groupSize: tour.groupSize ?? 0,
  }));
});
