import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Footer } from "#/components/common/domestic/footer.tsx";
import { DomesticNavbar } from "#/components/common/domestic/nav-bar.tsx";
import { NavigationProgress } from "#/components/common/navigation-progress";

export const Route = createFileRoute("/domestic")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<main>
			<DomesticNavbar />
			<NavigationProgress />
			<Outlet />
			<Footer />
		</main>
	);
}
