import { type AnyFieldApi } from "@tanstack/react-form-start";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "#/components/ui/field";
import { Textarea } from "../ui/textarea";

export function TextAreaField({
	field,
	label,
	description,
	placeholder,
	nullable = false,
}: {
	field: AnyFieldApi;
	label: string;
	description?: string;
	placeholder?: string;
	nullable?: boolean;
}) {
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

	return (
		<Field data-invalid={isInvalid}>
			<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
			<Textarea
				id={field.name}
				name={field.name}
				value={field.state.value ?? ""}
				onBlur={field.handleBlur}
				onChange={(e) => {
					const raw = e.target.value;
					field.handleChange(nullable && raw === "" ? null : raw);
				}}
				aria-invalid={isInvalid}
				placeholder={placeholder}
			/>
			{description && <FieldDescription>{description}</FieldDescription>}
			{isInvalid && <FieldError errors={field.state.meta.errors} />}
		</Field>
	);
}
