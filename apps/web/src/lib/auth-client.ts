import { createAppAuthClient } from "@repo/auth/client"
export const authClient = createAppAuthClient(import.meta.env.VITE_BETTER_AUTH_BASE_URL)
