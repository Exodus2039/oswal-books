"use client";

import { formatCredits, formatWhen } from "@/features/feed/format";
import { fill, LOCALES, teamLabel } from "@/features/i18n/catalog";
import { setLocale, useCatalog, useLocale } from "@/features/i18n/locale";
import {
  receiptsServerSnapshot,
  receiptsSnapshot,
  subscribeReceipts,
} from "@/features/match/receipts";
import { Card } from "@/shared/ui/card";
import { useSyncExternalStore } from "react";

export function ProfilePanel() {
  const locale = useLocale();
  const copy = useCatalog();
  const receipts = useSyncExternalStore(
    subscribeReceipts,
    receiptsSnapshot,
    receiptsServerSnapshot,
  );

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <h2 className="text-lg font-semibold">{copy.language}</h2>
        <div className="mt-3 flex gap-2">
          {LOCALES.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={locale === item}
              onClick={() => setLocale(item)}
              className={`inline-flex min-h-12 min-w-16 items-center justify-center rounded-xl px-4 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action ${
                locale === item
                  ? "bg-action text-action-foreground"
                  : "border border-border bg-background"
              }`}
            >
              {item === "en" ? "EN" : "HI"}
            </button>
          ))}
        </div>
      </Card>
      <Card>
        <h2 className="text-lg font-semibold">{copy.history}</h2>
        {receipts.length === 0 ? (
          <p className="mt-1 text-base text-muted">{copy.historyEmpty}</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-3">
            {receipts.map((receipt) => (
              <li key={receipt.id} className="text-base">
                <p className="break-words font-semibold">
                  {copy[receipt.marketId]} · {teamLabel(locale, receipt.selectionId, receipt.selectionId)}
                </p>
                <p className="font-mono text-sm tabular-nums text-muted">
                  {fill(copy.creditsLocked, {
                    credits: formatCredits(receipt.creditsLocked),
                    fee: formatCredits(receipt.feeCredits),
                  })}
                </p>
                <p className="font-mono text-sm tabular-nums text-muted">
                  <time dateTime={new Date(receipt.createdAt).toISOString()}>
                    {formatWhen(receipt.createdAt)}
                  </time>
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>
      <Card>
        <h2 className="text-lg font-semibold">{copy.responsible}</h2>
        <p className="mt-2 text-base">{copy.ageGate}</p>
        <h3 className="mt-4 text-base font-semibold">{copy.limits}</h3>
        <p className="mt-1 text-base text-muted">{copy.limitsBody}</p>
        <h3 className="mt-4 text-base font-semibold">{copy.selfExclude}</h3>
        <p className="mt-1 text-base text-muted">{copy.selfExcludeBody}</p>
      </Card>
    </div>
  );
}
