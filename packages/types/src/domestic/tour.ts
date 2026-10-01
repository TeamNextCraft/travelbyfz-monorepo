export type Tour = {
  id: string;
  title: string;
  destination: string;
  state: string;
  duration: string;
  durationDays: number;
  price: number;
  rating: number;
  reviewCount: number;
  category: TourCategory;
  image: string;
  tag?: TourTag;
  groupSize: number;
  highlights: string[];
}

export type TourCategory = "Beach" | "Cultural" | "Adventure" | "Religious" | "Hill Station"

export type TourTag = "Popular" | "Best Seller" | "New"
