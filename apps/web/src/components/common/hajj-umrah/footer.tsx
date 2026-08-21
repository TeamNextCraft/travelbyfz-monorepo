import { Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  MoonStar,
  Phone,
  Shield,
} from "lucide-react";

const quickLinks = [
  { label: "Home", to: "/hajj-umrah" },
  { label: "Packages", to: "/hajj-umrah/packages" },
  { label: "Process", to: "/hajj-umrah/process" },
  { label: "Visa", to: "/hajj-umrah/visa" },
];

const supportLinks = [
  { label: "Gallery", to: "/hajj-umrah/gallery" },
  { label: "FAQ", to: "/hajj-umrah/faq" },
  { label: "Contact", to: "/hajj-umrah/contact" },
  { label: "Custom Group", to: "/hajj-umrah/custom-group" },
];

const legalLinks = [
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms & Conditions", to: "/terms-and-conditions" },
  { label: "Refund Policy", to: "/refund-policy" },
];

export function HajjUmrahFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.8fr_0.8fr_1fr]">
          {/* brand */}
          <div>
            <Link to="/hajj-umrah" className="inline-flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-[#6f5516] text-white shadow-sm">
                <MoonStar className="size-5" />
              </div>

              <div>
                <p className="text-sm font-semibold text-white">Safa Journey</p>
                <p className="text-xs text-slate-400">Hajj & Umrah Services</p>
              </div>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
              Helping pilgrims and families travel with clarity, care, and guided
              support across Hajj, Umrah, Ramadan Umrah, and custom group journeys.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
                <BadgeCheck className="size-3.5 text-amber-300" />
                Trusted guidance
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
                <Shield className="size-3.5 text-amber-300" />
                Pilgrimage support
              </div>
            </div>
          </div>

          {/* quick links */}
          <div>
            <h3 className="text-sm font-semibold text-white">Quick links</h3>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* support */}
          <div>
            <h3 className="text-sm font-semibold text-white">Support</h3>
            <ul className="mt-5 space-y-3">
              {supportLinks.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* contact */}
          <div>
            <h3 className="text-sm font-semibold text-white">Contact</h3>

            <div className="mt-5 space-y-4">
              <a
                href="tel:+919000000000"
                className="flex items-start gap-3 text-sm text-slate-400 transition-colors hover:text-white"
              >
                <Phone className="mt-0.5 size-4 shrink-0 text-amber-300" />
                <span>+91 90000 00000</span>
              </a>

              <a
                href="mailto:support@yourdomain.com"
                className="flex items-start gap-3 text-sm text-slate-400 transition-colors hover:text-white"
              >
                <Mail className="mt-0.5 size-4 shrink-0 text-amber-300" />
                <span>support@yourdomain.com</span>
              </a>

              <a
                href="https://wa.me/919000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-sm text-slate-400 transition-colors hover:text-white"
              >
                <MessageCircle className="mt-0.5 size-4 shrink-0 text-amber-300" />
                <span>WhatsApp support</span>
              </a>

              <div className="flex items-start gap-3 text-sm text-slate-400">
                <MapPin className="mt-0.5 size-4 shrink-0 text-amber-300" />
                <span>Bhuj, Gujarat, India</span>
              </div>
            </div>

            <div className="mt-6">
              <a
                href="https://www.google.com/maps?q=Bhuj%2C%20Gujarat%2C%20India"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-amber-300 transition-colors hover:text-amber-200"
              >
                View location
                <ExternalLink className="size-4" />
              </a>
            </div>
          </div>
        </div>

        {/* CTA strip */}
        <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 px-6 py-6 sm:px-8 lg:flex lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">
              Need guidance
            </p>
            <h3 className="mt-2 text-xl font-semibold text-white">
              Speak with our team before choosing your package.
            </h3>
            <p className="mt-2 text-sm leading-7 text-slate-400">
              We can help with package comparison, visa guidance, family group
              planning, and practical next steps for your pilgrimage.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-3 lg:mt-0">
            <a
              href="tel:+919000000000"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 bg-white/8 px-5 text-sm font-medium text-white transition-colors hover:bg-white/15"
            >
              <Phone className="mr-2 size-4" />
              Call now
            </a>

            <Link
              to="/hajj-umrah/contact"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[#6f5516] px-5 text-sm font-medium text-white transition-colors hover:bg-[#80651d]"
            >
              Contact us
            </Link>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 py-6 text-sm text-slate-500 lg:flex-row lg:items-center lg:justify-between">
          <p>
            © {new Date().getFullYear()} Safa Journey. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-4">
            {legalLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}