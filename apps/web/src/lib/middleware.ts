import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "./auth";

export const authMiddleware = createMiddleware({ type: "function" }).server(
	async ({ next }) => {
		const session = await auth.api.getSession({
			headers: getRequestHeaders(),
		});

		if (!session) {
			throw new Error("!Unauthorized");
		}

		return next({
			context: {
				user: session.user,
				session: session.session,
			},
		});
	},
);

export const agentMiddleWare = createMiddleware({ type: "function" })
	.middleware([authMiddleware])
	.server(async ({ next, context }) => {
		if (context?.user.role !== "agent" && context?.user.status === "pending") {
			throw new Error("Forbidden");
		}
		return next();
	});
