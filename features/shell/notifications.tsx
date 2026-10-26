"use client";

import { useEffect, useId, useRef, useState } from "react";
import { BellIcon } from "@/features/shell/icons";

export function Notifications() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    function onPointer(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (panelRef.current?.contains(target) || buttonRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        className="inline-flex size-10 items-center justify-center rounded-full border border-border text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
        aria-label="Notifications"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <BellIcon />
      </button>
      {open ? (
        <div
          ref={panelRef}
          id={panelId}
          role="region"
          aria-label="Notifications"
          className="absolute right-0 z-30 mt-2 w-64 rounded-xl border border-border bg-surface p-4"
        >
          <p className="text-base">No notifications yet.</p>
        </div>
      ) : null}
    </div>
  );
}
