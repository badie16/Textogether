"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Send, Check, MessageSquare } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"

interface Comment {
  id: string
  author: {
    id: string
    name: string
    avatar: string
    initials: string
  }
  content: string
  timestamp: string
  line: number
  resolved: boolean
  resolvedBy?: {
    name: string
    timestamp: string
  }
}

interface CommentsPanelProps {
  documentId: string
}

export function CommentsPanel({ documentId }: CommentsPanelProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [showResolved, setShowResolved] = useState(false)
  const [currentLine, setCurrentLine] = useState<number | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchComments()

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`comments:${documentId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
          filter: `document_id=eq.${documentId}`,
        },
        () => {
          fetchComments()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [documentId])

  const fetchComments = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("comments")
        .select(`
          id,
          content,
          created_at,
          line_number,
          resolved,
          resolved_at,
          resolved_by,
          user_id,
          profiles:user_id (id, full_name, avatar_url, email)
        `)
        .eq("document_id", documentId)
        .order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      // Transform data
      const transformedComments: Comment[] = data.map((comment) => ({
        id: comment.id,
        author: {
          id: comment.profiles?.id || "",
          name: comment.profiles?.full_name || comment.profiles?.email || "Unknown",
          avatar: comment.profiles?.avatar_url || "",
          initials: getInitials(comment.profiles?.full_name || comment.profiles?.email || "Unknown"),
        },
        content: comment.content,
        timestamp: comment.created_at,
        line: comment.line_number || 0,
        resolved: comment.resolved || false,
        ...(comment.resolved &&
          comment.resolved_by && {
            resolvedBy: {
              name: "Someone", // In a real implementation, fetch the resolver's name
              timestamp: comment.resolved_at,
            },
          }),
      }))

      setComments(transformedComments)
    } catch (error) {
      console.error("Error fetching comments:", error)
      toast({
        title: "Error",
        description: "Failed to load comments. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const addComment = async () => {
    if (newComment.trim() === "") return

    setIsSending(true)
    try {
      const { data: userData } = await supabase.auth.getUser()

      if (!userData || !userData.user) {
        throw new Error("User not authenticated")
      }

      const { error } = await supabase.from("comments").insert({
        document_id: documentId,
        content: newComment,
        user_id: userData.user.id,
        line_number: currentLine || 1, // In a real implementation, this would be the current cursor position
      })

      if (error) {
        throw error
      }

      setNewComment("")
      fetchComments()
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully.",
      })
    } catch (error) {
      console.error("Error adding comment:", error)
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  const resolveComment = async (commentId: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser()

      if (!userData || !userData.user) {
        throw new Error("User not authenticated")
      }

      const { error } = await supabase
        .from("comments")
        .update({
          resolved: true,
          resolved_at: new Date().toISOString(),
          resolved_by: userData.user.id,
        })
        .eq("id", commentId)

      if (error) {
        throw error
      }

      fetchComments()
      toast({
        title: "Comment resolved",
        description: "The comment has been marked as resolved.",
      })
    } catch (error) {
      console.error("Error resolving comment:", error)
      toast({
        title: "Error",
        description: "Failed to resolve comment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const reopenComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from("comments")
        .update({
          resolved: false,
          resolved_at: null,
          resolved_by: null,
        })
        .eq("id", commentId)

      if (error) {
        throw error
      }

      fetchComments()
      toast({
        title: "Comment reopened",
        description: "The comment has been reopened.",
      })
    } catch (error) {
      console.error("Error reopening comment:", error)
      toast({
        title: "Error",
        description: "Failed to reopen comment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const deleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) {
      return
    }

    try {
      const { error } = await supabase.from("comments").delete().eq("id", commentId)

      if (error) {
        throw error
      }

      fetchComments()
      toast({
        title: "Comment deleted",
        description: "The comment has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting comment:", error)
      toast({
        title: "Error",
        description: "Failed to delete comment. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Filter comments based on resolved status
  const filteredComments = comments.filter((comment) => showResolved || !comment.resolved)

  return (
    <div className="flex h-full flex-col">
      <div className="border-b bg-muted/40 px-4 py-2 flex items-center justify-between">
        <span className="text-sm font-medium">Comments</span>
        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-resolved"
              checked={showResolved}
              onCheckedChange={(checked) => setShowResolved(!!checked)}
            />
            <label htmlFor="show-resolved" className="text-xs font-medium">
              Show resolved
            </label>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          </div>
        ) : filteredComments.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center text-center">
            <MessageSquare className="h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-muted-foreground">No comments yet</p>
            <p className="text-xs text-muted-foreground">Add a comment to start a discussion</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredComments.map((comment) => (
              <div
                key={comment.id}
                className={`flex gap-3 rounded-lg border p-3 ${comment.resolved ? "bg-muted/30" : ""}`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
                  <AvatarFallback>{comment.author.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{comment.author.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(comment.timestamp)} • Line {comment.line}
                    </span>
                    {comment.resolved && (
                      <Badge variant="outline" className="ml-auto bg-green-50 text-green-700">
                        Resolved
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm">{comment.content}</p>
                  {comment.resolved && comment.resolvedBy && (
                    <p className="text-xs text-muted-foreground">
                      Resolved by {comment.resolvedBy.name} on {formatTime(comment.resolvedBy.timestamp)}
                    </p>
                  )}
                  <div className="mt-2 flex justify-end gap-2">
                    {comment.resolved ? (
                      <Button size="sm" variant="outline" onClick={() => reopenComment(comment.id)}>
                        Reopen
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => resolveComment(comment.id)}>
                        <Check className="mr-1 h-3 w-3" />
                        Resolve
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500"
                      onClick={() => deleteComment(comment.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="border-t p-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-medium">Add comment</label>
              <div className="flex items-center gap-1">
                <label className="text-xs text-muted-foreground">Line:</label>
                <input
                  type="number"
                  className="h-6 w-16 rounded-md border px-2 text-xs"
                  value={currentLine || 1}
                  onChange={(e) => setCurrentLine(Number(e.target.value))}
                  min={1}
                />
              </div>
            </div>
            <Textarea
              placeholder="Add a comment..."
              className="min-h-[80px] resize-none"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-2 flex justify-end">
          <Button size="sm" onClick={addComment} disabled={isSending || newComment.trim() === ""}>
            <Send className="mr-2 h-4 w-4" />
            {isSending ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
  )
}
