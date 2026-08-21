import type * as React from "react";
import { cn } from "#/lib/utils";

export function NavigationMenu({
	className,
	...props
}: React.ComponentProps<"nav">) {
	return (
		<nav
			data-slot="navigation-menu"
			aria-label="Primary"
			className={cn("relative flex max-w-max flex-1 items-center", className)}
			{...props}
		/>
	);
}

export function NavigationMenuList({
	className,
	...props
}: React.ComponentProps<"ul">) {
	return (
		<ul
			data-slot="navigation-menu-list"
			className={cn(
				"group flex flex-1 list-none items-center gap-1",
				className,
			)}
			{...props}
		/>
	);
}

export function NavigationMenuItem({
	className,
	...props
}: React.ComponentProps<"li">) {
	return (
		<li
			data-slot="navigation-menu-item"
			className={cn("relative", className)}
			{...props}
		/>
	);
}

export function navigationMenuTriggerStyle(className?: string) {
	return cn(
		"inline-flex h-9 items-center justify-center rounded-md px-3 py-2 text-sm font-bold text-[var(--sea-ink-soft)] transition-colors hover:bg-white/70 hover:text-[var(--sea-ink)] focus:bg-white/70 focus:text-[var(--sea-ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lagoon)] disabled:pointer-events-none disabled:opacity-50",
		className,
	);
}

export function NavigationMenuButton({
	className,
	...props
}: React.ComponentProps<"button">) {
	return (
		<button
			type="button"
			data-slot="navigation-menu-button"
			className={navigationMenuTriggerStyle(className)}
			{...props}
		/>
	);
}

export function NavigationMenuLink({
	className,
	...props
}: React.ComponentProps<"a">) {
	return (
		<a
			data-slot="navigation-menu-link"
			className={navigationMenuTriggerStyle(className)}
			{...props}
		/>
	);
}
