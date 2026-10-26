import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { DestinationForm } from "#/components/common/forms/destination-form";
import { createDestination } from "#/server/actions/destinations";

export const Route = createFileRoute("/_authenticated/destinations/new")({
	component: CreateDestinationPage,
});

function CreateDestinationPage() {
	const navigate = useNavigate();
	return (
		<DestinationForm
			mode="create"
			onCancel={() => navigate({ to: "/destinations" })}
			onSubmit={async (value) => {
				try {
					const result = await createDestination({ data: value });
					toast.success(`Destination published! id: ${result.id}`);
					navigate({
						to: "/destinations/$destinationId",
						params: { destinationId: result.id },
					});
				} catch (error) {
					console.error("Failed to create destination: ", error);
					toast.error("Failed to create destination");
				}
			}}
		/>
	);
}
