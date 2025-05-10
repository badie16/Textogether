"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"

interface Folder {
  id: string
  name: string
}

interface Tag {
  id: string
  name: string
  color: string
}

interface FilterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onFilterApplied: (folder: string | null, tags: string[]) => void
  initialFolder: string | null
  initialTags: string[]
}

export function FilterDialog({ open, onOpenChange, onFilterApplied, initialFolder, initialTags }: FilterDialogProps) {
  const [folders, setFolders] = useState<Folder[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedFolder, setSelectedFolder] = useState<string | null>(initialFolder)
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      fetchFoldersAndTags()
    }
  }, [open])

  const fetchFoldersAndTags = async () => {
    setIsLoading(true)
    try {
      // Fetch folders
      const { data: folderData, error: folderError } = await supabase.from("folders").select("id, name").order("name")

      if (folderError) {
        throw folderError
      }

      // Fetch tags
      const { data: tagData, error: tagError } = await supabase
        .from("document_tags")
        .select("id, name, color")
        .order("name")

      if (tagError) {
        throw tagError
      }

      setFolders(folderData || [])
      setTags(tagData || [])
    } catch (error) {
      console.error("Error fetching folders and tags:", error)
      toast({
        title: "Error",
        description: "Failed to load filters. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleApplyFilter = () => {
    onFilterApplied(selectedFolder, selectedTags)
    onOpenChange(false)
  }

  const handleClearFilter = () => {
    setSelectedFolder(null)
    setSelectedTags([])
    onFilterApplied(null, [])
    onOpenChange(false)
  }

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Projects</DialogTitle>
          <DialogDescription>Filter your projects by folder and tags.</DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="folder">Folder</Label>
              <Select value={selectedFolder || ""} onValueChange={(value) => setSelectedFolder(value || null)}>
                <SelectTrigger id="folder">
                  <SelectValue placeholder="Select a folder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Folders</SelectItem>
                  {folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Tags</Label>
              <div className="max-h-40 overflow-y-auto rounded-md border p-2">
                {tags.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No tags available</p>
                ) : (
                  tags.map((tag) => (
                    <div key={tag.id} className="flex items-center space-x-2 py-1">
                      <Checkbox
                        id={`tag-${tag.id}`}
                        checked={selectedTags.includes(tag.id)}
                        onCheckedChange={() => handleTagToggle(tag.id)}
                      />
                      <Label htmlFor={`tag-${tag.id}`} className="flex items-center gap-2 text-sm font-normal">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: tag.color }}></div>
                        {tag.name}
                      </Label>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
        <DialogFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={handleClearFilter}>
            Clear Filters
          </Button>
          <Button type="button" onClick={handleApplyFilter}>
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
