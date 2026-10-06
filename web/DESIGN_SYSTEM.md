# Editorial Ivory design system

This application uses the Editorial Ivory visual system supplied for the portfolio.

## Foundations

- Display type: Newsreader, loaded and self-hosted through `next/font`.
- Interface and body type: Hanken Grotesk, loaded and self-hosted through `next/font`.
- Canvas: warm ivory (`#f5f4ef`).
- Primary ink: deep charcoal (`#161719`).
- Accent: restrained cobalt (`#4169e1`).
- Secondary copy: slate (`#6c727a`).
- Maximum page width: 1320px.
- Maximum reading width: 720px.

The canonical tokens and responsive type utilities live in `app/globals.css`. Components must use
those semantic tokens instead of introducing one-off hex colors or spacing values.

## Component rules

- Use `Container` for the shared responsive page boundary.
- Use `ButtonLink` for navigation rendered as a button. The supported variants are `primary`,
  `secondary`, `accent`, and `ghost`.
- Use `StatusBadge` for short status information, not as decoration.
- Use `BrandMark` with no title when adjacent text already names the brand. Supply a title only when
  the mark stands alone.
- Prefer semantic HTML before adding ARIA. Interactive controls must remain keyboard-operable.

## Responsive rules

- Mobile: 20px page margins and a single content column.
- Tablet: 32px page margins and an eight-column layout where needed.
- Desktop: 48px page margins and a twelve-column layout where needed.
- Use the provided fluid heading utilities; do not reduce body copy below 15px to force content to
  fit.
- Media must define intrinsic dimensions and meaningful alternative text.

## Motion rules

Motion should explain hierarchy or provide feedback. Keep transitions short, avoid scroll-jacking,
and ensure every animation has a useful static state. The global reduced-motion rule removes
non-essential animation when the visitor requests it.
