import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
	children: React.ReactNode;
	defaultTheme?: Theme;
	storageKey?: string;
};

type ThemeProviderState = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
	theme: "system",
	setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

// This script runs before hydration to prevent the flash of unstyled content
function getThemeScript(storageKey: string, defaultTheme: Theme) {
	const key = JSON.stringify(storageKey);
	const fallback = JSON.stringify(defaultTheme);
	return `(function(){try{var t=localStorage.getItem(${key});if(t!=='light'&&t!=='dark'&&t!=='system'){t=${fallback}}var d=matchMedia('(prefers-color-scheme: dark)').matches;var r=t==='system'?(d?'dark':'light'):t;var e=document.documentElement;e.classList.add(r);e.style.colorScheme=r;}catch(e){}})();`;
}

export function ThemeProvider({
	children,
	defaultTheme = "system",
	storageKey = "vite-ui-theme",
	...props
}: ThemeProviderProps) {
	const [theme, setThemeState] = useState<Theme>(defaultTheme);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		const stored = localStorage.getItem(storageKey);
		setThemeState((stored as Theme) || defaultTheme);
		setMounted(true);
	}, [storageKey, defaultTheme]);

	const applyTheme = (theme: Theme) => {
		const root = window.document.documentElement;
		root.classList.remove("light", "dark");
		root.style.colorScheme = "";

		const resolved =
			theme === "system"
				? window.matchMedia("(prefers-color-scheme: dark)").matches
					? "dark"
					: "light"
				: theme;

		root.classList.add(resolved);
		root.style.colorScheme = resolved;
	};

	useEffect(() => {
		if (!mounted) return;
		applyTheme(theme);
	}, [theme, mounted]);

	useEffect(() => {
		if (!mounted || theme !== "system") return;
		const media = window.matchMedia("(prefers-color-scheme: dark)");
		const onChange = () => applyTheme("system");

		media.addEventListener("change", onChange);
		return () => media.removeEventListener("change", onChange);
	}, [theme, mounted]);

	const setTheme = (next: Theme) => {
		localStorage.setItem(storageKey, next);
		setThemeState(next);
	};

	return (
		<ThemeProviderContext.Provider value={{ theme, setTheme }} {...props}>
			<script
				dangerouslySetInnerHTML={{
					__html: getThemeScript(storageKey, defaultTheme),
				}}
			/>
			{children}
		</ThemeProviderContext.Provider>
	);
}

export const useTheme = () => {
	const context = useContext(ThemeProviderContext);
	if (context === undefined)
		throw new Error("useTheme must be used within a ThemeProvider");
	return context;
};
