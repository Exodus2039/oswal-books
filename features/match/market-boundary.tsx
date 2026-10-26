"use client";

import Link from "next/link";
import { Component, type ReactNode } from "react";
import { catalogs, fill } from "@/features/i18n/catalog";
import { readLocale } from "@/features/i18n/locale";

type Props = { children: ReactNode; retryHref: string };
type State = { failed: boolean };

export class MarketBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    const copy = catalogs[readLocale()];
    return (
      <div role="alert" className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4">
        <p className="text-base">{copy.marketFailed}</p>
        <p className="font-mono text-sm text-muted tabular-nums">
          {fill(copy.code, { code: "market/panel" })}
        </p>
        <Link
          href={this.props.retryHref}
          className="inline-flex min-h-12 w-fit items-center rounded-xl bg-action px-4 font-semibold text-action-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
        >
          {copy.tryAgain}
        </Link>
      </div>
    );
  }
}
