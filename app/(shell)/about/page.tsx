import type { Metadata } from "next";
import { RouteScreen } from "@/features/shell/route-screen";
import { ButtonLink } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Chip } from "@/shared/ui/chip";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <RouteScreen routeId="about">
      <p className="max-w-2xl text-base">
        Live cricket, simple predictions, and a record of every call you make.
      </p>
      <div id="whatsapp">
        <ButtonLink href="#whatsapp" variant="mark">
          Continue with WhatsApp
        </ButtonLink>
        <p className="mt-2 text-base text-muted">
          This is the only sign-in path. The WhatsApp number is not connected yet.
        </p>
      </div>
      <Card sport="cricket">
        <h2 className="text-lg font-semibold">Sample card</h2>
        <p className="mt-1 text-base text-muted">
          Flat surface, one border, a 2px cricket edge.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Chip>0 credits</Chip>
          <Chip>० क्रेडिट · महाराष्ट्र</Chip>
          <Chip tone="you">You</Chip>
        </div>
      </Card>
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center">
        <p className="min-w-0 flex-1 text-base">
          भारत · 64% · शुल्क 0 · पुष्टि करें
        </p>
        <ButtonLink href="#whatsapp" className="w-full sm:w-auto">
          पुष्टि करें
        </ButtonLink>
      </div>
    </RouteScreen>
  );
}
