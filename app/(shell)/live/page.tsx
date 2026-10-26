import type { Metadata } from "next";
import { LiveBoard } from "@/features/live/live-board";

export const metadata: Metadata = { title: "Live" };

export default function LivePage() {
  return <LiveBoard />;
}
