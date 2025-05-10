"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Save, Share, FileText, Settings } from "lucide-react"
import { ShareProjectDialog } from "@/components/share-project-dialog"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface EditorHeaderProps {
  projectId: string
  title: string
  onTitleChange: (title: string) => void
  onSave: () => Promise<void>
  isSaving: boolean
  lastSaved: Date | null
  onShowTemplates: () => void
}

export function EditorHeader({
  projectId,
  title,
  onTitleChange,
  onSave,
  isSaving,
  lastSaved,
  onShowTemplates,
}: EditorHeaderProps) {
  const [showShareDialog, setShowShareDialog] = useState(false)

  const formatLastSaved = () => {
    if (!lastSaved) return ""

    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }).format(lastSaved)
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <Input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="h-9 w-auto max-w-[300px] bg-transparent focus-visible:ring-transparent"
          />
          <div className="ml-4 text-xs text-muted-foreground">
            {lastSaved ? `Last saved at ${formatLastSaved()}` : "Not saved yet"}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onShowTemplates}>
              <FileText className="mr-2 h-4 w-4" />
              Templates
            </Button>
            <Button variant="outline" size="sm" onClick={onSave} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowShareDialog(true)}>
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onShowTemplates}>Change Template</DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open("/documentation", "_blank")}>
                  Documentation
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open("/keyboard-shortcuts", "_blank")}>
                  Keyboard Shortcuts
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <ShareProjectDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        projectId={projectId}
        projectTitle={title}
      />
    </>
  )
}
