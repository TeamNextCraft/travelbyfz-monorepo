import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  HeartHandshake,
  MapPin,
  MessageCircle,
  Phone,
  Quote,
  Star,
  Users,
} from "lucide-react";

import { Badge } from "#/components/ui/badge";
import { buttonVariants } from "#/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card";

export const Route = createFileRoute("/hajj-umrah/gallery")({
  component: HajjUmrahGalleryPage,
});

const galleryImages = [
  {
    id: "img-1",
    src: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80",
    title: "Arrival in Makkah",
    caption:
      "The beginning of a sacred journey, marked by awe, gratitude, and quiet preparation.",
    location: "Makkah",
    span: "large",
  },
  {
    id: "img-2",
    src: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80",
    title: "Moments near the Haram",
    caption:
      "Pilgrims gathering in devotion, guided with care and practical support throughout the stay.",
    location: "Masjid al-Haram",
    span: "medium",
  },
  {
    id: "img-3",
    src: "https://images.unsplash.com/photo-1577433422003-5d3fbf4ebfa7?auto=format&fit=crop&w=1200&q=80",
    title: "Ramadan atmosphere",
    caption:
      "A spiritually intense and unforgettable experience during one of the most meaningful travel periods.",
    location: "Makkah",
    span: "medium",
  },
  {
    id: "img-4",
    src: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
    title: "Family and group journeys",
    caption:
      "Many pilgrims travel as families or communities, making comfort, pacing, and support especially important.",
    location: "Group travel",
    span: "small",
  },
  {
    id: "img-5",
    src: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1200&q=80",
    title: "Prayer and reflection",
    caption:
      "The journey is not just logistical planning, but a deeply personal and spiritual experience.",
    location: "Sacred spaces",
    span: "small",
  },
  {
    id: "img-6",
    src: "https://images.unsplash.com/photo-1615886753866-79396abc4a5e?auto=format&fit=crop&w=1200&q=80",
    title: "Guided movement",
    caption:
      "Good coordination helps pilgrims focus on worship instead of confusion and travel stress.",
    location: "Pilgrim support",
    span: "large",
  },
];

const testimonials = [
  {
    name: "Fatima Shaikh",
    city: "Surat",
    package: "Ramadan Umrah",
    rating: "5.0",
    quote:
      "Everything was handled with calmness and care. We felt supported from documentation to return, and that gave us peace of mind throughout the journey.",
    initials: "FS",
  },
  {
    name: "Yusuf Memon",
    city: "Bhuj",
    package: "Custom Family Group",
    rating: "5.0",
    quote:
      "We travelled with elders and children, and the pacing mattered a lot. The group arrangement and hotel planning made the journey much easier for our whole family.",
    initials: "YM",
  },
  {
    name: "Arif Hussain",
    city: "Ahmedabad",
    package: "Standard Umrah",
    rating: "4.9",
    quote:
      "As first-time pilgrims, we had many questions. The guidance before departure and support after arrival made a big difference.",
    initials: "AH",
  },
];

const journeyMoments = [
  {
    title: "Before departure",
    text:
      "Pilgrims often remember the reassurance they felt during the pre-departure briefing, because practical clarity lowers anxiety before travel.",
  },
  {
    title: "Arrival and check-in",
    text:
      "The first hours after arrival matter a lot. Clear airport handling and hotel coordination help pilgrims settle into the journey with confidence.",
  },
  {
    title: "Sacred focus",
    text:
      "The best travel support is often the support that becomes invisible, letting pilgrims focus on worship rather than logistics.",
  },
];

const stats = [
  { value: "8,400+", label: "Pilgrims served" },
  { value: "12+", label: "Years of service" },
  { value: "1,200+", label: "Pilgrim reviews" },
  { value: "4.9 / 5", label: "Average satisfaction" },
];

function HajjUmrahGalleryPage() {
  return (
    <main className="bg-[#faf9f6]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(180,130,40,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(18,63,69,0.08),transparent_28%),linear-gradient(to_bottom,rgba(255,255,255,0.96),rgba(248,250,252,0.94))]" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
          <div className="max-w-3xl">
            <Badge
              variant="outline"
              className="mb-4 border-amber-200 bg-amber-50 text-amber-700"
            >
              Gallery & Reviews
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              A closer look at the journeys we help pilgrims make.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Explore moments from Hajj and Umrah journeys, read reflections from
              pilgrims, and understand how guided travel support translates into
              a calmer and more meaningful experience.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/hajj-umrah/packages"
                className={buttonVariants({
                  className: "bg-slate-900 text-white hover:bg-slate-800",
                })}
              >
                View packages
              </Link>

              <a
                href="tel:+919000000000"
                className={buttonVariants({
                  variant: "outline",
                  className:
                    "border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
                })}
              >
                <Phone className="mr-2 size-4" />
                Call us now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm"
            >
              <p className="text-2xl font-bold text-slate-900">{item.value}</p>
              <p className="mt-1 text-sm text-slate-600">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery grid */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
            Photo moments
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Images that carry the feeling of the journey.
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Travel websites often rely on large, immersive visuals because images
            help visitors imagine the real experience more quickly than text alone. [web:205][web:208]
          </p>
        </div>

        <div className="grid auto-rows-[220px] gap-4 md:grid-cols-2 xl:grid-cols-3">
          {galleryImages.map((image) => {
            const spanClass =
              image.span === "large"
                ? "md:col-span-2 xl:col-span-2"
                : image.span === "medium"
                ? "xl:col-span-1"
                : "";

            return (
              <div
                key={image.id}
                className={`group relative overflow-hidden rounded-3xl border border-border/60 bg-white shadow-sm ${spanClass}`}
              >
                <img
                  src={image.src}
                  alt={image.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1208]/82 via-[#1a1208]/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs backdrop-blur-sm">
                    <MapPin className="size-3" />
                    {image.location}
                  </div>
                  <h3 className="text-lg font-semibold">{image.title}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-white/75">
                    {image.caption}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Journey moments */}
      <section className="border-y bg-[#f4efe6]/60">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                Journey moments
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                What pilgrims often remember most.
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                A good gallery page should not feel like a random photo dump.
                It should guide the visitor through meaningful moments and emotional
                checkpoints that strengthen trust. [web:207][web:210][web:213]
              </p>
            </div>

            <div className="space-y-4">
              {journeyMoments.map((item, idx) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-amber-50 text-sm font-bold text-amber-700">
                      {idx + 1}
                    </div>
                    <h3 className="text-base font-semibold text-slate-900">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
            Pilgrim reviews
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Stories from families and first-time pilgrims.
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Testimonial sections work best when they include names, context, and
            visual identity instead of anonymous quotes, because that makes trust
            feel more grounded and believable. [web:207][web:210][web:213]
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((item) => (
            <Card
              key={item.name}
              className="rounded-2xl border-border/60 bg-white shadow-sm"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex size-11 items-center justify-center rounded-full bg-amber-50 text-sm font-bold text-amber-700">
                    {item.initials}
                  </div>
                  <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                    <Star className="size-3 fill-amber-500 text-amber-500" />
                    {item.rating}
                  </div>
                </div>
                <Quote className="mt-4 size-6 text-amber-700/40" />
              </CardHeader>

              <CardContent>
                <p className="text-sm leading-7 text-slate-700">“{item.quote}”</p>

                <div className="mt-5 border-t border-border/60 pt-4">
                  <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.city} · {item.package}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Trust section */}
      <section className="border-y bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-5 md:grid-cols-3">
            <Card className="rounded-2xl border-border/60 bg-slate-50 shadow-sm">
              <CardHeader>
                <div className="mb-2 inline-flex size-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                  <Camera className="size-5" />
                </div>
                <CardTitle className="text-xl text-slate-900">
                  Visual trust
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-7 text-slate-600">
                  Photos help visitors understand tone, atmosphere, and experience
                  far faster than plain text-only pages. [web:205][web:208]
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/60 bg-slate-50 shadow-sm">
              <CardHeader>
                <div className="mb-2 inline-flex size-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                  <Users className="size-5" />
                </div>
                <CardTitle className="text-xl text-slate-900">
                  Human proof
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-7 text-slate-600">
                  Testimonials become stronger when they show real people, package
                  context, and believable details instead of generic praise. [web:207][web:213]
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/60 bg-slate-50 shadow-sm">
              <CardHeader>
                <div className="mb-2 inline-flex size-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                  <HeartHandshake className="size-5" />
                </div>
                <CardTitle className="text-xl text-slate-900">
                  Confidence to inquire
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-7 text-slate-600">
                  A gallery page should not stop at inspiration; it should also
                  move users toward the next trustworthy step. [web:210]
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-[#6f5516]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-2xl text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">
              Ready for your journey
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Explore packages or speak with our team.
            </h2>
            <p className="mt-3 text-sm leading-7 text-amber-100/80">
              Review package options, compare travel styles, and ask questions
              about family travel, visa guidance, and current availability.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/hajj-umrah/packages"
              className={buttonVariants({
                className: "bg-white text-slate-900 hover:bg-amber-50",
              })}
            >
              Explore packages
            </Link>

            <a
              href="https://wa.me/919000000000"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({
                variant: "outline",
                className:
                  "border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white",
              })}
            >
              <MessageCircle className="mr-2 size-4" />
              WhatsApp us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}