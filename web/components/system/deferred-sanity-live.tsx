"use client";

import { useEffect, useState } from "react";

type SanityLiveComponent = typeof import("@/sanity/lib/live")["SanityLive"];

export function DeferredSanityLive() {
  const [liveModule, setLiveModule] = useState<{
    Component: SanityLiveComponent;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    let delayId: number | undefined;
    let idleId: number | undefined;

    const loadLiveUpdates = () => {
      delayId = window.setTimeout(() => {
        const initialize = () => {
          void import("@/sanity/lib/live").then(({ SanityLive }) => {
            if (cancelled) return;

            setLiveModule({ Component: SanityLive });
          });
        };

        if ("requestIdleCallback" in window) {
          idleId = window.requestIdleCallback(initialize, { timeout: 1_500 });
        } else {
          setTimeout(initialize, 0);
        }
      }, 3_000);
    };

    if (document.readyState === "complete") {
      loadLiveUpdates();
    } else {
      window.addEventListener("load", loadLiveUpdates, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("load", loadLiveUpdates);
      if (delayId !== undefined) window.clearTimeout(delayId);
      if (idleId !== undefined && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
    };
  }, []);

  const SanityLive = liveModule?.Component;
  return SanityLive ? <SanityLive includeDrafts={false} /> : null;
}
