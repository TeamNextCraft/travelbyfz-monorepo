// src/config/sidebar-navigation.ts
import {
	BarChart3,
	CalendarDays,
	Compass,
	LayoutDashboard,
	type LucideIcon,
	MapPinHouse,
	PlaneTakeoff,
	Settings2,
	Ticket,
	Users,
} from "lucide-react";

export type NavSubItem = { title: string; url: string };

/**
 * A nav entry is EITHER a direct link (`url`) OR a group of links (`items`),
 * never both. Groups don't need a placeholder `url: "#"` any more.
 */
export type NavItem = { title: string; icon?: LucideIcon } & (
	| { url: string; items?: never }
	| { url?: never; items: NavSubItem[] }
);

export const sidebarModules = [
	{ name: "Domestic", logo: MapPinHouse },
	{ name: "Hajj & Umrah", logo: Compass },
	{ name: "International", logo: PlaneTakeoff },
];

export const sidebarNavMain: NavItem[] = [
	{
		title: "Dashboard",
		url: "/",
		icon: LayoutDashboard,
	},
	{
		title: "Travel Management",
		icon: Compass,
		items: [
			{ title: "Tours", url: "/tours" },
			{ title: "Destinations", url: "/destinations" },
			{ title: "Departures", url: "/departures" },
		],
	},
	{
		title: "Reservations",
		icon: CalendarDays,
		items: [
			{ title: "Bookings", url: "/bookings" },
			{ title: "Payments", url: "/payments" },
			{ title: "Refunds", url: "/refunds" },
		],
	},
	{
		title: "User Management",
		icon: Users,
		items: [
			{ title: "Users", url: "/users" },
			{ title: "Enquiries", url: "/enquiries" },
			{ title: "Reviews", url: "/reviews" },
		],
	},
	{
		title: "Marketing",
		icon: Ticket,
		items: [
			{ title: "Coupons", url: "/coupons" },
			{ title: "Blog", url: "/blog" },
		],
	},
	{
		title: "Analytics",
		icon: BarChart3,
		items: [{ title: "Reports", url: "/reports" }],
	},
	{
		title: "Settings",
		url: "/settings",
		icon: Settings2,
	},
];

// import {
// 	BarChart3,
// 	CalendarDays,
// 	Compass,
// 	LayoutDashboard,
// 	MapPinHouse,
// 	PlaneTakeoff,
// 	Settings2,
// 	Ticket,
// 	Users,
// } from "lucide-react";
//
// export const sidebarModules = [
// 	{
// 		name: "Domestic",
// 		logo: MapPinHouse,
// 	},
// 	{
// 		name: "Hajj & Umrah",
// 		logo: Compass,
// 	},
// 	{
// 		name: "International",
// 		logo: PlaneTakeoff,
// 	},
// ];
//
// export const sidebarNavMain = [
// 	{
// 		title: "Dashboard",
// 		url: "/",
// 		icon: LayoutDashboard,
// 	},
// 	{
// 		title: "Travel Management",
// 		url: "#",
// 		icon: Compass,
// 		items: [
// 			{
// 				title: "Tours",
// 				url: "/tours",
// 			},
// 			{
// 				title: "Destinations",
// 				url: "/destinations",
// 			},
// 			{
// 				title: "Departures",
// 				url: "/departures",
// 			},
// 		],
// 	},
// 	{
// 		title: "Reservations",
// 		url: "#",
// 		icon: CalendarDays,
// 		items: [
// 			{
// 				title: "Bookings",
// 				url: "/bookings",
// 			},
// 			{
// 				title: "Payments",
// 				url: "/payments",
// 			},
// 			{
// 				title: "Refunds",
// 				url: "/refunds",
// 			},
// 		],
// 	},
// 	{
// 		title: "User Management",
// 		url: "#",
// 		icon: Users,
// 		items: [
// 			{
// 				title: "Users",
// 				url: "/users",
// 			},
// 			{
// 				title: "Enquiries",
// 				url: "/enquiries",
// 			},
// 			{
// 				title: "Reviews",
// 				url: "/reviews",
// 			},
// 		],
// 	},
// 	{
// 		title: "Marketing",
// 		url: "#",
// 		icon: Ticket,
// 		items: [
// 			{
// 				title: "Coupons",
// 				url: "/coupons",
// 			},
// 			{
// 				title: "Blog",
// 				url: "/blog",
// 			},
// 		],
// 	},
// 	{
// 		title: "Analytics",
// 		url: "#",
// 		icon: BarChart3,
// 		items: [
// 			{
// 				title: "Reports",
// 				url: "/reports",
// 			},
// 		],
// 	},
// 	{
// 		title: "Settings",
// 		url: "/settings",
// 		icon: Settings2,
// 	},
// ];
