import { type AnyFieldApi } from "@tanstack/react-form-start";
import { Field, FieldError, FieldLabel } from "#/components/ui/field";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select.tsx";

export function SelectField({
	field,
	label,
	placeholder,
	options,
}: {
	field: AnyFieldApi;
	label: string;
	placeholder: string;
	options: { value: string; label: string }[];
}) {
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

	return (
		<Field data-invalid={isInvalid}>
			<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
			<Select
				name={field.name}
				value={field.state.value ?? ""}
				onValueChange={(value) => field.handleChange(value)}
			>
				<SelectTrigger aria-invalid={isInvalid} className="min-w-[120px]">
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent position="item-aligned">
					{options.map((o) => (
						<SelectItem key={o.value} value={o.value}>
							{o.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			{isInvalid && <FieldError errors={field.state.meta.errors} />}
		</Field>
	);
}
