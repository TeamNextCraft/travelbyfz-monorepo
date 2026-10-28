// src/components/sidebar/nav-main.tsx
import { Link, type LinkProps, useRouterState } from "@tanstack/react-router";
import { cn } from "cn";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "#/components/ui/collapsible";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	useSidebar,
} from "#/components/ui/sidebar";
import type { NavItem, NavSubItem } from "#/config/sidebar-navigation";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const normalise = (path: string) =>
	path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;

/**
 * "/" only matches exactly. Everything else matches itself and nested paths,
 * on a segment boundary, so "/tours" is active on "/tours/123/edit" but
 * "/tours-archive" does not activate "/tours".
 */
function isUrlActive(pathname: string, url: string) {
	const path = normalise(pathname);
	const target = normalise(url);
	if (target === "/") return path === "/";
	return path === target || path.startsWith(`${target}/`);
}

const hasActiveChild = (pathname: string, items: NavSubItem[]) =>
	items.some((sub) => isUrlActive(pathname, sub.url));

/** Nav urls are plain strings in config, so cast them for the typed router. */
const toRoute = (url: string) => url as LinkProps["to"];

/* ------------------------------------------------------------------ */
/* Single link (Dashboard, Settings, ...)                              */
/* ------------------------------------------------------------------ */

function NavLinkItem({
	title,
	url,
	icon: Icon,
	pathname,
	onNavigate,
}: {
	title: string;
	url: string;
	icon?: NavItem["icon"];
	pathname: string;
	onNavigate: () => void;
}) {
	return (
		<SidebarMenuItem>
			<SidebarMenuButton
				asChild
				tooltip={title}
				isActive={isUrlActive(pathname, url)}
			>
				<Link to={toRoute(url)} onClick={onNavigate}>
					{Icon && <Icon />}
					<span>{title}</span>
				</Link>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
}

/* ------------------------------------------------------------------ */
/* Group with sub links                                                */
/* ------------------------------------------------------------------ */

function NavGroup({
	title,
	icon: Icon,
	items,
	pathname,
	open,
	onOpenChange,
	onNavigate,
}: {
	title: string;
	icon?: NavItem["icon"];
	items: NavSubItem[];
	pathname: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onNavigate: () => void;
}) {
	const { state, isMobile } = useSidebar();
	const active = hasActiveChild(pathname, items);

	// Icon-only sidebar: there's no room for an inline submenu, so show the
	// children in a flyout menu instead.
	if (state === "collapsed" && !isMobile) {
		return (
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton tooltip={title} isActive={active}>
							{Icon && <Icon />}
							<span>{title}</span>
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent side="right" align="start" className="min-w-48">
						<DropdownMenuLabel>{title}</DropdownMenuLabel>
						{items.map((sub) => (
							<DropdownMenuItem
								key={sub.url}
								asChild
								className={
									isUrlActive(pathname, sub.url)
										? "bg-red-950 font-bold"
										: "text-foreground"
								}
							>
								''<Link to={toRoute(sub.url)}>{sub.title}</Link>
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		);
	}

	return (
		<Collapsible
			asChild
			open={open}
			onOpenChange={onOpenChange}
			className="group/collapsible"
		>
			<SidebarMenuItem>
				<CollapsibleTrigger asChild>
					<SidebarMenuButton tooltip={title}>
						{Icon && <Icon />}
						<span>{title}</span>
						<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
					</SidebarMenuButton>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<SidebarMenuSub>
						{items.map((sub) => (
							<SidebarMenuSubItem key={sub.url}>
								<SidebarMenuSubButton
									asChild
									isActive={isUrlActive(pathname, sub.url)}
								>
									<Link
										to={toRoute(sub.url)}
										onClick={onNavigate}
										className={cn(
											isUrlActive(pathname, sub.url) ? "bg-red-600" : "",
										)}
									>
										<span>{sub.title}</span>
									</Link>
								</SidebarMenuSubButton>
							</SidebarMenuSubItem>
						))}
					</SidebarMenuSub>
				</CollapsibleContent>
			</SidebarMenuItem>
		</Collapsible>
	);
}

/* ------------------------------------------------------------------ */
/* NavMain                                                             */
/* ------------------------------------------------------------------ */

export function NavMain({ items }: { items: NavItem[] }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const { isMobile, setOpenMobile } = useSidebar();

	// Close the mobile drawer after navigating.
	const onNavigate = () => {
		if (isMobile) setOpenMobile(false);
	};

	// Groups start open if one of their pages is the current page...
	const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
		Object.fromEntries(
			items.flatMap((item) =>
				item.items ? [[item.title, hasActiveChild(pathname, item.items)]] : [],
			),
		),
	);

	// ...and re-open when you navigate into one (e.g. via a link elsewhere in
	// the app). It never force-closes a group you opened by hand.
	useEffect(() => {
		setOpenGroups((prev) => {
			let changed = false;
			const next = { ...prev };
			for (const item of items) {
				if (
					item.items &&
					hasActiveChild(pathname, item.items) &&
					!next[item.title]
				) {
					next[item.title] = true;
					changed = true;
				}
			}
			return changed ? next : prev;
		});
	}, [pathname, items]);

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Platform</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) =>
					item.items ? (
						<NavGroup
							key={item.title}
							title={item.title}
							icon={item.icon}
							items={item.items}
							pathname={pathname}
							open={openGroups[item.title] ?? false}
							onOpenChange={(open) =>
								setOpenGroups((prev) => ({ ...prev, [item.title]: open }))
							}
							onNavigate={onNavigate}
						/>
					) : (
						<NavLinkItem
							key={item.title}
							title={item.title}
							url={item.url}
							icon={item.icon}
							pathname={pathname}
							onNavigate={onNavigate}
						/>
					),
				)}
			</SidebarMenu>
		</SidebarGroup>
	);
}
