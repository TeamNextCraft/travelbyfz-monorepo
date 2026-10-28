import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Clock, LogOut, Mail, RefreshCcw } from "lucide-react";
import { authClient } from "#/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/account-pending")({
	component: AccountPendingPage,
});

function AccountPendingPage() {
	const router = useRouter();

	const handleCheckStatus = async () => {
		// Invalidate the router cache to re-run the beforeLoad checks
		// and fetch the freshest session data.
		await router.invalidate();
	};

	const handleSignOut = async () => {
		await authClient.signOut();
		router.navigate({ to: "/sign-in" });
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
			<Card className="max-w-md w-full shadow-lg">
				<CardHeader className="text-center space-y-4">
					<div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
						<Clock className="w-10 h-10 text-primary" />
					</div>
					<div className="space-y-2">
						<CardTitle className="text-2xl font-bold tracking-tight">
							Account Pending Approval
						</CardTitle>
						<CardDescription className="text-base">
							Your account has been successfully created, but it requires
							administrator approval before you can access the dashboard.
						</CardDescription>
					</div>
				</CardHeader>

				<CardContent className="space-y-4">
					<div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground text-center">
						We will notify you via email once your account has been reviewed and
						approved by our team.
					</div>
				</CardContent>

				<CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-center">
					<Button
						variant="default"
						className="w-full sm:w-auto flex items-center gap-2"
						onClick={handleCheckStatus}
					>
						<RefreshCcw className="w-4 h-4" />
						Check Status
					</Button>

					<Button
						variant="outline"
						className="w-full sm:w-auto flex items-center gap-2"
						onClick={handleSignOut}
					>
						<LogOut className="w-4 h-4" />
						Sign Out
					</Button>
				</CardFooter>
			</Card>

			{/* Optional subtle support link at the bottom */}
			<div className="absolute bottom-8 text-sm text-muted-foreground flex items-center gap-2">
				Need help?
				<a
					href="mailto:support@yourdomain.com"
					className="hover:text-primary flex items-center gap-1 font-medium transition-colors"
				>
					<Mail className="w-3 h-3" /> Contact Support
				</a>
			</div>
		</div>
	);
}
