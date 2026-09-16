export type PublicDestination = {
  id: string;
  name: string;
  state: string;
  region: Region;
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

export type Region = "North" | "South" | "East" | "West" | "Central" | "Islands";