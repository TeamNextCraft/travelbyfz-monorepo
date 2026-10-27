// src/components/sidebar/nav-user.tsx
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ChevronsUpDown, Loader2, LogOut } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "#/components/ui/sidebar";
import { type AuthUser, authClient } from "#/lib/auth-client";

function getInitials(user: AuthUser) {
	const fromParts = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`;
	if (fromParts) return fromParts.toUpperCase();

	return (
		user.name
			.split(/\s+/)
			.filter(Boolean)
			.slice(0, 2)
			.map((part) => part[0])
			.join("")
			.toUpperCase() || "?"
	);
}

function UserInfo({ user }: { user: AuthUser }) {
	return (
		<>
			<Avatar className="h-8 w-8 rounded-lg">
				{/* No image -> falls through to the initials instead of a broken placeholder */}
				<AvatarImage src={user.image || undefined} alt={user.name} />
				<AvatarFallback className="rounded-lg">
					{getInitials(user)}
				</AvatarFallback>
			</Avatar>
			<div className="grid flex-1 text-left text-sm leading-tight">
				<span className="truncate font-medium">{user.name}</span>
				<span className="truncate text-xs">{user.email}</span>
			</div>
		</>
	);
}

export function NavUser({ user }: { user: AuthUser }) {
	const { isMobile } = useSidebar();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [isSigningOut, setIsSigningOut] = useState(false);

	const handleSignOut = async () => {
		setIsSigningOut(true);
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					// Drop cached admin data so the next person to sign in on this
					// browser can't see it.
					queryClient.clear();
					navigate({ to: "/sign-in", search: { redirect: "/" } });
				},
				onError: () => {
					toast.error("Couldn't sign you out. Please try again.");
				},
			},
		});
		setIsSigningOut(false);
	};

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<UserInfo user={user} />
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>

					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<UserInfo user={user} />
							</div>
						</DropdownMenuLabel>
						<DropdownMenuItem onClick={handleSignOut} disabled={isSigningOut}>
							{isSigningOut ? <Loader2 className="animate-spin" /> : <LogOut />}
							Sign out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
