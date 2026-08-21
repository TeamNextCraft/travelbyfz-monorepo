// import { createFileRoute } from "@tanstack/react-router";
// import {
//   ArrowRight,
//   Bus,
//   CalendarDays,
//   Check,
//   ChevronRight,
//   Clock3,
//   Filter,
//   Heart,
//   MapPinned,
//   Phone,
//   Search,
//   ShieldCheck,
//   Sparkles,
//   Star,
//   UsersRound,
// } from "lucide-react";
// import { useState } from "react";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "#/components/ui/accordion";
// import { Badge } from "#/components/ui/badge";
// import { Button, buttonVariants } from "#/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "#/components/ui/card";
// import { Input } from "#/components/ui/input";
// import { Label } from "#/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "#/components/ui/select";
// import { Separator } from "#/components/ui/separator";
// import { Tabs, TabsList, TabsTrigger } from "#/components/ui/tabs";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "#/components/ui/tooltip";
// import { Navbar } from "#/components/common/domestic/nav-bar";

// export const Route = createFileRoute("/domestic/")({
//   component: DomesticTours,
// });

// const destinations = [
//   {
//     name: "Kashmir Valley",
//     duration: "5D / 4N",
//     price: "From ₹18,999",
//     image:
//       "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=900&q=80",
//     tags: ["Family", "Snow", "Houseboat"],
//     category: "family",
//     rating: 4.8,
//   },
//   {
//     name: "Kerala Backwaters",
//     duration: "4D / 3N",
//     price: "From ₹15,499",
//     image:
//       "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=80",
//     tags: ["Couples", "Nature", "Resort"],
//     category: "couples",
//     rating: 4.7,
//   },
//   {
//     name: "Goa Getaway",
//     duration: "3D / 2N",
//     price: "From ₹9,999",
//     image:
//       "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80",
//     tags: ["Friends", "Beach", "Weekend"],
//     category: "weekend",
//     rating: 4.6,
//   },
//   {
//     name: "Rajasthan Heritage",
//     duration: "6D / 5N",
//     price: "From ₹21,999",
//     image:
//       "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=900&q=80",
//     tags: ["Culture", "Desert", "Luxury"],
//     category: "culture",
//     rating: 4.9,
//   },
//   {
//     name: "Manali Adventure",
//     duration: "4D / 3N",
//     price: "From ₹12,999",
//     image:
//       "https://images.unsplash.com/photo-1626010448982-4d629b6b5fd2?auto=format&fit=crop&w=900&q=80",
//     tags: ["Adventure", "Snow", "Trekking"],
//     category: "adventure",
//     rating: 4.5,
//   },
//   {
//     name: "Andaman Islands",
//     duration: "5D / 4N",
//     price: "From ₹24,999",
//     image:
//       "https://images.unsplash.com/photo-1544144433-d50aff500b91?auto=format&fit=crop&w=900&q=80",
//     tags: ["Beach", "Diving", "Honeymoon"],
//     category: "couples",
//     rating: 4.8,
//   },
// ];

// const packageTypes = [
//   {
//     title: "Weekend Escapes",
//     description:
//       "Short trips for nearby hill stations, beaches, and city breaks. Perfect for quick rejuvenation.",
//     icon: Clock3,
//     features: ["2-3 Days", "Nearby Destinations", "Budget Friendly"],
//   },
//   {
//     title: "Family Holidays",
//     description:
//       "Hotel, transport, sightseeing, and relaxed schedules designed for families with all age groups.",
//     icon: UsersRound,
//     features: ["Kid Friendly", "Safe Hotels", "Flexible Timing"],
//   },
//   {
//     title: "Group Tours",
//     description:
//       "Fixed departures and custom plans for schools, offices, and clubs with dedicated coordinators.",
//     icon: Bus,
//     features: ["Bulk Discounts", "Dedicated Guide", "Custom Routes"],
//   },
// ];

// const inclusions = [
//   "Pickup and drop coordination",
//   "Hotel options by budget",
//   "Cab, tempo traveller, or bus support",
//   "Day-wise sightseeing plan",
//   "Meal plan guidance",
//   "On-trip assistance",
// ];

// const starLevels = [1, 2, 3, 4, 5];

// const faqs = [
//   {
//     question: "How do I book a domestic tour package?",
//     answer:
//       "Simply fill out the trip request form with your destination, travel dates, and group size. Our team will call you back within 2 hours with a customized quote and itinerary.",
//   },
//   {
//     question: "Can I customize the itinerary?",
//     answer:
//       "Absolutely. All our domestic packages are fully customizable. You can add or remove destinations, change hotels, modify meal plans, and adjust the duration as per your preference.",
//   },
//   {
//     question: "What is the cancellation policy?",
//     answer:
//       "Cancellations made 15 days before departure receive a 90% refund. 7-14 days before gets 70% refund. Less than 7 days gets 50% refund. No refund for same-day cancellations.",
//   },
//   {
//     question: "Are the hotels and transport safe for families?",
//     answer:
//       "Yes, we only partner with verified hotels and licensed transport operators. All vehicles are insured and drivers are background-verified. Family safety is our top priority.",
//   },
// ];

// const testimonials = [
//   {
//     name: "Priya Sharma",
//     location: "Delhi",
//     text: "Our Kashmir trip was perfectly organized. The houseboat stay in Dal Lake was magical. Highly recommended!",
//     rating: 5,
//     trip: "Kashmir Valley",
//   },
//   {
//     name: "Rahul Mehta",
//     location: "Mumbai",
//     text: "Booked a Goa weekend for our college reunion. Everything from transport to hotel was seamless. Great value for money.",
//     rating: 5,
//     trip: "Goa Getaway",
//   },
//   {
//     name: "Anita Desai",
//     location: "Bangalore",
//     text: "The Kerala backwaters tour was exactly what we needed for our anniversary. The resort was beautiful and the staff was very helpful.",
//     rating: 4,
//     trip: "Kerala Backwaters",
//   },
// ];

// const stats = [
//   { value: "120+", label: "Local trips planned" },
//   { value: "24/7", label: "Trip assistance" },
//   { value: "Custom", label: "Itinerary support" },
// ];

// function DomesticTours() {
//   const [activeCategory, setActiveCategory] = useState("all");

//   const filteredDestinations =
//     activeCategory === "all"
//       ? destinations
//       : destinations.filter((d) => d.category === activeCategory);

//   const scrollToSection = (id: string) => {
//     const el = document.getElementById(id);
//     if (el) {
//       el.scrollIntoView({ behavior: "smooth", block: "start" });
//     }
//   };

//   const categories = [
//     { value: "all", label: "All" },
//     { value: "family", label: "Family" },
//     { value: "couples", label: "Couples" },
//     { value: "weekend", label: "Weekend" },
//     { value: "culture", label: "Culture" },
//     { value: "adventure", label: "Adventure" },
//   ];

//   return (
//     <main className="min-h-screen bg-[linear-gradient(180deg,rgba(243,250,245,0.82)_0%,rgba(231,243,236,0.94)_48%,rgba(243,250,245,1)_100%)] ">
//       <Navbar />
//       <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 pt-5">
//         {/* Hero + Form */}
//         <section className="grid gap-5 lg:grid-cols-[1.16fr_0.84fr] lg:items-stretch">
//           <div className="relative min-h-[560px] overflow-hidden rounded-lg border border-white/55 shadow-[0_24px_70px_rgba(23,58,64,0.18)]">
//             <img
//               src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1500&q=80"
//               alt="Scenic mountain landscape"
//               className="absolute inset-0 h-full w-full object-cover"
//             />
//             <div className="absolute inset-0 bg-linear-to-r from-[#0e3036]/92 via-[#0e3036]/58 to-[#0e3036]/16" />
//             <div className="relative flex min-h-[560px] flex-col justify-between p-6 text-white sm:p-8 lg:p-10">
//               <div>
//                 <Badge
//                   variant="secondary"
//                   className="bg-white/20 text-white border-white/30 backdrop-blur-sm hover:bg-white/30"
//                 >
//                   <Sparkles size={12} className="mr-1" />
//                   Domestic tours
//                 </Badge>
//                 <h1 className="display-title mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
//                   Local trips planned around real dates, budgets, and group
//                   sizes.
//                 </h1>
//                 <p className="mt-5 max-w-2xl text-base leading-7 text-white/82 sm:text-lg">
//                   Book family holidays, weekend getaways, student tours, office
//                   trips, and custom sightseeing plans with transport and stay
//                   options handled together.
//                 </p>
//               </div>

//               <div className="mt-8 grid gap-3 sm:grid-cols-3">
//                 {stats.map(({ value, label }) => (
//                   <div
//                     key={label}
//                     className="rounded-lg border border-white/20 bg-white/14 p-4 backdrop-blur-sm"
//                   >
//                     <p className="text-2xl font-extrabold">{value}</p>
//                     <p className="mt-1 text-xs font-bold uppercase text-white/72">
//                       {label}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <Card
//             id="request"
//             className="island-shell rounded-lg bg-transparent p-5"
//           >
//             <CardHeader className="px-0 pb-4">
//               <Badge
//                 variant="outline"
//                 className="w-fit mb-2 border-[var(--line)] text-[var(--sea-ink-soft)]"
//               >
//                 Plan a local trip
//               </Badge>
//               <CardTitle className="display-title text-3xl">
//                 Get a quick package estimate
//               </CardTitle>
//               <CardDescription className="leading-6 text-[var(--sea-ink-soft)]">
//                 Capture the details the client needs before quoting a domestic
//                 tour.
//               </CardDescription>
//             </CardHeader>

//             <CardContent className="grid gap-4 px-0">
//               <div className="grid gap-2">
//                 <Label
//                   htmlFor="destination"
//                   className="text-sm font-bold text-[var(--sea-ink)]"
//                 >
//                   Where do you want to go?
//                 </Label>
//                 <div className="relative">
//                   <Search
//                     size={17}
//                     aria-hidden="true"
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
//                   />
//                   <Input
//                     id="destination"
//                     className="pl-10 rounded-lg border-[var(--line)] bg-white/72 placeholder:text-[var(--sea-ink-soft)]"
//                     placeholder="Kashmir, Goa, Kerala..."
//                   />
//                 </div>
//               </div>

//               <div className="grid gap-4 sm:grid-cols-2">
//                 <div className="grid gap-2">
//                   <Label
//                     htmlFor="travel-date"
//                     className="text-sm font-bold text-[var(--sea-ink)]"
//                   >
//                     Travel date
//                   </Label>
//                   <div className="relative">
//                     <CalendarDays
//                       size={17}
//                       aria-hidden="true"
//                       className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
//                     />
//                     <Input
//                       id="travel-date"
//                       type="date"
//                       className="pl-10 rounded-lg border-[var(--line)] bg-white/72"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid gap-2">
//                   <Label
//                     htmlFor="travellers"
//                     className="text-sm font-bold text-[var(--sea-ink)]"
//                   >
//                     Travellers
//                   </Label>
//                   <div className="relative">
//                     <UsersRound
//                       size={17}
//                       aria-hidden="true"
//                       className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
//                     />
//                     <Input
//                       id="travellers"
//                       type="number"
//                       min="1"
//                       className="pl-10 rounded-lg border-[var(--line)] bg-white/72"
//                       placeholder="4"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="grid gap-2">
//                 <Label
//                   htmlFor="trip-type"
//                   className="text-sm font-bold text-[var(--sea-ink)]"
//                 >
//                   Trip type
//                 </Label>
//                 <Select defaultValue="family">
//                   <SelectTrigger className="rounded-lg border-[var(--line)] bg-white/72">
//                     <SelectValue placeholder="Select trip type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="family">Family holiday</SelectItem>
//                     <SelectItem value="weekend">Weekend getaway</SelectItem>
//                     <SelectItem value="group">Group tour</SelectItem>
//                     <SelectItem value="custom">Custom sightseeing</SelectItem>
//                     <SelectItem value="honeymoon">Honeymoon</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="grid gap-2">
//                 <Label
//                   htmlFor="budget"
//                   className="text-sm font-bold text-[var(--sea-ink)]"
//                 >
//                   Budget range (per person)
//                 </Label>
//                 <Select defaultValue="any">
//                   <SelectTrigger className="rounded-lg border-[var(--line)] bg-white/72">
//                     <SelectValue placeholder="Select budget" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="any">Any budget</SelectItem>
//                     <SelectItem value="under10k">Under ₹10,000</SelectItem>
//                     <SelectItem value="10to20k">₹10,000 - ₹20,000</SelectItem>
//                     <SelectItem value="20to30k">₹20,000 - ₹30,000</SelectItem>
//                     <SelectItem value="above30k">Above ₹30,000</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <TooltipProvider>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <a
//                       href="tel:+919000000000"
//                       className={buttonVariants({
//                         className:
//                           "mt-1 h-11 w-full font-extrabold no-underline gap-2",
//                       })}
//                     >
//                       <Phone size={17} aria-hidden="true" />
//                       Request callback
//                     </a>
//                   </TooltipTrigger>
//                   <TooltipContent>
//                     <p>We will call you within 2 hours</p>
//                   </TooltipContent>
//                 </Tooltip>
//               </TooltipProvider>

//               <p className="text-center text-xs text-[var(--sea-ink-soft)]">
//                 Or WhatsApp us at{" "}
//                 <a
//                   href="https://wa.me/919000000000"
//                   className="underline underline-offset-2 hover:text-[var(--sea-ink)]"
//                 >
//                   +91 90000 00000
//                 </a>
//               </p>
//             </CardContent>
//           </Card>
//         </section>

//         {/* Destinations */}
//         <section id="destinations" className="py-6">
//           <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
//             <div>
//               <Badge
//                 variant="outline"
//                 className="mb-2 border-[var(--line)] text-[var(--sea-ink-soft)]"
//               >
//                 <Filter size={12} className="mr-1" />
//                 Popular local spots
//               </Badge>
//               <h2 className="display-title mt-2 text-3xl font-bold text-[var(--sea-ink)]">
//                 Domestic destinations ready to quote
//               </h2>
//             </div>
//             <Button
//               variant="outline"
//               className="w-fit bg-white/78 font-bold gap-2"
//               onClick={() => scrollToSection("request")}
//             >
//               Build custom trip
//               <ArrowRight size={16} />
//             </Button>
//           </div>

//           <Tabs
//             defaultValue="all"
//             className="mb-6"
//             onValueChange={setActiveCategory}
//           >
//             <TabsList className="bg-white/60 h-auto flex-wrap gap-1 p-1">
//               {categories.map((cat) => (
//                 <TabsTrigger
//                   key={cat.value}
//                   value={cat.value}
//                   className="text-xs font-bold data-[state=active]:bg-[var(--palm)] data-[state=active]:text-white"
//                 >
//                   {cat.label}
//                 </TabsTrigger>
//               ))}
//             </TabsList>
//           </Tabs>

//           <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
//             {filteredDestinations.map((destination) => (
//               <Card
//                 key={destination.name}
//                 className="feature-card gap-0 overflow-hidden rounded-lg border-[var(--line)] py-0 group"
//               >
//                 <div className="aspect-[4/3] overflow-hidden relative">
//                   <img
//                     src={destination.image}
//                     alt={destination.name}
//                     className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
//                   />
//                   <div className="absolute top-3 right-3">
//                     <Badge
//                       variant="secondary"
//                       className="bg-white/90 text-[var(--sea-ink)] font-bold backdrop-blur-sm"
//                     >
//                       <Star
//                         size={12}
//                         className="mr-1 fill-yellow-400 text-yellow-400"
//                       />
//                       {destination.rating}
//                     </Badge>
//                   </div>
//                   <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-3">
//                     <p className="text-white font-bold text-sm">
//                       {destination.duration}
//                     </p>
//                   </div>
//                 </div>
//                 <CardContent className="p-4">
//                   <div className="mb-3 flex items-center justify-between gap-2">
//                     <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[var(--palm)]">
//                       <MapPinned size={14} aria-hidden="true" />
//                       {destination.duration}
//                     </span>
//                     <span className="text-sm font-extrabold text-[var(--sea-ink)]">
//                       {destination.price}
//                     </span>
//                   </div>
//                   <CardTitle className="text-xl font-extrabold text-[var(--sea-ink)]">
//                     {destination.name}
//                   </CardTitle>
//                   <div className="mt-4 flex flex-wrap gap-2">
//                     {destination.tags.map((tag) => (
//                       <Badge
//                         key={tag}
//                         variant="outline"
//                         className="rounded-md border-[var(--chip-line)] bg-white/70 px-2 py-1 text-xs font-bold text-[var(--sea-ink-soft)] hover:bg-white"
//                       >
//                         {tag}
//                       </Badge>
//                     ))}
//                   </div>
//                   <Button
//                     variant="ghost"
//                     className="mt-4 w-full font-bold text-[var(--palm)] hover:text-[var(--palm)] hover:bg-[rgba(79,184,178,0.1)] gap-1"
//                     onClick={() => scrollToSection("request")}
//                   >
//                     Get quote
//                     <ChevronRight size={16} />
//                   </Button>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </section>

//         {/* Packages + Inclusions */}
//         <section
//           id="packages"
//           className="grid gap-5 py-6 lg:grid-cols-[0.82fr_1.18fr]"
//         >
//           <Card className="island-shell rounded-lg bg-transparent p-5">
//             <CardHeader className="px-0 pb-4">
//               <Badge
//                 variant="outline"
//                 className="mb-2 w-fit border-[var(--line)] text-[var(--sea-ink-soft)]"
//               >
//                 What is included
//               </Badge>
//               <CardTitle className="display-title text-3xl">
//                 Everything needed for a clean domestic booking flow
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="grid gap-3 px-0">
//               {inclusions.map((item) => (
//                 <div
//                   key={item}
//                   className="flex items-center gap-3 rounded-lg border border-[var(--line)] bg-white/62 p-3 text-sm font-bold text-[var(--sea-ink)] transition-colors hover:bg-white/80"
//                 >
//                   <span className="grid size-7 place-items-center rounded-md bg-[var(--palm)] text-white shrink-0">
//                     <Check size={16} aria-hidden="true" />
//                   </span>
//                   {item}
//                 </div>
//               ))}
//             </CardContent>
//           </Card>

//           <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
//             {packageTypes.map((item) => {
//               const Icon = item.icon;

//               return (
//                 <Card
//                   key={item.title}
//                   className="feature-card rounded-lg border-[var(--line)] p-5 hover:shadow-md transition-shadow"
//                 >
//                   <CardContent className="px-0">
//                     <div className="grid size-11 place-items-center rounded-lg bg-[rgba(79,184,178,0.16)] text-[var(--sea-ink)]">
//                       <Icon size={22} aria-hidden="true" />
//                     </div>
//                     <CardTitle className="mt-5 text-xl font-extrabold text-[var(--sea-ink)]">
//                       {item.title}
//                     </CardTitle>
//                     <CardDescription className="mt-3 leading-6 text-[var(--sea-ink-soft)]">
//                       {item.description}
//                     </CardDescription>
//                     <div className="mt-4 flex flex-wrap gap-2">
//                       {item.features.map((feature) => (
//                         <Badge
//                           key={feature}
//                           variant="secondary"
//                           className="bg-[rgba(79,184,178,0.12)] text-[var(--palm)] font-bold text-xs"
//                         >
//                           {feature}
//                         </Badge>
//                       ))}
//                     </div>
//                   </CardContent>
//                 </Card>
//               );
//             })}
//           </div>
//         </section>

//         {/* Testimonials */}
//         <section className="py-6">
//           <div className="mb-5">
//             <Badge
//               variant="outline"
//               className="mb-2 border-[var(--line)] text-[var(--sea-ink-soft)]"
//             >
//               <Heart size={12} className="mr-1" />
//               Customer stories
//             </Badge>
//             <h2 className="display-title text-3xl font-bold text-[var(--sea-ink)]">
//               What travellers say about us
//             </h2>
//           </div>
//           <div className="grid gap-4 md:grid-cols-3">
//             {testimonials.map((t) => (
//               <Card
//                 key={t.name}
//                 className="feature-card rounded-lg border-[var(--line)] p-5"
//               >
//                 <CardContent className="px-0">
//                   <div className="flex gap-1 mb-3">
//                     {starLevels.map((starLevel) => (
//                       <Star
//                         key={`${t.name}-star-${starLevel}`}
//                         size={14}
//                         className={
//                           starLevel <= t.rating
//                             ? "fill-yellow-400 text-yellow-400"
//                             : "text-gray-300"
//                         }
//                       />
//                     ))}
//                   </div>
//                   <p className="text-sm leading-6 text-[var(--sea-ink)] mb-4">
//                     "{t.text}"
//                   </p>
//                   <Separator className="mb-4" />
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="font-bold text-sm text-[var(--sea-ink)]">
//                         {t.name}
//                       </p>
//                       <p className="text-xs text-[var(--sea-ink-soft)]">
//                         {t.location}
//                       </p>
//                     </div>
//                     <Badge
//                       variant="outline"
//                       className="text-xs border-[var(--chip-line)]"
//                     >
//                       {t.trip}
//                     </Badge>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </section>

//         {/* FAQ */}
//         <section id="faq" className="py-6">
//           <div className="mb-5">
//             <Badge
//               variant="outline"
//               className="mb-2 border-[var(--line)] text-[var(--sea-ink-soft)]"
//             >
//               Common questions
//             </Badge>
//             <h2 className="display-title text-3xl font-bold text-[var(--sea-ink)]">
//               Frequently asked questions
//             </h2>
//           </div>
//           <Accordion type="single" collapsible className="w-full">
//             {faqs.map((faq, index) => (
//               <AccordionItem
//                 key={faq.question}
//                 value={`item-${index}`}
//                 className="border-[var(--line)] bg-white/40 rounded-lg px-4 mb-2"
//               >
//                 <AccordionTrigger className="text-sm font-bold text-[var(--sea-ink)] hover:no-underline">
//                   {faq.question}
//                 </AccordionTrigger>
//                 <AccordionContent className="text-sm leading-6 text-[var(--sea-ink-soft)] pb-4">
//                   {faq.answer}
//                 </AccordionContent>
//               </AccordionItem>
//             ))}
//           </Accordion>
//         </section>

//         {/* Trust badges */}
//         <section className="grid gap-4 pb-8 md:grid-cols-3">
//           {[
//             ["Trusted vendors", ShieldCheck],
//             ["Rated itineraries", Star],
//             ["Flexible planning", CalendarDays],
//           ].map(([label, Icon]) => (
//             <Card
//               key={label as string}
//               className="island-shell rounded-lg bg-transparent p-5 hover:shadow-sm transition-shadow"
//             >
//               <CardContent className="flex items-center gap-4 px-0">
//                 <div className="grid size-11 place-items-center rounded-lg bg-white/70">
//                   <Icon size={22} aria-hidden="true" />
//                 </div>
//                 <div>
//                   <p className="font-extrabold text-[var(--sea-ink)]">
//                     {label as string}
//                   </p>
//                   <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
//                     Useful for quote confidence and repeat customers.
//                   </p>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </section>
//       </div>
//     </main>
//   );
// }

// src/routes/index.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  MapPin,
  Star,
  Clock,
  Users,
  Phone,
  Mail,
  ChevronDown,
  Shield,
  Headphones,
  Wallet,
  Award,
  Search,
  Calendar,
  MessageSquare,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Button, buttonVariants } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Badge } from "#/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "#/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "#/components/ui/accordion";
import { Separator } from "#/components/ui/separator";
import { Textarea } from "#/components/ui/textarea";
import { Label } from "#/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import { cn } from "#/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tour = {
  id: string;
  title: string;
  destination: string;
  state: string;
  duration: string;
  price: number;
  rating: number;
  reviewCount: number;
  category: "Adventure" | "Cultural" | "Religious" | "Beach" | "Hill Station";
  image: string;
  tag?: string;
};

type Destination = {
  name: string;
  state: string;
  tourCount: number;
  image: string;
};

type Testimonial = {
  name: string;
  location: string;
  rating: number;
  text: string;
  tour: string;
  avatar: string;
};

// ─── Static Data (replace with DB loader) ─────────────────────────────────────

const FEATURED_TOURS: Tour[] = [
  {
    id: "kerala-backwaters",
    title: "Kerala Backwaters & Spice Trail",
    destination: "Alleppey",
    state: "Kerala",
    duration: "5 Days / 4 Nights",
    price: 18500,
    rating: 4.9,
    reviewCount: 312,
    category: "Beach",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80",
    tag: "Best Seller",
  },
  {
    id: "rajasthan-royals",
    title: "Royal Rajasthan Heritage Tour",
    destination: "Jaipur → Jodhpur → Udaipur",
    state: "Rajasthan",
    duration: "7 Days / 6 Nights",
    price: 24999,
    rating: 4.8,
    reviewCount: 198,
    category: "Cultural",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80",
    tag: "Popular",
  },
  {
    id: "spiti-valley",
    title: "Spiti Valley Expedition",
    destination: "Kaza",
    state: "Himachal Pradesh",
    duration: "8 Days / 7 Nights",
    price: 32000,
    rating: 4.7,
    reviewCount: 145,
    category: "Adventure",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80",
    tag: "New",
  },
  {
    id: "char-dham",
    title: "Char Dham Yatra",
    destination: "Badrinath · Kedarnath · Gangotri · Yamunotri",
    state: "Uttarakhand",
    duration: "12 Days / 11 Nights",
    price: 42000,
    rating: 4.9,
    reviewCount: 421,
    category: "Religious",
    image: "https://images.unsplash.com/photo-1609766418204-94aae0ecfdfc?w=600&q=80",
    tag: "Best Seller",
  },
  {
    id: "coorg-retreat",
    title: "Coorg Coffee & Nature Retreat",
    destination: "Madikeri",
    state: "Karnataka",
    duration: "4 Days / 3 Nights",
    price: 14500,
    rating: 4.6,
    reviewCount: 87,
    category: "Hill Station",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80",
  },
  {
    id: "andaman-escape",
    title: "Andaman Island Escape",
    destination: "Port Blair · Havelock",
    state: "Andaman & Nicobar",
    duration: "6 Days / 5 Nights",
    price: 38000,
    rating: 4.8,
    reviewCount: 230,
    category: "Beach",
    image: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600&q=80",
  },
];

const DESTINATIONS: Destination[] = [
  { name: "Goa", state: "Goa", tourCount: 24, image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&q=80" },
  { name: "Manali", state: "Himachal Pradesh", tourCount: 18, image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&q=80" },
  { name: "Jaipur", state: "Rajasthan", tourCount: 31, image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&q=80" },
  { name: "Kerala", state: "Kerala", tourCount: 27, image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&q=80" },
  { name: "Varanasi", state: "Uttar Pradesh", tourCount: 15, image: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=400&q=80" },
  { name: "Leh Ladakh", state: "Ladakh", tourCount: 12, image: "https://images.unsplash.com/photo-1597040663342-45b6af3d91a5?w=400&q=80" },
];

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Priya Mehta",
    location: "Mumbai, Maharashtra",
    rating: 5,
    text: "The Kerala backwaters trip was absolutely magical. Every detail was taken care of — the houseboat stay, local cuisine, and the sunset views were beyond our expectations.",
    tour: "Kerala Backwaters & Spice Trail",
    avatar: "PM",
  },
  {
    name: "Rajan & Sunita Iyer",
    location: "Bangalore, Karnataka",
    rating: 5,
    text: "First time doing Char Dham Yatra and we couldn't have asked for a better experience. The team handled everything from transport to temple darshan queues perfectly.",
    tour: "Char Dham Yatra",
    avatar: "RI",
  },
  {
    name: "Arjun Sharma",
    location: "Delhi",
    rating: 5,
    text: "Spiti Valley was on my bucket list for years. The itinerary was perfectly paced, accommodation was cozy, and our guide Tenzing was exceptional. 10/10 would go again.",
    tour: "Spiti Valley Expedition",
    avatar: "AS",
  },
];

const FAQ_ITEMS = [
  {
    q: "How do I book a tour?",
    a: "Browse our tours, click 'Book Now' on any package, fill in your travel dates and guest details, and complete the payment. You'll receive a confirmation email instantly with your itinerary.",
  },
  {
    q: "What's included in the tour price?",
    a: "All our packages clearly list inclusions — typically accommodation, transport (AC vehicles), breakfast, sightseeing with entry fees, and a dedicated tour guide. Flights, personal expenses, and lunches/dinners (unless stated) are excluded.",
  },
  {
    q: "Can I customize a tour package?",
    a: "Absolutely! Use the 'Request a trip' section below or contact us directly. We build fully custom itineraries for families, corporates, and honeymoon couples at no extra planning fee.",
  },
  {
    q: "What is the cancellation policy?",
    a: "Cancellations made 15+ days before departure receive a full refund. 7–14 days: 50% refund. Under 7 days: no refund. Travel insurance is strongly recommended and available as an add-on.",
  },
  {
    q: "Do you offer group discounts?",
    a: "Yes! Groups of 6+ get 10% off, 10+ get 15% off, and 20+ get custom pricing. Contact us for corporate or school group packages.",
  },
  {
    q: "Is GST included in the prices shown?",
    a: "Prices shown are exclusive of GST. Applicable GST (5% for tour packages) is added at checkout. You'll see the full breakup before payment.",
  },
];

const CATEGORIES = ["All", "Beach", "Adventure", "Cultural", "Religious", "Hill Station"] as const;
type Category = (typeof CATEGORIES)[number];

const CATEGORY_BADGE_COLORS: Record<Tour["category"], string> = {
  Beach: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Adventure: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  Cultural: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  Religious: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  "Hill Station": "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
};

// ─── Route ────────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/domestic/")({
  // When you hook up a DB, replace static data with:
  // loader: async () => ({
  //   featuredTours: await getFeaturedTours(),
  //   destinations: await getPopularDestinations(),
  // }),
  component: HomePage,
});

// ─── Page ─────────────────────────────────────────────────────────────────────

function HomePage() {
  return (
    <main className="flex flex-col">
      <HeroSection />
      <TrustBar />
      <DestinationsSection />
      <PackagesSection />
      <WhyUsSection />
      <TestimonialsSection />
      <FaqSection />
      <RequestTripSection />
    </main>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");

  const scrollToPackages = () =>
    document.getElementById("packages")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative min-h-[92dvh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600&q=80')",
        }}
        aria-hidden="true"
      />
      {/* Gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 text-center text-white">
        <Badge className="mb-5 bg-white/15 text-white border-white/20 backdrop-blur-sm hover:bg-white/20">
          ✈️ 500+ Domestic Tours Across India
        </Badge>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-4">
          Discover the Soul of{" "}
          <span className="text-amber-400">Incredible India</span>
        </h1>

        <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10">
          Handcrafted tour packages to every corner of India — from Himalayan
          peaks to tropical beaches. No hidden costs. Just unforgettable journeys.
        </p>

        {/* Search bar */}
        <div className="flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60"
              aria-hidden="true"
            />
            <Input
              placeholder="Search destinations, tours..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-transparent border-0 text-white placeholder:text-white/50 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <Button
            size="lg"
            className="bg-amber-500 hover:bg-amber-400 text-black font-semibold shrink-0"
            onClick={scrollToPackages}
          >
            Explore Tours
            <ArrowRight size={16} className="ml-1" aria-hidden="true" />
          </Button>
        </div>

        {/* Popular tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          <span className="text-white/50 text-sm">Popular:</span>
          {["Goa", "Kerala", "Manali", "Rajasthan", "Char Dham", "Andaman"].map(
            (place) => (
              <button
                key={place}
                onClick={scrollToPackages}
                className="text-sm text-white/80 hover:text-amber-400 underline underline-offset-2 transition-colors"
              >
                {place}
              </button>
            )
          )}
        </div>
      </div>

      {/* Scroll hint */}
      <button
        onClick={scrollToPackages}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 hover:text-white animate-bounce transition-colors"
        aria-label="Scroll down"
      >
        <ChevronDown size={28} />
      </button>
    </section>
  );
}

// ─── Trust Bar ────────────────────────────────────────────────────────────────

function TrustBar() {
  const stats = [
    { icon: Users, label: "Happy Travellers", value: "12,000+" },
    { icon: MapPin, label: "Destinations", value: "80+" },
    { icon: Star, label: "Average Rating", value: "4.8 / 5" },
    { icon: Award, label: "Years of Experience", value: "10+" },
  ];

  return (
    <div className="border-y bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-5">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-center gap-3 justify-center sm:justify-start"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon size={18} aria-hidden="true" />
              </div>
              <div>
                <p className="text-lg font-bold leading-none">{value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Destinations ─────────────────────────────────────────────────────────────

function DestinationsSection() {
  return (
    <section id="destinations" className="py-20 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">
              Explore India
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Popular Destinations
            </h2>
            <p className="text-muted-foreground mt-2 max-w-md">
              From misty mountains to sun-soaked shores — pick your dream
              destination.
            </p>
          </div>
          <Link
            to="/domestic/destinations"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            View all destinations
            <ChevronRight size={14} className="ml-1" aria-hidden="true" />
          </Link>
        </div>

        {/* Grid — 2 large + 4 small */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {DESTINATIONS.map((dest, i) => (
            <Link
              key={dest.name}
              to="/domestic/destinations/$slug"
              params={{ slug: dest.name.toLowerCase().replace(/\s+/g, "-") }}
              className={cn(
                "group relative overflow-hidden rounded-2xl",
                i < 2 ? "row-span-1 md:row-span-2 aspect-[3/4]" : "aspect-[4/3]"
              )}
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <p className="font-bold text-lg leading-tight">{dest.name}</p>
                <p className="text-white/70 text-sm">{dest.state}</p>
                <Badge className="mt-2 bg-white/15 text-white border-white/20 text-xs">
                  {dest.tourCount} tours
                </Badge>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Packages ─────────────────────────────────────────────────────────────────

function PackagesSection() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const filtered =
    activeCategory === "All"
      ? FEATURED_TOURS
      : FEATURED_TOURS.filter((t) => t.category === activeCategory);

  return (
    <section id="packages" className="py-20 px-4 bg-muted/30">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">
            Curated For You
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Tour Packages
          </h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            All-inclusive packages with no surprises — just great travel.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/domestic/tours"
            className={buttonVariants({ size: "lg", variant: "outline" })}
          >
            Browse all tours
            <ArrowRight size={16} className="ml-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function TourCard({ tour }: { tour: Tour }) {
  return (
    <Card className="group overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow duration-300 border-border/60">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[16/10]">
        <img
          src={tour.image}
          alt={tour.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {tour.tag && (
          <Badge className="absolute top-3 left-3 bg-amber-500 text-black border-0 font-semibold text-xs">
            {tour.tag}
          </Badge>
        )}
        <Badge
          className={cn(
            "absolute top-3 right-3 border-0 text-xs font-medium",
            CATEGORY_BADGE_COLORS[tour.category]
          )}
        >
          {tour.category}
        </Badge>
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-base leading-snug">{tour.title}</h3>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground text-sm">
          <MapPin size={13} className="shrink-0" aria-hidden="true" />
          <span className="truncate">{tour.destination}</span>
        </div>
      </CardHeader>

      <CardContent className="pb-3 flex-1">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock size={13} aria-hidden="true" />
            {tour.duration}
          </span>
          <span className="flex items-center gap-1">
            <Star
              size={13}
              className="fill-amber-400 text-amber-400"
              aria-hidden="true"
            />
            {tour.rating}{" "}
            <span className="text-muted-foreground">({tour.reviewCount})</span>
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-3 border-t border-border/60">
        <div>
          <p className="text-xs text-muted-foreground">Starting from</p>
          <p className="text-xl font-bold text-primary">
            ₹{tour.price.toLocaleString("en-IN")}
            <span className="text-sm font-normal text-muted-foreground">
              {" "}
              /person
            </span>
          </p>
        </div>
        <Link
          to="/domestic/tours/$tourId"
          params={{ tourId: tour.id }}
          className={buttonVariants({ size: "sm" })}
        >
          View tour
        </Link>
      </CardFooter>
    </Card>
  );
}

// ─── Why Us ───────────────────────────────────────────────────────────────────

function WhyUsSection() {
  const features = [
    {
      icon: Shield,
      title: "Safe & Verified",
      desc: "Every tour is safety-audited. All our guides, drivers, and hotels are vetted and certified.",
    },
    {
      icon: Wallet,
      title: "No Hidden Costs",
      desc: "What you see is what you pay. Our detailed inclusions/exclusions list leaves nothing ambiguous.",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      desc: "A dedicated travel manager is reachable by call or WhatsApp throughout your journey.",
    },
    {
      icon: Users,
      title: "Small Group Sizes",
      desc: "Max 12 travellers per batch, ensuring personal attention and a better experience for all.",
    },
  ];

  return (
    <section className="py-20 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left — image stack */}
          <div className="relative hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1543158181-e6f9f6712055?w=600&q=80"
              alt="Happy travellers on a tour"
              className="w-full rounded-2xl object-cover aspect-[4/3]"
              loading="lazy"
            />
            {/* Floating stat card */}
            <div className="absolute -bottom-5 -right-5 bg-background rounded-xl shadow-lg border p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                <Star size={18} aria-hidden="true" />
              </div>
              <div>
                <p className="font-bold text-sm">Rated 4.8/5</p>
                <p className="text-xs text-muted-foreground">
                  by 12,000+ travellers
                </p>
              </div>
            </div>
          </div>

          {/* Right — features */}
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">
              Why Choose Us
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Travel with confidence, <br /> not guesswork
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              We've helped 12,000+ Indians take their dream trips — here's what
              makes us different.
            </p>

            <div className="grid sm:grid-cols-2 gap-5">
              {features.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5">
                    <Icon size={18} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function TestimonialsSection() {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">
            Real Stories
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            What our travellers say
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <Card
              key={t.name}
              className="flex flex-col justify-between p-6 border-border/60"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="fill-amber-400 text-amber-400"
                    aria-hidden="true"
                  />
                ))}
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground flex-1">
                "{t.text}"
              </p>

              <div className="mt-5 pt-4 border-t border-border/60 flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.location}</p>
                </div>
                <Badge
                  variant="secondary"
                  className="ml-auto text-xs shrink-0 hidden sm:flex"
                >
                  {t.tour.split(" ").slice(0, 2).join(" ")}…
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

function FaqSection() {
  return (
    <section id="faq" className="py-20 px-4">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">
            Got Questions?
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-2">
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border border-border/60 rounded-xl px-4 overflow-hidden"
            >
              <AccordionTrigger className="text-sm font-semibold text-left hover:no-underline py-4">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pb-4 leading-relaxed">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

// ─── Request Trip ─────────────────────────────────────────────────────────────

function RequestTripSection() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Wire up to your createServerFn action here
    setSubmitted(true);
  };

  return (
    <section id="request" className="py-20 px-4 bg-muted/30">
      <div className="mx-auto max-w-7xl">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left */}
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">
              Custom Trips
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Want something <br /> tailored for you?
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Tell us your dream destination, budget, and dates — we'll craft a
              personalised itinerary and get back within 24 hours.
            </p>

            <div className="space-y-4">
              {[
                { icon: Phone, label: "Call us", value: "+91 98765 43210" },
                { icon: Mail, label: "Email us", value: "hello@wanderindia.com" },
                { icon: MessageSquare, label: "WhatsApp", value: "+91 98765 43210" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon size={16} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-semibold">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Form */}
          <div className="bg-background rounded-2xl border border-border/60 p-6 shadow-sm">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <CheckCircle2 size={28} aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold">Request Sent!</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Our travel expert will reach out within 24 hours to craft your
                  perfect itinerary.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => setSubmitted(false)}
                >
                  Submit another
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-base font-bold mb-1">Request a Trip</h3>
                <Separator />

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs">
                      Your name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Rahul Sharma"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs">
                      Phone / WhatsApp
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="destination" className="text-xs">
                    Where do you want to go?
                  </Label>
                  <Input
                    id="destination"
                    placeholder="e.g. Kerala, Ladakh, Rajasthan..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="travel-date" className="text-xs">
                      Travel date
                    </Label>
                    <Input id="travel-date" type="date" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="guests" className="text-xs">
                      No. of guests
                    </Label>
                    <Select>
                      <SelectTrigger id="guests">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {["1", "2", "3-5", "6-10", "10+"].map((n) => (
                          <SelectItem key={n} value={n}>
                            {n} {n === "1" ? "person" : "people"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message" className="text-xs">
                    Anything specific? (optional)
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Budget, preferences, special occasions..."
                    rows={3}
                    className="resize-none"
                  />
                </div>

                <Button type="submit" className="w-full gap-2">
                  <Calendar size={15} aria-hidden="true" />
                  Send my request
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  We reply within 24 hours. No spam, ever.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}