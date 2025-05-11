export type BibTeXEntry = {
  type: string
  key: string
  fields: {
    author?: string
    title?: string
    year?: string
    journal?: string
    volume?: string
    number?: string
    pages?: string
    publisher?: string
    address?: string
    booktitle?: string
    editor?: string
  }
}

export function parseBibTeX(bibtexContent: string): BibTeXEntry[] {
  const entries: BibTeXEntry[] = []
  const entryRegex = /@(\w+)\s*\{\s*([^,]+),\s*([\s\S]*?)\s*\}/g
  const fieldRegex = /\s*(\w+)\s*=\s*(?:\{([^}]*)\}|"([^"]*)"|([\d]+))/g

  let match
  while ((match = entryRegex.exec(bibtexContent)) !== null) {
    const type = match[1].toLowerCase()
    const key = match[2]
    const fieldsText = match[3]

    const fields: Record<string, string> = {}
    let fieldMatch
    while ((fieldMatch = fieldRegex.exec(fieldsText)) !== null) {
      const fieldName = fieldMatch[1].toLowerCase()
      const fieldValue = fieldMatch[2] || fieldMatch[3] || fieldMatch[4] || ""
      fields[fieldName] = fieldValue
    }

    entries.push({
      type,
      key,
      fields,
    })
  }

  return entries
}

export function formatBibTeXEntry(entry: BibTeXEntry): string {
  let result = `@${entry.type}{${entry.key},\n`

  for (const [field, value] of Object.entries(entry.fields)) {
    result += `  ${field} = {${value}},\n`
  }

  result += "}"
  return result
}

export function generateBibTeXCitation(entry: BibTeXEntry): string {
  switch (entry.type) {
    case "article":
      return formatArticleCitation(entry)
    case "book":
      return formatBookCitation(entry)
    case "inproceedings":
    case "conference":
      return formatConferenceCitation(entry)
    default:
      return formatGenericCitation(entry)
  }
}

function formatArticleCitation(entry: BibTeXEntry): string {
  const authors = formatAuthors(entry.fields.author)
  const year = entry.fields.year || "n.d."
  const title = entry.fields.title || ""
  const journal = entry.fields.journal || ""
  const volume = entry.fields.volume ? `${entry.fields.volume}` : ""
  const number = entry.fields.number ? `(${entry.fields.number})` : ""
  const pages = entry.fields.pages ? `pp. ${entry.fields.pages}` : ""

  return `${authors} (${year}). ${title}. ${journal}, ${volume}${number}, ${pages}.`
}

function formatBookCitation(entry: BibTeXEntry): string {
  const authors = formatAuthors(entry.fields.author || entry.fields.editor)
  const year = entry.fields.year || "n.d."
  const title = entry.fields.title || ""
  const publisher = entry.fields.publisher || ""
  const address = entry.fields.address ? `${entry.fields.address}: ` : ""

  return `${authors} (${year}). ${title}. ${address}${publisher}.`
}

function formatConferenceCitation(entry: BibTeXEntry): string {
  const authors = formatAuthors(entry.fields.author)
  const year = entry.fields.year || "n.d."
  const title = entry.fields.title || ""
  const booktitle = entry.fields.booktitle || ""
  const pages = entry.fields.pages ? `pp. ${entry.fields.pages}` : ""

  return `${authors} (${year}). ${title}. In ${booktitle}, ${pages}.`
}

function formatGenericCitation(entry: BibTeXEntry): string {
  const authors = formatAuthors(entry.fields.author || entry.fields.editor)
  const year = entry.fields.year || "n.d."
  const title = entry.fields.title || ""

  return `${authors} (${year}). ${title}.`
}

function formatAuthors(authorString?: string): string {
  if (!authorString) return "Unknown Author"

  const authors = authorString.split(" and ")

  if (authors.length === 1) {
    return authors[0]
  } else if (authors.length === 2) {
    return `${authors[0]} and ${authors[1]}`
  } else {
    return `${authors[0]} et al.`
  }
}

export function createBibTeXFile(entries: BibTeXEntry[]): string {
  return entries.map((entry) => formatBibTeXEntry(entry)).join("\n\n")
}
