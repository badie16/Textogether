"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"

interface UseSupabaseDocumentResult {
  content: string
  setContent: (content: string) => void
  title: string
  setTitle: (title: string) => void
  saveDocument: () => Promise<void>
  lastSaved: Date | null
  isSaving: boolean
  documentData: any | null
}

export function useSupabaseDocument(documentId: string): UseSupabaseDocumentResult {
  const [content, setContent] = useState("")
  const [title, setTitle] = useState("")
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null)
  const [documentData, setDocumentData] = useState<any | null>(null)
  const { toast } = useToast()

  // Load document from Supabase
  useEffect(() => {
    const loadDocument = async () => {
      try {
        // Vérifier si le document existe
        const { data: exists, error: checkError } = await supabase
          .from("documents")
          .select("id")
          .eq("id", documentId)
          .single()

        if (checkError && checkError.code !== "PGRST116") {
          throw checkError
        }

        // Si le document n'existe pas, créer un document vide
        if (!exists) {
          const { error: createError } = await supabase.from("documents").insert({
            id: documentId,
            title: "Nouveau document",
            content:
              "% Bienvenue dans votre nouveau document LaTeX\n\\documentclass{article}\n\\begin{document}\n\\title{Nouveau document}\n\\author{Votre nom}\n\\maketitle\n\nVotre contenu ici.\n\n\\end{document}",
            owner_id: (await supabase.auth.getUser()).data.user?.id,
          })

          if (createError) {
            throw createError
          }
        }

        const { data, error } = await supabase
          .from("documents")
          .select(`
            id, 
            title, 
            content, 
            updated_at,
            owner_id,
            folder_id,
            folders:folder_id (id, name),
            document_tag_relations (
              tag_id,
              document_tags:tag_id (id, name, color)
            )
          `)
          .eq("id", documentId)
          .single()

        if (error) {
          console.error("Error loading document:", error)
          toast({
            title: "Error",
            description: "Failed to load document. Please try again.",
            variant: "destructive",
          })
          return
        }

        if (data) {
          setContent(data.content || "")
          setTitle(data.title || "")
          setLastSaved(data.updated_at ? new Date(data.updated_at) : null)
          setDocumentData(data)
        }
      } catch (error) {
        console.error("Error loading document:", error)
        toast({
          title: "Error",
          description: "Failed to load document. Please try again.",
          variant: "destructive",
        })
      }
    }

    if (documentId) {
      loadDocument()
    }
  }, [documentId, toast])

  // Auto-save when content changes
  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }

    if (content) {
      const timeout = setTimeout(() => {
        saveDocument()
      }, 2000)

      setDebounceTimeout(timeout)
    }

    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout)
      }
    }
  }, [content])

  // Save document to Supabase
  const saveDocument = useCallback(async () => {
    if (!documentId || isSaving) return

    setIsSaving(true)

    try {
      const { error } = await supabase
        .from("documents")
        .update({
          title: title,
          content: content,
          updated_at: new Date().toISOString(),
        })
        .eq("id", documentId)

      if (error) {
        throw error
      }

      setLastSaved(new Date())
    } catch (error) {
      console.error("Error saving document:", error)
      toast({
        title: "Error",
        description: "Failed to save document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }, [documentId, title, content, isSaving, toast])

  return {
    content,
    setContent,
    title,
    setTitle,
    saveDocument,
    lastSaved,
    isSaving,
    documentData,
  }
}
