import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"
import { createAuth } from "./server.ts"

export function createAppAuthClient(baseURL: string) {
  return createAuthClient({
    baseURL,
    fetchOptions: {
      credentials: "include"
    },
    plugins: [
      inferAdditionalFields<ReturnType<typeof createAuth>>(),
    ]
  })
}
