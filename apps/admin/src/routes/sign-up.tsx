import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { SignUpForm } from "#/components/common/sign-up-form";

export const Route = createFileRoute("/sign-up")({
	validateSearch: z.object({
		redirect: z.string().optional(),
	}),
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<Link
					to="/"
					className="flex items-center gap-2 self-center font-medium"
				>
					<div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
						<img src="/logo.png" alt="FZ Tours & Travels" />
					</div>
					FZ Tours & Travels.
				</Link>
				<SignUpForm />
			</div>
		</div>
	);
}
