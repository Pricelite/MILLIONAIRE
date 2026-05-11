export function currency(value: number, locale = "fr-FR", code = "EUR"): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency: code }).format(value);
}

export function percent(value: number): string {
  return `${value.toFixed(2)}%`;
}
