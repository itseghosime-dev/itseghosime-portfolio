'use client'

import gsap from 'gsap'
import {useEffect} from 'react'

function formatLocalDateTime() {
  const now = new Date()
  const locale = navigator.language
  const date = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    weekday: 'short',
  })
    .format(now)
    .replaceAll(',', '')
    .toUpperCase()
  const time = new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    hourCycle: 'h23',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  })
    .format(now)
    .toUpperCase()

  return {
    dateTime: now.toISOString(),
    label: `${date} · ${time}`,
  }
}

export function HomeMotion() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const heroSurface = document.querySelector<HTMLElement>('[data-hero-surface]')
    const pointerGlow = document.querySelector<HTMLElement>('[data-hero-pointer-glow]')
    const impactRing = document.querySelector<HTMLElement>('[data-hero-impact-ring]')
    const cursorTime = document.querySelector<HTMLElement>('[data-hero-cursor-time]')
    const cursorTimeValue = document.querySelector<HTMLTimeElement>(
      '[data-hero-cursor-time-value]',
    )
    const moveGlowX = pointerGlow
      ? gsap.quickTo(pointerGlow, 'x', {duration: 0.38, ease: 'power3.out'})
      : undefined
    const moveGlowY = pointerGlow
      ? gsap.quickTo(pointerGlow, 'y', {duration: 0.38, ease: 'power3.out'})
      : undefined
    const moveTimeX = cursorTime
      ? gsap.quickTo(cursorTime, 'x', {duration: 0.24, ease: 'power3.out'})
      : undefined
    const moveTimeY = cursorTime
      ? gsap.quickTo(cursorTime, 'y', {duration: 0.24, ease: 'power3.out'})
      : undefined

    const updateCursorTime = () => {
      if (!cursorTimeValue) {
        return
      }

      const localDateTime = formatLocalDateTime()
      cursorTimeValue.dateTime = localDateTime.dateTime
      cursorTimeValue.textContent = localDateTime.label
    }

    const positionEffect = (event: PointerEvent) => {
      if (!heroSurface || !pointerGlow) {
        return
      }

      const bounds = heroSurface.getBoundingClientRect()
      const x = event.clientX - bounds.left
      const y = event.clientY - bounds.top

      const timeWidth = cursorTime?.offsetWidth ?? 0
      const timeHeight = cursorTime?.offsetHeight ?? 0
      const timeGap = 28
      const timeEdge = 16
      const timeX =
        x + timeGap + timeWidth <= bounds.width - timeEdge
          ? x + timeGap
          : Math.max(timeEdge, x - timeWidth - timeGap)
      const timeY =
        y - timeHeight - timeGap >= timeEdge
          ? y - timeHeight - timeGap
          : Math.min(bounds.height - timeHeight - timeEdge, y + timeGap)

      moveGlowX?.(x)
      moveGlowY?.(y)
      moveTimeX?.(timeX)
      moveTimeY?.(timeY)

      if (impactRing) {
        gsap.set(impactRing, {x, y})
      }
    }

    const pulseImpact = (strength = 1) => {
      if (!pointerGlow || !impactRing) {
        return
      }

      gsap.fromTo(
        impactRing,
        {opacity: 0.68 * strength, scale: 0.22},
        {duration: 1.05, ease: 'power3.out', opacity: 0, scale: 1.9 + strength * 0.2},
      )
      gsap.fromTo(
        pointerGlow,
        {opacity: 0.9, scale: 0.74},
        {duration: 0.82, ease: 'elastic.out(1, 0.45)', opacity: 0.72, scale: 1},
      )
    }

    const handlePointerEnter = (event: PointerEvent) => {
      if (event.pointerType === 'touch') {
        return
      }

      positionEffect(event)
      updateCursorTime()
      pulseImpact()
      if (cursorTime) {
        gsap.to(cursorTime, {duration: 0.2, opacity: 1, overwrite: 'auto'})
      }
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') {
        return
      }

      positionEffect(event)
      if (pointerGlow) {
        gsap.to(pointerGlow, {duration: 0.15, opacity: 0.66, overwrite: 'auto'})
      }
      if (cursorTime) {
        gsap.to(cursorTime, {duration: 0.12, opacity: 1, overwrite: 'auto'})
      }
    }

    const handlePointerDown = (event: PointerEvent) => {
      positionEffect(event)
      pulseImpact(1.25)

      if (event.pointerType === 'touch' && 'vibrate' in navigator) {
        navigator.vibrate(12)
      }
    }

    const handlePointerLeave = () => {
      if (!pointerGlow) {
        return
      }

      gsap.to(pointerGlow, {duration: 0.7, ease: 'power2.out', opacity: 0})
      if (cursorTime) {
        gsap.to(cursorTime, {duration: 0.2, opacity: 0, overwrite: 'auto'})
      }
    }

    const context = gsap.context(() => {
      const heroTitle = document.querySelector<HTMLElement>('#hero-title')
      const secondaryHeroItems = document.querySelectorAll(
        '[data-hero-reveal]:not(#hero-title)',
      )

      if (heroTitle) {
        gsap.fromTo(
          heroTitle,
          { y: 14 },
          {
            duration: 0.68,
            ease: 'power3.out',
            y: 0,
          },
        )
      }

      gsap.fromTo(
        secondaryHeroItems,
        { opacity: 0, y: 14 },
        {
          delay: 0.06,
          duration: 0.62,
          ease: 'power3.out',
          opacity: 1,
          stagger: 0.08,
          y: 0,
        },
      )

      gsap.to('[data-hero-orb]', {
        duration: 5.8,
        ease: 'sine.inOut',
        repeat: -1,
        scale: (index) => 1.04 + index * 0.025,
        stagger: 0.55,
        x: (index) => (index % 2 === 0 ? 34 : -26),
        y: (index) => (index % 2 === 0 ? -24 : 30),
        yoyo: true,
      })

    })

    let cancelled = false
    let scrollContext: gsap.Context | undefined
    let idleId: number | undefined

    const initializeScrollMotion = async () => {
      if (cancelled || scrollContext) return

      const {ScrollTrigger} = await import('gsap/ScrollTrigger')
      if (cancelled || scrollContext) return

      gsap.registerPlugin(ScrollTrigger)
      scrollContext = gsap.context(() => {
        const heroContent = document.querySelector<HTMLElement>('[data-hero-content]')
        if (heroSurface && heroContent) {
          gsap.to(heroContent, {
            ease: 'none',
            opacity: 0.28,
            scrollTrigger: {
              end: 'bottom 22%',
              scrub: 0.55,
              start: 'top top',
              trigger: heroSurface,
            },
            y: -72,
          })
        }

        const revealItems = Array.from(
          document.querySelectorAll<HTMLElement>('[data-reveal]'),
        )
        revealItems.forEach((item, index) => {
          const variant = index % 3
          const from =
            variant === 0
              ? {clipPath: 'inset(0 0 14% 0)', opacity: 0, y: 52}
              : variant === 1
                ? {clipPath: 'inset(0 8% 0 0)', opacity: 0, x: -38}
                : {opacity: 0, scale: 0.965, y: 28}

          gsap.fromTo(item, from, {
            clearProps: 'clipPath,opacity,transform',
            clipPath: 'inset(0 0 0% 0)',
            duration: 0.95,
            ease: 'power3.out',
            opacity: 1,
            scale: 1,
            scrollTrigger: {
              once: true,
              start: 'top 86%',
              trigger: item,
            },
            x: 0,
            y: 0,
          })
        })

        ScrollTrigger.refresh()
      })
    }

    const initializeFromIntent = () => void initializeScrollMotion()
    const delayId = window.setTimeout(() => {
      if ('requestIdleCallback' in window) {
        idleId = window.requestIdleCallback(
          () => void initializeScrollMotion(),
          {timeout: 1_200},
        )
      } else {
        void initializeScrollMotion()
      }
    }, 600)

    window.addEventListener('wheel', initializeFromIntent, {once: true, passive: true})
    window.addEventListener('pointermove', initializeFromIntent, {
      once: true,
      passive: true,
    })
    window.addEventListener('touchstart', initializeFromIntent, {
      once: true,
      passive: true,
    })
    window.addEventListener('focusin', initializeFromIntent, {once: true})
    window.addEventListener('keydown', initializeFromIntent, {once: true})

    updateCursorTime()
    const timeInterval = window.setInterval(updateCursorTime, 1_000)

    heroSurface?.addEventListener('pointerenter', handlePointerEnter, {passive: true})
    heroSurface?.addEventListener('pointermove', handlePointerMove, {passive: true})
    heroSurface?.addEventListener('pointerdown', handlePointerDown, {passive: true})
    heroSurface?.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      cancelled = true
      window.clearTimeout(delayId)
      if (idleId !== undefined && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId)
      }
      window.removeEventListener('wheel', initializeFromIntent)
      window.removeEventListener('pointermove', initializeFromIntent)
      window.removeEventListener('touchstart', initializeFromIntent)
      window.removeEventListener('focusin', initializeFromIntent)
      window.removeEventListener('keydown', initializeFromIntent)
      window.clearInterval(timeInterval)
      heroSurface?.removeEventListener('pointerenter', handlePointerEnter)
      heroSurface?.removeEventListener('pointermove', handlePointerMove)
      heroSurface?.removeEventListener('pointerdown', handlePointerDown)
      heroSurface?.removeEventListener('pointerleave', handlePointerLeave)
      scrollContext?.revert()
      context.revert()
    }
  }, [])

  return null
}
