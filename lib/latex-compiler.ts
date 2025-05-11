// latex-compiler.ts

// Importation de texlive.js
import texlive from "texlive";

// Interface pour le résultat de la compilation
interface CompilationResult {
	url: string;
	log: string;
	errors: CompilationError[];
}

// Interface pour les erreurs de compilation
interface CompilationError {
	message: string;
	line?: number;
	type: "error" | "warning";
}

// Fonction pour compiler du code LaTeX en PDF
export async function compileLaTeX(
	content: string
): Promise<CompilationResult> {
	// Initialisation de texlive.js
	const pdftex = await texlive();

	// Écriture du contenu LaTeX dans le système de fichiers virtuel
	pdftex.FS.writeFile("input.tex", content);

	// Compilation du fichier LaTeX
	const result = pdftex.run(["pdflatex", "input.tex"]);

	// Lecture du journal de compilation
	const log = pdftex.FS.readFile("input.log", { encoding: "utf8" });

	// Vérification de la présence du fichier PDF compilé
	try {
		const pdfData = pdftex.FS.readFile("input.pdf");

		// Création d'un objet Blob pour le PDF
		const blob = new Blob([pdfData], { type: "application/pdf" });
		const url = URL.createObjectURL(blob);

		// Analyse des erreurs et avertissements
		const errors = parseLatexLog(log);

		return { url, log, errors };
	} catch (error) {
		// En cas d'échec de la compilation
		const errors = parseLatexLog(log);
		throw new Error(
			`Échec de la compilation LaTeX : ${
				errors[0]?.message || "Erreur inconnue"
			}`
		);
	}
}

// Fonction pour analyser le journal LaTeX et extraire les erreurs et avertissements
function parseLatexLog(log: string): CompilationError[] {
	const errors: CompilationError[] = [];

	// Expressions régulières pour détecter les erreurs et avertissements
	const errorRegex = /^! (.+?)\n/gm;
	const lineRegex = /l\.(\d+)/gm;
	const warningRegex = /LaTeX Warning: (.+?)\n/gm;

	// Extraction des erreurs
	let match;
	while ((match = errorRegex.exec(log)) !== null) {
		const errorMessage = match[1];
		const lineMatch = lineRegex.exec(log.slice(match.index));
		const lineNumber = lineMatch ? Number.parseInt(lineMatch[1]) : undefined;

		errors.push({
			message: errorMessage,
			line: lineNumber,
			type: "error",
		});
	}

	// Extraction des avertissements
	while ((match = warningRegex.exec(log)) !== null) {
		errors.push({
			message: match[1],
			type: "warning",
		});
	}

	return errors;
}
