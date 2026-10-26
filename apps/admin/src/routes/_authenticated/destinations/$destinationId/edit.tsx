import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { DestinationForm } from "#/components/common/forms/destination-form";
import { destinationInsertSchema } from "#/lib/schema/destinations";
import {
	getDestinationDetails,
	updateDestination,
} from "#/server/actions/destinations";

export const Route = createFileRoute(
	"/_authenticated/destinations/$destinationId/edit",
)({
	loader: async ({ params }) => {
		const dest = await getDestinationDetails({
			data: { destinationId: params.destinationId },
		});
		if (!dest) throw new Error("Destination not found");
		return dest;
	},
	component: EditDestinationPage,
});

function EditDestinationPage() {
	const dest = Route.useLoaderData();
	const { destinationId } = Route.useParams();
	const navigate = useNavigate();

	const defaultValues = destinationInsertSchema.parse(dest);

	const goBack = () =>
		navigate({ to: "/destinations/$destinationId", params: { destinationId } });

	return (
		<DestinationForm
			mode="edit"
			defaultValues={defaultValues}
			onCancel={goBack}
			onSubmit={async (value) => {
				try {
					await updateDestination({ data: { id: destinationId, ...value } });
					toast.success("Destination updated");
					goBack();
				} catch (error) {
					console.error("Failed to update destination", error);
					toast.error("Failed to update destination");
				}
			}}
		/>
	);
}
