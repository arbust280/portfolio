# dinu

Personal portfolio built as one optical experiment: **the page is the prism**.
A white beam drops from the top of the viewport and strikes a real-time glass
prism floating over the wordmark; five spectral rays exit it and run down the
page as a luminous spine. Each section is a wavelength band (700 → 410 nm) — its
ray peels off, and at the footer all five recombine into one white line pointing
at the contact CTA. A nod to *The Dark Side of the Moon*.

## Stack

- **React 19 + Vite** — component-driven, fast HMR
- **Raw WebGL** — the hero prism is a single hand-written fragment shader
- **Self-hosted Archivo + IBM Plex Mono** via Fontsource — no third-party font request
- Design system in `src/index.css` (spectrum tokens, glass panels, wavelength bands)

No animation library, no 3D library, no icon package: entrance and reveal motion
is CSS driven by one shared `IntersectionObserver`, and the four icons in use are
inlined as SVG.

## Structure

| Section | Band | Component |
|---|---|---|
| Hero (dispersion) | white | `Hero` + `Prism` — WebGL refraction |
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

- **The prism** (`src/lib/prism-gl.js`) traces a ray through a triangular prism
  with a wavelength-dependent index of refraction, tinting each of 14 spectral
  samples with the same five band colours the page uses — so the spectrum leaving
  the prism is the spectrum running down the page. Geometry is an analytic
  convex-polyhedron intersection, not a raymarch. Falls back to a CSS prism when
  WebGL is unavailable or the context is lost, and renders a single still frame
  under `prefers-reduced-motion`.
- **`LightSpine`** measures the live DOM (prism, section grids, footer CTA) and
  redraws only when the document changes — never on scroll or pointer move.
  Pointer tilt is a compositor-only transform; each ray ignites via
  `IntersectionObserver` when its own section arrives. Rays only sweep *behind*
  sections that have glass panels to refract them (`sweep: 'glass'`); cardless
  sections get a bow in the margin, because a ray crossing bare body copy reads
  as a scratch.
- **Glass is deliberately scarce** — three surfaces (nav, project cards, footer).
  Everything else is type on void, which is both cheaper and what makes the glass
  read as glass.
- The Extended Essay block renders an actual RLC resonance curve (the essay's
  subject), drawn on scroll with a normalised `pathLength`.
- `prefers-reduced-motion` is respected throughout; content is never hidden
  behind JS — the reveal's hidden state is scoped to a class set only when
  `IntersectionObserver` exists.
- Project repo links render only when a real URL exists, so no "Code" affordance
  ever dead-ends on a bare profile. Add `repo`/`image` in `src/components/Projects.jsx`.
