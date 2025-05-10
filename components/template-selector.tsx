"use client"

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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { getLatexTemplates } from "@/lib/latex-compiler"

interface TemplateSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectTemplate: (content: string) => void
  currentContent: string
}

export function TemplateSelector({ open, onOpenChange, onSelectTemplate, currentContent }: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const { toast } = useToast()
  const templates = getLatexTemplates()

  const handleSelectTemplate = () => {
    if (!selectedTemplate) {
      toast({
        title: "No template selected",
        description: "Please select a template first",
        variant: "destructive",
      })
      return
    }

    const template = templates.find((t) => t.id === selectedTemplate)
    if (!template) return

    // Check if current document has content
    if (currentContent && currentContent.trim() !== "") {
      if (!confirm("This will replace your current document. Are you sure?")) {
        return
      }
    }

    onSelectTemplate(template.content)
    onOpenChange(false)
    toast({
      title: "Template applied",
      description: `The ${template.name} template has been applied to your document.`,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Choose a Template</DialogTitle>
          <DialogDescription>Select a template to start your LaTeX document.</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="all" className="mt-4">
          <TabsList>
            <TabsTrigger value="all">All Templates</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="presentation">Presentation</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <ScrollArea className="h-[400px] rounded-md border p-4">
              <div className="grid grid-cols-2 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`cursor-pointer rounded-md border p-4 transition-colors hover:bg-muted/50 ${
                      selectedTemplate === template.id ? "border-primary bg-muted" : ""
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <h3 className="font-medium">{template.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{template.description}</p>
                    <div className="mt-4 max-h-40 overflow-hidden rounded-md bg-muted/50 p-2">
                      <pre className="text-xs">{template.content.slice(0, 200)}...</pre>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="academic" className="mt-4">
            <ScrollArea className="h-[400px] rounded-md border p-4">
              <div className="grid grid-cols-2 gap-4">
                {templates
                  .filter((t) => ["article", "report", "thesis"].includes(t.id))
                  .map((template) => (
                    <div
                      key={template.id}
                      className={`cursor-pointer rounded-md border p-4 transition-colors hover:bg-muted/50 ${
                        selectedTemplate === template.id ? "border-primary bg-muted" : ""
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{template.description}</p>
                      <div className="mt-4 max-h-40 overflow-hidden rounded-md bg-muted/50 p-2">
                        <pre className="text-xs">{template.content.slice(0, 200)}...</pre>
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="presentation" className="mt-4">
            <ScrollArea className="h-[400px] rounded-md border p-4">
              <div className="grid grid-cols-2 gap-4">
                {templates
                  .filter((t) => ["beamer"].includes(t.id))
                  .map((template) => (
                    <div
                      key={template.id}
                      className={`cursor-pointer rounded-md border p-4 transition-colors hover:bg-muted/50 ${
                        selectedTemplate === template.id ? "border-primary bg-muted" : ""
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{template.description}</p>
                      <div className="mt-4 max-h-40 overflow-hidden rounded-md bg-muted/50 p-2">
                        <pre className="text-xs">{template.content.slice(0, 200)}...</pre>
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSelectTemplate} disabled={!selectedTemplate}>
            Apply Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
