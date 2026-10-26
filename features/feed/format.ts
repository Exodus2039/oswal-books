const credits = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
const when = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatCredits(value: number): string {
  if (!Number.isFinite(value)) return "--";
  return credits.format(value);
}

export function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return "--";
  return `${Math.round(value)}%`;
}

export function formatWhen(epochMs: number): string {
  if (!Number.isFinite(epochMs)) return "--";
  return when.format(epochMs);
}
