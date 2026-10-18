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
  LogOut,
  User2Icon,
  Settings,
  User2,
} from "lucide-react";
import { cn } from "#/lib/utils";
import { Badge } from "#/components/ui/badge";
import { Button, buttonVariants } from "#/components/ui/button";
import { authClient } from "#/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu"

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

  const [isUserActionLoading, setIsUserActionLoading] = useState<boolean>(false);

  const { data: session, isPending, error } = authClient.useSession();

  const user = session?.user;

  console.log({
    user: user,
    actionState: isUserActionLoading,
  })

  const handleSignOut = async () => {
    setIsUserActionLoading(true);
    await authClient.signOut();
    setIsUserActionLoading(false);
  }

  const navLinks = (user) ? domesticNavItems : domesticNavItems.filter(item => item.label !== "My Bookings");

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

          {navLinks.map((item) => {
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
                {/* <Icon className="size-4" />*/}
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

          {isPending ? (
            <div className="border-gray-300 border-[1.5px] p-0.5 rounded-full stroke-none size-10 animate-pulse flex align-middle justify-center">
              <User2 className="size-full p-2" />
            </div>
          ) : (user) ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar size="lg" className={cn((isUserActionLoading) ? "border-red-800" : "border-gray-300 ", "border-2 cursor-pointer")}>
                  {user?.image ? (
                    < AvatarImage src={"https://github.com/shadcn.png"} className={cn((isUserActionLoading) ? "animate-pulse" : "")} />
                  ) : (
                    <AvatarFallback className={cn((isUserActionLoading) ? "animate-pulse" : "", "font-bold")}>
                      <div className="border-gray-300 border-[1.5px] p-0.5 rounded-full stroke-none size-10 flex align-middle justify-center">
                        <User2 className="size-full p-2" />
                      </div>
                    </AvatarFallback>
                  )}
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40" align="start">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <User2Icon />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings />
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant={"outline"}
              asChild
            >
              <Link
                to="/sign-in"
                search={{ module: "customer" }}
              >
                Sign in
              </Link>
            </Button>
          )}
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
      </div >

      {/* Mobile panel */}
      {
        mobileOpen && (
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
        )
      }
    </header >
  );
}
