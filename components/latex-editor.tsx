"use client"

import { useEffect, useRef, useState } from "react"
import type * as monaco from "monaco-editor"
import { Editor } from "@monaco-editor/react"
import { useYjs } from "@/hooks/use-yjs"
import { latexSyntax } from "@/lib/latex-syntax"
import { latexCompletions } from "@/lib/latex-completions"
import { useSyncEditor } from "@/hooks/use-sync-editor"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Bold, Italic, List, ListOrdered, ImageIcon, Table, Code } from "lucide-react"

interface LaTeXEditorProps {
  content: string
  documentId: string
  onChange: (value: string) => void
  onSave: () => void
}

export function LaTeXEditor({ content, documentId, onChange, onSave }: LaTeXEditorProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<typeof monaco | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [cursorPosition, setCursorPosition] = useState<{ lineNumber: number; column: number } | null>(null)

  // Set up Yjs collaborative editing
  const { provider, awareness, yText } = useYjs(documentId)

  // Configure the editor when it's ready
  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monacoInstance: typeof monaco) => {
    editorRef.current = editor
    monacoRef.current = monacoInstance

    // Configure LaTeX syntax highlighting
    monacoInstance.languages.register({ id: "latex" })
    monacoInstance.languages.setMonarchTokensProvider("latex", latexSyntax)

    // Configure LaTeX autocompletion
    monacoInstance.languages.registerCompletionItemProvider("latex", {
      provideCompletionItems: (model, position) => {
        return {
          suggestions: latexCompletions
            .filter((item) => {
              const textUntilPosition = model.getValueInRange({
                startLineNumber: position.lineNumber,
                startColumn: 1,
                endLineNumber: position.lineNumber,
                endColumn: position.column,
              })
              return (
                item.label.startsWith("\\") && (textUntilPosition.endsWith("\\") || textUntilPosition.includes(" \\"))
              )
            })
            .map((item) => ({
              ...item,
              kind: monacoInstance.languages.CompletionItemKind.Function,
              insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            })),
        }
      },
    })

    // Set up Ctrl+S save shortcut
    editor.addCommand(monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyS, () => {
      onSave()
    })

    // Track cursor position
    editor.onDidChangeCursorPosition((e) => {
      setCursorPosition(e.position)
    })

    setIsReady(true)
  }

  // Sync Monaco Editor with Yjs for real-time collaboration
  useSyncEditor({
    editor: editorRef.current,
    yText,
    awareness,
    isReady,
  })

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      provider?.destroy()
    }
  }, [provider])

  // Insert LaTeX commands at cursor position
  const insertAtCursor = (text: string) => {
    if (!editorRef.current) return

    const selection = editorRef.current.getSelection()
    if (!selection) return

    const selectedText = editorRef.current.getModel()?.getValueInRange(selection) || ""
    const insertText = selectedText ? text.replace("$1", selectedText) : text

    editorRef.current.executeEdits("latex-toolbar", [
      {
        range: selection,
        text: insertText,
        forceMoveMarkers: true,
      },
    ])

    editorRef.current.focus()
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b bg-muted/40 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">LaTeX Editor</span>
            <span className="text-xs text-muted-foreground">
              {provider?.wsconnected ? "Connected" : "Connecting..."}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => insertAtCursor("\\textbf{$1}")}
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Bold</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => insertAtCursor("\\textit{$1}")}
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Italic</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => insertAtCursor("\\begin{itemize}\n\t\\item $1\n\\end{itemize}")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Bullet List</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => insertAtCursor("\\begin{enumerate}\n\t\\item $1\n\\end{enumerate}")}
                  >
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Numbered List</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      insertAtCursor(
                        "\\begin{figure}[h]\n\t\\centering\n\t\\includegraphics[width=0.8\\textwidth]{image}\n\t\\caption{$1}\n\t\\label{fig:label}\n\\end{figure}",
                      )
                    }
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Figure</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      insertAtCursor(
                        "\\begin{table}[h]\n\t\\centering\n\t\\begin{tabular}{|c|c|c|}\n\t\t\\hline\n\t\tHeader 1 & Header 2 & Header 3 \\\\\n\t\t\\hline\n\t\tCell 1 & Cell 2 & Cell 3 \\\\\n\t\t\\hline\n\t\\end{tabular}\n\t\\caption{$1}\n\t\\label{tab:label}\n\\end{table}",
                      )
                    }
                  >
                    <Table className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Table</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => insertAtCursor("\\begin{verbatim}\n$1\n\\end{verbatim}")}
                  >
                    <Code className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Code Block</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="latex"
          defaultValue={content}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: "on",
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            renderWhitespace: "boundary",
            quickSuggestions: true,
          }}
          onMount={handleEditorDidMount}
          onChange={(value) => value && onChange(value)}
        />
      </div>
      <div className="border-t bg-muted/20 px-4 py-1 text-xs text-muted-foreground">
        {cursorPosition ? `Line ${cursorPosition.lineNumber}, Column ${cursorPosition.column}` : ""}
      </div>
    </div>
  )
}
