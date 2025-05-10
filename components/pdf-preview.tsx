"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, Download } from "lucide-react"

interface PDFPreviewProps {
  latexContent: string
  isCompiling: boolean
  compilationResult: { url: string; errors: any[] } | null
}

export function PDFPreview({ latexContent, isCompiling, compilationResult }: PDFPreviewProps) {
  const [scale, setScale] = useState(1)
  const [showErrors, setShowErrors] = useState(false)

  // Handle zoom in/out
  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 2.5))
  }

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5))
  }

  const resetZoom = () => {
    setScale(1)
  }

  // Toggle error panel
  const toggleErrors = () => {
    setShowErrors((prev) => !prev)
  }

  // Download PDF
  const handleDownload = () => {
    if (!compilationResult?.url) return

    const a = document.createElement("a")
    a.href = compilationResult.url
    a.download = "document.pdf"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b bg-muted/40 px-4 py-2 flex items-center justify-between">
        <span className="text-sm font-medium">PDF Preview</span>
        <div className="flex items-center gap-2">
          {compilationResult?.errors && compilationResult.errors.length > 0 && (
            <Button
              variant={showErrors ? "default" : "outline"}
              size="sm"
              onClick={toggleErrors}
              className="flex items-center gap-1"
            >
              <AlertCircle className="h-4 w-4" />
              <span className="ml-1">{compilationResult.errors.length} Errors</span>
            </Button>
          )}
          <div className="flex items-center rounded-md border bg-background">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={zoomOut} disabled={scale <= 0.5}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={resetZoom}>
              {Math.round(scale * 100)}%
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={zoomIn} disabled={scale >= 2.5}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </Button>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleDownload}
            disabled={!compilationResult?.url}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-gray-100">
        {showErrors && compilationResult?.errors && compilationResult.errors.length > 0 ? (
          <div className="h-full overflow-auto bg-white p-4">
            <h3 className="mb-4 text-lg font-medium">Compilation Errors</h3>
            <div className="space-y-3">
              {compilationResult.errors.map((error, index) => (
                <div key={index} className="rounded-md border border-red-200 bg-red-50 p-3">
                  <div className="flex items-start">
                    <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-medium text-red-700">{error.type === "error" ? "Error" : "Warning"}</p>
                      <p className="text-sm text-red-600">{error.message}</p>
                      {error.line && <p className="mt-1 text-xs text-red-500">Line: {error.line}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : isCompiling ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-2 text-sm text-muted-foreground">Compiling LaTeX...</p>
            </div>
          </div>
        ) : compilationResult?.url ? (
          <div className="flex h-full items-center justify-center">
            <iframe
              src={compilationResult.url}
              className="h-full w-full"
              title="PDF Preview"
              style={{ transform: `scale(${scale})`, transformOrigin: "center top" }}
            />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Click "Compile" to see the PDF preview</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
