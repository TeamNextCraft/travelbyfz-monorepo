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
  highlights: string[];
}