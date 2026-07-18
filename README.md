# Refraction Studies — aethrex

Personal portfolio built as one optical experiment: **the page is the prism**.
A white beam drops from the top of the viewport and strikes the wordmark; five
spectral rays exit it and run down the page as a luminous spine. Each section is
a wavelength band (700 → 410 nm) — its ray peels off, sweeps behind that
section's glass cards, rejoins the bundle, and at the footer all five recombine
into one white line pointing at the contact CTA. Heavy liquid-glass surfaces
throughout — a nod to *The Dark Side of the Moon*.

## Stack

- **React 19 + Vite** — component-driven, fast HMR
- **Framer Motion** — entrance reveals, scroll progress
- **Lucide** — icons
- Design system in `src/index.css` (spectrum tokens, glass panels, wavelength bands)

## Structure

| Section | Band | Component |
|---|---|---|
| Hero (dispersion) | white | `Hero` — the wordmark is the prism |
| Work | λ 700 nm | `Work` |
| Projects | λ 590 nm | `Projects` |
| Leadership | λ 530 nm | `Leadership` |
| Education + Awards | λ 470 / 410 nm | `Education` + `ResonanceCurve` |
| Ethos (recombination) | white | `Manifesto` |
| Light engine | full spectrum | `LightSpine` — full-page SVG beam, rays, recombination |

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the build
```

## Notes

- `LightSpine` measures the live DOM (wordmark, card grids, footer CTA) and
  redraws on resize; ray reveal follows scroll via a CSS mask (`--lit`).
- The Extended Essay card renders an actual RLC resonance curve (the essay's subject).
- Glass panels track the cursor for a specular highlight (`src/lib/useGlass.js`).
- Fully responsive; `prefers-reduced-motion` is respected (all entrances resolve
  to their end state, the busiest layers switch off).
