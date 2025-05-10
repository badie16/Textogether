import { ReactNode } from "react";
interface DashboardShellProps {
	children: ReactNode;
}
console.log("DashboardShell component loaded"); 
export function DashboardShell({ children }: DashboardShellProps) {
	return (
		<div className="flex min-h-screen flex-col">
			<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
				<div className="container flex h-16 items-center">
					<div className="mr-4 flex items-center">
						<span className="text-xl font-bold">TeXTogether</span>
					</div>
					<nav className="flex flex-1 items-center justify-end space-x-4">
						<span className="text-sm font-medium">user@example.com</span>
					</nav>
				</div>
			</header>
			<main className="flex-1 space-y-4 p-8 pt-6">
				<div className="container">{children}</div>
			</main>
		</div>
	);
}
