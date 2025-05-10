"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"

interface CreateTagDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTagCreated: () => void
}

export function CreateTagDialog({ open, onOpenChange, onTagCreated }: CreateTagDialogProps) {
  const [tagName, setTagName] = useState("")
  const [tagColor, setTagColor] = useState("#3b82f6")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!tagName.trim()) {
      toast({
        title: "Error",
        description: "Tag name cannot be empty",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const { data: userData } = await supabase.auth.getUser()

      if (!userData || !userData.user) {
        throw new Error("User not authenticated")
      }

      const { data, error } = await supabase
        .from("document_tags")
        .insert({
          name: tagName,
          color: tagColor,
          owner_id: userData.user.id,
        })
        .select()

      if (error) {
        throw error
      }

      toast({
        title: "Success",
        description: `Tag "${tagName}" created successfully`,
      })
      onTagCreated()
      setTagName("")
      setTagColor("#3b82f6")
      onOpenChange(false)
    } catch (error) {
      console.error("Error creating tag:", error)
      toast({
        title: "Error",
        description: "Failed to create tag. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Tag</DialogTitle>
            <DialogDescription>Create a new tag to categorize your LaTeX documents.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Tag Name</Label>
              <Input id="name" value={tagName} onChange={(e) => setTagName(e.target.value)} placeholder="Research" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="color">Tag Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="color"
                  type="color"
                  value={tagColor}
                  onChange={(e) => setTagColor(e.target.value)}
                  className="h-10 w-20"
                />
                <div className="h-10 w-10 rounded-md border" style={{ backgroundColor: tagColor }}></div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Tag"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
