import { env } from "cloudflare:workers";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/images/$")({
	server: {
		handlers: {
			GET: async ({ params }) => {
				const object = await env.IMAGES.get(params._splat ?? "");
				if (!object) return new Response("Not found", { status: 404 });

				const headers = new Headers();
				object.writeHttpMetadata(headers);
				headers.set("etag", object.httpEtag);

				return new Response(object.body, { headers });
			},
		},
	},
});
