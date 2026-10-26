"use client";

import { useEffect } from "react";
import { fill } from "@/features/i18n/catalog";
import { useCatalog } from "@/features/i18n/locale";
import { Button } from "@/shared/ui/button";

export function RouteError({
  error,
  retry,
  feature,
}: {
  error: unknown;
  retry: () => void;
  feature: string;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const copy = useCatalog();
  const digest =
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof error.digest === "string"
      ? error.digest
      : null;

  return (
    <div role="alert" className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">
        {copy.screenFailed}
      </h1>
      <p className="text-base text-muted">{copy.screenFailedBody}</p>
      <p className="font-mono text-sm text-muted tabular-nums">
        {fill(copy.code, { code: digest ? `${feature} · ${digest}` : feature })}
      </p>
      <div>
        <Button type="button" onClick={() => retry()}>
          {copy.tryAgain}
        </Button>
      </div>
    </div>
  );
}
