import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  MapPin,
  Clock,
  Star,
  ArrowRight,
  ChevronRight,
  CalendarDays,
  Thermometer,
  CloudRain,
  Sun,
  Wind,
  Users,
  Camera,
  Utensils,
  ShoppingBag,
  Train,
  Plane,
  Bus,
  Info,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "#/components/ui/badge";
import { Button, buttonVariants } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Separator } from "#/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { cn } from "#/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Season = {
  name: "Peak" | "Shoulder" | "Off-season";
  months: string;
  description: string;
  temp: string;
  icon: React.ElementType;
};

type Attraction = {
  name: string;
  type: string;
  description: string;
  image: string;
  timings?: string;
  entryFee?: string;
};

type TravelOption = {
  mode: "Flight" | "Train" | "Bus" | "Road";
  icon: React.ElementType;
  from: string;
  duration: string;
  details: string;
};

type TourCard = {
  id: string;
  title: string;
  duration: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  tag?: string;
};

type Cuisine = {
  name: string;
  description: string;
};

type DestinationDetail = {
  id: string;
  name: string;
  state: string;
  region: string;
  category: string[];
  tagline: string;
  description: string;
  heroImage: string;
  galleryImages: string[];
  rating: number;
  reviewCount: number;
  tourCount: number;
  area: string;
  language: string;
  currency: string;
  bestTime: string;
  seasons: Season[];
  attractions: Attraction[];
  tours: TourCard[];
  howToReach: TravelOption[];
  cuisine: Cuisine[];
  travelTips: string[];
  doList: string[];
  dontList: string[];
};

// ─── Destination DB ───────────────────────────────────────────────────────────
// Replace with: loader: async ({ params }) => getDestinationBySlug({ data: params.slug })

const DESTINATION_DB: Record<string, DestinationDetail> = {
  kerala: {
    id: "kerala",
    name: "Kerala",
    state: "Kerala",
    region: "South India",
    category: ["Beach", "Cultural", "Hill Station"],
    tagline: "God's Own Country — backwaters, spices & lush greenery",
    description:
      "Kerala is a state on India's tropical Malabar Coast. It is known for its palm-lined beaches, serene backwaters, and rich spice plantations. A houseboat cruise through the labyrinthine canals and lagoons of the backwaters — the most popular tourist activity — offers an incomparable view of village life. The state's lush Western Ghats hill stations like Munnar, Wayanad, and Thekkady are blanketed in tea and cardamom estates. Kerala is also home to a rich cultural tradition: Kathakali dance, Mohiniyattam, and Kalaripayattu martial arts make it one of India's most culturally distinctive destinations.",
    heroImage:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1600&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800&q=80",
      "https://images.unsplash.com/photo-1590766940554-4a37b99ee0db?w=800&q=80",
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80",
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80",
    ],
    rating: 4.9,
    reviewCount: 2840,
    tourCount: 27,
    area: "38,852 km²",
    language: "Malayalam (English widely spoken)",
    currency: "Indian Rupee (₹)",
    bestTime: "October – March",
    seasons: [
      {
        name: "Peak",
        months: "Oct – Mar",
        description:
          "Cool, dry, and perfect for houseboat cruises, beach visits, and hill stations. Most festivals occur during this period.",
        temp: "23–32°C",
        icon: Sun,
      },
      {
        name: "Shoulder",
        months: "Sep & Apr",
        description:
          "Pre/post-monsoon — lush greenery, fewer tourists, and reduced prices. Some backwater areas may have restrictions.",
        temp: "28–35°C",
        icon: Wind,
      },
      {
        name: "Off-season",
        months: "May – Aug",
        description:
          "Heavy monsoon rains. Houseboats partially restricted. However, Ayurveda retreats thrive and prices are lowest.",
        temp: "25–30°C",
        icon: CloudRain,
      },
    ],
    attractions: [
      {
        name: "Alleppey Backwaters",
        type: "Natural",
        description:
          "The crown jewel of Kerala — a vast network of canals, rivers, and lagoons. Cruise on a traditional kettuvallam houseboat through Vembanad Lake and watch life unfold on the banks.",
        image:
          "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80",
        timings: "Year-round (restricted Jun–Aug)",
        entryFee: "Houseboat from ₹8,000/night",
      },
      {
        name: "Munnar Tea Estates",
        type: "Hill Station",
        description:
          "Rolling hills blanketed in emerald tea plantations at 1,600m altitude. Visit the Tea Museum, walk through Eravikulam National Park, and catch sunrise over the Nilgiris.",
        image:
          "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80",
        timings: "Year-round; best Oct–Apr",
        entryFee: "Eravikulam NP: ₹125 per person",
      },
      {
        name: "Fort Kochi",
        type: "Heritage",
        description:
          "A historic quarter with a Portuguese, Dutch, and British colonial legacy. Chinese fishing nets, the Mattancherry Palace, Jewish Synagogue, and buzzing street art make it irresistible.",
        image:
          "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=80",
        timings: "Daily 9 AM – 5 PM",
        entryFee: "Mattancherry Palace: ₹5",
      },
      {
        name: "Periyar Tiger Reserve",
        type: "Wildlife",
        description:
          "One of India's finest wildlife sanctuaries, centred around the man-made Periyar Lake. Boat safaris offer sightings of elephants, wild boar, sambar deer, and if lucky, tigers.",
        image:
          "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=600&q=80",
        timings: "6 AM – 6 PM",
        entryFee: "₹600 (includes boat safari)",
      },
      {
        name: "Varkala Cliff Beach",
        type: "Beach",
        description:
          "A dramatic cliff-backed beach unlike anything else in Kerala. Red laterite cliffs drop directly to the Arabian Sea, lined with cafés, yoga studios, and a sacred Vishnu temple.",
        image:
          "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600&q=80",
        timings: "Year-round; best Nov–Mar",
        entryFee: "Free",
      },
      {
        name: "Kathakali Performance",
        type: "Culture",
        description:
          "Kerala's classical dance-drama with elaborate make-up, ornate costumes, and expressive storytelling. Live performances happen nightly in Fort Kochi and Thrissur.",
        image:
          "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=600&q=80",
        timings: "Evening shows 6–8 PM",
        entryFee: "₹350–700 per person",
      },
    ],
    tours: [
      {
        id: "kerala-backwaters",
        title: "Kerala Backwaters & Spice Trail",
        duration: "5D / 4N",
        price: 18500,
        rating: 4.9,
        reviewCount: 312,
        image:
          "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80",
        tag: "Best Seller",
      },
      {
        id: "coorg-retreat",
        title: "Coorg Coffee & Nature Retreat",
        duration: "4D / 3N",
        price: 14500,
        rating: 4.6,
        reviewCount: 87,
        image:
          "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80",
      },
    ],
    howToReach: [
      {
        mode: "Flight",
        icon: Plane,
        from: "Major Indian cities",
        duration: "1.5 – 3 hrs",
        details:
          "Kochi (COK), Thiruvananthapuram (TRV), and Calicut (CCJ) are the main airports. Kochi is the best-connected.",
      },
      {
        mode: "Train",
        icon: Train,
        from: "Mumbai, Delhi, Chennai",
        duration: "24 – 48 hrs",
        details:
          "Kerala is well-connected by rail. Ernakulam Junction (Kochi) is the major hub. Popular trains: Kerala Express, Rajdhani.",
      },
      {
        mode: "Bus",
        icon: Bus,
        from: "Bangalore, Chennai, Coimbatore",
        duration: "8 – 12 hrs",
        details:
          "KSRTC luxury buses connect Kerala to neighbouring states. Comfortable Volvo AC overnight coaches are widely available.",
      },
    ],
    cuisine: [
      {
        name: "Kerala Sadhya",
        description:
          "A vegetarian feast served on a banana leaf — 25+ dishes including rice, sambar, avial, olan, and payasam for dessert.",
      },
      {
        name: "Fish Curry (Meen Curry)",
        description:
          "Kokum-based fish curry with coconut milk — staple of every Kerala home. Best eaten fresh off a fishing boat.",
      },
      {
        name: "Appam with Stew",
        description:
          "Lacey rice hoppers with a mild coconut-based vegetable or chicken stew — the quintessential Kerala breakfast.",
      },
      {
        name: "Karimeen Pollichathu",
        description:
          "Pearl spot fish marinated in spices and pan-fried in a banana leaf — a backwater region specialty.",
      },
    ],
    travelTips: [
      "Pre-book houseboats at least 2–3 weeks in advance during peak season (Dec–Jan).",
      "Carry cash — many backwater villages and spice shops don't accept cards.",
      "Modest dress is required at temples. Carry a stole/dupatta.",
      "Auto-rickshaws are metered in cities; negotiate fares in smaller towns.",
      "The Kerala Tourism app (KTDC) has official rates for boats, guides, and packages.",
      "Mosquito repellent is essential, especially on houseboat nights.",
    ],
    doList: [
      "Take an overnight houseboat cruise on Vembanad Lake",
      "Attend a live Kathakali performance",
      "Try a traditional Kerala Sadhya on banana leaf",
      "Visit a working spice or rubber plantation",
      "Go for an early-morning canoe ride through narrow canals",
    ],
    dontList: [
      "Don't enter temples with leather items (belts, bags)",
      "Don't photograph locals without permission",
      "Avoid swimming at unsupervised beaches",
      "Don't skip travel insurance — monsoon cancellations happen",
    ],
  },

  "leh-ladakh": {
    id: "leh-ladakh",
    name: "Leh Ladakh",
    state: "Ladakh",
    region: "North India",
    category: ["Adventure", "Cultural"],
    tagline: "The land of high passes, monasteries & starry skies",
    description:
      "Leh-Ladakh is a high-altitude desert region in the northernmost part of India, bordering Tibet and Pakistan. At elevations above 3,500m, it's a world of stark, dramatic landscapes — from the turquoise Pangong Lake (spanning India and China) to the surreal Nubra Valley with its double-humped Bactrian camels. Ancient Tibetan Buddhist monasteries cling to cliffsides, prayer flags flutter in the cold mountain wind, and the night sky here rivals any in the world. Ladakh is India's most epic road trip and bucket-list adventure destination.",
    heroImage:
      "https://images.unsplash.com/photo-1597040663342-45b6af3d91a5?w=1600&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80",
      "https://images.unsplash.com/photo-1609766418204-94aae0ecfdfc?w=800&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1543158181-e6f9f6712055?w=800&q=80",
    ],
    rating: 4.9,
    reviewCount: 1920,
    tourCount: 15,
    area: "59,146 km²",
    language: "Ladakhi, Hindi (English in tourist areas)",
    currency: "Indian Rupee (₹)",
    bestTime: "June – September",
    seasons: [
      {
        name: "Peak",
        months: "Jun – Sep",
        description:
          "All mountain passes open, roads accessible, festivals in full swing. The only time for the full Ladakh experience.",
        temp: "10–25°C (day) / 0–5°C (night)",
        icon: Sun,
      },
      {
        name: "Shoulder",
        months: "May & Oct",
        description:
          "Fewer tourists, some passes may be closed. Chadar Frozen River Trek (Jan–Feb) is a unique winter-only experience.",
        temp: "5–15°C (day) / -10°C (night)",
        icon: Wind,
      },
      {
        name: "Off-season",
        months: "Nov – Apr",
        description:
          "Most roads closed, extreme cold (-20°C). Only accessible by flight. Recommended only for hardcore winter adventurers.",
        temp: "-15 to 0°C",
        icon: Thermometer,
      },
    ],
    attractions: [
      {
        name: "Pangong Tso Lake",
        type: "Natural",
        description:
          "The iconic 134km-long lake at 4,350m altitude. Its waters shift from emerald to cobalt blue depending on the light. The Indian side is accessible; the far shore is China.",
        image:
          "https://images.unsplash.com/photo-1597040663342-45b6af3d91a5?w=600&q=80",
        timings: "Year-round (snowbound Nov–May)",
        entryFee: "₹400 (protected area permit required)",
      },
      {
        name: "Nubra Valley",
        type: "Natural",
        description:
          "A cold desert at 3,100m with sand dunes, Bactrian camels, and the Diskit Monastery overlooking the Shyok River. Reached via Khardung La — one of the world's highest motorable passes.",
        image:
          "https://images.unsplash.com/photo-1626621341517-bbf3d9990a26?w=600&q=80",
        timings: "Jun – Oct",
        entryFee: "Inner Line Permit required (₹420)",
      },
      {
        name: "Thiksey Monastery",
        type: "Cultural",
        description:
          "A 12-storey Tibetan Buddhist monastery resembling Lhasa's Potala Palace. The sunrise puja at 6 AM with monks chanting and blowing ceremonial horns is unmissable.",
        image:
          "https://images.unsplash.com/photo-1609766418204-94aae0ecfdfc?w=600&q=80",
        timings: "6 AM – 6 PM",
        entryFee: "₹30",
      },
      {
        name: "Khardung La Pass",
        type: "Adventure",
        description:
          "At 5,359m, it's among the world's highest motorable passes. Bikers from across India make the pilgrimage here. Thin air, dramatic views, snow even in summer.",
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
        timings: "May – Oct (weather dependent)",
        entryFee: "Free",
      },
    ],
    tours: [
      {
        id: "ladakh-expedition",
        title: "Ladakh Land of High Passes",
        duration: "9D / 8N",
        price: 45000,
        rating: 4.9,
        reviewCount: 193,
        image:
          "https://images.unsplash.com/photo-1597040663342-45b6af3d91a5?w=600&q=80",
        tag: "Popular",
      },
    ],
    howToReach: [
      {
        mode: "Flight",
        icon: Plane,
        from: "Delhi, Mumbai",
        duration: "1 hr 15 min",
        details:
          "Kushok Bakula Rimpochee Airport (IXL) in Leh is the entry point. IndiGo and Air India operate daily flights from Delhi. Best to acclimatize 1–2 days post arrival.",
      },
      {
        mode: "Road",
        icon: Bus,
        from: "Manali or Srinagar",
        duration: "2 days",
        details:
          "Manali–Leh Highway (479 km, Jun–Oct) and Srinagar–Leh Highway (434 km, May–Nov) are the two epic road routes. Both offer breathtaking scenery.",
      },
    ],
    cuisine: [
      {
        name: "Thukpa",
        description:
          "A hearty Tibetan noodle soup with vegetables and meat — the staple comfort food of Ladakh's cold climate.",
      },
      {
        name: "Momos",
        description:
          "Steamed dumplings filled with vegetables, mutton, or yak meat — eaten with a fiery red chilli chutney.",
      },
      {
        name: "Butter Tea (Gur Gur Chai)",
        description:
          "Traditional Tibetan salted tea churned with yak butter — an acquired taste that provides warmth and energy at altitude.",
      },
      {
        name: "Skyu",
        description:
          "A traditional Ladakhi stew with hand-rolled wheat pasta, root vegetables, and mutton — pure mountain comfort food.",
      },
    ],
    travelTips: [
      "Acclimatize for 1–2 days in Leh before venturing to high passes. Altitude sickness is real.",
      "Carry Diamox (acetazolamide) — consult a doctor before the trip.",
      "Inner Line Permits are required for Nubra Valley, Pangong, and certain areas. Your tour operator handles this.",
      "Cash is essential — ATMs are scarce and often run out. Carry at least ₹10,000 in cash.",
      "Carry warm layers regardless of the month — nights are always cold.",
      "Fuel up at every opportunity — petrol stations are sparse beyond Leh.",
    ],
    doList: [
      "Witness sunrise puja at Thiksey Monastery",
      "Ride/drive to Khardung La pass (carry warm gear)",
      "Spend a night camping at Pangong Lake",
      "Try a camel ride in Nubra Valley sand dunes",
      "Stargaze — Ladakh has some of the darkest skies in India",
    ],
    dontList: [
      "Don't rush to high altitudes — acclimatize properly",
      "Don't litter — Ladakh's ecosystem is extremely fragile",
      "Don't fly a drone without permits",
      "Don't enter monasteries without removing shoes",
    ],
  },

  jaipur: {
    id: "jaipur",
    name: "Jaipur",
    state: "Rajasthan",
    region: "North India",
    category: ["Cultural"],
    tagline: "The Pink City of palaces, forts & desert royalty",
    description:
      "Jaipur, the capital of Rajasthan, was founded in 1727 by Maharaja Jai Singh II and is famed for its distinctive terracotta-pink buildings. The city is a UNESCO World Heritage Site and forms one corner of India's Golden Triangle (with Delhi and Agra). Jaipur's old walled city is a living museum of Rajput architecture, colourful bazaars, and royal traditions. From the palace-fortress of Amber to the astronomical precision of Jantar Mantar, and from the all-pink Hawa Mahal to the massive City Palace that still houses Rajasthan's royal family — Jaipur is one of India's most photogenic and rewarding cities.",
    heroImage:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1600&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80",
      "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800&q=80",
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80",
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80",
    ],
    rating: 4.8,
    reviewCount: 3120,
    tourCount: 31,
    area: "484 km² (city)",
    language: "Hindi, Rajasthani (English in tourist areas)",
    currency: "Indian Rupee (₹)",
    bestTime: "October – March",
    seasons: [
      {
        name: "Peak",
        months: "Oct – Mar",
        description:
          "Cool and pleasant. Festivals like Diwali, Pushkar Fair, and Jaipur Literature Festival happen during this window.",
        temp: "8–25°C",
        icon: Sun,
      },
      {
        name: "Shoulder",
        months: "Sep & Apr",
        description:
          "Manageable heat, fewer tourists, better hotel rates. Good for budget travellers.",
        temp: "22–35°C",
        icon: Wind,
      },
      {
        name: "Off-season",
        months: "May – Aug",
        description:
          "Extreme heat (up to 45°C) in May–June. Monsoon brings relief in July–Aug but also humidity. Not recommended.",
        temp: "30–45°C",
        icon: Thermometer,
      },
    ],
    attractions: [
      {
        name: "Amber Fort",
        type: "Heritage",
        description:
          "A majestic 16th-century fort-palace of red sandstone and marble overlooking Maota Lake. The Sheesh Mahal (Hall of Mirrors) is encrusted with thousands of tiny mirrors — light a candle and the ceiling blazes.",
        image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80",
        timings: "8 AM – 5:30 PM",
        entryFee: "₹100 (Indian) / ₹500 (Foreign)",
      },
      {
        name: "Hawa Mahal",
        type: "Heritage",
        description:
          "The 'Palace of Winds' — a 5-storey honeycomb façade with 953 small latticed windows. Built in 1799 for royal ladies to observe street life without being seen.",
        image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80",
        timings: "9 AM – 4:30 PM",
        entryFee: "₹50 (Indian) / ₹200 (Foreign)",
      },
      {
        name: "City Palace",
        type: "Heritage",
        description:
          "The royal residence — still partially home to the Jaipur royal family. Houses extraordinary collections of royal costumes, weapons, and manuscripts. The Chandra Mahal has 7 floors of opulent rooms.",
        image: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=600&q=80",
        timings: "9:30 AM – 5 PM",
        entryFee: "₹130 (Indian) / ₹500 (Foreign)",
      },
      {
        name: "Jantar Mantar",
        type: "Heritage",
        description:
          "UNESCO World Heritage astronomical observatory built in 1734. Contains 19 massive stone instruments including the world's largest sundial, still accurate to 2 seconds.",
        image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80",
        timings: "9 AM – 4:30 PM",
        entryFee: "₹50 (Indian) / ₹200 (Foreign)",
      },
    ],
    tours: [
      {
        id: "rajasthan-royals",
        title: "Royal Rajasthan Heritage Tour",
        duration: "7D / 6N",
        price: 24999,
        rating: 4.8,
        reviewCount: 198,
        image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80",
        tag: "Popular",
      },
      {
        id: "golden-triangle",
        title: "Golden Triangle — Delhi Agra Jaipur",
        duration: "6D / 5N",
        price: 19500,
        rating: 4.8,
        reviewCount: 507,
        image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80",
        tag: "Best Seller",
      },
    ],
    howToReach: [
      {
        mode: "Flight",
        icon: Plane,
        from: "Delhi, Mumbai, Bangalore",
        duration: "1 – 2 hrs",
        details:
          "Jaipur International Airport (JAI) is 13 km from the city. IndiGo, Air India, and SpiceJet operate frequent daily flights.",
      },
      {
        mode: "Train",
        icon: Train,
        from: "Delhi, Mumbai, Agra",
        duration: "4.5 – 18 hrs",
        details:
          "Jaipur Junction is the main station. Shatabdi Express from Delhi takes 4.5 hrs. Rajdhani and Duronto also available.",
      },
      {
        mode: "Bus",
        icon: Bus,
        from: "Delhi, Agra, Jodhpur",
        duration: "5 – 8 hrs",
        details:
          "RSRTC and private Volvo buses run from Delhi (5–6 hrs) and Agra (4 hrs). Comfortable AC coaches widely available.",
      },
    ],
    cuisine: [
      {
        name: "Dal Baati Churma",
        description:
          "Rajasthan's iconic dish — hard wheat rolls (baati) baked in a sand pit, eaten with five-lentil dal and sweet churma. A true taste of royalty.",
      },
      {
        name: "Laal Maas",
        description:
          "A fiery mutton curry made with Mathania red chillies — one of India's most intensely flavoured meat dishes.",
      },
      {
        name: "Ghewar",
        description:
          "A disc-shaped festival sweet made of flour, ghee, and sugar syrup — especially popular during Teej and Diwali.",
      },
      {
        name: "Pyaaz Kachori",
        description:
          "Deep-fried pastry stuffed with spiced onion filling — the quintessential Jaipur breakfast from old city stalls.",
      },
    ],
    travelTips: [
      "Buy the Jaipur City Palace Composite Ticket (₹300) — covers Amber Fort, Jantar Mantar, Hawa Mahal, and City Palace.",
      "Hire an auto or take Ola/Uber — avoid horse-drawn carriages (animal welfare concerns).",
      "Bargain at Johari Bazaar (jewellery) and Bapu Bazaar (textiles) — start at 40% of the quoted price.",
      "The Jaipur Metro connects the old and new city — efficient and cheap.",
      "Book dinner at a heritage haveli restaurant at least 24 hrs in advance during peak season.",
    ],
    doList: [
      "Watch sunrise from the roof of Nahargarh Fort",
      "Take a jeep ride up to Amber Fort (skip the elephant rides)",
      "Do a street food walk in the old city near Badi Chaupar",
      "Shop for block-print textiles and blue pottery",
      "Attend the evening light and sound show at Amber Fort",
    ],
    dontList: [
      "Don't use elephant rides at Amber Fort — they're harmful to the animals",
      "Don't carry large bags inside forts — lockers available outside",
      "Don't exchange currency with street touts — use authorized counters",
      "Avoid visiting during harsh summer months (May–June)",
    ],
  },
};

// ─── Route ────────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/domestic/destinations/$slug")({
  loader: async ({ params }) => {
    const destination = DESTINATION_DB[params.slug] ?? null;
    if (!destination) throw notFound();
    return { destination };
  },
  notFoundComponent: () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
      <div className="text-5xl">🗺️</div>
      <h1 className="text-2xl font-bold">Destination not found</h1>
      <p className="text-muted-foreground max-w-xs">
        This destination doesn't exist yet or may have been moved.
      </p>
      <Link to="/domestic/destinations" className={buttonVariants()}>
        Browse all destinations
      </Link>
    </div>
  ),
  component: DestinationDetailPage,
});

// ─── Page ─────────────────────────────────────────────────────────────────────

function DestinationDetailPage() {
  const { destination: dest } = Route.useLoaderData();

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <HeroSection dest={dest} />

      {/* ── Breadcrumb + meta bar ─────────────────────────────────────── */}
      <div className="border-b bg-background">
        <div className="mx-auto max-w-7xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <nav
            className="flex items-center gap-1.5 text-sm text-muted-foreground"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight size={13} aria-hidden="true" />
            <Link
              to="/domestic/destinations"
              className="hover:text-foreground transition-colors"
            >
              Destinations
            </Link>
            <ChevronRight size={13} aria-hidden="true" />
            <span className="text-foreground font-medium">{dest.name}</span>
          </nav>

          {/* Quick stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star size={13} className="fill-amber-400 text-amber-400" />
              <span className="font-semibold text-foreground">{dest.rating}</span>
              <span>({dest.reviewCount.toLocaleString()} reviews)</span>
            </span>
            <Separator orientation="vertical" className="h-4" />
            <span className="flex items-center gap-1">
              <MapPin size={13} />
              {dest.state}
            </span>
            <Separator orientation="vertical" className="h-4" />
            <span className="flex items-center gap-1">
              <Clock size={13} />
              Best: {dest.bestTime}
            </span>
          </div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* ── Main column ────────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview">
              <TabsList className="w-full justify-start overflow-x-auto mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="attractions">Attractions</TabsTrigger>
                <TabsTrigger value="tours">
                  Tours ({dest.tourCount})
                </TabsTrigger>
                <TabsTrigger value="plan">Plan Your Trip</TabsTrigger>
              </TabsList>

              {/* Overview tab */}
              <TabsContent value="overview" className="space-y-10">
                {/* About */}
                <div>
                  <h2 className="text-xl font-bold mb-3">
                    About {dest.name}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {dest.description}
                  </p>
                </div>

                {/* Gallery */}
                <GalleryGrid images={dest.galleryImages} name={dest.name} />

                {/* Best time / Seasons */}
                <SeasonsSection seasons={dest.seasons} />

                {/* Cuisine */}
                <div>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Utensils size={18} className="text-primary" />
                    Local Cuisine
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {dest.cuisine.map((item) => (
                      <div
                        key={item.name}
                        className="rounded-xl border border-border/60 p-4 bg-muted/20"
                      >
                        <p className="font-semibold text-sm mb-1">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Attractions tab */}
              <TabsContent value="attractions" className="space-y-5">
                <p className="text-sm text-muted-foreground">
                  {dest.attractions.length} top attractions in {dest.name}
                </p>
                {dest.attractions.map((attraction) => (
                  <AttractionCard key={attraction.name} attraction={attraction} />
                ))}
              </TabsContent>

              {/* Tours tab */}
              <TabsContent value="tours" className="space-y-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {dest.tourCount} tours available to {dest.name}
                  </p>
                  <Link
                    to="/domestic/tours"
                    search={{ state: dest.state }}
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                    })}
                  >
                    View all
                    <ArrowRight size={13} className="ml-1" />
                  </Link>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {dest.tours.map((tour) => (
                    <TourCardItem key={tour.id} tour={tour} />
                  ))}
                </div>

                {/* CTA */}
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 text-center space-y-3">
                  <p className="font-semibold">
                    Want a custom {dest.name} itinerary?
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Our travel experts craft personalised plans based on your
                    dates, group size, and budget.
                  </p>
                  <Link
                    to="/"
                    className={buttonVariants({ size: "sm", className: "gap-2" })}
                  >
                    Request custom trip
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </TabsContent>

              {/* Plan tab */}
              <TabsContent value="plan" className="space-y-10">
                {/* How to reach */}
                <div>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <MapPin size={18} className="text-primary" />
                    How to Reach {dest.name}
                  </h2>
                  <div className="space-y-3">
                    {dest.howToReach.map((option) => (
                      <HowToReachCard key={option.mode} option={option} />
                    ))}
                  </div>
                </div>

                {/* Travel tips */}
                <div>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Info size={18} className="text-primary" />
                    Travel Tips
                  </h2>
                  <ul className="space-y-2.5">
                    {dest.travelTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm">
                        <CheckCircle2
                          size={15}
                          className="text-primary shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Do & Don't */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2 text-sm">
                      <CheckCircle2 size={15} />
                      Do's
                    </h3>
                    <ul className="space-y-2.5">
                      {dest.doList.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle2
                            size={13}
                            className="text-green-600 shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-red-600 dark:text-red-400 mb-3 flex items-center gap-2 text-sm">
                      <AlertCircle size={15} />
                      Don'ts
                    </h3>
                    <ul className="space-y-2.5">
                      {dest.dontList.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <AlertCircle
                            size={13}
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
            </Tabs>
          </div>

          {/* ── Sidebar ────────────────────────────────────────────────── */}
          <aside className="space-y-4">
            {/* Quick info card */}
            <Card className="border-border/60">
              <CardContent className="pt-5 space-y-4">
                <h3 className="font-bold text-sm">Quick Info</h3>
                <Separator />
                <div className="space-y-3 text-sm">
                  {[
                    { label: "State", value: dest.state, icon: MapPin },
                    { label: "Region", value: dest.region, icon: Map },
                    { label: "Best Time", value: dest.bestTime, icon: CalendarDays },
                    { label: "Language", value: dest.language, icon: Users },
                    { label: "Currency", value: dest.currency, icon: ShoppingBag },
                    { label: "Area", value: dest.area, icon: Camera },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex items-start justify-between gap-2">
                      <span className="text-muted-foreground flex items-center gap-1.5 shrink-0">
                        <Icon size={13} aria-hidden="true" />
                        {label}
                      </span>
                      <span className="font-medium text-right text-xs">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category tags */}
            <Card className="border-border/60">
              <CardContent className="pt-5 space-y-3">
                <h3 className="font-bold text-sm">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {dest.category.map((cat) => (
                    <Link
                      key={cat}
                      to="/domestic/destinations"
                      search={{ category: cat }}
                      className={buttonVariants({
                        variant: "secondary",
                        size: "sm",
                        className: "text-xs h-7 px-2.5",
                      })}
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tours CTA */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-5 space-y-3 text-center">
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MapPin size={22} aria-hidden="true" />
                </div>
                <p className="font-bold text-sm">
                  {dest.tourCount} tours to {dest.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  All-inclusive packages starting from ₹9,800/person.
                </p>
                <Link
                  to="/domestic/tours"
                  search={{ state: dest.state }}
                  className={buttonVariants({ className: "w-full gap-2", size: "sm" })}
                >
                  Browse tours
                  <ArrowRight size={13} />
                </Link>
              </CardContent>
            </Card>

            {/* Need help */}
            <Card className="border-border/60">
              <CardContent className="pt-5 space-y-2">
                <p className="font-bold text-sm">Need help planning?</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Call our {dest.name} specialists — Mon–Sat, 9 AM–7 PM IST.
                </p>
                <a
                  href="tel:+919876543210"
                  className={buttonVariants({
                    variant: "outline",
                    size: "sm",
                    className: "w-full gap-2 mt-1",
                  })}
                >
                  +91 98765 43210
                </a>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection({ dest }: { dest: DestinationDetail }) {
  return (
    <section className="relative h-[55vh] min-h-[380px] max-h-[600px] overflow-hidden">
      <img
        src={dest.heroImage}
        alt={dest.name}
        className="w-full h-full object-cover"
        loading="eager"
        width={1600}
        height={900}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />

      <div className="absolute bottom-0 left-0 right-0 px-4 pb-8 sm:pb-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {dest.category.map((cat) => (
                  <Badge
                    key={cat}
                    className="bg-white/20 text-white border-white/20 backdrop-blur-sm text-xs"
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
                {dest.name}
              </h1>
              <p className="text-white/80 mt-2 text-base sm:text-lg max-w-xl">
                {dest.tagline}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-white/70">
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} />
                  {dest.state}, {dest.region}
                </span>
                <span className="flex items-center gap-1.5">
                  <Star
                    size={14}
                    className="fill-amber-400 text-amber-400"
                  />
                  {dest.rating} · {dest.reviewCount.toLocaleString()} reviews
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={14} />
                  Best: {dest.bestTime}
                </span>
              </div>
            </div>

            <Link
              to="/domestic/tours"
              search={{ state: dest.state }}
              className={buttonVariants({
                size: "lg",
                className:
                  "bg-amber-500 hover:bg-amber-400 text-black font-semibold gap-2 shrink-0",
              })}
            >
              View {dest.tourCount} Tours
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Gallery Grid ─────────────────────────────────────────────────────────────

function GalleryGrid({ images, name }: { images: string[]; name: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Camera size={18} className="text-primary" />
        Gallery
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={cn(
              "relative overflow-hidden rounded-xl group",
              i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"
            )}
          >
            <img
              src={img}
              alt={`${name} photo ${i + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              width={400}
              height={400}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Seasons ──────────────────────────────────────────────────────────────────

function SeasonsSection({ seasons }: { seasons: Season[] }) {
  const colors: Record<Season["name"], string> = {
    Peak: "border-green-200 bg-green-50 dark:border-green-900/40 dark:bg-green-950/20",
    Shoulder: "border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/20",
    "Off-season": "border-blue-200 bg-blue-50 dark:border-blue-900/40 dark:bg-blue-950/20",
  };

  const textColors: Record<Season["name"], string> = {
    Peak: "text-green-800 dark:text-green-300",
    Shoulder: "text-amber-800 dark:text-amber-300",
    "Off-season": "text-blue-800 dark:text-blue-300",
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <CalendarDays size={18} className="text-primary" />
        Best Time to Visit
      </h2>
      <div className="grid sm:grid-cols-3 gap-3">
        {seasons.map((season) => {
          const Icon = season.icon;
          return (
            <div
              key={season.name}
              className={cn(
                "rounded-xl border p-4 space-y-2",
                colors[season.name]
              )}
            >
              <div className={cn("flex items-center gap-2", textColors[season.name])}>
                <Icon size={16} aria-hidden="true" />
                <span className="font-bold text-sm">{season.name}</span>
              </div>
              <p className={cn("text-xs font-semibold", textColors[season.name])}>
                {season.months}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {season.description}
              </p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Thermometer size={11} aria-hidden="true" />
                {season.temp}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Attraction Card ──────────────────────────────────────────────────────────

function AttractionCard({ attraction }: { attraction: Attraction }) {
  return (
    <Card className="group overflow-hidden border-border/60 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row">
        <div className="relative overflow-hidden sm:w-44 shrink-0 aspect-video sm:aspect-auto">
          <img
            src={attraction.image}
            alt={attraction.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            width={176}
            height={132}
          />
        </div>
        <CardContent className="p-4 flex-1">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-bold text-base">{attraction.name}</h3>
            <Badge variant="secondary" className="text-xs shrink-0">
              {attraction.type}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            {attraction.description}
          </p>
          {(attraction.timings || attraction.entryFee) && (
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              {attraction.timings && (
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {attraction.timings}
                </span>
              )}
              {attraction.entryFee && (
                <span className="flex items-center gap-1">
                  <ShoppingBag size={11} />
                  {attraction.entryFee}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
}

// ─── Tour Card (in destination context) ──────────────────────────────────────

function TourCardItem({ tour }: { tour: TourCard }) {
  return (
    <Link
      to="/domestic/tours/$tourId"
      params={{ tourId: tour.id }}
      className="group block rounded-xl overflow-hidden border border-border/60 hover:shadow-md transition-shadow"
    >
      <div className="relative overflow-hidden aspect-video">
        <img
          src={tour.image}
          alt={tour.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          width={400}
          height={225}
        />
        {tour.tag && (
          <Badge className="absolute top-3 left-3 bg-amber-500 text-black border-0 text-xs font-semibold">
            {tour.tag}
          </Badge>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-sm leading-snug mb-1">{tour.title}</h3>
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {tour.duration}
          </span>
          <span className="flex items-center gap-1">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            {tour.rating} ({tour.reviewCount})
          </span>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
          <div>
            <p className="text-xs text-muted-foreground">From</p>
            <p className="font-bold text-primary">
              ₹{tour.price.toLocaleString("en-IN")}
              <span className="text-xs font-normal text-muted-foreground">
                {" "}
                /person
              </span>
            </p>
          </div>
          <span className="text-xs text-primary font-medium flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
            View tour
            <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── How to Reach Card ────────────────────────────────────────────────────────

function HowToReachCard({ option }: { option: TravelOption }) {
  const Icon = option.icon;
  return (
    <div className="flex gap-4 p-4 rounded-xl border border-border/60 bg-muted/20">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon size={18} aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <p className="font-semibold text-sm">{option.mode}</p>
          <Badge variant="secondary" className="text-xs">
            {option.duration}
          </Badge>
          <span className="text-xs text-muted-foreground">from {option.from}</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {option.details}
        </p>
      </div>
    </div>
  );
}

// ─── Map placeholder ──────────────────────────────────────────────────────────

// Suppress unused import warning for Map icon used in sidebar
const Map = MapPin;