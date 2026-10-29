import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { CouponForm } from "#/components/common/forms/coupon-form";
import { createCoupon } from "#/server/actions/coupons";

export const Route = createFileRoute("/_authenticated/coupons/new")({
	component: CreateCouponPage,
});

function CreateCouponPage() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const goBack = () => navigate({ to: "/coupons", search: { page: 1 } });

	return (
		<CouponForm
			mode="create"
			onCancel={goBack}
			onSubmit={async (value) => {
				try {
					await createCoupon({ data: value });
					toast.success("Coupon created");
					queryClient.invalidateQueries({ queryKey: ["coupons"] });
					queryClient.invalidateQueries({ queryKey: ["coupons-stats"] });
					goBack();
				} catch (error) {
					// e.g. "A coupon with this code already exists"
					toast.error(
						error instanceof Error ? error.message : "Failed to create coupon",
					);
				}
			}}
		/>
	);
}
