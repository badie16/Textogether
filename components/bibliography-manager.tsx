"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { parseBibTeX, formatBibTeXEntry, type BibTeXEntry } from "@/lib/bibtex-parser"
import { supabase } from "@/lib/supabase"
import { Plus, Trash, FileUp, Download, Search } from "lucide-react"

interface BibliographyManagerProps {
  documentId: string
  onInsertCitation: (key: string) => void
}

export function BibliographyManager({ documentId, onInsertCitation }: BibliographyManagerProps) {
  const [entries, setEntries] = useState<BibTeXEntry[]>([])
  const [bibtexContent, setBibtexContent] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("entries")
  const [newEntry, setNewEntry] = useState<Partial<BibTeXEntry>>({
    type: "article",
    key: "",
    fields: {
      author: "",
      title: "",
      year: "",
      journal: "",
    },
  })
  const { toast } = useToast()

  useEffect(() => {
    loadBibliography()
  }, [documentId])

  const loadBibliography = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("document_bibliographies")
        .select("content")
        .eq("document_id", documentId)
        .single()

      if (error && error.code !== "PGRST116") {
        throw error
      }

      if (data) {
        setBibtexContent(data.content)
        setEntries(parseBibTeX(data.content))
      } else {
        setBibtexContent("")
        setEntries([])
      }
    } catch (error) {
      console.error("Error loading bibliography:", error)
      toast({
        title: "Error",
        description: "Failed to load bibliography. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const saveBibliography = async (content: string) => {
    try {
      const { error } = await supabase.from("document_bibliographies").upsert({
        document_id: documentId,
        content,
      })

      if (error) {
        throw error
      }

      toast({
        title: "Bibliography saved",
        description: "Your bibliography has been saved successfully.",
      })
    } catch (error) {
      console.error("Error saving bibliography:", error)
      toast({
        title: "Error",
        description: "Failed to save bibliography. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleBibtexChange = (content: string) => {
    setBibtexContent(content)
    try {
      setEntries(parseBibTeX(content))
    } catch (error) {
      console.error("Error parsing BibTeX:", error)
    }
  }

  const handleSaveBibtex = () => {
    saveBibliography(bibtexContent)
  }

  const handleAddEntry = () => {
    if (!newEntry.key || !newEntry.fields?.title) {
      toast({
        title: "Error",
        description: "Citation key and title are required.",
        variant: "destructive",
      })
      return
    }

    const entry: BibTeXEntry = {
      type: (newEntry.type as string) || "article",
      key: newEntry.key,
      fields: (newEntry.fields as Record<string, string>) || {},
    }

    const updatedEntries = [...entries, entry]
    setEntries(updatedEntries)

    const updatedBibtex = updatedEntries.map(formatBibTeXEntry).join("\n\n")
    setBibtexContent(updatedBibtex)
    saveBibliography(updatedBibtex)

    // Reset form
    setNewEntry({
      type: "article",
      key: "",
      fields: {
        author: "",
        title: "",
        year: "",
        journal: "",
      },
    })
    setActiveTab("entries")
  }

  const handleRemoveEntry = (key: string) => {
    const updatedEntries = entries.filter((entry) => entry.key !== key)
    setEntries(updatedEntries)

    const updatedBibtex = updatedEntries.map(formatBibTeXEntry).join("\n\n")
    setBibtexContent(updatedBibtex)
    saveBibliography(updatedBibtex)
  }

  const handleImportBibtex = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setBibtexContent(content)
      try {
        setEntries(parseBibTeX(content))
        saveBibliography(content)
        toast({
          title: "BibTeX imported",
          description: "Your BibTeX file has been imported successfully.",
        })
      } catch (error) {
        console.error("Error parsing imported BibTeX:", error)
        toast({
          title: "Error",
          description: "Failed to parse the imported BibTeX file.",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  const handleExportBibtex = () => {
    const blob = new Blob([bibtexContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "bibliography.bib"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const filteredEntries = entries.filter((entry) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      entry.key.toLowerCase().includes(searchLower) ||
      entry.fields.title?.toLowerCase().includes(searchLower) ||
      entry.fields.author?.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="flex h-full flex-col">
      <div className="border-b bg-muted/40 px-4 py-2">
        <span className="text-sm font-medium">Bibliography Manager</span>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="entries">Entries</TabsTrigger>
              <TabsTrigger value="add">Add Entry</TabsTrigger>
              <TabsTrigger value="bibtex">BibTeX</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <label>
                  <FileUp className="mr-1 h-4 w-4" />
                  Import
                  <input type="file" accept=".bib" className="hidden" onChange={handleImportBibtex} />
                </label>
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportBibtex}>
                <Download className="mr-1 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <TabsContent value="entries" className="mt-4">
            <div className="mb-4 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search entries..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="flex h-40 items-center justify-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              </div>
            ) : filteredEntries.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center text-center">
                <p className="text-muted-foreground">No bibliography entries found.</p>
                <Button variant="link" onClick={() => setActiveTab("add")} className="mt-2">
                  Add your first entry
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredEntries.map((entry) => (
                  <div key={entry.key} className="rounded-md border p-3 hover:bg-muted/50">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{entry.fields.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {entry.fields.author} ({entry.fields.year})
                        </p>
                        <p className="mt-1 text-xs">
                          <span className="font-mono text-primary">@{entry.key}</span> - {entry.type}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => onInsertCitation(entry.key)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveEntry(entry.key)}>
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="add" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="entry-type">Type</Label>
                <select
                  id="entry-type"
                  className="mt-1 w-full rounded-md border p-2"
                  value={newEntry.type}
                  onChange={(e) => setNewEntry({ ...newEntry, type: e.target.value })}
                >
                  <option value="article">Article</option>
                  <option value="book">Book</option>
                  <option value="inproceedings">Conference Paper</option>
                  <option value="techreport">Technical Report</option>
                  <option value="phdthesis">PhD Thesis</option>
                  <option value="misc">Miscellaneous</option>
                </select>
              </div>
              <div>
                <Label htmlFor="entry-key">Citation Key</Label>
                <Input
                  id="entry-key"
                  className="mt-1"
                  value={newEntry.key}
                  onChange={(e) => setNewEntry({ ...newEntry, key: e.target.value })}
                  placeholder="smith2023"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="entry-author">Author</Label>
              <Input
                id="entry-author"
                className="mt-1"
                value={newEntry.fields?.author || ""}
                onChange={(e) =>
                  setNewEntry({
                    ...newEntry,
                    fields: { ...newEntry.fields, author: e.target.value },
                  })
                }
                placeholder="John Smith and Jane Doe"
              />
            </div>

            <div>
              <Label htmlFor="entry-title">Title</Label>
              <Input
                id="entry-title"
                className="mt-1"
                value={newEntry.fields?.title || ""}
                onChange={(e) =>
                  setNewEntry({
                    ...newEntry,
                    fields: { ...newEntry.fields, title: e.target.value },
                  })
                }
                placeholder="An Interesting Paper"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="entry-year">Year</Label>
                <Input
                  id="entry-year"
                  className="mt-1"
                  value={newEntry.fields?.year || ""}
                  onChange={(e) =>
                    setNewEntry({
                      ...newEntry,
                      fields: { ...newEntry.fields, year: e.target.value },
                    })
                  }
                  placeholder="2023"
                />
              </div>
              <div>
                <Label htmlFor="entry-journal">Journal/Publisher</Label>
                <Input
                  id="entry-journal"
                  className="mt-1"
                  value={newEntry.fields?.journal || ""}
                  onChange={(e) =>
                    setNewEntry({
                      ...newEntry,
                      fields: { ...newEntry.fields, journal: e.target.value },
                    })
                  }
                  placeholder="Journal of Important Research"
                />
              </div>
            </div>

            <Button onClick={handleAddEntry}>Add Entry</Button>
          </TabsContent>

          <TabsContent value="bibtex" className="mt-4">
            <Textarea
              className="h-[300px] font-mono text-sm"
              value={bibtexContent}
              onChange={(e) => handleBibtexChange(e.target.value)}
            />
            <Button className="mt-4" onClick={handleSaveBibtex}>
              Save BibTeX
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
