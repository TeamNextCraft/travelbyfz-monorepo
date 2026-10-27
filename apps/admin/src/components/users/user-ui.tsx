import { useState } from "react";
import { Badge } from "#/components/ui/badge";

const ROLE_STYLES: Record<string, string> = {
	admin: "border-purple-200 bg-purple-50 text-purple-700",
	agent: "border-blue-200 bg-blue-50 text-blue-700",
	customer: "border-slate-200 bg-slate-100 text-slate-600",
};

const STATUS_STYLES: Record<string, string> = {
	pending: "border-amber-200 bg-amber-50 text-amber-700",
	approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
	suspended: "border-red-200 bg-red-50 text-red-700",
};

const FALLBACK = "border-slate-200 bg-slate-100 text-slate-600";

const capitalise = (v: string) => v.charAt(0).toUpperCase() + v.slice(1);

export function RoleBadge({ role }: { role: string }) {
	return (
		<Badge variant="outline" className={ROLE_STYLES[role] ?? FALLBACK}>
			{capitalise(role)}
		</Badge>
	);
}

export function AccountStatusBadge({ status }: { status: string }) {
	return (
		<Badge variant="outline" className={STATUS_STYLES[status] ?? FALLBACK}>
			{capitalise(status)}
		</Badge>
	);
}

const SIZES = {
	sm: "size-8 text-xs",
	md: "size-10 text-sm",
	lg: "size-16 text-xl",
} as const;

export function UserAvatar({
	name,
	image,
	size = "md",
}: {
	name: string;
	image?: string | null;
	size?: keyof typeof SIZES;
}) {
	const [failed, setFailed] = useState(false);
	const initials =
		name
			.split(/\s+/)
			.filter(Boolean)
			.slice(0, 2)
			.map((p) => p[0]?.toUpperCase())
			.join("") || "?";

	if (image && !failed) {
		return (
			<img
				src={image}
				alt={name}
				onError={() => setFailed(true)}
				className={`${SIZES[size]} shrink-0 rounded-full border object-cover`}
			/>
		);
	}

	return (
		<div
			className={`${SIZES[size]} flex shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary`}
			aria-hidden="true"
		>
			{initials}
		</div>
	);
}

/** Very small user-agent summariser: "Chrome on Windows". */
export function describeUserAgent(ua?: string | null) {
	if (!ua) return "Unknown device";
	const browser = /Edg\//.test(ua)
		? "Edge"
		: /OPR\/|Opera/.test(ua)
			? "Opera"
			: /Chrome\//.test(ua)
				? "Chrome"
				: /Firefox\//.test(ua)
					? "Firefox"
					: /Safari\//.test(ua)
						? "Safari"
						: "Browser";
	const os = /Windows/.test(ua)
		? "Windows"
		: /Android/.test(ua)
			? "Android"
			: /iPhone|iPad|iOS/.test(ua)
				? "iOS"
				: /Mac OS X/.test(ua)
					? "macOS"
					: /Linux/.test(ua)
						? "Linux"
						: "unknown OS";
	return `${browser} on ${os}`;
}

export const fullName = (u: {
	name: string;
	firstName?: string | null;
	lastName?: string | null;
}) => [u.firstName, u.lastName].filter(Boolean).join(" ") || u.name;
