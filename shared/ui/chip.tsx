import type { ReactNode } from "react";

export function Chip({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "you";
}) {
  const toneClass =
    tone === "you"
      ? "border-you text-you"
      : "border-border text-foreground";
  return (
    <span
      className={`inline-flex h-10 max-w-full items-center rounded-full border bg-surface px-3 text-sm tabular-nums ${toneClass}`}
    >
      {children}
    </span>
  );
}
