/** Format an RWF amount with thousands separators, no decimals. */
export function rwf(amount: number): string {
  return new Intl.NumberFormat("en-RW", {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export function rwfLabel(amount: number): string {
  return `${rwf(amount)} RWF`;
}

export function usd(amount: number | null | undefined): string | null {
  if (amount == null) return null;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Human, sortable order number: STR-YYMMDD-XXXX */
export function generateOrderNumber(): string {
  const d = new Date();
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `STR-${yy}${mm}${dd}-${rand}`;
}
