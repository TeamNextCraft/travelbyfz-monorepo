import { createAppAuthClient } from "@repo/auth/client";

export const authClient = createAppAuthClient(import.meta.env.VITE_BETTER_AUTH_BASE_URL);

export type AuthUser = typeof authClient.$Infer.Session.user;
export type AuthSession = typeof authClient.$Infer.Session;
