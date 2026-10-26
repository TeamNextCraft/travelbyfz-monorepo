import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "#/components/ui/button";
import { Field } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { uploadImage } from "#/server/actions/images";

export function ImageUploadField({
	field,
	label,
	hint,
	multiple = false,
}: {
	field: AnyFieldApi;
	label: string;
	hint?: string;
	multiple?: boolean;
}) {
	const [uploading, setUploading] = useState(false);

	const urls: string[] = multiple
		? (field.state.value ?? [])
		: field.state.value
			? [field.state.value]
			: [];

	async function handleFiles(files: FileList | null) {
		if (!files?.length) return;
		setUploading(true);

		try {
			const uploaded = await Promise.all(
				Array.from(files).map(async (file) => {
					const formData = new FormData();
					formData.append("file", file);
					const { url } = await uploadImage({ data: formData });
					return url;
				}),
			);

			field.handleChange(multiple ? [...urls, ...uploaded] : uploaded[0]);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Upload failed");
		} finally {
			setUploading(false);
		}
	}

	function remove(url: string) {
		if (!multiple) return field.handleChange(null);
		const next = urls.filter((u) => u !== url);
		field.handleChange(next.length ? next : null);
	}

	return (
		<Field field={field} label={label} hint={hint}>
			{urls.length > 0 && (
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
					{urls.map((url) => (
						<div
							key={url}
							className="relative aspect-video overflow-hidden rounded-lg border"
						>
							<img src={url} alt="" className="size-full object-cover" />
							<Button
								type="button"
								variant="secondary"
								size="icon"
								className="absolute right-1 top-1 size-7"
								aria-label="Remove image"
								onClick={() => remove(url)}
							>
								<X className="size-4" />
							</Button>
						</div>
					))}
				</div>
			)}
			<div className="flex items-center gap-3">
				<Input
					id={field.name}
					type="file"
					accept="image/jpeg,image/png,image/webp,image/avif"
					multiple={multiple}
					disabled={uploading}
					onChange={(e) => {
						handleFiles(e.target.files);
						e.target.value = ""; // allow re-selecting the same file
					}}
				/>
				{uploading && <Loader2 className="size-4 animate-spin" />}
			</div>
		</Field>
	);
}
