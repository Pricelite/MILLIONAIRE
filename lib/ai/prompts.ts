export function buildQuotePrompt(input: {
  description: string;
  region: string;
  research: {
    trade: string;
    assumptions: string[];
    confidence: number;
    detailLevel: "standard" | "expert";
    suggestedLines: Array<{
      code?: string;
      label: string;
      subCategory?: string;
      quantity: number;
      unit?: string;
      category: string;
      unitPrice?: number;
      vatRate?: number;
    }>;
  };
}) {
  const minLines = input.research.detailLevel === "expert" ? 20 : 14;
  const detailDirective =
    input.research.detailLevel === "expert"
      ? "Mode expert: decomposition tres fine, chaque etape importante doit etre sur sa propre ligne."
      : "Mode standard: devis detaille et lisible.";

  const suggested = input.research.suggestedLines
    .map(
      (line) =>
        `- ${line.code ?? "N/A"} | ${line.subCategory ?? "general"} | ${line.label} | qt:${line.quantity} | ${line.unit ?? "u"} | ${
          line.category
        } | PU:${
          line.unitPrice ?? 0
        } | TVA:${line.vatRate ?? 0.2}`
    )
    .join("\n");

  const assumptions = input.research.assumptions.length ? input.research.assumptions.join(" | ") : "Aucune";

  return `
Tu es expert metreur BTP en France.
Ta mission: transformer une description courte en devis exploitable.

Contraintes:
- Reponds en JSON strict uniquement.
- Le devis doit etre prudent, realiste et lisible par un artisan.
- Inclure materiaux, main_oeuvre, frais.
- main_oeuvre en heures.
- Si info manquante, fais une hypothese raisonnable.
- Priorise la base de recherche fournie ci-dessous et ajuste seulement si necessaire.
- Niveau de detail obligatoire: minimum ${minLines} lignes.
- Decomposer clairement: preparation, fourniture, pose, finitions, nettoyage, frais.
- Toujours separer la main d'oeuvre et les fournitures sur des lignes distinctes.
- Donner des libelles explicites et techniques (pas de libelle generique).
- Eviter les libelles vagues de type "prestation principale" sauf dernier recours.
- ${detailDirective}

Format JSON attendu:
{
  "title": "string",
  "scope": "string",
  "laborHours": number,
  "marginRate": number,
  "lines": [
    {
      "code": "string optionnel",
      "subCategory": "string optionnel",
      "label": "string",
      "quantity": number,
      "unit": "m2|ml|kg|heure|forfait|u",
      "category": "materiau|main_oeuvre|frais",
      "unitPrice": number,
      "vatRate": number
    }
  ]
}

Description chantier: "${input.description}"
Region: "${input.region}"
Metier detecte: "${input.research.trade}"
Niveau de detail: "${input.research.detailLevel}"
Confiance detection: ${input.research.confidence}
Hypotheses: "${assumptions}"
Base de recherche conseillee:
${suggested}
`;
}
