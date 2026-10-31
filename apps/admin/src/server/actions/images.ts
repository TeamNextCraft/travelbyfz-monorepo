import { env } from "cloudflare:workers";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { adminMiddleware } from "#/lib/auth-middleware";

const ALLOWED_TYPES: Record<string, string> = {
	"image/jpeg": "jpg",
	"image/png": "png",
	"image/webp": "webp",
	"image/avif": "avif",
};
const MAX_BYTES = 5 * 1024 * 1024; // 5mb max size

export const uploadImage = createServerFn({ method: "POST" })
	.middleware([adminMiddleware])
	.validator(
		z.object({
			file: z
				.instanceof(File, { error: "Please select a valid file" })
				.refine((file) => file.size <= MAX_BYTES, {
					error: "File size must be 5MB or less.",
				})
				.refine((file) => ALLOWED_TYPES[file.type], {
					error: "Only .jpg, .jpeg, .png and .webp formats are supported.",
				}),
			fileLocation: z.enum(["tours", "destinations"]),
		}),
	)
	.handler(async ({ data: { file, fileLocation } }) => {
		const key = `${fileLocation}/${crypto.randomUUID().slice(4)}_${file.name}.${ALLOWED_TYPES[file.type]}`;

		await env.IMAGES.put(key, await file.arrayBuffer(), {
			httpMetadata: {
				contentType: file.type,
				cacheControl: "public, max-age=31536000, immutable",
			},
		});

		return { key, url: `https://images.travelbyfz.com/${key}` };
	});
