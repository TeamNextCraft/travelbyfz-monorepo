import { Footer } from "#/components/common/domestic/footer.tsx";
import { DomesticNavbar } from "#/components/common/domestic/nav-bar.tsx";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/domestic")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main>
      <DomesticNavbar />
      <Outlet />
      <Footer />
    </main>
  );
}
