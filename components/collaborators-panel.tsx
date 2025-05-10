"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { UserPlus } from "lucide-react"
import { useYjs } from "@/hooks/use-yjs"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"

interface Collaborator {
  id: string
  name: string
  avatar: string
  initials: string
  color: string
  online: boolean
  permission?: string
}

interface CollaboratorsPanelProps {
  documentId: string
}

export function CollaboratorsPanel({ documentId }: CollaboratorsPanelProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({})
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isInviting, setIsInviting] = useState(false)
  const { toast } = useToast()

  // Get awareness info from Yjs
  const { awareness } = useYjs(documentId)

  // Fetch collaborators from Supabase
  useEffect(() => {
    fetchCollaborators()
  }, [documentId])

  // Update online status based on awareness states
  useEffect(() => {
    if (!awareness) return

    const updateOnlineUsers = () => {
      const states = awareness.getStates() as Map<number, any>
      const online: Record<string, boolean> = {}

      states.forEach((state) => {
        if (state.user && state.user.userId) {
          online[state.user.userId] = true
        }
      })

      setOnlineUsers(online)
    }

    // Initial update
    updateOnlineUsers()

    // Subscribe to changes
    awareness.on("change", updateOnlineUsers)

    return () => {
      awareness.off("change", updateOnlineUsers)
    }
  }, [awareness])

  const fetchCollaborators = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("document_permissions")
        .select(`
          id,
          permission_level,
          user_id,
          profiles:user_id (id, full_name, avatar_url, email)
        `)
        .eq("document_id", documentId)

      if (error) {
        throw error
      }

      // Transform data
      const transformedCollaborators: Collaborator[] = data.map((collab) => ({
        id: collab.user_id,
        name: collab.profiles?.full_name || collab.profiles?.email || "Unknown",
        avatar: collab.profiles?.avatar_url || "",
        initials: getInitials(collab.profiles?.full_name || collab.profiles?.email || "Unknown"),
        color: generateColor(collab.user_id),
        online: false,
        permission: collab.permission_level,
      }))

      setCollaborators(transformedCollaborators)
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

  // Get initials from name
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Generate a consistent color based on user ID
  const generateColor = (userId: string): string => {
    const colors = [
      "#f87171", // red
      "#fb923c", // orange
      "#fbbf24", // amber
      "#a3e635", // lime
      "#34d399", // emerald
      "#22d3ee", // cyan
      "#60a5fa", // blue
      "#a78bfa", // violet
      "#f472b6", // pink
    ]

    // Simple hash function to get a consistent index
    let hash = 0
    for (let i = 0; i < userId.length; i++) {
      hash = (hash + userId.charCodeAt(i)) % colors.length
    }

    return colors[hash]
  }

  // Add a new collaborator
  const addCollaborator = async () => {
    if (newCollaboratorEmail.trim() === "") return

    setIsInviting(true)
    try {
      // Check if user exists
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", newCollaboratorEmail)
        .single()

      if (userError && userError.code !== "PGRST116") {
        throw userError
      }

      if (userData) {
        // User exists, add permission
        const { error } = await supabase.from("document_permissions").upsert({
          document_id: documentId,
          user_id: userData.id,
          permission_level: "editor", // Default permission
        })

        if (error) {
          throw error
        }

        toast({
          title: "Collaborator added",
          description: `${newCollaboratorEmail} has been added as a collaborator.`,
        })

        fetchCollaborators()
        setNewCollaboratorEmail("")
      } else {
        // User doesn't exist, create invitation
        const { error } = await supabase.from("document_invitations").insert({
          document_id: documentId,
          email: newCollaboratorEmail,
          permission_level: "editor",
          token: generateToken(),
        })

        if (error) {
          throw error
        }

        toast({
          title: "Invitation sent",
          description: `An invitation has been sent to ${newCollaboratorEmail}`,
        })

        setNewCollaboratorEmail("")
      }
    } catch (error) {
      console.error("Error adding collaborator:", error)
      toast({
        title: "Error",
        description: "Failed to add collaborator. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsInviting(false)
    }
  }

  // Remove a collaborator
  const removeCollaborator = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this collaborator?")) {
      return
    }

    try {
      const { error } = await supabase
        .from("document_permissions")
        .delete()
        .eq("document_id", documentId)
        .eq("user_id", userId)

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
        description: "Failed to remove collaborator. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Generate a random token for invitations
  const generateToken = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  // Combine online status with collaborator data
  const collaboratorsWithStatus = collaborators.map((collaborator) => ({
    ...collaborator,
    online: !!onlineUsers[collaborator.id],
  }))

  return (
    <div className="flex h-full flex-col">
      <div className="border-b bg-muted/40 px-4 py-2">
        <span className="text-sm font-medium">Collaborators</span>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-medium">Current collaborators</h3>
              {collaboratorsWithStatus.length === 0 ? (
                <p className="text-sm text-muted-foreground">No collaborators yet</p>
              ) : (
                <div className="space-y-2">
                  {collaboratorsWithStatus.map((collaborator) => (
                    <div
                      key={collaborator.id}
                      className="flex items-center justify-between gap-2 rounded-md border p-2"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8" style={{ borderColor: collaborator.color, borderWidth: "2px" }}>
                          <AvatarImage src={collaborator.avatar || "/placeholder.svg"} alt={collaborator.name} />
                          <AvatarFallback style={{ backgroundColor: collaborator.color }}>
                            {collaborator.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm">{collaborator.name}</div>
                          <div className="text-xs text-muted-foreground">{collaborator.permission}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={collaborator.online ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"}
                        >
                          {collaborator.online ? "Online" : "Offline"}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500"
                          onClick={() => removeCollaborator(collaborator.id)}
                        >
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
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <h3 className="mb-2 text-sm font-medium">Invite collaborators</h3>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Email address"
                  value={newCollaboratorEmail}
                  onChange={(e) => setNewCollaboratorEmail(e.target.value)}
                />
                <Button size="sm" onClick={addCollaborator} disabled={isInviting}>
                  <UserPlus className="mr-1 h-4 w-4" />
                  {isInviting ? "Inviting..." : "Invite"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
