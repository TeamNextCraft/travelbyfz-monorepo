import {
  BarChart3,
  CalendarDays,
  Compass,
  LayoutDashboard,
  MapPinHouse,
  PlaneTakeoff,
  Settings2,
  Ticket,
  Users,
} from "lucide-react"

export const sidebarModules = [
  {
    name: "Domestic",
    logo: MapPinHouse,
  },
  {
    name: "Hajj & Umrah",
    logo: Compass,
  },
  {
    name: "International",
    logo: PlaneTakeoff,
  },
]

export const sidebarNavMain = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Travel Management",
    url: "#",
    icon: Compass,
    items: [
      {
        title: "Tours",
        url: "/tours",
      },
      {
        title: "Destinations",
        url: "/destinations",
      },
      {
        title: "Departures",
        url: "/departures",
      },
    ],
  },
  {
    title: "Reservations",
    url: "#",
    icon: CalendarDays,
    items: [
      {
        title: "Bookings",
        url: "/bookings",
      },
      {
        title: "Payments",
        url: "/payments",
      },
      {
        title: "Refunds",
        url: "/refunds",
      },
    ],
  },
  {
    title: "Customers",
    url: "#",
    icon: Users,
    items: [
      {
        title: "Customers",
        url: "/customers",
      },
      {
        title: "Enquiries",
        url: "/enquiries",
      },
      {
        title: "Reviews",
        url: "/reviews",
      },
    ],
  },
  {
    title: "Marketing",
    url: "#",
    icon: Ticket,
    items: [
      {
        title: "Coupons",
        url: "/coupons",
      },
      {
        title: "Blog",
        url: "/blog",
      },
    ],
  },
  {
    title: "Analytics",
    url: "#",
    icon: BarChart3,
    items: [
      {
        title: "Reports",
        url: "/reports",
      },
    ],
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings2,
  },
]
