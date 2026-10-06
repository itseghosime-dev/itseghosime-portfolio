# Studio branding assets

The source SVG files are:

- `studio-mark.svg` — square workspace mark displayed inside Sanity Studio.
- `favicon.svg` — source browser-tab icon automatically detected by Sanity.

Keep both filenames unchanged so the Studio configuration continues to work. Use square SVGs with
a `viewBox`; avoid embedded scripts, remote images, text that depends on local fonts, and private
metadata.

The generated browser and mobile variants are `favicon.ico`, `favicon-96.png`, `favicon-192.png`,
`favicon-512.png`, and `apple-touch-icon.png`. Regenerate them whenever `favicon.svg` changes.
