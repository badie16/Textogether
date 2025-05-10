"use client"

import { useEffect, useState } from "react"
import * as Y from "yjs"
import { IndexeddbPersistence } from "y-indexeddb"
import { SupabaseProvider } from "@/lib/supabase-provider"
import { supabase } from "@/lib/supabase"

interface UseYjsResult {
  doc: Y.Doc
  provider: SupabaseProvider | null
  awareness: any
  yText: Y.Text
}

export function useYjs(documentId: string): UseYjsResult {
  const [state, setState] = useState<UseYjsResult>(() => {
    // Create Yjs document
    const doc = new Y.Doc()

    // Get or create Yjs text type
    const yText = doc.getText("latex")

    return {
      doc,
      provider: null,
      awareness: null,
      yText,
    }
  })

  useEffect(() => {
    if (!documentId) return

    // Set up persistence with IndexedDB
    const indexeddbProvider = new IndexeddbPersistence(`textogether-${documentId}`, state.doc)

    // Set up Supabase Realtime provider
    const provider = new SupabaseProvider(`textogether-${documentId}`, state.doc, supabase, {
      awareness: true,
      sync: true,
    })

    // Set up awareness (cursor positions, user info)
    const awareness = provider.awareness

    // Set user data for awareness
    awareness.setLocalStateField("user", {
      name: localStorage.getItem("userName") || "Anonymous",
      color: "#" + Math.floor(Math.random() * 16777215).toString(16),
      userId: localStorage.getItem("userId") || Math.random().toString(36).substring(2),
    })

    setState((prev) => ({
      ...prev,
      provider,
      awareness,
    }))

    return () => {
      // Clean up
      provider.destroy()
      indexeddbProvider.destroy()
    }
  }, [documentId, state.doc])

  return state
}
