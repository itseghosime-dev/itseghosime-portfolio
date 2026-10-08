"use client";

import { WifiOff, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function ConnectivityStatus() {
  const [isOffline, setIsOffline] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showRestored, setShowRestored] = useState(false);
  const wasOffline = useRef(false);

  useEffect(() => {
    const updateStatus = () => {
      const offline = !navigator.onLine;

      if (!offline && wasOffline.current) {
        setShowRestored(true);
        window.setTimeout(() => setShowRestored(false), 4000);
      }

      if (offline) {
        setIsDismissed(false);
      }

      wasOffline.current = offline;
      setIsOffline(offline);
    };

    updateStatus();
    window.addEventListener("offline", updateStatus);
    window.addEventListener("online", updateStatus);

    return () => {
      window.removeEventListener("offline", updateStatus);
      window.removeEventListener("online", updateStatus);
    };
  }, []);

  return (
    <>
      {isOffline && !isDismissed ? (
        <div
          className="fixed inset-x-0 top-0 z-[110] flex min-h-11 items-center justify-between gap-5 border-b border-white/10 bg-ink px-4 py-2.5 text-white shadow-lg sm:px-6"
          role="status"
        >
          <p className="flex items-center gap-3 text-xs leading-5 sm:text-sm">
            <WifiOff aria-hidden="true" className="shrink-0 text-[#f2c866]" size={16} />
            <span>
              You’re offline. The current page remains available, but new routes,
              live previews and message delivery need a connection.
            </span>
          </p>
          <button
            aria-label="Dismiss offline notice"
            className="grid size-9 shrink-0 place-items-center text-white/65 transition-colors hover:text-white"
            onClick={() => setIsDismissed(true)}
            type="button"
          >
            <X aria-hidden="true" size={16} />
          </button>
        </div>
      ) : null}

      {showRestored ? (
        <div
          aria-live="polite"
          className="pointer-events-none fixed right-4 top-4 z-[120] flex translate-y-0 items-center gap-3 border border-black/15 bg-surface px-4 py-3 text-sm opacity-100 shadow-[0_18px_45px_-20px_rgba(22,23,25,0.45)] sm:right-6"
          role="status"
        >
          <span aria-hidden="true" className="size-2 rounded-full bg-[#198754]" />
          <span className="font-medium">Connection restored.</span>
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.08em] text-ink-muted">
            200 OK
          </span>
        </div>
      ) : null}
    </>
  );
}
