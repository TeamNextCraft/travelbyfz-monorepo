import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Heart, Loader2, LockKeyhole } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getMyTourInterest, registerTourInterest } from "#/server/actions/tours";


export function TourInterestButton({
  tourId,
  userId,
  isUserSessionFetching
}: {
  tourId: string,
  userId: string,
  isUserSessionFetching: boolean,
}) {
  const queryClient = useQueryClient();

  const fetchInterest = useServerFn(getMyTourInterest);
  const submitInterest = useServerFn(registerTourInterest);

  // Include the user ID so cached state is not shared between accounts.
  const interestKey = [
    "tour-interest",
    tourId,
    userId ?? null,
  ] as const;

  const interestQuery = useQuery({
    queryKey: interestKey,
    queryFn: () =>
      fetchInterest({
        data: { tourId },
      }),
    enabled: Boolean(userId),
    staleTime: 0,
    retry: false,
  });

  const interestMutation = useMutation({
    mutationFn: () =>
      submitInterest({
        data: { tourId },
      }),

    onSuccess: (result) => {
      queryClient.setQueryData(interestKey, {
        interested: true,
      });

      toast.success(
        result.alreadyRegistered
          ? "You’ve already registered your interest."
          : "Interest registered. Our team can contact you about future departures.",
      );
    },

    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not register your interest. Please try again.",
      );
    },
  });

  if (isUserSessionFetching) {
    return (
      <Button className="w-full gap-2" disabled>
        <Loader2 size={16} className="animate-spin" />
        Checking sign-in…
      </Button>
    );
  }

  if (!userId) {
    return (
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full gap-2"
          disabled
        >
          <LockKeyhole size={16} />
          Sign in to register interest
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Sign in using the navigation above, then register your interest.
        </p>
      </div>
    );
  }

  if (interestQuery.isPending) {
    return (
      <Button className="w-full gap-2" disabled>
        <Loader2 size={16} className="animate-spin" />
        Checking your interest…
      </Button>
    );
  }

  if (interestQuery.isError) {
    return (
      <div className="space-y-2">
        <p role="alert" className="text-xs text-destructive">
          Could not check your interest status.
        </p>

        <Button
          variant="outline"
          className="w-full"
          disabled={interestQuery.isFetching}
          onClick={() => void interestQuery.refetch()}
        >
          {interestQuery.isFetching ? "Retrying…" : "Try again"}
        </Button>
      </div>
    );
  }

  const interested = interestQuery.data?.interested === true;

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant={interested ? "outline" : "default"}
        className="w-full gap-2"
        disabled={interested || interestMutation.isPending}
        onClick={() => interestMutation.mutate()}
      >
        {interestMutation.isPending ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Registering…
          </>
        ) : interested ? (
          <>
            <CheckCircle2 size={16} />
            Interest registered
          </>
        ) : (
          <>
            <Heart size={16} />
            I’m interested
          </>
        )}
      </Button>

      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        {interested
          ? "Our team can contact you about future departures."
          : "Register interest so our team can contact you about future departures."}
      </p>
    </div>
  );
}
