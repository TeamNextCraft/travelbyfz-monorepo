import { createServerFn } from "@tanstack/react-start";
import { createTourRepository } from "@repo/db/repository/tours";
import { db } from "../db-config";

const categoryLabels = {
  beach: "Beach",
  adventure: "Adventure",
  cultural: "Cultural",
  religious: "Religious",
  "hill station": "Hill Station",
} as const;

export const listTours = createServerFn({ method: "GET" }).handler(() => {
  return createTourRepository(db).getPublicToursList().then((tours) =>
    tours.map((tour) => ({
      id: tour.slug,
      title: tour.title,
      destination: tour.destination ?? "",
      state: tour.state ?? "",
      duration: `${tour.durationDays}D / ${tour.durationNights}N`,
      durationDays: tour.durationDays,
      price: tour.price,
      rating: tour.rating ?? 0,
      reviewCount: tour.reviewCount,
      category:
        categoryLabels[tour.category.toLowerCase() as keyof typeof categoryLabels] ??
        tour.category,
      image: tour.image ?? "",
      groupSize: tour.groupSize ?? 0,
      highlights: tour.highlights,
    })),
  );
});

export const getTourBySlug = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(({ data: slug }) => {
    return createTourRepository(db).findPublicBySlug(slug);
  });