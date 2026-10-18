import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { safeRedirect } from "@/lib/safe-redirect";
import { auth } from "@/lib/auth";
import { getRequestHeaders, setResponseHeader } from "@tanstack/react-start/server";
import { getDb } from "@repo/db/client";
import { env } from "cloudflare:workers";
import { user } from "@repo/db/schema/auth.js";
import { eq } from "drizzle-orm";

export const getSession = createServerFn({ method: "GET" }).handler(async () => {
  return auth.api.getSession({ headers: getRequestHeaders() });
});

export const resolvePostSignIn = createServerFn({ method: "GET" })
  .validator(
    z.object({
      module: z.enum(["customer", "agent"]),
      redirect: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    setResponseHeader("Cache-Control", "private, no-store");

    const session = await auth.api.getSession({ headers: getRequestHeaders() });
    if (!session) return { status: "unauthenticated" as const };

    if (data.module === "customer") {
      return {
        status: "ok" as const,
        destination: safeRedirect(data.redirect) ?? "/domestic/",
      };
    }

    const profile = await getDb(env.DB)
      .select({ status: user.status })
      .from(user)
      .where(eq(user.id, session.user.id))
      .get();

    if (!profile) return { status: "not_agent" as const };
    if (profile.status === "pending") return { status: "agent_pending" as const };
    if (profile.status === "suspended") return { status: "agent_suspended" as const };

    return {
      status: "ok" as const,
      destination: safeRedirect(data.redirect) ?? "/domestic/",
    };
  });

export const getCurretUser = createServerFn({ method: "GET" })
  .handler(async () => {
    try {

      const headers = getRequestHeaders()

      const session = await auth.api.getSession({ headers });

      const user = session?.user;

      if (user) {

      }

    } catch (err) {
      console.error("Error fetching current user: ", err);
      throw err;
    }

  })
