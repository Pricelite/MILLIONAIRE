import { GeneratedQuote } from "@/lib/pricing/types";

export function renderQuoteHtml(input: {
  companyName: string;
  companyEmail: string;
  clientName: string;
  quoteNumber: string;
  quote: GeneratedQuote;
}) {
  const lines = input.quote.lines
    .map(
      (line) => `
      <tr>
        <td>${line.label}</td>
        <td>${line.quantity}</td>
        <td>${line.unit}</td>
        <td>${line.unitPrice.toFixed(2)} EUR</td>
        <td>${line.total.toFixed(2)} EUR</td>
      </tr>`
    )
    .join("");

  return `
  <html>
    <body style="font-family: Arial, sans-serif; color:#0a2540;">
      <h1>Devis ${input.quoteNumber}</h1>
      <p>${input.companyName} - ${input.companyEmail}</p>
      <p>Client: ${input.clientName}</p>
      <h3>${input.quote.title}</h3>
      <p>${input.quote.scope}</p>
      <table width="100%" border="1" cellspacing="0" cellpadding="6">
        <thead>
          <tr><th>Poste</th><th>Qt</th><th>Unite</th><th>PU</th><th>Total</th></tr>
        </thead>
        <tbody>${lines}</tbody>
      </table>
      <h2>Total TTC: ${input.quote.totalInclTax.toFixed(2)} EUR</h2>
      <p>TVA: ${input.quote.totalVat.toFixed(2)} EUR</p>
    </body>
  </html>`;
}

