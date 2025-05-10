import type React from "react";
import { AuthProvider } from "@/lib/auth";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<title>TeXTogether - Collaborative LaTeX Editor</title>
				<meta
					name="description"
					content="Real-time collaborative LaTeX editor with PDF preview"
				/>
			</head>
			<body>
				<Toaster />
				<AuthProvider>
					<ThemeProvider attribute="class" defaultTheme="light" enableSystem>
						{children}
						
					</ThemeProvider>
				</AuthProvider>
			</body>
		</html>
	);
}

export const metadata = {
	generator: "badie /tex-together",
};
