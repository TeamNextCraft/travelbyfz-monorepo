import { createServerFn } from "@tanstack/react-start";
import { createTourRepository } from "@repo/db/repository/tours";
import { db } from "../db-config";

export const listTours = createServerFn({ method: "GET" }).handler(() => {
  return createTourRepository(db).list({
    activeOnly: true,
    publishedOnly: true,
  });
});

export const getTourBySlug = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(({ data: slug }) => {
    return createTourRepository(db).findPublicBySlug(slug);
  });