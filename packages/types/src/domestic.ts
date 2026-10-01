export type TourPricingTier = {
  label: string,
  description: string,
  price: number,
  minParticipants?: number;
  maxParticipants?: number;
}

export type TourItinerary = {
  day: number;
  title: string;
  description: string;
  hotel?: string;
  meals?: string[];
  highlights: string[];
}

type Review = {
  id: string,
  name: string,
  avatar: string,
  rating: number,
  date: Date,
  text: string,
  location?: string,
}

export type TourReview = Review;

export type PublicDestination = {
  id: string;
  name: string;
  slug: string;
  state: string;
  region: DestinationRegion;
  category: DestinationCategory[];
  tagline: string;
  tourCount: number;
  rating: number;
  bestTime: string;
  image: string;
  highlights: string[];
  trending?: boolean;
};

export type DestinationCategory =
  | "Beach"
  | "Hill Station"
  | "Cultural"
  | "Religious"
  | "Adventure"
  | "Wildlife";

export type DestinationRegion =
  | "North"
  | "South"
  | "East"
  | "West"
  | "Central"
  | "Islands";

