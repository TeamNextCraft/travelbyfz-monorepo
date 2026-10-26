import type { TourItinerary } from "@repo/types/domestic/tour";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TextInputArray } from "../form/text-input-array";

interface OmitIdItinerary extends Omit<TourItinerary, "day"> {
	day: number | "";
}

interface ItineraryInputListProps {
	label: string;
	name: string;
	value: TourItinerary[] | null | undefined;
	onChange: (value: TourItinerary[]) => void;
	isTouched?: boolean;
	isValid?: boolean;
	errors?: any[];
}

const defaultState: OmitIdItinerary = {
	day: "",
	title: "",
	description: "",
	hotel: "",
	meals: [],
	highlights: [],
};

export function ItineraryInputList({
	label,
	name,
	value,
	onChange,
	isTouched,
	isValid,
	errors,
}: ItineraryInputListProps) {
	const items = value ?? [];
	const isInvalid = isTouched && !isValid;

	// Local state for the "new" itinerary day currently being constructed
	const [current, setCurrent] = useState<OmitIdItinerary>(defaultState);

	const handleAdd = () => {
		// Basic validation to ensure required fields aren't empty
		if (!current.day || !current.title.trim() || !current.description.trim()) {
			alert("Please fill out at least the Day, Title, and Description.");
			return;
		}

		const newItem: TourItinerary = {
			day: Number(current.day),
			title: current.title.trim(),
			description: current.description.trim(),
			hotel: current.hotel?.trim() || undefined,
			meals: current.meals,
			highlights: current.highlights ?? [],
		};

		// Sort the itinerary by day number before saving
		const newItems = [...items, newItem].sort((a, b) => a.day - b.day);
		onChange(newItems);

		// Reset form for the next day, automatically incrementing the day number
		setCurrent({ ...defaultState, day: Number(current.day) + 1 });
	};

	const handleRemove = (indexToRemove: number) => {
		const updated = items.filter((_, index) => index !== indexToRemove);
		onChange(updated);
	};

	return (
		<Field data-invalid={isInvalid} className="space-y-4">
			<FieldLabel htmlFor={name} className="text-lg font-semibold">
				{label}
			</FieldLabel>

			{/* List of Added Itinerary Days */}
			{items.length > 0 && (
				<div className="flex flex-col gap-3 mb-6">
					{items.map((item, index) => (
						<div
							key={index}
							className="flex flex-col p-4 bg-muted/30 border rounded-lg relative"
						>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={() => handleRemove(index)}
								className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
							>
								<Trash2 className="w-4 h-4" />
							</Button>
							<h4 className="font-bold">
								Day {item.day}: {item.title}
							</h4>
							<p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
								{item.description}
							</p>

							{(item.hotel ||
								(item.meals && item.meals.length > 0) ||
								item.highlights.length > 0) && (
								<div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs border-t pt-3">
									{item.hotel && (
										<div>
											<span className="font-semibold">Hotel:</span> {item.hotel}
										</div>
									)}
									{item.meals && item.meals.length > 0 && (
										<div>
											<span className="font-semibold">Meals:</span>{" "}
											{item.meals.join(", ")}
										</div>
									)}
									{item.highlights.length > 0 && (
										<div className="col-span-full">
											<span className="font-semibold">Highlights:</span>{" "}
											{item.highlights.join(" • ")}
										</div>
									)}
								</div>
							)}
						</div>
					))}
				</div>
			)}

			{/* Form to add a new Itinerary Day */}
			<div className="p-4 border border-dashed rounded-lg bg-background space-y-4">
				<h4 className="font-medium">Add New Day</h4>

				<div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-4">
					<div className="space-y-1">
						<FieldLabel>Day *</FieldLabel>
						<Input
							type="number"
							min="1"
							value={current.day}
							onChange={(e) => setCurrent({ ...current, day: e.target.value })}
							placeholder="e.g. 1"
						/>
					</div>
					<div className="space-y-1">
						<FieldLabel>Title *</FieldLabel>
						<Input
							value={current.title}
							onChange={(e) =>
								setCurrent({ ...current, title: e.target.value })
							}
							placeholder="e.g. Arrival in Paris"
						/>
					</div>
				</div>

				<div className="space-y-1">
					<FieldLabel>Description *</FieldLabel>
					<Textarea
						value={current.description}
						onChange={(e) =>
							setCurrent({ ...current, description: e.target.value })
						}
						placeholder="Describe the day's activities..."
						className="min-h-[80px]"
					/>
				</div>

				<div className="space-y-1">
					<FieldLabel>Hotel (Optional)</FieldLabel>
					<Input
						value={current.hotel}
						onChange={(e) => setCurrent({ ...current, hotel: e.target.value })}
						placeholder="e.g. Ritz Paris"
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Reusing your TagInputList component for Meals */}
					<TextInputArray
						label="Meals (Optional)"
						name={`${name}-meals`}
						placeholder="e.g. Breakfast, Lunch"
						value={current.meals}
						onChange={(meals) => setCurrent({ ...current, meals })}
					/>

					{/* Reusing your TagInputList component for Highlights */}
					<TextInputArray
						label="Highlights *"
						name={`${name}-highlights`}
						placeholder="e.g. Eiffel Tower"
						value={current.highlights}
						onChange={(highlights) => setCurrent({ ...current, highlights })}
					/>
				</div>

				<Button type="button" onClick={handleAdd} className="w-full">
					<Plus className="w-4 h-4 mr-2" /> Add Day to Itinerary
				</Button>
			</div>

			{isInvalid && errors && <FieldError errors={errors} />}
		</Field>
	);
}
