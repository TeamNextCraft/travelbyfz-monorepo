import { resolvePostSignIn } from "#/server/actions/auth";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/continue")({
  validateSearch: (s: Record<string, unknown>) => ({
    module: (s.module === "agent" ? "agent" : "customer") as "customer" | "agent",
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
  }),
  beforeLoad: async ({ search }) => {
    const result = await resolvePostSignIn({
      data: { module: search.module, redirect: search.redirect },
    });

    if (result.status === "unauthenticated") {
      throw redirect({ to: "/sign-in", search: { module: search.module } });
    }
    if (result.status === "ok") {
      throw redirect({ href: result.destination });
    }
    throw redirect({
      to: "/sign-in",
      search: { module: "agent", notice: result.status },
    });
  },
  component: () => null,
});
