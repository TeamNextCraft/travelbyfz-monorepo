import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { TourForm } from "#/components/common/forms/tour-form";
import { createTour } from "#/server/actions/tours";

export const Route = createFileRoute("/_authenticated/tours/new")({
	component: CreateTourPage,
});

function CreateTourPage() {
	const navigate = useNavigate();

	return (
		<TourForm
			mode="create"
			onCancel={() => navigate({ to: "/tours" })}
			onSubmit={async (value) => {
				try {
					const result = await createTour({ data: value });
					toast.success(`Tour published! id: ${result.id}`);
					navigate({ to: "/tours/$tourId", params: { tourId: result.id } });
				} catch (error) {
					console.error("Failed to create tour", error);
					toast.error("Failed to create tour");
				}
			}}
		/>
	);
}
