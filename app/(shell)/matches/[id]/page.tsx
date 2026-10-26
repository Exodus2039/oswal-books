import type { Metadata } from "next";
import { Suspense } from "react";
import { LiveListSkeleton } from "@/features/live/live-board";
import { MatchScreen } from "@/features/match/match-screen";

export const metadata: Metadata = { title: "Match" };

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

async function MatchIdentity({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    market?: string | string[];
    selection?: string | string[];
    panel?: string | string[];
  }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  return (
    <MatchScreen
      id={id}
      marketValue={first(query.market)}
      selectionId={first(query.selection)}
      crashPanel={first(query.panel) === "crash"}
    />
  );
}

export default function MatchPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    market?: string | string[];
    selection?: string | string[];
    panel?: string | string[];
  }>;
}) {
  return (
    <Suspense fallback={<LiveListSkeleton />}>
      <MatchIdentity params={params} searchParams={searchParams} />
    </Suspense>
  );
}
