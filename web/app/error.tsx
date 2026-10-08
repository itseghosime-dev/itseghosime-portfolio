"use client";

import { RouteErrorExperience } from "@/components/system/route-error-experience";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <RouteErrorExperience error={error} reset={reset} />;
}
