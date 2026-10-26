/** A hidden tab must not keep a live subscription. */
export function feedListens(visibility: "visible" | "hidden" | string): boolean {
  return visibility !== "hidden";
}
