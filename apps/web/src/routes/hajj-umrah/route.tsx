import { HajjUmrahFooter } from "#/components/common/hajj-umrah/footer.tsx";
import { HajjUmrahNavbar } from "#/components/common/hajj-umrah/nav-bar.tsx";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/hajj-umrah")({
  component: HajjUmrahLayout,
});

function HajjUmrahLayout() {
  return (
    <>
      <HajjUmrahNavbar />
      <Outlet />
      <HajjUmrahFooter />
    </>
  );
}