// Basic Monaco editor syntax highlighting for LaTeX
export const latexSyntax = {
  // Set defaultToken to invalid to see what you do not tokenize yet
  defaultToken: "",
  tokenPostfix: ".tex",

  // The main tokenizer for LaTeX
  tokenizer: {
    root: [
      // Comments
      [/%.*$/, "comment"],

      // LaTeX commands
      [/\\[a-zA-Z]+/, "keyword"],

      // LaTeX brackets
      [/\{/, "delimiter.curly"],
      [/\}/, "delimiter.curly"],
      [/\[/, "delimiter.square"],
      [/\]/, "delimiter.square"],

      // Math mode
      [/\$\$/, "delimiter.math"],
      [/\$/, "delimiter.math"],

      // LaTeX environments
      [/\\begin\{([^}]*)\}/, "keyword"],
      [/\\end\{([^}]*)\}/, "keyword"],

      // Default whitespace handling
      [/\s+/, "white"],
    ],
  },
}
