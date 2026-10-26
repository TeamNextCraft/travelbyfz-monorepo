import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function ToursPendingComponent() {
	return (
		<main className="min-w-0 space-y-6 p-4 md:p-6 lg:p-8">
			{/* Page header skeleton */}
			<section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<div className="space-y-2">
					<Skeleton className="h-8 w-[150px]" />
					<Skeleton className="h-4 w-[300px]" />
				</div>
				<Skeleton className="h-10 w-[120px]" />
			</section>

			{/* Statistics skeleton */}
			<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<Card key={i} className="gap-4 py-5">
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between gap-3">
								<Skeleton className="h-4 w-[100px]" />
								<Skeleton className="size-10 rounded-lg" />
							</div>
							<Skeleton className="h-8 w-[60px]" />
							<Skeleton className="h-3 w-[140px]" />
						</CardContent>
					</Card>
				))}
			</section>

			{/* Table skeleton */}
			<Card className="gap-0 overflow-hidden py-0">
				<div className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center">
					<div className="space-y-2">
						<Skeleton className="h-6 w-[100px]" />
						<Skeleton className="h-4 w-[250px]" />
					</div>
					<Skeleton className="h-6 w-[60px] rounded-full" />
				</div>

				<div className="flex flex-col gap-3 border-y bg-muted/20 p-4 lg:flex-row lg:items-center">
					<Skeleton className="h-9 flex-1 lg:max-w-sm" />
					<div className="grid grid-cols-2 gap-3 sm:flex">
						<Skeleton className="h-9 w-[140px]" />
						<Skeleton className="h-9 w-[120px]" />
						<Skeleton className="size-9 hidden sm:block" />
					</div>
				</div>

				<div className="p-5">
					{Array.from({ length: 5 }).map((_, i) => (
						<div
							key={i}
							className="flex items-center justify-between py-4 border-b last:border-0"
						>
							<div className="flex items-center gap-4">
								<Skeleton className="size-11 rounded-lg" />
								<div className="space-y-2">
									<Skeleton className="h-5 w-[200px]" />
									<Skeleton className="h-4 w-[150px]" />
								</div>
							</div>
							<div className="hidden sm:flex items-center gap-8">
								<Skeleton className="h-6 w-[80px]" />
								<Skeleton className="h-6 w-[100px]" />
								<Skeleton className="h-6 w-[80px]" />
								<Skeleton className="size-8" />
							</div>
						</div>
					))}
				</div>
			</Card>
		</main>
	);
}
