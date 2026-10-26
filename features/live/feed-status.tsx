"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/features/analytics/get-analytics";
import type { FeedSnapshot } from "@/features/feed/types";
import { fill } from "@/features/i18n/catalog";
import { useCatalog } from "@/features/i18n/locale";
import { Button } from "@/shared/ui/button";

export function FeedStatus({
  snapshot,
  onRetry,
}: {
  snapshot: FeedSnapshot;
  onRetry: () => void;
}) {
  const copy = useCatalog();
  const [now, setNow] = useState(0);
  const staleSent = useRef(false);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const drifted =
    snapshot.updatedAt > 0 && now > snapshot.updatedAt ? now - snapshot.updatedAt : 0;
  const age = snapshot.ageMs + drifted;
  const delayed = snapshot.mode !== "live" || age >= 3000;
  const seconds = Math.max(0, Math.floor(age / 1000));

  useEffect(() => {
    if (!delayed || staleSent.current) return;
    staleSent.current = true;
    track({ name: "feed_stale", ageMs: age });
  }, [delayed, age]);

  return (
    <div className="flex flex-col gap-3">
      {delayed ? (
        <p className="text-base text-muted" role="status">
          {fill(copy.scoreDelayed, { seconds })}
        </p>
      ) : null}
      {snapshot.mode === "error" ? (
        <div role="alert" className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4">
          <p className="text-base">{copy.feedDown}</p>
          <p className="font-mono text-sm text-muted tabular-nums">
            {fill(copy.code, { code: snapshot.errorCode ?? "feed/unavailable" })}
          </p>
          <div>
            <Button type="button" onClick={onRetry}>
              {copy.retry}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
