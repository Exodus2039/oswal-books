import type { Metadata } from "next";
import { RouteScreen } from "@/features/shell/route-screen";

export const metadata: Metadata = { title: "P2P" };

export default function P2pPage() {
  return <RouteScreen routeId="p2p" />;
}
