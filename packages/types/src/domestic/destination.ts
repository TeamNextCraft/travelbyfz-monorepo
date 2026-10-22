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

export type DestinationSeason = {
  name: "Peak" | "Shoulder" | "Off-season";
  months: string;
  description: string;
  temp: string;
}

export type DestinationAttraction = {
  name: string;
  type: string;
  description: string;
  image: string;
  timings?: string;
  entryFee?: string;
};

export type DestinationTravelOption = {
  mode: "Flight" | "Train" | "Bus" | "Road";
  from: string;
  duration: string;
  details: string;
};

export type DestinationCuisine = {
  name: string;
  description: string;
};
