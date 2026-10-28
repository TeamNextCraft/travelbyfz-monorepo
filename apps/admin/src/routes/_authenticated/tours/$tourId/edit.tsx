import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { TourForm } from "#/components/common/forms/tour-form";
import { tourInsertSchema } from "#/lib/schema";
import { getTourDetails, updateTour } from "#/server/actions/tours";

export const Route = createFileRoute("/_authenticated/tours/$tourId/edit")({
	loader: async ({ params }) => {
		const tour = await getTourDetails({ data: { tourId: params.tourId } });
		if (!tour) throw new Error("Tour not found");
		return tour;
	},
	component: EditTourPage,
});

function EditTourPage() {
	const tour = Route.useLoaderData();
	const { tourId } = Route.useParams();
	const navigate = useNavigate();

	console.log({
		data: tour,
	});

	// parse() strips DB-only columns (id, createdAt, updatedAt, ...) so the
	// form only holds fields that exist in the insert schema.
	const defaultValues = tourInsertSchema.parse(tour);

	const goBack = () => navigate({ to: "/tours/$tourId", params: { tourId } });

	return (
		<TourForm
			mode="edit"
			defaultValues={defaultValues}
			onCancel={goBack}
			onSubmit={async (value) => {
				try {
					await updateTour({ data: { id: tourId, ...value } });
					toast.success("Tour updated");
					goBack();
				} catch (error) {
					console.error("Failed to update tour", error);
					toast.error("Failed to update tour");
				}
			}}
		/>
	);
}
