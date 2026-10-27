import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { DepartureForm } from "#/components/common/forms/departure-form";
import { departureInsertSchema } from "#/lib/schema/departures";
import { getDeparture, updateDeparture } from "#/server/actions/departures";

export const Route = createFileRoute(
	"/_authenticated/tours/$tourId/departures/$departureId/edit",
)({
	loader: async ({ params }) => {
		const departure = await getDeparture({
			data: { id: params.departureId },
		});
		if (!departure) throw new Error("Departure not found");
		return departure; // must include `pricing: { roomType, price, compareAtPrice }[]`
	},
	component: EditDeparturePage,
});

function EditDeparturePage() {
	const departure = Route.useLoaderData();
	const { tourId, departureId } = Route.useParams();
	const navigate = useNavigate();
	const goBack = () => navigate({ to: "/tours/$tourId", params: { tourId } });

	// parse() strips id / createdAt / updatedAt
	const defaultValues = departureInsertSchema.parse(departure);

	return (
		<DepartureForm
			mode="edit"
			tourId={tourId}
			defaultValues={defaultValues}
			onCancel={goBack}
			onSubmit={async (value) => {
				try {
					await updateDeparture({ data: { id: departureId, ...value } });
					toast.success("Departure updated");
					goBack();
				} catch (error) {
					console.error("Failed to update departure", error);
					toast.error("Failed to update departure");
				}
			}}
		/>
	);
}
