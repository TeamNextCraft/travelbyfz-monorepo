import { Link } from "@tanstack/react-router";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  Compass,
  Shield,
  CreditCard,
  HeartHandshake,
} from "lucide-react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Separator } from "#/components/ui/separator";
import { Badge } from "#/components/ui/badge";
import { useState } from "react";
import { cn } from "#/lib/utils";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

// ─── Data ──────────────────────────────────────────────────────────────────────

const QUICK_LINKS = [
  { label: "Home", to: "/" },
  { label: "All Tours", to: "/tours" },
  { label: "Destinations", to: "/destinations" },
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const POPULAR_TOURS = [
  { label: "Kerala Backwaters", to: "/tours/kerala-backwaters" },
  { label: "Royal Rajasthan", to: "/tours/rajasthan-royals" },
  { label: "Spiti Valley", to: "/tours/spiti-valley" },
  { label: "Char Dham Yatra", to: "/tours/char-dham" },
  { label: "Coorg Retreat", to: "/tours/coorg-retreat" },
  { label: "Andaman Escape", to: "/tours/andaman-escape" },
];

const CATEGORIES = [
  { label: "Beach & Islands", to: "/tours?category=Beach" },
  { label: "Hill Stations", to: "/tours?category=Hill+Station" },
  { label: "Adventure Tours", to: "/tours?category=Adventure" },
  { label: "Religious Yatras", to: "/tours?category=Religious" },
  { label: "Cultural Heritage", to: "/tours?category=Cultural" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
  { label: "Cancellation Policy", to: "/cancellation-policy" },
  { label: "Sitemap", to: "/sitemap" },
];

const SOCIAL_LINKS = [
  {
    icon: FaInstagram,
    label: "Instagram",
    href: "https://instagram.com",
    color: "hover:text-pink-500",
  },
  {
    icon: FaFacebook,
    label: "Facebook",
    href: "https://facebook.com",
    color: "hover:text-blue-500",
  },
  {
    icon: FaYoutube,
    label: "YouTube",
    href: "https://youtube.com",
    color: "hover:text-red-500",
  },
  {
    icon: FaTwitter,
    label: "X / Twitter",
    href: "https://twitter.com",
    color: "hover:text-sky-400",
  },
];

const TRUST_BADGES = [
  { icon: Shield, label: "Secure Payments" },
  { icon: CreditCard, label: "Razorpay & UPI" },
  { icon: HeartHandshake, label: "IATA Member" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Wire to createServerFn later
    setSubscribed(true);
    setEmail("");
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/40">
      {/* ── Newsletter strip ───────────────────────────────────────────── */}
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-bold text-lg">
                Get exclusive travel deals 🎉
              </h3>
              <p className="text-primary-foreground/70 text-sm mt-0.5">
                Early-bird discounts, new routes & seasonal offers — straight to
                your inbox.
              </p>
            </div>

            {subscribed ? (
              <div className="flex items-center gap-2 bg-white/15 rounded-xl px-5 py-3 text-sm font-medium shrink-0">
                <span>✅</span> You're subscribed — watch your inbox!
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex gap-2 w-full sm:w-auto"
              >
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/15 border-white/20 placeholder:text-primary-foreground/50 text-primary-foreground focus-visible:ring-white/40 w-full sm:w-64"
                />
                <Button
                  type="submit"
                  variant="default"
                  className="shrink-0 gap-1.5 font-semibold"
                >
                  <Send size={14} aria-hidden="true" />
                  Subscribe
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ── Main footer body ───────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">

          {/* Col 1 — Brand (spans 2 cols on lg) */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 w-fit hover:opacity-80 transition-opacity"
              aria-label="WanderIndia home"
            >
              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground">
                <Compass size={18} aria-hidden="true" />
              </span>
              <span className="text-lg font-bold tracking-tight">
                WanderIndia
              </span>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Your trusted partner for domestic travel across India. 500+
              handcrafted tours, 12,000+ happy travellers, and 10 years of
              turning journeys into memories.
            </p>

            {/* Contact details */}
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="tel:+919876543210"
                  className="flex items-center gap-2.5 text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <Phone size={13} aria-hidden="true" />
                  </span>
                  +91 98765 43210
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@wanderindia.com"
                  className="flex items-center gap-2.5 text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <Mail size={13} aria-hidden="true" />
                  </span>
                  hello@wanderindia.com
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-muted-foreground">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted mt-0.5">
                  <MapPin size={13} aria-hidden="true" />
                </span>
                <span className="leading-relaxed">
                  12, Travel Hub, Linking Road,
                  <br />
                  Mumbai, Maharashtra — 400050
                </span>
              </li>
            </ul>

            {/* Social links */}
            <div className="flex items-center gap-1">
              {SOCIAL_LINKS.map(({ icon: Icon, label, href, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors",
                    "hover:bg-muted",
                    color
                  )}
                >
                  <Icon size={16} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Quick links */}
          <FooterLinkColumn title="Company" links={QUICK_LINKS} />

          {/* Col 3 — Popular tours */}
          <FooterLinkColumn title="Popular Tours" links={POPULAR_TOURS} />

          {/* Col 4 — Categories */}
          <FooterLinkColumn title="Tour Types" links={CATEGORIES} />
        </div>

        {/* ── Trust badges ─────────────────────────────────────────────── */}
        <div className="mt-12 flex flex-wrap items-center gap-3">
          {TRUST_BADGES.map(({ icon: Icon, label }) => (
            <Badge
              key={label}
              variant="secondary"
              className="gap-1.5 px-3 py-1.5 text-xs font-medium"
            >
              <Icon size={12} aria-hidden="true" />
              {label}
            </Badge>
          ))}
          <Badge
            variant="secondary"
            className="gap-1.5 px-3 py-1.5 text-xs font-medium"
          >
            🇮🇳 Proudly Indian
          </Badge>
          <Badge
            variant="secondary"
            className="gap-1.5 px-3 py-1.5 text-xs font-medium"
          >
            ⭐ 4.8/5 on Google
          </Badge>
        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────────────────────── */}
      <Separator />
      <div className="mx-auto max-w-7xl px-4 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>
            © {currentYear} WanderIndia Tours & Travels Pvt. Ltd. All rights
            reserved.
          </p>
          <nav aria-label="Legal links">
            <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 justify-center">
              {LEGAL_LINKS.map(({ label, to }, i) => (
                <li key={label} className="flex items-center gap-4">
                  <Link
                    to={to}
                    className="hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                  {i < LEGAL_LINKS.length - 1 && (
                    <span className="text-border" aria-hidden="true">
                      ·
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}

// ─── Sub-component ────────────────────────────────────────────────────────────

function FooterLinkColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; to: string }[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-sm font-semibold tracking-wide">{title}</h4>
      <ul className="space-y-2.5">
        {links.map(({ label, to }) => (
          <li key={label}>
            <Link
              to={to}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}