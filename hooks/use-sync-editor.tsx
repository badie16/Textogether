"use client"

import { useEffect } from "react"
import type * as Y from "yjs"
import { MonacoBinding } from "y-monaco"
import type * as monaco from "monaco-editor"

interface UseSyncEditorProps {
  editor: monaco.editor.IStandaloneCodeEditor | null
  yText: Y.Text
  awareness: any
  isReady: boolean
}

export function useSyncEditor({ editor, yText, awareness, isReady }: UseSyncEditorProps) {
  useEffect(() => {
    if (!editor || !isReady || !awareness) return

    // Create Monaco <-> Yjs binding
    const binding = new MonacoBinding(yText, editor.getModel()!, new Set([editor]), awareness)

    return () => {
      // Cleanup binding
      binding.destroy()
    }
  }, [editor, yText, awareness, isReady])
}
