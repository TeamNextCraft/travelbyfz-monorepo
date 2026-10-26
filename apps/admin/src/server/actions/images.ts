import { env } from "cloudflare:workers";
import { createServerFn } from "@tanstack/react-start";
import { adminMiddleware } from "#/lib/auth-middleware";

const ALLOWED_TYPES: Record<string, string> = {
	"image/jpeg": "jpg",
	"image/png": "png",
	"image/webp": "webp",
	"image/avif": "avif",
};
const MAX_BYTES = 5 * 1024 * 1024;

export const uploadImage = createServerFn({ method: "POST" })
	.middleware([adminMiddleware])
	.validator((data: unknown) => {
		if (!(data instanceof FormData)) throw new Error("Expected form data");

		const file = data.get("file");
		if (!(file instanceof File)) throw new Error("No file provided");
		if (!ALLOWED_TYPES[file.type]) {
			throw new Error("Only JPEG, PNG, WebP or AVIF images are allowed");
		}
		if (file.size > MAX_BYTES) throw new Error("Image must be under 5 MB");

		return { file };
	})
	.handler(async ({ data: { file } }) => {
		const key = `tours/${crypto.randomUUID()}.${ALLOWED_TYPES[file.type]}`;

		await env.IMAGES.put(key, await file.arrayBuffer(), {
			httpMetadata: {
				contentType: file.type,
				cacheControl: "public, max-age=31536000, immutable",
			},
		});

		return { key, url: `${env.IMAGES_PUBLIC_URL}/${key}` };
	});
