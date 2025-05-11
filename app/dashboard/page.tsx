"use client"
import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search, FolderPlus, Tag, Filter } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { ProjectCard } from "@/components/project-card"
import { useToast } from "@/components/ui/use-toast"
import { withAuth } from "@/lib/auth"
import { useAuth } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { CreateFolderDialog } from "@/components/create-folder-dialog"
import { CreateTagDialog } from "@/components/create-tag-dialog"
import { FilterDialog } from "@/components/filter-dialog"

interface Project {
  id: string
  title: string
  updated_at: string
  collaborators: number
  tags?: { id: string; name: string; color: string }[]
  folder?: { id: string; name: string }
}

function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [showCreateTag, setShowCreateTag] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const { toast } = useToast()
  const { user } = useAuth() // Utiliser le hook useAuth pour accéder à l'utilisateur authentifié

  useEffect(() => {
    if (user) {
      fetchProjects()
    }
  }, [user, selectedFolder, selectedTags])

  const fetchProjects = async () => {
    if (!user) {
      console.error("User not authenticated")
      return
    }

    setIsLoading(true)
    try {
      // Utiliser directement l'ID de l'utilisateur depuis le hook useAuth
      const userId = user.id

      // Requête simplifiée pour éviter la récursion
      // 1. Récupérer les documents dont l'utilisateur est propriétaire
      const { data: ownedDocs, error: ownedError } = await supabase
        .from("documents")
        .select("id, title, updated_at")
        .eq("owner_id", userId)
        .order("updated_at", { ascending: false })

      if (ownedError) throw ownedError

      // 2. Récupérer les documents partagés avec l'utilisateur
      const { data: sharedDocs, error: sharedError } = await supabase
        .from("document_permissions")
        .select("document_id")
        .eq("user_id", userId)

      if (sharedError) throw sharedError

      // 3. Si l'utilisateur a des documents partagés, les récupérer
      let sharedDocuments = []
      if (sharedDocs && sharedDocs.length > 0) {
        const sharedIds = sharedDocs.map((doc) => doc.document_id)
        const { data: sharedDocData, error: sharedDocError } = await supabase
          .from("documents")
          .select("id, title, updated_at")
          .in("id", sharedIds)
          .order("updated_at", { ascending: false })

        if (sharedDocError) throw sharedDocError
        sharedDocuments = sharedDocData || []
      }

      // Combiner les documents possédés et partagés
      let allDocuments = [...(ownedDocs || []), ...sharedDocuments]

      // Appliquer le filtre de dossier si sélectionné
      if (selectedFolder && allDocuments.length > 0) {
        const { data: folderDocs } = await supabase
          .from("document_folder_relations")
          .select("document_id")
          .eq("folder_id", selectedFolder)

        if (folderDocs && folderDocs.length > 0) {
          const folderDocIds = new Set(folderDocs.map((doc) => doc.document_id))
          allDocuments = allDocuments.filter((doc) => folderDocIds.has(doc.id))
        } else {
          // Aucun document dans ce dossier
          setProjects([])
          setIsLoading(false)
          return
        }
      }

      // Appliquer le filtre de tags si sélectionné
      if (selectedTags.length > 0 && allDocuments.length > 0) {
        const { data: tagRelations } = await supabase
          .from("document_tag_relations")
          .select("document_id, tag_id")
          .in("tag_id", selectedTags)

        if (tagRelations && tagRelations.length > 0) {
          const taggedDocIds = new Set()
          tagRelations.forEach((relation) => {
            taggedDocIds.add(relation.document_id)
          })

          allDocuments = allDocuments.filter((doc) => taggedDocIds.has(doc.id))
        } else {
          // Aucun document avec ces tags
          setProjects([])
          setIsLoading(false)
          return
        }
      }

      // Appliquer le filtre de recherche
      if (searchQuery) {
        allDocuments = allDocuments.filter((doc) => doc.title.toLowerCase().includes(searchQuery.toLowerCase()))
      }

      // Obtenir le nombre de collaborateurs pour chaque document
      const transformedProjects = await Promise.all(
        allDocuments.map(async (doc) => {
          const { data: permissions } = await supabase
            .from("document_permissions")
            .select("user_id")
            .eq("document_id", doc.id)

          return {
            id: doc.id,
            title: doc.title,
            updated_at: doc.updated_at,
            collaborators: permissions ? permissions.length : 0,
          }
        }),
      )

      setProjects(transformedProjects)
    } catch (error) {
      console.error("Error fetching projects:", error)
      toast({
        title: "Error",
        description: "Failed to load your projects. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleCreateProject = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a project.",
        variant: "destructive",
      })
      return
    }

    try {
      const { data, error } = await supabase
        .from("documents")
        .insert({
          title: "Untitled Document",
          content:
            "\\documentclass{article}\n\\title{Untitled Document}\n\\author{}\n\\date{\\today}\n\n\\begin{document}\n\n\\maketitle\n\n\\section{Introduction}\n\n\\end{document}",
          owner_id: user.id,
        })
        .select()

      if (error) {
        throw error
      }

      if (data && data[0]) {
        window.location.href = `/editor/${data[0].id}`
      }
    } catch (error) {
      console.error("Error creating project:", error)
      toast({
        title: "Error",
        description: "Failed to create a new project. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleFolderCreated = (folderId: string) => {
    setSelectedFolder(folderId)
    fetchProjects()
  }

  const handleTagCreated = () => {
    fetchProjects()
  }

  const handleFilterApplied = (folder: string | null, tags: string[]) => {
    setSelectedFolder(folder)
    setSelectedTags(tags)
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Projects" text="Create and manage your LaTeX projects.">
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => setShowCreateFolder(true)}>
            <FolderPlus className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setShowCreateTag(true)}>
            <Tag className="h-4 w-4" />
          </Button>
          <Button asChild onClick={handleCreateProject}>
            <Link href="#">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Link>
          </Button>
        </div>
      </DashboardHeader>
      <div className="grid gap-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search projects..."
              className="w-full appearance-none bg-background pl-8 shadow-none"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <Button variant="outline" onClick={() => setShowFilter(true)}>
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} onUpdate={fetchProjects} />
            ))}
            <Card className="flex h-full flex-col items-center justify-center border-dashed p-6">
              <div className="flex flex-col items-center justify-center space-y-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium">Create a new project</h3>
                <p className="text-sm text-muted-foreground">
                  Start a new LaTeX document from scratch or use a template.
                </p>
              </div>
              <Button className="mt-6" variant="outline" onClick={handleCreateProject}>
                Create Project
              </Button>
            </Card>
          </div>
        )}
      </div>

      <CreateFolderDialog
        open={showCreateFolder}
        onOpenChange={setShowCreateFolder}
        onFolderCreated={handleFolderCreated}
      />

      <CreateTagDialog open={showCreateTag} onOpenChange={setShowCreateTag} onTagCreated={handleTagCreated} />

      <FilterDialog
        open={showFilter}
        onOpenChange={setShowFilter}
        onFilterApplied={handleFilterApplied}
        initialFolder={selectedFolder}
        initialTags={selectedTags}
      />
    </DashboardShell>
  )
}

export default withAuth(DashboardPage)
