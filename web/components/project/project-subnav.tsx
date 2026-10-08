import Link from "next/link";

import type { ProjectSection } from "@/types/project";

const sectionLabels: Partial<Record<ProjectSection["_type"], string>> = {
  codeShowcaseSection: "Code",
  contributionGridSection: "Build",
  interactiveSandboxSection: "Experience",
  mediaShowcaseSection: "Interface",
  narrativeSection: "Story",
  outcomesSection: "Results",
  processSection: "Process",
};

function sectionId(section: ProjectSection, index: number) {
  return `${section._type.replace(/Section$/, "").replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}-${index}`;
}

export function ProjectSubnav({ sections }: { sections: ProjectSection[] }) {
  const links = sections.flatMap((section, index) => {
    const label =
      section._type === "narrativeSection" && section.eyebrow
        ? section.eyebrow
        : sectionLabels[section._type];
    return label
      ? [{ href: `#${sectionId(section, index)}`, key: section._key, label }]
      : [];
  });

  if (links.length === 0) return null;

  return (
    <nav
      aria-label="Case study sections"
      className="sticky top-20 z-40 border-b border-black/[0.06] bg-background/92 opacity-100 backdrop-blur-md transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] data-[sandbox-active=true]:pointer-events-none data-[sandbox-active=true]:-translate-y-[210%] data-[sandbox-active=true]:opacity-0 motion-reduce:transition-none"
      data-project-subnav
    >
      <div className="mx-auto flex max-w-[77.5rem] gap-5 overflow-x-auto px-6 py-3 [scrollbar-width:none] md:px-12">
        <Link
          className="shrink-0 font-mono text-xs uppercase tracking-[0.08em] text-ink-muted no-underline transition-colors hover:text-ink data-[active=true]:text-accent"
          data-active="true"
          href="#project-overview"
        >
          Overview
        </Link>
        {links.map((link) => (
          <Link
            className="shrink-0 font-mono text-xs uppercase tracking-[0.08em] text-ink-muted no-underline transition-colors hover:text-accent data-[active=true]:text-accent"
            href={link.href}
            key={link.key}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export { sectionId };
