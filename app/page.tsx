import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
export default function Home() {
	return (
		<div className=" flex min-h-screen flex-col">
			<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
				<div className="container flex h-16 items-center">
					<div className="mr-4 flex items-center">
						<span className="text-xl font-bold">TeXTogether</span>
					</div>
					<nav className="flex flex-1 items-center justify-end space-x-4">
						<Link href="/login" className="text-sm font-medium">
							Login
						</Link>
						<Button asChild>
							<Link href="/register">Get Started</Link>
						</Button>
					</nav>
				</div>
			</header>
			<main className="flex-1">
				<section className="w-full py-12 md:py-24 lg:py-32">
					<div className="container px-4 md:px-6">
						<div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
							<div className="space-y-4">
								<h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
									Collaborate on LaTeX documents in real-time
								</h1>
								<p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
									TeXTogether makes it easy to work on LaTeX documents with your
									team. Edit, comment, and see changes in real-time.
								</p>
								<div className="flex flex-col gap-2 min-[400px]:flex-row">
									<Button asChild size="lg">
										<Link href="/register">
											Get Started <ArrowRight className="ml-2 h-4 w-4" />
										</Link>
									</Button>
									<Button variant="outline" size="lg" asChild>
										<Link href="/demo">Try Demo</Link>
									</Button>
								</div>
							</div>
							<div className="flex items-center justify-center">
								<div className="relative w-full aspect-video overflow-hidden rounded-xl border bg-background shadow-xl">
									<div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
										<div className="absolute inset-0 bg-grid-black/5 dark:bg-grid-white/5 [mask-image:linear-gradient(to_bottom,transparent,black)]" />
									</div>
									<div className="relative p-4">
										<div className="grid grid-cols-2 gap-4 h-full">
											<div className="rounded-md border bg-background p-2 shadow-sm">
												<div className="h-6 w-full rounded bg-gray-100 dark:bg-gray-800 mb-2"></div>
												<div className="h-4 w-3/4 rounded bg-gray-100 dark:bg-gray-800 mb-2"></div>
												<div className="h-4 w-5/6 rounded bg-gray-100 dark:bg-gray-800 mb-2"></div>
												<div className="h-4 w-2/3 rounded bg-gray-100 dark:bg-gray-800"></div>
											</div>
											<div className="rounded-md border bg-white p-2 shadow-sm">
												<div className="h-full w-full rounded bg-gray-50 dark:bg-gray-900"></div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				<section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center justify-center space-y-4 text-center">
							<div className="space-y-2">
								<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
									Key Features
								</h2>
								<p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
									Everything you need to create professional LaTeX documents
									collaboratively
								</p>
							</div>
						</div>
						<div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
							<div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6 shadow-sm">
								<div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
									<svg
										className="h-6 w-6 text-gray-500 dark:text-gray-400"
										fill="none"
										height="24"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										viewBox="0 0 24 24"
										width="24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z" />
										<path d="M8 14v.5" />
										<path d="M16 14v.5" />
										<path d="M11.25 16.25h1.5L12 17l-.75-.75Z" />
									</svg>
								</div>
								<h3 className="text-xl font-bold">Real-time Collaboration</h3>
								<p className="text-sm text-gray-500 dark:text-gray-400 text-center">
									Edit documents simultaneously with your team members and see
									changes as they happen.
								</p>
							</div>
							<div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6 shadow-sm">
								<div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
									<svg
										className="h-6 w-6 text-gray-500 dark:text-gray-400"
										fill="none"
										height="24"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										viewBox="0 0 24 24"
										width="24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path d="M12 3v12" />
										<path d="m8 11 4 4 4-4" />
										<path d="M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4" />
									</svg>
								</div>
								<h3 className="text-xl font-bold">PDF Export</h3>
								<p className="text-sm text-gray-500 dark:text-gray-400 text-center">
									Compile and export your LaTeX documents to PDF with a single
									click.
								</p>
							</div>
							<div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6 shadow-sm">
								<div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
									<svg
										className="h-6 w-6 text-gray-500 dark:text-gray-400"
										fill="none"
										height="24"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										viewBox="0 0 24 24"
										width="24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
									</svg>
								</div>
								<h3 className="text-xl font-bold">Integrated Comments</h3>
								<p className="text-sm text-gray-500 dark:text-gray-400 text-center">
									Add comments and feedback directly in the document without
									disrupting the LaTeX code.
								</p>
							</div>
						</div>
					</div>
				</section>
			</main>
			<footer className="border-t py-6 md:py-0">
				<div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
					<p className="text-sm text-gray-500 dark:text-gray-400">
						© 2025 TeXTogether. All rights reserved.
					</p>
					<div className="flex gap-4">
						<Link
							href="/terms"
							className="text-sm text-gray-500 dark:text-gray-400"
						>
							Terms
						</Link>
						<Link
							href="/privacy"
							className="text-sm text-gray-500 dark:text-gray-400"
						>
							Privacy
						</Link>
					</div>
				</div>
			</footer>
		</div>
	);
}
