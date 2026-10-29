import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { NavigationProgress } from "#/components/common/navigation-progress";
import { AppSidebar } from "#/components/common/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "#/components/ui/sidebar";
import { getSession } from "#/server/actions/users";

export const Route = createFileRoute("/_authenticated")({
	head: () => ({
		links: [
			{
				rel: "icon",
				href: "/favicon.ico",
			},
		],
	}),
	beforeLoad: async ({ location }) => {
		const session = await getSession();
		if (!session) {
			throw redirect({
				to: "/sign-in",
				search: {
					redirect: location.href,
				},
			});
		}

		switch (session.user.status) {
			case "pending":
				throw redirect({
					to: "/account-pending",
				});

			case "suspended":
				throw redirect({
					to: "/account-suspended",
				});
		}

		return { session };
	},
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<SidebarProvider>
			<NavigationProgress />
			<AppSidebar />
			<SidebarInset>
				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	);
}
