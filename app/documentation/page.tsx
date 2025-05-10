"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { withAuth } from "@/lib/auth"

function DocumentationPage() {
  const [activeTab, setActiveTab] = useState("getting-started")

  return (
    <DashboardShell>
      <DashboardHeader heading="Documentation" text="Learn how to use TeXTogether effectively.">
        <Button asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </DashboardHeader>
      <div className="grid gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="latex-basics">LaTeX Basics</TabsTrigger>
            <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Features</TabsTrigger>
          </TabsList>
          <TabsContent value="getting-started" className="mt-6 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Getting Started with TeXTogether</h2>
              <p className="text-muted-foreground">
                Welcome to TeXTogether! This guide will help you get started with our collaborative LaTeX editor.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Creating Your First Document</h3>
              <p>
                To create a new document, go to your dashboard and click the "New Project" button. You can choose from
                several templates or start with a blank document.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">The Editor Interface</h3>
              <p>The TeXTogether editor is divided into several sections:</p>
              <ul className="ml-6 list-disc space-y-1">
                <li>
                  <strong>LaTeX Editor</strong> - The left panel where you write your LaTeX code.
                </li>
                <li>
                  <strong>PDF Preview</strong> - The right panel showing the compiled PDF output.
                </li>
                <li>
                  <strong>Comments</strong> - A side panel for discussing specific parts of the document.
                </li>
                <li>
                  <strong>Collaborators</strong> - A side panel showing who's currently editing the document.
                </li>
                <li>
                  <strong>Bibliography</strong> - A side panel for managing citations and references.
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Compiling Your Document</h3>
              <p>
                To see your document as a PDF, click the "Compile" button in the toolbar. TeXTogether will process your
                LaTeX code and display the result in the preview panel.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Saving Your Work</h3>
              <p>
                TeXTogether automatically saves your work as you type. You can also manually save by clicking the "Save"
                button or using the keyboard shortcut Ctrl+S (Cmd+S on Mac).
              </p>
            </div>
          </TabsContent>

          <TabsContent value="latex-basics" className="mt-6 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">LaTeX Basics</h2>
              <p className="text-muted-foreground">
                LaTeX is a powerful typesetting system used for academic and technical documents. Here are some basics to
                get you started.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Document Structure</h3>
              <p>A basic LaTeX document has the following structure:</p>
              <pre className="mt-2 rounded-md bg-muted p-4 font-mono text-sm">
\documentclass&#123;article&#125;
\title&#123;My Document&#125;
\author&#123;Your Name&#125;
\date&#123;\today&#125;

\begin&#123;document&#125;
\maketitle

\section&#123;Introduction&#125;
This is the introduction.
\
\section{Main Content}
This is the main content.

\section{Conclusion}
This is the conclusion.

\end{document}
</pre>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Common Commands</h3>
              <ul className="ml-6 list-disc space-y-1">
                <li>
                  <code>\section{Title}</code> - Creates a section with the given title
                </li>
                <li>
                  <code>\subsection{Title}</code> - Creates a subsection
                </li>
                <li>
                  <code>\textbf{Text}</code> - Makes text bold
                </li>
                <li>
                  <code>\textit{Text}</code> - Makes text italic
                </li>
                <li>
                  <code>\cite{key}</code> - Cites a reference from your bibliography
                </li>
                <li>
                  <code>\ref{label}</code> - References a labeled item (figure, table, etc.)
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Environments</h3>
              <p>Environments are used to define specific areas in your document:</p>
              <ul className="ml-6 list-disc space-y-1">
                <li>
                  <code>\begin{itemize} ... \end{itemize}</code> - Creates a bullet list
                </li>
                <li>
                  <code>\begin{enumerate} ... \end{enumerate}</code> - Creates a numbered list
                </li>
                <li>
                  <code>\begin{figure} ... \end{figure}</code> - Inserts a figure
                </li>
                <li>
                  <code>\begin{table} ... \end{table}</code> - Creates a table
                </li>
                <li>
                  <code>\begin{equation} ... \end{equation}</code> - Inserts a numbered equation
                </li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="collaboration" className="mt-6 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Collaboration Features</h2>
              <p className="text-muted-foreground">
                TeXTogether makes it easy to work with others on LaTeX documents. Here's how to use our collaboration features.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Inviting Collaborators</h3>
              <p>
                To invite others to work on your document, click the "Share" button in the editor toolbar. Enter their email
                address and choose their permission level:
              </p>
              <ul className="ml-6 list-disc space-y-1">
                <li>
                  <strong>Viewer</strong> - Can only view the document
                </li>
                <li>
                  <strong>Commenter</strong> - Can view and add comments
                </li>
                <li>
                  <strong>Editor</strong> - Can view, comment, and edit the document
                </li>
                <li>
                  <strong>Owner</strong> - Has full control over the document
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Real-time Collaboration</h3>
              <p>
                When multiple people are editing a document, you'll see their cursors and changes in real-time. Each collaborator
                is assigned a different color to help identify their contributions.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Comments</h3>
              <p>
                To add a comment, click the comment icon in the toolbar. You can specify which line the comment refers to.
                Comments can be resolved when the issue has been addressed.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Version History</h3>
              <p>
                TeXTogether automatically saves versions of your document as you work. You can access the version history
                by clicking the "History" tab in the editor. From there, you can view, compare, and restore previous versions.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="mt-6 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Advanced Features</h2>
              <p className="text-muted-foreground">
                Explore the advanced features of TeXTogether to enhance your LaTeX workflow.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Bibliography Management</h3>
              <p>
                TeXTogether includes a built-in bibliography manager. To access it, click the book icon in the editor toolbar.
                You can:
              </p>
              <ul className="ml-6 list-disc space-y-1">
                <li>Add new bibliography entries manually</li>
                <li>Import existing BibTeX files</li>
                <li>Export your bibliography</li>
                <li>Insert citations directly into your document</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Templates</h3>
              <p>
                TeXTogether offers several templates for common document types. To use a template, click the "Templates"
                button in the editor toolbar. Available templates include:
              </p>
              <ul className="ml-6 list-disc space-y-1">
                <li>Academic articles</li>
                <li>Reports</li>
                <li>Presentations (Beamer)</li>
                <li>Theses</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Keyboard Shortcuts</h3>
              <p>TeXTogether supports several keyboard shortcuts to speed up your workflow:</p>
              <ul className="ml-6 list-disc space-y-1">
                <li>
                  <code>Ctrl+S</code> / <code>Cmd+S</code> - Save document
                </li>
                <li>
                  <code>Ctrl+B</code> / <code>Cmd+B</code> - Compile document
                </li>
                <li>
                  <code>Ctrl+F</code> / <code>Cmd+F</code> - Find in document
                </li>
                <li>
                  <code>Ctrl+/</code> / <code>Cmd+/</code> - Toggle comment
                </li>
                <li>
                  <code>Ctrl+Space</code> - Show autocompletion suggestions
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Custom LaTeX Packages</h3>
              <p>
                TeXTogether supports many common LaTeX packages. If you need a specific package that isn't available,
                please contact our support team.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}

export default withAuth(DocumentationPage)
