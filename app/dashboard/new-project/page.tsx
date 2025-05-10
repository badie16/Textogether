"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { withAuth } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { getLatexTemplates } from "@/lib/latex-compiler"

function NewProjectPage() {
  const [title, setTitle] = useState("Untitled Document")
  const [description, setDescription] = useState("")
  const [template, setTemplate] = useState("article")
  const [folder, setFolder] = useState("")
  const [folders, setFolders] = useState<{ id: string; name: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingFolders, setIsLoadingFolders] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const templates = getLatexTemplates()

  // Fetch folders
  useState(() => {
    const fetchFolders = async () => {
      try {
        const { data, error } = await supabase.from("folders").select("id, name").order("name")

        if (error) {
          throw error
        }

        setFolders(data || [])
      } catch (error) {
        console.error("Error fetching folders:", error)
        toast({
          title: "Error",
          description: "Failed to load folders. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingFolders(false)
      }
    }

    fetchFolders()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data: userData } = await supabase.auth.getUser()

      if (!userData || !userData.user) {
        throw new Error("User not authenticated")
      }

      // Get template content
      const selectedTemplate = templates.find((t) => t.id === template)
      const templateContent =
        selectedTemplate?.content || "\\documentclass{article}\n\\begin{document}\n\n\\end{document}"

      // Create document
      const { data, error } = await supabase
        .from("documents")
        .insert({
          title,
          content: templateContent,
          owner_id: userData.user.id,
          folder_id: folder || null,
          description: description || null,
        })
        .select()

      if (error) {
        throw error
      }

      if (data && data[0]) {
        toast({
          title: "Project created",
          description: "Your new LaTeX project has been created successfully.",
        })
        router.push(`/editor/${data[0].id}`)
      }
    } catch (error) {
      console.error("Error creating project:", error)
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Create New Project" text="Start a new LaTeX document from scratch or use a template." />
      <div className="grid gap-4">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>Enter the details for your new LaTeX project.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My LaTeX Document"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A brief description of your document"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="template">Template</Label>
                  <Select value={template} onValueChange={setTemplate}>
                    <SelectTrigger id="template">
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="folder">Folder (Optional)</Label>
                  <Select value={folder} onValueChange={setFolder}>
                    <SelectTrigger id="folder">
                      <SelectValue placeholder="Select a folder" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {folders.map((f) => (
                        <SelectItem key={f.id} value={f.id}>
                          {f.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.push("/dashboard")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Project"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </DashboardShell>
  )
}

export default withAuth(NewProjectPage)
