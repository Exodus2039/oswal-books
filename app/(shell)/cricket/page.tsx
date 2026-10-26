import type { Metadata } from "next";
import { SERIES_IDS, SERIES_LABEL, type SeriesId } from "@/features/feed/types";
import { RouteScreen } from "@/features/shell/route-screen";
import { Card } from "@/shared/ui/card";

export const metadata: Metadata = { title: "Cricket" };

const SERIES_NOTE: Record<SeriesId, string> = {
  t20i: "Internationals",
  ipl: "Men's league",
  wpl: "Women's league",
  ranji: "First-class",
};

export default function CricketPage() {
  return (
    <RouteScreen routeId="cricket">
      <ul className="flex flex-col gap-3">
        {SERIES_IDS.map((series) => (
          <li key={series}>
            <Card sport="cricket">
              <h2 className="text-lg font-semibold">{SERIES_LABEL[series]}</h2>
              <p className="mt-1 text-base text-muted">{SERIES_NOTE[series]}</p>
            </Card>
          </li>
        ))}
      </ul>
    </RouteScreen>
  );
}
