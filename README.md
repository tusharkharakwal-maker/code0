# Codies

A responsive creative-agency website built with React, TypeScript, the Next.js App Router API on Vinext, Tailwind CSS, GSAP/ScrollTrigger, Lenis, and Radix accessibility primitives.

## Local development

```sh
npm install
npm run dev
```

```sh
npx tsc --noEmit
npm run build
```

## Content

- All 11 requested services are in `app/studio.tsx`, grouped into Development, Creative & Design, and Marketing & SEO.
- The original user-supplied SVG logo and favicon are in `public/`.
- Original generated imagery is compressed as WebP and lazy-loaded below the fold.
- Forma and Orbit Audio are explicitly marked independent portfolio concepts, not client commissions.
- The motion study is an original animated typographic sequence, not a video reel.
- Enquiries prepare a `mailto:` draft for `tusharkharakwal@gmail.com`. The visitor sends it from their own email app. The site does not store or automatically send personal information.

## Motion and accessibility

Reduced-motion preferences disable the intro, smooth scrolling, parallax, and continuous animations. Portfolio overlays supplement the normal system cursor. Radix supplies focus trapping, Escape handling, and keyboard interaction for dialogs and accordions. The marquee has a pause control.

## Editing

Main content and interactive sections: `app/studio.tsx`.
Animation lifecycle: `app/motion-experience.tsx`.
Theme and responsive layout: `app/globals.css`.
Page metadata: `app/layout.tsx`.
Hosting identity: `.openai/hosting.json`.
