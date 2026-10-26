import type { Metadata } from "next";
import { HomeIntro } from "@/features/home/home-intro";
import { LiveBoard } from "@/features/live/live-board";

export const metadata: Metadata = { title: "Home" };

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <HomeIntro />
      <LiveBoard pinLast heading="h2" />
    </div>
  );
}
