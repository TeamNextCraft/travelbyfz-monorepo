import { createFileRoute, Link } from "@tanstack/react-router";
import {
	Globe,
	Map,
	MapPin,
	MoreHorizontal,
	Pencil,
	Plus,
	Search,
	Trash2,
} from "lucide-react";

import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { Input } from "#/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";

// NOTE: Replace this with your actual database type from Drizzle
type DestinationRow = {
	id: string;
	name: string;
	slug: string;
	state: string;
	country: string;
	region: string | null;
	tourCount: number;
	isActive: boolean;
	isFeatured: boolean;
};

// MOCK DATA: Remove this when integrating with TanStack Router's loader
const mockDestinations: DestinationRow[] = [
	{
		id: "dst_1",
		name: "Kashmir",
		slug: "kashmir",
		state: "Jammu & Kashmir",
		country: "India",
		region: "North",
		tourCount: 12,
		isActive: true,
		isFeatured: true,
	},
	{
		id: "dst_2",
		name: "Kerala",
		slug: "kerala",
		state: "Kerala",
		country: "India",
		region: "South",
		tourCount: 8,
		isActive: true,
		isFeatured: false,
	},
	{
		id: "dst_3",
		name: "Goa",
		slug: "goa",
		state: "Goa",
		country: "India",
		region: "West",
		tourCount: 15,
		isActive: false,
		isFeatured: false,
	},
];

export const Route = createFileRoute("/_authenticated/destinations/")({
	component: DestinationsIndexPage,
});

export function DestinationsIndexPage({
	destinations = mockDestinations, // Accept data as props from your route loader
}: {
	destinations?: DestinationRow[];
}) {
	return (
		<main className="min-w-0 space-y-6 p-4 md:p-6 lg:p-8">
			{/* Page header */}
			<section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
						Destinations
					</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						Manage travel destinations and their localized content.
					</p>
				</div>

				<Button asChild>
					{/* Update 'to' with your actual tanstack router path */}
					<Link to="/destinations/new">
						<Plus className="mr-2 size-4" />
						Add destination
					</Link>
				</Button>
			</section>

			<Card>
				<CardHeader>
					<CardTitle>All Destinations</CardTitle>
					<CardDescription>
						View and manage all locations available in your catalog.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						{/* Search Bar */}
						<div className="relative max-w-sm flex-1">
							<Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
							<Input
								type="search"
								placeholder="Search destinations..."
								className="pl-9"
							/>
						</div>

						{/* Optional filters could go here */}
					</div>

					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-[300px]">Destination</TableHead>
									<TableHead>Location</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Tours</TableHead>
									<TableHead className="w-[70px]"></TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{destinations.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={5}
											className="h-24 text-center text-muted-foreground"
										>
											No destinations found.
										</TableCell>
									</TableRow>
								) : (
									destinations.map((destination) => (
										<TableRow key={destination.id}>
											{/* Name & Slug */}
											<TableCell>
												<div className="flex items-center gap-3">
													<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
														<MapPin className="size-5 text-primary" />
													</div>
													<div>
														<p className="font-medium">{destination.name}</p>
														<p className="text-xs text-muted-foreground">
															/{destination.slug}
														</p>
													</div>
												</div>
											</TableCell>

											{/* Location details */}
											<TableCell>
												<div className="space-y-1 text-sm">
													<div className="flex items-center gap-1.5 text-muted-foreground">
														<Map className="size-3.5" />
														{destination.state}
													</div>
													<div className="flex items-center gap-1.5 text-muted-foreground">
														<Globe className="size-3.5" />
														{destination.country}
														{destination.region && ` • ${destination.region}`}
													</div>
												</div>
											</TableCell>

											{/* Status Badges */}
											<TableCell>
												<div className="flex flex-wrap gap-2">
													<Badge
														variant={
															destination.isActive ? "default" : "secondary"
														}
													>
														{destination.isActive ? "Active" : "Inactive"}
													</Badge>
													{destination.isFeatured && (
														<Badge
															variant="outline"
															className="border-amber-500/30 text-amber-600 bg-amber-50"
														>
															Featured
														</Badge>
													)}
												</div>
											</TableCell>

											{/* Associated Tours Count */}
											<TableCell className="text-right font-medium">
												{destination.tourCount}
											</TableCell>

											{/* Actions */}
											<TableCell>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" className="size-8 p-0">
															<span className="sr-only">Open menu</span>
															<MoreHorizontal className="size-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent
														align="end"
														className="w-[160px]"
													>
														<DropdownMenuLabel>Actions</DropdownMenuLabel>
														<DropdownMenuSeparator />
														<DropdownMenuItem asChild>
															<Link
																to="/destinations/$destinationId/edit"
																params={{ destinationId: destination.id }}
															>
																<Pencil className="mr-2 size-4" />
																Edit
															</Link>
														</DropdownMenuItem>
														<DropdownMenuItem className="text-destructive focus:text-destructive">
															<Trash2 className="mr-2 size-4" />
															Delete
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>
		</main>
	);
}
