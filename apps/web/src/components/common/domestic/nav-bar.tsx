// import { Link } from "@tanstack/react-router";
// import {
//   ArrowLeft,
//   Check,
//   MapPinned,
//   Menu,
//   Phone,
//   Sparkles,
// } from "lucide-react";
// import {
//   NavigationMenu,
//   NavigationMenuButton,
//   NavigationMenuItem,
//   NavigationMenuList,
// } from "#/components/ui/navigation-menu";
// import { ScrollArea } from "#/components/ui/scroll-area";
// import { Sheet, SheetContent, SheetTrigger } from "#/components/ui/sheet";
// import { useState } from "react";
// import { Button, buttonVariants } from "#/components/ui/button";
// import { Separator } from "#/components/ui/separator";

// export function Navbar() {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const scrollToSection = (id: string) => {
//     const element = document.getElementById(id);
//     if (element) {
//       element.scrollIntoView({ behavior: "smooth" });
//     }
//     setMobileMenuOpen(false);
//   };

//   return (
//     <nav className="island-shell flex flex-col justify-between gap-3 sticky top-0 z-10 px-4 py-3 sm:flex-row sm:items-center ">
//       <div className="mx-auto flex w-full max-w-7xl">
//         <Link
//           to="/"
//           className={buttonVariants({
//             variant: "ghost",
//             className: "w-fit font-bold gap-2",
//           })}
//         >
//           <ArrowLeft size={16} aria-hidden="true" />
//           Travel services
//         </Link>

//         {/* Desktop Nav */}
//         <NavigationMenu className="hidden max-w-full justify-end sm:flex">
//           <NavigationMenuList className="flex-wrap justify-end">
//             <NavigationMenuItem>
//               <NavigationMenuButton
//                 onClick={() => scrollToSection("destinations")}
//               >
//                 Destinations
//               </NavigationMenuButton>
//             </NavigationMenuItem>
//             <NavigationMenuItem>
//               <NavigationMenuButton onClick={() => scrollToSection("packages")}>
//                 Packages
//               </NavigationMenuButton>
//             </NavigationMenuItem>
//             <NavigationMenuItem>
//               <NavigationMenuButton onClick={() => scrollToSection("faq")}>
//                 FAQ
//               </NavigationMenuButton>
//             </NavigationMenuItem>
//             <NavigationMenuItem>
//               <NavigationMenuButton onClick={() => scrollToSection("request")}>
//                 Request trip
//               </NavigationMenuButton>
//             </NavigationMenuItem>
//           </NavigationMenuList>
//         </NavigationMenu>
//       </div>

//       {/* Mobile Nav */}
//       <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
//         <SheetTrigger asChild className="sm:hidden">
//           <Button variant="ghost" size="icon">
//             <Menu size={20} />
//           </Button>
//         </SheetTrigger>
//         <SheetContent side="right" className="w-[280px]">
//           <ScrollArea className="h-full py-6">
//             <div className="flex flex-col gap-2">
//               <p className="px-4 text-sm font-bold text-muted-foreground mb-2">
//                 Navigation
//               </p>
//               <Button
//                 variant="ghost"
//                 className="justify-start"
//                 onClick={() => scrollToSection("destinations")}
//               >
//                 <MapPinned size={16} className="mr-2" />
//                 Destinations
//               </Button>
//               <Button
//                 variant="ghost"
//                 className="justify-start"
//                 onClick={() => scrollToSection("packages")}
//               >
//                 <Sparkles size={16} className="mr-2" />
//                 Packages
//               </Button>
//               <Button
//                 variant="ghost"
//                 className="justify-start"
//                 onClick={() => scrollToSection("faq")}
//               >
//                 <Check size={16} className="mr-2" />
//                 FAQ
//               </Button>
//               <Button
//                 variant="ghost"
//                 className="justify-start"
//                 onClick={() => scrollToSection("request")}
//               >
//                 <Phone size={16} className="mr-2" />
//                 Request trip
//               </Button>
//               <Separator className="my-4" />
//               <Link
//                 to="/"
//                 className={buttonVariants({
//                   variant: "outline",
//                   className: "mx-4 gap-2",
//                 })}
//               >
//                 <ArrowLeft size={16} />
//                 Back to home
//               </Link>
//             </div>
//           </ScrollArea>
//         </SheetContent>
//       </Sheet>
//     </nav>
//   );
// }

// import { Link, useRouterState } from "@tanstack/react-router";
// import {
//   MapPinned,
//   Menu,
//   Phone,
//   Sparkles,
//   HelpCircle,
//   Compass,
//   X,
// } from "lucide-react";
// import {
//   NavigationMenu,
//   NavigationMenuButton,
//   NavigationMenuItem,
//   NavigationMenuList,
// } from "#/components/ui/navigation-menu";
// import { ScrollArea } from "#/components/ui/scroll-area";
// import { Sheet, SheetContent, SheetTrigger } from "#/components/ui/sheet";
// import { useState, useEffect } from "react";
// import { Button, buttonVariants } from "#/components/ui/button";
// import { Separator } from "#/components/ui/separator";
// import { cn } from "#/lib/utils";

// const NAV_ITEMS = [
//   { label: "Destinations", id: "destinations", icon: MapPinned },
//   { label: "Packages",     id: "packages",     icon: Sparkles },
//   { label: "FAQ",          id: "faq",          icon: HelpCircle },
//   { label: "Request trip", id: "request",      icon: Phone },
// ] as const;

// export function Navbar() {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [activeSection, setActiveSection] = useState<string | null>(null);
//   const [scrolled, setScrolled] = useState(false);

//   // Track scroll position for shadow + active section
//   useEffect(() => {
//     const onScroll = () => {
//       setScrolled(window.scrollY > 8);

//       // Highlight the section currently in view
//       for (const item of [...NAV_ITEMS].reverse()) {
//         const el = document.getElementById(item.id);
//         if (el && window.scrollY >= el.offsetTop - 100) {
//           setActiveSection(item.id);
//           return;
//         }
//       }
//       setActiveSection(null);
//     };

//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   const scrollToSection = (id: string) => {
//     document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
//     setMobileMenuOpen(false);
//   };

//   return (
//     <nav
//       className={cn(
//         "island-shell sticky top-0 z-40 transition-shadow duration-300",
//         scrolled && "shadow-md"
//       )}
//     >
//       <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-4 py-3">
//         {/* Brand */}
//         <Link
//           to="/"
//           className="flex items-center gap-2 font-bold text-foreground hover:opacity-80 transition-opacity mr-auto shrink-0"
//           aria-label="Go to homepage"
//         >
//           <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
//             <Compass size={16} aria-hidden="true" />
//           </span>
//           <span className="hidden sm:inline text-base tracking-tight">
//             WanderIndia
//           </span>
//         </Link>

//         {/* Desktop Nav */}
//         <NavigationMenu className="hidden md:flex">
//           <NavigationMenuList>
//             {NAV_ITEMS.map(({ label, id }) => (
//               <NavigationMenuItem key={id}>
//                 <NavigationMenuButton
//                   onClick={() => scrollToSection(id)}
//                   className={cn(
//                     "transition-colors",
//                     activeSection === id &&
//                       "text-primary font-semibold bg-primary/8"
//                   )}
//                   aria-current={activeSection === id ? "true" : undefined}
//                 >
//                   {label}
//                 </NavigationMenuButton>
//               </NavigationMenuItem>
//             ))}
//           </NavigationMenuList>
//         </NavigationMenu>

//         {/* Desktop CTA */}
//         <Button
//           size="sm"
//           className="hidden md:flex shrink-0"
//           onClick={() => scrollToSection("request")}
//         >
//           Book a trip
//         </Button>

//         {/* Mobile Hamburger */}
//         <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
//           <SheetTrigger asChild>
//             <Button
//               variant="ghost"
//               size="icon"
//               className="md:hidden shrink-0"
//               aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
//             >
//               {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
//             </Button>
//           </SheetTrigger>

//           <SheetContent side="right" className="w-[280px] p-0">
//             {/* Mobile Sheet Header */}
//             <div className="flex items-center gap-2 px-4 py-4 border-b">
//               <span className="flex items-center justify-center w-7 h-7 rounded-md bg-primary text-primary-foreground">
//                 <Compass size={14} aria-hidden="true" />
//               </span>
//               <span className="font-bold text-sm">WanderIndia</span>
//             </div>

//             <ScrollArea className="h-[calc(100%-60px)]">
//               <div className="flex flex-col gap-1 p-3">
//                 <p className="px-3 pt-2 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
//                   Navigate
//                 </p>

//                 {NAV_ITEMS.map(({ label, id, icon: Icon }) => (
//                   <Button
//                     key={id}
//                     variant="ghost"
//                     className={cn(
//                       "justify-start gap-3 h-10",
//                       activeSection === id &&
//                         "bg-primary/10 text-primary font-semibold"
//                     )}
//                     onClick={() => scrollToSection(id)}
//                   >
//                     <Icon
//                       size={16}
//                       className={
//                         activeSection === id
//                           ? "text-primary"
//                           : "text-muted-foreground"
//                       }
//                       aria-hidden="true"
//                     />
//                     {label}
//                   </Button>
//                 ))}

//                 <Separator className="my-3" />

//                 <Button
//                   className="w-full gap-2"
//                   onClick={() => scrollToSection("request")}
//                 >
//                   <Phone size={15} aria-hidden="true" />
//                   Book a trip
//                 </Button>
//               </div>
//             </ScrollArea>
//           </SheetContent>
//         </Sheet>
//       </div>
//     </nav>
//   );
// }

import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  ChevronDown,
  MapPinned,
  Menu,
  Phone,
  Search,
  User,
  X,
  Backpack,
  Mountain,
  Building2,
  ReceiptText,
} from "lucide-react";

import { cn } from "#/lib/utils";
import { Badge } from "#/components/ui/badge";
import { buttonVariants } from "#/components/ui/button";

const domesticNavItems = [
  {
    label: "Tours",
    to: "/domestic/tours",
    icon: Backpack,
  },
  {
    label: "Destinations",
    to: "/domestic/destinations",
    icon: MapPinned,
  },
  {
    label: "Themes",
    to: "/domestic/themes",
    icon: Mountain,
  },
  {
    label: "Custom Trip",
    to: "/domestic/custom-trip",
    icon: Building2,
  },
  {
    label: "My Bookings",
    to: "/domestic/bookings",
    icon: ReceiptText,
  },
];

export function DomesticNavbar({ transparent = false }: { transparent?: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b backdrop-blur-xl",
        transparent
          ? "border-white/20 bg-white/35"
          : "border-border/50 bg-white/85"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg transition-opacity hover:opacity-90"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#123f45] text-white shadow-sm">
              <MapPinned className="size-5" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                Travel by FZ
              </p>
              <div className="flex items-center gap-2">
                <p className="truncate text-xs text-muted-foreground">
                  Domestic Tours
                </p>
                <Badge
                  variant="outline"
                  className="hidden sm:inline-flex border-teal-200 bg-teal-50 text-teal-700"
                >
                  India
                </Badge>
              </div>
            </div>
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          <Link
            to="/domestic"
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === "/domestic"
                ? "bg-slate-900 text-white"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
            )}
          >
            Home
          </Link>

          {domesticNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.to);

            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                )}
              >
                {/* <Icon className="size-4" /> */}
                {item.label}
              </Link>
            );
          })}

          <Link
            to="/domestic/offers"
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname.startsWith("/domestic/offers")
                ? "bg-slate-900 text-white"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
            )}
          >
            Offers
          </Link>
        </nav>

        {/* Desktop right side */}
        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/60 bg-white/75 text-slate-800 shadow-sm transition-colors hover:bg-white"
            aria-label="Search domestic tours"
          >
            <Search className="size-4" />
          </button>

          <a
            href="tel:+919000000000"
            className={buttonVariants({
              variant: "outline",
              className:
                "border-white/60 bg-white/75 font-semibold text-slate-900 hover:bg-white",
            })}
          >
            <Phone className="mr-2 size-4" />
            Call now
          </a>

          <Link
            to="/sign-in"
            search={{ module: "domestic" }}
            className={buttonVariants({
              variant: "ghost",
              className: "font-semibold text-slate-800 hover:text-slate-950",
            })}
          >
            Sign in
          </Link>

          <Link
            to="/sign-up"
            search={{ module: "domestic" }}
            className={buttonVariants({
              className: "bg-slate-900 text-white hover:bg-slate-800",
            })}
          >
            Plan trip
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/50 bg-white/75 text-slate-900 shadow-sm transition-colors hover:bg-white lg:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="border-t border-border/50 bg-white/95 backdrop-blur-xl lg:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <div className="mb-4 rounded-xl border border-teal-100 bg-teal-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-[#123f45] text-white">
                  <MapPinned className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Domestic Tours
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Discover and book trips across India
                  </p>
                </div>
              </div>
            </div>

            <nav className="grid gap-2">
              <Link
                to="/domestic"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                  pathname === "/domestic"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-50 text-slate-800 hover:bg-slate-100"
                )}
              >
                Home
              </Link>

              {domesticNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.to);

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "inline-flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-slate-900 text-white"
                        : "bg-slate-50 text-slate-800 hover:bg-slate-100"
                    )}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Link>
                );
              })}

              <Link
                to="/domestic/offers"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                  pathname.startsWith("/domestic/offers")
                    ? "bg-slate-900 text-white"
                    : "bg-slate-50 text-slate-800 hover:bg-slate-100"
                )}
              >
                Offers
              </Link>
            </nav>

            <div className="mt-4 grid gap-2">
              <Link
                to="/sign-in"
                search={{ module: "domestic" }}
                onClick={() => setMobileOpen(false)}
                className={buttonVariants({
                  variant: "outline",
                  className:
                    "justify-center border-white bg-white font-semibold text-slate-900",
                })}
              >
                <User className="mr-2 size-4" />
                Sign in
              </Link>

              <Link
                to="/sign-up"
                search={{ module: "domestic" }}
                onClick={() => setMobileOpen(false)}
                className={buttonVariants({
                  className: "justify-center bg-slate-900 text-white hover:bg-slate-800",
                })}
              >
                Plan trip
              </Link>

              <a
                href="tel:+919000000000"
                className={buttonVariants({
                  variant: "ghost",
                  className: "justify-center text-slate-800",
                })}
              >
                <Phone className="mr-2 size-4" />
                Call now
              </a>
            </div>

            <div className="mt-4 rounded-xl border border-border/60 bg-slate-50 p-3.5">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-950"
              >
                Switch travel category
                <ChevronDown className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}