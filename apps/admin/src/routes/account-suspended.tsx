import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Ban, LogOut, Mail, ShieldAlert } from "lucide-react";
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

export const Route = createFileRoute("/account-suspended")({
	component: AccountSuspendedPage,
});

function AccountSuspendedPage() {
	const router = useRouter();

	const handleSignOut = async () => {
		await authClient.signOut();
		router.navigate({ to: "/sign-in" });
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
			<Card className="max-w-md w-full shadow-lg border-destructive/20">
				<CardHeader className="text-center space-y-4">
					<div className="mx-auto bg-destructive/10 p-4 rounded-full w-fit">
						<Ban className="w-10 h-10 text-destructive" />
					</div>
					<div className="space-y-2">
						<CardTitle className="text-2xl font-bold tracking-tight text-destructive">
							Account Suspended
						</CardTitle>
						<CardDescription className="text-base">
							Your access to the dashboard has been temporarily suspended due to
							unusual activity or a violation of our terms of service.
						</CardDescription>
					</div>
				</CardHeader>

				<CardContent className="space-y-4">
					<div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground flex items-start gap-3">
						<ShieldAlert className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
						<p>
							If you believe this is an error or wish to appeal this decision,
							please reach out to our support team with your account details.
						</p>
					</div>
				</CardContent>

				<CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-center">
					<Button
						variant="default"
						className="w-full sm:w-auto flex items-center gap-2 bg-destructive hover:bg-destructive/90"
						asChild
					>
						<a href="mailto:support@yourdomain.com?subject=Account%20Suspension%20Appeal">
							<Mail className="w-4 h-4" />
							Contact Support
						</a>
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
		</div>
	);
}
