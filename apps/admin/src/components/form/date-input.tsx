import type { AnyFieldApi } from "@tanstack/react-form-start";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";

/** Date | string | null -> "yyyy-mm-dd" in LOCAL time, as <input type="date"> expects. */
function toInputValue(value: unknown) {
	if (!value) return "";
	const date = value instanceof Date ? value : new Date(value as string);
	if (Number.isNaN(date.getTime())) return "";
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * "yyyy-mm-dd" -> Date in local time. Building it from parts avoids the
 * UTC off-by-one you get from new Date("yyyy-mm-dd").
 */
function fromInputValue(raw: string, endOfDay: boolean) {
	if (!raw) return null;
	const [y, m, d] = raw.split("-").map(Number);
	return endOfDay ? new Date(y, m - 1, d, 23, 59, 59) : new Date(y, m - 1, d);
}

export function DateField({
	field,
	label,
	description,
	endOfDay = false,
}: {
	field: AnyFieldApi;
	label: string;
	description?: string;
	/** Store 23:59:59 instead of 00:00. Use for "valid until" style fields. */
	endOfDay?: boolean;
}) {
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

	return (
		<Field data-invalid={isInvalid}>
			<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
			<Input
				id={field.name}
				name={field.name}
				type="date"
				value={toInputValue(field.state.value)}
				onBlur={field.handleBlur}
				onChange={(e) =>
					field.handleChange(fromInputValue(e.target.value, endOfDay))
				}
				aria-invalid={isInvalid}
			/>
			{description && <FieldDescription>{description}</FieldDescription>}
			{isInvalid && <FieldError errors={field.state.meta.errors} />}
		</Field>
	);
}
