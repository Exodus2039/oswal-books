import type { ReactNode } from "react";
import type { SportId } from "@/features/feed/types";

export const sportEdge: Record<SportId, string> = {
  cricket: "border-l-sport-cricket",
};

export function Card({
  sport,
  children,
  className = "",
}: {
  sport?: SportId;
  children: ReactNode;
  className?: string;
}) {
  const edge = sport ? `border-l-2 ${sportEdge[sport]}` : "";
  return (
    <section
      className={`rounded-xl border border-border bg-surface p-4 ${edge} ${className}`}
    >
      {children}
    </section>
  );
}
