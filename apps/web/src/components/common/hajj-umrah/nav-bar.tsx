import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BadgeCheck,
  ChevronRight,
  Menu,
  MoonStar,
  Phone,
  Shield,
  X,
} from "lucide-react";

import { cn } from "#/lib/utils";
import { buttonVariants } from "#/components/ui/button";
import { Badge } from "#/components/ui/badge";
import { FaWhatsapp } from "react-icons/fa";

const navItems = [
  { label: "Home", to: "/hajj-umrah" },
  { label: "Packages", to: "/hajj-umrah/packages" },
  { label: "Process", to: "/hajj-umrah/process" },
  { label: "Visa", to: "/hajj-umrah/visa" },
  { label: "Gallery", to: "/hajj-umrah/gallery" },
  { label: "FAQ", to: "/hajj-umrah/faq" },
  { label: "Contact", to: "/hajj-umrah/contact" },
] as const;

export function HajjUmrahNavbar() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    const body = document.body;
    if (mobileOpen) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "";
    }

    return () => {
      body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-black/5 bg-[#faf9f6]/90 backdrop-blur-xl supports-[backdrop-filter]:bg-[#faf9f6]/75">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* top trust strip */}
          <div className="hidden items-center justify-between border-b border-black/5 py-2 text-xs text-slate-600 md:flex">
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <BadgeCheck className="size-3.5 text-amber-700" />
                Trusted pilgrimage guidance
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Shield className="size-3.5 text-amber-700" />
                Hajj & Umrah support
              </span>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="tel:+919000000000"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-slate-900"
              >
                <Phone className="size-3.5" />
                +91 90000 00000
              </a>
              <a
                href="https://wa.me/919000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-slate-900"
              >
                <FaWhatsapp className="size-3.5" />
                WhatsApp support
              </a>
            </div>
          </div>

          {/* main nav */}
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="group inline-flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-[#6f5516] text-white shadow-sm">
                  <MoonStar className="size-5" />
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-semibold leading-none text-slate-900">
                    Safa Journey
                  </span>
                  <span className="mt-1 text-xs leading-none text-slate-500">
                    Hajj & Umrah Services
                  </span>
                </div>
              </Link>

              <nav className="hidden items-center gap-1 lg:flex">
                {navItems.map((item) => {
                  const isActive =
                    pathname === item.to ||
                    (item.to !== "/hajj-umrah" && pathname.startsWith(item.to));

                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={cn(
                        "rounded-full px-4 py-2 text-sm font-bold transition-colors",
                        isActive
                          ? "bg-amber-200 text-amber-800"
                          : "text-slate-600 hover:bg-white hover:text-slate-900",
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="hidden items-center gap-3 lg:flex">
              <a
                href="https://wa.me/919000000000"
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({
                  variant: "outline",
                  className:
                    "border-amber-300 bg-white text-slate-900 hover:bg-amber-50",
                })}
              >
                <FaWhatsapp className="mr-2 size-4" />
                WhatsApp
              </a>

              <Link
                to="/hajj-umrah/contact"
                search={{
                  intent: "enquiry",
                  source: "navbar",
                }}
                className={buttonVariants({
                  className: "bg-slate-900 text-white hover:bg-slate-800",
                }) }
              >
                Enquire now
                <ChevronRight className="ml-2 size-4" />
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex size-11 items-center justify-center rounded-xl border border-black/10 bg-white text-slate-900 transition-colors hover:bg-slate-50 lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      {/* mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setMobileOpen(false)}
      />

      {/* mobile drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-[70] w-full max-w-sm border-l border-black/10 bg-[#faf9f6] shadow-2xl transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full",
        )}
        aria-hidden={!mobileOpen}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-[#6f5516] text-white">
                <MoonStar className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Safa Journey
                </p>
                <p className="text-xs text-slate-500">Hajj & Umrah</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="inline-flex size-10 items-center justify-center rounded-xl border border-black/10 bg-white text-slate-900"
              aria-label="Close navigation menu"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="border-b border-black/5 px-5 py-4">
            <Badge className="border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50">
              Trusted pilgrimage support
            </Badge>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.to ||
                  (item.to !== "/hajj-umrah" && pathname.startsWith(item.to));

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-amber-50 text-amber-800"
                        : "text-slate-700 hover:bg-white hover:text-slate-900",
                    )}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="size-4 opacity-60" />
                  </Link>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-slate-900">
                Need quick help?
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Speak with our team about packages, visa guidance, or family
                group travel.
              </p>

              <div className="mt-4 flex flex-col gap-2">
                <a
                  href="tel:+919000000000"
                  className={buttonVariants({
                    variant: "outline",
                    className:
                      "w-full border-amber-200 bg-white text-slate-900 hover:bg-amber-100",
                  })}
                >
                  <Phone className="mr-2 size-4" />
                  Call now
                </a>

                <a
                  href="https://wa.me/919000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({
                    className:
                      "w-full bg-slate-900 text-white hover:bg-slate-800",
                  })}
                >
                  <FaWhatsapp className="mr-2 size-4" />
                  WhatsApp us
                </a>
              </div>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}
