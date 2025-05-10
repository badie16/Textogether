// LaTeX auto-completions for Monaco editor
export const latexCompletions = [
  {
    label: "\\begin{document}",
    insertText: "\\begin{document}\n\t$0\n\\end{document}",
    documentation: "Begin a document environment",
  },
  {
    label: "\\begin{figure}",
    insertText:
      "\\begin{figure}[${1:htbp}]\n\t\\centering\n\t\\includegraphics[width=${2:0.8}\\textwidth]{${3:file}}\n\t\\caption{${4:caption}}\n\t\\label{fig:${5:label}}\n\\end{figure}",
    documentation: "Begin a figure environment",
  },
  {
    label: "\\begin{table}",
    insertText:
      "\\begin{table}[${1:htbp}]\n\t\\centering\n\t\\begin{tabular}{${2:c c c}}\n\t\t${3:header1} & ${4:header2} & ${5:header3} \\\\\n\t\t\\hline\n\t\t${6:data1} & ${7:data2} & ${8:data3} \\\\\n\t\\end{tabular}\n\t\\caption{${9:caption}}\n\t\\label{tab:${10:label}}\n\\end{table}",
    documentation: "Begin a table environment",
  },
  {
    label: "\\begin{itemize}",
    insertText: "\\begin{itemize}\n\t\\item ${1:first item}\n\t\\item ${2:second item}\n\\end{itemize}",
    documentation: "Begin an itemized list",
  },
  {
    label: "\\begin{enumerate}",
    insertText: "\\begin{enumerate}\n\t\\item ${1:first item}\n\t\\item ${2:second item}\n\\end{enumerate}",
    documentation: "Begin an enumerated list",
  },
  {
    label: "\\section",
    insertText: "\\section{${1:title}}",
    documentation: "Add a section",
  },
  {
    label: "\\subsection",
    insertText: "\\subsection{${1:title}}",
    documentation: "Add a subsection",
  },
  {
    label: "\\textbf",
    insertText: "\\textbf{${1:text}}",
    documentation: "Bold text",
  },
  {
    label: "\\textit",
    insertText: "\\textit{${1:text}}",
    documentation: "Italic text",
  },
  {
    label: "\\cite",
    insertText: "\\cite{${1:key}}",
    documentation: "Citation",
  },
  {
    label: "\\ref",
    insertText: "\\ref{${1:label}}",
    documentation: "Reference",
  },
  {
    label: "\\includegraphics",
    insertText: "\\includegraphics[width=${1:0.8}\\textwidth]{${2:filename}}",
    documentation: "Include a graphic",
  },
  {
    label: "\\frac",
    insertText: "\\frac{${1:numerator}}{${2:denominator}}",
    documentation: "Fraction",
  },
  {
    label: "\\sum",
    insertText: "\\sum_{${1:i=1}}^{${2:n}} ${3:term}",
    documentation: "Summation",
  },
  {
    label: "\\int",
    insertText: "\\int_{${1:lower}}^{${2:upper}} ${3:function} \\, d${4:x}",
    documentation: "Integral",
  },
]
