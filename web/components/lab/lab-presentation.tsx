import Image from "next/image";
import { FlaskConical } from "lucide-react";
import type { ReactNode } from "react";

import type {
  LabExperimentModel,
  LabPresentation as LabPresentationName,
} from "@/types/lab";

import { AutonomousMicroFormSandbox } from "./sandboxes/autonomous-micro-form-sandbox";
import { KineticTypographySandbox } from "./sandboxes/kinetic-typography-sandbox";
import { MagneticNavigationSandbox } from "./sandboxes/magnetic-navigation-sandbox";
import { SpatialDepthSandbox } from "./sandboxes/spatial-depth-sandbox";
import { SpringCarouselSandbox } from "./sandboxes/spring-carousel-sandbox";
import { StreamingDataCanvasSandbox } from "./sandboxes/streaming-data-sandbox";

type LabPresentationProps = {
  compact?: boolean;
  experiment: LabExperimentModel;
};

const presentations: Record<
  Exclude<LabPresentationName, "none">,
  () => ReactNode
> = {
  spatialDepth: () => <SpatialDepthSandbox />,
  magneticNavigation: () => <MagneticNavigationSandbox />,
  kineticTypography: () => <KineticTypographySandbox />,
  autonomousMicroForm: () => <AutonomousMicroFormSandbox />,
  streamingData: () => <StreamingDataCanvasSandbox />,
  springCarousel: () => <SpringCarouselSandbox />,
};

export function LabPresentation({
  compact = false,
  experiment,
}: LabPresentationProps) {
  const minimumHeight = compact
    ? "min-h-52 sm:min-h-56"
    : "min-h-64 sm:min-h-72";

  if (experiment.presentation !== "none")
    return presentations[experiment.presentation]();

  if (experiment.coverImage) {
    return (
      <div
        className={`relative overflow-hidden bg-surface-layer ${minimumHeight}`}
      >
        <Image
          alt={experiment.coverImage.alt}
          blurDataURL={experiment.coverImage.blurDataUrl}
          className="object-cover"
          fill
          placeholder={experiment.coverImage.blurDataUrl ? "blur" : "empty"}
          sizes="(max-width: 768px) 100vw, 50vw"
          src={experiment.coverImage.url}
        />
      </div>
    );
  }

  return (
    <div
      className={`grid place-items-center border border-black/[0.08] bg-[linear-gradient(135deg,rgba(65,105,225,0.07),transparent_55%),var(--surface)] px-8 text-center ${minimumHeight}`}
    >
      <div className="max-w-xs space-y-4">
        <FlaskConical
          aria-hidden="true"
          className="mx-auto text-accent"
          size={26}
          strokeWidth={1.4}
        />
        <p className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-ink-muted">
          {experiment.status === "Planned"
            ? "Prototype in development"
            : "Documentation in progress"}
        </p>
      </div>
    </div>
  );
}
