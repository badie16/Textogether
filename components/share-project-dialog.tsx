"use client"

import type React from "react"

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import { Trash } from "lucide-react"

interface Collaborator {
  id: string
  email: string
  permission: string
}

interface ShareProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  projectTitle: string
}

export function ShareProjectDialog({ open, onOpenChange, projectId, projectTitle }: ShareProjectDialogProps) {
  const [email, setEmail] = useState("")
  const [permission, setPermission] = useState("viewer")
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      fetchCollaborators()
    }
  }, [open, projectId])

  const fetchCollaborators = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("document_permissions")
        .select(`
          id,
          user_id,
          permission_level,
          profiles (email)
        `)
        .eq("document_id", projectId)

      if (error) {
        throw error
      }

      const formattedCollaborators = data.map((item) => ({
        id: item.id,
        email: item.profiles?.email || "Unknown",
        permission: item.permission_level,
      }))

      setCollaborators(formattedCollaborators)
    } catch (error) {
      console.error("Error fetching collaborators:", error)
      toast({
        title: "Error",
        description: "Failed to load collaborators. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Email cannot be empty",
        variant: "destructive",
      })
      return
    }

    setIsSharing(true)

    try {
      // Check if user exists
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .single()

      if (userError && userError.code !== "PGRST116") {
        throw userError
      }

      if (userData) {
        // User exists, add permission
        const { error } = await supabase.from("document_permissions").upsert({
          document_id: projectId,
          user_id: userData.id,
          permission_level: permission,
        })

        if (error) {
          throw error
        }

        toast({
          title: "Success",
          description: `${email} now has ${permission} access to "${projectTitle}"`,
        })

        fetchCollaborators()
        setEmail("")
      } else {
        // User doesn't exist, create invitation
        const { error } = await supabase.from("document_invitations").insert({
          document_id: projectId,
          email,
          permission_level: permission,
          token: generateToken(),
        })

        if (error) {
          throw error
        }

        toast({
          title: "Invitation sent",
          description: `An invitation has been sent to ${email}`,
        })

        setEmail("")
      }
    } catch (error) {
      console.error("Error sharing project:", error)
      toast({
        title: "Error",
        description: "Failed to share the project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSharing(false)
    }
  }

  const handleRemoveCollaborator = async (collaboratorId: string) => {
    try {
      const { error } = await supabase.from("document_permissions").delete().eq("id", collaboratorId)

      if (error) {
        throw error
      }

      toast({
        title: "Collaborator removed",
        description: "The collaborator has been removed successfully.",
      })

      fetchCollaborators()
    } catch (error) {
      console.error("Error removing collaborator:", error)
      toast({
        title: "Error",
        description: "Failed to remove the collaborator. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdatePermission = async (collaboratorId: string, newPermission: string) => {
    try {
      const { error } = await supabase
        .from("document_permissions")
        .update({ permission_level: newPermission })
        .eq("id", collaboratorId)

      if (error) {
        throw error
      }

      toast({
        title: "Permission updated",
        description: "The collaborator's permission has been updated successfully.",
      })

      fetchCollaborators()
    } catch (error) {
      console.error("Error updating permission:", error)
      toast({
        title: "Error",
        description: "Failed to update the permission. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Share "{projectTitle}"</DialogTitle>
          <DialogDescription>Share this project with others to collaborate.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleShare}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-[1fr,auto,auto] gap-2">
              <Input
                placeholder="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Select value={permission} onValueChange={setPermission}>
                <SelectTrigger className="w-[110px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="commenter">Commenter</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" disabled={isSharing}>
                {isSharing ? "Sharing..." : "Share"}
              </Button>
            </div>

            <div className="mt-4">
              <Label>Collaborators</Label>
              <div className="mt-2 max-h-60 overflow-y-auto rounded-md border">
                {isLoading ? (
                  <div className="flex h-20 items-center justify-center">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                  </div>
                ) : collaborators.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">No collaborators yet</div>
                ) : (
                  <div className="divide-y">
                    {collaborators.map((collaborator) => (
                      <div key={collaborator.id} className="flex items-center justify-between p-3">
                        <span className="text-sm">{collaborator.email}</span>
                        <div className="flex items-center gap-2">
                          <Select
                            value={collaborator.permission}
                            onValueChange={(value) => handleUpdatePermission(collaborator.id, value)}
                          >
                            <SelectTrigger className="h-8 w-[100px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="viewer">Viewer</SelectItem>
                              <SelectItem value="commenter">Commenter</SelectItem>
                              <SelectItem value="editor">Editor</SelectItem>
                              <SelectItem value="owner">Owner</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveCollaborator(collaborator.id)}>
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Helper function to generate a random token
function generateToken() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
