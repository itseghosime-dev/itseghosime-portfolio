"use client";

import { useState } from "react";

import type { AboutProfileModel } from "@/types/about";
import type { HomePageModel } from "@/types/home";

import { RecruiterBriefDrawer } from "@/components/contact/recruiter-brief-drawer";

import { AboutHero } from "./about-hero";
import { AboutMotion } from "./about-motion";
import { AboutNarrative } from "./about-narrative";
import { DevelopmentSection } from "./development-section";
import { FocusSection } from "./focus-section";
import { MilestoneSection } from "./milestone-section";
import { PrinciplesSection } from "./principles-section";
import { TechnologySection } from "./technology-section";

type AboutProfileProps = {
  dossier: AboutProfileModel;
  page: HomePageModel;
};

export function AboutProfile({ dossier, page }: AboutProfileProps) {
  const [isBriefOpen, setIsBriefOpen] = useState(false);

  return (
    <>
      <AboutMotion>
        <AboutHero
          hero={dossier.hero}
          onOpenBrief={() => setIsBriefOpen(true)}
          resume={page.contact.resume}
        />
        <AboutNarrative story={dossier.story} />
        <FocusSection focus={dossier.focus} />
        <TechnologySection
          groups={dossier.tools.groups}
          heading={dossier.tools.heading}
          label={dossier.tools.label}
        />
        <MilestoneSection
          eyebrow={dossier.experience.label}
          milestones={dossier.experience.milestones}
          title={dossier.experience.heading}
        />
        <DevelopmentSection
          education={dossier.development.education}
          educationHeading={dossier.development.educationHeading}
          learning={dossier.development.learning}
          learningHeading={dossier.development.learningHeading}
        />
        <PrinciplesSection
          contact={page.contact}
          cta={dossier.cta}
          principles={dossier.principles}
        />
      </AboutMotion>

      <RecruiterBriefDrawer
        capabilities={page.capabilities}
        email={page.contact.email}
        hero={page.hero}
        isOpen={isBriefOpen}
        onClose={() => setIsBriefOpen(false)}
        resume={page.contact.resume}
        technologies={page.technologies}
      />
    </>
  );
}
