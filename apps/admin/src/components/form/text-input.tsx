import { type AnyFieldApi } from "@tanstack/react-form-start";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";

export function TextField({
	field,
	label,
	description,
	placeholder,
	type = "text",
	nullable = false,
}: {
	field: AnyFieldApi;
	label: string;
	description?: string;
	placeholder?: string;
	type?: "text" | "number";
	/** empty input becomes null instead of "" / 0 */
	nullable?: boolean;
}) {
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

	return (
		<Field data-invalid={isInvalid}>
			<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
			<Input
				id={field.name}
				name={field.name}
				type={type}
				value={field.state.value ?? ""}
				onBlur={field.handleBlur}
				onChange={(e) => {
					const raw = e.target.value;
					if (type === "number") {
						field.handleChange(
							raw === "" ? (nullable ? null : 0) : Number(raw),
						);
					} else {
						field.handleChange(nullable && raw === "" ? null : raw);
					}
				}}
				aria-invalid={isInvalid}
				placeholder={placeholder}
			/>
			{description && <FieldDescription>{description}</FieldDescription>}
			{isInvalid && <FieldError errors={field.state.meta.errors} />}
		</Field>
	);
}
