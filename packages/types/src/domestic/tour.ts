export type PublicTour = {
  id: string;
  title: string;
  destination: string;
  state: string;
  duration: string;
  durationDays: number;
  price: number;
  rating: number;
  reviewCount: number;
  category: string;
  image: string;
  tag?: string;
  groupSize: number;
  difficulty: TourDifficulty;
  highlights: string[];
}

export type TourPricingTier = {
  label: string,
  description: string,
  price: number,
  minParticipants?: number;
  maxParticipants?: number;
}

export type TourDifficulty = "Easy" | "Moderate" | "Challenging"

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

export type TourAddOn = {
  id: string;
  label: string;
  description: string;
  price: number;
  perPerson: boolean;
};

export type TourReview = Review;
