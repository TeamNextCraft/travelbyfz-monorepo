import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import {
  MapPin,
  Clock,
  Users,
  Star,
  Shield,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  CalendarDays,
  Phone,
  Share2,
  Heart,
  Utensils,
  BedDouble,
  Bus,
  Camera,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Info,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import { Button, buttonVariants } from "#/components/ui/button";
import { Badge } from "#/components/ui/badge";
import { Card, CardContent, CardHeader } from "#/components/ui/card";
import { Separator } from "#/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "#/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "#/components/ui/tooltip";
import { cn } from "#/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type ItineraryDay = {
  day: number;
  title: string;
  description: string;
  meals: ("Breakfast" | "Lunch" | "Dinner")[];
  highlights: string[];
};

type Review = {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
  location: string;
};

type PricingTier = {
  label: string;
  description: string;
  price: number;
};

type TourDetail = {
  id: string;
  title: string;
  tagline: string;
  destination: string;
  state: string;
  duration: string;
  durationDays: number;
  category: string;
  basePrice: number;
  rating: number;
  reviewCount: number;
  groupSize: number;
  minAge: number;
  difficulty: "Easy" | "Moderate" | "Challenging";
  tag?: string;
  images: string[];
  overview: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  pricingTiers: PricingTier[];
  reviews: Review[];
  importantNotes: string[];
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
// Replace with: loader: async ({ params }) => getTourById({ data: params.tourId })

const TOURS_DB: Record<string, TourDetail> = {
  "kerala-backwaters": {
    id: "kerala-backwaters",
    title: "Kerala Backwaters & Spice Trail",
    tagline: "Float through paradise on a traditional Kerala houseboat",
    destination: "Alleppey (Alappuzha)",
    state: "Kerala",
    duration: "5 Days / 4 Nights",
    durationDays: 5,
    category: "Beach",
    basePrice: 18500,
    rating: 4.9,
    reviewCount: 312,
    groupSize: 12,
    minAge: 5,
    difficulty: "Easy",
    tag: "Best Seller",
    images: [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=85",
      "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=1200&q=85",
      "https://images.unsplash.com/photo-1590766940554-4a37b99ee0db?w=1200&q=85",
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&q=85",
      "https://images.unsplash.com/photo-1641493543690-6b4f7f01b1d3?w=1200&q=85",
    ],
    overview:
      "Glide through the serene backwaters of Kerala on a traditional kettuvallam (rice boat), wake up to misty mornings on the water, and journey through fragrant spice plantations. This 5-day tour is the perfect blend of nature, culture, and culinary discovery — from a houseboat night to a Kathakali performance in Fort Kochi.",
    highlights: [
      "Overnight stay on a private houseboat on Vembanad Lake",
      "Guided tour of a working spice & rubber plantation",
      "Kathakali dance performance in Fort Kochi",
      "Visit to Mattancherry Palace & Jewish Synagogue",
      "Village canoe ride through narrow backwater canals",
      "Traditional Kerala Sadhya (feast) experience",
    ],
    inclusions: [
      "4 nights accommodation (3★ hotel + 1 night houseboat)",
      "Daily breakfast; lunch & dinner on houseboat day",
      "AC private vehicle throughout",
      "Professional English-speaking guide",
      "All entry fees & permits",
      "Kathakali show tickets",
      "GST & service charges",
    ],
    exclusions: [
      "Airfare / train tickets to/from Kochi",
      "Personal travel insurance",
      "Meals not mentioned in inclusions",
      "Tips & gratuities",
      "Any activity not in the itinerary",
      "Camera fees at monuments",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive in Kochi — Fort Kochi Heritage Walk",
        description:
          "Arrive at Cochin International Airport. Transfer to your hotel in Fort Kochi. After settling in, embark on a heritage walk through the charming colonial lanes — Chinese fishing nets, St. Francis Church (where Vasco da Gama was once buried), and the vibrant Mattancherry spice market. Evening: Kathakali dance performance.",
        meals: ["Dinner"],
        highlights: ["Chinese fishing nets", "Mattancherry spice market", "Kathakali show"],
      },
      {
        day: 2,
        title: "Kochi to Alleppey — Board the Houseboat",
        description:
          "Morning visit to Mattancherry Palace and the Jewish Synagogue. Drive to Alleppey (1.5 hrs) and board your traditional kettuvallam houseboat. Spend the afternoon cruising the backwaters, watching village life unfold on the banks. Enjoy a fresh Kerala lunch cooked on board by your personal chef.",
        meals: ["Breakfast", "Lunch", "Dinner"],
        highlights: ["Kettuvallam boarding", "Backwater cruise", "On-board Kerala cuisine"],
      },
      {
        day: 3,
        title: "Backwaters to Kumarakom — Spice Plantation",
        description:
          "Wake up to misty backwaters. Disembark at Kumarakom and visit the famous Bird Sanctuary (seasonal). Drive to a working spice and rubber plantation for a guided walk — nutmeg, cardamom, black pepper, and cinnamon in their natural habitat. Evening at leisure.",
        meals: ["Breakfast"],
        highlights: ["Kumarakom Bird Sanctuary", "Spice plantation walk", "Black pepper & cardamom groves"],
      },
      {
        day: 4,
        title: "Village Canoe Ride & Cultural Immersion",
        description:
          "Take a village canoe through narrow shaded canals inaccessible to houseboats — the real Kerala. Stop at a local toddy shop for an authentic experience. Afternoon: cooking class with a local family, learning to make appam and fish curry from scratch.",
        meals: ["Breakfast", "Lunch"],
        highlights: ["Narrow-canal canoe ride", "Toddy shop experience", "Kerala cooking class"],
      },
      {
        day: 5,
        title: "Alleppey to Kochi — Departure",
        description:
          "Post-breakfast, drive back to Kochi. Visit the Indo-Portuguese Museum if time permits. Transfer to Cochin Airport or railway station for your onward journey. Tour ends with memories that last a lifetime.",
        meals: ["Breakfast"],
        highlights: ["Indo-Portuguese Museum", "Kochi transfer", "Departure"],
      },
    ],
    pricingTiers: [
      {
        label: "Standard",
        description: "3★ hotels, AC sleeper houseboat, shared group of up to 12",
        price: 18500,
      },
      {
        label: "Deluxe",
        description: "4★ hotels, premium houseboat with AC cabin, group of up to 8",
        price: 26000,
      },
      {
        label: "Luxury",
        description: "5★ CGH Earth properties, private luxury houseboat, couple/family only",
        price: 45000,
      },
    ],
    reviews: [
      {
        id: "r1",
        name: "Priya Mehta",
        avatar: "PM",
        rating: 5,
        date: "March 2026",
        text: "Absolutely magical experience. The houseboat was spotless, the food was incredible, and our guide Suresh was knowledgeable and funny. The canoe ride on Day 4 was the highlight — saw kingfishers up close. Booking again next year!",
        location: "Mumbai",
      },
      {
        id: "r2",
        name: "Arjun & Meghna Nair",
        avatar: "AN",
        rating: 5,
        date: "February 2026",
        text: "Took this as our anniversary trip. Everything was perfectly arranged — the houseboat sunset was straight out of a postcard. The spice plantation tour was educational and fun. Will recommend to everyone.",
        location: "Bangalore",
      },
      {
        id: "r3",
        name: "Rahul Sharma",
        avatar: "RS",
        rating: 4,
        date: "January 2026",
        text: "Great tour overall. The houseboat experience and cooking class were standout moments. Only minor issue was the houseboat had some mosquitoes at night — bring repellent! Otherwise a 5-star trip.",
        location: "Delhi",
      },
    ],
    importantNotes: [
      "Best time to visit: October to March. Avoid June–August (monsoon, houseboats may be restricted).",
      "Houseboat cruising typically stops at 5:30 PM and resumes at 6:30 AM by Kerala Water Authority rules.",
      "Carry light cotton clothing, sunscreen, and insect repellent.",
      "This tour involves boarding small canoes — not recommended for guests with severe mobility issues without prior consultation.",
    ],
  },
  "rajasthan-royals": {
    id: "rajasthan-royals",
    title: "Royal Rajasthan Heritage Tour",
    tagline: "Step into the land of maharajas, palaces, and golden deserts",
    destination: "Jaipur → Jodhpur → Udaipur",
    state: "Rajasthan",
    duration: "7 Days / 6 Nights",
    durationDays: 7,
    category: "Cultural",
    basePrice: 24999,
    rating: 4.8,
    reviewCount: 198,
    groupSize: 10,
    minAge: 5,
    difficulty: "Easy",
    tag: "Popular",
    images: [
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1200&q=85",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=85",
      "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=1200&q=85",
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=85",
    ],
    overview:
      "Travel through the Pink City, Blue City, and City of Lakes on this iconic Rajasthan circuit. From the grandeur of Amber Fort and the blue labyrinth of Jodhpur's old city, to the shimmering Lake Pichola of Udaipur — this is India at its most photogenic and culturally rich.",
    highlights: [
      "Amber Fort jeep ride & mirror palace",
      "Desert camel safari at Sam Sand Dunes",
      "Boat ride on Lake Pichola at sunset",
      "City Palace Udaipur guided tour",
      "Street food walk in Jodhpur's clock tower market",
      "Folk music & puppet show evening",
    ],
    inclusions: [
      "6 nights accommodation in heritage hotels",
      "Daily breakfast + 2 special dinners",
      "AC Toyota Innova throughout",
      "Experienced local guide at each city",
      "Camel safari (1 hour)",
      "Lake Pichola boat ride",
      "All monument entry fees",
    ],
    exclusions: [
      "Airfare to Jaipur / from Udaipur",
      "Personal travel insurance",
      "Meals beyond inclusions",
      "Tips & gratuities",
      "Hot air balloon ride (optional add-on ₹9,000)",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive Jaipur — Pink City Welcome",
        description: "Arrive in Jaipur, check in to your heritage hotel. Evening walk to Hawa Mahal for the famous pink façade at golden hour. Dinner at a rooftop restaurant overlooking the old city.",
        meals: ["Dinner"],
        highlights: ["Hawa Mahal", "Old city walk", "Rooftop dinner"],
      },
      {
        day: 2,
        title: "Jaipur — Amber Fort & City Palace",
        description: "Morning jeep ride up to Amber Fort. Explore the Sheesh Mahal (mirror palace). Afternoon: City Palace museum and the royal Jantar Mantar observatory. Evening: bazaar shopping for block prints and blue pottery.",
        meals: ["Breakfast"],
        highlights: ["Amber Fort", "Sheesh Mahal", "Jantar Mantar", "Bazaar"],
      },
      {
        day: 3,
        title: "Jaipur to Jodhpur — The Blue City",
        description: "Drive to Jodhpur (5 hrs). Check in and head straight to Mehrangarh Fort for panoramic views over the indigo rooftops. Evening: clock tower market street food walk.",
        meals: ["Breakfast"],
        highlights: ["Mehrangarh Fort", "Blue city panorama", "Street food walk"],
      },
      {
        day: 4,
        title: "Jodhpur to Jaisalmer — Desert & Sand Dunes",
        description: "Drive to Jaisalmer (3 hrs). Post lunch, head to Sam Sand Dunes for a camel safari and watch the desert sunset. Folk music and bonfire dinner at the dune camp.",
        meals: ["Breakfast", "Dinner"],
        highlights: ["Sam Sand Dunes", "Camel safari", "Desert sunset", "Folk bonfire"],
      },
      {
        day: 5,
        title: "Jaisalmer Fort & Drive to Udaipur",
        description: "Morning: Jaisalmer Fort — the only living fort in India, with residents still inside. Post lunch, scenic drive toward Udaipur (overnight journey or flight option).",
        meals: ["Breakfast"],
        highlights: ["Living fort", "Patwon Ki Haveli"],
      },
      {
        day: 6,
        title: "Udaipur — City of Lakes",
        description: "Arrive Udaipur. Visit City Palace and the stunning Jagdish Temple. Evening: iconic boat ride on Lake Pichola with views of Lake Palace (Taj hotel). Special Rajasthani thali dinner.",
        meals: ["Breakfast", "Dinner"],
        highlights: ["City Palace", "Lake Pichola boat ride", "Lake Palace view"],
      },
      {
        day: 7,
        title: "Udaipur Departure",
        description: "Leisure morning — visit Saheliyon ki Bari garden or explore local markets for miniature paintings and silver jewellery. Transfer to Udaipur airport/railway station.",
        meals: ["Breakfast"],
        highlights: ["Saheliyon ki Bari", "Departure transfer"],
      },
    ],
    pricingTiers: [
      { label: "Standard", description: "3★ heritage hotels, shared group up to 10", price: 24999 },
      { label: "Deluxe", description: "4★ palace hotels, group up to 6", price: 35000 },
      { label: "Luxury", description: "Taj/Oberoi properties, private tour", price: 68000 },
    ],
    reviews: [
      {
        id: "r1",
        name: "Sunita Kapoor",
        avatar: "SK",
        rating: 5,
        date: "February 2026",
        text: "Everything about this tour was perfect. The guides at each city were incredibly knowledgeable. The Lake Pichola sunset boat ride was pure magic. Already planning to bring my parents.",
        location: "Pune",
      },
      {
        id: "r2",
        name: "Vikram Joshi",
        avatar: "VJ",
        rating: 5,
        date: "January 2026",
        text: "The heritage hotels were beautiful — felt like royalty! Amber Fort was jaw-dropping. Great value for money. The desert bonfire on Day 4 was absolutely unforgettable.",
        location: "Hyderabad",
      },
    ],
    importantNotes: [
      "Best time: October to March. Summers (April–June) are extremely hot (45°C+).",
      "Carry light layers for desert nights — temperature drops significantly after sunset.",
      "Modest dress recommended when visiting temples and heritage sites.",
      "Jaisalmer to Udaipur leg may use overnight sleeper bus or budget flight (your choice at booking).",
    ],
  },
};

// Fallback for other tour IDs from the listing page
function getTourById(id: string): TourDetail | null {
  return TOURS_DB[id] ?? null;
}

// ─── Route ────────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/domestic/tours/$tourId/")({
  loader: async ({ params }) => {
    const tour = getTourById(params.tourId);
    if (!tour) throw notFound();
    return { tour };
  },
  notFoundComponent: () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
      <div className="text-5xl">🗺️</div>
      <h1 className="text-2xl font-bold">Tour not found</h1>
      <p className="text-muted-foreground max-w-xs">
        This tour doesn't exist or may have been removed.
      </p>
      <Link to="/domestic/tours" className={buttonVariants()}>
        Browse all tours
      </Link>
    </div>
  ),
  component: TourDetailPage,
});

// ─── Page ─────────────────────────────────────────────────────────────────────

function TourDetailPage() {
  const { tour } = Route.useLoaderData();
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);

  const selectedPrice = tour.pricingTiers[selectedTier].price;

  return (
    <TooltipProvider>
      <main>
        {/* ── Breadcrumb ─────────────────────────────────────────────── */}
        <div className="border-b bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-3">
            <nav
              className="flex items-center gap-1.5 text-sm text-muted-foreground"
              aria-label="Breadcrumb"
            >
              <Link to="/domestic" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <ChevronRight size={13} aria-hidden="true" />
              <Link
                to="/domestic/tours"
                className="hover:text-foreground transition-colors"
              >
                Tours
              </Link>
              <ChevronRight size={13} aria-hidden="true" />
              <span className="text-foreground font-medium truncate max-w-xs">
                {tour.title}
              </span>
            </nav>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            {/* ── Left / Main column ───────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-8">
              {/* Gallery */}
              <GallerySection images={tour.images} title={tour.title} />

              {/* Title block */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  {tour.tag && (
                    <Badge className="bg-amber-500 text-black border-0 font-semibold text-xs">
                      {tour.tag}
                    </Badge>
                  )}
                  <Badge variant="secondary">{tour.category}</Badge>
                  <DifficultyBadge level={tour.difficulty} />
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug">
                      {tour.title}
                    </h1>
                    <p className="text-muted-foreground mt-1">{tour.tagline}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9"
                          aria-label="Share tour"
                          onClick={() =>
                            navigator.share?.({
                              title: tour.title,
                              url: window.location.href,
                            })
                          }
                        >
                          <Share2 size={15} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Share</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className={cn(
                            "h-9 w-9 transition-colors",
                            wishlisted &&
                              "text-red-500 border-red-200 bg-red-50 dark:bg-red-950/20"
                          )}
                          aria-label={
                            wishlisted
                              ? "Remove from wishlist"
                              : "Add to wishlist"
                          }
                          onClick={() => setWishlisted((v) => !v)}
                        >
                          <Heart
                            size={15}
                            className={cn(wishlisted && "fill-red-500")}
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {wishlisted ? "Wishlisted" : "Add to wishlist"}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                {/* Quick meta row */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} aria-hidden="true" />
                    {tour.destination}, {tour.state}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} aria-hidden="true" />
                    {tour.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users size={14} aria-hidden="true" />
                    Max {tour.groupSize} people
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Star
                      size={14}
                      className="fill-amber-400 text-amber-400"
                      aria-hidden="true"
                    />
                    <span className="font-semibold text-foreground">
                      {tour.rating}
                    </span>
                    <span>({tour.reviewCount} reviews)</span>
                  </span>
                </div>
              </div>

              <Separator />

              {/* Tabs — Overview / Itinerary / Inclusions / Reviews */}
              <Tabs defaultValue="overview">
                <TabsList className="w-full justify-start overflow-x-auto">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="itinerary">
                    Itinerary ({tour.durationDays}D)
                  </TabsTrigger>
                  <TabsTrigger value="inclusions">
                    Inclusions
                  </TabsTrigger>
                  <TabsTrigger value="reviews">
                    Reviews ({tour.reviewCount})
                  </TabsTrigger>
                </TabsList>

                {/* Overview */}
                <TabsContent value="overview" className="mt-6 space-y-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {tour.overview}
                  </p>

                  <div>
                    <h2 className="font-bold text-lg mb-3">
                      Tour Highlights
                    </h2>
                    <ul className="grid sm:grid-cols-2 gap-2.5">
                      {tour.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2.5 text-sm">
                          <CheckCircle2
                            size={16}
                            className="text-primary shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Quick info grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { icon: BedDouble, label: "Accommodation", value: `${tour.durationDays - 1} Nights` },
                      { icon: Bus, label: "Transport", value: "AC Vehicle" },
                      { icon: Utensils, label: "Meals", value: "As per plan" },
                      { icon: Camera, label: "Sightseeing", value: "Guided" },
                    ].map(({ icon: Icon, label, value }) => (
                      <div
                        key={label}
                        className="flex flex-col items-center text-center gap-1.5 p-3 rounded-xl bg-muted/50 border border-border/60"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon size={15} aria-hidden="true" />
                        </div>
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p className="text-sm font-semibold">{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Important notes */}
                  <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20 p-4 space-y-2">
                    <h3 className="flex items-center gap-2 font-semibold text-sm text-amber-800 dark:text-amber-400">
                      <Info size={15} aria-hidden="true" />
                      Important Notes
                    </h3>
                    <ul className="space-y-1.5">
                      {tour.importantNotes.map((note, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-amber-800/80 dark:text-amber-400/80"
                        >
                          <AlertCircle
                            size={13}
                            className="shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                {/* Itinerary */}
                <TabsContent value="itinerary" className="mt-6">
                  <Accordion type="single" collapsible defaultValue="day-1">
                    {tour.itinerary.map((day) => (
                      <AccordionItem
                        key={day.day}
                        value={`day-${day.day}`}
                        className="border border-border/60 rounded-xl mb-3 px-4 overflow-hidden"
                      >
                        <AccordionTrigger className="hover:no-underline py-4">
                          <div className="flex items-center gap-3 text-left">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                              {day.day}
                            </span>
                            <div>
                              <p className="font-semibold text-sm leading-snug">
                                {day.title}
                              </p>
                              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                {day.meals.map((meal) => (
                                  <span
                                    key={meal}
                                    className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded"
                                  >
                                    {meal}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 space-y-3">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {day.description}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {day.highlights.map((h) => (
                              <Badge key={h} variant="secondary" className="text-xs font-normal">
                                {h}
                              </Badge>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>

                {/* Inclusions */}
                <TabsContent value="inclusions" className="mt-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-bold mb-3 flex items-center gap-2 text-green-700 dark:text-green-400">
                        <Check size={16} aria-hidden="true" />
                        What's Included
                      </h3>
                      <ul className="space-y-2.5">
                        {tour.inclusions.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2.5 text-sm"
                          >
                            <CheckCircle2
                              size={15}
                              className="text-green-600 shrink-0 mt-0.5"
                              aria-hidden="true"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold mb-3 flex items-center gap-2 text-red-600 dark:text-red-400">
                        <X size={16} aria-hidden="true" />
                        What's Not Included
                      </h3>
                      <ul className="space-y-2.5">
                        {tour.exclusions.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2.5 text-sm text-muted-foreground"
                          >
                            <X
                              size={15}
                              className="text-red-500 shrink-0 mt-0.5"
                              aria-hidden="true"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TabsContent>

                {/* Reviews */}
                <TabsContent value="reviews" className="mt-6 space-y-5">
                  {/* Rating summary */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border/60">
                    <div className="text-center">
                      <p className="text-4xl font-bold">{tour.rating}</p>
                      <div className="flex items-center justify-center gap-0.5 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={cn(
                              i < Math.round(tour.rating)
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground"
                            )}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {tour.reviewCount} reviews
                      </p>
                    </div>
                    <Separator orientation="vertical" className="h-16" />
                    <p className="text-sm text-muted-foreground">
                      Travellers consistently praise the quality of guides, houseboat
                      experience, and overall value for money.
                    </p>
                  </div>

                  {tour.reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </TabsContent>
              </Tabs>
            </div>

            {/* ── Right / Sticky Booking Sidebar ───────────────────────── */}
            <aside className="lg:col-span-1">
              <div className="sticky top-20 space-y-4">
                <Card className="border-border/60 shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Starting from
                        </p>
                        <p className="text-3xl font-bold text-primary leading-tight">
                          ₹{selectedPrice.toLocaleString("en-IN")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          per person · excl. GST
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Star
                          size={14}
                          className="fill-amber-400 text-amber-400"
                          aria-hidden="true"
                        />
                        <span className="font-semibold">{tour.rating}</span>
                        <span className="text-muted-foreground">
                          ({tour.reviewCount})
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Tier selector */}
                    <div className="space-y-2">
                      <p className="text-sm font-semibold">Choose package tier</p>
                      {tour.pricingTiers.map((tier, i) => (
                        <button
                          key={tier.label}
                          onClick={() => setSelectedTier(i)}
                          className={cn(
                            "w-full text-left rounded-xl border p-3 transition-all duration-150",
                            selectedTier === i
                              ? "border-primary bg-primary/5 ring-1 ring-primary"
                              : "border-border/60 hover:border-primary/50"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold">{tier.label}</p>
                            <p className="text-sm font-bold text-primary">
                              ₹{tier.price.toLocaleString("en-IN")}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                            {tier.description}
                          </p>
                        </button>
                      ))}
                    </div>

                    <Separator />

                    {/* Quick stats */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {[
                        { label: "Duration", value: tour.duration },
                        { label: "Group size", value: `Max ${tour.groupSize}` },
                        { label: "Min age", value: `${tour.minAge}+ years` },
                        { label: "Difficulty", value: tour.difficulty },
                      ].map(({ label, value }) => (
                        <div key={label} className="rounded-lg bg-muted/50 px-3 py-2">
                          <p className="text-xs text-muted-foreground">{label}</p>
                          <p className="font-semibold text-sm">{value}</p>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <Link
                      to="/domestic/tours/$tourId/book"
                      params={{ tourId: tour.id }}
                      search={{ tier: tour.pricingTiers[selectedTier].label }}
                      className={buttonVariants({
                        className: "w-full gap-2",
                        size: "lg",
                      })}
                    >
                      Book This Tour
                      <ArrowRight size={16} aria-hidden="true" />
                    </Link>

                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() =>
                        document
                          .getElementById("request")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                    >
                      <Phone size={14} aria-hidden="true" />
                      Request customisation
                    </Button>

                    {/* Trust strip */}
                    <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground pt-1">
                      <Shield size={12} className="text-green-600" aria-hidden="true" />
                      Secure booking · Free cancellation up to 15 days
                    </div>
                  </CardContent>
                </Card>

                {/* Need help card */}
                <Card className="border-border/60 bg-muted/30">
                  <CardContent className="pt-4 pb-4">
                    <p className="text-sm font-semibold mb-1">
                      Need help deciding?
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      Our travel experts are available Mon–Sat, 9AM–7PM IST.
                    </p>
                    <a
                      href="tel:+919876543210"
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                        className: "w-full gap-2",
                      })}
                    >
                      <Phone size={13} aria-hidden="true" />
                      +91 98765 43210
                    </a>
                  </CardContent>
                </Card>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </TooltipProvider>
  );
}

// ─── Gallery ──────────────────────────────────────────────────────────────────

function GallerySection({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [active, setActive] = useState(0);

  const prev = () => setActive((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setActive((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="space-y-2">
      {/* Main image */}
      <div className="relative overflow-hidden rounded-2xl aspect-[16/9] bg-muted">
        <img
          src={images[active]}
          alt={`${title} — photo ${active + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
          loading="eager"
          width={1200}
          height={675}
        />
        {/* Nav arrows */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors backdrop-blur-sm"
          aria-label="Previous photo"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors backdrop-blur-sm"
          aria-label="Next photo"
        >
          <ChevronRight size={18} />
        </button>
        {/* Counter */}
        <span className="absolute bottom-3 right-3 text-xs text-white bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
          {active + 1} / {images.length}
        </span>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              "shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all",
              active === i
                ? "border-primary opacity-100"
                : "border-transparent opacity-60 hover:opacity-90"
            )}
            aria-label={`View photo ${i + 1}`}
          >
            <img
              src={img}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
              width={64}
              height={48}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Review Card ──────────────────────────────────────────────────────────────

function ReviewCard({ review }: { review: Review }) {
  return (
    <Card className="border-border/60 p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
            {review.avatar}
          </div>
          <div>
            <p className="font-semibold text-sm">{review.name}</p>
            <p className="text-xs text-muted-foreground">{review.location}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: review.rating }).map((_, i) => (
              <Star
                key={i}
                size={12}
                className="fill-amber-400 text-amber-400"
                aria-hidden="true"
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">{review.date}</p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        "{review.text}"
      </p>
    </Card>
  );
}

// ─── Difficulty Badge ─────────────────────────────────────────────────────────

function DifficultyBadge({ level }: { level: TourDetail["difficulty"] }) {
  const styles = {
    Easy: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    Moderate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
    Challenging: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  };
  return (
    <Badge className={cn("border-0 text-xs font-medium", styles[level])}>
      {level}
    </Badge>
  );
}
