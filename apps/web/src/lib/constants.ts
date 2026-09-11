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

/* ------------ Company details -------------- */

export const COMPANY_ADDRESS = {
  plot: "GF-12",
  building: "Coner Point",
  street: "Nr. Hussaini Park",
  area: "Gorwa",
  zip_code: 390016,
  dist: "Vadodara",
  state: "Gujarat",
  country: "India",
}

export const COMPANY_CONTACT = {
  phone: {
    whatsapp: "+91 9978612235",
    primary: "+91 9978612235",
    alternate: ""
  },
  email: {
    contact: "contact@travelbyfz.com",
    info: "info@travelbyfz.com",
    bookings: "bookings@travelbyfz.com"
  },
  social_link: {
    facebook: "https://www.facebook.com/share/1BydkKzDfi/",
    instagram: "https://www.instagram.com/fz_tours_and_travels?stkn=OHEyOHJmcjN1bnFh",
    youtube: "https://youtube.com/@fztours.travels?si=0UrjuJaQEs0xj6_d"
  }
}