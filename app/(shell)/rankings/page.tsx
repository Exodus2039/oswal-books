import type { Metadata } from "next";
import { RouteScreen } from "@/features/shell/route-screen";
import { ButtonLink } from "@/shared/ui/button";

export const metadata: Metadata = { title: "Rankings" };

export default function RankingsPage() {
  return (
    <RouteScreen routeId="rankings">
      <ButtonLink href="/profile" variant="quiet">
        Back to profile
      </ButtonLink>
    </RouteScreen>
  );
}
