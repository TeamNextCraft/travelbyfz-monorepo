import { type AnyFieldApi } from "@tanstack/react-form-start";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "#/components/ui/field";
import { Checkbox } from "../ui/checkbox";

export function CheckboxField({
	field,
	label,
	description,
}: {
	field: AnyFieldApi;
	label: string;
	description: string;
}) {
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

	return (
		<Field data-invalid={isInvalid} orientation="horizontal">
			<Checkbox
				id={field.name}
				name={field.name}
				checked={field.state.value}
				onCheckedChange={(checked) => field.handleChange(checked === true)}
				aria-invalid={isInvalid}
			/>
			<FieldContent>
				<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
				<FieldDescription>{description}</FieldDescription>
			</FieldContent>
			{isInvalid && <FieldError errors={field.state.meta.errors} />}
		</Field>
	);
}
