import texliveModule from "@texlive/engine"

// Initialize LaTeX.js WebAssembly module
let latexjs: any | null = null
let isInitializing = false
let initPromise: Promise<any> | null = null

const initLatexJs = async () => {
  if (latexjs) return latexjs

  if (isInitializing) {
    return initPromise
  }

  isInitializing = true
  initPromise = new Promise(async (resolve, reject) => {
    try {
      console.log("Initializing LaTeX.js WebAssembly module...")
      latexjs = await texliveModule()
      console.log("LaTeX.js WebAssembly module initialized")
      isInitializing = false
      resolve(latexjs)
    } catch (error) {
      console.error("Failed to initialize LaTeX.js:", error)
      isInitializing = false
      reject(new Error("Failed to initialize LaTeX compiler"))
    }
  })

  return initPromise
}

interface CompilationResult {
  url: string
  log: string
  errors: CompilationError[]
}

interface CompilationError {
  message: string
  line?: number
  type: "error" | "warning"
}

export async function compileLaTeX(content: string): Promise<CompilationResult> {
  // Initialize LaTeX.js if not already done
  const engine = await initLatexJs()

  // Set up virtual filesystem
  engine.FS.writeFile("/input.tex", content)

  // Run pdflatex to compile the document
  try {
    // Ajouter un timeout pour éviter les blocages
    const compilePromise = Promise.race([
      engine.compileLaTeX(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Compilation timeout")), 30000)),
    ])

    engine.setEngineMainFile("pdflatex", "/input.tex")
    await compilePromise

    // Get compilation log
    const log = engine.FS.readFile("/input.log", { encoding: "utf8" })

    // Check if compilation was successful by looking for the output PDF
    try {
      const pdfData = engine.FS.readFile("/input.pdf")

      // Convert the PDF data to a Blob URL for display
      const blob = new Blob([pdfData], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)

      // Parse errors and warnings from the log
      const errors = parseLatexLog(log)

      return { url, log, errors }
    } catch (error) {
      // If the PDF wasn't created, there was an error in compilation
      console.error("PDF compilation failed:", log)
      const errors = parseLatexLog(log)
      throw new Error(`LaTeX compilation failed: ${errors[0]?.message || "Unknown error"}`)
    }
  } catch (error) {
    console.error("Error running LaTeX compiler:", error)
    throw new Error("Error running LaTeX compiler")
  }
}

// Parse LaTeX log to extract errors and warnings
function parseLatexLog(log: string): CompilationError[] {
  const errors: CompilationError[] = []

  // Regular expressions for different types of errors
  const errorRegex = /^! (.+?)\.$/gm
  const lineRegex = /l\.(\d+)/gm
  const warningRegex = /LaTeX Warning: (.+?)\.$/gm

  // Extract errors
  let match
  while ((match = errorRegex.exec(log)) !== null) {
    const errorMessage = match[1]
    const lineMatch = lineRegex.exec(log.slice(match.index))
    const lineNumber = lineMatch ? Number.parseInt(lineMatch[1]) : undefined

    errors.push({
      message: errorMessage,
      line: lineNumber,
      type: "error",
    })
  }

  // Extract warnings
  while ((match = warningRegex.exec(log)) !== null) {
    errors.push({
      message: match[1],
      type: "warning",
    })
  }

  return errors
}

// Install additional LaTeX packages
export async function installLatexPackage(packageName: string): Promise<boolean> {
  try {
    const engine = await initLatexJs()

    // Check if package is already installed
    try {
      engine.FS.lookupPath(`/texlive/texmf-dist/tex/latex/${packageName}`, {})
      return true // Package already installed
    } catch (e) {
      // Package not found, continue with installation
    }

    // In a real implementation, this would download and install the package
    // For now, we'll just simulate it
    console.log(`Installing package: ${packageName}`)

    // Create a dummy directory to simulate installation
    try {
      engine.FS.mkdir(`/texlive/texmf-dist/tex/latex/${packageName}`)
      engine.FS.writeFile(`/texlive/texmf-dist/tex/latex/${packageName}/${packageName}.sty`, "")
    } catch (e) {
      console.error(`Error creating package directory: ${e}`)
      return false
    }

    return true
  } catch (error) {
    console.error(`Failed to install package ${packageName}:`, error)
    return false
  }
}

// Get a list of available LaTeX templates
export function getLatexTemplates() {
  return [
    {
      id: "article",
      name: "Article",
      description: "Basic article template",
      content: `\\documentclass{article}
\\title{Article Title}
\\author{Author Name}
\\date{\\today}

\\begin{document}

\\maketitle

\\section{Introduction}
Your introduction goes here.

\\section{Methods}
Your methods go here.

\\section{Results}
Your results go here.

\\section{Discussion}
Your discussion goes here.

\\section{Conclusion}
Your conclusion goes here.

\\end{document}`,
    },
    {
      id: "report",
      name: "Report",
      description: "Academic report with chapters",
      content: `\\documentclass{report}
\\title{Report Title}
\\author{Author Name}
\\date{\\today}

\\begin{document}

\\maketitle
\\tableofcontents

\\chapter{Introduction}
Your introduction goes here.

\\chapter{Background}
Your background information goes here.

\\chapter{Methodology}
Your methodology goes here.

\\chapter{Results}
Your results go here.

\\chapter{Discussion}
Your discussion goes here.

\\chapter{Conclusion}
Your conclusion goes here.

\\end{document}`,
    },
    {
      id: "beamer",
      name: "Presentation",
      description: "Beamer presentation slides",
      content: `\\documentclass{beamer}
\\usetheme{Madrid}
\\title{Presentation Title}
\\author{Presenter Name}
\\date{\\today}

\\begin{document}

\\frame{\\titlepage}

\\begin{frame}
\\frametitle{Outline}
\\tableofcontents
\\end{frame}

\\section{Introduction}
\\begin{frame}
\\frametitle{Introduction}
Your introduction goes here.
\\end{frame}

\\section{Main Content}
\\begin{frame}
\\frametitle{Main Point 1}
Your first main point goes here.
\\end{frame}

\\begin{frame}
\\frametitle{Main Point 2}
Your second main point goes here.
\\end{frame}

\\section{Conclusion}
\\begin{frame}
\\frametitle{Conclusion}
Your conclusion goes here.
\\end{frame}

\\end{document}`,
    },
    {
      id: "thesis",
      name: "Thesis",
      description: "Academic thesis template",
      content: `\\documentclass[12pt,a4paper]{report}
\\usepackage[utf8]{inputenc}
\\usepackage{graphicx}
\\usepackage{natbib}
\\usepackage{hyperref}

\\title{Thesis Title}
\\author{Your Name}
\\date{\\today}

\\begin{document}

\\maketitle
\\begin{abstract}
This is the abstract of your thesis.
\\end{abstract}

\\tableofcontents
\\listoffigures
\\listoftables

\\chapter{Introduction}
Your introduction goes here.

\\chapter{Literature Review}
Your literature review goes here.

\\chapter{Methodology}
Your methodology goes here.

\\chapter{Results}
Your results go here.

\\chapter{Discussion}
Your discussion goes here.

\\chapter{Conclusion}
Your conclusion goes here.

\\bibliographystyle{plain}
\\bibliography{references}

\\appendix
\\chapter{Appendix}
Your appendix content goes here.

\\end{document}`,
    },
  ]
}
