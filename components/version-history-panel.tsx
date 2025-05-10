"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import { DiffEditor } from "@monaco-editor/react"

interface Version {
  id: string
  createdAt: Date
  authorName: string
  description: string
  content: string
}

interface VersionHistoryPanelProps {
  documentId: string
  onRestoreVersion: (content: string) => void
}

export function VersionHistoryPanel({ documentId, onRestoreVersion }: VersionHistoryPanelProps) {
  const [versions, setVersions] = useState<Version[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null)
  const [compareVersion, setCompareVersion] = useState<Version | null>(null)
  const [isCreatingVersion, setIsCreatingVersion] = useState(false)
  const [versionDescription, setVersionDescription] = useState("")
  const [showDiff, setShowDiff] = useState(false)
  const { toast } = useToast()

  // Load version history from Supabase
  useEffect(() => {
    fetchVersionHistory()
  }, [documentId])

  const fetchVersionHistory = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("document_versions")
        .select("*")
        .eq("document_id", documentId)
        .order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      // Process the data
      const formattedVersions: Version[] = data.map((version) => ({
        id: version.id,
        createdAt: new Date(version.created_at),
        authorName: version.author_name || "Unknown",
        description: version.description || "No description",
        content: version.content || "",
      }))

      setVersions(formattedVersions)
    } catch (error) {
      console.error("Error loading version history:", error)
      toast({
        title: "Error",
        description: "Failed to load version history. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  // Restore a specific version
  const restoreVersion = async (version: Version) => {
    try {
      // First, create a new version to save the current state
      const { data: currentDoc } = await supabase.from("documents").select("content").eq("id", documentId).single()

      if (currentDoc) {
        // Save current state as a version
        await supabase.from("document_versions").insert({
          document_id: documentId,
          content: currentDoc.content,
          description: "State before restoration",
        })
      }

      // Restore the selected version
      onRestoreVersion(version.content)

      toast({
        title: "Version restored",
        description: `Document restored to version from ${formatDate(version.createdAt)}`,
      })
    } catch (error) {
      console.error("Error restoring version:", error)
      toast({
        title: "Error",
        description: "Failed to restore version. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Create a new version
  const createVersion = async () => {
    if (!versionDescription.trim()) {
      toast({
        title: "Description required",
        description: "Please provide a description for this version",
        variant: "destructive",
      })
      return
    }

    setIsCreatingVersion(true)
    try {
      const { data: userData } = await supabase.auth.getUser()
      const { data: currentDoc } = await supabase.from("documents").select("content").eq("id", documentId).single()

      if (!currentDoc) {
        throw new Error("Document not found")
      }

      const { data, error } = await supabase
        .from("document_versions")
        .insert({
          document_id: documentId,
          content: currentDoc.content,
          description: versionDescription,
          author_id: userData?.user?.id,
          author_name: userData?.user?.user_metadata?.full_name || userData?.user?.email,
        })
        .select()

      if (error) {
        throw error
      }

      toast({
        title: "Version saved",
        description: "Your document version has been saved successfully",
      })

      setVersionDescription("")
      fetchVersionHistory()
    } catch (error) {
      console.error("Error creating version:", error)
      toast({
        title: "Error",
        description: "Failed to save version. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreatingVersion(false)
    }
  }

  // Compare two versions
  const handleCompare = (version: Version) => {
    if (!selectedVersion) {
      setSelectedVersion(version)
    } else if (selectedVersion.id === version.id) {
      setSelectedVersion(null)
    } else {
      setCompareVersion(version)
      setShowDiff(true)
    }
  }

  // Close diff view
  const closeDiff = () => {
    setShowDiff(false)
    setSelectedVersion(null)
    setCompareVersion(null)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b bg-muted/40 px-4 py-2 flex items-center justify-between">
        <span className="text-sm font-medium">Version History</span>
        {!showDiff && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Version description"
              className="h-8 rounded-md border px-3 text-sm"
              value={versionDescription}
              onChange={(e) => setVersionDescription(e.target.value)}
            />
            <Button size="sm" onClick={createVersion} disabled={isCreatingVersion}>
              {isCreatingVersion ? "Saving..." : "Save Version"}
            </Button>
          </div>
        )}
        {showDiff && (
          <Button size="sm" variant="outline" onClick={closeDiff}>
            Close Diff
          </Button>
        )}
      </div>
      <div className="flex-1 overflow-auto">
        {showDiff && selectedVersion && compareVersion ? (
          <div className="h-full">
            <div className="border-b bg-muted/20 p-2 text-sm">
              <div>
                <span className="font-medium">Comparing:</span>
                <span className="ml-2">{formatDate(compareVersion.createdAt)}</span>
                <span className="mx-2">vs</span>
                <span>{formatDate(selectedVersion.createdAt)}</span>
              </div>
            </div>
            <DiffEditor
              height="calc(100% - 40px)"
              original={selectedVersion.content}
              modified={compareVersion.content}
              language="latex"
              options={{
                readOnly: true,
                renderSideBySide: true,
              }}
            />
          </div>
        ) : isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          </div>
        ) : versions.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center p-4 text-center">
            <p className="text-muted-foreground">No version history available.</p>
            <p className="mt-2 text-sm text-muted-foreground">Save a version to keep track of important changes.</p>
          </div>
        ) : (
          <div className="space-y-4 p-4">
            {versions.map((version) => (
              <div
                key={version.id}
                className={`rounded-md border p-3 transition-colors hover:bg-muted/50 ${
                  selectedVersion?.id === version.id ? "border-primary bg-muted/50" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{formatDate(version.createdAt)}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleCompare(version)}>
                      {selectedVersion?.id === version.id ? "Cancel" : "Compare"}
                    </Button>
                    <Button size="sm" onClick={() => restoreVersion(version)}>
                      Restore
                    </Button>
                  </div>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">By {version.authorName}</div>
                <div className="mt-2 text-sm">{version.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
