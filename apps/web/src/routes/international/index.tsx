import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BriefcaseBusiness, Globe2, Landmark } from "lucide-react";
import { buttonVariants } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";

export const Route = createFileRoute("/international/")({
	component: InternationalTrips,
});

function InternationalTrips() {
	return (
		<main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
			<section className="page-wrap py-8">
				<Link
					to="/"
					className={buttonVariants({
						variant: "ghost",
						className: "font-bold",
					})}
				>
					<ArrowLeft size={16} aria-hidden="true" />
					Choose another service
				</Link>

				<div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.85fr] lg:items-stretch">
					<Card className="island-shell rounded-lg bg-transparent p-6 sm:p-8">
						<p className="island-kicker">International trips</p>
						<h1 className="display-title mt-3 text-4xl font-bold leading-tight sm:text-5xl">
							Holiday planning for families, groups, and business travellers.
						</h1>
						<p className="mt-4 max-w-2xl text-base leading-7 text-[var(--sea-ink-soft)]">
							Give international bookings their own interface for destinations,
							itineraries, hotels, flights, insurance, and visa assistance.
						</p>

						<div className="mt-8 grid gap-3 sm:grid-cols-3">
							{[
								["Global routes", Globe2],
								["City breaks", Landmark],
								["Business travel", BriefcaseBusiness],
							].map(([label, Icon]) => (
								<CardContent
									key={label as string}
									className="rounded-lg border border-[var(--line)] bg-white/60 p-4"
								>
									<Icon size={22} aria-hidden="true" />
									<p className="mt-3 text-sm font-extrabold">
										{label as string}
									</p>
								</CardContent>
							))}
						</div>
					</Card>

					<img
						src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1100&q=80"
						alt=""
						className="h-full min-h-[340px] w-full rounded-lg object-cover shadow-[0_22px_54px_rgba(23,58,64,0.16)]"
					/>
				</div>
			</section>
		</main>
	);
}
