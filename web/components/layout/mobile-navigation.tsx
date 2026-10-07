"use client";

import gsap from "gsap";
import {ArrowRight, ArrowUpRight, Menu, X} from "lucide-react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useRef, useState } from "react";

import type { NavigationItem } from "@/types/home";

import { BrandMark } from "@/components/ui/brand-mark";

type MobileNavigationProps = {
  navigation: NavigationItem[];
  siteName: string;
};

export function MobileNavigation({
  navigation,
  siteName,
}: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const isClosingRef = useRef(false);

  const closeMenu = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay || isClosingRef.current) {
      return;
    }

    isClosingRef.current = true;
    const shouldReduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (shouldReduceMotion) {
      setIsOpen(false);
      isClosingRef.current = false;
      triggerRef.current?.focus();
      return;
    }

    gsap
      .timeline({
        onComplete: () => {
          setIsOpen(false);
          isClosingRef.current = false;
          triggerRef.current?.focus();
        },
      })
      .to(overlay.querySelectorAll("[data-menu-item]"), {
        duration: 0.18,
        ease: "power2.in",
        opacity: 0,
        stagger: 0.02,
        y: -10,
      })
      .to(
        overlay,
        { autoAlpha: 0, duration: 0.28, ease: "power2.inOut" },
        "<0.03",
      );
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const overlay = overlayRef.current;
    if (!overlay) {
      return;
    }
    const currentOverlay = overlay;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    isClosingRef.current = false;

    const shouldReduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const context = gsap.context(() => {
      if (shouldReduceMotion) {
        gsap.set(currentOverlay, { autoAlpha: 1 });
        return;
      }

      gsap.fromTo(
        currentOverlay,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.32, ease: "power2.out" },
      );
      gsap.fromTo(
        currentOverlay.querySelectorAll("[data-menu-item]"),
        { opacity: 0, y: 24 },
        {
          delay: 0.08,
          duration: 0.42,
          ease: "power3.out",
          opacity: 1,
          stagger: 0.055,
          y: 0,
        },
      );
    }, currentOverlay);

    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusable = Array.from(
        currentOverlay.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled])",
        ),
      );
      const first = focusable.at(0);
      const last = focusable.at(-1);

      if (!first || !last) {
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    function handleDesktopResize() {
      if (window.matchMedia("(min-width: 768px)").matches) {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleDesktopResize);

    return () => {
      context.revert();
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleDesktopResize);
    };
  }, [closeMenu, isOpen]);

  const menu = isOpen ? (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[999] flex min-h-dvh flex-col overflow-y-auto bg-background px-6 py-5 md:hidden"
      id="mobile-navigation"
      role="dialog"
      aria-label="Mobile navigation"
      aria-modal="true"
    >
      <div className="flex h-14 items-center justify-between border-b border-black/[0.08] pb-5">
        <div
          className="inline-flex items-center gap-3 font-bold tracking-[-0.02em]"
          data-menu-item
        >
          <BrandMark className="w-[1.125rem]" />
          <span>{siteName}</span>
        </div>
        <button
          ref={closeButtonRef}
          className="relative grid size-11 cursor-pointer place-content-center bg-transparent"
          type="button"
          aria-label="Close navigation menu"
          onClick={closeMenu}
        >
          <X aria-hidden="true" size={22} strokeWidth={1.6} />
        </button>
      </div>

      <nav
        className="flex flex-1 items-center py-10"
        aria-label="Mobile navigation"
      >
        <ol className="m-0 grid w-full list-none p-0">
          {navigation.map((item, index) => {
            const isExternal = item.href.startsWith("http");

            return (
              <li
                className="border-b border-black/[0.08]"
                key={`${item.label}-${item.href}`}
              >
                <a
                  className="group grid min-h-20 grid-cols-[2rem_1fr_auto] items-center gap-3 no-underline"
                  data-menu-item
                  href={item.href}
                  rel={isExternal ? "noreferrer" : undefined}
                  target={isExternal ? "_blank" : undefined}
                  onClick={closeMenu}
                >
                  <span className="text-xs font-semibold tracking-[0.06em] text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-serif text-4xl leading-none tracking-tight">
                    {item.label}
                  </span>
                  {isExternal ? (
                    <ArrowUpRight aria-hidden="true" className="text-ink-muted" size={20} strokeWidth={1.5} />
                  ) : (
                    <ArrowRight aria-hidden="true" className="text-ink-muted" size={20} strokeWidth={1.5} />
                  )}
                </a>
              </li>
            );
          })}
        </ol>
      </nav>

      <div
        className="grid gap-3 border-t border-black/[0.08] pt-5"
        data-menu-item
      >
        <p className="label-sm text-accent">Open to software roles.</p>
        <Link
          className="min-h-11 text-sm font-semibold"
          href="/contact"
          onClick={closeMenu}
        >
          <span className="inline-flex items-center gap-2">
            Start a conversation
            <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.7} />
          </span>
        </Link>
      </div>
    </div>
  ) : null;

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
        className="grid size-11 cursor-pointer place-content-center gap-1.5 bg-transparent"
        type="button"
        aria-controls="mobile-navigation"
        aria-expanded={isOpen}
        aria-label="Open navigation menu"
        onClick={() => setIsOpen(true)}
      >
        <Menu aria-hidden="true" size={21} strokeWidth={1.7} />
      </button>
      {typeof document === "undefined"
        ? null
        : createPortal(menu, document.body)}
    </div>
  );
}
