"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { EditorHeader } from "@/components/editor-header"
import { LaTeXEditor } from "@/components/latex-editor"
import { PDFPreview } from "@/components/pdf-preview"
import { CommentsPanel } from "@/components/comments-panel"
import { CollaboratorsPanel } from "@/components/collaborators-panel"
import { VersionHistoryPanel } from "@/components/version-history-panel"
import { BibliographyManager } from "@/components/bibliography-manager"
import { TemplateSelector } from "@/components/template-selector"
import { Download, MessageSquare, Users, BookOpen, FileText } from "lucide-react"
import { useSupabaseDocument } from "@/hooks/use-supabase-document"
import { compileLaTeX } from "@/lib/latex-compiler"
import { withAuth } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"

function EditorPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<string>("preview")
  const [activeSidePanel, setActiveSidePanel] = useState<string | null>(null)
  const [isCompiling, setIsCompiling] = useState(false)
  const [compilationResult, setCompilationResult] = useState<{ url: string; errors: any[] } | null>(null)
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const { toast } = useToast()

  // Get document from Supabase
  const { content, setContent, title, setTitle, saveDocument, lastSaved, isSaving } = useSupabaseDocument(params.id)

  // Compile PDF
  const compilePDF = async () => {
    if (!content) return

    setIsCompiling(true)
    try {
      // Vérifier si le contenu est vide ou trop court
      if (!content || content.length < 10) {
        toast({
          title: "Contenu insuffisant",
          description: "Veuillez ajouter du contenu LaTeX avant de compiler",
          variant: "destructive",
        })
        setIsCompiling(false)
        return
      }

      // Ajouter un préambule minimal si nécessaire
      let contentToCompile = content
      if (!content.includes("\\documentclass")) {
        contentToCompile = `\\documentclass{article}\n\\begin{document}\n${content}\n\\end{document}`
      }

      const result = await compileLaTeX(contentToCompile)
      setCompilationResult(result)

      // Notification de succès
      toast({
        title: "Compilation réussie",
        description: "Le PDF a été généré avec succès",
      })
    } catch (error) {
      console.error("Compilation error:", error)
      toast({
        title: "Erreur de compilation",
        description: error instanceof Error ? error.message : "Erreur inconnue pendant la compilation",
        variant: "destructive",
      })
    } finally {
      setIsCompiling(false)
    }
  }

  // Compile on initial load and when content changes (debounced)
  useEffect(() => {
    if (content) {
      const timer = setTimeout(() => {
        compilePDF()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [content])

  // Handle document download
  const handleDownloadTeX = () => {
    // Create a blob from the content
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)

    // Create a temporary anchor element to trigger download
    const a = document.createElement("a")
    a.href = url
    a.download = `${title || "document"}.tex`
    document.body.appendChild(a)
    a.click()

    // Clean up
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Handle PDF download
  const handleDownloadPDF = () => {
    if (!compilationResult?.url) {
      toast({
        title: "No PDF available",
        description: "Please compile the document first",
        variant: "destructive",
      })
      return
    }

    // Create a temporary anchor element to trigger download
    const a = document.createElement("a")
    a.href = compilationResult.url
    a.download = `${title || "document"}.pdf`
    document.body.appendChild(a)
    a.click()

    // Clean up
    document.body.removeChild(a)
  }

  // Handle citation insertion
  const handleInsertCitation = (key: string) => {
    const citation = `\\cite{${key}}`
    // In a real implementation, this would insert at cursor position
    setContent(content + citation)
  }

  // Toggle side panel
  const toggleSidePanel = (panel: string) => {
    if (activeSidePanel === panel) {
      setActiveSidePanel(null)
    } else {
      setActiveSidePanel(panel)
    }
  }

  return (
    <div className="flex h-screen flex-col">
      <EditorHeader
        projectId={params.id}
        title={title}
        onTitleChange={setTitle}
        onSave={saveDocument}
        isSaving={isSaving}
        lastSaved={lastSaved}
        onShowTemplates={() => setShowTemplateSelector(true)}
      />
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={50} minSize={30}>
            <LaTeXEditor content={content} documentId={params.id} onChange={setContent} onSave={saveDocument} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="flex h-full flex-col">
              <div className="border-b bg-background p-2">
                <div className="flex items-center justify-between">
                  <Tabs defaultValue="preview" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                      <TabsTrigger value="history">History</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={activeSidePanel === "comments" ? "default" : "outline"}
                            size="icon"
                            onClick={() => toggleSidePanel("comments")}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Toggle comments</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={activeSidePanel === "collaborators" ? "default" : "outline"}
                            size="icon"
                            onClick={() => toggleSidePanel("collaborators")}
                          >
                            <Users className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Collaborators</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={activeSidePanel === "bibliography" ? "default" : "outline"}
                            size="icon"
                            onClick={() => toggleSidePanel("bibliography")}
                          >
                            <BookOpen className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Bibliography</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Button variant="outline" size="sm" onClick={compilePDF} disabled={isCompiling}>
                      {isCompiling ? "Compiling..." : "Compile"}
                    </Button>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" onClick={handleDownloadTeX}>
                            <FileText className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Download TeX</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" onClick={handleDownloadPDF}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Download PDF</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <ResizablePanelGroup direction="horizontal">
                  <ResizablePanel defaultSize={activeSidePanel ? 70 : 100} minSize={50}>
                    {activeTab === "preview" ? (
                      <PDFPreview
                        latexContent={content}
                        isCompiling={isCompiling}
                        compilationResult={compilationResult}
                      />
                    ) : (
                      <VersionHistoryPanel documentId={params.id} onRestoreVersion={(content) => setContent(content)} />
                    )}
                  </ResizablePanel>
                  {activeSidePanel && (
                    <>
                      <ResizableHandle withHandle />
                      <ResizablePanel defaultSize={30} minSize={20}>
                        {activeSidePanel === "comments" && <CommentsPanel documentId={params.id} />}
                        {activeSidePanel === "collaborators" && <CollaboratorsPanel documentId={params.id} />}
                        {activeSidePanel === "bibliography" && (
                          <BibliographyManager documentId={params.id} onInsertCitation={handleInsertCitation} />
                        )}
                      </ResizablePanel>
                    </>
                  )}
                </ResizablePanelGroup>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <TemplateSelector
        open={showTemplateSelector}
        onOpenChange={setShowTemplateSelector}
        onSelectTemplate={(templateContent) => {
          setContent(templateContent)
          saveDocument()
        }}
        currentContent={content}
      />
    </div>
  )
}

export default withAuth(EditorPage)
