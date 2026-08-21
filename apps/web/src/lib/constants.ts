import { Globe2, MapPinned, MoonStar } from "lucide-react";

export const bookingOptions = [
  {
    title: "Domestic Tours",
    description:
    "Local touring spots, weekend escapes, and custom group plans.",
    to: "/domestic",
    image:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    icon: MapPinned,
    label: "Local experiences",
  },
  {
    title: "Hajj & Umrah",
    description: "Pilgrimage packages, visa support, Makkah and Madinah stays.",
    to: "/hajj-umrah",
    image:
      "https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?auto=format&fit=crop&w=900&q=80",
    icon: MoonStar,
    label: "Religious travel",
  },
  {
    title: "International Trips",
    description:
      "Holiday packages, family trips, flights, hotels, and itineraries.",
    to: "/international",
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80",
    icon: Globe2,
    label: "Global holidays",
  },
] as const;