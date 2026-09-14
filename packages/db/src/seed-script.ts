import { drizzle } from "drizzle-orm/d1";
import { eq, and } from "drizzle-orm";
import { destinations, tours } from "./schema/domestic";

interface Tour {
  id: string;
  title: string;
  destination: string;
  state: string;
  duration: string; // "5D / 4N"
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

const ALL_TOURS: Tour[] = [
  {
    id: "kerala-backwaters",
    title: "Kerala Backwaters & Spice Trail",
    destination: "Alleppey",
    state: "Kerala",
    duration: "5D / 4N",
    durationDays: 5,
    price: 18500,
    rating: 4.9,
    reviewCount: 312,
    category: "Beach",
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80",
    tag: "Best Seller",
    groupSize: 12,
    highlights: ["Houseboat stay", "Spice plantation", "Kathakali show"],
  },
  {
    id: "rajasthan-royals",
    title: "Royal Rajasthan Heritage Tour",
    destination: "Jaipur → Jodhpur → Udaipur",
    state: "Rajasthan",
    duration: "7D / 6N",
    durationDays: 7,
    price: 24999,
    rating: 4.8,
    reviewCount: 198,
    category: "Cultural",
    image:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80",
    tag: "Popular",
    groupSize: 10,
    highlights: ["Amber Fort", "Desert safari", "Lake Pichola cruise"],
  },
  {
    id: "spiti-valley",
    title: "Spiti Valley Expedition",
    destination: "Kaza",
    state: "Himachal Pradesh",
    duration: "8D / 7N",
    durationDays: 8,
    price: 32000,
    rating: 4.7,
    reviewCount: 145,
    category: "Adventure",
    image:
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80",
    tag: "New",
    groupSize: 8,
    highlights: ["Key Monastery", "Chandratal Lake", "4WD off-roading"],
  },
  {
    id: "char-dham",
    title: "Char Dham Yatra",
    destination: "Badrinath · Kedarnath · Gangotri · Yamunotri",
    state: "Uttarakhand",
    duration: "12D / 11N",
    durationDays: 12,
    price: 42000,
    rating: 4.9,
    reviewCount: 421,
    category: "Religious",
    image:
      "https://images.unsplash.com/photo-1609766418204-94aae0ecfdfc?w=600&q=80",
    tag: "Best Seller",
    groupSize: 15,
    highlights: ["4 sacred shrines", "Helicopter option", "Vedic rituals"],
  },
  {
    id: "coorg-retreat",
    title: "Coorg Coffee & Nature Retreat",
    destination: "Madikeri",
    state: "Karnataka",
    duration: "4D / 3N",
    durationDays: 4,
    price: 14500,
    rating: 4.6,
    reviewCount: 87,
    category: "Hill Station",
    image:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80",
    groupSize: 10,
    highlights: ["Coffee plantation walk", "Abbey Falls", "Jungle safari"],
  },
  {
    id: "andaman-escape",
    title: "Andaman Island Escape",
    destination: "Port Blair · Havelock",
    state: "Andaman & Nicobar",
    duration: "6D / 5N",
    durationDays: 6,
    price: 38000,
    rating: 4.8,
    reviewCount: 230,
    category: "Beach",
    image:
      "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600&q=80",
    groupSize: 12,
    highlights: ["Scuba diving", "Radhanagar Beach", "Cellular Jail tour"],
  },
  {
    id: "varanasi-spiritual",
    title: "Varanasi Spiritual Journey",
    destination: "Varanasi",
    state: "Uttar Pradesh",
    duration: "3D / 2N",
    durationDays: 3,
    price: 9800,
    rating: 4.7,
    reviewCount: 176,
    category: "Religious",
    image:
      "https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=600&q=80",
    groupSize: 15,
    highlights: ["Ganga Aarti", "Sunrise boat ride", "Sarnath visit"],
  },
  {
    id: "manali-adventure",
    title: "Manali Adventure & Snow",
    destination: "Manali",
    state: "Himachal Pradesh",
    duration: "6D / 5N",
    durationDays: 6,
    price: 22000,
    rating: 4.7,
    reviewCount: 289,
    category: "Adventure",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    tag: "Popular",
    groupSize: 12,
    highlights: ["Rohtang Pass", "River rafting", "Solang Valley zip-line"],
  },
  {
    id: "goa-beaches",
    title: "Goa Sun, Sand & Seafood",
    destination: "North & South Goa",
    state: "Goa",
    duration: "5D / 4N",
    durationDays: 5,
    price: 16500,
    rating: 4.5,
    reviewCount: 341,
    category: "Beach",
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80",
    groupSize: 15,
    highlights: ["Beach hopping", "Water sports", "Spice plantation tour"],
  },
  {
    id: "ooty-nilgiris",
    title: "Ooty & Nilgiris Explorer",
    destination: "Ooty",
    state: "Tamil Nadu",
    duration: "4D / 3N",
    durationDays: 4,
    price: 12000,
    rating: 4.5,
    reviewCount: 112,
    category: "Hill Station",
    image:
      "https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=600&q=80",
    groupSize: 10,
    highlights: ["Toy train ride", "Botanical Garden", "Tea estate walk"],
  },
  {
    id: "golden-triangle",
    title: "Golden Triangle — Delhi Agra Jaipur",
    destination: "Delhi · Agra · Jaipur",
    state: "Multi-State",
    duration: "6D / 5N",
    durationDays: 6,
    price: 19500,
    rating: 4.8,
    reviewCount: 507,
    category: "Cultural",
    tag: "Best Seller",
    image:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80",
    groupSize: 12,
    highlights: ["Taj Mahal sunrise", "Red Fort", "City Palace Jaipur"],
  },
  {
    id: "ladakh-expedition",
    title: "Ladakh Land of High Passes",
    destination: "Leh · Nubra · Pangong",
    state: "Ladakh",
    duration: "9D / 8N",
    durationDays: 9,
    price: 45000,
    rating: 4.9,
    reviewCount: 193,
    category: "Adventure",
    image:
      "https://images.unsplash.com/photo-1597040663342-45b6af3d91a5?w=600&q=80",
    groupSize: 8,
    highlights: ["Pangong Lake", "Nubra Valley", "Khardung La pass"],
  },
];

// ---- Helpers ----------------------------------------------------------

function slugify(id: string) {
  // Your ids are already kebab-case, but this keeps the script safe for
  // future data that isn't pre-slugified.
  return id
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseDuration(duration: string, durationDays: number) {
  // "5D / 4N" -> { days: 5, nights: 4 }; falls back to durationDays - 1.
  const match = duration.match(/(\d+)\s*D\s*\/\s*(\d+)\s*N/i);
  const days = match ? Number(match[1]) : durationDays;
  const nights = match ? Number(match[2]) : Math.max(durationDays - 1, 0);
  return { days, nights };
}

// ---- Seed logic ---------------------------------------------------------

export async function seedTours(db: ReturnType<typeof drizzle>) {
  // 1. Build a unique destination list (name + state) from the tour data.
  const uniqueDestinations = new Map<
    string,
    { name: string; state: string }
  >();

  for (const tour of ALL_TOURS) {
    const key = `${tour.destination}__${tour.state}`;
    if (!uniqueDestinations.has(key)) {
      uniqueDestinations.set(key, { name: tour.destination, state: tour.state });
    }
  }

  // 2. Insert destinations, skipping ones that already exist (by name+state).
  const destinationIdByKey = new Map<string, number>();

  for (const [key, dest] of uniqueDestinations) {
    const existing = await db
      .select({ id: destinations.id })
      .from(destinations)
      .where(and(eq(destinations.name, dest.name), eq(destinations.state, dest.state)))
      .get();

    if (existing) {
      destinationIdByKey.set(key, existing.id);
      continue;
    }

    const inserted = await db
      .insert(destinations)
      .values({ name: dest.name, state: dest.state })
      .returning({ id: destinations.id })
      .get();

    destinationIdByKey.set(key, inserted.id);
  }

  // 3. Insert tours, skipping ones that already exist by slug.
  let inserted = 0;
  let skipped = 0;

  for (const tour of ALL_TOURS) {
    const slug = slugify(tour.id);
    const key = `${tour.destination}__${tour.state}`;
    const destinationId = destinationIdByKey.get(key);

    if (!destinationId) {
      console.warn(`No destination resolved for tour "${tour.id}", skipping.`);
      continue;
    }

    const existing = await db
      .select({ id: tours.id })
      .from(tours)
      .where(eq(tours.slug, slug))
      .get();

    if (existing) {
      skipped++;
      continue;
    }

    const { days, nights } = parseDuration(tour.duration, tour.durationDays);

    await db.insert(tours).values({
      slug,
      title: tour.title,
      destinationId,
      durationDays: days,
      durationNights: nights,
      basePrice: tour.price,
      avgRating: tour.rating,
      reviewCount: tour.reviewCount,
      category: tour.category,
      featuredImage: tour.image,
      maxGroupSize: tour.groupSize,
      highlights: JSON.stringify(tour.highlights), // adjust if your column is a JSON mode column
      // TODO: add these if your schema has them
      // tag: tour.tag ?? null,
      isActive: true,
      isPublished: true,
    });

    inserted++;
  }

  console.log(`Seed complete: ${inserted} tours inserted, ${skipped} skipped (already existed).`);
}
