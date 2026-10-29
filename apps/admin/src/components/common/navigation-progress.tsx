import { useProgress } from "@bprogress/react";
import { useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

export function NavigationProgress() {
	const isLoading = useRouterState({ select: (s) => s.isLoading });
	const { start, stop, setOptions } = useProgress();

	setOptions({
		showSpinner: false,
	});

	useEffect(() => {
		if (isLoading) {
			start();
		} else {
			stop();
		}
	}, [isLoading]);
	return null;
}
