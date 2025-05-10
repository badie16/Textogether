"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { withAuth } from "@/lib/auth"

function KeyboardShortcutsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Keyboard Shortcuts" text="Boost your productivity with these keyboard shortcuts.">
        <Button asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </DashboardHeader>
      <div className="grid gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Editor Shortcuts</h2>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left font-medium">Action</th>
                  <th className="p-3 text-left font-medium">Windows/Linux</th>
                  <th className="p-3 text-left font-medium">macOS</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-3">Save document</td>
                  <td className="p-3">
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">Ctrl</kbd> +{" "}
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">S</kbd>
                  </td>
                  <td className="p-3">
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">⌘</kbd> +{" "}
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">S</kbd>
                  </td>
                </tr>
                <tr>
                  <td className="p-3">Compile document</td>
                  <td className="p-3">
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">Ctrl</kbd> +{" "}
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">B</kbd>
                  </td>
                  <td className="p-3">
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">⌘</kbd> +{" "}
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">B</kbd>
                  </td>
                </tr>
                <tr>
                  <td className="p-3">Find</td>
                  <td className="p-3">
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">Ctrl</kbd> +{" "}
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">F</kbd>
                  </td>
                  <td className="p-3">
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">⌘</kbd> +{" "}
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">F</kbd>
                  </td>
                </tr>
                <tr>
                  <td className="p-3">Replace</td>
                  <td className="p-3">
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">Ctrl</kbd> +{" "}
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">H</kbd>
                  </td>
                  <td className="p-3">
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">⌘</kbd> +{" "}
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">H</kbd>
                  </td>
                </tr>
                <tr>
                  <td className="p-3">Undo</td>
                  <td className="p-3">
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">Ctrl</kbd> +{" "}
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">Z</kbd>
                  </td>
                  <td className="p-3">
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">⌘</kbd> +{" "}
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">Z</kbd>
                  </td>
                </tr>
                <tr>
                  <td className="p-3">Redo</td>
                  <td className="p-3">
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">Ctrl</kbd> +{" "}
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">Y</kbd>
                  </td>
                  <td className="p-3">
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">⌘</kbd> +{" "}
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">Shift</kbd> +{" "}
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">Z</kbd>
                  </td>
                </tr>
                <tr>
                  <td className="p-3">Show autocompletion</td>
                  <td className="p-3">
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">Ctrl</kbd> +{" "}
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">Space</kbd>
                  </td>
                  <td className="p-3">
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">⌘</kbd> +{" "}
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">Space</kbd>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">LaTeX Formatting Shortcuts</h2>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left font-medium">Action</th>
                  <th className="p-3 text-left font-medium">Windows/Linux</th>
                  <th className="p-3 text-left font-medium">macOS</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-3">Bold text</td>
                  <td className="p-3">
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">Alt</kbd> +{" "}
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">B</kbd>
                  </td>
                  <td className="p-3">
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">⌥</kbd> +{" "}
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">B</kbd>
                  </td>
                </tr>
                <tr>
                  <td className="p-3">Italic text</td>
                  <td className="p-3">
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">Alt</kbd> +{" "}
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">I</kbd>
                  </td>
                  <td className="p-3">
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">⌥</kbd> +{" "}
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">I</kbd>
                  </td>
                </tr>
                <tr>
                  <td className="p-3">Insert section</td>
                  <td className="p-3">
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">Alt</kbd> +{" "}
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">S</kbd>
                  </td>
                  <td className="p-3">
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">⌥</kbd> +{" "}
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">S</kbd>
                  </td>
                </tr>
                <tr>
                  <td className="p-3">Insert itemize environment</td>
                  <td className="p-3">
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">Alt</kbd> +{" "}
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">L</kbd>
                  </td>
                  <td className="p-3">
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">⌥</kbd> +{" "}
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">L</kbd>
                  </td>
                </tr>
                <tr>
                  <td className="p-3">Insert enumerate environment</td>
                  <td className="p-3">
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">Alt</kbd> +{" "}
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">E</kbd>
                  </td>
                  <td className="p-3">
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">⌥</kbd> +{" "}
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">E</kbd>
                  </td>
                </tr>
                <tr>
                  <td className="p-3">Insert figure environment</td>
                  <td className="p-3">
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">Alt</kbd> +{" "}
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">F</kbd>
                  </td>
                  <td className="p-3">
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">⌥</kbd> +{" "}
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">F</kbd>
                  </td>
                </tr>
                <tr>
                  <td className="p-3">Insert table environment</td>
                  <td className="p-3">
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">Alt</kbd> +{" "}
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">T</kbd>
                  </td>
                  <td className="p-3">
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">⌥</kbd> +{" "}
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">T</kbd>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Navigation Shortcuts</h2>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left font-medium">Action</th>
                  <th className="p-3 text-left font-medium">Windows/Linux</th>
                  <th className="p-3 text-left font-medium">macOS</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-3">Go to line</td>
                  <td className="p-3">
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">Ctrl</kbd> +{" "}
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">G</kbd>
                  </td>
                  <td className="p-3">
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">⌘</kbd> +{" "}
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">G</kbd>
                  </td>
                </tr>
                <tr>
                  <td className="p-3">Go to beginning of line</td>
                  <td className="p-3">
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">Home</kbd>
                  </td>
                  <td className="p-3">
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">⌘</kbd> +{" "}
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">←</kbd>
                  </td>
                </tr>
                <tr>
                  <td className="p-3">Go to end of line</td>
                  <td className="p-3">
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">End</kbd>
                  </td>
                  <td className="p-3">
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">⌘</kbd> +{" "}
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">→</kbd>
                  </td>
                </tr>
                <tr>
                  <td className="p-3">Go to beginning of document</td>
                  <td className="p-3">
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">Ctrl</kbd> +{" "}
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">Home</kbd>
                  </td>
                  <td className="p-3">
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">⌘</kbd> +{" "}
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">↑</kbd>
                  </td>
                </tr>
                <tr>
                  <td className="p-3">Go to end of document</td>
                  <td className="p-3">
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">Ctrl</kbd> +{" "}
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">End</kbd>
                  </td>
                  <td className="p-3">
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">⌘</kbd> +{" "}
                    <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs">↓</kbd>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}

export default withAuth(KeyboardShortcutsPage)
