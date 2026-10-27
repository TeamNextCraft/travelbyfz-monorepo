import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { DepartureForm } from "#/components/common/forms/departure-form";
import { createDeparture } from "#/server/actions/departures";

export const Route = createFileRoute(
	"/_authenticated/tours/$tourId/departures/new",
)({
	component: CreateDeparturePage,
});

function CreateDeparturePage() {
	const { tourId } = Route.useParams();
	const navigate = useNavigate();
	const goBack = () => navigate({ to: "/tours/$tourId", params: { tourId } });

	return (
		<DepartureForm
			mode="create"
			tourId={tourId}
			onCancel={goBack}
			onSubmit={async (value) => {
				try {
					await createDeparture({ data: value });
					toast.success("Departure created");
					goBack();
				} catch (error) {
					console.error("Failed to create departure", error);
					toast.error("Failed to create departure");
				}
			}}
		/>
	);
}
