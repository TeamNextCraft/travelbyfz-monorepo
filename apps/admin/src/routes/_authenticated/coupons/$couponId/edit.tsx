import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { CouponForm } from "#/components/common/forms/coupon-form";
import { couponInsertSchema } from "#/lib/schema/coupon";
import { getCoupon, updateCoupon } from "#/server/actions/coupons";

export const Route = createFileRoute("/_authenticated/coupons/$couponId/edit")({
	loader: async ({ params }) => {
		const coupon = await getCoupon({ data: { id: params.couponId } });
		if (!coupon) throw new Error("Coupon not found");
		return coupon;
	},
	component: EditCouponPage,
});

function EditCouponPage() {
	const coupon = Route.useLoaderData();
	const { couponId } = Route.useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const goBack = () => navigate({ to: "/coupons", search: { page: 1 } });

	// parse() strips id, usedCount and createdAt, leaving only editable fields
	const defaultValues = couponInsertSchema.parse(coupon);

	return (
		<CouponForm
			mode="edit"
			defaultValues={defaultValues}
			usedCount={coupon.usedCount}
			onCancel={goBack}
			onSubmit={async (value) => {
				try {
					await updateCoupon({ data: { id: couponId, ...value } });
					toast.success("Coupon updated");
					queryClient.invalidateQueries({ queryKey: ["coupons"] });
					queryClient.invalidateQueries({ queryKey: ["coupons-stats"] });
					goBack();
				} catch (error) {
					toast.error(
						error instanceof Error ? error.message : "Failed to update coupon",
					);
				}
			}}
		/>
	);
}
